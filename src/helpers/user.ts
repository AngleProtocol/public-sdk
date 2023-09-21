import { BigNumber, BigNumberish } from 'ethers';

import { gwei, multByPow, piecewiseFunction } from '../utils/bignumber';
import { computeBonusMalusBurn, computeBonusMalusMint } from './feeManager';
import { computeHedgeRatio } from './spread';

/**
 * Internal Computes the current fees to be taken when minting using `amount` of collateral
 * Fees depend on HA hedge that is the proportion of collateral from users (`stocksUsers`) that is covered by HAs
 * The more is covered by HAs, the smaller fees are expected to be
 * Fees are also corrected by the `bonusMalusMint` parameter which induces a dependence in collateral ratio
 *
 * @param chainId - chainId of the network targeted
 * @param stableSymbol - Symbol of the stablecoin targeted
 * @param collateralSymbol - Symbol of the collateral targeted
 * @param amount - Amount of stable asset burnt
 * @param inDecimals - Decimals of the collateral token. Can be fetched the `ERC20` contract
 * (10**18 for wETH, 10**6 for USDC, ...)
 * @param rate - Exchange rate from collateral to stablecoin fiat (if `1 wETH = 2000 EUR`, then `rate = 2000 * Base`)
 * The rate should be the minimum between chainlink and Uniswap path
 * @param totalHedgeAmount - Collateral covered by HAs
 * @param stocksUsers - Protocol owned collateral from mint and burn interactions
 * @param collatRatio - Current block collateral ratio for the stablecoin of interest
 * @param targetHAHedge - Porportion of collateral that can be covered by HAs. This parameter depends on
 * the pair (stablecoin,collateral)
 * @param _xFeeMint - Thresholds values of hedge level for minting
 * @param _yFeeMint - Values in the array below should normally be increasing: the lower the `x` the cheaper it should
 * be for stable seekers to come in as a low `x` corresponds to a high demand for volatility and hence
 * to a situation where all the collateral can be covered
 * @param base - The base used in Angle Protocol for precision (default should normally not be changed)
 *
 * @returns amountForUserInStable Stablecoins given in exchange of the given `amount` of collateral
 * @returns mintingFee Fees taken on the transactions (in collateral)
 * @returns percentageFee Percentage fees taken
 * @returns hedgeRatio Hedge ratio taking into account the current tx
 */
export function computeMint(
  chainID: number,
  stableSymbol: string,
  collateralSymbol: string,
  amount: BigNumberish,
  inDecimals: BigNumberish,
  rate: BigNumberish,
  totalHedgeAmount: BigNumberish,
  stocksUsers: BigNumberish,
  collatRatio: BigNumberish,
  // eslint-disable-next-line
  targetHAHedge: BigNumberish = BigNumber.from(0),
  // eslint-disable-next-line
  xFeeMint: BigNumberish[] = [BigNumber.from(0)],
  // eslint-disable-next-line
  yFeeMint: BigNumberish[] = [BigNumber.from(0)],
  base: BigNumberish = gwei(1)
): { amountForUserInStable: BigNumber; mintingFee: BigNumber; percentageFee: BigNumber; hedgeRatio: BigNumber } {
  amount = BigNumber.from(amount);
  base = BigNumber.from(base);
  inDecimals = BigNumber.from(inDecimals);
  const collatBase = multByPow(1, inDecimals);

  // Getting a quote for the amount of stablecoins to issue
  // We read the lowest oracle value we get for this collateral/stablecoin pair to reduce front running risk
  // Decimals are handled directly in the oracle contract
  let amountForUserInStable = amount.mul(rate).div(collatBase);

  const { percentageFee, hedgeRatio } = computeFeeMint(
    chainID,
    stableSymbol,
    collateralSymbol,
    amountForUserInStable,
    totalHedgeAmount,
    stocksUsers,
    collatRatio,
    targetHAHedge,
    xFeeMint,
    yFeeMint,
    base
  );

  // Computing the net amount that will be taken into account for this user
  amountForUserInStable = amountForUserInStable.mul(base.sub(percentageFee)).div(base);

  // For this require to fail, you need very specific conditions on `BASE_PARAMS`
  if (amountForUserInStable.lte(BigNumber.from(0))) {
    throw new Error('Invalid amount');
  }
  const mintingFee = amount.mul(percentageFee).div(base);

  return { amountForUserInStable, mintingFee, percentageFee, hedgeRatio };
}

/**
 * Internal Computes the amount of collateral needed to get a specific amount of stablecoins
 *
 * @param chainId - chainId of the network targeted
 * @param stableSymbol - Symbol of the stablecoin targeted
 * @param collateralSymbol - Symbol of the collateral targeted
 * @param amount - Amount of stablecoins wanted
 * @param inDecimals - Decimals of the collateral token. Can be fetched the `ERC20` contract
 * (10**18 for wETH, 10**6 for USDC, ...)
 * @param rate - Exchange rate from collateral to stablecoin fiat (if `1 wETH = 2000 EUR`, then `rate = 2000 * Base`)
 * The rate should be the minimum between chainlink and Uniswap path
 * @param totalHedgeAmount - Collateral covered by HAs
 * @param stocksUsers - Protocol owned collateral from mint and burn interactions
 * @param collatRatio - Current block collateral ratio for the stablecoin of interest
 * @param targetHAHedge - Porportion of collateral that can be covered by HAs. This parameter depends on
 * the pair (stablecoin,collateral)
 * @param _xFeeMint - Thresholds values of hedge level for minting
 * @param _yFeeMint - Values in the array below should normally be increasing: the lower the `x` the cheaper it should
 * be for stable seekers to come in as a low `x` corresponds to a high demand for volatility and hence
 * to a situation where all the collateral can be covered
 * @param base - The base used in Angle Protocol for precision (default should normally not be changed)
 * @param iterations - Number of iterations the solver will do
 *
 * @returns amountOfCollateralNeeded Collateral required to get `amount` stablecoins in exchange
 */
export function computeInverseMint(
  chainID: number,
  stableSymbol: string,
  collateralSymbol: string,
  amount: BigNumberish,
  inDecimals: BigNumberish,
  rate: BigNumberish,
  totalHedgeAmount: BigNumberish,
  stocksUsers: BigNumberish,
  collatRatio: BigNumberish,
  // eslint-disable-next-line
  targetHAHedge: BigNumberish = BigNumber.from(0),
  // eslint-disable-next-line
  xFeeMint: BigNumberish[] = [BigNumber.from(0)],
  // eslint-disable-next-line
  yFeeMint: BigNumberish[] = [BigNumber.from(0)],
  base: BigNumberish = gwei(1),
  iterations = 10
): { amountOfCollateralNeeded: BigNumber; mintingFee: BigNumber } {
  amount = BigNumber.from(amount);
  base = BigNumber.from(base);
  inDecimals = BigNumber.from(inDecimals);
  const collatBase = multByPow(1, inDecimals);

  const amountInC = amount.mul(collatBase).div(rate);
  let amountOfCollateralNeeded = amountInC;
  let percentageFee: BigNumberish = 0;
  for (let i = 0; i < iterations; i++) {
    const amountForUserInStable = amountOfCollateralNeeded.mul(rate).div(collatBase);
    const computedOutput = computeFeeMint(
      chainID,
      stableSymbol,
      collateralSymbol,
      amountForUserInStable,
      totalHedgeAmount,
      stocksUsers,
      collatRatio,
      targetHAHedge,
      xFeeMint,
      yFeeMint,
      base
    );

    percentageFee = computedOutput.percentageFee;
    amountOfCollateralNeeded = amount.mul(collatBase).mul(base).div(base.sub(percentageFee)).div(rate);
  }

  const mintingFee = amountOfCollateralNeeded.sub(amountInC);

  return { amountOfCollateralNeeded, mintingFee };
}

/**
 * Internal Computes the current fees to be taken when minting using `amount` of collateral
 * Fees depend on HA hedge that is the proportion of collateral from users (`stocksUsers`) that is covered by HAs
 * The more is covered by HAs, the smaller fees are expected to be
 * Fees are also corrected by the `bonusMalusMint` parameter which induces a dependence in collateral ratio
 *
 * @param chainId - chainId of the network targeted
 * @param stableSymbol - Symbol of the stablecoin targeted
 * @param collateralSymbol - Symbol of the collateral targeted
 * @param amount - Amount of stable asset burnt
 * @param inDecimals - Decimals of the collateral token. Can be fetched the `ERC20` contract
 * (10**18 for wETH, 10**6 for USDC, ...)
 * @param rate - Exchange rate from collateral to stablecoin fiat (if `1 wETH = 2000 EUR`, then `rate = 2000 * Base`)
 * @param totalHedgeAmount - Collateral covered by HAs
 * @param stocksUsers - Protocol owned collateral from mint and burn interactions
 * @param collatRatio - Current block collateral ratio for the stablecoin of interest
 * @param targetHAHedge - Porportion of collateral that can be covered by HAs. This parameter depends on
 * the pair (stablecoin,collateral)
 * @param base - The base used in Angle Protocol for precision (default should normally not be changed)
 * @param _xFeeBurn - Thresholds values of hedge level for burning
 * @param _yFeeBurn - Values in the array below should normally be decreasing: the higher the `x` the cheaper it should
 * be for stable seekers to go out, as a high `x` corresponds to low demand for volatility and hence
 * to a situation where the protocol has a hard time covering its collateral
 *
 * @returns returnAmount Collateral given in exchange of the burnt stablecoins
 * @returns burningFee Fees taken on the transactions (in collateral)
 * @returns percentageFee Percentage fees taken
 * @returns hedgeRatio Hedge ratio taking into account the current tx
 */
export function computeBurn(
  chainID: number,
  stableSymbol: string,
  collateralSymbol: string,
  amount: BigNumberish,
  inDecimals: BigNumberish,
  rate: BigNumberish,
  totalHedgeAmount: BigNumberish,
  stocksUsers: BigNumberish,
  collatRatio: BigNumberish,
  // eslint-disable-next-line
  targetHAHedge: BigNumberish = BigNumber.from(0),
  // eslint-disable-next-line
  xFeeBurn: BigNumberish[] = [BigNumber.from(0)],
  // eslint-disable-next-line
  yFeeBurn: BigNumberish[] = [BigNumber.from(0)],
  base: BigNumberish = gwei(1)
): { amountForUserInCollateral: BigNumber; burningFee: BigNumber; percentageFee: BigNumber; hedgeRatio: BigNumber } {
  amount = BigNumber.from(amount);
  base = BigNumber.from(base);
  rate = BigNumber.from(rate);
  inDecimals = BigNumber.from(inDecimals);

  const collatBase = multByPow(1, inDecimals);
  // Converting amount of agTokens in collateral and computing how much should be reimbursed to the user
  // Amount is in `BASE_TOKENS` and the outputted collateral amount should be in collateral base
  const amountInC = amount.mul(collatBase).div(rate);

  const { percentageFee, hedgeRatio } = computeFeeBurn(
    chainID,
    stableSymbol,
    collateralSymbol,
    amount,
    totalHedgeAmount,
    stocksUsers,
    collatRatio,
    targetHAHedge,
    xFeeBurn,
    yFeeBurn,
    base
  );

  // Computing how much of collateral can be redeemed by the user after taking fees
  // The real value is `amountInC * (base - fees) / base`, but we prefer to avoid doing multiplications
  // after divisions
  const amountForUserInCollateral = amount.mul(base.sub(percentageFee)).mul(collatBase).div(rate.mul(base));
  const burningFee = amountInC.sub(amountForUserInCollateral);
  return { amountForUserInCollateral, burningFee, percentageFee, hedgeRatio };
}

/**
 * Internal Computes the amount of stablecoins needed to get a specific amount of collateral when burning
 *
 * @param chainId - chainId of the network targeted
 * @param stableSymbol - Symbol of the stablecoin targeted
 * @param collateralSymbol - Symbol of the collateral targeted
 * @param amount - Amount of collateral wanted
 * @param inDecimals - Decimals of the collateral token. Can be fetched the `ERC20` contract
 * (10**18 for wETH, 10**6 for USDC, ...)
 * @param rate - Exchange rate from collateral to stablecoin fiat (if `1 wETH = 2000 EUR`, then `rate = 2000 * Base`)
 * The rate should be the minimum between chainlink and Uniswap path
 * @param totalHedgeAmount - Collateral covered by HAs
 * @param stocksUsers - Protocol owned collateral from mint and burn interactions
 * @param collatRatio - Current block collateral ratio for the stablecoin of interest
 * @param targetHAHedge - Porportion of collateral that can be covered by HAs. This parameter depends on
 * the pair (stablecoin,collateral)
 * @param _xFeeBurn - Thresholds values of hedge level for burning
 * @param _yFeeBurn - Values in the array below should normally be decreasing: the higher the `x` the cheaper it should
 * be for stable seekers to come in as a low `x` corresponds to a high demand for volatility and hence
 * to a situation where all the collateral can be covered
 * @param base - The base used in Angle Protocol for precision (default should normally not be changed)
 * @param iterations - Number of iterations the solver will do
 *
 * @returns amountOfCollateralNeeded Collateral required to get `amount` stablecoins in exchange
 */
export function computeInverseBurn(
  chainID: number,
  stableSymbol: string,
  collateralSymbol: string,
  amount: BigNumberish,
  inDecimals: BigNumberish,
  rate: BigNumberish,
  totalHedgeAmount: BigNumberish,
  stocksUsers: BigNumberish,
  collatRatio: BigNumberish,
  // eslint-disable-next-line
  targetHAHedge: BigNumberish = BigNumber.from(0),
  // eslint-disable-next-line
  xFeeBurn: BigNumberish[] = [BigNumber.from(0)],
  // eslint-disable-next-line
  yFeeBurn: BigNumberish[] = [BigNumber.from(0)],
  base: BigNumberish = gwei(1),
  iterations = 10
): { amountOfStablecoinNeeded: BigNumber; burningFee: BigNumber } {
  amount = BigNumber.from(amount);
  base = BigNumber.from(base);
  inDecimals = BigNumber.from(inDecimals);
  const collatBase = multByPow(1, inDecimals);

  let amountOfStablecoinNeeded = amount.mul(rate).div(collatBase);
  let percentageFee: BigNumberish = 0;
  for (let i = 0; i < iterations; i++) {
    const computedOutput = computeFeeBurn(
      chainID,
      stableSymbol,
      collateralSymbol,
      amountOfStablecoinNeeded,
      totalHedgeAmount,
      stocksUsers,
      collatRatio,
      targetHAHedge,
      xFeeBurn,
      yFeeBurn,
      base
    );

    percentageFee = computedOutput.percentageFee;
    amountOfStablecoinNeeded = amount.mul(rate).mul(base).div(base.sub(percentageFee)).div(collatBase);
  }

  const burningFee = amount.mul(percentageFee).div(base);

  return { amountOfStablecoinNeeded, burningFee };
}

/**
 * Internal Computes the current fees to be taken when minting using `amount` of collateral
 * Fees depend on HA hedge that is the proportion of collateral from users (`stocksUsers`) that is covered by HAs
 * The more is covered by HAs, the smaller fees are expected to be
 * Fees are also corrected by the `bonusMalusMint` parameter which induces a dependence in collateral ratio
 *
 * @param chainId - chainId of the network targeted
 * @param stableSymbol - Symbol of the stablecoin targeted
 * @param collateralSymbol - Symbol of the collateral targeted
 * @param amount - Amount of collateral in the transaction to get stablecoins
 * @param totalHedgeAmount - Collateral covered by HAs
 * @param stocksUsers - Protocol owned collateral from mint and burn interactions
 * @param collatRatio - Current block collateral ratio for the stablecoin of interest
 * @param targetHAHedge - Porportion of collateral that can be covered by HAs. This parameter depends on
 * the pair (stablecoin,collateral)
 * @param _xFeeMint - Thresholds values of hedge level for minting
 * @param _yFeeMint - Values in the array below should normally be increasing: the lower the `x` the cheaper it should
 * be for stable seekers to come in as a low `x` corresponds to a high demand for volatility and hence
 * to a situation where all the collateral can be covered
 * @param base - The base used in Angle Protocol for precision (default should normally not be changed)
 *
 * @returns feeMint Fee percentage taken to users
 * @returns hedgeRatio Hedge ratio taking into account the tx
 */
export function computeFeeMint(
  chainID: number,
  stableSymbol: string,
  collateralSymbol: string,
  amount: BigNumberish,
  totalHedgeAmount: BigNumberish,
  stocksUsers: BigNumberish,
  collatRatio: BigNumberish,
  // eslint-disable-next-line
  targetHAHedge: BigNumberish = BigNumber.from(0),
  // eslint-disable-next-line
  xFeeMint: BigNumberish[] = [BigNumber.from(0)],
  // eslint-disable-next-line
  yFeeMint: BigNumberish[] = [BigNumber.from(0)],
  base: BigNumberish = gwei(1)
): { percentageFee: BigNumber; hedgeRatio: BigNumber } {
  amount = BigNumber.from(amount);
  stocksUsers = BigNumber.from(stocksUsers);
  const xArrayFeeMint = xFeeMint.map((e) => BigNumber.from(e));
  const yArrayFeeMint = yFeeMint.map((e) => BigNumber.from(e));
  base = BigNumber.from(base);

  const bonusMalusMint = computeBonusMalusMint(chainID, stableSymbol, collateralSymbol, collatRatio);

  const hedgeRatio = computeHedgeRatio(totalHedgeAmount, targetHAHedge, amount.add(stocksUsers));
  // Computing the fees based on the spread
  const feeMint = piecewiseFunction(hedgeRatio, xArrayFeeMint, yArrayFeeMint);

  // Fees could in some occasions depend on other factors like collateral ratio
  // Keepers are the ones updating this part of the fees
  const percentageFee = feeMint.mul(bonusMalusMint).div(base);

  return { percentageFee, hedgeRatio };
}

/**
 * Internal Computes the current fees to be taken when burning stablecoins
 * The amount is obtained after the amount of agTokens sent is converted in collateral
 * Fees depend on HA hedge that is the proportion of collateral from users (`stocksUsers`) that is covered by HAs
 * The more is covered by HAs, the higher fees are expected to be
 * Fees are also corrected by the `bonusMalusBurn` parameter which induces a dependence in collateral ratio
 *
 * @param chainId - chainId of the network targeted
 * @param stableSymbol - Symbol of the stablecoin targeted
 * @param collateralSymbol - Symbol of the collateral targeted
 * @param amount - Amount of collateral in the transaction to get stablecoins
 * @param totalHedgeAmount - Collateral covered by HAs
 * @param stocksUsers - Protocol owned collateral from mint and burn interactions
 * @param collatRatio - Current block collateral ratio for the stablecoin of interest
 * @param targetHAHedge - Porportion of collateral that can be covered by HAs. This parameter depends on
 * the pair (stablecoin,collateral)
 * @param _xFeeBurn - Thresholds values of hedge level for burning
 * @param _yFeeBurn - Values in the array below should normally be decreasing: the higher the `x` the cheaper it should
 * be for stable seekers to go out, as a high `x` corresponds to low demand for volatility and hence
 * to a situation where the protocol has a hard time covering its collateral
 * @param base - The base used in Angle Protocol for precision (default should normally not be changed)
 *
 * @returns feeBurn Fee percentage taken to users
 * @returns hedgeRatio Hedge ratio taking into account the tx
 */
export function computeFeeBurn(
  chainID: number,
  stableSymbol: string,
  collateralSymbol: string,
  amount: BigNumberish,
  totalHedgeAmount: BigNumberish,
  stocksUsers: BigNumberish,
  collatRatio: BigNumberish,
  // eslint-disable-next-line
  targetHAHedge: BigNumberish = BigNumber.from(0),
  // eslint-disable-next-line
  xFeeBurn: BigNumberish[] = [BigNumber.from(0)],
  // eslint-disable-next-line
  yFeeBurn: BigNumberish[] = [BigNumber.from(0)],
  base: BigNumberish = gwei(1)
): { percentageFee: BigNumber; hedgeRatio: BigNumber } {
  amount = BigNumber.from(amount);
  stocksUsers = BigNumber.from(stocksUsers);
  const xArrayFeeBurn = xFeeBurn.map((e) => BigNumber.from(e));
  const yArrayFeeBurn = yFeeBurn.map((e) => BigNumber.from(e));
  base = BigNumber.from(base);

  const bonusMalusBurn = computeBonusMalusBurn(chainID, stableSymbol, collateralSymbol, collatRatio);

  if (!stocksUsers.gt(amount)) {
    throw new Error(`Not enough stocksUsers`);
  }

  const hedgeRatio = computeHedgeRatio(totalHedgeAmount, targetHAHedge, stocksUsers.sub(amount));

  // Computing the fees based on the spread
  const feeBurn = piecewiseFunction(hedgeRatio, xArrayFeeBurn, yArrayFeeBurn);
  // Fees could in some occasions depend on other factors like collateral ratio
  // Keepers are the ones updating this part of the fees
  const percentageFee = feeBurn.mul(bonusMalusBurn).div(base);

  return { percentageFee, hedgeRatio };
}

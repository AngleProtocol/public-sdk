import { BigNumber, BigNumberish } from 'ethers';

import constants from '../constants/index';
import { gwei, multByPow, piecewiseFunction } from '../utils/bignumber';

/**
 * Returns the bonus / malus mint fees depending on the collateral ratio
 * The ratio returned is scaled by `BASE_PARAMS` (like all ratios of the protocol)
 *
 * @param chainId - chainId of the network targeted
 * @param stableSymbol - Symbol of the stablecoin targeted
 * @param collateralSymbol - Symbol of the collateral targeted
 * @param collatRatio - Current block collateral ratio for the stablecoin of interest
 * @param _xBonusMalusMint - Thresholds values of bonus malus at minting
 * @param _yBonusMalusMint - Fee values
 *
 * @returns bonusMalusMint
 */
export function computeBonusMalusMint(
  chainID: number,
  stableSymbol: string,
  collateralSymbol: string,
  collatRatio: BigNumberish,
  // eslint-disable-next-line
  _xBonusMalusMint: BigNumberish[] = constants(chainID).poolsParameters![stableSymbol][collateralSymbol].xBonusMalusMint,
  // eslint-disable-next-line
  _yBonusMalusMint: BigNumberish[] = constants(chainID).poolsParameters![stableSymbol][collateralSymbol].yBonusMalusMint
): BigNumber {
  const xBonusMalusMint = _xBonusMalusMint.map((e) => BigNumber.from(e));
  const yBonusMalusMint = _yBonusMalusMint.map((e) => BigNumber.from(e));
  collatRatio = BigNumber.from(collatRatio);
  const bonusMalusMint: BigNumber = piecewiseFunction(collatRatio, xBonusMalusMint, yBonusMalusMint);
  return bonusMalusMint;
}

/**
 * Returns the bonus / malus burn fees depending on the collateral ratio
 * The ratio returned is scaled by `BASE_PARAMS` (like all ratios of the protocol)
 *
 * @param chainId - chainId of the network targeted
 * @param stableSymbol - Symbol of the stablecoin targeted
 * @param collateralSymbol - Symbol of the collateral targeted
 * @param collatRatio - Current block collateral ratio for the stablecoin of interest
 * @param _xBonusMalusBurn - Thresholds values of bonus malus at burning
 * @param _yBonusMalusBurn - Fee values
 *
 * @returns bonusMalusBurn
 */
export function computeBonusMalusBurn(
  chainID: number,
  stableSymbol: string,
  collateralSymbol: string,
  collatRatio: BigNumberish,
  // eslint-disable-next-line
  _xBonusMalusBurn: BigNumberish[] = constants(chainID).poolsParameters![stableSymbol][collateralSymbol].xBonusMalusBurn,
  // eslint-disable-next-line
  _yBonusMalusBurn: BigNumberish[] = constants(chainID).poolsParameters![stableSymbol][collateralSymbol].yBonusMalusBurn
): BigNumber {
  const xBonusMalusBurn = _xBonusMalusBurn.map((e) => BigNumber.from(e));
  const yBonusMalusBurn = _yBonusMalusBurn.map((e) => BigNumber.from(e));
  collatRatio = BigNumber.from(collatRatio);
  const bonusMalusBurn = piecewiseFunction(collatRatio, xBonusMalusBurn, yBonusMalusBurn);
  return bonusMalusBurn;
}

/**
 * Return slippage incurred by SLPs, depending on the collateral ratio
 * amountInProtocol / collatBase / rates / should all be of same length
 * These arrays should be in same order of collateral
 * The ratio returned is scaled by `BASE_PARAMS` (like all ratios of the protocol)
 *
 * @param chainId - chainId of the network targeted
 * @param stableSymbol - Symbol of the stablecoin targeted
 * @param collateralSymbol - Symbol of the collateral targeted
 * @param agTokensMinted -Stablecoins minted currently.
 * @param amountInProtocol - Array of protocol owned collateral
 * @param inDecimals - Decimals of collaterals token. Can be fetched the `ERC20` contract
 * (10**18 for wETH, 10**6 for USDC, ...)
 * @param rates - Rates for each collateral to the fiat. These should all be in `BASE_TOKENS`
 * @param _xSlippage - Thresholds values for slippage. SLPs incur slippage if protocol at risks
 * @param _ySlippage - Fee values
 * @param base - Base used in Angle Protocol for precision (default should normally not be changed)
 *
 * @returns slippage
 */
export function computeSlippage(
  chainID: number,
  stableSymbol: string,
  collateralSymbol: string,
  agTokensMinted: BigNumber,
  amountInProtocol: BigNumber[],
  inDecimals: BigNumberish[],
  rates: BigNumber[],
  // eslint-disable-next-line
  _xSlippage: BigNumberish[] = constants(chainID).poolsParameters![stableSymbol][collateralSymbol].xSlippage,
  // eslint-disable-next-line
  _ySlippage: BigNumberish[] = constants(chainID).poolsParameters![stableSymbol][collateralSymbol].ySlippage,
  base = gwei(1)
): BigNumber {
  const xSlippage = _xSlippage.map((e) => BigNumber.from(e));
  const ySlippage = _ySlippage.map((e) => BigNumber.from(e));
  const collatRatio = computeCollateralRatio(agTokensMinted, amountInProtocol, inDecimals, rates, base);
  const slippage: BigNumber = piecewiseFunction(collatRatio, xSlippage, ySlippage);
  return slippage;
}

/**
 * Return slippageFee incurred by SLPs, depending on the collateral ratio. i.e the proportion
 * of fees and lending gains not given to SLPs
 * amountInProtocol / collatBase / rates / should all be of same length
 * These arrays should be in same order of collateral
 * The ratio returned is scaled by `BASE_PARAMS` (like all ratios of the protocol)
 *
 * @param chainId - chainId of the network targeted
 * @param stableSymbol - Symbol of the stablecoin targeted
 * @param collateralSymbol - Symbol of the collateral targeted
 * @param agTokensMinted -Stablecoins minted currently.
 * @param amountInProtocol - Array of protocol owned collateral
 * @param inDecimals - Decimals of collaterals token. Can be fetched the `ERC20` contract
 * (10**18 for wETH, 10**6 for USDC, ...)
 * @param rates - Rates for each collateral to the fiat. These should all be in `BASE_TOKENS`
 * @param _xSlippageFee - Thresholds values for slippage fee. When drop in collateral ratio part
 *  of the fees are locked until collateral ratio is back at a higher level (known in advance)
 * @param _ySlippageFee - Fee values
 * @param base - Base used in Angle Protocol for precision (default should normally not be changed)
 *
 * @returns slippageFee
 */
export function computeSlippageFee(
  chainID: number,
  stableSymbol: string,
  collateralSymbol: string,
  agTokensMinted: BigNumber,
  amountInProtocol: BigNumber[],
  inDecimals: BigNumberish[],
  rates: BigNumber[],
  // eslint-disable-next-line
  _xSlippageFee: BigNumberish[] = constants(chainID).poolsParameters![stableSymbol][collateralSymbol].xSlippageFee,
  // eslint-disable-next-line
  _ySlippageFee: BigNumberish[] = constants(chainID).poolsParameters![stableSymbol][collateralSymbol].ySlippageFee,
  base = gwei(1)
): BigNumber {
  const xSlippageFee = _xSlippageFee.map((e) => BigNumber.from(e));
  const ySlippageFee = _ySlippageFee.map((e) => BigNumber.from(e));
  const collatRatio = computeCollateralRatio(agTokensMinted, amountInProtocol, inDecimals, rates, base);
  const slippageFee = piecewiseFunction(collatRatio, xSlippageFee, ySlippageFee);
  return slippageFee;
}

/**
 * Return the collateral ratio for the stablecoin of interests
 * amountInProtocol / collatBase / rates / should all be of same length
 * These arrays should be in same order of collateral
 * The ratio returned is scaled by `BASE_PARAMS` (like all ratios of the protocol)
 *
 * @param agTokensMinted -Stablecoins minted currently.
 * @param amountInProtocol - Array of protocol owned collateral
 * @param inDecimals - Decimals of collaterals token. Can be fetched the `ERC20` contract
 * (10**18 for wETH, 10**6 for USDC, ...)
 * @param rates - Rates for each collateral to the fiat. These should all be in `BASE_TOKENS`
 * @param base - Base used in Angle Protocol for precision (default should normally not be changed)
 *
 * @returns collatRatio
 */
export function computeCollateralRatio(
  agTokensMinted: BigNumberish,
  _amountInProtocol: BigNumberish[],
  inDecimals: BigNumberish[],
  rates: BigNumberish[],
  base: BigNumberish = gwei(1)
): BigNumber {
  agTokensMinted = BigNumber.from(agTokensMinted);
  const amountInProtocol = _amountInProtocol.map((e) => BigNumber.from(e));
  const collatBase = inDecimals.map((e) => multByPow(1, e));
  rates = rates.map((e) => BigNumber.from(e));
  base = BigNumber.from(base);
  const ZERO = BigNumber.from(0);

  let collatRatio = ZERO;
  if (agTokensMinted.lte(ZERO)) {
    // If nothing has been minted, the collateral ratio is infinity
    collatRatio = BigNumber.from('10000').mul(base);
    return collatRatio;
  }

  let val = ZERO;

  for (let i = 0; i < amountInProtocol.length; i++) {
    // Oracle needs to be called for each collateral to compute the collateral ratio
    val = val.add(amountInProtocol[i].mul(rates[i]).div(collatBase[i]));
  }
  collatRatio = val.mul(base).div(agTokensMinted);
  return collatRatio;
}

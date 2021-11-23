import { BigNumber, BigNumberish } from 'ethers';

import constants from '../constants';
import { ether, gwei, multByPow, piecewiseFunction } from '../utils/bignumber';
import { computeHedgeRatio } from './spread';

/**
 * Computes the position size of a perpetual from
 * a defined margin and leverage
 *
 * @param chainId - chainId of the network targeted
 * @param stableSymbol - Symbol of the stablecoin targeted
 * @param collateralSymbol - Symbol of the collateral targeted
 * @param margin - Margin wanted (including fees)
 * @param leverage - Leverage wanted (after fees)
 * @param inDecimals - Decimals of the collateral token. Can be fetched the `ERC20` contract
 * @param totalCoveredAmount - Current insured amount. Can be fetched from `PerpetualManager`
 * @param stocksUsers - Collateral brought by users. Can be fetched from `StableMaster`
 * @param rate - Upper oracle exchange rate (as it ois the one used in the solidity at creation)
 * @param targetHAHedge - Max ratio to insure. Can be fetched from `PerpetualManager`
 * @param base - The base used in Angle Protocol for precision (default should normally not be changed)
 * The following parameters have default value that should be up to date if you have the last sdk version.
 * However there is no guarantee it has not been changed by governance.
 * @param haBonusMalusDeposit - Fee modifier. Can be fetched from `PerpetualManager`
 * @param _xHAFeesDeposit - Linear fee function. Can be fetched from `PerpetualManager`
 * @param _yHAFeesDeposit - Linear fee function. Can be fetched from `PerpetualManager`
 *
 * @returns `percentageFee` - Percentage of fee paid
 * @returns `fees`-  Fees paid
 * @returns `positionSize`- The amount that should be put as position size to get the aimed margin and leverage
 */
export function computeOpenPerpetualFromMarginLeverage(
  chainID: number,
  stableSymbol: string,
  collateralSymbol: string,
  margin: BigNumberish,
  leverage: BigNumberish,
  inDecimals: number,
  totalCoveredAmount: BigNumberish,
  stocksUsers: BigNumberish,
  rate: BigNumberish = 0,
  targetHAHedge: BigNumberish = constants(chainID).poolsParameters[stableSymbol][collateralSymbol].targetHAHedge,
  haBonusMalusDeposit: BigNumberish = constants(chainID).poolsParameters[stableSymbol][collateralSymbol].haBonusMalusDeposit,
  _xHAFeesDeposit: BigNumberish[] = constants(chainID).poolsParameters[stableSymbol][collateralSymbol].xHAFeesDeposit,
  _yHAFeesDeposit: BigNumberish[] = constants(chainID).poolsParameters[stableSymbol][collateralSymbol].yHAFeesDeposit,
  iterations = 10
): {
  percentageFee: BigNumber;
  fees: BigNumber;
  positionSize: BigNumber;
} {
  margin = BigNumber.from(margin);
  leverage = BigNumber.from(leverage);
  totalCoveredAmount = BigNumber.from(totalCoveredAmount);
  targetHAHedge = BigNumber.from(targetHAHedge);
  const xHAFeesDeposit = _xHAFeesDeposit.map((e) => BigNumber.from(e));
  const yHAFeesDeposit = _yHAFeesDeposit.map((e) => BigNumber.from(e));
  haBonusMalusDeposit = BigNumber.from(haBonusMalusDeposit);
  stocksUsers = BigNumber.from(stocksUsers);
  rate = BigNumber.from(rate);

  const inBase = multByPow(1, inDecimals);

  let netMargin = margin;
  let positionSize = leverage.mul(netMargin).div(constants(chainID).BASE_TOKENS).sub(netMargin);
  let percentageFee = BigNumber.from(0);
  let fees = BigNumber.from(0);
  for (let i = 0; i < iterations; i++) {
    const hedgeRatio = computeHedgeRatio(totalCoveredAmount.add(positionSize.mul(rate).div(inBase)), targetHAHedge, stocksUsers);
    percentageFee = haBonusMalusDeposit.mul(piecewiseFunction(hedgeRatio, xHAFeesDeposit, yHAFeesDeposit)).div(gwei(1));

    fees = positionSize.mul(percentageFee).div(gwei(1));
    netMargin = margin.sub(fees);
    positionSize = leverage.mul(netMargin).div(constants(chainID).BASE_TOKENS).sub(netMargin);
  }

  return {
    percentageFee,
    fees,
    positionSize,
  };
}

/**
 * Computes the margin of a perpetual from
 * a defined leverage and position size
 *
 * @param chainId - chainId of the network targeted
 * @param stableSymbol - Symbol of the stablecoin targeted
 * @param collateralSymbol - Symbol of the collateral targeted
 * @param leverage - Leverage wanted (after fees)
 * @param positionSize - Amount that the perpetual will insure
 * @param inDecimals - Decimals of the collateral token. Can be fetched the `ERC20` contract
 * @param totalCoveredAmount - Current insured amount. Can be fetched from `PerpetualManager`
 * @param stocksUsers - Collateral brought by users. Can be fetched from `StableMaster`
 * @param rate - Upper oracle exchange rate (as it ois the one used in the solidity at creation)
 * @param targetHAHedge - Max ratio to insure. Can be fetched from `PerpetualManager`
 * @param base - The base used in Angle Protocol for precision (default should normally not be changed)
 * The following parameters have default value that should be up to date if you have the last sdk version.
 * However there is no guarantee it has not been changed by governance.
 * @param haBonusMalusDeposit - Fee modifier. Can be fetched from `PerpetualManager`
 * @param _xHAFeesDeposit - Linear fee function. Can be fetched from `PerpetualManager`
 * @param _yHAFeesDeposit - Linear fee function. Can be fetched from `PerpetualManager`
 *
 * @returns `percentageFee` - Percentage of fee paid
 * @returns `fees`-  Fees paid
 * @returns `margin`- The amount that should be put as margin to get the aimed leverage and position size
 */
export function computeOpenPerpetualLeveragePosition(
  chainID: number,
  stableSymbol: string,
  collateralSymbol: string,
  leverage: BigNumberish,
  positionSize: BigNumberish,
  inDecimals: number,
  totalCoveredAmount: BigNumberish,
  stocksUsers: BigNumberish,
  rate: BigNumberish = 0,
  targetHAHedge: BigNumberish = constants(chainID).poolsParameters[stableSymbol][collateralSymbol].targetHAHedge,
  haBonusMalusDeposit: BigNumberish = constants(chainID).poolsParameters[stableSymbol][collateralSymbol].haBonusMalusDeposit,
  _xHAFeesDeposit: BigNumberish[] = constants(chainID).poolsParameters[stableSymbol][collateralSymbol].xHAFeesDeposit,
  _yHAFeesDeposit: BigNumberish[] = constants(chainID).poolsParameters[stableSymbol][collateralSymbol].yHAFeesDeposit
): {
  percentageFee: BigNumber;
  fees: BigNumber;
  margin: BigNumber;
} {
  leverage = BigNumber.from(leverage);
  positionSize = BigNumber.from(positionSize);
  totalCoveredAmount = BigNumber.from(totalCoveredAmount);
  targetHAHedge = BigNumber.from(targetHAHedge);
  const xHAFeesDeposit = _xHAFeesDeposit.map((e) => BigNumber.from(e));
  const yHAFeesDeposit = _yHAFeesDeposit.map((e) => BigNumber.from(e));
  haBonusMalusDeposit = BigNumber.from(haBonusMalusDeposit);
  stocksUsers = BigNumber.from(stocksUsers);
  rate = BigNumber.from(rate);

  const inBase = multByPow(1, inDecimals);

  const netMargin = positionSize.mul(constants(chainID).BASE_TOKENS).div(leverage.sub(constants(chainID).BASE_TOKENS));
  const hedgeRatio = computeHedgeRatio(totalCoveredAmount.add(positionSize.mul(rate).div(inBase)), targetHAHedge, stocksUsers);

  const percentageFee = haBonusMalusDeposit.mul(piecewiseFunction(hedgeRatio, xHAFeesDeposit, yHAFeesDeposit)).div(gwei(1));
  const fees = positionSize.sub(positionSize.mul(constants(chainID).BASE_PARAMS.sub(percentageFee)).div(constants(chainID).BASE_PARAMS));
  const margin = netMargin.add(fees);

  return {
    percentageFee,
    fees,
    margin,
  };
}

/**
 * Computes the leverage of a perpetual from
 * a defined margin and position size
 *
 * @param chainId - chainId of the network targeted
 * @param stableSymbol - Symbol of the stablecoin targeted
 * @param collateralSymbol - Symbol of the collateral targeted
 * @param margin - Margin wanted (including fees)
 * @param positionSize - Amount that the perpetual will insure
 * @param inDecimals - Decimals of the collateral token. Can be fetched the `ERC20` contract
 * @param totalCoveredAmount - Current insured amount. Can be fetched from `PerpetualManager`
 * @param stocksUsers - Collateral brought by users. Can be fetched from `StableMaster`
 * @param rate - Upper oracle exchange rate (as it ois the one used in the solidity at creation)
 * @param targetHAHedge - Max ratio to insure. Can be fetched from `PerpetualManager`
 * @param base - The base used in Angle Protocol for precision (default should normally not be changed)
 * The following parameters have default value that should be up to date if you have the last sdk version.
 * However there is no guarantee it has not been changed by governance.
 * @param haBonusMalusDeposit - Fee modifier. Can be fetched from `PerpetualManager`
 * @param _xHAFeesDeposit - Linear fee function. Can be fetched from `PerpetualManager`
 * @param _yHAFeesDeposit - Linear fee function. Can be fetched from `PerpetualManager`
 *
 * @returns `percentageFee` - Percentage of fee paid
 * @returns `fees`-  Fees paid
 * @returns `leverage`- The leverage that should be set to get the aimed margin and position size
 */
export function computeOpenPerpetualFromMarginPosition(
  chainID: number,
  stableSymbol: string,
  collateralSymbol: string,
  margin: BigNumberish,
  positionSize: BigNumberish,
  inDecimals: number,
  totalCoveredAmount: BigNumberish,
  stocksUsers: BigNumberish,
  rate: BigNumberish = 0,
  targetHAHedge: BigNumberish = constants(chainID).poolsParameters[stableSymbol][collateralSymbol].targetHAHedge,
  haBonusMalusDeposit: BigNumberish = constants(chainID).poolsParameters[stableSymbol][collateralSymbol].haBonusMalusDeposit,
  _xHAFeesDeposit: BigNumberish[] = constants(chainID).poolsParameters[stableSymbol][collateralSymbol].xHAFeesDeposit,
  _yHAFeesDeposit: BigNumberish[] = constants(chainID).poolsParameters[stableSymbol][collateralSymbol].yHAFeesDeposit
): {
  percentageFee: BigNumber;
  fees: BigNumber;
  leverage: BigNumber;
} {
  margin = BigNumber.from(margin);
  positionSize = BigNumber.from(positionSize);
  totalCoveredAmount = BigNumber.from(totalCoveredAmount);
  targetHAHedge = BigNumber.from(targetHAHedge);
  const xHAFeesDeposit = _xHAFeesDeposit.map((e) => BigNumber.from(e));
  const yHAFeesDeposit = _yHAFeesDeposit.map((e) => BigNumber.from(e));
  haBonusMalusDeposit = BigNumber.from(haBonusMalusDeposit);
  stocksUsers = BigNumber.from(stocksUsers);
  rate = BigNumber.from(rate);

  const inBase = multByPow(1, inDecimals);

  const hedgeRatio = computeHedgeRatio(totalCoveredAmount.add(positionSize.mul(rate).div(inBase)), targetHAHedge, stocksUsers);
  const percentageFee = haBonusMalusDeposit.mul(piecewiseFunction(hedgeRatio, xHAFeesDeposit, yHAFeesDeposit)).div(gwei(1));

  const fees = positionSize.sub(positionSize.mul(constants(chainID).BASE_PARAMS.sub(percentageFee)).div(constants(chainID).BASE_PARAMS));
  const netMargin = margin.sub(fees);
  const leverage = positionSize.add(netMargin).mul(constants(chainID).BASE_TOKENS).div(netMargin);

  return {
    percentageFee,
    fees,
    leverage,
  };
}

/**
 * Computes the cash out amount if the perpetual were to be exited right now
 *
 * @param chainId - chainId of the network targeted
 * @param stableSymbol - Symbol of the stablecoin targeted
 * @param collateralSymbol - Symbol of the collateral targeted
 * @param margin - Amount brought to the perpetual at creation. Can be fetched from `PerpetualManager`
 * @param positionSize - Amount that the perpetual insures. Can be fetched from `PerpetualManager`
 * @param entryRate - Rate stored in the perpetual. Can be fetched from `PerpetualManager`
 * @param currentRate - Current oracle rate. Can be fetched from the `Oracle` contract
 * @param inDecimals - Decimals of the collateral token. Can be fetched the `ERC20` contract
 * @param totalCoveredAmount - Current insured amount. Can be fetched from `PerpetualManager`
 * @param stocksUsers - Collateral brought by users. Can be fetched from `StableMaster`
 * The following parameters have default value that should be up to date if you have the last sdk version.
 * However there is no guarantee it has not been changed by governance.
 * @param maintenanceMargin - Liquidation threshold
 * @param targetHAHedge - Max ratio to insure. Can be fetched from `PerpetualManager`
 * @param haBonusMalusWithdraw - Fee modifier. Can be fetched from `PerpetualManager`
 * @param _xHAFeesWithdraw - Linear fee function. Can be fetched from `PerpetualManager`
 * @param _yHAFeesWithdraw - Linear fee function. Can be fetched from `PerpetualManager`
 *
 * @returns cashOutAmount Amount that can be withdrawn
 */
export function computeClosePerpetual(
  chainID: number,
  stableSymbol: string,
  collateralSymbol: string,
  margin: BigNumberish,
  positionSize: BigNumberish,
  entryRate: BigNumberish,
  currentRate: BigNumberish = 0,
  inDecimals: number,
  totalCoveredAmount: BigNumberish,
  stocksUsers: BigNumberish,
  maintenanceMargin: BigNumberish,
  targetHAHedge: BigNumberish = constants(chainID).poolsParameters[stableSymbol][collateralSymbol].targetHAHedge,
  haBonusMalusWithdraw: BigNumberish = gwei(1),
  _xHAFeesWithdraw: BigNumberish[] = constants(chainID).poolsParameters[stableSymbol][collateralSymbol].xHAFeesWithdraw,
  _yHAFeesWithdraw: BigNumberish[] = constants(chainID).poolsParameters[stableSymbol][collateralSymbol].yHAFeesWithdraw
):
  | {
      cashOutAmount: BigNumber;
      fees: BigNumber;
      liquidable: boolean;
    }
  | undefined {
  margin = BigNumber.from(margin);
  positionSize = BigNumber.from(positionSize);
  totalCoveredAmount = BigNumber.from(totalCoveredAmount);
  targetHAHedge = BigNumber.from(targetHAHedge);
  maintenanceMargin = BigNumber.from(maintenanceMargin);
  const xHAFeesWithdraw = _xHAFeesWithdraw.map((e) => BigNumber.from(e));
  const yHAFeesWithdraw = _yHAFeesWithdraw.map((e) => BigNumber.from(e));
  haBonusMalusWithdraw = BigNumber.from(haBonusMalusWithdraw);
  stocksUsers = BigNumber.from(stocksUsers);
  entryRate = BigNumber.from(entryRate);
  currentRate = BigNumber.from(currentRate);

  const inBase = multByPow(1, inDecimals);

  if (margin.isNegative() || positionSize.isNegative()) {
    throw Error('Invalid arguments');
  }

  if (currentRate?.eq(0)) {
    return undefined;
  }

  const newCommit = positionSize.mul(entryRate).div(currentRate);

  let cashOutAmount = newCommit.gte(positionSize.add(margin)) ? ether(0) : positionSize.add(margin).sub(newCommit);

  const liquidable = cashOutAmount.mul(gwei(1)).lte(positionSize.mul(maintenanceMargin));

  const hedgeRatio = computeHedgeRatio(totalCoveredAmount.add(positionSize.mul(entryRate).div(inBase)), targetHAHedge, stocksUsers);

  const percentageFee = haBonusMalusWithdraw.mul(piecewiseFunction(hedgeRatio, xHAFeesWithdraw, yHAFeesWithdraw)).div(gwei(1));

  const fees = positionSize.mul(percentageFee).div(gwei(1));
  cashOutAmount = cashOutAmount.sub(fees);

  return {
    cashOutAmount: cashOutAmount,
    fees,
    liquidable,
  };
}

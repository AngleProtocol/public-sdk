import { BigNumberish } from '@ethersproject/bignumber';
import { ethers } from 'ethers';

import { registry } from '../constants';
import { Oracle__factory, PerpetualManagerFront__factory, StableMasterFront__factory } from '../constants/types';
import { computeClosePerpetual, computeOpenPerpetualFromMarginLeverage } from '../helpers';
import { ChainId } from '../index';
import { parseCollat, parseStable } from '../utils';

/**
 * Estimates the amount of stablecoin one would get with this amount of collateral
 *
 * @param margin - Amount of collateral used for the margin
 * @param leverage - Leverage required with this perpetual
 * @param collateral - Address, symbol or name of the collateral used
 * @param stablecoin - Address, symbol or name of the stablecoin
 *
 * @returns the amount of fees it would cost (with as many decimals as the collateral)
 */
export async function estimateOpenPerpetual(
  margin: BigNumberish,
  leverage: BigNumberish,
  collateral: string,
  stablecoin: string,
  provider = ethers.getDefaultProvider()
): Promise<{
  percentageFee: BigNumberish;
  fees: BigNumberish;
  positionSize: BigNumberish;
}> {
  const stable = parseStable(stablecoin);
  const collat = parseCollat(collateral);

  // Fetch data on chain
  const stableMasterAddress = registry(ChainId.MAINNET, { stablecoin: stable.symbol })?.StableMaster;
  const oracleAddress = registry(ChainId.MAINNET, stable.symbol, collat.symbol)?.Oracle;
  const perpetualManagerAddress = registry(ChainId.MAINNET, stable.symbol, collat.symbol)?.PerpetualManager;
  const poolManagerAddress = registry(ChainId.MAINNET, stable.symbol, collat.symbol)?.PoolManager;

  /** Error case */
  if (!stableMasterAddress || !oracleAddress || !perpetualManagerAddress || !poolManagerAddress) {
    console.error('Address do not exist');
    return { percentageFee: 0, fees: 0, positionSize: 0 };
  } else {
    const stablemaster = StableMasterFront__factory.connect(stableMasterAddress, provider);
    const oracle = Oracle__factory.connect(oracleAddress, provider);
    const perpetualManager = PerpetualManagerFront__factory.connect(perpetualManagerAddress, provider);

    const rate = await oracle.readLower();
    const totalCoveredAmount = await perpetualManager.totalHedgeAmount();
    const stocksUsers = (await stablemaster.collateralMap(poolManagerAddress)).stocksUsers;

    return computeOpenPerpetualFromMarginLeverage(
      1,
      stable.symbol.slice(2),
      collat.symbol,
      margin,
      leverage,
      collat.decimals,
      totalCoveredAmount,
      stocksUsers,
      rate
    );
  }
}

/**
 * Estimates the cash out amount one would get bu cashing out a perpetual
 *
 * @param margin - Net margin brought to the perpetual at creation
 * @param positionSize - Position size of the perpetual
 * @param entryRate - Oracle rate of the perpetual at creation
 *
 * @returns the cash out amount (with as many decimals as the collateral)
 */
export async function estimateClosePerpetual(
  margin: BigNumberish,
  positionSize: BigNumberish,
  entryRate: BigNumberish,
  collateral: string,
  stablecoin: string,
  provider = ethers.getDefaultProvider()
): Promise<BigNumberish> {
  const stable = parseStable(stablecoin);
  const collat = parseCollat(collateral);

  // Fetch data on chain
  const stableMasterAddress = registry(ChainId.MAINNET, { stablecoin: stable.symbol })?.StableMaster;
  const oracleAddress = registry(ChainId.MAINNET, stable.symbol, collat.symbol)?.Oracle;
  const perpetualManagerAddress = registry(ChainId.MAINNET, stable.symbol, collat.symbol)?.PerpetualManager;
  const poolManagerAddress = registry(ChainId.MAINNET, stable.symbol, collat.symbol)?.PoolManager;

  /** Error case */
  if (!stableMasterAddress || !oracleAddress || !perpetualManagerAddress || !poolManagerAddress) {
    console.error('Address do not exist');
    return 0;
  } else {
    const stablemaster = StableMasterFront__factory.connect(stableMasterAddress, provider);
    const oracle = Oracle__factory.connect(oracleAddress, provider);
    const perpetualManager = PerpetualManagerFront__factory.connect(perpetualManagerAddress, provider);

    const rate = await oracle.readLower();
    const totalCoveredAmount = await perpetualManager.totalHedgeAmount();
    const stocksUsers = (await stablemaster.collateralMap(poolManagerAddress)).stocksUsers;

    const maintenanceMargin = await perpetualManager.maintenanceMargin();
    // eslint-disable-next-line
    return computeClosePerpetual(
      1,
      stable.symbol.slice(2),
      collat.symbol,
      margin,
      positionSize,
      entryRate,
      rate,
      collat.decimals,
      totalCoveredAmount,
      stocksUsers,
      maintenanceMargin
    )!.cashOutAmount;
  }
}

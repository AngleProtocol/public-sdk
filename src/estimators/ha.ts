import { BigNumberish } from '@ethersproject/bignumber';
import { ethers } from 'ethers';

import { CONTRACTS_ADDRESSES, Interfaces } from '../constants';
import { Oracle, PerpetualManagerFront, StableMasterFront } from '../constants/types';
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
  const stableMasterAddress = CONTRACTS_ADDRESSES[ChainId.MAINNET][stable.symbol].StableMaster!;
  const oracleAddress = CONTRACTS_ADDRESSES[ChainId.MAINNET][stable.symbol].collaterals![collat.symbol]?.Oracle as string;
  const perpetualManagerAddress = CONTRACTS_ADDRESSES[ChainId.MAINNET][stable.symbol].collaterals![collat.symbol]
    ?.PerpetualManager as string;
  const poolManagerAddress = CONTRACTS_ADDRESSES[ChainId.MAINNET][stable.symbol].collaterals![collat.symbol]?.PoolManager as string;

  const stablemaster = new ethers.Contract(stableMasterAddress, Interfaces.StableMasterFront_Interface, provider) as StableMasterFront;
  const oracle = new ethers.Contract(oracleAddress, Interfaces.Oracle_Interface, provider) as Oracle;
  const perpetualManager = new ethers.Contract(
    perpetualManagerAddress,
    Interfaces.PerpetualManagerFront_Abi,
    provider
  ) as PerpetualManagerFront;

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
  const stableMasterAddress = CONTRACTS_ADDRESSES[ChainId.MAINNET][stable.symbol].StableMaster!;
  const oracleAddress = CONTRACTS_ADDRESSES[ChainId.MAINNET][stable.symbol].collaterals![collat.symbol]?.Oracle as string;
  const perpetualManagerAddress = CONTRACTS_ADDRESSES[ChainId.MAINNET][stable.symbol].collaterals![collat.symbol]
    ?.PerpetualManager as string;
  const poolManagerAddress = CONTRACTS_ADDRESSES[ChainId.MAINNET][stable.symbol].collaterals![collat.symbol]?.PoolManager as string;

  const stablemaster = new ethers.Contract(stableMasterAddress, Interfaces.StableMasterFront_Interface, provider) as StableMasterFront;
  const oracle = new ethers.Contract(oracleAddress, Interfaces.Oracle_Interface, provider) as Oracle;
  const perpetualManager = new ethers.Contract(
    perpetualManagerAddress,
    Interfaces.PerpetualManagerFront_Abi,
    provider
  ) as PerpetualManagerFront;

  const rate = await oracle.readLower();
  const totalCoveredAmount = await perpetualManager.totalHedgeAmount();
  const stocksUsers = (await stablemaster.collateralMap(poolManagerAddress)).stocksUsers;

  const maintenanceMargin = await perpetualManager.maintenanceMargin();

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

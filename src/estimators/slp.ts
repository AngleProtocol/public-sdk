import { BigNumber, BigNumberish } from '@ethersproject/bignumber';
import { ethers } from 'ethers';

import { CONTRACTS_ADDRESSES, Interfaces } from '../constants';
import { StableMasterFront } from '../constants/types';
import { simulateWithdraw } from '../helpers';
import { ChainId } from '../index';
import { parseCollat, parseStable } from '../utils';

/**
 * Estimates the amount of sanTokens one would get by depositing amount of collateral
 *
 * @param amount - Amount of collateral to deposit
 * @param collateral - Address, symbol or name of the collateral used
 * @param stablecoin - Address, symbol or name of the stablecoin
 *
 * @returns the amount of sanTokens received (with as many decimals as the collateral)
 */
export async function estimateDeposit(
  amount: BigNumberish,
  collateral: string,
  stablecoin: string,
  provider = ethers.getDefaultProvider()
): Promise<BigNumberish> {
  const stable = parseStable(stablecoin);
  const collat = parseCollat(collateral);

  // Fetch data on chain
  const stableMasterAddress = CONTRACTS_ADDRESSES[ChainId.MAINNET][stable.symbol].StableMaster!;
  const poolManagerAddress = CONTRACTS_ADDRESSES[ChainId.MAINNET][stable.symbol].collaterals![collat.symbol]?.PoolManager as string;

  const stablemaster = new ethers.Contract(stableMasterAddress, Interfaces.StableMasterFront_Interface, provider) as StableMasterFront;

  const sanRate = (await stablemaster.collateralMap(poolManagerAddress)).sanRate;

  return BigNumber.from(amount).mul(BigNumber.from(10).pow(18)).div(sanRate);
}

/**
 * Estimates the amount of collateral one would get by withdrawing amount of sanTokens
 *
 * @param amount - Amount of sanTokens to withdraw
 * @param collateral - Address, symbol or name of the collateral used
 * @param stablecoin - Address, symbol or name of the stablecoin
 *
 * @returns the amount of collateral received (with as many decimals as the collateral)
 */
export async function estimateWithdraw(
  amount: BigNumberish,
  collateral: string,
  stablecoin: string,
  provider = ethers.getDefaultProvider()
): Promise<BigNumberish> {
  const stable = parseStable(stablecoin);
  const collat = parseCollat(collateral);

  // Fetch data on chain
  const stableMasterAddress = CONTRACTS_ADDRESSES[ChainId.MAINNET][stable.symbol].StableMaster!;
  const poolManagerAddress = CONTRACTS_ADDRESSES[ChainId.MAINNET][stable.symbol].collaterals![collat.symbol]?.PoolManager as string;

  const stablemaster = new ethers.Contract(stableMasterAddress, Interfaces.StableMasterFront_Interface, provider) as StableMasterFront;

  const sanRate = (await stablemaster.collateralMap(poolManagerAddress)).sanRate;
  const collatRatio = await stablemaster.getCollateralRatio();

  return simulateWithdraw(ChainId.MAINNET, stable.symbol.slice(2), collat.symbol, amount, sanRate, collatRatio);
}

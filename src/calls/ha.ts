/**
 * This file contains helpers to send user transactions.
 */
import { BigNumberish } from '@ethersproject/bignumber';
import { ethers } from 'ethers';
import { PerpetualManagerFront__factory } from '../constants/types/contracts';

import { CONTRACTS_ADDRESSES } from '../constants';
import { ChainId } from '../types';
import { parseCollat, parseStable } from '../utils';

/**
 * Calls the openPerpetual fonction of the PerpetualManager
 *
 * @param collateral - Address, symbol or name of the collateral
 * @param stablecoin - Address, symbol or name of the stablecoin
 * @param margin - Amount of collateral to swap for sanTokens
 * @param committedAmount - Amount of collateral to swap for sanTokens
 * @param owner - Owner of the perpetual. If not set will be the signer
 * @param maxOracleRate - Maximum oracle rate accepted. Useful to prevent TWAP or oracle manipulation.
 * @param minNetMargin - Minimum margin accepted after fees are withdrawn. Can be computed using estimators functions.
 * @param CallOptions -  Call options and Ethers.js overrides for the
 *     transaction. A passed `gasLimit` will be used in both the `approve` (if
 *     not supressed) and `mint` transactions.
 * @returns Returns an Ethers.js transaction object of the transaction.
 */
export async function openPerpetual(
  chainId: ChainId,
  collateral: string,
  stablecoin: string,
  signer: ethers.Signer,
  margin: BigNumberish,
  committedAmount: BigNumberish,
  maxOracleRate: BigNumberish,
  minNetMargin: BigNumberish,
  owner = '',
  options: ethers.Overrides = {}
): Promise<ethers.ContractTransaction> {
  const stable = parseStable(stablecoin);
  const collat = parseCollat(collateral);

  const addresses = CONTRACTS_ADDRESSES[chainId];
  const perpetualManagerAddress = addresses[stable.symbol]?.collaterals?.[collat.symbol].PerpetualManager;

  if (!perpetualManagerAddress) throw new Error("Can't find contract's address");

  if (!ethers.utils.isAddress(owner)) owner = await signer.getAddress();

  const contract = new ethers.Contract(perpetualManagerAddress, PerpetualManagerFront__factory.abi);

  return contract.connect(signer).openPerpetual(owner, margin, committedAmount, maxOracleRate, minNetMargin, options);
}

/**
 * Calls the closePerpetual fonction of the PerpetualManager
 *
 * @param collateral - Address, symbol or name of the collateral
 * @param stablecoin - Address, symbol or name of the stablecoin
 * @param perpetualID - ID
 * @param to - Address to send the PnL / cashOutAmount to. If not set will be the signer
 * @param minCashOutAmount - Minimum cashOut amount. Useful to prevent TWAP or oracle manipulation.
 * @param CallOptions -  Call options and Ethers.js overrides for the
 *     transaction. A passed `gasLimit` will be used in both the `approve` (if
 *     not supressed) and `mint` transactions.
 * @returns Returns an Ethers.js transaction object of the transaction.
 */
export async function closePerpetual(
  chainId: ChainId,
  collateral: string,
  stablecoin: string,
  signer: ethers.Signer,
  perpetualID: number,
  minCashOutAmount: BigNumberish,
  to = '',
  options: ethers.Overrides = {}
): Promise<ethers.ContractTransaction> {
  const stable = parseStable(stablecoin);
  const collat = parseCollat(collateral);

  const addresses = CONTRACTS_ADDRESSES[chainId];
  const perpetualManagerAddress = addresses[stable.symbol]?.collaterals?.[collat.symbol].PerpetualManager;

  if (!perpetualManagerAddress) throw new Error("Can't find contract's address");

  if (!ethers.utils.isAddress(to)) to = await signer.getAddress();

  const contract = new ethers.Contract(perpetualManagerAddress, PerpetualManagerFront__factory.abi);

  return contract.connect(signer).closePerpetual(perpetualID, to, minCashOutAmount, options);
}

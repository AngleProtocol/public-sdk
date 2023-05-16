/**
 * This files contains helpers to pass keeper transactions.
 */

import { ethers } from 'ethers';

import { FeeManager__factory, registry, Strategy__factory } from '../constants';
import { ChainId } from '../types';
import { parseCollat, parseStable } from '../utils';

/**
 * Calls the harvesting function of the required pool
 *
 * @param CallOptions -  Call options and Ethers.js overrides for the
 *     transaction. A passed `gasLimit` will be used in both the `approve` (if
 *     not supressed) and `mint` transactions.
 * @returns Returns an Ethers.js transaction object of the supply
 *     transaction.
 */
export async function harvest(
  chainId: ChainId,
  collateral: string,
  stablecoin: string,
  signer: ethers.Signer,
  options: ethers.Overrides = {}
): Promise<ethers.ContractTransaction> {
  const stable = parseStable(stablecoin);
  const collat = parseCollat(collateral);

  const address = registry(chainId, stable.symbol, collat.symbol)?.Strategies?.GenericOptimisedLender?.Contract;

  if (!address) throw new Error("Can't find contract's address");

  return Strategy__factory.connect(address, signer)['harvest'](options);
}

/**
 * Calls the updateFee function of the required pool
 *
 * @param CallOptions -  Call options and Ethers.js overrides for the
 *     transaction. A passed `gasLimit` will be used in both the `approve` (if
 *     not supressed) and `mint` transactions.
 * @returns Returns an Ethers.js transaction object of the supply
 *     transaction.
 */
export async function updateUsersSLP(
  chainId: ChainId,
  collateral: string,
  stablecoin: string,
  signer: ethers.Signer,
  options: ethers.Overrides = {}
): Promise<ethers.ContractTransaction> {
  const stable = parseStable(stablecoin);
  const collat = parseCollat(collateral);

  const address = registry(chainId, stable.symbol, collat.symbol)?.FeeManager;

  if (!address) throw new Error("Can't find contract's address");

  return FeeManager__factory.connect(address, signer).updateUsersSLP(options);
}

/**
 * This files contains helpers to pass keeper transactions.
 */

import { ethers } from 'ethers';
import { FeeManager__factory, Strategy__factory } from 'src/constants/types/contracts';

import { CONTRACTS_ADDRESSES } from '../constants';
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

  const addresses = CONTRACTS_ADDRESSES[chainId];
  const address = addresses[stable.symbol]?.collaterals?.[collat.symbol].Strategy;

  if (!address) throw new Error("Can't find contract's address");

  const contract = new ethers.Contract(address, Strategy__factory.abi);

  return contract.connect(signer).harvest(options);
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

  const addresses = CONTRACTS_ADDRESSES[chainId];
  const address = addresses[stable.symbol]?.collaterals?.[collat.symbol].FeeManager;

  if (!address) throw new Error("Can't find contract's address");

  const contract = new ethers.Contract(address, FeeManager__factory.abi);

  return contract.connect(signer).updateUsersSLP(options);
}

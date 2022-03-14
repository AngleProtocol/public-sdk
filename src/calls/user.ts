/**
 * This files contains helpers to send user transactions.
 */
import { BigNumberish } from '@ethersproject/bignumber';
import { ethers } from 'ethers';

import { CONTRACTS_ADDRESSES } from '../constants';
import { ERC20, ERC20__factory, StableMasterFront__factory } from '../constants/types/contracts';
import { ChainId } from '../types';
import { parseCollat, parseStable } from '../utils';

/**
 * Calls the mint fonction of the stableMaster
 *
 * @param collateral - Address, symbol or name of the collateral
 * @param stablecoin - Address, symbol or name of the stablecoin
 * @param amount - Amount of collateral to spend
 * @param user - Address of recipient, to specify only if different from signer
 * @param minStableAmount - Minimum amount of stablecoin to receive, otherwise the tx will revert.
 * Can be computed using the estimators.
 * @param CallOptions -  Call options and Ethers.js overrides for the
 *     transaction. A passed `gasLimit` will be used in both the `approve` (if
 *     not supressed) and `mint` transactions.
 * @returns Returns an Ethers.js transaction object of the supply
 *     transaction.
 */
export async function mint(
  chainId: ChainId,
  collateral: string,
  stablecoin: string,
  signer: ethers.Signer,
  amount: BigNumberish,
  user = '',
  minStableAmount: BigNumberish = 0,
  options: ethers.Overrides = {}
): Promise<ethers.ContractTransaction> {
  const stable = parseStable(stablecoin);
  const collat = parseCollat(collateral);

  const addresses = CONTRACTS_ADDRESSES[chainId];
  const stableMasterAddress = addresses[stable.symbol]?.StableMaster;
  const poolManagerAddress = addresses[stable.symbol]?.collaterals?.[collat.symbol].PoolManager;

  if (!stableMasterAddress || !poolManagerAddress) throw new Error("Can't find contract's address");

  if (!ethers.utils.isAddress(user)) user = await signer.getAddress();

  const token = new ethers.Contract(collat.address, ERC20__factory.abi) as ERC20;
  const contract = new ethers.Contract(stableMasterAddress, StableMasterFront__factory.abi);

  // Approval is needed
  const approval = await token.connect(signer).allowance(await signer.getAddress(), stableMasterAddress);
  if (approval.lt(amount)) console.error('The StableMaster needs to be approved');

  return contract.connect(signer).mint(amount, user, poolManagerAddress, minStableAmount, options);
}

/**
 * Calls the burn fonction of the stableMaster
 *
 * @param collateral - Address, symbol or name of the collateral
 * @param stablecoin - Address, symbol or name of the stablecoin
 * @param amount - Amount of collateral to spend
 * @param burner - Address of the account that will burn the stablecoins, to specify only if different from signer
 * @param dest - Address of account to send the collateral to, to specify only if different from signer
 * @param minCollatAmount - Minimum amount of collateral to receive, otherwise the tx will revert.
 * Can be computed using the estimators.
 * @param CallOptions -  Call options and Ethers.js overrides for the
 *     transaction. A passed `gasLimit` will be used in both the `approve` (if
 *     not supressed) and `mint` transactions.
 * @returns Returns an Ethers.js transaction object of the supply
 *     transaction.
 */
export async function burn(
  chainId: ChainId,
  collateral: string,
  stablecoin: string,
  signer: ethers.Signer,
  amount: BigNumberish,
  burner = '',
  dest = '',
  minCollatAmount: BigNumberish = 0,
  options: ethers.Overrides = {}
): Promise<ethers.ContractTransaction> {
  const stable = parseStable(stablecoin);
  const collat = parseCollat(collateral);

  const addresses = CONTRACTS_ADDRESSES[chainId];
  const stableMasterAddress = addresses[stable.symbol]?.StableMaster;
  const poolManagerAddress = addresses[stable.symbol]?.collaterals?.[collat.symbol].PoolManager;

  if (!stableMasterAddress || !poolManagerAddress) throw new Error("Can't find contract's address");

  if (!ethers.utils.isAddress(burner)) burner = await signer.getAddress();
  if (!ethers.utils.isAddress(dest)) dest = await signer.getAddress();

  const contract = new ethers.Contract(stableMasterAddress, StableMasterFront__factory.abi);

  return contract.connect(signer).burn(amount, burner, dest, poolManagerAddress, minCollatAmount, options);
}

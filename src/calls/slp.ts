/**
 * This files contains helpers to send user transactions.
 */
import { BigNumberish } from '@ethersproject/bignumber';
import { ethers } from 'ethers';
import { Erc20 } from 'src/constants/types';

import { CONTRACTS_ADDRESSES, Interfaces } from '../constants';
import { ChainId } from '../types';
import { parseCollat, parseStable } from '../utils';

/**
 * Calls the deposit fonction of the stableMaster
 *
 * @param collateral - Address, symbol or name of the collateral
 * @param stablecoin - Address, symbol or name of the stablecoin
 * @param amount - Amount of collateral to swap for sanTokens
 * @param user - Address of recipient, to specify only if different from signer
 * @param CallOptions -  Call options and Ethers.js overrides for the
 *     transaction. A passed `gasLimit` will be used in both the `approve` (if
 *     not supressed) and `mint` transactions.
 * @returns Returns an Ethers.js transaction object of the transaction.
 */
export async function deposit(
  chainId: ChainId,
  collateral: string,
  stablecoin: string,
  signer: ethers.Signer,
  amount: BigNumberish,
  user = '',
  options: ethers.Overrides = {}
): Promise<ethers.ContractTransaction> {
  const stable = parseStable(stablecoin);
  const collat = parseCollat(collateral);

  const addresses = CONTRACTS_ADDRESSES[chainId];
  const stableMasterAddress = addresses[stable.symbol]?.StableMaster;
  const poolManagerAddress = addresses[stable.symbol]?.collaterals?.[collat.symbol].PoolManager;

  if (!stableMasterAddress || !poolManagerAddress) throw new Error("Can't find contract's address");

  if (!ethers.utils.isAddress(user)) user = await signer.getAddress();

  const token = new ethers.Contract(collat.address, Interfaces.ERC20_Abi) as Erc20;
  const contract = new ethers.Contract(stableMasterAddress, Interfaces.StableMasterFront_Abi);

  // Approval is needed
  const approval = await token.connect(signer).allowance(await signer.getAddress(), stableMasterAddress);
  if (approval.lt(amount)) console.error('The StableMaster needs to be approved');

  return contract.connect(signer).deposit(amount, user, poolManagerAddress, options);
}

/**
 * Calls the deposit fonction of the stableMaster
 *
 * @param collateral - Address, symbol or name of the collateral
 * @param stablecoin - Address, symbol or name of the stablecoin
 * @param amount - Amount of collateral to swap for sanTokens
 * @param burner - Address of sanToken burner, to specify only if different from signer
 * The caller must be approved by the burner
 * @param dest - Address of account to send the collateral to, to specify only if different from signer
 * @param CallOptions -  Call options and Ethers.js overrides for the
 *     transaction. A passed `gasLimit` will be used in both the `approve` (if
 *     not supressed) and `mint` transactions.
 * @returns Returns an Ethers.js transaction object of the transaction.
 */
export async function withdraw(
  chainId: ChainId,
  collateral: string,
  stablecoin: string,
  signer: ethers.Signer,
  amount: BigNumberish,
  burner = '',
  dest = '',
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

  const contract = new ethers.Contract(stableMasterAddress, Interfaces.StableMasterFront_Abi);

  return contract.connect(signer).withdraw(amount, burner, dest, poolManagerAddress, options);
}

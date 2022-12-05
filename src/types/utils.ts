import { BigNumber, utils } from 'ethers';
import invariant from 'tiny-invariant';

import { SOLIDITY_TYPE_MAXIMA, SolidityType } from './constants';

export function validateSolidityTypeInstance(value: BigNumber, solidityType: SolidityType): void {
  // invariant(value.gte(0), `${value} is not a ${solidityType}.`);
  invariant(value.lte(SOLIDITY_TYPE_MAXIMA[solidityType]), `${value} is not a ${solidityType}.`);
}

/**
 * Validates an address and returns the parsed (checksummed) version of that address
 * @param address - the unchecksummed hex address
 */
export function validateAndParseAddress(address: string): string {
  try {
    return utils.getAddress(address);
  } catch (error) {
    throw new Error(`${address} is not a valid address.`);
  }
}

export enum RouterActionType {
  transfer,
  wrapNative,
  unwrapNative,
  sweep,
  sweepNative,
  uniswapV3,
  oneInch,
  claimRewards,
  gaugeDeposit,
  borrower,
  swapper,
  mintSavingsRate,
  depositSavingsRate,
  redeemSavingsRate,
  withdrawSavingsRate,
  prepareRedeemSavingsRate,
  claimRedeemSavingsRate,
  swapIn,
  swapOut,
  claimWeeklyInterest,
  withdraw,
  mint,
  deposit,
  openPerpetual,
  addToPerpetual,
  veANGLEDeposit,
  claimRewardsWithPerps,
}

export enum BorrowActionType {
  createVault,
  closeVault,
  addCollateral,
  removeCollateral,
  repayDebt,
  borrow,
  getDebtIn,
  permit,
}

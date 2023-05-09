import { BigNumber, utils } from 'ethers';
import invariant from 'tiny-invariant';

import { SOLIDITY_TYPE_MAXIMA, SolidityType } from './constants';
import { AMMType } from './merkl';

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

export const findMerklAMMType = (bytes: string): AMMType => {
  if (!bytes || !utils.isBytesLike(bytes) || bytes === '0x') return AMMType.UniswapV3;
  try {
    const firstDecodedValue = (utils.defaultAbiCoder.decode(['uint256'], bytes)[0] as BigNumber)?.toNumber();
    if (!Object.values(AMMType).includes(firstDecodedValue)) return AMMType.UniswapV3;
    return firstDecodedValue as AMMType;
  } catch {
    return AMMType.UniswapV3;
  }
};

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
  mint4626,
  deposit4626,
  redeem4626,
  withdraw4626,
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

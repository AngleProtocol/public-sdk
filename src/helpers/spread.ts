import { BigNumber, BigNumberish } from 'ethers';

import { gwei } from '../utils/bignumber';

/**
 * Internal function to compute the amount left that can be covered
 *
 * @param currentCoveredAmount - Current insured amount
 * @param targetHAHedge - Max ratio to insure
 * @param stocksUsers - Collateral brought by users
 *
 * @returns The ratio between the current committed amount and the max amount to commit
 */
export function computeHedgeRatio(currentCoveredAmount: BigNumberish, targetHAHedge: BigNumberish, stocksUsers: BigNumberish): BigNumber {
  currentCoveredAmount = BigNumber.from(currentCoveredAmount);
  targetHAHedge = BigNumber.from(targetHAHedge);
  stocksUsers = BigNumber.from(stocksUsers);

  const targetCoveredAmount = stocksUsers.mul(targetHAHedge).div(gwei(1));
  if (currentCoveredAmount.lt(targetCoveredAmount) && !targetCoveredAmount.eq(0)) {
    return currentCoveredAmount.mul(gwei(1)).div(targetCoveredAmount);
  } else {
    return gwei(1);
  }
}

import { BigNumber } from 'ethers';

import { CONSTANTS } from '../index';
import { Int256 } from '../lib';
import { Token } from '../types';

export class Pair {
  public readonly stable: Token;
  public readonly collateral: Token;

  public readonly maintenanceMargin: Int256;
  public readonly totalHedgeAmount: Int256;
  public readonly limitHAHedge: Int256;
  public readonly targetHAHedge: Int256;
  public readonly lockTime: number;
  public readonly lowerExchangeRate: Int256;
  public readonly stocksUsers: Int256;

  constructor(
    stable: Token,
    collateral: Token,
    maintenanceMargin: BigNumber,
    totalHedgeAmount: BigNumber,
    limitHAHedge: BigNumber,
    targetHAHedge: BigNumber,
    lockTime: BigNumber,
    lowerExchangeRate: BigNumber,
    stocksUsers: BigNumber
  ) {
    this.stable = stable;
    this.collateral = collateral;

    this.maintenanceMargin = Int256.from(maintenanceMargin, CONSTANTS(stable.chainId).DECIMAL_PARAMS);
    this.totalHedgeAmount = Int256.from(totalHedgeAmount, stable.decimals);
    this.limitHAHedge = Int256.from(limitHAHedge, CONSTANTS(stable.chainId).DECIMAL_PARAMS);
    this.targetHAHedge = Int256.from(targetHAHedge, CONSTANTS(stable.chainId).DECIMAL_PARAMS);
    this.lockTime = lockTime.toNumber() * 1000; // seconds -> millis
    this.lowerExchangeRate = Int256.from(lowerExchangeRate);
    this.stocksUsers = Int256.from(stocksUsers, stable.decimals);
  }

  // totalHedgeAmount > stocksUser * limitHAHedge
  computeRequireForceClose = (): { requireForceClose: boolean; targetHedgeAmount: Int256 } => {
    const currentHedge = this.stocksUsers.mul(this.limitHAHedge);
    const requireForceClose = this.totalHedgeAmount.gt(currentHedge!);
    const targetHedgeAmount = this.stocksUsers.mul(this.targetHAHedge)!;

    return { requireForceClose, targetHedgeAmount };
  };
}

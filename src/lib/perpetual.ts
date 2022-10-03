import { BigNumber } from 'ethers';
import invariant from 'tiny-invariant';

import { ChainId, Token, validateAndParseAddress } from '../types';
import { Int256 } from './int256';
import { TokenAmount } from './tokenAmount';

export enum PerpetualStatus {
  open = 'perpetuals.status.open',
  close = 'perpetuals.status.closed',
  liquidate = 'perpetuals.status.liquidated',
  forceClose = 'perpetuals.status.forceClosed',
}

// TODO harmonize this in TG
export enum HistoryPerpetualStatus {
  close = 'perpetuals.status.closed',
  liquidate = 'perpetuals.status.liquidated',
  forceClose = 'perpetuals.status.forceClosed',
}

type Status = keyof typeof PerpetualStatus;
type HistoryStatus = keyof typeof HistoryPerpetualStatus;

export type TGPerpetual = {
  id: string;
  perpetualID: string;
  owner: string;
  margin: string;
  committedAmount: string;
  entryRate: string;
  perpetualManager: string;
  stableAddress: string;
  collatAddress: string;
  stableName: string;
  collatName: string;

  liquidationPrice: string;

  openingBlockNumber: string;
  openingTimestamp: string;
  lastUpdateBlockNumber: string;
  lastUpdateTimestamp: string;
  status: Status;
};

export type TGHistoryPerpetual = {
  perpetualID: number;
  owner: string;
  margin: string;
  closeAmount: string;
  stableName: string;
  collatName: string;
  timestamp: number;
  status: HistoryStatus;
};

export type TGOracles = {
  oracleDatas: {
    tokenIn: string;
    tokenOut: string;
    rateLower: number;
    rateUpper: number;
  }[];

  poolDatas: {
    decimals: number;
    sanRate: number;
    stableName: string;
    collatName: string;
  }[];
};

export type Prices = { [tokenIn: string]: { [tokenOut: string]: number } };

/**
 * Represents an ERC20 token with a unique address and some metadata.
 */
export class Perpetual {
  /**
   * The chain ID on which this currency resides
   */
  public readonly chainId: ChainId;

  /**
   * The unique Perpetual ID in the blockchain
   */
  public readonly id: string;

  /**
   * The unique Perpetual ID in the Perpetual Manager
   */
  public readonly perpetualId: number;

  /**
   * The amount brought to the Perpetual
   */
  public readonly margin: TokenAmount;

  public readonly liquidationPrice: Int256;

  /**
   * The amount commited to on the Perpetual
   */
  public readonly committedAmount: TokenAmount;

  public readonly coveredAmount: Int256;

  public distToTargetHedge: Int256 | undefined;

  /**
   * The stable token
   */
  public readonly stable: Token;

  /**
   * The collateral token
   */
  public readonly collateral: Token;

  /**
   * The rate at which the Perpetual was created
   */
  public readonly entryRate: Int256;

  /**
   * The Perpetual Manager address on the chain on which the stable asset lives
   */
  public readonly perpetualManagerAddress: string;

  /**
   * The date of the last modification of the Perpetual
   */
  public readonly creationDate: number;
  public readonly lastUpdated: number;

  public readonly openingBlockNumber: number;
  public readonly lastUpdateBlockNumber: number;

  /**
   * The status of the Perp
   * Allows us to sort between opened perps, and liquidited or forced cashout.
   * If the user cashed out his own perp, then it is removed from TheGraph, so no specific status needed
   */
  public readonly status: PerpetualStatus;

  public constructor(
    chainId: number,
    perpetualID: number,
    margin: BigNumber | string,
    committedAmount: BigNumber | string,
    stable: Token,
    collateral: Token,
    entryRate: BigNumber | string,
    perpetualManagerAddress: string,
    creationDate: number,
    status: Status,
    lastUpdated: number,
    openingBlockNumber: string,
    lastUpdateBlockNumber: string,
    liquidationPrice: BigNumber | string
  ) {
    invariant(Number.isSafeInteger(chainId), 'CHAIN_ID');
    invariant(Number.isSafeInteger(perpetualID), 'PERPETUAL_ID');
    invariant(!stable.eq(collateral), 'STABLE/COLLATERAL');
    this.perpetualManagerAddress = validateAndParseAddress(perpetualManagerAddress);
    this.chainId = chainId;
    this.perpetualId = perpetualID;
    this.id = `${perpetualManagerAddress}_${perpetualID}`;

    this.margin = new TokenAmount(collateral, margin);
    this.committedAmount = new TokenAmount(collateral, committedAmount);
    this.liquidationPrice = Int256.from(liquidationPrice);

    this.stable = stable;
    this.collateral = collateral;

    this.entryRate = Int256.from(entryRate);
    // eslint-disable-next-line
    this.coveredAmount = this.committedAmount.mul(this.entryRate)!;
    this.distToTargetHedge = Int256.from(0);

    this.creationDate = creationDate;
    this.lastUpdated = lastUpdated;

    this.openingBlockNumber = parseInt(openingBlockNumber, 10);
    this.lastUpdateBlockNumber = parseInt(lastUpdateBlockNumber, 10);

    this.status = PerpetualStatus[status];
  }

  public static fromTgPerp(perpetual: TGPerpetual, stable: Token, collateral: Token, chainId: ChainId): Perpetual {
    return new Perpetual(
      chainId,
      parseInt(perpetual.perpetualID, 10),
      perpetual.margin,
      perpetual.committedAmount,
      stable,
      collateral,
      perpetual.entryRate,
      perpetual.perpetualManager,
      parseInt(perpetual.openingTimestamp, 10) * 1000,
      perpetual.status,
      parseInt(perpetual.lastUpdateTimestamp, 10) * 1000,
      perpetual.openingBlockNumber,
      perpetual.lastUpdateBlockNumber,
      perpetual.liquidationPrice
    );
  }

  /**
   * Returns true if the two perpetuals are equivalent, i.e. have the same chainId, id & perpetualManagerAddress.
   * @param other - other perpetual to compare
   */
  public eq(other: Perpetual): boolean {
    if (this === other) {
      return true;
    }

    const equivalent =
      this.chainId === other.chainId && this.id === other.id && this.perpetualManagerAddress === other.perpetualManagerAddress;

    if (equivalent) {
      // reference the same stable/collateral, must have the same decimals/symbol/name
      invariant(this.stable.decimals === other.stable.decimals && this.collateral.decimals === other.collateral.decimals, 'DECIMALS');
      if (this.stable.symbol && other.stable.symbol) {
        invariant(this.stable.symbol === other.stable.symbol, 'STABLE SYMBOL');
      }
      if (this.collateral.symbol && other.collateral.symbol) {
        invariant(this.collateral.symbol === other.collateral.symbol, 'COLLATERAL SYMBOL');
      }
      if (this.stable.name && other.stable.name) {
        invariant(this.stable.name === other.stable.name, 'STABLE NAME');
      }
      if (this.collateral.name && other.collateral.name) {
        invariant(this.collateral.name === other.collateral.name, 'COLLATERAL NAME');
      }

      invariant(this.margin === other.margin, 'BROUGHT');
      invariant(this.committedAmount === other.committedAmount, 'COMMITTED');
      invariant(this.entryRate === other.entryRate, 'RATE');
    }

    return equivalent;
  }
}

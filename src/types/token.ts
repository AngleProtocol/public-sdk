import invariant from 'tiny-invariant';

import { ChainId } from './constants';
import { validateAndParseAddress } from './utils';

/**
 * Represents an ERC20 token with a unique address and some metadata.
 */
export class Token {
  /**
   * The chain ID on which this currency resides
   */
  public readonly chainId: ChainId;

  /**
   * The contract address on the chain on which this token lives
   */
  public readonly address: string;

  /**
   * The decimals used in representing currency amounts
   */
  public readonly decimals: number;

  /**
   * The symbol of the currency, i.e. a short textual non-unique identifier
   */
  public readonly symbol: string;

  /**
   * The name of the currency, i.e. a descriptive textual non-unique identifier
   */
  public readonly name?: string;

  /**
   * Wether the Token is a stable AgToken or not
   */
  public readonly isAgToken: boolean;

  /**
   * Returns an ETH Token. chainId is optional, only decimals, symbol and name are important
   */
  public static ether(chainId?: ChainId): Token {
    return new Token(chainId || 0, '', 18, 'ETH', 'Ether', false);
  }

  public constructor(chainId: number, address: string, decimals: number, symbol: string, name?: string, isAgToken = false) {
    invariant(decimals >= 0 && decimals < 255 && Number.isInteger(decimals), 'DECIMALS');
    invariant(Number.isSafeInteger(chainId), 'CHAIN_ID');

    this.chainId = chainId;
    this.address = symbol === 'ETH' && name === 'Ether' ? address : validateAndParseAddress(address);
    this.decimals = decimals;
    this.symbol = symbol;
    this.name = name;
    this.isAgToken = isAgToken;
  }

  /**
   * Returns true if the two tokens are equivalent, i.e. have the same chainId and address.
   * @param other - other token to compare
   */
  public eq(other: Token): boolean {
    if (this === other) {
      return true;
    }

    const equivalent = this.chainId === other.chainId && this.address === other.address;

    if (equivalent) {
      invariant(this.decimals === other.decimals, 'DECIMALS');
      invariant(this.symbol === other.symbol, 'SYMBOL');
      if (this.name && other.name) {
        invariant(this.name === other.name, 'NAME');
      }
      invariant(this.isAgToken === other.isAgToken, 'AGTOKEN');
    }

    return equivalent;
  }
}

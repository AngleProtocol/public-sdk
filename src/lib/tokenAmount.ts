import { BigNumber, BigNumberish } from 'ethers';
import invariant from 'tiny-invariant';

import { ChainId, Token } from '../types';
import { Int256 } from './int256';

export class TokenAmount extends Int256 {
  public readonly token: Token;

  /**
   * Helper that calls the constructor with the ETHER currency
   * @param amount - ether amount in wei
   */
  public static ether(amount: BigNumber | string, chainId?: ChainId): TokenAmount {
    return new TokenAmount(Token.ether(chainId), amount);
  }

  constructor(token: Token, amount: BigNumber | string | number, parse = false) {
    super(amount, token.decimals, parse);
    this.token = token;
  }

  public add(other: TokenAmount | Int256 | undefined): TokenAmount | undefined {
    if (!other) return undefined;
    const newAmount = super.add(other);
    if (!newAmount) return undefined;
    return new TokenAmount(this.token, newAmount.raw);
  }

  public sub(other: TokenAmount | Int256 | undefined): TokenAmount | undefined {
    if (!other) return undefined;
    const newAmount = super.sub(other);
    if (!newAmount) return undefined;
    return new TokenAmount(this.token, newAmount.raw);
  }

  public div(other: TokenAmount | Int256 | BigNumberish | undefined): TokenAmount | undefined {
    if (!other) return undefined;
    if (other instanceof TokenAmount) {
      invariant(other.token.decimals === this.token.decimals, 'Wrong decimals when dividing TokenAmounts');
    }
    const newAmount = super.div(other);
    if (!newAmount) return undefined;
    return new TokenAmount(this.token, newAmount.raw);
  }

  public mul(other: TokenAmount | Int256 | BigNumberish | undefined): TokenAmount | undefined {
    if (!other) return undefined;
    if (other instanceof TokenAmount) {
      invariant(other.token.decimals === this.token.decimals, 'Wrong decimals when dividing TokenAmounts');
    }
    const newAmount = super.mul(other);
    if (!newAmount) return undefined;
    return new TokenAmount(this.token, newAmount.raw);
  }

  public rebase(base: number): TokenAmount {
    const newAmount = super.rebase(base);
    return new TokenAmount(this.token, newAmount.raw);
  }
}

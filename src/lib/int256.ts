import { BigNumber, BigNumberish, utils } from 'ethers';

import { BigNumber_BASE } from '../types';
import { formatNumber } from '../utils/bignumber';
export class Int256 {
  public readonly value: BigNumber;
  public readonly base: number;

  public static from(value: BigNumberish | Int256, base = 18): Int256 {
    return new Int256(value, base, false);
  }
  public static parse(value: BigNumberish | Int256, base = 18): Int256 {
    return new Int256(value, base, true);
  }

  protected constructor(value: BigNumberish | Int256, base = 18, parse = false) {
    if (value instanceof Int256) {
      this.value = value.value;
      this.base = value.base;
      return;
    }

    if (!value) {
      value = 0;
    }

    if (parse && (typeof value === 'string' || typeof value === 'number')) {
      this.value = utils.parseUnits(value.toString(), base);
    } else {
      this.value = BigNumber.from(value);
    }

    this.base = base;
  }

  public get raw(): BigNumber {
    return this.value;
  }

  public toFixed(decimals = 3, output: 'number' | 'percent' = 'number', round = false): string {
    const num = parseFloat(utils.formatUnits(this.value, this.base));
    return formatNumber(num, decimals, output, round);
  }

  public toNumber(decimals = -1): number {
      return parseFloat(utils.formatUnits(this.value, this.base));
  }

  public toExact(decimals = -1): string {
    if (decimals === -1) {
      return utils.formatUnits(this.value, this.base);
    } else {
      return parseFloat(utils.formatUnits(this.value, this.base)).toFixed(decimals);
    }
  }

  public rebase(base: number): Int256 {
    const newNumber = utils.parseUnits(utils.formatUnits(this.value, this.base), base);
    return Int256.from(newNumber, base);
  }

  public get abs(): Int256 {
    return Int256.from(this.value.abs(), this.base);
  }

  public lt(other: BigNumberish | Int256): boolean {
    if (other instanceof Int256) {
      return this.value.mul(BigNumber_BASE(other.base)).lt(other.value.mul(BigNumber_BASE(this.base)));
    }
    return this.value.lt(other);
  }

  public lte(other: BigNumberish | Int256): boolean {
    if (other instanceof Int256) {
      return this.value.mul(BigNumber_BASE(other.base)).lte(other.value.mul(BigNumber_BASE(this.base)));
    }
    return this.value.lte(other);
  }

  public eq(other: BigNumberish | Int256): boolean {
    if (other instanceof Int256) {
      return this.value.mul(BigNumber_BASE(other.base)).eq(other.value.mul(BigNumber_BASE(this.base)));
    }
    return this.value.eq(other);
  }

  public gt(other: BigNumberish | Int256): boolean {
    if (other instanceof Int256) {
      return this.value.mul(BigNumber_BASE(other.base)).gt(other.value.mul(BigNumber_BASE(this.base)));
    }
    return this.value.gt(other);
  }

  public gte(other: BigNumberish | Int256): boolean {
    if (other instanceof Int256) {
      return this.value.mul(BigNumber_BASE(other.base)).gte(other.value.mul(BigNumber_BASE(this.base)));
    }
    return this.value.gte(other);
  }

  public add(other: Int256 | undefined): Int256 | undefined {
    if (!other) return undefined;
    return new Int256(
      this.value
        .mul(BigNumber_BASE(other.base))
        .add(other.value.mul(BigNumber_BASE(this.base)))
        .div(BigNumber_BASE(other.base)),
      this.base
    );
  }

  public sub(other: Int256 | undefined): Int256 | undefined {
    if (!other) return undefined;
    return new Int256(
      this.value
        .mul(BigNumber_BASE(other.base))
        .sub(other.value.mul(BigNumber_BASE(this.base)))
        .div(BigNumber_BASE(other.base)),
      this.base
    );
  }

  public mul(other: BigNumberish | Int256 | undefined): Int256 | undefined {
    if (!other) return undefined;
    if (other instanceof Int256) {
      return new Int256(this.value.mul(other.value).div(BigNumber_BASE(other.base)), this.base);
    }
    return new Int256(this.value.mul(other), this.base);
  }

  public div(other: BigNumberish | Int256 | undefined): Int256 | undefined {
    if (!other) return undefined;
    if (other instanceof Int256) {
      return new Int256(this.value.mul(BigNumber_BASE(other.base)).div(other.value), this.base);
    }
    return new Int256(this.value.div(other), this.base);
  }
}

export const Int_ZERO = Int256.from('0');
export const Int_ONE = Int256.parse('1');
export const Int_BASE = (base: number): Int256 => Int256.from(BigNumber_BASE(base), base);
export const Int_BASE_18 = Int_BASE(18);

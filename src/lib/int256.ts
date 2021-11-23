import { BigNumber, BigNumberish, utils } from 'ethers';
import numbro from 'numbro';

import { BigNumber_BASE } from '../types';

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

    if (num > 1e20) {
      // console.warn('Number too big', num);
      return numbro(Number.POSITIVE_INFINITY).format({ output });
    }

    if (round && num > 0 && 0.0001 > num) return '<0.0001';

    if (num > 0 && 1 > num && output === 'number') {
      const strs = num.toFixed(20).split('.');
      if (strs && strs.length && strs[1]) {
        for (const n of strs[1]) {
          if (n != '0') {
            break;
          }
          decimals += 1;
        }
      }
    }

    const opt: numbro.Format = {
      output,
      average: num > 10_000 ? true : false,
      mantissa: num > 1000 ? 2 : decimals,
      trimMantissa: true,
      // trimMantissa: true,
      abbreviations: {
        million: 'M',
        billion: 'B',
        trillion: 'T',
      },
    };

    return numbro(num).format(opt);
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

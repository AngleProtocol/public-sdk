import { BigNumber, ethers } from 'ethers';
import JSBI from 'jsbi';
import invariant from 'tiny-invariant';

// =========================== UTILITIES FOR UNISWAP ===========================

/**
 * The minimum tick that can be used on any pool.
 */
const MIN_TICK = -887272;
/**
 * The maximum tick that can be used on any pool.
 */
const MAX_TICK: number = -MIN_TICK;

/**
 * The sqrt ratio corresponding to the minimum tick that could be used on any pool.
 */
const MIN_SQRT_RATIO: JSBI = JSBI.BigInt('4295128739');

/**
 * The sqrt ratio corresponding to the maximum tick that could be used on any pool.
 */
const MAX_SQRT_RATIO: JSBI = JSBI.BigInt('1461446703485210103287273052203988822378723970342');

function mulShift(val: JSBI, mulBy: string): JSBI {
  return JSBI.signedRightShift(JSBI.multiply(val, JSBI.BigInt(mulBy)), JSBI.BigInt(128));
}
const Q32 = JSBI.exponentiate(JSBI.BigInt(2), JSBI.BigInt(32));
const Q96 = JSBI.exponentiate(JSBI.BigInt(2), JSBI.BigInt(96));
const MaxUint256 = JSBI.BigInt(ethers.constants.MaxUint256?.toString());
const ZERO = JSBI.BigInt(0);
const ONE = JSBI.BigInt(1);

/**
 * Returns the sqrt ratio as a Q64.96 for the given tick. The sqrt ratio is computed as sqrt(1.0001)^tick
 * @param tick the tick for which to compute the sqrt ratio
 */
function getSqrtRatioAtTick(tick: number): JSBI {
  invariant(tick >= MIN_TICK && tick <= MAX_TICK && Number.isInteger(tick), 'TICK');
  const absTick: number = tick < 0 ? tick * -1 : tick;

  let ratio: JSBI =
    (absTick & 0x1) != 0 ? JSBI.BigInt('0xfffcb933bd6fad37aa2d162d1a594001') : JSBI.BigInt('0x100000000000000000000000000000000');
  if ((absTick & 0x2) != 0) ratio = mulShift(ratio, '0xfff97272373d413259a46990580e213a');
  if ((absTick & 0x4) != 0) ratio = mulShift(ratio, '0xfff2e50f5f656932ef12357cf3c7fdcc');
  if ((absTick & 0x8) != 0) ratio = mulShift(ratio, '0xffe5caca7e10e4e61c3624eaa0941cd0');
  if ((absTick & 0x10) != 0) ratio = mulShift(ratio, '0xffcb9843d60f6159c9db58835c926644');
  if ((absTick & 0x20) != 0) ratio = mulShift(ratio, '0xff973b41fa98c081472e6896dfb254c0');
  if ((absTick & 0x40) != 0) ratio = mulShift(ratio, '0xff2ea16466c96a3843ec78b326b52861');
  if ((absTick & 0x80) != 0) ratio = mulShift(ratio, '0xfe5dee046a99a2a811c461f1969c3053');
  if ((absTick & 0x100) != 0) ratio = mulShift(ratio, '0xfcbe86c7900a88aedcffc83b479aa3a4');
  if ((absTick & 0x200) != 0) ratio = mulShift(ratio, '0xf987a7253ac413176f2b074cf7815e54');
  if ((absTick & 0x400) != 0) ratio = mulShift(ratio, '0xf3392b0822b70005940c7a398e4b70f3');
  if ((absTick & 0x800) != 0) ratio = mulShift(ratio, '0xe7159475a2c29b7443b29c7fa6e889d9');
  if ((absTick & 0x1000) != 0) ratio = mulShift(ratio, '0xd097f3bdfd2022b8845ad8f792aa5825');
  if ((absTick & 0x2000) != 0) ratio = mulShift(ratio, '0xa9f746462d870fdf8a65dc1f90e061e5');
  if ((absTick & 0x4000) != 0) ratio = mulShift(ratio, '0x70d869a156d2a1b890bb3df62baf32f7');
  if ((absTick & 0x8000) != 0) ratio = mulShift(ratio, '0x31be135f97d08fd981231505542fcfa6');
  if ((absTick & 0x10000) != 0) ratio = mulShift(ratio, '0x9aa508b5b7a84e1c677de54f3e99bc9');
  if ((absTick & 0x20000) != 0) ratio = mulShift(ratio, '0x5d6af8dedb81196699c329225ee604');
  if ((absTick & 0x40000) != 0) ratio = mulShift(ratio, '0x2216e584f5fa1ea926041bedfe98');
  if ((absTick & 0x80000) != 0) ratio = mulShift(ratio, '0x48a170391f7dc42444e8fa2');

  if (tick > 0) ratio = JSBI.divide(MaxUint256, ratio);

  // back to Q96
  return JSBI.greaterThan(JSBI.remainder(ratio, Q32), ZERO) ? JSBI.add(JSBI.divide(ratio, Q32), ONE) : JSBI.divide(ratio, Q32);
}

const TWO = JSBI.BigInt(2);
const POWERS_OF_2 = [128, 64, 32, 16, 8, 4, 2, 1].map((pow: number): [number, JSBI] => [pow, JSBI.exponentiate(TWO, JSBI.BigInt(pow))]);
function mostSignificantBit(x: JSBI): number {
  invariant(JSBI.greaterThan(x, ZERO), 'ZERO');
  invariant(JSBI.lessThanOrEqual(x, MaxUint256), 'MAX');

  let msb = 0;
  for (const [power, min] of POWERS_OF_2) {
    if (JSBI.greaterThanOrEqual(x, min)) {
      x = JSBI.signedRightShift(x, JSBI.BigInt(power));
      msb += power;
    }
  }
  return msb;
}

/**
 * Returns the tick corresponding to a given sqrt ratio, s.t. #getSqrtRatioAtTick(tick) <= sqrtRatioX96
 * and #getSqrtRatioAtTick(tick + 1) > sqrtRatioX96
 * @param sqrtRatioX96 the sqrt ratio as a Q64.96 for which to compute the tick
 */
export function getTickAtSqrtRatio(sqrtRatioX96: JSBI): number {
  invariant(JSBI.greaterThanOrEqual(sqrtRatioX96, MIN_SQRT_RATIO) && JSBI.lessThan(sqrtRatioX96, MAX_SQRT_RATIO), 'SQRT_RATIO');

  const sqrtRatioX128 = JSBI.leftShift(sqrtRatioX96, JSBI.BigInt(32));

  const msb = mostSignificantBit(sqrtRatioX128);

  let r: JSBI;
  if (JSBI.greaterThanOrEqual(JSBI.BigInt(msb), JSBI.BigInt(128))) {
    r = JSBI.signedRightShift(sqrtRatioX128, JSBI.BigInt(msb - 127));
  } else {
    r = JSBI.leftShift(sqrtRatioX128, JSBI.BigInt(127 - msb));
  }

  let log_2: JSBI = JSBI.leftShift(JSBI.subtract(JSBI.BigInt(msb), JSBI.BigInt(128)), JSBI.BigInt(64));

  for (let i = 0; i < 14; i++) {
    r = JSBI.signedRightShift(JSBI.multiply(r, r), JSBI.BigInt(127));
    const f = JSBI.signedRightShift(r, JSBI.BigInt(128));
    log_2 = JSBI.bitwiseOr(log_2, JSBI.leftShift(f, JSBI.BigInt(63 - i)));
    r = JSBI.signedRightShift(r, f);
  }

  const log_sqrt10001 = JSBI.multiply(log_2, JSBI.BigInt('255738958999603826347141'));

  const tickLow = JSBI.toNumber(
    JSBI.signedRightShift(JSBI.subtract(log_sqrt10001, JSBI.BigInt('3402992956809132418596140100660247210')), JSBI.BigInt(128))
  );
  const tickHigh = JSBI.toNumber(
    JSBI.signedRightShift(JSBI.add(log_sqrt10001, JSBI.BigInt('291339464771989622907027621153398088495')), JSBI.BigInt(128))
  );

  return tickLow === tickHigh ? tickLow : JSBI.lessThanOrEqual(getSqrtRatioAtTick(tickHigh), sqrtRatioX96) ? tickHigh : tickLow;
}

export const getAmount0ForLiquidity = (lowerTick: number, upperTick: number, liquidity: BigNumber): BigNumber => {
  let sqrtRatioAX96 = getSqrtRatioAtTick(lowerTick);
  let sqrtRatioBX96 = getSqrtRatioAtTick(upperTick);

  if (JSBI.greaterThan(sqrtRatioAX96, sqrtRatioBX96)) {
    sqrtRatioAX96 = sqrtRatioBX96;
    sqrtRatioBX96 = sqrtRatioAX96;
  }

  let JSBIRes = JSBI.multiply(JSBI.BigInt(liquidity?.shl(96).toString()), JSBI.subtract(sqrtRatioBX96, sqrtRatioAX96));
  JSBIRes = JSBI.divide(JSBIRes, sqrtRatioBX96);
  JSBIRes = JSBI.divide(JSBIRes, sqrtRatioAX96);

  const res = BigNumber.from(JSBIRes?.toString());
  return res;
};

const getAmount1ForLiquidity = (lowerTick: number, upperTick: number, liquidity: BigNumber): BigNumber => {
  let sqrtRatioAX96 = getSqrtRatioAtTick(lowerTick);
  let sqrtRatioBX96 = getSqrtRatioAtTick(upperTick);
  if (JSBI.greaterThan(sqrtRatioAX96, sqrtRatioBX96)) {
    sqrtRatioAX96 = sqrtRatioBX96;
    sqrtRatioBX96 = sqrtRatioAX96;
  }

  let JSBIRes = JSBI.multiply(JSBI.BigInt(liquidity?.toString()), JSBI.subtract(sqrtRatioBX96, sqrtRatioAX96));
  JSBIRes = JSBI.divide(JSBIRes, Q96);

  const res = BigNumber.from(JSBIRes?.toString());
  return res;
};

export const getAmountsForLiquidity = (tick: number, lowerTick: number, upperTick: number, liquidity: BigNumber) => {
  let sqrtRatioAX96 = getSqrtRatioAtTick(lowerTick);
  let sqrtRatioBX96 = getSqrtRatioAtTick(upperTick);
  const sqrtRatioX96 = getSqrtRatioAtTick(tick);
  if (JSBI.greaterThan(sqrtRatioAX96, sqrtRatioBX96)) {
    sqrtRatioAX96 = sqrtRatioBX96;
    sqrtRatioBX96 = sqrtRatioAX96;
  }

  let amount0 = BigNumber.from(0);
  let amount1 = BigNumber.from(0);
  if (JSBI.greaterThan(sqrtRatioAX96, sqrtRatioX96)) {
    amount0 = getAmount0ForLiquidity(lowerTick, upperTick, liquidity);
  } else if (JSBI.greaterThan(sqrtRatioBX96, sqrtRatioX96)) {
    amount0 = getAmount0ForLiquidity(tick, upperTick, liquidity);
    amount1 = getAmount1ForLiquidity(lowerTick, tick, liquidity);
  } else {
    amount1 = getAmount1ForLiquidity(lowerTick, upperTick, liquidity);
  }
  return [amount0, amount1];
};

export const getLiquidityForAmount0 = (lowerTick: number, upperTick: number, amount0: BigNumber): BigNumber => {
  let sqrtRatioAX96 = getSqrtRatioAtTick(lowerTick);
  let sqrtRatioBX96 = getSqrtRatioAtTick(upperTick);

  if (JSBI.greaterThan(sqrtRatioAX96, sqrtRatioBX96)) {
    sqrtRatioAX96 = sqrtRatioBX96;
    sqrtRatioBX96 = sqrtRatioAX96;
  }

  const intermediate = JSBI.divide(JSBI.multiply(sqrtRatioAX96, sqrtRatioBX96), Q96);
  let JSBIRes = JSBI.multiply(JSBI.BigInt(amount0?.toString()), intermediate);
  JSBIRes = JSBI.divide(JSBIRes, JSBI.subtract(sqrtRatioBX96, sqrtRatioAX96));

  return BigNumber.from(JSBIRes?.toString());
};

export const getLiquidityForAmount1 = (lowerTick: number, upperTick: number, amount1: BigNumber): BigNumber => {
  let sqrtRatioAX96 = getSqrtRatioAtTick(lowerTick);
  let sqrtRatioBX96 = getSqrtRatioAtTick(upperTick);

  if (JSBI.greaterThan(sqrtRatioAX96, sqrtRatioBX96)) {
    sqrtRatioAX96 = sqrtRatioBX96;
    sqrtRatioBX96 = sqrtRatioAX96;
  }

  let JSBIRes = JSBI.multiply(JSBI.BigInt(amount1?.toString()), Q96);
  JSBIRes = JSBI.divide(JSBIRes, JSBI.subtract(sqrtRatioBX96, sqrtRatioAX96));

  return BigNumber.from(JSBIRes?.toString());
};

export const getLiquidityForAmounts = (
  tick: number,
  lowerTick: number,
  upperTick: number,
  amount0: BigNumber,
  amount1: BigNumber
): BigNumber => {
  let sqrtRatioAX96 = getSqrtRatioAtTick(lowerTick);
  let sqrtRatioBX96 = getSqrtRatioAtTick(upperTick);
  const sqrtRatioX96 = getSqrtRatioAtTick(tick);
  if (JSBI.greaterThan(sqrtRatioAX96, sqrtRatioBX96)) {
    sqrtRatioAX96 = sqrtRatioBX96;
    sqrtRatioBX96 = sqrtRatioAX96;
  }

  if (JSBI.greaterThan(sqrtRatioAX96, sqrtRatioX96)) {
    return getLiquidityForAmount0(lowerTick, upperTick, amount0);
  } else if (JSBI.greaterThan(sqrtRatioBX96, sqrtRatioX96)) {
    const liquidity0 = getLiquidityForAmount0(tick, upperTick, amount0);
    const liquidity1 = getLiquidityForAmount1(lowerTick, tick, amount1);

    return liquidity0?.gt(liquidity1) ? liquidity1 : liquidity0;
  } else {
    return getLiquidityForAmount1(lowerTick, upperTick, amount1);
  }
};

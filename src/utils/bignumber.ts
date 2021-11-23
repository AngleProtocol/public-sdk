import { BigNumber, BigNumberish, utils } from 'ethers';
import invariant from 'tiny-invariant';

// ethersToBN
export function mwei(number: number | BigNumber | string): BigNumber {
  return utils.parseUnits(number.toString(), 'mwei');
}

// ethersToBN
export function multByPow(number: BigNumberish, pow: BigNumberish): BigNumber {
  return utils.parseUnits(number.toString(), pow);
}

//
export function multBy10e15(number: number | BigNumber): BigNumber {
  return utils.parseUnits(number.toString(), 15);
}

// gweiToBN
export function multBy10e9(number: number): BigNumber {
  return utils.parseUnits(number.toString(), 'gwei');
}

// BNtoEth
export function divBy10e18(bigNumber: BigNumberish): number {
  return parseFloat(utils.formatUnits(bigNumber, 'ether'));
}

// BNtoEth
export function divBy10ePow(bigNumber: BigNumberish, pow: number | BigNumber): number {
  return parseFloat(utils.formatUnits(bigNumber, pow));
}

export function gwei(number: BigNumberish): BigNumber {
  return utils.parseUnits(number.toString(), 'gwei');
}
function formatGwei(number: BigNumberish): string {
  return utils.formatUnits(number, 'gwei');
}

export function ether(number: BigNumberish): BigNumber {
  return utils.parseUnits(number.toString(), 'ether');
}
function formatEther(number: BigNumberish): string {
  return utils.formatEther(number);
}

function dai(number: BigNumberish): BigNumber {
  return utils.parseUnits(number.toString(), 18);
}
function formatDai(number: BigNumberish): string {
  return utils.formatEther(number);
}

function usdc(number: BigNumberish): BigNumber {
  return utils.parseUnits(number.toString(), 6);
}
function formatUsdc(number: BigNumberish): string {
  return utils.formatUnits(number, 6);
}

function wbtc(number: BigNumberish): BigNumber {
  return utils.parseUnits(number.toString(), 8);
}
function formatWbtc(number: BigNumberish): string {
  return utils.formatUnits(number, 8);
}

export const parseAmount = {
  ether,
  dai,
  usdc,
  gwei,
  wbtc,
};

export const formatAmount = {
  ether: formatEther,
  dai: formatDai,
  usdc: formatUsdc,
  gwei: formatGwei,
  wbtc: formatWbtc,
};

export function piecewiseFunction(value: BigNumber, xArray: BigNumber[], yArray: BigNumber[]): BigNumber {
  if (value.gte(xArray[xArray.length - 1])) {
    return yArray[yArray.length - 1];
  }
  if (value.lte(xArray[0])) {
    return yArray[0];
  }

  let i = 0;
  while (value.gte(xArray[i + 1])) {
    i += 1;
  }
  const pct = value
    .sub(xArray[i])
    .mul(gwei(1))
    .div(xArray[i + 1].sub(xArray[i]));
  const normalized = pct
    .mul(yArray[i + 1].sub(yArray[i]))
    .div(gwei(1))
    .add(yArray[i]);

  return normalized;
}

/**
 * Computes floor(sqrt(value))
 * @param value - the value for which to compute the square root, rounded down
 */
export function sqrt(value: BigNumber): BigNumber {
  invariant(value.gte(0), 'NEGATIVE');

  // rely on built in sqrt if possible
  if (value.lt(Number.MAX_SAFE_INTEGER)) {
    return BigNumber.from(Math.floor(Math.sqrt(value.toNumber())));
  }

  let z: BigNumber = value.add(1).div(2);
  let y: BigNumber = value;
  while (z.sub(y).isNegative()) {
    y = z;
    z = value.div(z).add(z).div(2);
  }
  return y;
}

import { expect } from 'chai';

import constants from '../../src/constants';
import { computeHedgeRatio } from '../../src/helpers/spread';
import { divBy10ePow, ether, gwei, piecewiseFunction } from '../../src/utils/bignumber';

describe('Spread', () => {
  it('computeUserSpread - edge case', () => {
    const totalCoveredAmount = ether(1000);
    const colFromUsers = ether(700);
    const targetHAHedge = gwei(1);

    const spread = computeHedgeRatio(totalCoveredAmount, targetHAHedge, colFromUsers);
    expect(divBy10ePow(spread, 9)).to.equal(1);
  });
  it('computeUserSpread - targetHAHedge 1', () => {
    const totalCoveredAmount = ether(700);
    const colFromUsers = ether(1000);
    const targetHAHedge = gwei(1);

    const spread = computeHedgeRatio(totalCoveredAmount, targetHAHedge, colFromUsers);
    expect(divBy10ePow(spread, 9)).to.equal(0.7);
  });
  it('computeUserSpread - targetHAHedge 0.8', () => {
    const totalCoveredAmount = ether(700);
    const colFromUsers = ether(1000);
    const targetHAHedge = gwei(0.8);

    const spread = computeHedgeRatio(totalCoveredAmount, targetHAHedge, colFromUsers);
    expect(divBy10ePow(spread, 9)).to.equal(0.875);
  });
  it('computeUserSpread', () => {
    const totalCoveredAmount = ether(550);
    const colFromUsers = ether(1000);
    const targetHAHedge = gwei(1);

    const spread = computeHedgeRatio(totalCoveredAmount, targetHAHedge, colFromUsers);
    expect(divBy10ePow(spread, 9)).to.equal(0.55);
    const feeMint = piecewiseFunction(
      spread,
      constants(0).poolsParameters!.EUR.USDC.xFeeMint,
      constants(0).poolsParameters!.EUR.USDC.yFeeMint
    );
    expect(divBy10ePow(feeMint, 9)).to.equal(0.015);
  });
});

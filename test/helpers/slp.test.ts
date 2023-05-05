import { expect } from 'chai';

import getConstants from '../../src/constants';
import { CollatRatioParams, estimateSlippage, simulateWithdraw } from '../../src/helpers/slp';
import { divBy10e18, divBy10ePow, ether } from '../../src/utils/bignumber';

describe('SLPs', () => {
  const constants = getConstants(1);
  describe('estimateSlippage', () => {
    let collatRatioParams: CollatRatioParams;

    it('should compute correct slippage', () => {
      collatRatioParams = {
        agTokensMinted: ether(1000),
        amountInProtocol: [ether(1200)],
        inDecimals: [constants.DECIMAL_TOKENS],
        rates: [constants.BASE_TOKENS],
      };
      const { slippage } = estimateSlippage(42, 'EUR', 'USDC', undefined, collatRatioParams);
      expect(divBy10ePow(slippage, 9)).to.equal(0.1);
    });

    it('compute slippage', () => {
      collatRatioParams = {
        agTokensMinted: ether(1000),
        amountInProtocol: [ether(800)],
        inDecimals: [constants.DECIMAL_TOKENS],
        rates: [constants.BASE_TOKENS],
      };
      const { slippage } = estimateSlippage(42, 'EUR', 'USDC', undefined, collatRatioParams);
      expect(divBy10ePow(slippage, 9)).to.equal(0.32);
    });

    it('should return 0', () => {
      collatRatioParams = {
        agTokensMinted: ether(0),
        amountInProtocol: [ether(800)],
        inDecimals: [constants.DECIMAL_TOKENS],
        rates: [constants.BASE_TOKENS],
      };
      const { slippage } = estimateSlippage(42, 'EUR', 'USDC', undefined, collatRatioParams);
      expect(divBy10ePow(slippage, 9)).to.equal(0);
    });
  });

  describe('simulateWithdraw', () => {
    let collatRatioParams: CollatRatioParams = {
      agTokensMinted: ether(1000),
      amountInProtocol: [ether(800)],
      inDecimals: [constants.DECIMAL_TOKENS],
      rates: [constants.BASE_TOKENS],
    };

    it('returns lower amount due to slippage', () => {
      const sanTokens = ether(1000);
      const sanRate = ether(1.1);
      const withdraw = simulateWithdraw(42, 'EUR', 'USDC', sanTokens, sanRate, undefined, collatRatioParams);
      expect(divBy10e18(withdraw)).to.equal(748);
    });

    it('has no slippage', () => {
      collatRatioParams = {
        agTokensMinted: ether(1000),
        amountInProtocol: [ether(2000)],
        inDecimals: [constants.DECIMAL_TOKENS],
        rates: [constants.BASE_TOKENS],
      };
      const sanTokens = ether(1000);
      const sanRate = ether(1.1);
      const withdraw = simulateWithdraw(42, 'EUR', 'USDC', sanTokens, sanRate, undefined, collatRatioParams);
      expect(divBy10e18(withdraw)).to.equal(1100);
    });
  });
});

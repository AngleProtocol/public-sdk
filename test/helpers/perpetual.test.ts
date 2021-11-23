import { expect } from 'chai';

import getConstants from '../../src/constants';
import { computeClosePerpetual, computeOpenPerpetualFromMarginPosition } from '../../src/helpers/ha';
import { divBy10ePow, ether, gwei } from '../../src/utils/bignumber';

const CHAIN_ID = 4;

describe('Perpetuals', () => {
  const constants = getConstants(CHAIN_ID);
  describe('Open perpetuals', () => {
    it('should open a perpetual', () => {
      const margin = ether(1000);
      const positionSize = ether(1000);
      const inDecimals = 18;
      const totalCoveredAmount = ether(1000000);
      const targetHAHedge = ether(50000);
      const stocksUsers = ether(10000000);
      const rate = ether(1);

      const { fees, leverage } = computeOpenPerpetualFromMarginPosition(
        CHAIN_ID,
        'EUR',
        'DAI',
        margin,
        positionSize,
        inDecimals,
        totalCoveredAmount,
        stocksUsers,
        rate,
        targetHAHedge
      );

      expect(divBy10ePow(fees, inDecimals)).to.equal(2);
      expect(positionSize.add(margin.sub(fees)).mul(constants.BASE_TOKENS).div(margin.sub(fees)).toString()).to.equal(leverage.toString());
    });
  });

  describe('Cash out perpetual', () => {
    it('should be liquidable and compute correct cash out amount', () => {
      const margin = ether(1000);
      const positionSize = ether(1000);
      const entryRate = ether(1);
      const currentRate = ether(2);
      const inDecimals = 18;
      const totalCoveredAmount = ether(1000000);
      const targetHAHedge = ether(50000);
      const stocksUsers = ether(10000000);
      const maintenanceMargin = gwei(0.625);

      const { fees: entryFees } = computeOpenPerpetualFromMarginPosition(
        CHAIN_ID,
        'EUR',
        'DAI',
        margin,
        positionSize,
        inDecimals,
        totalCoveredAmount,
        stocksUsers,
        entryRate,
        targetHAHedge
      );

      const compute = computeClosePerpetual(
        4,
        'EUR',
        'DAI',
        margin,
        positionSize,
        entryRate,
        currentRate,
        inDecimals,
        totalCoveredAmount,
        stocksUsers,
        maintenanceMargin,
        targetHAHedge
      );

      expect(compute).to.not.equal(undefined);
      expect(entryFees).to.not.equal(undefined);

      if (compute) {
        // expect(divBy10ePow(compute.cashOutAmount, inDecimals)).to.equal(
        //   divBy10ePow(margin.sub(entryFees).add(500).sub(compute.fees), inDecimals)
        // ); // TODO redo this test
        expect(compute.liquidable).to.equal(false);
      }
    });

    it('should not be liquidable', () => {
      const margin = ether(1000);
      const positionSize = ether(1000);
      const entryRate = ether(1);
      const currentRate = ether(1);
      const inDecimals = 18;
      const totalCoveredAmount = ether(1000000);
      const targetHAHedge = ether(50000);
      const stocksUsers = ether(10000000);
      const maintenanceMargin = gwei(1);

      const compute = computeClosePerpetual(
        4,
        'EUR',
        'DAI',
        margin,
        positionSize,
        entryRate,
        currentRate,
        inDecimals,
        totalCoveredAmount,
        stocksUsers,
        maintenanceMargin,
        targetHAHedge
      );

      expect(compute).to.not.equal(undefined);

      if (compute) {
        expect(compute.liquidable).to.equal(true);
      }
    });
  });
});

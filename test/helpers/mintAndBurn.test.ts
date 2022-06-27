import { expect } from 'chai';

import { computeBonusMalusMint, computeCollateralRatio } from '../../src/helpers/feeManager';
import { computeBurn, computeFeeBurn, computeFeeMint, computeMint } from '../../src/helpers/user';
import { divBy10e18, divBy10ePow, ether, gwei, mwei } from '../../src/utils/bignumber';

const precisionDigits = 15;
describe('User interaction', () => {
  describe('Bonus / Malus', () => {
    it('bonusMalusMint - simple', () => {
      const agTokensMinted = ether(1000);
      const amountInProtocol = [ether(800)];
      const inDecimal = [18];
      const rates = [ether(2)];

      const collatRatio = computeCollateralRatio(agTokensMinted, amountInProtocol, inDecimal, rates);
      const bonusMalusMint = computeBonusMalusMint(42, 'EUR', 'USDC', collatRatio);

      expect(divBy10ePow(bonusMalusMint, 9)).to.equal(1);
    });
    it('bonusMalusMint - hard', () => {
      const agTokensMinted = ether(1000);
      const amountInProtocol = [ether(150), gwei(200), mwei(100)];
      const inDecimal = [18, 9, 6];
      const rates = [ether(2), ether(1), ether(2.5)];

      const collatRatio = computeCollateralRatio(agTokensMinted, amountInProtocol, inDecimal, rates);
      const bonusMalusMint = computeBonusMalusMint(42, 'EUR', 'USDC', collatRatio);

      expect(divBy10ePow(bonusMalusMint, 9)).to.equal(0.9);
    });
    it('reverts - on unknown chain', () => {
      const agTokensMinted = ether(1000);
      const amountInProtocol = [ether(800)];
      const inDecimal = [18];
      const rates = [ether(2)];

      const collatRatio = computeCollateralRatio(agTokensMinted, amountInProtocol, inDecimal, rates);
      try {
        computeBonusMalusMint(137, 'EUR', 'USDC', collatRatio);
        expect(1).to.equal(0);
      } catch (e) {
        expect(1).to.equal(1);
      }
    });
    // no need to test for bonusMalusBurn as it is using the same function.
  });
  describe('Mint operations', () => {
    it('computeFeeMint - 1', () => {
      const amount = ether(100);
      const totalCoveredAmount = ether(550);
      const stocksUsers = ether(900);
      const targetHAHedge = gwei(1);
      const agTokensMinted = ether(1000);
      const amountInProtocol = [ether(1000)];
      const inDecimal = [18];
      const rates = [ether(2)];

      const collatRatio = computeCollateralRatio(agTokensMinted, amountInProtocol, inDecimal, rates);

      const { percentageFee } = computeFeeMint(42, 'EUR', 'USDC', amount, totalCoveredAmount, stocksUsers, collatRatio, targetHAHedge);
      // the fees coming from the spread market making is 0.015
      // the fees from the bonus malus mint are 1
      expect(divBy10ePow(percentageFee, 9)).to.equal(0.015);
    });
    it('computeFeeMint - 2', () => {
      const amount = ether(100);
      const totalCoveredAmount = ether(900);
      const stocksUsers = ether(900);
      const targetHAHedge = gwei(1);
      const agTokensMinted = ether(1000);
      const amountInProtocol = [ether(1000)];
      const inDecimal = [18];
      const rates = [ether(2)];

      const collatRatio = computeCollateralRatio(agTokensMinted, amountInProtocol, inDecimal, rates);

      const { percentageFee } = computeFeeMint(42, 'EUR', 'USDC', amount, totalCoveredAmount, stocksUsers, collatRatio, targetHAHedge);
      // the fees coming from the spread market making is 0.003
      // the fees fron the bonus malus mint are 1
      expect(divBy10ePow(percentageFee, 9)).to.be.closeTo(0.003, precisionDigits);
    });
    it('computeFeeMint - 3', () => {
      const amount = ether(100);
      const totalCoveredAmount = ether(900);
      const stocksUsers = ether(900);
      const targetHAHedge = gwei(1);
      const agTokensMinted = ether(1000);
      const amountInProtocol = [ether(150), gwei(200), mwei(100)];
      const inDecimal = [18, 9, 6];
      const rates = [ether(2), ether(1), ether(2.5)];

      const collatRatio = computeCollateralRatio(agTokensMinted, amountInProtocol, inDecimal, rates);

      const { percentageFee } = computeFeeMint(42, 'EUR', 'USDC', amount, totalCoveredAmount, stocksUsers, collatRatio, targetHAHedge);
      // the fees coming from the spread market making is 0.003
      // the fees fron the bonus malus mint are 1
      expect(divBy10ePow(percentageFee, 9)).to.be.closeTo(0.0027, precisionDigits);
    });
    it('computeMint - 1', () => {
      const amount = ether(50);
      const inDecimal = 18;
      const rate = ether(2);
      const totalCoveredAmount = ether(550);
      const stocksUsers = ether(900);
      const targetHAHedge = gwei(1);
      const agTokensMinted = ether(1000);
      const amountInProtocol = [ether(1000)];
      const allinDecimals = [18];
      const allCollatRates = [ether(2)];

      const collatRatio = computeCollateralRatio(agTokensMinted, amountInProtocol, allinDecimals, allCollatRates);

      const { amountForUserInStable, mintingFee } = computeMint(
        0,
        'EUR',
        'USDC',
        amount,
        inDecimal,
        rate,
        totalCoveredAmount,
        stocksUsers,
        collatRatio,
        targetHAHedge
      );
      // const { amountOfCollateralNeeded } = computeInverseMint(
      //   amountForUserInStable,
      //   inDecimal,
      //   rate,
      //   totalCoveredAmount,
      //   stocksUsers,
      //   targetHAHedge,
      //   collatRatio
      // );

      expect(divBy10e18(mintingFee)).to.equal(0.75);
      expect(divBy10e18(amountForUserInStable)).to.equal(98.5);
    });
    it('computeMint - 2', () => {
      const amount = ether(100);
      const inDecimal = 18;
      const rate = ether(2);
      const totalCoveredAmount = ether(900);
      const stocksUsers = ether(900);
      const targetHAHedge = gwei(1);
      const agTokensMinted = ether(1000);
      const amountInProtocol = [ether(1000)];
      const allinDecimals = [18];
      const allCollatRates = [ether(2)];

      const collatRatio = computeCollateralRatio(agTokensMinted, amountInProtocol, allinDecimals, allCollatRates);

      const { amountForUserInStable, mintingFee } = computeMint(
        0,
        'EUR',
        'USDC',
        amount,
        inDecimal,
        rate,
        totalCoveredAmount,
        stocksUsers,
        collatRatio,
        targetHAHedge
      );

      // const { amountOfCollateralNeeded } = computeInverseMint(
      //   amountForUserInStable,
      //   inDecimal,
      //   rate,
      //   totalCoveredAmount,
      //   stocksUsers,
      //   targetHAHedge,
      //   collatRatio
      // );

      // the feeMint is 0.003
      expect(divBy10e18(mintingFee)).to.be.closeTo(0.3, precisionDigits);
      expect(divBy10e18(amountForUserInStable)).to.be.closeTo(99.7 * 2, precisionDigits);
    });
    it('computeMint - 3', () => {
      const amount = ether(100);
      const inDecimal = 18;
      const rate = ether(2);
      const totalCoveredAmount = ether(900);
      const stocksUsers = ether(900);
      const targetHAHedge = gwei(1);
      const agTokensMinted = ether(1000);
      const amountInProtocol = [ether(150), gwei(200), mwei(100)];
      const allinDecimals = [18, 9, 6];
      const allCollatRates = [ether(2), ether(1), ether(2.5)];

      const collatRatio = computeCollateralRatio(agTokensMinted, amountInProtocol, allinDecimals, allCollatRates);

      const { amountForUserInStable, mintingFee } = computeMint(
        0,
        'EUR',
        'USDC',
        amount,
        inDecimal,
        rate,
        totalCoveredAmount,
        stocksUsers,
        collatRatio,
        targetHAHedge
      );
      // const { amountOfCollateralNeeded } = computeInverseMint(
      //   amountForUserInStable,
      //   inDecimal,
      //   rate,
      //   totalCoveredAmount,
      //   stocksUsers,
      //   targetHAHedge,
      //   collatRatio
      // );

      // the feeMint is 0.003
      expect(divBy10e18(mintingFee)).to.be.closeTo(0.27, precisionDigits);
      expect(divBy10e18(amountForUserInStable)).to.be.closeTo(99.73 * 2, precisionDigits);
    });
  });
  describe('Burn operations', () => {
    it('computeFeeBurn - 1', () => {
      const amount = ether(100);
      const totalCoveredAmount = ether(400);
      const stocksUsers = ether(600);
      const targetHAHedge = gwei(1);
      const agTokensMinted = ether(1000);
      const amountInProtocol = [ether(1000)];
      const inDecimal = [18];
      const rates = [ether(2)];

      const collatRatio = computeCollateralRatio(agTokensMinted, amountInProtocol, inDecimal, rates);

      const { percentageFee } = computeFeeBurn(0, 'EUR', 'USDC', amount, totalCoveredAmount, stocksUsers, collatRatio, targetHAHedge);
      // the fees coming from the spread market making is 0.01
      // the fees fron the bonus malus burn are 1
      expect(divBy10ePow(percentageFee, 9)).to.equal(0.01);
    });
    it('computeFeeBurn - 2', () => {
      const amount = ether(100);
      const totalCoveredAmount = ether(0);
      const stocksUsers = ether(600);
      const targetHAHedge = gwei(1);
      const agTokensMinted = ether(1000);
      const amountInProtocol = [ether(1000)];
      const inDecimal = [18];
      const rates = [ether(2)];

      const collatRatio = computeCollateralRatio(agTokensMinted, amountInProtocol, inDecimal, rates);

      const { percentageFee } = computeFeeBurn(42, 'EUR', 'USDC', amount, totalCoveredAmount, stocksUsers, collatRatio, targetHAHedge);
      // the fees coming from the spread market making is 0.01
      // the fees fron the bonus malus burn are 1
      expect(divBy10ePow(percentageFee, 9)).to.equal(0.002);
    });
    it('computeFeeBurn - 3', () => {
      const amount = ether(100);
      const totalCoveredAmount = ether(0);
      const stocksUsers = ether(600);
      const targetHAHedge = gwei(1);
      const agTokensMinted = ether(1000);
      const amountInProtocol = [ether(150), gwei(200), mwei(100)];
      const inDecimal = [18, 9, 6];
      const rates = [ether(2), ether(1), ether(2.5)];

      const collatRatio = computeCollateralRatio(agTokensMinted, amountInProtocol, inDecimal, rates);

      const { percentageFee } = computeFeeBurn(42, 'EUR', 'USDC', amount, totalCoveredAmount, stocksUsers, collatRatio, targetHAHedge);
      // the fees coming from the spread market making is 0.01
      // the fees fron the bonus malus burn are 1
      expect(divBy10ePow(percentageFee, 9)).to.equal(0.002 * 2.75);
    });
    it('computeBurn - 1', () => {
      const amount = ether(100);
      const inDecimal = 18;
      const rate = ether(2);
      const totalCoveredAmount = ether(400);
      const stocksUsers = ether(600);
      const targetHAHedge = gwei(1);
      const agTokensMinted = ether(1000);
      const amountInProtocol = [ether(1000)];
      const allinDecimals = [18];
      const allCollatRates = [ether(2)];

      const collatRatio = computeCollateralRatio(agTokensMinted, amountInProtocol, allinDecimals, allCollatRates);

      const { amountForUserInCollateral, burningFee } = computeBurn(
        0,
        'EUR',
        'USDC',
        amount,
        inDecimal,
        rate,
        totalCoveredAmount,
        stocksUsers,
        collatRatio,
        targetHAHedge
      );

      // const { amountOfStablecoinNeeded } = computeInverseBurn(
      //   amountForUserInCollateral,
      //   inDecimal,
      //   rate,
      //   totalCoveredAmount,
      //   stocksUsers,
      //   targetHAHedge,
      //   collatRatio
      // );

      // the fees coming from the spread market making is 0.01
      // the fees fron the bonus malus burn are 1
      expect(divBy10e18(burningFee)).to.equal(0.5);
      expect(divBy10e18(amountForUserInCollateral)).to.equal(99 / 2);
    });
    it('computeBurn - 2', () => {
      const amount = ether(200);
      const inDecimal = 18;
      const rate = ether(2);
      const totalCoveredAmount = ether(0);
      const stocksUsers = ether(600);
      const targetHAHedge = gwei(1);
      const agTokensMinted = ether(1000);
      const amountInProtocol = [ether(1000)];
      const allinDecimals = [18];
      const allCollatRates = [ether(2)];

      const collatRatio = computeCollateralRatio(agTokensMinted, amountInProtocol, allinDecimals, allCollatRates);

      const { amountForUserInCollateral, burningFee } = computeBurn(
        0,
        'EUR',
        'USDC',
        amount,
        inDecimal,
        rate,
        totalCoveredAmount,
        stocksUsers,
        collatRatio,
        targetHAHedge
      );

      // const { amountOfStablecoinNeeded } = computeInverseBurn(
      //   amountForUserInCollateral,
      //   inDecimal,
      //   rate,
      //   totalCoveredAmount,
      //   stocksUsers,
      //   targetHAHedge,
      //   collatRatio
      // );

      // the fees coming from the spread market making is 0.01
      // the fees fron the bonus malus burn are 1
      expect(divBy10e18(burningFee)).to.equal(0.2);
      expect(divBy10e18(amountForUserInCollateral)).to.equal(99.8);
    });
    it('computeBurn - 3', () => {
      const amount = ether(200);
      const inDecimal = 18;
      const rate = ether(2);
      const totalCoveredAmount = ether(0);
      const stocksUsers = ether(600);
      const targetHAHedge = gwei(1);
      const agTokensMinted = ether(1000);
      const amountInProtocol = [ether(150), gwei(200), mwei(100)];
      const allinDecimals = [18, 9, 6];
      const allCollatRates = [ether(2), ether(1), ether(2.5)];

      const collatRatio = computeCollateralRatio(agTokensMinted, amountInProtocol, allinDecimals, allCollatRates);

      const { amountForUserInCollateral, burningFee } = computeBurn(
        0,
        'EUR',
        'USDC',
        amount,
        inDecimal,
        rate,
        totalCoveredAmount,
        stocksUsers,
        collatRatio,
        targetHAHedge
      );

      // const { amountOfStablecoinNeeded } = computeInverseBurn(
      //   amountForUserInCollateral,
      //   inDecimal,
      //   rate,
      //   totalCoveredAmount,
      //   stocksUsers,
      //   targetHAHedge,
      //   collatRatio
      // );

      // the fees coming from the spread market making is 0.01
      // the fees fron the bonus malus burn are 1
      expect(divBy10e18(burningFee)).to.equal(0.2 * 2.75);
      expect(divBy10e18(amountForUserInCollateral)).to.equal(100 - 0.2 * 2.75);
    });
  });
});

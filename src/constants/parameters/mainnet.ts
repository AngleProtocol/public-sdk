import { BigNumber } from 'ethers';
import { parseEther } from 'ethers/lib/utils';

import { parseAmount } from '../../utils/bignumber';
import { StablesParameters } from './types';

// agTokens specific parameters
// const yearlyRate = 1.005; // This makes 0.5% a year
// To get the interest rate, just solve:
// (1+ratePerSecond)**(1 year) = yearlyRate => ratePerSecond = yearlyRate**(1 / (1 year)) - 1
// Mathematically, this gives:
// const ratePerSecond = yearlyRate ** (1 / (365 * 24 * 3600)) - 1;
// Interest rate is in base 27, since there may be some rounding errors, we obtained the corresponding
// figure manually on Python
const interestRate05 = BigNumber.from('158153934393112649');
const interestRate15 = BigNumber.from('472114791705280367');
const interestRate20 = BigNumber.from('627937257746680188');
const interestRate25 = BigNumber.from('782997666703977302');
const stablesParameters: StablesParameters = {
  EUR: {
    currencySymbol: '€',
    flashloan: {
      // 3m at the moment, should not be too big with respect to the total agEUR in circulation
      maxBorrowable: parseAmount.ether('3000000'),
      // Free flash loans for agEUR
      flashLoanFee: parseAmount.gwei('0'),
    },
    vaultManagers: [
      {
        collateral: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
        symbol: 'wETH-EUR',
        oracle: 'ETH_EUR',
        params: {
          debtCeiling: parseEther('10000000'),
          collateralFactor: parseAmount.gwei('0.835'),
          targetHealthFactor: parseAmount.gwei('1.1'),
          borrowFee: parseAmount.gwei('0'),
          repayFee: parseAmount.gwei('0'),
          interestRate: interestRate05,
          liquidationSurcharge: parseAmount.gwei('0.98'),
          maxLiquidationDiscount: parseAmount.gwei('0.06'),
          whitelistingActivated: false,
          baseBoost: parseAmount.gwei('0.7'),
        },
      },
      {
        collateral: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
        symbol: 'wBTC-EUR',
        oracle: 'BTC_EUR',
        params: {
          debtCeiling: parseEther('10000000'),
          collateralFactor: parseAmount.gwei('0.725'),
          targetHealthFactor: parseAmount.gwei('1.1'),
          borrowFee: parseAmount.gwei('0'),
          repayFee: parseAmount.gwei('0'),
          interestRate: interestRate05,
          liquidationSurcharge: parseAmount.gwei('0.98'),
          maxLiquidationDiscount: parseAmount.gwei('0.075'),
          whitelistingActivated: false,
          baseBoost: parseAmount.gwei('0.4'),
        },
      },
      {
        collateral: '0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0',
        symbol: 'wstETH-EUR',
        oracle: 'WSTETH_EUR',
        params: {
          debtCeiling: parseEther('10000000'),
          collateralFactor: parseAmount.gwei('0.77'),
          targetHealthFactor: parseAmount.gwei('1.1'),
          borrowFee: parseAmount.gwei('0'),
          repayFee: parseAmount.gwei('0'),
          interestRate: interestRate05,
          liquidationSurcharge: parseAmount.gwei('0.98'),
          maxLiquidationDiscount: parseAmount.gwei('0.085'),
          whitelistingActivated: false,
          baseBoost: parseAmount.gwei('0.7'),
        },
      },
      {
        collateral: '0xBe9895146f7AF43049ca1c1AE358B0541Ea49704',
        symbol: 'cbETH-EUR',
        oracle: 'CBETH_EUR',
        params: {
          debtCeiling: parseEther('200000'),
          collateralFactor: parseAmount.gwei('0.75'),
          targetHealthFactor: parseAmount.gwei('1.1'),
          borrowFee: parseAmount.gwei('0'),
          repayFee: parseAmount.gwei('0'),
          interestRate: interestRate05,
          liquidationSurcharge: parseAmount.gwei('0.98'),
          maxLiquidationDiscount: parseAmount.gwei('0.1'),
          whitelistingActivated: false,
          baseBoost: parseAmount.gwei('1'),
        },
      },
      {
        collateral: '0x5f98805A4E8be255a32880FDeC7F6728C6568bA0',
        symbol: 'LUSD-EUR',
        oracle: 'LUSD_EUR',
        params: {
          debtCeiling: parseEther('3000000'),
          collateralFactor: parseAmount.gwei('0.88'),
          targetHealthFactor: parseAmount.gwei('1.05'),
          borrowFee: parseAmount.gwei('0'),
          repayFee: parseAmount.gwei('0'),
          interestRate: interestRate05,
          liquidationSurcharge: parseAmount.gwei('0.98'),
          maxLiquidationDiscount: parseAmount.gwei('0.05'),
          whitelistingActivated: false,
          baseBoost: parseAmount.gwei('1.5'),
        },
      },
      {
        collateral: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
        symbol: 'USDC-EUR',
        oracle: 'USDC_EUR',
        params: {
          debtCeiling: parseEther('3000000'),
          collateralFactor: parseAmount.gwei('0.9'),
          targetHealthFactor: parseAmount.gwei('1.05'),
          borrowFee: parseAmount.gwei('0'),
          repayFee: parseAmount.gwei('0'),
          interestRate: interestRate05,
          liquidationSurcharge: parseAmount.gwei('0.98'),
          maxLiquidationDiscount: parseAmount.gwei('0.05'),
          whitelistingActivated: false,
          baseBoost: parseAmount.gwei('3'),
        },
      },
      {
        collateral: '0xa9d2Eea75C80fF9669cc998c276Ff26D741Dcb26',
        symbol: 'sdcrvFRAX-EUR',
        oracle: 'crvFRAX_EUR',
        params: {
          debtCeiling: parseEther('100'),
          collateralFactor: parseAmount.gwei('0.8'),
          targetHealthFactor: parseAmount.gwei('1.05'),
          borrowFee: parseAmount.gwei('0'),
          repayFee: parseAmount.gwei('0'),
          interestRate: interestRate05,
          liquidationSurcharge: parseAmount.gwei('0.98'),
          maxLiquidationDiscount: parseAmount.gwei('0.08'),
          whitelistingActivated: false,
          baseBoost: parseAmount.gwei('2.5'),
        },
      },
      {
        collateral: '0xC68421f20bf6f0Eb475F00b9C5484f7D0AC0331e',
        symbol: 'cvxcrvFRAX-EUR',
        oracle: 'crvFRAX_EUR',
        params: {
          debtCeiling: parseEther('100'),
          collateralFactor: parseAmount.gwei('0.8'),
          targetHealthFactor: parseAmount.gwei('1.05'),
          borrowFee: parseAmount.gwei('0'),
          repayFee: parseAmount.gwei('0'),
          interestRate: interestRate05,
          liquidationSurcharge: parseAmount.gwei('0.98'),
          maxLiquidationDiscount: parseAmount.gwei('0.08'),
          whitelistingActivated: false,
          baseBoost: parseAmount.gwei('2.5'),
        },
      },
      {
        collateral: '0xbff202E3Cb58aB0A09b2Eb1D9a50352B9aAf196c',
        symbol: 'cvx-3CRV',
        oracle: '3CRV_EUR',
        params: {
          debtCeiling: parseEther('100000'),
          collateralFactor: parseAmount.gwei('0.8'),
          targetHealthFactor: parseAmount.gwei('1.05'),
          borrowFee: parseAmount.gwei('0'),
          repayFee: parseAmount.gwei('0'),
          interestRate: interestRate05,
          liquidationSurcharge: parseAmount.gwei('0.98'),
          maxLiquidationDiscount: parseAmount.gwei('0.08'),
          whitelistingActivated: false,
          baseBoost: parseAmount.gwei('1.5'),
        },
      },
      {
        collateral: '0xe80298eE8F54a5e1b0448bC2EE844901344469bc',
        symbol: 'sd-3CRV',
        oracle: '3CRV_EUR',
        params: {
          debtCeiling: parseEther('100000'),
          collateralFactor: parseAmount.gwei('0.8'),
          targetHealthFactor: parseAmount.gwei('1.05'),
          borrowFee: parseAmount.gwei('0'),
          repayFee: parseAmount.gwei('0'),
          interestRate: interestRate05,
          liquidationSurcharge: parseAmount.gwei('0.98'),
          maxLiquidationDiscount: parseAmount.gwei('0.08'),
          whitelistingActivated: false,
          baseBoost: parseAmount.gwei('1.5'),
        },
      },
      {
        collateral: '0x9650821B3555Fe6318586BE997cc0Fb163C35976',
        symbol: 'cvx-crvLUSD3CRV',
        oracle: 'crvLUSD3CRV_EUR',
        params: {
          debtCeiling: parseEther('100000'),
          collateralFactor: parseAmount.gwei('0.8'),
          targetHealthFactor: parseAmount.gwei('1.05'),
          borrowFee: parseAmount.gwei('0'),
          repayFee: parseAmount.gwei('0'),
          interestRate: interestRate05,
          liquidationSurcharge: parseAmount.gwei('0.98'),
          maxLiquidationDiscount: parseAmount.gwei('0.09'),
          whitelistingActivated: false,
          baseBoost: parseAmount.gwei('2'),
        },
      },
      {
        collateral: '0x97F0A7954904a7357D814ACE2896021496e5f321',
        symbol: 'sd-crvLUSD3CRV',
        oracle: 'crvLUSD3CRV_EUR',
        params: {
          debtCeiling: parseEther('100000'),
          collateralFactor: parseAmount.gwei('0.8'),
          targetHealthFactor: parseAmount.gwei('1.05'),
          borrowFee: parseAmount.gwei('0'),
          repayFee: parseAmount.gwei('0'),
          interestRate: interestRate05,
          liquidationSurcharge: parseAmount.gwei('0.98'),
          maxLiquidationDiscount: parseAmount.gwei('0.09'),
          whitelistingActivated: false,
          baseBoost: parseAmount.gwei('2'),
        },
      },
      {
        collateral: '0xCA30c93B02514f86d5C86a6e375E3A330B435Fb5',
        symbol: 'bIB01',
        oracle: 'IB01_EUR',
        params: {
          debtCeiling: parseEther('200000'),
          collateralFactor: parseAmount.gwei('0.8'),
          targetHealthFactor: parseAmount.gwei('1.1'),
          borrowFee: parseAmount.gwei('0'),
          repayFee: parseAmount.gwei('0'),
          interestRate: interestRate20,
          liquidationSurcharge: parseAmount.gwei('0.96'),
          maxLiquidationDiscount: parseAmount.gwei('0.10'),
          whitelistingActivated: true,
          baseBoost: parseAmount.gwei('10'),
          dust: parseEther('0'),
          dustLiquidation: parseEther('0'),
          dustCollateral: parseEther('0'),
        },
      },
      {
        collateral: '0x20C64dEE8FdA5269A78f2D5BDBa861CA1d83DF7a',
        symbol: 'bHIGH-EUR',
        oracle: 'HIGH_EUR',
        params: {
          debtCeiling: parseEther('1000000'),
          collateralFactor: parseAmount.gwei('0.77'),
          targetHealthFactor: parseAmount.gwei('1.1'),
          borrowFee: parseAmount.gwei('0'),
          repayFee: parseAmount.gwei('0'),
          interestRate: interestRate25,
          liquidationSurcharge: parseAmount.gwei('0.96'),
          maxLiquidationDiscount: parseAmount.gwei('0.13'),
          whitelistingActivated: true,
          baseBoost: parseAmount.gwei('10'),
          dust: parseEther('0'),
          dustLiquidation: parseEther('0'),
          dustCollateral: parseEther('0'),
        },
      },
    ],
  },
  GOLD: {
    currencySymbol: 'XAU',
    vaultManagers: [
      {
        collateral: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
        symbol: 'wETH-GOLD',
        oracle: 'ETH_XAU',
        params: {
          debtCeiling: parseEther('500'),
          collateralFactor: parseAmount.gwei('0.75'),
          targetHealthFactor: parseAmount.gwei('1.1'),
          borrowFee: parseAmount.gwei('0'),
          repayFee: parseAmount.gwei('0'),
          interestRate: interestRate15,
          liquidationSurcharge: parseAmount.gwei('0.98'),
          maxLiquidationDiscount: parseAmount.gwei('0.1'),
          whitelistingActivated: false,
          baseBoost: parseAmount.gwei('1'),
          dust: parseEther('0'),
          dustLiquidation: parseEther('4'),
          dustCollateral: parseEther('4'),
        },
      },
      {
        collateral: '0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0',
        symbol: 'wstETH-GOLD',
        oracle: 'WSTETH_XAU',
        params: {
          debtCeiling: parseEther('500'),
          collateralFactor: parseAmount.gwei('0.7'),
          targetHealthFactor: parseAmount.gwei('1.1'),
          borrowFee: parseAmount.gwei('0'),
          repayFee: parseAmount.gwei('0'),
          interestRate: interestRate15,
          liquidationSurcharge: parseAmount.gwei('0.98'),
          maxLiquidationDiscount: parseAmount.gwei('0.13'),
          whitelistingActivated: false,
          baseBoost: parseAmount.gwei('1.3'),
          dust: parseEther('0'),
          dustLiquidation: parseEther('4'),
          dustCollateral: parseEther('4'),
        },
      },
      {
        collateral: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
        symbol: 'USDC-GOLD',
        oracle: 'USDC_XAU',
        params: {
          debtCeiling: parseEther('500'),
          collateralFactor: parseAmount.gwei('0.8'),
          targetHealthFactor: parseAmount.gwei('1.1'),
          borrowFee: parseAmount.gwei('0'),
          repayFee: parseAmount.gwei('0'),
          interestRate: interestRate15,
          liquidationSurcharge: parseAmount.gwei('0.98'),
          maxLiquidationDiscount: parseAmount.gwei('0.1'),
          whitelistingActivated: false,
          baseBoost: parseAmount.gwei('2'),
          dust: parseEther('0'),
          dustLiquidation: parseEther('4'),
          dustCollateral: parseEther('4'),
        },
      },
    ],
  },
};

export default {
  stablesParameters: stablesParameters,
};

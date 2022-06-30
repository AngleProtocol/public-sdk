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
const interestRate = BigNumber.from('158153934393112649');
const stablesParameters: StablesParameters = {
  EUR: {
    currencySymbol: '€',
    flashloan: {
      maxBorrowable: parseAmount.ether('1000000'),
      flashLoanFee: parseAmount.gwei('0'),
    },
    vaultManagers: [
      {
        collateral: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
        symbol: 'wMATIC-EUR',
        oracle: 'MATIC_EUR',
        params: {
          debtCeiling: parseEther('500000'),
          collateralFactor: parseAmount.gwei('0.65'),
          targetHealthFactor: parseAmount.gwei('1.05'),
          borrowFee: parseAmount.gwei('0'),
          repayFee: parseAmount.gwei('0'),
          interestRate: interestRate,
          liquidationSurcharge: parseAmount.gwei('0.98'),
          maxLiquidationDiscount: parseAmount.gwei('0.13'),
          whitelistingActivated: false,
          baseBoost: parseAmount.gwei('0.6'),
        },
      },
      {
        collateral: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
        symbol: 'USDC-EUR',
        oracle: 'USDC_EUR',
        params: {
          debtCeiling: parseEther('500000'),
          collateralFactor: parseAmount.gwei('0.9'),
          targetHealthFactor: parseAmount.gwei('1.05'),
          borrowFee: parseAmount.gwei('0'),
          repayFee: parseAmount.gwei('0'),
          interestRate: interestRate,
          liquidationSurcharge: parseAmount.gwei('0.98'),
          maxLiquidationDiscount: parseAmount.gwei('0.04'),
          whitelistingActivated: false,
          baseBoost: parseAmount.gwei('1.1'),
        },
      },
      {
        collateral: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
        symbol: 'USDC-EUR',
        oracle: 'USDC_EUR',
        params: {
          debtCeiling: parseEther('10000000'),
          collateralFactor: parseAmount.gwei('0.82'),
          targetHealthFactor: parseAmount.gwei('1.1'),
          borrowFee: parseAmount.gwei('0'),
          repayFee: parseAmount.gwei('0'),
          interestRate: interestRate,
          liquidationSurcharge: parseAmount.gwei('0.98'),
          maxLiquidationDiscount: parseAmount.gwei('0.05'),
          whitelistingActivated: false,
          baseBoost: parseAmount.gwei('0.5'),
        },
      },
      {
        collateral: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
        symbol: 'wETH-EUR',
        oracle: 'ETH_EUR',
        params: {
          debtCeiling: parseEther('500000'),
          collateralFactor: parseAmount.gwei('0.8'),
          targetHealthFactor: parseAmount.gwei('1.05'),
          borrowFee: parseAmount.gwei('0'),
          repayFee: parseAmount.gwei('0'),
          interestRate: interestRate,
          liquidationSurcharge: parseAmount.gwei('0.98'),
          maxLiquidationDiscount: parseAmount.gwei('0.1'),
          whitelistingActivated: false,
          baseBoost: parseAmount.gwei('1.5'),
        },
      },
    ],
  },
};

export default {
  stablesParameters: stablesParameters,
};

import { BigNumber, ethers } from 'ethers';
import { parseEther, parseUnits } from 'ethers/lib/utils';

import { parseAmount } from '../../utils/bignumber';
import { GlobalParameters, StablesParameters } from './types';

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
          // TODO params
          debtCeiling: parseEther('10000000'),
          collateralFactor: parseAmount.gwei('0.835'),
          targetHealthFactor: parseAmount.gwei('1.1'),
          borrowFee: parseAmount.gwei('0'),
          repayFee: parseAmount.gwei('0'),
          interestRate: interestRate,
          liquidationSurcharge: parseAmount.gwei('0.98'),
          maxLiquidationDiscount: parseAmount.gwei('0.06'),
          whitelistingActivated: false,
          baseBoost: parseAmount.gwei('0.7'),
        },
      },
      {
        collateral: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
        symbol: 'wETH-EUR',
        oracle: 'ETH_EUR',
        params: {
          // TODO params
          debtCeiling: parseEther('10000000'),
          collateralFactor: parseAmount.gwei('0.77'),
          targetHealthFactor: parseAmount.gwei('1.1'),
          borrowFee: parseAmount.gwei('0'),
          repayFee: parseAmount.gwei('0'),
          interestRate: interestRate,
          liquidationSurcharge: parseAmount.gwei('0.98'),
          maxLiquidationDiscount: parseAmount.gwei('0.085'),
          whitelistingActivated: false,
          baseBoost: parseAmount.gwei('0.7'),
        },
      },
    ],
  },
};

export default {
  stablesParameters: stablesParameters,
};

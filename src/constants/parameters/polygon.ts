import { BigNumber } from 'ethers';
import { parseEther } from 'ethers/lib/utils';

import { parseAmount } from '../../utils/bignumber';
import { StablesParameters } from './types';

// 0.5% interest rate on Polygon
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
        collateral: '0xa3Fa99A148fA48D14Ed51d610c367C61876997F1',
        symbol: 'MAI-EUR',
        oracle: 'MAI_EUR',
        params: {
          debtCeiling: parseEther('500000'),
          collateralFactor: parseAmount.gwei('0.85'),
          targetHealthFactor: parseAmount.gwei('1.05'),
          borrowFee: parseAmount.gwei('0'),
          repayFee: parseAmount.gwei('0'),
          interestRate: interestRate,
          liquidationSurcharge: parseAmount.gwei('0.98'),
          maxLiquidationDiscount: parseAmount.gwei('0.08'),
          whitelistingActivated: false,
          baseBoost: parseAmount.gwei('1.5'),
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
      {
        collateral: '0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6',
        symbol: 'wBTC-EUR',
        oracle: 'BTC_EUR',
        params: {
          debtCeiling: parseEther('300000'),
          collateralFactor: parseAmount.gwei('0.725'),
          targetHealthFactor: parseAmount.gwei('1.1'),
          borrowFee: parseAmount.gwei('0'),
          repayFee: parseAmount.gwei('0'),
          interestRate: interestRate,
          liquidationSurcharge: parseAmount.gwei('0.98'),
          maxLiquidationDiscount: parseAmount.gwei('0.075'),
          whitelistingActivated: false,
          baseBoost: parseAmount.gwei('0.4'),
        },
      },
      {
        collateral: '0x583EE5b0b2999679d1DdE7aa178B225ad57c481b',
        symbol: 'am3CRV-EUR',
        oracle: 'am3CRV_EUR',
        params: {
          debtCeiling: parseEther('1000'),
          collateralFactor: parseAmount.gwei('0.7'),
          targetHealthFactor: parseAmount.gwei('1.1'),
          borrowFee: parseAmount.gwei('0.003'),
          repayFee: parseAmount.gwei('0.004'),
          interestRate: interestRate,
          liquidationSurcharge: parseAmount.gwei('0.98'),
          maxLiquidationDiscount: parseAmount.gwei('0.08'),
          whitelistingActivated: false,
          baseBoost: parseAmount.gwei('0.4'),
        },
      },
    ],
  },
};

export default {
  stablesParameters: stablesParameters,
};

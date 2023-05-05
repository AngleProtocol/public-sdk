import { ethers } from 'ethers';
import { parseEther, parseUnits } from 'ethers/lib/utils';

import { parseAmount } from '../../utils/bignumber';
import { StablesParameters } from './types';

// agTokens specific parameters
const yearlyRate = 1.03;
const ratePerSecond = yearlyRate ** (1 / (365 * 24 * 3600)) - 1;
const yearlyRate2 = 1.03;
const ratePerSecond2 = yearlyRate2 ** (1 / (365 * 24 * 3600)) - 1;
const stablesParameters: StablesParameters = {
  EUR: {
    currencySymbol: '€',
    flashloan: {
      maxBorrowable: parseAmount.ether('1000000'),
      flashLoanFee: parseAmount.gwei('0.001'),
    },
    vaultManagers: [
      {
        collateral: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
        symbol: 'wETH/EUR',
        oracle: 'ETH_EUR',
        params: {
          debtCeiling: parseEther('100000000'),
          collateralFactor: parseAmount.gwei('0.5'),
          targetHealthFactor: parseAmount.gwei('1.1'),
          borrowFee: parseAmount.gwei('0'),
          repayFee: parseAmount.gwei('0'),
          interestRate: ethers.utils.parseUnits('0.000000001243680714', 27),
          liquidationSurcharge: parseAmount.gwei('0.98'),
          maxLiquidationDiscount: parseAmount.gwei('0.1'),
          whitelistingActivated: false,
          baseBoost: parseAmount.gwei('1'),
        },
      },
      {
        collateral: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
        symbol: 'wBTC/EUR',
        oracle: 'BTC_EUR',
        params: {
          debtCeiling: parseEther('100000000'),
          collateralFactor: parseAmount.gwei('0.66'),
          targetHealthFactor: parseAmount.gwei('1.2'),
          borrowFee: parseAmount.gwei('0.003'),
          repayFee: parseAmount.gwei('0.003'),
          interestRate: parseUnits(ratePerSecond.toFixed(27), 27),
          liquidationSurcharge: parseAmount.gwei('0.98'),
          maxLiquidationDiscount: parseAmount.gwei('0.15'),
          whitelistingActivated: false,
          baseBoost: parseAmount.gwei('1'),
        },
      },
      {
        collateral: '0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0',
        symbol: 'wstETH/EUR',
        oracle: 'WSTETH_EUR',
        params: {
          debtCeiling: parseEther('100000000'),
          collateralFactor: parseAmount.gwei('0.75'),
          targetHealthFactor: parseAmount.gwei('1.2'),
          borrowFee: parseAmount.gwei('0'),
          repayFee: parseAmount.gwei('0'),
          interestRate: parseUnits(ratePerSecond2.toFixed(27), 27),
          liquidationSurcharge: parseAmount.gwei('0.98'),
          maxLiquidationDiscount: parseAmount.gwei('0.1'),
          whitelistingActivated: false,
          baseBoost: parseAmount.gwei('1'),
        },
      },
    ],
  },
};

export default {
  stablesParameters: stablesParameters,
};

import { BigNumber } from 'ethers';
import { parseEther } from 'ethers/lib/utils';

import { parseAmount } from '../../utils/bignumber';
import { StablesParameters } from './types';

// 0.5% a year
const interestRate = BigNumber.from('158153934393112649');
const stablesParameters: StablesParameters = {
  EUR: {
    currencySymbol: '€',
    flashloan: {
      maxBorrowable: parseAmount.ether('1000000'),
      flashLoanFee: parseAmount.gwei('0'),
    },
    bridges: [
      {
        name: 'Synapse',
        token: '0x16BFc5fe024980124bEf51d1D792dC539d1B5Bf0',
        params: {
          fees: parseAmount.gwei('0.002'),
          limit: parseEther('1000000'),
          hourlyLimit: parseEther('50000'),
        },
      },
    ],
    vaultManagers: [
      {
        collateral: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
        symbol: 'wETH-EUR',
        oracle: 'ETH_EUR',
        params: {
          debtCeiling: parseEther('10000000'),
          collateralFactor: parseAmount.gwei('0.7'),
          targetHealthFactor: parseAmount.gwei('1.1'),
          borrowFee: parseAmount.gwei('0'),
          repayFee: parseAmount.gwei('0'),
          interestRate: interestRate,
          liquidationSurcharge: parseAmount.gwei('0.98'),
          maxLiquidationDiscount: parseAmount.gwei('0.1'),
          whitelistingActivated: false,
          baseBoost: parseAmount.gwei('0.5'),
        },
      },
    ],
  },
};

export default {
  stablesParameters: stablesParameters,
};

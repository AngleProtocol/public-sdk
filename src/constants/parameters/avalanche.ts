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
        name: 'Anyswap',
        token: '0x6feFd97F328342a8A840546A55FDcfEe7542F9A8',
        params: {
          fees: parseAmount.gwei('0.002'),
          limit: parseEther('1000000'),
          hourlyLimit: parseEther('50000'),
        },
      },
    ],
    vaultManagers: [
      {
        collateral: '0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E',
        symbol: 'USDC-EUR',
        oracle: 'USDC_EUR',
        params: {
          debtCeiling: parseEther('2000000'),
          collateralFactor: parseAmount.gwei('0.825'),
          targetHealthFactor: parseAmount.gwei('1.05'),
          borrowFee: parseAmount.gwei('0'),
          repayFee: parseAmount.gwei('0'),
          interestRate: interestRate,
          liquidationSurcharge: parseAmount.gwei('0.98'),
          maxLiquidationDiscount: parseAmount.gwei('0.06'),
          whitelistingActivated: false,
          baseBoost: parseAmount.gwei('1'),
        },
      },
      {
        collateral: '0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7',
        symbol: 'wAVAX-EUR',
        oracle: 'AVAX_EUR',
        params: {
          debtCeiling: parseEther('200000'),
          collateralFactor: parseAmount.gwei('0.65'),
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
      {
        collateral: '0x49D5c2BdFfac6CE2BFdB6640F4F80f226bc10bAB',
        symbol: 'wETH.e-EUR',
        oracle: 'ETH_EUR',
        params: {
          debtCeiling: parseEther('200000'),
          collateralFactor: parseAmount.gwei('0.8'),
          targetHealthFactor: parseAmount.gwei('1.1'),
          borrowFee: parseAmount.gwei('0'),
          repayFee: parseAmount.gwei('0'),
          interestRate: interestRate,
          liquidationSurcharge: parseAmount.gwei('0.98'),
          maxLiquidationDiscount: parseAmount.gwei('0.8'),
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

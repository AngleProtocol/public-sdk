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
    // TODO add bridge params for each stablecoin, like:
    /*
    bridges: [
        {
            name: "anyswap",
            token: "0x...",
            fees:
            limit:
            hourlyLimit:
        }
    ]
    */
    vaultManagers: [
      {
        collateral: '0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7',
        symbol: 'wAVAX-EUR',
        oracle: 'AVAX_EUR',
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
        collateral: '0x49D5c2BdFfac6CE2BFdB6640F4F80f226bc10bAB',
        symbol: 'wETH.e-EUR',
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

import { ethers } from 'ethers';
import { BigNumber } from 'ethers';

import { parseAmount } from '../../utils/bignumber';
import { GlobalParameters, PoolsParameters, StablesParameters } from './types';

const poolsParameters: PoolsParameters = {
  EUR: {
    USDC: {
      decimals: 6,

      xFeeMint: [parseAmount.gwei(0), parseAmount.gwei(0.4), parseAmount.gwei(0.7), parseAmount.gwei(1)],
      yFeeMint: [parseAmount.gwei(0.08), parseAmount.gwei(0.025), parseAmount.gwei(0.005), parseAmount.gwei(0.002)],

      xFeeBurn: [parseAmount.gwei(0), parseAmount.gwei(0.3), parseAmount.gwei(0.6), parseAmount.gwei(1)],
      yFeeBurn: [parseAmount.gwei(0.002), parseAmount.gwei(0.003), parseAmount.gwei(0.005), parseAmount.gwei(0.015)],

      xHAFeesDeposit: [parseAmount.gwei(0), parseAmount.gwei(0.4), parseAmount.gwei(0.7), parseAmount.gwei(1)],
      yHAFeesDeposit: [parseAmount.gwei(0.002), parseAmount.gwei(0.005), parseAmount.gwei(0.01), parseAmount.gwei(0.03)],

      haBonusMalusDeposit: parseAmount.gwei(1),
      haBonusMalusWithdraw: parseAmount.gwei(1),

      xHAFeesWithdraw: [parseAmount.gwei(0), parseAmount.gwei(0.4), parseAmount.gwei(0.7), parseAmount.gwei(1)],
      yHAFeesWithdraw: [parseAmount.gwei(0.01), parseAmount.gwei(0.01), parseAmount.gwei(0.01), parseAmount.gwei(0.01)],

      xSlippage: [parseAmount.gwei(0.5), parseAmount.gwei(1), parseAmount.gwei(1.2), parseAmount.gwei(1.5)],
      ySlippage: [parseAmount.gwei(0.5), parseAmount.gwei(0.2), parseAmount.gwei(0.1), parseAmount.gwei(0)],
      xSlippageFee: [parseAmount.gwei(0.5), parseAmount.gwei(1), parseAmount.gwei(1.2), parseAmount.gwei(1.5)],
      ySlippageFee: [parseAmount.gwei(0.75), parseAmount.gwei(0.5), parseAmount.gwei(0.15), parseAmount.gwei(0)],

      haFeeDeposit: parseAmount.gwei(1),
      haFeeWithdraw: parseAmount.gwei(1),

      xBonusMalusMint: [parseAmount.gwei(0.5), parseAmount.gwei(1)],
      yBonusMalusMint: [parseAmount.gwei(0.8), parseAmount.gwei(1)],
      xBonusMalusBurn: [parseAmount.gwei(0), parseAmount.gwei(0.5), parseAmount.gwei(1), parseAmount.gwei(1.3), parseAmount.gwei(1.5)],
      yBonusMalusBurn: [parseAmount.gwei(10), parseAmount.gwei(4), parseAmount.gwei(1.5), parseAmount.gwei(1), parseAmount.gwei(1)],

      xKeeperFeesClosing: [parseAmount.gwei(0.25), parseAmount.gwei(0.25).add(1), parseAmount.gwei(0.75).sub(1), parseAmount.gwei(0.75)],
      yKeeperFeesClosing: [parseAmount.gwei(0), parseAmount.gwei(1), parseAmount.gwei(1), parseAmount.gwei(0)],

      maxInterestsDistributed: parseAmount.usdc(10),

      feesForSLPs: parseAmount.gwei(0.5),
      interestsForSLPs: parseAmount.gwei(0.5),

      interestsForSurplus: parseAmount.gwei(0.2),

      capOnStableMinted: ethers.constants.MaxUint256,

      limitHAHedge: parseAmount.gwei(0.95),
      targetHAHedge: parseAmount.gwei(0.9),
      maxLeverage: parseAmount.gwei(3),
      maintenanceMargin: parseAmount.gwei(0.0625),
      keeperFeesLiquidationRatio: parseAmount.gwei(0.2),
      lockTime: BigNumber.from(100),

      keeperFeesLiquidationCap: parseAmount.ether(100),
      keeperFeesClosingCap: parseAmount.ether(100),

      strategies: [
        {
          type: 'MockStrategy',
          debtRatio: parseAmount.gwei(0.8),
          params: {
            path: ethers.utils.hexlify(0),
          },
        },
      ],

      stakings: [
        {
          type: 'HA',
          duration: BigNumber.from(3600 * 24 * 180),
          incentiveAmount: parseAmount.ether(100),
          updateFrequency: BigNumber.from(3600 * 24 * 1),
          amountToDistribute: parseAmount.ether(100_000),
          rewardDuration: BigNumber.from(3600 * 24 * 4),
        },
        {
          type: 'SLP',
          duration: BigNumber.from(3600 * 24 * 180),
          incentiveAmount: parseAmount.ether(100),
          updateFrequency: BigNumber.from(3600 * 24 * 1),
          amountToDistribute: parseAmount.ether(100_000),
          rewardDuration: BigNumber.from(3600 * 24 * 4),
        },
      ],

      currencyDigits: 3,
      nbrStakingToken: 1000,
    },

    DAI: {
      decimals: 18,

      xFeeMint: [parseAmount.gwei(0), parseAmount.gwei(0.4), parseAmount.gwei(0.7), parseAmount.gwei(1)],
      yFeeMint: [parseAmount.gwei(0.08), parseAmount.gwei(0.025), parseAmount.gwei(0.005), parseAmount.gwei(0.002)],

      xFeeBurn: [parseAmount.gwei(0), parseAmount.gwei(0.4), parseAmount.gwei(0.7), parseAmount.gwei(1)],
      yFeeBurn: [parseAmount.gwei(0.002), parseAmount.gwei(0.003), parseAmount.gwei(0.005), parseAmount.gwei(0.015)],

      xHAFeesDeposit: [parseAmount.gwei(0), parseAmount.gwei(0.4), parseAmount.gwei(0.7), parseAmount.gwei(1)],
      yHAFeesDeposit: [parseAmount.gwei(0.002), parseAmount.gwei(0.005), parseAmount.gwei(0.01), parseAmount.gwei(0.03)],

      haBonusMalusDeposit: parseAmount.gwei(1),
      haBonusMalusWithdraw: parseAmount.gwei(1),

      xHAFeesWithdraw: [parseAmount.gwei(0), parseAmount.gwei(0.4), parseAmount.gwei(0.7), parseAmount.gwei(1)],
      yHAFeesWithdraw: [parseAmount.gwei(0.06), parseAmount.gwei(0.02), parseAmount.gwei(0.01), parseAmount.gwei(0.002)],

      xSlippage: [parseAmount.gwei(0.5), parseAmount.gwei(1), parseAmount.gwei(1.2), parseAmount.gwei(1.5)],
      ySlippage: [parseAmount.gwei(0.5), parseAmount.gwei(0.2), parseAmount.gwei(0.1), parseAmount.gwei(0)],
      xSlippageFee: [parseAmount.gwei(0.5), parseAmount.gwei(1), parseAmount.gwei(1.2), parseAmount.gwei(1.5)],
      ySlippageFee: [parseAmount.gwei(0.75), parseAmount.gwei(0.5), parseAmount.gwei(0.15), parseAmount.gwei(0)],

      haFeeDeposit: parseAmount.gwei(1),
      haFeeWithdraw: parseAmount.gwei(1),

      xBonusMalusMint: [parseAmount.gwei(0.5), parseAmount.gwei(1)],
      yBonusMalusMint: [parseAmount.gwei(0.8), parseAmount.gwei(1)],
      xBonusMalusBurn: [parseAmount.gwei(0), parseAmount.gwei(0.5), parseAmount.gwei(1), parseAmount.gwei(1.3), parseAmount.gwei(1.5)],
      yBonusMalusBurn: [parseAmount.gwei(10), parseAmount.gwei(4), parseAmount.gwei(1.5), parseAmount.gwei(1), parseAmount.gwei(1)],

      xKeeperFeesClosing: [parseAmount.gwei(0.25), parseAmount.gwei(0.5), parseAmount.gwei(1)],

      yKeeperFeesClosing: [parseAmount.gwei(0.1), parseAmount.gwei(0.6), parseAmount.gwei(0.1)],

      maxInterestsDistributed: parseAmount.dai(10),

      feesForSLPs: parseAmount.gwei(0.5),
      interestsForSLPs: parseAmount.gwei(0.5),
      interestsForSurplus: parseAmount.gwei(0.2),

      capOnStableMinted: ethers.constants.MaxUint256,

      limitHAHedge: parseAmount.gwei(0.95),
      targetHAHedge: parseAmount.gwei(0.9),
      maxLeverage: parseAmount.gwei(3),
      maintenanceMargin: parseAmount.gwei(0.0625),
      keeperFeesLiquidationRatio: parseAmount.gwei(0.2),
      lockTime: BigNumber.from(100),

      keeperFeesLiquidationCap: parseAmount.ether(100),
      keeperFeesClosingCap: parseAmount.ether(100),

      strategies: [
        {
          type: 'MockStrategy',
          debtRatio: parseAmount.gwei(0.8),
          params: {
            path: ethers.utils.hexlify(0),
          },
        },
      ],

      stakings: [
        {
          type: 'HA',
          duration: BigNumber.from(3600 * 24 * 180),
          incentiveAmount: parseAmount.ether(100),
          updateFrequency: BigNumber.from(3600 * 24 * 1),
          amountToDistribute: parseAmount.ether(100_000),
          rewardDuration: BigNumber.from(3600 * 24 * 4),
        },
        {
          type: 'SLP',
          duration: BigNumber.from(3600 * 24 * 180),
          incentiveAmount: parseAmount.ether(100),
          updateFrequency: BigNumber.from(3600 * 24 * 1),
          amountToDistribute: parseAmount.ether(100_000),
          rewardDuration: BigNumber.from(3600 * 24 * 4),
        },
      ],

      currencyDigits: 3,
      nbrStakingToken: 1000,
    },
  },
};

const stablesParameters: StablesParameters = {
  EUR: {
    stakings: [
      {
        type: 'User',
        duration: BigNumber.from(3600 * 24 * 180),
        incentiveAmount: parseAmount.ether(100),
        updateFrequency: BigNumber.from(3600 * 24 * 1),
        amountToDistribute: parseAmount.ether(100_000),
        rewardDuration: BigNumber.from(3600 * 24 * 4),
      },
    ],
    currencySymbol: '€',
  },
};

const globalParameters: GlobalParameters = {
  oracles: [
    {
      type: 'MockOracle',
      inName: 'USDC',
      outName: 'EUR',
      params: {
        inDecimals: BigNumber.from(6),
        rate: parseAmount.ether(1),
      },
    },
    {
      type: 'MockOracle',
      inName: 'DAI',
      outName: 'EUR',
      params: {
        inDecimals: BigNumber.from(18),
        rate: parseAmount.ether(1),
      },
    },
    {
      type: 'MockOracle',
      inName: 'USD',
      outName: 'EUR',
      params: {
        inDecimals: BigNumber.from(18),
        rate: parseAmount.ether(1),
      },
    },
  ],
};

export default {
  poolsParameters: poolsParameters,
  stablesParameters: stablesParameters,
  globalParameters: globalParameters,
};

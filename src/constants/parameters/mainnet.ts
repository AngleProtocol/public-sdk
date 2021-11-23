import { ethers } from 'ethers';
import { BigNumber } from 'ethers';

import { parseAmount } from '../../utils/bignumber';
import { GlobalParameters, PoolParameters, PoolsParameters, StablesParameters } from './types';

// Collateral-specific parameters

// USDC
const poolsParameters_USDC: PoolParameters = {
  decimals: 6,

  // x: horizontal axis steps relative to the hedge ratio, y: amount of fees
  xFeeMint: [parseAmount.gwei(0)],
  yFeeMint: [parseAmount.gwei(0.0025)],

  xFeeBurn: [parseAmount.gwei(0)],
  yFeeBurn: [parseAmount.gwei(0.0045)],

  xHAFeesDeposit: [parseAmount.gwei(0)],
  yHAFeesDeposit: [parseAmount.gwei(0.003)],

  haBonusMalusDeposit: parseAmount.gwei(1),
  haBonusMalusWithdraw: parseAmount.gwei(1),

  xHAFeesWithdraw: [parseAmount.gwei(0)],
  yHAFeesWithdraw: [parseAmount.gwei(0.005)],

  // Slippage: Protocol enforced slippage to disencourage SLPs to leave (exit fees).
  // SlippageFee: share of total SLPs earnings that should be distributed to SLPs that won't be due to a very low collateral ratio.
  // NO SLIPPAGEFEE WITHOUT SLIPPAGE

  // x: horizontal axis steps relative to the collateral ratio, y: ratio of fees
  xSlippage: [parseAmount.gwei(1), parseAmount.gwei(1.1), parseAmount.gwei(1.2)],
  ySlippage: [parseAmount.gwei(0.1), parseAmount.gwei(0.01), parseAmount.gwei(0)],
  xSlippageFee: [parseAmount.gwei(0.99), parseAmount.gwei(1.05), parseAmount.gwei(1.15)],
  ySlippageFee: [parseAmount.gwei(0.9), parseAmount.gwei(0.2), parseAmount.gwei(0)],

  // Option to add dependency on HA fees to collateral ratio.
  // DISABLED AT THE MOMENT
  haFeeDeposit: parseAmount.gwei(1),
  haFeeWithdraw: parseAmount.gwei(1),

  // Option to add a dependency of mint & burn fees to collateral ratio.
  // DISABLED AT THE MOMENT
  xBonusMalusMint: [parseAmount.gwei(0)],
  yBonusMalusMint: [parseAmount.gwei(1)],
  xBonusMalusBurn: [parseAmount.gwei(0)],
  yBonusMalusBurn: [parseAmount.gwei(1)],

  // Keeper rewards for force-closing positions.
  // They should be highest when x is at 0.5, putting the hedge ratio back at target. No fees given when we stay above
  // target
  xKeeperFeesClosing: [parseAmount.gwei(0.495), parseAmount.gwei(0.5), parseAmount.gwei(0.5).add(BigNumber.from(1))],
  yKeeperFeesClosing: [parseAmount.gwei(0), parseAmount.gwei(0.6), parseAmount.gwei(0)],

  // Max interests that can be distributed to SLPs in a block
  // Need to be tuned for each collateral
  maxInterestsDistributed: parseAmount.usdc(500),

  // Share of protocol fees redistributed to SLP
  feesForSLPs: parseAmount.gwei(0.4),
  // Share of protocol pools rewards redistributed to SLP
  interestsForSLPs: parseAmount.gwei(0.6),

  // If we need to limit a pool's supply.
  // DISABLED AT THE MOMENT.
  capOnStableMinted: ethers.constants.MaxUint256,

  // HAs parameters
  limitHAHedge: parseAmount.gwei(0.98),
  targetHAHedge: parseAmount.gwei(0.96),
  maxLeverage: parseAmount.gwei(99),
  maintenanceMargin: parseAmount.gwei(0.00625),
  // Share of the maintenance margin keeper receive as fees
  keeperFeesLiquidationRatio: parseAmount.gwei(0.6),
  lockTime: BigNumber.from(3600),

  // Max fees keeper can receive for a liquidation and a force-close
  // Paid in collateral
  keeperFeesLiquidationCap: parseAmount.usdc(500),
  keeperFeesClosingCap: parseAmount.usdc(500),

  // Strategy parameters
  strategies: [
    {
      type: 'Strategy',
      debtRatio: parseAmount.gwei(0.95),
      params: {
        // Paths fetched from `MockPath.test.js` and https://docs.uniswap.org/protocol/guides/swaps/multihop-swaps
        pathComp:
          '0xc00e94cb662c3520282e6f5717214004a7f26888000bb8c02aaa39b223fe8d0a0e5c4f27ead9083c756cc20001f4a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
        pathAave:
          '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9000bb8c02aaa39b223fe8d0a0e5c4f27ead9083c756cc20001f4a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      },
    },
  ],

  // Staking parameters
  stakings: [
    {
      type: 'HA',
      // total duration of the staking process
      duration: BigNumber.from(3600 * 24 * 365 * 10),
      // The minimum time between updates of distribution parameters by keepers
      updateFrequency: BigNumber.from(3600 * 24 * 7),
      // For how long the tokens are distributed
      rewardDuration: BigNumber.from(3600 * 24 * 7 + 1200),
      // incentive per period for keepers to enforce the scheduled updates
      // the amount is in ANGLE and not ETH, .ether is here for formatting
      incentiveAmount: parseAmount.ether(100), // ANGLE, but tokens are in the same base than ETH
      // total amount of gov tokens per agToken-collateral pair to distribute on the whole staking period
      // the amount is in ANGLE and not ETH, .ether is here for formatting
      // Setting very small amounts to distribute in the first place (because in the first week, only test tokens are distributed)
      amountToDistribute: parseAmount.ether('6256520.883'), // ANGLE, but tokens are in the same base than ETH
    },
    {
      type: 'SLP',
      // Each staking contract is here for 10 years
      duration: BigNumber.from(3600 * 24 * 365 * 10),
      updateFrequency: BigNumber.from(3600 * 24 * 7),
      rewardDuration: BigNumber.from(3600 * 24 * 7 + 1200), // Some 20 minutes delta to make sure that rewards won't accumulate
      incentiveAmount: parseAmount.ether(100),
      // Setting very small amounts to distribute for the first week of mainnet deployment
      amountToDistribute: parseAmount.ether('87591292.36'),
    },
  ],
  currencyDigits: 3,
  nbrStakingToken: 1000,
};

// DAI
const poolsParameters_DAI: PoolParameters = {
  decimals: 18,

  // x: horizontal axis steps relative to the hedge ratio, y: amount of fees
  // here, fees increae from 0.2% to 0.3% between 70% and 80% of hedge ratio, and then stay at 0.3%
  xFeeMint: [parseAmount.gwei(0)],
  yFeeMint: [parseAmount.gwei(0.003)],

  xFeeBurn: [parseAmount.gwei(0)],
  yFeeBurn: [parseAmount.gwei(0.005)],

  xHAFeesDeposit: [parseAmount.gwei(0)],
  yHAFeesDeposit: [parseAmount.gwei(0.003)],

  haBonusMalusDeposit: parseAmount.gwei(1),
  haBonusMalusWithdraw: parseAmount.gwei(1),

  xHAFeesWithdraw: [parseAmount.gwei(0)],
  yHAFeesWithdraw: [parseAmount.gwei(0.005)],

  // Slippage: Protocol enforced slippage to disencourage SLPs to leave (exit fees).
  // SlippageFee: share of fees that should be distributed to SLPs but are not due to a very low collateral ratio.
  // NO SLIPPAGEFEE WITHOUT SLIPPAGE

  // x: horizontal axis steps relative to the collateral ratio, y: ratio of fees
  xSlippage: [parseAmount.gwei(1), parseAmount.gwei(1.1), parseAmount.gwei(1.2)],
  ySlippage: [parseAmount.gwei(0.1), parseAmount.gwei(0.01), parseAmount.gwei(0)],
  xSlippageFee: [parseAmount.gwei(0.99), parseAmount.gwei(1.05), parseAmount.gwei(1.15)],
  ySlippageFee: [parseAmount.gwei(0.9), parseAmount.gwei(0.2), parseAmount.gwei(0)],

  // Option to add dependency on HA fees to collateral ratio.
  // DISABLED AT THE MOMENT
  haFeeDeposit: parseAmount.gwei(1),
  haFeeWithdraw: parseAmount.gwei(1),

  // Option to add a dependency of mint & burn fees to collateral ratio.
  // DISABLED AT THE MOMENT
  xBonusMalusMint: [parseAmount.gwei(0)],
  yBonusMalusMint: [parseAmount.gwei(1)],
  xBonusMalusBurn: [parseAmount.gwei(0)],
  yBonusMalusBurn: [parseAmount.gwei(1)],

  // Keeper rewards for force-closing positions.
  // They should be highest when x is at 0.5, putting the hedge ratio back at target.
  xKeeperFeesClosing: [parseAmount.gwei(0.495), parseAmount.gwei(0.5), parseAmount.gwei(0.5).add(BigNumber.from(1))],
  yKeeperFeesClosing: [parseAmount.gwei(0), parseAmount.gwei(0.6), parseAmount.gwei(0)],

  // Max interests that can be distributed to SLPs in a block
  // Need to be tuned for each collateral
  maxInterestsDistributed: parseAmount.dai(500),

  // Share of protocol fees redistributed to SLP
  feesForSLPs: parseAmount.gwei(0.2),
  // Share of protocol pools rewards redistributed to SLP
  interestsForSLPs: parseAmount.gwei(0.6),

  // If we need to limit a pool's supply.
  // DISABLED AT THE MOMENT.
  capOnStableMinted: ethers.constants.MaxUint256,

  limitHAHedge: parseAmount.gwei(0.98),
  targetHAHedge: parseAmount.gwei(0.96),
  maxLeverage: parseAmount.gwei(99),
  maintenanceMargin: parseAmount.gwei(0.00625),
  // Share of the maintenance margin keeper receive as fees
  keeperFeesLiquidationRatio: parseAmount.gwei(0.6),
  lockTime: BigNumber.from(3600),

  // Max fees keeper can receive for a liquidation and a force-close
  // Paid in collateral
  keeperFeesLiquidationCap: parseAmount.dai(500),
  keeperFeesClosingCap: parseAmount.dai(500),

  strategies: [
    {
      type: 'Strategy',
      debtRatio: parseAmount.gwei(0.95),
      params: {
        pathComp:
          '0xc00e94cb662c3520282e6f5717214004a7f26888000bb8c02aaa39b223fe8d0a0e5c4f27ead9083c756cc20001f46b175474e89094c44da98b954eedeac495271d0f',
        pathAave:
          '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9000bb8c02aaa39b223fe8d0a0e5c4f27ead9083c756cc20001f46b175474e89094c44da98b954eedeac495271d0f',
      },
    },
  ],

  stakings: [
    {
      type: 'HA',
      duration: BigNumber.from(3600 * 24 * 365 * 10),
      updateFrequency: BigNumber.from(3600 * 24 * 7),
      rewardDuration: BigNumber.from(3600 * 24 * 7 + 1200),
      incentiveAmount: parseAmount.ether(100), // ANGLE, but tokens are in the same base than ETH
      // Small amounts for the first week
      amountToDistribute: parseAmount.ether('6256520.883'), // ANGLE, but tokens are in the same base than ETH
    },
    {
      type: 'SLP',
      duration: BigNumber.from(3600 * 24 * 365 * 10),
      updateFrequency: BigNumber.from(3600 * 24 * 7),
      rewardDuration: BigNumber.from(3600 * 24 * 7 + 1200),
      incentiveAmount: parseAmount.ether(100), // ANGLE, but tokens are in the same base than ETH

      amountToDistribute: parseAmount.ether('87591292.36'), // ANGLE, but tokens are in the same base than ETH
    },
  ],
  currencyDigits: 3,
  nbrStakingToken: 1000,
};

const poolsParameters_FEI: PoolParameters = {
  decimals: 18,

  // x: horizontal axis steps relative to the hedge ratio, y: amount of fees
  // here, fees increae from 0.2% to 0.3% between 70% and 80% of hedge ratio, and then stay at 0.3%
  xFeeMint: [parseAmount.gwei(0)],
  yFeeMint: [parseAmount.gwei(0.003)],

  xFeeBurn: [parseAmount.gwei(0)],
  yFeeBurn: [parseAmount.gwei(0.005)],

  xHAFeesDeposit: [parseAmount.gwei(0), parseAmount.gwei(0.5), parseAmount.gwei(1)],
  yHAFeesDeposit: [parseAmount.gwei(0.003), parseAmount.gwei(0.004), parseAmount.gwei(0.007)],

  haBonusMalusDeposit: parseAmount.gwei(1),
  haBonusMalusWithdraw: parseAmount.gwei(1),

  xHAFeesWithdraw: [parseAmount.gwei(0), parseAmount.gwei(0.5), parseAmount.gwei(1)],
  yHAFeesWithdraw: [parseAmount.gwei(0.007), parseAmount.gwei(0.004), parseAmount.gwei(0.003)],

  // Slippage: Protocol enforced slippage to disencourage SLPs to leave (exit fees).
  // SlippageFee: share of fees that should be distributed to SLPs but are not due to a very low collateral ratio.
  // NO SLIPPAGEFEE WITHOUT SLIPPAGE

  // x: horizontal axis steps relative to the collateral ratio, y: ratio of fees
  xSlippage: [parseAmount.gwei(1), parseAmount.gwei(1.1), parseAmount.gwei(1.2)],
  ySlippage: [parseAmount.gwei(0.1), parseAmount.gwei(0.01), parseAmount.gwei(0)],
  xSlippageFee: [parseAmount.gwei(0.99), parseAmount.gwei(1.05), parseAmount.gwei(1.15)],
  ySlippageFee: [parseAmount.gwei(0.9), parseAmount.gwei(0.2), parseAmount.gwei(0)],

  // Option to add dependency on HA fees to collateral ratio.
  // DISABLED AT THE MOMENT
  haFeeDeposit: parseAmount.gwei(1),
  haFeeWithdraw: parseAmount.gwei(1),

  // Option to add a dependency of mint & burn fees to collateral ratio.
  // DISABLED AT THE MOMENT
  xBonusMalusMint: [parseAmount.gwei(0)],
  yBonusMalusMint: [parseAmount.gwei(1)],
  xBonusMalusBurn: [parseAmount.gwei(0)],
  yBonusMalusBurn: [parseAmount.gwei(1)],

  // Keeper rewards for force-closing positions.
  // They should be highest when x is at 0.5, putting the hedge ratio back at target.
  xKeeperFeesClosing: [parseAmount.gwei(0.495), parseAmount.gwei(0.5), parseAmount.gwei(0.5).add(BigNumber.from(1))],
  yKeeperFeesClosing: [parseAmount.gwei(0), parseAmount.gwei(0.6), parseAmount.gwei(0)],

  // Max interests that can be distributed to SLPs in a block
  // Need to be tuned for each collateral
  maxInterestsDistributed: parseAmount.dai(500),

  // Share of protocol fees redistributed to SLP
  feesForSLPs: parseAmount.gwei(0.2),
  // Share of protocol pools rewards redistributed to SLP
  interestsForSLPs: parseAmount.gwei(0.45),

  // If we need to limit a pool's supply.
  // DISABLED AT THE MOMENT.
  capOnStableMinted: parseAmount.ether(35_000_000),

  limitHAHedge: parseAmount.gwei(0.98),
  targetHAHedge: parseAmount.gwei(0.96),
  maxLeverage: parseAmount.gwei(99),
  maintenanceMargin: parseAmount.gwei(0.00625),
  // Share of the maintenance margin keeper receive as fees
  keeperFeesLiquidationRatio: parseAmount.gwei(0.6),
  lockTime: BigNumber.from(3600),

  // Max fees keeper can receive for a liquidation and a force-close
  // Paid in collateral
  keeperFeesLiquidationCap: parseAmount.dai(500),
  keeperFeesClosingCap: parseAmount.dai(500),

  strategies: [
    {
      type: 'Strategy',
      debtRatio: parseAmount.gwei(0.95),
      params: {
        pathComp: '0x',
        pathAave:
          '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9000bb8c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2000bb8a0b86991c6218b36c1d19d4a2e9eb0ce3606eb480001f4956f47f50a910163d8bf957cf5846d573e7f87ca',
      },
    },
  ],

  stakings: [
    {
      type: 'HA',
      duration: BigNumber.from(3600 * 24 * 365 * 10),
      updateFrequency: BigNumber.from(3600 * 24 * 7),
      rewardDuration: BigNumber.from(3600 * 24 * 7 + 1200),
      incentiveAmount: parseAmount.ether(100), // ANGLE, but tokens are in the same base than ETH
      // Small amounts for the first week
      amountToDistribute: parseAmount.ether('10'), // ANGLE, but tokens are in the same base than ETH
    },
    {
      type: 'SLP',
      duration: BigNumber.from(3600 * 24 * 365 * 10),
      updateFrequency: BigNumber.from(3600 * 24 * 7),
      rewardDuration: BigNumber.from(3600 * 24 * 7 + 1200),
      incentiveAmount: parseAmount.ether(100), // ANGLE, but tokens are in the same base than ETH

      amountToDistribute: parseAmount.ether('10'), // ANGLE, but tokens are in the same base than ETH
    },
  ],
  currencyDigits: 3,
  nbrStakingToken: 1000,
};

const poolsParameters_FRAX: PoolParameters = {
  decimals: 18,

  // x: horizontal axis steps relative to the hedge ratio, y: amount of fees
  // here, fees increae from 0.2% to 0.3% between 70% and 80% of hedge ratio, and then stay at 0.3%
  xFeeMint: [parseAmount.gwei(0)],
  yFeeMint: [parseAmount.gwei(0.005)],

  xFeeBurn: [parseAmount.gwei(0)],
  yFeeBurn: [parseAmount.gwei(0.005)],

  xHAFeesDeposit: [parseAmount.gwei(0), parseAmount.gwei(0.5), parseAmount.gwei(1)],
  yHAFeesDeposit: [parseAmount.gwei(0.003), parseAmount.gwei(0.004), parseAmount.gwei(0.007)],

  haBonusMalusDeposit: parseAmount.gwei(1),
  haBonusMalusWithdraw: parseAmount.gwei(1),

  xHAFeesWithdraw: [parseAmount.gwei(0), parseAmount.gwei(0.5), parseAmount.gwei(1)],
  yHAFeesWithdraw: [parseAmount.gwei(0.007), parseAmount.gwei(0.004), parseAmount.gwei(0.003)],

  // Slippage: Protocol enforced slippage to disencourage SLPs to leave (exit fees).
  // SlippageFee: share of fees that should be distributed to SLPs but are not due to a very low collateral ratio.
  // NO SLIPPAGEFEE WITHOUT SLIPPAGE

  // x: horizontal axis steps relative to the collateral ratio, y: ratio of fees
  xSlippage: [parseAmount.gwei(1), parseAmount.gwei(1.1), parseAmount.gwei(1.2)],
  ySlippage: [parseAmount.gwei(0.1), parseAmount.gwei(0.01), parseAmount.gwei(0)],
  xSlippageFee: [parseAmount.gwei(0.99), parseAmount.gwei(1.05), parseAmount.gwei(1.15)],
  ySlippageFee: [parseAmount.gwei(0.9), parseAmount.gwei(0.2), parseAmount.gwei(0)],

  // Option to add dependency on HA fees to collateral ratio.
  // DISABLED AT THE MOMENT
  haFeeDeposit: parseAmount.gwei(1),
  haFeeWithdraw: parseAmount.gwei(1),

  // Option to add a dependency of mint & burn fees to collateral ratio.
  // DISABLED AT THE MOMENT
  xBonusMalusMint: [parseAmount.gwei(0)],
  yBonusMalusMint: [parseAmount.gwei(1)],
  xBonusMalusBurn: [parseAmount.gwei(0)],
  yBonusMalusBurn: [parseAmount.gwei(1)],

  // Keeper rewards for force-closing positions.
  // They should be highest when x is at 0.5, putting the hedge ratio back at target.
  xKeeperFeesClosing: [parseAmount.gwei(0.495), parseAmount.gwei(0.5), parseAmount.gwei(0.5).add(BigNumber.from(1))],
  yKeeperFeesClosing: [parseAmount.gwei(0), parseAmount.gwei(0.6), parseAmount.gwei(0)],

  // Max interests that can be distributed to SLPs in a block
  // Need to be tuned for each collateral
  maxInterestsDistributed: parseAmount.dai(500),

  // Share of protocol fees redistributed to SLP
  feesForSLPs: parseAmount.gwei(0.2),
  // Share of protocol pools rewards redistributed to SLP
  interestsForSLPs: parseAmount.gwei(0.45),

  // If we need to limit a pool's supply.
  // DISABLED AT THE MOMENT.
  capOnStableMinted: parseAmount.ether(15_000_000),

  limitHAHedge: parseAmount.gwei(0.98),
  targetHAHedge: parseAmount.gwei(0.96),
  maxLeverage: parseAmount.gwei(99),
  maintenanceMargin: parseAmount.gwei(0.00625),
  // Share of the maintenance margin keeper receive as fees
  keeperFeesLiquidationRatio: parseAmount.gwei(0.6),
  lockTime: BigNumber.from(3600),

  // Max fees keeper can receive for a liquidation and a force-close
  // Paid in collateral
  keeperFeesLiquidationCap: parseAmount.dai(500),
  keeperFeesClosingCap: parseAmount.dai(500),

  strategies: [
    {
      type: 'Strategy',
      debtRatio: parseAmount.gwei(0.95),
      params: {
        pathComp: '0x',
        pathAave:
          '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9000bb8c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2000bb8a0b86991c6218b36c1d19d4a2e9eb0ce3606eb480001f4853d955acef822db058eb8505911ed77f175b99e',
      },
    },
  ],

  stakings: [
    {
      type: 'HA',
      duration: BigNumber.from(3600 * 24 * 365 * 10),
      updateFrequency: BigNumber.from(3600 * 24 * 7),
      rewardDuration: BigNumber.from(3600 * 24 * 7 + 1200),
      incentiveAmount: parseAmount.ether(100), // ANGLE, but tokens are in the same base than ETH
      // Small amounts for the first week
      amountToDistribute: parseAmount.ether('10'), // ANGLE, but tokens are in the same base than ETH
    },
    {
      type: 'SLP',
      duration: BigNumber.from(3600 * 24 * 365 * 10),
      updateFrequency: BigNumber.from(3600 * 24 * 7),
      rewardDuration: BigNumber.from(3600 * 24 * 7 + 1200),
      incentiveAmount: parseAmount.ether(100), // ANGLE, but tokens are in the same base than ETH

      amountToDistribute: parseAmount.ether('10'), // ANGLE, but tokens are in the same base than ETH
    },
  ],
  currencyDigits: 3,
  nbrStakingToken: 1000,
};

// definition of collateral/stablecoin pairs in the protocol, related to the previously set collateral parameters.
const poolsParameters: PoolsParameters = {
  EUR: {
    USDC: poolsParameters_USDC,
    DAI: poolsParameters_DAI,
    FEI: poolsParameters_FEI,
    FRAX: poolsParameters_FRAX,
  },
};

// agTokens specific parameters
const stablesParameters: StablesParameters = {
  EUR: {
    stakings: [
      {
        type: 'User',
        duration: BigNumber.from(3600 * 24 * 365 * 10),
        updateFrequency: BigNumber.from(3600 * 24 * 7),
        rewardDuration: BigNumber.from(3600 * 24 * 7 + 1200),
        incentiveAmount: parseAmount.ether(100),
        // Small amounts for the first week
        amountToDistribute: parseAmount.ether('437956461.8'),
      },
    ],
    currencySymbol: '€',
  },
};

// Global protocol parameters
const globalParameters: GlobalParameters = {
  // Oracles specific parameters
  oracles: [
    {
      type: 'OracleChainlinkSingle',
      inName: 'USDC',
      outName: 'EUR',
      params: {
        pair: 'EUR/USD',
        multiplier: 0,
        inBase: parseAmount.usdc(1),
        stalePeriod: 3600 * 24,
      },
    },
    {
      type: 'OracleMulti',
      inName: 'DAI',
      outName: 'EUR',
      params: {
        chainlinkPairs: ['DAI/USD', 'EUR/USD'],
        uniswapTokens: ['DAI', 'USDC'],
        uniswapPoolFees: [500],
        twapPeriod: 600,
        observationLength: 300,
        uniFinalCurrency: 1,
        chainlinkIsMultiplied: [1, 0],
        stalePeriod: 3600 * 24,
      },
    },
    {
      type: 'OracleMulti',
      inName: 'FEI',
      outName: 'EUR',
      params: {
        chainlinkPairs: ['FEI/USD', 'EUR/USD'],
        uniswapTokens: ['FEI', 'USDC'],
        uniswapPoolFees: [500],
        twapPeriod: 600,
        observationLength: 75,
        uniFinalCurrency: 1,
        chainlinkIsMultiplied: [1, 0],
        stalePeriod: 3600 * 24,
      },
    },
    {
      type: 'OracleMulti',
      inName: 'FRAX',
      outName: 'EUR',
      params: {
        chainlinkPairs: ['FRAX/USD', 'EUR/USD'],
        uniswapTokens: ['FRAX', 'USDC'],
        uniswapPoolFees: [500],
        twapPeriod: 600,
        observationLength: 100,
        uniFinalCurrency: 1,
        chainlinkIsMultiplied: [1, 0],
        stalePeriod: 3600 * 24,
      },
    },
  ],

  // Governance specific parameters. Quorum is hardcoded.
  // Small quorum but high voting delay: 2.5%
  quorum: parseAmount.ether(5_000_000), // 0.5% of total supply
  proposalThreshold: parseAmount.ether(2_500_000), // 0.4% of total supply
  // Attention: the following are number of blocks
  votingPeriod: BigNumber.from(19636), // Approx 5 days assuming 13s block
  votingDelay: BigNumber.from(545), // Time for people to review the proposal -> approx 2 days
  // Attention: this is a number of seconds
  timelockDelay: BigNumber.from(0), // 2 days

  bondingCurveTotalTokenToSell: BigNumber.from(0),
  bondingCurveStartPrice: BigNumber.from(0),
  bondingCurveStablecoins: ['EUR'],
};

export default {
  poolsParameters: poolsParameters,
  stablesParameters: stablesParameters,
  globalParameters: globalParameters,
};

import { BigNumber, ethers } from 'ethers';
import { parseEther } from 'ethers/lib/utils';

import { parseAmount } from '../../utils/bignumber';
import { GlobalParameters, PoolParameters, PoolsParameters, StablesParameters } from './types';

// Collateral-specific parameters

// USDC
const poolsParameters_USDC: PoolParameters = {
  decimals: 6,

  // x: horizontal axis steps relative to the hedge ratio
  // y: fees
  xFeeMint: [parseAmount.gwei(0)],
  yFeeMint: [parseAmount.gwei(0.0025)],

  xFeeBurn: [parseAmount.gwei(0)],
  yFeeBurn: [parseAmount.gwei(0.0045)],

  xHAFeesDeposit: [parseAmount.gwei(0), parseAmount.gwei(0.8), parseAmount.gwei(1)],
  yHAFeesDeposit: [parseAmount.gwei(0.0015), parseAmount.gwei(0.002), parseAmount.gwei(0.0025)],

  xHAFeesWithdraw: [parseAmount.gwei(0), parseAmount.gwei(0.6), parseAmount.gwei(1)],
  yHAFeesWithdraw: [parseAmount.gwei(0.003), parseAmount.gwei(0.002), parseAmount.gwei(0.0015)],

  // adds the opportunity for governance to add a bonus or malus to HA fees
  haBonusMalusDeposit: parseAmount.gwei(1),
  haBonusMalusWithdraw: parseAmount.gwei(1),

  // Slippage: Protocol enforced slippage to discourage SLPs to leave (exit fees).
  // SlippageFee: share of total SLPs earnings that should be distributed to SLPs that won't be due to a very low collateral ratio.
  // NO SLIPPAGEFEE WITHOUT SLIPPAGE

  // x: horizontal axis steps relative to the collateral ratio
  // y: ratio of fees
  xSlippage: [parseAmount.gwei(1), parseAmount.gwei(1.1), parseAmount.gwei(1.2)],
  ySlippage: [parseAmount.gwei(0.1), parseAmount.gwei(0.01), parseAmount.gwei(0)],
  xSlippageFee: [parseAmount.gwei(0.99), parseAmount.gwei(1.05), parseAmount.gwei(1.15)],
  ySlippageFee: [parseAmount.gwei(0.9), parseAmount.gwei(0.2), parseAmount.gwei(0)],

  // Option to add a dependency on HA fees to collateral ratio on top of hedge ratio.
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
  // They should be highest when x is at 0.5, putting the hedge ratio back at target, and have a sharp decline.
  // No fees given when we stay above target.
  xKeeperFeesClosing: [parseAmount.gwei(0.495), parseAmount.gwei(0.5), parseAmount.gwei(0.5).add(BigNumber.from(1))],
  yKeeperFeesClosing: [parseAmount.gwei(0), parseAmount.gwei(0.6), parseAmount.gwei(0)],

  // Max interest that can be distributed to SLPs in a block
  // Need to be tuned for each collateral
  maxInterestsDistributed: parseAmount.usdc(1000),

  // FEES
  // Share of protocol fees redistributed to SLP. The rest goes to the protocol reserves.
  feesForSLPs: parseAmount.gwei(0.4),

  // INTEREST
  // Share of the protocol interest redistributed to veANGLE holders as surplus.
  // The rest will be shared between SLP and the protocol according to the next interestsForSLPs parameter.
  interestsForSurplus: parseAmount.gwei(0.5),
  // Share of protocol interest redistributed to SLP.
  // The rest goes to the protocol reserves.
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
      incentiveAmount: parseAmount.ether(100),
      // total amount of gov tokens per agToken-collateral pair to distribute on the whole staking period
      // the amount is in ANGLE and not ETH, .ether is here for formatting
      amountToDistribute: parseAmount.ether('6256520.883'),
    },
    {
      type: 'SLP',
      // Each staking contract is here for 10 years
      duration: BigNumber.from(3600 * 24 * 365 * 10),
      updateFrequency: BigNumber.from(3600 * 24 * 7),
      rewardDuration: BigNumber.from(3600 * 24 * 7 + 1200), // Some 20 minutes delta to make sure that rewards won't accumulate
      incentiveAmount: parseAmount.ether(100),
      amountToDistribute: parseAmount.ether('87591292.36'),
    },
  ],
  currencyDigits: 3,
  nbrStakingToken: 1000,
};

// DAI
const poolsParameters_DAI: PoolParameters = {
  decimals: 18,

  // x: horizontal axis steps relative to the hedge ratio
  // y: fees
  xFeeMint: [parseAmount.gwei(0)],
  yFeeMint: [parseAmount.gwei(0.003)],

  xFeeBurn: [parseAmount.gwei(0)],
  yFeeBurn: [parseAmount.gwei(0.005)],

  xHAFeesDeposit: [parseAmount.gwei(0), parseAmount.gwei(0.8), parseAmount.gwei(1)],
  yHAFeesDeposit: [parseAmount.gwei(0.002), parseAmount.gwei(0.0025), parseAmount.gwei(0.003)],

  xHAFeesWithdraw: [parseAmount.gwei(0), parseAmount.gwei(0.6), parseAmount.gwei(1)],
  yHAFeesWithdraw: [parseAmount.gwei(0.003), parseAmount.gwei(0.0022), parseAmount.gwei(0.002)],

  // adds the opportunity for governance to add a bonus or malus to HA fees
  haBonusMalusDeposit: parseAmount.gwei(1),
  haBonusMalusWithdraw: parseAmount.gwei(1),

  // Slippage: Protocol enforced slippage to disencourage SLPs to leave (exit fees).
  // SlippageFee: share of fees that should be distributed to SLPs but are not due to a very low collateral ratio.
  // NO SLIPPAGEFEE WITHOUT SLIPPAGE

  // x: horizontal axis steps relative to the collateral ratio
  // y: ratio of fees
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
  // They should be highest when x is at 0.5, putting the hedge ratio back at target, and have a sharp decline.
  // No fees given when we stay above target.
  xKeeperFeesClosing: [parseAmount.gwei(0.495), parseAmount.gwei(0.5), parseAmount.gwei(0.5).add(BigNumber.from(1))],
  yKeeperFeesClosing: [parseAmount.gwei(0), parseAmount.gwei(0.6), parseAmount.gwei(0)],

  // Max interest that can be distributed to SLPs in a block
  // Need to be tuned for each collateral
  maxInterestsDistributed: parseAmount.dai(1000),

  // FEES
  // Share of protocol fees redistributed to SLP. The rest goes to the protocol reserves.
  feesForSLPs: parseAmount.gwei(0.2),

  // INTEREST
  // Share of the protocol interest redistributed to veANGLE holders as surplus.
  // The rest will be shared between SLP and the protocol according to the next interestsForSLPs parameter.
  interestsForSurplus: parseAmount.gwei(0.5),
  // Share of protocol interest redistributed to SLP.
  // The rest goes to the protocol reserves.
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

  // x: horizontal axis steps relative to the hedge ratio
  // y: amount of fees
  xFeeMint: [parseAmount.gwei(0)],
  yFeeMint: [parseAmount.gwei(1)],

  xFeeBurn: [parseAmount.gwei(0)],
  yFeeBurn: [parseAmount.gwei(0.005)],

  xHAFeesDeposit: [parseAmount.gwei(0), parseAmount.gwei(0.5), parseAmount.gwei(1)],
  yHAFeesDeposit: [parseAmount.gwei(0.003), parseAmount.gwei(0.004), parseAmount.gwei(0.007)],

  // adds the opportunity for governance to add a bonus or malus to HA fees
  haBonusMalusDeposit: parseAmount.gwei(1),
  haBonusMalusWithdraw: parseAmount.gwei(1),

  xHAFeesWithdraw: [parseAmount.gwei(0), parseAmount.gwei(0.5), parseAmount.gwei(1)],
  yHAFeesWithdraw: [parseAmount.gwei(0.007), parseAmount.gwei(0.004), parseAmount.gwei(0.003)],

  // Slippage: Protocol enforced slippage to disencourage SLPs to leave (exit fees).
  // SlippageFee: share of fees that should be distributed to SLPs but are not due to a very low collateral ratio.
  // NO SLIPPAGEFEE WITHOUT SLIPPAGE

  // x: horizontal axis steps relative to the collateral ratio
  // y: ratio of fees
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
  // They should be highest when x is at 0.5, putting the hedge ratio back at target, and have a sharp decline.
  // No fees given when we stay above target.
  xKeeperFeesClosing: [parseAmount.gwei(0.495), parseAmount.gwei(0.5), parseAmount.gwei(0.5).add(BigNumber.from(1))],
  yKeeperFeesClosing: [parseAmount.gwei(0), parseAmount.gwei(0.6), parseAmount.gwei(0)],

  // Max interest that can be distributed to SLPs in a block
  // Need to be tuned for each collateral
  maxInterestsDistributed: parseAmount.dai(500),

  // FEES
  // Share of protocol fees redistributed to SLP. The rest goes to the protocol reserves.
  feesForSLPs: parseAmount.gwei(0.2),

  // INTEREST
  // Share of the protocol interest redistributed to veANGLE holders as surplus.
  // The rest will be shared between SLP and the protocol according to the next interestsForSLPs parameter.
  interestsForSurplus: parseAmount.gwei(0.5),
  // Share of protocol interest redistributed to SLP.
  // The rest goes to the protocol reserves.
  interestsForSLPs: parseAmount.gwei(0.45),

  // If we need to limit a pool's supply.
  // DISABLED AT THE MOMENT.
  capOnStableMinted: parseAmount.ether(35_000_000),

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

  // x: horizontal axis steps relative to the hedge ratio
  // y: amount of fees
  xFeeMint: [parseAmount.gwei(0.8), parseAmount.gwei(1)],
  yFeeMint: [parseAmount.gwei(0.005), parseAmount.gwei(0.002)],

  xFeeBurn: [parseAmount.gwei(0.5), parseAmount.gwei(1)],
  yFeeBurn: [parseAmount.gwei(0.005), parseAmount.gwei(0.1)],

  xHAFeesDeposit: [parseAmount.gwei(0), parseAmount.gwei(0.5), parseAmount.gwei(1)],
  yHAFeesDeposit: [parseAmount.gwei(0.003), parseAmount.gwei(0.004), parseAmount.gwei(0.007)],

  // adds the opportunity for governance to add a bonus or malus to HA fees
  haBonusMalusDeposit: parseAmount.gwei(1),
  haBonusMalusWithdraw: parseAmount.gwei(1),

  xHAFeesWithdraw: [parseAmount.gwei(0), parseAmount.gwei(0.5), parseAmount.gwei(1)],
  yHAFeesWithdraw: [parseAmount.gwei(0.007), parseAmount.gwei(0.004), parseAmount.gwei(0.003)],

  // Slippage: Protocol enforced slippage to disencourage SLPs to leave (exit fees).
  // SlippageFee: share of fees that should be distributed to SLPs but are not due to a very low collateral ratio.
  // NO SLIPPAGEFEE WITHOUT SLIPPAGE

  // x: horizontal axis steps relative to the collateral ratio
  // y: ratio of fees
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
  // They should be highest when x is at 0.5, putting the hedge ratio back at target, and have a sharp decline.
  // No fees given when we stay above target.
  xKeeperFeesClosing: [parseAmount.gwei(0.495), parseAmount.gwei(0.5), parseAmount.gwei(0.5).add(BigNumber.from(1))],
  yKeeperFeesClosing: [parseAmount.gwei(0), parseAmount.gwei(0.6), parseAmount.gwei(0)],

  // Max interests that can be distributed to SLPs in a block
  // Need to be tuned for each collateral
  maxInterestsDistributed: parseAmount.dai(500),

  // FEES
  // Share of protocol fees redistributed to SLP. The rest goes to the protocol reserves.
  feesForSLPs: parseAmount.gwei(0.2),

  // INTEREST
  // Share of the protocol interest redistributed to veANGLE holders as surplus.
  // The rest will be shared between SLP and the protocol according to the next interestsForSLPs parameter.
  interestsForSurplus: parseAmount.gwei(0.5),
  // Share of protocol interest redistributed to SLP.
  // The rest goes to the protocol reserves.
  interestsForSLPs: parseAmount.gwei(0.45),

  // If we need to limit a pool's supply.
  // DISABLED AT THE MOMENT.
  capOnStableMinted: parseAmount.ether(15_000_000),

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
  keeperFeesLiquidationCap: parseAmount.dai(500),
  keeperFeesClosingCap: parseAmount.dai(500),

  strategies: [
    {
      type: 'Strategy',
      debtRatio: parseAmount.gwei(0.9),
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

const poolsParameters_WETH: PoolParameters = {
  decimals: 18,

  // x: horizontal axis steps relative to the hedge ratio
  // y: amount of fees
  xFeeMint: [parseAmount.gwei(0), parseAmount.gwei(0.8), parseAmount.gwei(1)],
  yFeeMint: [parseAmount.gwei(0.006), parseAmount.gwei(0.006), parseAmount.gwei(0.0055)],
  // after genesis
  // xFeeMint: [parseAmount.gwei(0), parseAmount.gwei(0.4), parseAmount.gwei(0.8), parseAmount.gwei(1)],
  // yFeeMint: [parseAmount.gwei(0.01), parseAmount.gwei(0.0075), parseAmount.gwei(0.006), parseAmount.gwei(0.0055)],

  xFeeBurn: [parseAmount.gwei(0), parseAmount.gwei(0.4), parseAmount.gwei(0.8), parseAmount.gwei(1)],
  yFeeBurn: [parseAmount.gwei(0.0055), parseAmount.gwei(0.006), parseAmount.gwei(0.0075), parseAmount.gwei(0.01)],

  xHAFeesDeposit: [parseAmount.gwei(0), parseAmount.gwei(0.4), parseAmount.gwei(0.8), parseAmount.gwei(1)],
  yHAFeesDeposit: [parseAmount.gwei(0.002), parseAmount.gwei(0.003), parseAmount.gwei(0.004), parseAmount.gwei(0.008)],

  // adds the opportunity for governance to add a bonus or malus to HA fees
  haBonusMalusDeposit: parseAmount.gwei(1),
  haBonusMalusWithdraw: parseAmount.gwei(1),

  xHAFeesWithdraw: [parseAmount.gwei(0), parseAmount.gwei(0.4), parseAmount.gwei(0.8), parseAmount.gwei(1)],
  yHAFeesWithdraw: [parseAmount.gwei(0.008), parseAmount.gwei(0.004), parseAmount.gwei(0.0025), parseAmount.gwei(0.002)],

  // Slippage: Protocol enforced slippage to disencourage SLPs to leave (exit fees).
  // SlippageFee: share of fees that should be distributed to SLPs but are not due to a very low collateral ratio.
  // NO SLIPPAGEFEE WITHOUT SLIPPAGE

  // x: horizontal axis steps relative to the collateral ratio
  // y: ratio of fees
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
  // They should be highest when x is at 0.5, putting the hedge ratio back at target, and have a sharp decline.
  // No fees given when we stay above target.
  xKeeperFeesClosing: [parseAmount.gwei(0.495), parseAmount.gwei(0.5), parseAmount.gwei(0.5).add(BigNumber.from(1))],
  yKeeperFeesClosing: [parseAmount.gwei(0), parseAmount.gwei(0.6), parseAmount.gwei(0)],

  // Max interests that can be distributed to SLPs in a block
  // Need to be tuned for each collateral
  maxInterestsDistributed: parseAmount.ether(0.2),

  // FEES
  // Share of protocol fees redistributed to SLP. The rest goes to the protocol reserves.
  feesForSLPs: parseAmount.gwei(0.3),

  // INTEREST
  // Share of the protocol interest redistributed to veANGLE holders as surplus.
  // The rest will be shared between SLP and the protocol according to the next interestsForSLPs parameter.
  interestsForSurplus: parseAmount.gwei(0.3),
  // Share of protocol interest redistributed to SLP.
  // The rest goes to the protocol reserves.
  interestsForSLPs: parseAmount.gwei(0.7),

  // If we need to limit a pool's supply.
  // DISABLED AT THE MOMENT.
  capOnStableMinted: parseAmount.ether(5_000_000),

  // HAs parameters
  limitHAHedge: parseAmount.gwei(0.98),
  targetHAHedge: parseAmount.gwei(0.96),
  maxLeverage: parseAmount.gwei(9),
  maintenanceMargin: parseAmount.gwei(0.0625),
  // Share of the maintenance margin keeper receive as fees
  keeperFeesLiquidationRatio: parseAmount.gwei(0.6),
  lockTime: BigNumber.from(3600),

  // Max fees keeper can receive for a liquidation and a force-close
  // Paid in collateral
  keeperFeesLiquidationCap: parseAmount.ether(0.2),
  keeperFeesClosingCap: parseAmount.dai(0.2),

  strategies: [
    {
      type: 'StrategyStETH',
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

  stakings: [],
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
    WETH: poolsParameters_WETH,
  },
};

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
          interestRate: interestRate,
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
          interestRate: interestRate,
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
          interestRate: interestRate,
          liquidationSurcharge: parseAmount.gwei('0.98'),
          maxLiquidationDiscount: parseAmount.gwei('0.085'),
          whitelistingActivated: false,
          baseBoost: parseAmount.gwei('0.7'),
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
          interestRate: interestRate,
          liquidationSurcharge: parseAmount.gwei('0.98'),
          maxLiquidationDiscount: parseAmount.gwei('0.05'),
          whitelistingActivated: false,
          baseBoost: parseAmount.gwei('1.5'),
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
          interestRate: interestRate,
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
          interestRate: interestRate,
          liquidationSurcharge: parseAmount.gwei('0.98'),
          maxLiquidationDiscount: parseAmount.gwei('0.08'),
          whitelistingActivated: false,
          baseBoost: parseAmount.gwei('2.5'),
        },
      },
    ],
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
    {
      type: 'OracleMulti',
      inName: 'WETH',
      outName: 'EUR',
      params: {
        chainlinkPairs: ['ETH/USD', 'EUR/USD'],
        uniswapTokens: ['WETH', 'USDC'],
        uniswapPoolFees: [500],
        twapPeriod: 600,
        observationLength: 100,
        uniFinalCurrency: 1,
        chainlinkIsMultiplied: [1, 0],
        stalePeriod: 3600 * 1.5,
      },
    },
  ],
};

export default {
  poolsParameters: poolsParameters,
  stablesParameters: stablesParameters,
  globalParameters: globalParameters,
};

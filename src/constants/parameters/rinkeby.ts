import { BigNumber, ethers } from 'ethers';
import { parseEther, parseUnits } from 'ethers/lib/utils';

import { multByPow, parseAmount } from '../../utils/bignumber';
import { GlobalParameters, PoolParameters, PoolsParameters, StablesParameters } from './types';

// Collateral-specific parameters

// USDC
const poolsParameters_USDC: PoolParameters = {
  decimals: 6,

  // x: horizontal axis steps relative to the hedge ratio
  // y: fees
  // here, fees increae from 0.2% to 0.3% between 70% and 80% of hedge ratio, and then stay at 0.3%
  xFeeMint: [parseAmount.gwei(0), parseAmount.gwei(0.7), parseAmount.gwei(0.8), parseAmount.gwei(1)],
  yFeeMint: [parseAmount.gwei(0.003), parseAmount.gwei(0.003), parseAmount.gwei(0.002), parseAmount.gwei(0.002)],

  xFeeBurn: [parseAmount.gwei(0), parseAmount.gwei(0.7), parseAmount.gwei(0.8), parseAmount.gwei(1)],
  yFeeBurn: [parseAmount.gwei(0.002), parseAmount.gwei(0.002), parseAmount.gwei(0.003), parseAmount.gwei(0.003)],

  xHAFeesDeposit: [parseAmount.gwei(0), parseAmount.gwei(0.7), parseAmount.gwei(0.8), parseAmount.gwei(1)],
  yHAFeesDeposit: [parseAmount.gwei(0.002), parseAmount.gwei(0.002), parseAmount.gwei(0.003), parseAmount.gwei(0.003)],

  haBonusMalusDeposit: parseAmount.gwei(1),
  haBonusMalusWithdraw: parseAmount.gwei(1),

  xHAFeesWithdraw: [parseAmount.gwei(0), parseAmount.gwei(0.7), parseAmount.gwei(0.8), parseAmount.gwei(1)],
  yHAFeesWithdraw: [parseAmount.gwei(0.003), parseAmount.gwei(0.003), parseAmount.gwei(0.002), parseAmount.gwei(0.002)],

  // Slippage: Protocol enforced slippage to disencourage SLPs to leave (exit fees).
  // SlippageFee: share of total SLPs earnings that should be distributed to SLPs that won't be due to a very low collateral ratio.
  // NO SLIPPAGEFEE WITHOUT SLIPPAGE

  // x: horizontal axis steps relative to the collateral ratio
  // y: ratio of fees
  xSlippage: [parseAmount.gwei(0.8), parseAmount.gwei(0.9), parseAmount.gwei(1), parseAmount.gwei(1.2)],
  ySlippage: [parseAmount.gwei(0.2), parseAmount.gwei(0.05), parseAmount.gwei(0.01), parseAmount.gwei(0)],
  xSlippageFee: [parseAmount.gwei(0.5), parseAmount.gwei(1), parseAmount.gwei(1.2)],
  ySlippageFee: [parseAmount.gwei(0.5), parseAmount.gwei(0.05), parseAmount.gwei(0)],

  // Option to add dependency on HA fees to collateral ratio.
  // DISABLED AT THE MOMENT
  haFeeDeposit: parseAmount.gwei(1),
  haFeeWithdraw: parseAmount.gwei(1),

  // Option to add a dependency of mint & burn fees to collateral ratio.
  // DISABLED AT THE MOMENT
  xBonusMalusMint: [parseAmount.gwei(0.5), parseAmount.gwei(1)],
  yBonusMalusMint: [parseAmount.gwei(0.8), parseAmount.gwei(1)],
  xBonusMalusBurn: [parseAmount.gwei(0), parseAmount.gwei(0.5), parseAmount.gwei(1), parseAmount.gwei(1.3), parseAmount.gwei(1.5)],
  yBonusMalusBurn: [parseAmount.gwei(10), parseAmount.gwei(4), parseAmount.gwei(1.5), parseAmount.gwei(1), parseAmount.gwei(1)],

  // Keeper rewards for force-closing positions.
  // They should be highest when x is at 0.5, putting the hedge ratio back at target.
  xKeeperFeesClosing: [parseAmount.gwei(0.4), parseAmount.gwei(0.5), parseAmount.gwei(0.6)],
  yKeeperFeesClosing: [parseAmount.gwei(0.1), parseAmount.gwei(0.6), parseAmount.gwei(0.1)],

  // Max interests that can be distributed to SLPs in a block
  // Need to be tuned for each collateral
  maxInterestsDistributed: parseAmount.usdc(1000),

  // FEES
  // Share of protocol fees redistributed to SLP. The rest goes to the protocol reserves.
  feesForSLPs: parseAmount.gwei(0.1),

  // INTEREST
  // Share of the protocol interest redistributed to veANGLE holders as surplus.
  // The rest will be shared between SLP and the protocol according to the next interestsForSLPs parameter.
  interestsForSurplus: parseAmount.gwei(0.2),
  // Share of protocol interest redistributed to SLP.
  // The rest goes to the protocol reserves.
  interestsForSLPs: parseAmount.gwei(0.6),

  // If we need to limit a pool's supply.
  // DISABLED AT THE MOMENT.
  capOnStableMinted: ethers.constants.MaxUint256,

  // HAs parameters
  limitHAHedge: parseAmount.gwei(0.95),
  targetHAHedge: parseAmount.gwei(0.9),
  maxLeverage: parseAmount.gwei(99),
  maintenanceMargin: parseAmount.gwei(0.005),
  // Share of the maintenance margin keeper receive as fees
  keeperFeesLiquidationRatio: parseAmount.gwei(0.6),
  lockTime: BigNumber.from(100),

  // Max fees keeper can receive for a liquidation and a force-close
  // Paid in collateral
  keeperFeesLiquidationCap: parseAmount.usdc(500),
  keeperFeesClosingCap: parseAmount.usdc(500),

  // Strategy parameters
  strategies: [
    {
      type: 'Strategy',
      debtRatio: parseAmount.gwei(0.8),
      params: {
        path: ethers.utils.hexlify(0),
      },
    },
  ],

  // Staking parameters
  // TODO: this is no longer useful here
  stakings: [
    {
      type: 'HA',
      // total duration of the staking process
      duration: BigNumber.from(3600 * 24 * 365 * 5),
      // The minimum time between updates of distribution parameters by keepers
      updateFrequency: BigNumber.from(3600 * 24 * 7),
      // For how long the tokens are distributed
      rewardDuration: BigNumber.from(3600 * 24 * 8),
      // incentive per period for keepers to enforce the scheduled updates
      // the amount is in ANGLE and not ETH, .ether is here for formatting
      incentiveAmount: parseAmount.ether(100), // ANGLE, but tokens are in the same base than ETH
      // total amount of gov tokens per agToken-collateral pair to distribute on the whole staking period
      // the amount is in ANGLE and not ETH, .ether is here for formatting
      amountToDistribute: parseAmount.ether(5_000_000), // ANGLE, but tokens are in the same base than ETH
    },
    {
      type: 'SLP',
      duration: BigNumber.from(3600 * 24 * 365 * 5),
      updateFrequency: BigNumber.from(3600 * 24 * 7),
      rewardDuration: BigNumber.from(3600 * 24 * 8),
      incentiveAmount: parseAmount.ether(100),
      amountToDistribute: parseAmount.ether(5_000_000),
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
  xFeeMint: [parseAmount.gwei(0), parseAmount.gwei(0.7), parseAmount.gwei(0.8), parseAmount.gwei(1)],
  yFeeMint: [parseAmount.gwei(0.003), parseAmount.gwei(0.003), parseAmount.gwei(0.002), parseAmount.gwei(0.002)],

  xFeeBurn: [parseAmount.gwei(0), parseAmount.gwei(0.7), parseAmount.gwei(0.8), parseAmount.gwei(1)],
  yFeeBurn: [parseAmount.gwei(0.002), parseAmount.gwei(0.002), parseAmount.gwei(0.003), parseAmount.gwei(0.003)],

  xHAFeesDeposit: [parseAmount.gwei(0), parseAmount.gwei(0.7), parseAmount.gwei(0.8), parseAmount.gwei(1)],
  yHAFeesDeposit: [parseAmount.gwei(0.002), parseAmount.gwei(0.002), parseAmount.gwei(0.003), parseAmount.gwei(0.003)],

  haBonusMalusDeposit: parseAmount.gwei(1),
  haBonusMalusWithdraw: parseAmount.gwei(1),

  xHAFeesWithdraw: [parseAmount.gwei(0), parseAmount.gwei(0.7), parseAmount.gwei(0.8), parseAmount.gwei(1)],
  yHAFeesWithdraw: [parseAmount.gwei(0.003), parseAmount.gwei(0.003), parseAmount.gwei(0.002), parseAmount.gwei(0.002)],

  // Slippage: Protocol enforced slippage to disencourage SLPs to leave (exit fees).
  // SlippageFee: share of fees that should be distributed to SLPs but are not due to a very low collateral ratio.
  // NO SLIPPAGEFEE WITHOUT SLIPPAGE

  // x: horizontal axis steps relative to the collateral ratio, y: ratio of fees
  xSlippage: [parseAmount.gwei(0.8), parseAmount.gwei(0.9), parseAmount.gwei(1), parseAmount.gwei(1.2)],
  ySlippage: [parseAmount.gwei(0.2), parseAmount.gwei(0.05), parseAmount.gwei(0.01), parseAmount.gwei(0)],
  xSlippageFee: [parseAmount.gwei(0.5), parseAmount.gwei(1), parseAmount.gwei(1.2)],
  ySlippageFee: [parseAmount.gwei(0.5), parseAmount.gwei(0.05), parseAmount.gwei(0)],

  // Option to add dependency on HA fees to collateral ratio.
  // DISABLED AT THE MOMENT
  haFeeDeposit: parseAmount.gwei(1),
  haFeeWithdraw: parseAmount.gwei(1),

  // Option to add a dependency of mint & burn fees to collateral ratio.
  // DISABLED AT THE MOMENT
  xBonusMalusMint: [parseAmount.gwei(0.5), parseAmount.gwei(1)],
  yBonusMalusMint: [parseAmount.gwei(0.8), parseAmount.gwei(1)],
  xBonusMalusBurn: [parseAmount.gwei(0), parseAmount.gwei(0.5), parseAmount.gwei(1), parseAmount.gwei(1.3), parseAmount.gwei(1.5)],
  yBonusMalusBurn: [parseAmount.gwei(10), parseAmount.gwei(4), parseAmount.gwei(1.5), parseAmount.gwei(1), parseAmount.gwei(1)],

  // Keeper rewards for force-closing positions.
  // They should be highest when x is at 0.5, putting the hedge ratio back at target.
  xKeeperFeesClosing: [parseAmount.gwei(0.4), parseAmount.gwei(0.5), parseAmount.gwei(0.6)],
  yKeeperFeesClosing: [parseAmount.gwei(0.1), parseAmount.gwei(0.6), parseAmount.gwei(0.1)],

  // Max interests that can be distributed to SLPs in a block
  // Need to be tuned for each collateral
  maxInterestsDistributed: parseAmount.dai(1000),

  // FEES
  // Share of protocol fees redistributed to SLP. The rest goes to the protocol reserves.
  feesForSLPs: parseAmount.gwei(0.1),

  // INTEREST
  // Share of the protocol interest redistributed to veANGLE holders as surplus.
  // The rest will be shared between SLP and the protocol according to the next interestsForSLPs parameter.
  interestsForSurplus: parseAmount.gwei(0.2),
  // Share of protocol interest redistributed to SLP.
  // The rest goes to the protocol reserves.
  interestsForSLPs: parseAmount.gwei(0.6),

  // If we need to limit a pool's supply.
  // DISABLED AT THE MOMENT.
  capOnStableMinted: ethers.constants.MaxUint256,

  limitHAHedge: parseAmount.gwei(0.95),
  targetHAHedge: parseAmount.gwei(0.9),
  maxLeverage: parseAmount.gwei(100),
  maintenanceMargin: parseAmount.gwei(0.005),
  // Share of the maintenance margin keeper receive as fees
  keeperFeesLiquidationRatio: parseAmount.gwei(0.6),
  lockTime: BigNumber.from(100),

  // Max fees keeper can receive for a liquidation and a force-close
  // Paid in collateral
  keeperFeesLiquidationCap: parseAmount.dai(500),
  keeperFeesClosingCap: parseAmount.dai(500),

  strategies: [
    {
      type: 'Strategy',
      debtRatio: parseAmount.gwei(0.8),
      params: {
        path: ethers.utils.hexlify(0),
      },
    },
  ],

  stakings: [
    {
      type: 'HA',
      duration: BigNumber.from(3600 * 24 * 365 * 5),
      updateFrequency: BigNumber.from(3600 * 24 * 7),
      rewardDuration: BigNumber.from(3600 * 24 * 8),
      incentiveAmount: parseAmount.ether(100), // ANGLE, but tokens are in the same base than ETH
      amountToDistribute: parseAmount.ether(5_000_000), // ANGLE, but tokens are in the same base than ETH
    },
    {
      type: 'SLP',
      duration: BigNumber.from(3600 * 24 * 365 * 5),
      updateFrequency: BigNumber.from(3600 * 24 * 7),
      rewardDuration: BigNumber.from(3600 * 24 * 8),
      incentiveAmount: parseAmount.ether(100), // ANGLE, but tokens are in the same base than ETH
      amountToDistribute: parseAmount.ether(5_000_000), // ANGLE, but tokens are in the same base than ETH
    },
  ],
  currencyDigits: 3,
  nbrStakingToken: 1000,
};

// WETH
const poolsParameters_WETH: PoolParameters = {
  decimals: 18,

  xFeeMint: [parseAmount.gwei(0.7), parseAmount.gwei(0.9), parseAmount.gwei(1)],
  yFeeMint: [parseAmount.gwei(0.005), parseAmount.gwei(0.003), parseAmount.gwei(0.001)],

  xFeeBurn: [parseAmount.gwei(0.7), parseAmount.gwei(0.9), parseAmount.gwei(0.999), parseAmount.gwei(1)],
  yFeeBurn: [parseAmount.gwei(0.001), parseAmount.gwei(0.003), parseAmount.gwei(0.005), parseAmount.gwei(0.99)],

  xHAFeesDeposit: [parseAmount.gwei(0.7), parseAmount.gwei(0.9), parseAmount.gwei(1)],
  yHAFeesDeposit: [parseAmount.gwei(0.001), parseAmount.gwei(0.002), parseAmount.gwei(0.005)],

  haBonusMalusDeposit: parseAmount.gwei(1),
  haBonusMalusWithdraw: parseAmount.gwei(1),

  xHAFeesWithdraw: [parseAmount.gwei(0.7), parseAmount.gwei(0.9), parseAmount.gwei(1)],
  yHAFeesWithdraw: [parseAmount.gwei(0.005), parseAmount.gwei(0.002), parseAmount.gwei(0.001)],

  xSlippage: [parseAmount.gwei(0.8), parseAmount.gwei(0.9), parseAmount.gwei(1), parseAmount.gwei(1.2)],
  ySlippage: [parseAmount.gwei(0.2), parseAmount.gwei(0.05), parseAmount.gwei(0.01), parseAmount.gwei(0)],
  xSlippageFee: [parseAmount.gwei(0.5), parseAmount.gwei(1), parseAmount.gwei(1.2)],
  ySlippageFee: [parseAmount.gwei(0.5), parseAmount.gwei(0.05), parseAmount.gwei(0)],

  // DISABLED AT THE MOMENT
  haFeeDeposit: parseAmount.gwei(1),
  haFeeWithdraw: parseAmount.gwei(1),

  // DISABLED AT THE MOMENT
  xBonusMalusMint: [parseAmount.gwei(0.5), parseAmount.gwei(1)],
  yBonusMalusMint: [parseAmount.gwei(0.8), parseAmount.gwei(1)],
  xBonusMalusBurn: [parseAmount.gwei(0), parseAmount.gwei(0.5), parseAmount.gwei(1), parseAmount.gwei(1.3), parseAmount.gwei(1.5)],
  yBonusMalusBurn: [parseAmount.gwei(10), parseAmount.gwei(4), parseAmount.gwei(1.5), parseAmount.gwei(1), parseAmount.gwei(1)],

  xKeeperFeesClosing: [parseAmount.gwei(0.4), parseAmount.gwei(0.5), parseAmount.gwei(0.6)],
  yKeeperFeesClosing: [parseAmount.gwei(0.1), parseAmount.gwei(0.6), parseAmount.gwei(0.1)],

  // Max interests that can be distributed to SLPs in a block
  // Need to be tuned for each collateral
  maxInterestsDistributed: parseAmount.ether(1),

  // FEES
  // Share of protocol fees redistributed to SLP. The rest goes to the protocol reserves.
  feesForSLPs: parseAmount.gwei(0.1),

  // INTEREST
  // Share of the protocol interest redistributed to veANGLE holders as surplus.
  // The rest will be shared between SLP and the protocol according to the next interestsForSLPs parameter.
  interestsForSurplus: parseAmount.gwei(0.2),
  // Share of protocol interest redistributed to SLP.
  // The rest goes to the protocol reserves.
  interestsForSLPs: parseAmount.gwei(0.6),

  // DISABLED AT THE MOMENT.
  capOnStableMinted: ethers.constants.MaxUint256,

  limitHAHedge: parseAmount.gwei(0.95),
  targetHAHedge: parseAmount.gwei(0.9),
  maxLeverage: parseAmount.gwei(9),
  maintenanceMargin: parseAmount.gwei(0.0625),
  keeperFeesLiquidationRatio: parseAmount.gwei(0.2),
  lockTime: BigNumber.from(100),

  keeperFeesLiquidationCap: parseAmount.ether(0.3),
  keeperFeesClosingCap: parseAmount.ether(0.3),

  strategies: [
    {
      type: 'Strategy',
      debtRatio: parseAmount.gwei(0.8),
      params: {
        path: ethers.utils.hexlify(0),
      },
    },
  ],

  stakings: [
    {
      type: 'HA',
      duration: BigNumber.from(3600 * 24 * 365 * 5),
      updateFrequency: BigNumber.from(3600 * 24 * 7),
      rewardDuration: BigNumber.from(3600 * 24 * 8),
      incentiveAmount: parseAmount.ether(100), // in ANGLE, but tokens are in the same base than ETH
      amountToDistribute: parseAmount.ether(7_500_000), // in ANGLE, but tokens are in the same base than ETH
    },
    {
      type: 'SLP',
      duration: BigNumber.from(3600 * 24 * 365 * 5),
      updateFrequency: BigNumber.from(3600 * 24 * 7),
      rewardDuration: BigNumber.from(3600 * 24 * 8),
      incentiveAmount: parseAmount.ether(100),
      amountToDistribute: parseAmount.ether(3_750_000),
    },
  ],
  currencyDigits: 4,
  nbrStakingToken: 1,
};

// WBTC
const poolsParameters_WBTC: PoolParameters = {
  decimals: 8,

  xFeeMint: [parseAmount.gwei(0.7), parseAmount.gwei(0.9), parseAmount.gwei(1)],
  yFeeMint: [parseAmount.gwei(0.005), parseAmount.gwei(0.003), parseAmount.gwei(0.001)],

  xFeeBurn: [parseAmount.gwei(0.7), parseAmount.gwei(0.9), parseAmount.gwei(1)],
  yFeeBurn: [parseAmount.gwei(0.001), parseAmount.gwei(0.003), parseAmount.gwei(0.005)],

  xHAFeesDeposit: [parseAmount.gwei(0.7), parseAmount.gwei(0.9), parseAmount.gwei(1)],
  yHAFeesDeposit: [parseAmount.gwei(0.001), parseAmount.gwei(0.002), parseAmount.gwei(0.005)],

  haBonusMalusDeposit: parseAmount.gwei(1),
  haBonusMalusWithdraw: parseAmount.gwei(1),

  xHAFeesWithdraw: [parseAmount.gwei(0.7), parseAmount.gwei(0.9), parseAmount.gwei(1)],
  yHAFeesWithdraw: [parseAmount.gwei(0.005), parseAmount.gwei(0.002), parseAmount.gwei(0.001)],

  xSlippage: [parseAmount.gwei(0.8), parseAmount.gwei(0.9), parseAmount.gwei(1), parseAmount.gwei(1.2)],
  ySlippage: [parseAmount.gwei(0.2), parseAmount.gwei(0.05), parseAmount.gwei(0.01), parseAmount.gwei(0)],
  xSlippageFee: [parseAmount.gwei(0.5), parseAmount.gwei(1), parseAmount.gwei(1.2)],
  ySlippageFee: [parseAmount.gwei(0.5), parseAmount.gwei(0.05), parseAmount.gwei(0)],

  // DISABLED AT THE MOMENT.
  haFeeDeposit: parseAmount.gwei(1),
  haFeeWithdraw: parseAmount.gwei(1),

  // DISABLED AT THE MOMENT.
  xBonusMalusMint: [parseAmount.gwei(0.5), parseAmount.gwei(1)],
  yBonusMalusMint: [parseAmount.gwei(0.8), parseAmount.gwei(1)],
  xBonusMalusBurn: [parseAmount.gwei(0), parseAmount.gwei(0.5), parseAmount.gwei(1), parseAmount.gwei(1.3), parseAmount.gwei(1.5)],
  yBonusMalusBurn: [parseAmount.gwei(10), parseAmount.gwei(4), parseAmount.gwei(1.5), parseAmount.gwei(1), parseAmount.gwei(1)],

  xKeeperFeesClosing: [parseAmount.gwei(0.25), parseAmount.gwei(0.5), parseAmount.gwei(1)],
  yKeeperFeesClosing: [parseAmount.gwei(0.1), parseAmount.gwei(0.6), parseAmount.gwei(0.1)],

  maxInterestsDistributed: multByPow(100, 8),

  // FEES
  // Share of protocol fees redistributed to SLP. The rest goes to the protocol reserves.
  feesForSLPs: parseAmount.gwei(0.5),

  // INTEREST
  // Share of the protocol interest redistributed to veANGLE holders as surplus.
  // The rest will be shared between SLP and the protocol according to the next interestsForSLPs parameter.
  interestsForSurplus: parseAmount.gwei(0.2),
  // Share of protocol interest redistributed to SLP.
  // The rest goes to the protocol reserves.
  interestsForSLPs: parseAmount.gwei(0.5),

  // DISABLED AT THE MOMENT.
  capOnStableMinted: ethers.constants.MaxUint256,

  limitHAHedge: parseAmount.gwei(0.95),
  targetHAHedge: parseAmount.gwei(0.9),
  maxLeverage: parseAmount.gwei(3),
  maintenanceMargin: parseAmount.gwei(0.0625),
  keeperFeesLiquidationRatio: parseAmount.gwei(0.2),
  lockTime: BigNumber.from(100),

  keeperFeesLiquidationCap: multByPow(100, 8),
  keeperFeesClosingCap: multByPow(100, 8),

  strategies: [
    {
      type: 'Strategy',
      debtRatio: parseAmount.gwei(0.8),
      params: {
        path: ethers.utils.hexlify(0),
      },
    },
  ],

  stakings: [
    {
      type: 'HA',
      duration: BigNumber.from(3600 * 24 * 365 * 5),
      updateFrequency: BigNumber.from(3600 * 24 * 7),
      rewardDuration: BigNumber.from(3600 * 24 * 8),
      incentiveAmount: parseAmount.ether(100),
      amountToDistribute: parseAmount.ether(7_500_000),
    },
    {
      type: 'SLP',
      duration: BigNumber.from(3600 * 24 * 365 * 5),
      updateFrequency: BigNumber.from(3600 * 24 * 7),
      rewardDuration: BigNumber.from(3600 * 24 * 8),
      incentiveAmount: parseAmount.ether(100),
      amountToDistribute: parseAmount.ether(3_750_000),
    },
  ],
  currencyDigits: 5,
  nbrStakingToken: 1,
};

// definition of collateral/stablecoin pairs in the protocol, related to the previously set collateral parameters.
const poolsParameters: PoolsParameters = {
  EUR: {
    USDC: poolsParameters_USDC,
    DAI: poolsParameters_DAI,
    WETH: poolsParameters_WETH,
    WBTC: poolsParameters_WBTC,
  },
};
let yearlyRate = 1.05;
let ratePerSecond = yearlyRate ** (1 / (365 * 24 * 3600)) - 1;
let yearlyRate2 = 1.04;
let ratePerSecond2 = yearlyRate2 ** (1 / (365 * 24 * 3600)) - 1;
let yearlyRate3 = 1.01;
let ratePerSecond3 = yearlyRate3 ** (1 / (365 * 24 * 3600)) - 1;
// agTokens specific parameters
const stablesParameters: StablesParameters = {
  EUR: {
    stakings: [
      {
        type: 'User',
        duration: BigNumber.from(3600 * 24 * 365 * 5),
        updateFrequency: BigNumber.from(3600 * 24 * 7),
        rewardDuration: BigNumber.from(3600 * 24 * 8),
        incentiveAmount: parseAmount.ether(100),
        amountToDistribute: parseAmount.ether(17_500_000),
      },
    ],
    currencySymbol: '€',
    vaultManagers: [
      {
        collateral: '0x2628CCa21de1BFF738B200176EC9d2bc4aecd735', // Collateral Address
        symbol: 'wBTC/EUR',
        oracle: 'BTC_EUR',
        params: {
          debtCeiling: parseEther('1000000000'),
          collateralFactor: parseAmount.gwei(0.6),
          targetHealthFactor: parseAmount.gwei(1.25),
          borrowFee: parseAmount.gwei(0),
          interestRate: parseUnits(ratePerSecond.toFixed(27), 27),
          liquidationSurcharge: parseAmount.gwei(0.98),
          maxLiquidationDiscount: parseAmount.gwei(0.2),
          whitelistingActivated: false,
          baseBoost: parseAmount.gwei(1),
        },
      },
      {
        collateral: '0x69B1D0e8D7E138450269D6328dA1865073bE3657', // Collateral Address
        symbol: 'LINK/EUR',
        oracle: 'LINK_EUR',
        params: {
          debtCeiling: parseEther('1000000000'),
          collateralFactor: parseAmount.gwei(0.7),
          targetHealthFactor: parseAmount.gwei(1.25),
          borrowFee: parseAmount.gwei(0.003),
          interestRate: parseUnits(ratePerSecond2.toFixed(27), 27),
          liquidationSurcharge: parseAmount.gwei(0.98),
          maxLiquidationDiscount: parseAmount.gwei(0.15),
          whitelistingActivated: false,
          baseBoost: parseAmount.gwei(0.5),
        },
      },
      {
        collateral: '0xc778417E063141139Fce010982780140Aa0cD5Ab',
        symbol: 'wETH/EUR',
        oracle: 'ETH_EUR',
        params: {
          debtCeiling: parseEther('1000000000'),
          collateralFactor: parseAmount.gwei(0.66),
          targetHealthFactor: parseAmount.gwei(1.25),
          borrowFee: parseAmount.gwei(0.003),
          interestRate: parseUnits(ratePerSecond3.toFixed(27), 27),
          liquidationSurcharge: parseAmount.gwei(0.98),
          maxLiquidationDiscount: parseAmount.gwei(0.25),
          whitelistingActivated: false,
          baseBoost: parseAmount.gwei(1.5),
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
      type: 'OracleChainlinkMulti',
      inName: 'USDC',
      outName: 'EUR',
      params: {
        pairs: ['USDC/USD', 'EUR/USD'],
        multipliers: [1, 0],
        inBase: parseAmount.usdc(1),
        stalePeriod: 3600 * 24,
      },
    },
    {
      type: 'OracleChainlinkMulti',
      inName: 'DAI',
      outName: 'EUR',
      params: {
        pairs: ['DAI/USD', 'EUR/USD'],
        multipliers: [1, 0],
        inBase: parseAmount.dai(1),
        stalePeriod: 3600 * 24,
      },
    },
    {
      type: 'OracleChainlinkMulti',
      inName: 'WETH',
      outName: 'EUR',
      params: {
        pairs: ['ETH/USD', 'EUR/USD'],
        multipliers: [1, 0],
        inBase: parseAmount.ether(1),
        stalePeriod: 3600 * 24,
      },
    },
    {
      type: 'OracleChainlinkMulti',
      inName: 'WBTC',
      outName: 'EUR',
      params: {
        pairs: ['BTC/USD', 'EUR/USD'],
        multipliers: [1, 0],
        inBase: parseAmount.wbtc(1),
        stalePeriod: 3600 * 24,
      },
    },
  ],
};

export default {
  poolsParameters: poolsParameters,
  stablesParameters: stablesParameters,
  globalParameters: globalParameters,
};

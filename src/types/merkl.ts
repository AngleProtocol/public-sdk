export enum WrapperType {
  'ARRAKIS' = 0,
  'ARRAKIS_GAUGE' = 1,
  'GAMMA' = 2,
}

export type RewardOrigin = 'UniswapV3' | 'Arrakis' | 'Arrakis Gauge' | 'Gamma';

// ============================= AGGREGATED REWARDS ============================

export type MerklRewardDistributionType = {
  boostedAddress: string;
  boostedReward: number;
  holders: { [holder: string]: { amount: string; breakdown?: { [origin in RewardOrigin]?: string } } };
  lastUpdateEpoch: number; // The only use of this is to quickly know if a distribution was already completed
  pool: string;
  token: string;
  tokenDecimals: number;
  tokenSymbol: string;
  totalAmount: string;
};

export type UnderlyingTreeType = { [rewardId: string]: MerklRewardDistributionType };

export type AggregatedRewardsType = {
  lastUpdateEpoch: number;
  rewards: UnderlyingTreeType;
  updateTimestamp: number;
};

// =============================== API DATA TYPE ===============================

export type BreakdownType = { [origin in RewardOrigin]?: number };

export type DistributionDataType = {
  token: string; // Token distributed
  tokenSymbol: string;

  amount: number; // Amount distributed
  propToken0: number;
  propToken1: number;
  propFees: number;

  unclaimed: number; // Unclaimed reward amount by the user
  breakdown?: BreakdownType; // rewards earned breakdown

  start: number;
  end: number;

  wrappers: WrapperType[]; // Supported wrapper types for this pool
};

export type PoolDataType = Partial<{
  pool: string; // AMM pool address
  poolFee: number; // Fee of the AMM pool

  token0: string;
  tokenSymbol0: string;
  token0InPool: number; // Total amount of token0 in the pool

  token1: string;
  tokenSymbol1: string;
  token1InPool: number; // Total amount of token1 in the pool

  // User tokens in the pool and breakdown by wrapper
  userTotalBalance0: number;
  userTotalBalance1: number;
  userBalances: { balance0: number; balance1: number; origin: WrapperType | -1 }[];

  meanAPR: number; // Average APR in the pool
  aprs: { [origin in RewardOrigin]?: string }; // APR description depending on wrapper type

  // Rewards earned by the user breakdown per token
  // token => {total to claim, total accumulated, token symbol, breakdown per wrapper type}
  rewardsPerToken?: { [token: string]: { total: number; accumulated: number; symbol: string; breakdown: BreakdownType } };

  // Detail of each distribution
  distributionData: DistributionDataType[];
}>;

/**
 * Global data object returned by the api, that can be used to build front-ends
 */
export type MerklAPIData = {
  message: string;
  signed: boolean;
  feeRebate: number;
  pools: PoolDataType[]; // Data per pool to build cards
  transactionData: {
    // Data to build transaction
    claim: string;
    token: string;
    leaf: string;
    proof?: string[];
  }[];
};

import { ChainId } from '.';

const MerklSupportedChainIds = <const>[ChainId.ARBITRUM, ChainId.MAINNET, ChainId.OPTIMISM, ChainId.POLYGON];

export type MerklSupportedChainIdsType = typeof MerklSupportedChainIds[number];

export const isMerklSupportedChainId = (chainId: any): chainId is MerklSupportedChainIdsType => {
  return MerklSupportedChainIds.includes(chainId);
};

export enum AMMType {
  UniswapV3 = 0,
  SushiSwapV3 = 1,
  Retro = 2,
}

export enum UniswapV3Wrapper {
  Arrakis = 0,
  Gamma = 2,
}

type WrapperTypeMapping = {
  [AMMType.UniswapV3]: UniswapV3Wrapper;
  [AMMType.SushiSwapV3]: null;
  [AMMType.Retro]: null;
};

export const Wrapper = {
  [AMMType.UniswapV3]: UniswapV3Wrapper,
  [AMMType.SushiSwapV3]: null,
  [AMMType.Retro]: null,
};

export type WrapperType<T extends AMMType> = WrapperTypeMapping[T];

export enum BlacklistWrapper {
  Blacklist = 3,
}

/** Reward origin */

type RewardOriginMapping = {
  [AMMType.UniswapV3]: 'UniswapV3' | keyof typeof Wrapper[AMMType.UniswapV3];
  [AMMType.SushiSwapV3]: 'SushiSwap';
  [AMMType.Retro]: 'Retro';
};

export type RewardOrigin<T extends AMMType> = RewardOriginMapping[T];

// ============================= JSON DATA TYPE =============================

export type MerklRewardDistributionType = {
  [K in keyof typeof AMMType]: {
    amm: typeof AMMType[K];
    boostedAddress: string;
    boostedReward: number;
    holders: {
      [holder: string]: { amount: string; breakdown?: { [origin in RewardOrigin<typeof AMMType[K]>]?: string } };
    };
    lastUpdateEpoch: number; // The only use of this is to quickly know if a distribution was already completed
    pool: string;
    token: string;
    tokenDecimals: number;
    tokenSymbol: string;
    totalAmount: string;
  };
}[keyof typeof AMMType];

export type UnderlyingTreeType = { [rewardId: string]: MerklRewardDistributionType };

export type AggregatedRewardsType = {
  lastUpdateEpoch: number;
  rewards: UnderlyingTreeType;
  updateTimestamp: number;
  updateTxBlockNumber?: number;
};

// =============================== API DATA TYPE ===============================

export type DistributionDataType<T extends AMMType> = {
  amm: AMMType;
  amount: number; // Amount distributed
  breakdown?: { [origin in RewardOrigin<T>]?: number }; // rewards earned breakdown
  end: number;
  isOutOfRangeIncentivized: boolean;
  propFees: number;
  propToken0: number;
  propToken1: number;
  start: number;
  token: string; // Token distributed
  tokenSymbol: string;
  unclaimed?: number; // Unclaimed reward amount by the user
  wrappers: WrapperType<T>[]; // Supported wrapper types for this pool
};

export type PoolDataType<T extends AMMType> = Partial<{
  pool: string; // AMM pool address
  poolFee: number; // Fee of the AMM pool

  token0: string;
  decimalToken0: number;
  tokenSymbol0: string;
  token0InPool: number; // Total amount of token0 in the pool
  token1: string;
  decimalToken1: number;
  tokenSymbol1: string;
  token1InPool: number; // Total amount of token1 in the pool
  liquidity?: number; // liquidity in the pool
  tvl?: number; // TVL in the pool, in $
  // User tokens in the pool and breakdown by wrapper
  userTotalBalance0?: number;
  userTotalBalance1?: number;
  userTVL?: number; // user TVL in the pool, in $
  userBalances?: { balance0: number; balance1: number; tvl: number; origin: WrapperType<T> | -1 }[];
  meanAPR: number; // Average APR in the pool
  aprs: { [description: string]: number }; // APR description (will contain wrapper types)
  // Rewards earned by the user breakdown per token
  // token => {total unclaimed, total accumulated since inception, token symbol, breakdown per wrapper type}
  rewardsPerToken?: {
    [token: string]: {
      decimals: number; // Decimals of the reward token
      unclaimedUnformatted: string; // BigNumber.toString()
      unclaimed: number;
      accumulatedSinceInception: number;
      symbol: string;
      breakdown: { [origin in RewardOrigin<T>]?: number };
    };
  };
  // Detail of each distribution
  distributionData: DistributionDataType<T>[];
}>;

/**
 * Global data object returned by the api, that can be used to build front-ends
 */
export type MerklAPIData = {
  message: string;
  signed?: boolean;
  validRewardTokens?: { token: string; minimumAmountPerEpoch: number }[];
  feeRebate?: number;
  pools: {
    [K in keyof typeof AMMType]: { [address: string]: PoolDataType<typeof AMMType[K]> }; // Data per pool to build cards
  }[keyof typeof AMMType];
  transactionData?: {
    [token: string]: {
      // Data to build transaction
      claim: string;
      token: string;
      leaf: string;
      proof?: string[];
    };
  };
};

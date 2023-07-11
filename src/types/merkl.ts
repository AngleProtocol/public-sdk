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
  DefiEdge = 4,
  Ichi = 5,
  Steer = 6,
}
export enum SushiSwapV3Wrapper {
  Gamma = 2,
  DefiEdge = 4,
  Steer = 6,
}

type WrapperTypeMapping = {
  [AMMType.UniswapV3]: UniswapV3Wrapper;
  [AMMType.SushiSwapV3]: SushiSwapV3Wrapper;
  [AMMType.Retro]: null;
};

export const Wrapper = {
  [AMMType.UniswapV3]: UniswapV3Wrapper,
  [AMMType.SushiSwapV3]: SushiSwapV3Wrapper,
  [AMMType.Retro]: null,
};

export type WrapperType<T extends AMMType> = WrapperTypeMapping[T];

export enum BlacklistWrapper {
  Blacklist = 3,
}

/** Reward origin */

type RewardOriginMapping = {
  [AMMType.UniswapV3]: 'UniswapV3' | keyof typeof Wrapper[AMMType.UniswapV3];
  [AMMType.SushiSwapV3]: 'SushiSwap' | keyof typeof Wrapper[AMMType.SushiSwapV3];
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
  merklRoot: string;
};

// =============================== API DATA TYPE ===============================

export type DistributionDataType<T extends AMMType> = {
  id: string;
  amm: AMMType;
  amount: number; // Amount distributed
  end: number;
  isBoosted: boolean;
  isLive: boolean;
  isMock: boolean;
  isOutOfRangeIncentivized: boolean;
  propFees: number;
  propToken0: number;
  propToken1: number;
  start: number;
  token: string; // Token distributed
  tokenSymbol: string;
  wrappers: WrapperType<T>[]; // Supported wrapper types for this pool

  // User Related Data
  breakdown?: { [origin in RewardOrigin<T>]?: number }; // rewards earned breakdown
  unclaimed?: number; // Unclaimed reward amount by the user
};

export type PoolDataType<T extends AMMType> = Partial<{
  chainId: ChainId;
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
  liquidity: number; // liquidity in the pool
  distributionData: DistributionDataType<T>[];

  // Price Related Data
  tvl?: number; // TVL in the pool, in $
  meanAPR: number; // Average APR in the pool
  aprs: { [description: string]: number }; // APR description (will contain wrapper types)

  // User Related Data

  // User tokens in the pool and breakdown by ALM
  userTotalBalance0?: number;
  userTotalBalance1?: number;
  userTVL?: number; // user TVL in the pool, in $
  almDetails?: {
    balance0?: number;
    balance1?: number;
    tvl?: number;
    poolBalance0?: number;
    poolBalance1?: number;
    almLiquidity?: number;
    origin: WrapperType<T> | -1;
    label: string;
    address: string;
  }[];
  // Rewards earned by the user breakdown per token
  // token => {total unclaimed, total accumulated since inception, token symbol, breakdown per wrapper type}
  rewardsPerToken?: {
    [token: string]: {
      decimals: number; // Decimals of the reward token
      unclaimedUnformatted: string; // BigNumber.toString()
      unclaimed: number;
      accumulatedSinceInception: number;
      accumulatedSinceInceptionUnformatted: string;
      symbol: string;
      breakdown: { [origin in RewardOrigin<T>]?: number };
    };
  };
}>;

/**
 * Global data object returned by the api, that can be used to build front-ends
 */
export type MerklAPIData = {
  merkleRoot: string;
  message: string;
  validRewardTokens: { token: string; minimumAmountPerEpoch: number }[];
  pools: {
    [K in keyof typeof AMMType]: { [address: string]: PoolDataType<typeof AMMType[K]> }; // Data per pool to build cards
  }[keyof typeof AMMType];

  // User Related Data
  signed?: boolean;
  feeRebate?: number;
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

/** Merkl subgraphs */
export type NFTManagerPositionType = { id: string; startTimestamp: number; endTimestamp: number; pool: string };
export type DirectPositionType = {
  endTimestamp: number;
  owner: string;
  startTimestamp: number;
  tickLower: number;
  tickUpper: number;
  liquidity: string;
};

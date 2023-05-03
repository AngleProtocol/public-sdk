import { BigNumber, ethers } from 'ethers';

import { ChainId } from '.';

const MerklSupportedChainIds = <const>[ChainId.ARBITRUM, ChainId.MAINNET, ChainId.OPTIMISM, ChainId.POLYGON];
export type MerklSupportedChainIdsType = typeof MerklSupportedChainIds[number];
export const isMerklSupportedChainId = (chainId: any): chainId is MerklSupportedChainIdsType => {
  return MerklSupportedChainIds.includes(chainId);
};

export enum AMMType {
  'UniswapV3' = 0,
  'SushiSwap' = 1,
}
export const findMerklAMMType = (bytes: string): AMMType => {
  const utils = ethers.utils;
  if (!bytes || !utils.isBytesLike(bytes)) return AMMType.UniswapV3;
  const firstDecodedValue = (utils.defaultAbiCoder.decode(['uint256'], bytes)[0] as BigNumber)?.toNumber();
  if (!Object.values(AMMType).includes(firstDecodedValue)) return AMMType.UniswapV3;
  return firstDecodedValue;
};

export enum WrapperType {
  'Arrakis' = 0,
  'Gamma' = 2,
}
enum OtherDistributionWrapperType {
  'Blacklist' = 3,
}

export const DistributionWrapperType = {
  ...WrapperType,
  ...OtherDistributionWrapperType,
};

export type RewardOrigin = {
  [AMMType.UniswapV3]: 'UniswapV3' | 'Arrakis' | 'Gamma';
  [AMMType.SushiSwap]: 'SushiSwap';
};

// ============================= BACKEND DATA TYPE =============================
export type MerklRewardDistributionType = {
  [K in keyof typeof AMMType]: {
    amm: typeof AMMType[K];
    boostedAddress: string;
    boostedReward: number;
    holders: {
      [holder: string]: { amount: string; breakdown?: { [origin in RewardOrigin[typeof AMMType[K]]]?: string } };
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
// export type BreakdownType = {
//   [K in keyof typeof AMMType]: { [origin in RewardOrigin[typeof AMMType[K]]]?: number };
// }[keyof typeof AMMType];

export type DistributionDataType = {
  [K in keyof typeof AMMType]: {
    amm: typeof AMMType[K];
    token: string; // Token distributed
    tokenSymbol: string;
    amount: number; // Amount distributed
    propToken0: number;
    propToken1: number;
    propFees: number;
    unclaimed?: number; // Unclaimed reward amount by the user
    breakdown?: { [origin in RewardOrigin[typeof AMMType[K]]]?: number }; // rewards earned breakdown
    start: number;
    end: number;
    wrappers: WrapperType[]; // Supported wrapper types for this pool
  };
}[keyof typeof AMMType];

export type PoolDataType = Partial<
  {
    [K in keyof typeof AMMType]: {
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
      userBalances?: { balance0: number; balance1: number; tvl: number; origin: WrapperType | -1 }[];

      meanAPR: number; // Average APR in the pool
      aprs: { [description: string]: number }; // APR description (will contain wrapper types)

      // Rewards earned by the user breakdown per token
      // token => {total unclaimed, total accumulated since inception, token symbol, breakdown per wrapper type}
      rewardsPerToken?: {
        [token: string]: {
          unclaimed: number;
          accumulatedSinceInception: number;
          symbol: string;
          breakdown: { [origin in RewardOrigin[typeof AMMType[K]]]?: number };
        };
      };

      // Detail of each distribution
      distributionData: DistributionDataType[];
    };
  }[keyof typeof AMMType]
>;

/**
 * Global data object returned by the api, that can be used to build front-ends
 */
export type MerklAPIData = {
  message: string;
  signed?: boolean;
  validRewardTokens?: { token: string; minimumAmountPerEpoch: number }[];
  feeRebate?: number;
  pools: { [address: string]: PoolDataType }; // Data per pool to build cards
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

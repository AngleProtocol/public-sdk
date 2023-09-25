import { Interface } from 'ethers/lib/utils';
import {
  AlgebraV19NonFungibleManager__factory,
  AlgebraV19Pool__factory,
  BaseXNonFungiblePositionManager__factory,
  UniswapV3NFTManager__factory,
  UniswapV3Pool__factory,
} from 'src/constants';

import { ChainId } from '.';

const MerklSupportedChainIds = <const>[
  ChainId.ARBITRUM,
  ChainId.MAINNET,
  ChainId.OPTIMISM,
  ChainId.POLYGON,
  ChainId.POLYGONZKEVM,
  ChainId.BASE,
];
export type MerklSupportedChainIdsType = typeof MerklSupportedChainIds[number];
export const isMerklSupportedChainId = (chainId: any): chainId is MerklSupportedChainIdsType => {
  return MerklSupportedChainIds.includes(chainId);
};

export enum AMMType {
  UniswapV3 = 0,
  SushiSwapV3 = 1,
  Retro = 2,
  PancakeSwapV3 = 3,
  Camelot = 4,
  BaseSwap = 5,
}

export enum ALMType {
  Arrakis = 0,
  Gamma = 2,
  DefiEdge = 4,
  Ichi = 5,
  Steer = 6,
  Range = 7,
  ArrakisV2 = 8,
  Unipilot = 9,
}

export enum UniswapV3Wrapper {
  Arrakis = ALMType.Arrakis,
  ArrakisV2 = ALMType.ArrakisV2,
  Gamma = ALMType.Gamma,
  DefiEdge = ALMType.DefiEdge,
  Ichi = ALMType.Ichi,
  Steer = ALMType.Steer,
  Range = ALMType.Range,
  Unipilot = ALMType.Unipilot,
}
export enum SushiSwapV3Wrapper {
  Gamma = ALMType.Gamma,
  DefiEdge = ALMType.DefiEdge,
  Steer = ALMType.Steer,
}
export enum RetroWrapper {
  Gamma = ALMType.Gamma,
  Ichi = ALMType.Ichi,
  Steer = ALMType.Steer,
  Range = ALMType.Range,
  DefiEdge = ALMType.DefiEdge,
}
export enum PancakeSwapV3Wrapper {
  Range = ALMType.Range,
}

type WrapperTypeMapping = {
  [AMMType.UniswapV3]: UniswapV3Wrapper;
  [AMMType.SushiSwapV3]: SushiSwapV3Wrapper;
  [AMMType.Retro]: RetroWrapper;
  [AMMType.PancakeSwapV3]: PancakeSwapV3Wrapper;
  [AMMType.Camelot]: null;
  [AMMType.BaseSwap]: null;
};
export const Wrapper = {
  [AMMType.UniswapV3]: UniswapV3Wrapper,
  [AMMType.SushiSwapV3]: SushiSwapV3Wrapper,
  [AMMType.Retro]: RetroWrapper,
  [AMMType.PancakeSwapV3]: PancakeSwapV3Wrapper,
  [AMMType.Camelot]: null,
  [AMMType.BaseSwap]: null,
};
export type WrapperType<T extends AMMType> = WrapperTypeMapping[T];

export enum BlacklistWrapper {
  Blacklist = 3,
}

export enum AMMAlgorithmType {
  UniswapV3 = 0,
  AlgebraV1_9 = 1,
  BaseX = 2,
}
export const AMMAlgorithmMapping: { [amm in AMMType]: AMMAlgorithmType } = {
  [AMMType.UniswapV3]: AMMAlgorithmType.UniswapV3,
  [AMMType.SushiSwapV3]: AMMAlgorithmType.UniswapV3,
  [AMMType.Retro]: AMMAlgorithmType.UniswapV3,
  [AMMType.PancakeSwapV3]: AMMAlgorithmType.UniswapV3,
  [AMMType.Camelot]: AMMAlgorithmType.AlgebraV1_9,
  [AMMType.BaseSwap]: AMMAlgorithmType.BaseX,
};

/** Reward origin */
type RewardOriginMapping = {
  [AMMType.UniswapV3]: 'UniswapV3' | keyof typeof Wrapper[AMMType.UniswapV3];
  [AMMType.SushiSwapV3]: 'SushiSwap' | keyof typeof Wrapper[AMMType.SushiSwapV3];
  [AMMType.Retro]: 'Retro' | keyof typeof Wrapper[AMMType.Retro];
  [AMMType.PancakeSwapV3]: 'PancakeSwapV3' | keyof typeof Wrapper[AMMType.PancakeSwapV3];
  [AMMType.Camelot]: 'Camelot';
  [AMMType.BaseSwap]: 'BaseSwap';
};
export type RewardOrigin<T extends AMMType> = RewardOriginMapping[T];

// ============================= JSON DATA TYPE =============================

export type MerklRewardDistributionType = {
  [K in keyof typeof AMMType]: {
    amm: typeof AMMType[K];
    ammAlgo: keyof typeof AMMAlgorithmType;
    boostedAddress: string;
    boostedReward: number;
    holders: {
      [holder: string]: {
        amount: string;
        amountWithoutBoost?: string;
        averageBoost: number;
        breakdown?: { [origin in RewardOrigin<typeof AMMType[K]>]?: string };
      };
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
  amount: number; // Amount distributed
  blacklist: string[];
  end: number;
  id: string;
  isBoosted: boolean;
  isLive: boolean;
  isMock: boolean;
  isOutOfRangeIncentivized: boolean;
  meanAPR: number;
  propFees: number;
  propToken0: number;
  propToken1: number;
  start: number;
  token: string; // Token distributed
  tokenDecimals: number;
  tokenSymbol: string;
  wrappers: WrapperType<T>[]; // Supported wrapper types for this pool
  // User Related Data
  breakdown?: { [origin in RewardOrigin<T>]?: number }; // rewards earned breakdown
  lastBoostImpact?: number; // Boost impact during the last script run of the user
  unclaimed?: number; // Unclaimed reward amount by the user
};

export type PoolDataType<T extends AMMType> = Partial<{
  amm: AMMType;
  chainId: ChainId;
  endOfDisputePeriod: number;
  disputeLive: boolean;
  decimalToken0: number;
  decimalToken1: number;
  distributionData: DistributionDataType<T>[];
  liquidity: number; // liquidity in the pool
  pool: string; // AMM pool address
  poolAMMAlgo: keyof typeof AMMAlgorithmType;
  poolFee: number; // Fee of the AMM pool
  token0: string;
  token0InPool: number; // Total amount of token0 in the pool
  token1: string;
  token1InPool: number; // Total amount of token1 in the pool
  tokenSymbol0: string;
  tokenSymbol1: string;

  // Price Related Data
  tvl?: number; // TVL in the pool, in $
  meanAPR: number; // Average APR in the pool
  aprs: { [description: string]: number }; // APR description (will contain wrapper types)

  // User Related Data

  // User tokens in the pool and breakdown by ALM
  userTotalBalance0?: number;
  userTotalBalance1?: number;
  userTotalLiquidity?: number;
  userInRangeLiquidity?: number;
  userTVL?: number; // user TVL in the pool, in $
  almDetails?: {
    balance0?: number;
    balance1?: number;
    tvl?: number;
    poolBalance0?: number;
    poolBalance1?: number;
    almLiquidity?: number; // Total Liquidity
    almInRangeLiquidity?: number; // Total in range liquidity
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
  validRewardTokens: { token: string; minimumAmountPerEpoch: number; decimals: number; symbol: string }[];
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
export declare type NFTManagerPositionType = {
  endTimestamp: number;
  id: string;
  liquidity: string;
  maxLiquidity?: string;
  pool: string;
  tickLower: number;
  tickUpper: number;
  startTimestamp: number;
};
export declare type DirectPositionType = {
  endTimestamp: number;
  owner: string;
  startTimestamp: number;
  tickLower: number;
  tickUpper: number;
  liquidity: string;
  maxLiquidity?: string;
};

/**
 * NonFungiblePositionManager
 */
export const NonFungiblePositionManagerInterface = (ammType: AMMAlgorithmType): Interface => {
  if (ammType === AMMAlgorithmType.AlgebraV1_9) {
    return AlgebraV19NonFungibleManager__factory.createInterface();
  } else if (ammType === AMMAlgorithmType.UniswapV3) {
    return UniswapV3NFTManager__factory.createInterface();
  } else if (ammType === AMMAlgorithmType.BaseX) {
    return BaseXNonFungiblePositionManager__factory.createInterface();
  } else {
    throw new Error('Invalid AMM type');
  }
};

/**
 * Pools
 */
export const PoolInterface = (ammType: AMMAlgorithmType): Interface => {
  if (ammType === AMMAlgorithmType.AlgebraV1_9) {
    return AlgebraV19Pool__factory.createInterface();
  } else if (ammType === AMMAlgorithmType.UniswapV3 || ammType === AMMAlgorithmType.BaseX) {
    return UniswapV3Pool__factory.createInterface();
  } else {
    throw new Error('Invalid AMM type');
  }
};

export const SwapPriceField = {
  [AMMAlgorithmType.AlgebraV1_9]: 'price',
  [AMMAlgorithmType.UniswapV3]: 'sqrtPriceX96',
  [AMMAlgorithmType.BaseX]: 'sqrtPriceX96',
};
export const PoolStateName = {
  [AMMAlgorithmType.AlgebraV1_9]: 'globalState',
  [AMMAlgorithmType.UniswapV3]: 'slot0',
  [AMMAlgorithmType.BaseX]: 'slot0',
};

import { ChainId } from '../types';
import ARBITRUM_ADDRESSES from './contracts_addresses/arbitrum';
import AURORA_ADDRESSES from './contracts_addresses/aurora';
import AVALANCHE_ADDRESSES from './contracts_addresses/avalanche';
import BSC_ADDRESSES from './contracts_addresses/bsc';
import CELO_ADDRESSES from './contracts_addresses/celo';
import FANTOM_ADDRESSES from './contracts_addresses/fantom';
import LOCAL_ADDRESSES from './contracts_addresses/local';
import MAINNET_CONTRACTS from './contracts_addresses/mainnet';
import OPTIMISM_ADDRESSES from './contracts_addresses/optimism';
import POLYGON_ADDRESSES from './contracts_addresses/polygon';

export enum AMO {
  'agEURvEUROC' = 'agEURvEUROC',
}

type AMOType = Readonly<{
  AMO: string;
  KeeperJob: string;
}>;

export enum BorrowCollateral {
  'LUSD' = 'LUSD',
  'WBTC' = 'WBTC',
  'WETH' = 'WETH',
  'WSTETH' = 'WSTETH',
  'MAI' = 'MAI',
  'USDC' = 'USDC',
  'WMATIC' = 'WMATIC',
  'OP' = 'OP',
  'am3CRV' = 'am3CRV',
  'WAVAX' = 'WAVAX',
  'cvx-crvFRAXUSDC' = 'cvx-crvFRAXUSDC',
  'sd-crvFRAXUSDC' = 'sd-crvFRAXUSDC',
}

type BorrowCollateralType = {
  Oracle: string;
  VaultManager: string;
  additionalProperties?: {
    LPToken: string;
    Rewards: string[];
    Staker: string;
    Swapper: string;
  };
};

export enum LenderStrategy {
  'GenericOptimisedLender' = 'GenericOptimisedLender',
  'AaveFlashloan' = 'AaveFlashloan',
}

type LenderStrategyType = {
  AaveConvexStaker?: string;
  Contract: string;
  GenericAave?: string;
  GenericCompound?: string;
};

export enum SimpleStrategy {
  'StETH' = 'StETH',
}

export enum Collateral {
  'DAI' = 'DAI',
  'FEI' = 'FEI',
  'FRAX' = 'FRAX',
  'USDC' = 'USDC',
  'WETH' = 'WETH',
}

type CollateralType = Readonly<
  Partial<{
    FeeManager: string;
    GenericLender?: string;
    LiquidityGauge?: string;
    Oracle: string;
    PerpetualManager: string;
    PoolManager: string;
    SanToken: string;
    Staking?: string;
    Strategies?: {
      [strategy in SimpleStrategy]?: string;
    } &
      {
        [strategy in LenderStrategy]?: LenderStrategyType;
      };
  }>
>;

export enum Stablecoin {
  'agEUR' = 'agEUR',
}

type StablecoinType = Readonly<
  Partial<{
    AgToken: string;
    StableMaster?: string;
    Staking?: string;
    Swapper?: string;
    SwapperV2?: string;
    Treasury: string;
    collaterals?: {
      [collateral in Collateral]?: CollateralType;
    };
    borrowCollaterals?: {
      [collateral in BorrowCollateral]?: BorrowCollateralType;
    };
    bridges?: {
      Anyswap?: string;
      LayerZero?: string;
      RainbowBridge?: string;
      Synapse?: string;
    };
  }>
>;

export type ContractsRegistryType = Readonly<
  {
    [chainId in ChainId]: Partial<
      {
        ANGLE: string;
        AngleDistributor: string;
        AngleHelpers: string;
        AngleRouter: string;
        AngleRouterV2: string;
        Core: string;
        CoreBorrow: string;
        FlashAngle: string;
        FeeDistributor_sanUSDC_EUR: string;
        GaugeController: string;
        Governor: string;
        Guardian: string;
        KeeperMulticall: string;
        KeeperRegistry: string;
        MerkleRootDistributor: string;
        Middleman: string;
        MulticallWithFailure: string;
        ProxyAdmin: string;
        ProxyAdminGuardian: string;
        RewardsDistributor: string;
        SmartWalletWhitelist: string;
        SurplusConverterSanTokens_EUR_USDC: string;
        SurplusConverterUniV3_IntraCollaterals: string;
        Timelock: string;
        veANGLE: string;
        veBoostProxy: string;
        ExternalStakings: {
          tokenName: string;
          stakingContractAddress: string;
          poolContractAddress: string;
          liquidityGaugeAddress?: string;
        }[];
        Gauges: { gaugeName: string; gaugeAddress: string; type: number }[];
        AMO: {
          AMOMinter: string;
          BPAMOs?: {
            [key in AMO]?: AMOType;
          };
        };
        bridges?: {
          Anyswap?: string;
          LayerZero?: string;
          RainbowBridge?: string;
          Synapse?: string;
        };
      } & {
        [key in Stablecoin]?: StablecoinType;
      }
    >;
  }
>;

export const CONTRACTS_ADDRESSES: ContractsRegistryType = {
  [ChainId.MAINNET]: MAINNET_CONTRACTS,
  [ChainId.POLYGON]: POLYGON_ADDRESSES,
  [ChainId.OPTIMISM]: OPTIMISM_ADDRESSES,
  [ChainId.ARBITRUM]: ARBITRUM_ADDRESSES,
  [ChainId.AVALANCHE]: AVALANCHE_ADDRESSES,
  [ChainId.FANTOM]: FANTOM_ADDRESSES,
  [ChainId.BSC]: BSC_ADDRESSES,
  [ChainId.AURORA]: AURORA_ADDRESSES,
  [ChainId.CELO]: CELO_ADDRESSES,
  [ChainId.LOCAL]: LOCAL_ADDRESSES,
};

type RegistryArgs =
  | null
  | string
  | {
      stablecoin: Stablecoin | string;
    }
  | {
      amo: AMO | string;
    }
  | {
      stablecoin: Stablecoin | string;
      collateral: Collateral | string;
    }
  | {
      stablecoin: Stablecoin | string;
      borrowCollateral: BorrowCollateral | string;
    }
  | {
      stablecoin: Stablecoin | string;
      collateral: Collateral | string;
      strategy: SimpleStrategy | string;
    }
  | {
      stablecoin: Stablecoin | string;
      collateral: Collateral | string;
      lenderStrategy: LenderStrategy | string;
    };

export function registry(chainId: number | ChainId): ContractsRegistryType['1'] | undefined;
export function registry(
  chainId: number | ChainId,
  args: {
    amo: AMO | string;
  }
): AMOType | undefined;
export function registry(chainId: number | ChainId, stablecoin: Stablecoin | string): StablecoinType | undefined;
export function registry(
  chainId: number | ChainId,
  args: {
    stablecoin: Stablecoin | string;
  }
): StablecoinType | undefined;
export function registry(
  chainId: number | ChainId,
  stablecoin: Stablecoin | string,
  collateral: Collateral | string
): CollateralType | undefined;
export function registry(
  chainId: number | ChainId,
  args: {
    stablecoin: Stablecoin | string;
    collateral: Collateral | string;
  }
): CollateralType | undefined;
export function registry(
  chainId: number | ChainId,
  args: {
    stablecoin: Stablecoin | string;
    borrowCollateral: BorrowCollateral | string;
  }
): BorrowCollateralType | undefined;
export function registry(
  chainId: number | ChainId,
  args: {
    stablecoin: Stablecoin | string;
    collateral: Collateral | string;
    strategy: SimpleStrategy | string;
  }
): string | undefined;
export function registry(
  chainId: number | ChainId,
  args: {
    stablecoin: Stablecoin | string;
    collateral: Collateral | string;
    lenderStrategy: LenderStrategy | string;
  }
): LenderStrategyType | undefined;
export function registry(chainId: number | ChainId, args: RegistryArgs = null, collateral: Collateral | string | null = null): any {
  if (!!args && typeof args === 'string' && !!collateral) {
    return registry(chainId, { stablecoin: args, collateral: collateral });
  }
  if (!!args && typeof args === 'string') {
    return registry(chainId, { stablecoin: args });
  }
  if (!!args && typeof args !== 'string' && 'strategy' in args) {
    return CONTRACTS_ADDRESSES[chainId as ChainId]?.[args.stablecoin as Stablecoin]?.collaterals?.[args.collateral as Collateral]
      ?.Strategies?.[args.strategy as SimpleStrategy];
  } else if (!!args && typeof args !== 'string' && 'lenderStrategy' in args) {
    return CONTRACTS_ADDRESSES[chainId as ChainId]?.[args.stablecoin as Stablecoin]?.collaterals?.[args.collateral as Collateral]
      ?.Strategies?.[args.lenderStrategy as LenderStrategy];
  } else if (!!args && typeof args !== 'string' && 'borrowCollateral' in args) {
    return CONTRACTS_ADDRESSES[chainId as ChainId]?.[args.stablecoin as Stablecoin]?.borrowCollaterals?.[
      args.borrowCollateral as BorrowCollateral
    ];
  } else if (!!args && typeof args !== 'string' && 'collateral' in args) {
    return CONTRACTS_ADDRESSES[chainId as ChainId]?.[args.stablecoin as Stablecoin]?.collaterals?.[args.collateral as Collateral];
  } else if (!!args && typeof args !== 'string' && 'stablecoin' in args) {
    return CONTRACTS_ADDRESSES[chainId as ChainId]?.[args.stablecoin as Stablecoin];
  } else if (!!args && typeof args !== 'string' && 'amo' in args) {
    return CONTRACTS_ADDRESSES[chainId as ChainId]?.AMO?.BPAMOs?.[args.amo as AMO];
  } else {
    return CONTRACTS_ADDRESSES[chainId as ChainId];
  }
}

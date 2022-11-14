import { ChainId } from '../types';
import ARBITRUM_ADDRESSES from './contracts_addresses/arbitrum.json';
import AURORA_ADDRESSES from './contracts_addresses/aurora.json';
import AVALANCHE_ADDRESSES from './contracts_addresses/avalanche.json';
import BSC_ADDRESSES from './contracts_addresses/bsc.json';
import FANTOM_ADDRESSES from './contracts_addresses/fantom.json';
import LOCAL_ADDRESSES from './contracts_addresses/local.json';
import MAINNET_CONTRACTS from './contracts_addresses/mainnet.json';
import OPTIMISM_ADDRESSES from './contracts_addresses/optimism.json';
import POLYGON_ADDRESSES from './contracts_addresses/polygon.json';

const ContractsNames = [
  'FeeManager',
  'GenericLender',
  'Oracle',
  'PerpetualManager',
  'PoolManager',
  'SanToken',
  'Staking',
  'LiquidityGauge',
] as const;

const ContractsBorrowNames = ['VaultManager', 'Oracle'];

export const StrategiesNames = ['Contract', 'GenericCompound', 'GenericAave', 'AaveConvexStaker'] as const;

export const BridgeNames = ['Anyswap', 'RainbowBridge', 'LayerZero', 'Synapse'] as const;

export const StableTokens = ['agCHF', 'agEUR', 'agGBP', 'agJPY', 'agUSD'] as const;

const GlobalContracts = [
  'ANGLE',
  'AngleRouter',
  'BondingCurve',
  'Core',
  'CoreBorrow',
  'FlashAngle',
  'GaugeController',
  'Guardian',
  'Governor',
  'KeeperRegistry',
  'RewardsDistributor',
  'AngleDistributor',
  'Timelock',
  'ProxyAdmin',
  'MultiSig',
  'Deployer',
  'veAngle',
  'GaugeController',
  'SmartWalletWhitelist',
  'SurplusConverterSanTokens_sanUSDC_EUR',
  'SurplusConverterUniV3_IntraCollaterals',
  'veANGLE',
  'veBoostProxy',
  'MerkleRootDistributor',
  'Middleman',
  'MulticallWithFailure',
  'KeeperMulticall',
] as const;

export type AngleContractsStableType = {
  AgToken: string;
  StableMaster: string;
  Staking: string;
  Swapper: string;
  Treasury: string;
  collaterals: {
    [collateralName: string]: {
      [contractName in typeof ContractsNames[number]]?: string;
    } & {
      Strategies?: {
        [strategyName: string]: {
          [contractName in typeof StrategiesNames[number]]?: string;
        };
      };
    };
  };
  borrowCollaterals: {
    [collateralBorrowName: string]: {
      [contractName in typeof ContractsBorrowNames[number]]?: string;
    };
  };
  bridges: {
    [key in typeof BridgeNames[number]]?: string;
  };
};

export type AngleTokenBridgeContractsType = {
  angleBridges: { [key in typeof BridgeNames[number]]?: string };
};

export type AngleContractsType = {
  [key: string]: Partial<AngleContractsStableType>;
} & {
  [key in typeof GlobalContracts[number]]?: string;
} & {
    ExternalStakings?: { tokenName: string; stakingContractAddress: string; poolContractAddress: string; liquidityGaugeAddress?: string }[];
  } & {
    Gauges?: { gaugeName: string; gaugeAddress: string; type: number }[];
  } & {
    ANGLEBridges?: { [key in typeof BridgeNames[number]]?: string };
  } & {
    AMO?: {
      AMOMinter: string;
      BPAMOs: {
        [AMOName: string]: {
          AMO: string;
          KeeperJob: string;
        };
      };
    };
  };

type TCONTRACTS_ADDRESSES = Readonly<{ [chainId in ChainId]: Readonly<AngleContractsType> }>;
export const CONTRACTS_ADDRESSES: TCONTRACTS_ADDRESSES = {
  [ChainId.MAINNET]: MAINNET_CONTRACTS as AngleContractsType,
  [ChainId.POLYGON]: POLYGON_ADDRESSES as AngleContractsType,
  [ChainId.OPTIMISM]: OPTIMISM_ADDRESSES as AngleContractsType,
  [ChainId.ARBITRUM]: ARBITRUM_ADDRESSES as AngleContractsType,
  [ChainId.AVALANCHE]: AVALANCHE_ADDRESSES as AngleContractsType,
  [ChainId.FANTOM]: FANTOM_ADDRESSES as AngleContractsType,
  [ChainId.BSC]: BSC_ADDRESSES as AngleContractsType,
  [ChainId.AURORA]: AURORA_ADDRESSES as AngleContractsType,
  [ChainId.LOCAL]: LOCAL_ADDRESSES as AngleContractsType,
};

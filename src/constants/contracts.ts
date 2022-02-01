import { ChainId } from '../types';
import AVALANCHE_ADDRESSES from './contracts_addresses/avalanche.json';
import BSC_ADDRESSES from './contracts_addresses/bsc.json';
import FANTOM_ADDRESSES from './contracts_addresses/fantom.json';
import LOCAL_ADDRESSES from './contracts_addresses/local.json';
import MAINNET_CONTRACTS from './contracts_addresses/mainnet.json';
import POLYGON_ADDRESSES from './contracts_addresses/polygon.json';
import RINKEBY_TMP_ADDRESSES from './contracts_addresses/rinkebyTemporary.json';

const ContractsNames = [
  'FeeManager',
  'GenericLender',
  'Oracle',
  'PerpetualManager',
  'PoolManager',
  'SanToken',
  'Strategy',
  'Staking',
  'GenericCompound',
  'GenericAave',
  'LiquidityGauge',
] as const;

export const StableTokens = ['agCHF', 'agEUR', 'agGBP', 'agJPY', 'agUSD'] as const;

const GlobalContracts = [
  'ANGLE',
  'BondingCurve',
  'Core',
  'GaugeController',
  'Governor',
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
  'Middleman',
] as const;

export type AngleContractsStableType = {
  AgToken: string;
  StableMaster: string;
  Staking: string;
  collaterals: {
    [collateralName: string]: {
      [contractName in typeof ContractsNames[number]]?: string;
    };
  };
};

export type AngleContractsType = {
  [key: string]: Partial<AngleContractsStableType>;
} & {
  [key in typeof GlobalContracts[number]]?: string;
} & {
  ExternalStakings?: { tokenName: string; stakingContractAddress: string; poolContractAddress: string; liquidityGaugeAddress?: string }[];
} & {
  Gauges?: { gaugeName: string; gaugeAddress: string; type: number }[];
};

type TCONTRACTS_ADDRESSES = Readonly<{ [chainId in ChainId]: Readonly<AngleContractsType> }>;
export const CONTRACTS_ADDRESSES: TCONTRACTS_ADDRESSES = {
  [ChainId.MAINNET]: MAINNET_CONTRACTS as AngleContractsType,
  [ChainId.POLYGON]: POLYGON_ADDRESSES as AngleContractsType,
  [ChainId.AVALANCHE]: AVALANCHE_ADDRESSES as AngleContractsType,
  [ChainId.FANTOM]: FANTOM_ADDRESSES as AngleContractsType,
  [ChainId.BSC]: BSC_ADDRESSES as AngleContractsType,
  [ChainId.RINKEBY]: RINKEBY_TMP_ADDRESSES as AngleContractsType,
  [ChainId.LOCAL]: LOCAL_ADDRESSES as AngleContractsType,
};

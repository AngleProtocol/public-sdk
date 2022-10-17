import { BigNumber } from 'ethers';

export enum ChainId {
  MAINNET = 1,
  POLYGON = 137,
  AVALANCHE = 43114,
  FANTOM = 250,
  BSC = 56,
  AURORA = 1313161554,
  LOCAL = 1337,
  OPTIMISM = 10,
  ARBITRUM = 42161,
}

export const NETWORK_LABELS: { [key in ChainId]?: string } = {
  [ChainId.ARBITRUM]: 'Arbitrum',
  [ChainId.MAINNET]: 'Ethereum',
  [ChainId.FANTOM]: 'Fantom',
  [ChainId.POLYGON]: 'Polygon',
  [ChainId.AURORA]: 'Aurora',
  [ChainId.AVALANCHE]: 'Avalanche',
  [ChainId.BSC]: 'BNB Smart Chain',
  [ChainId.OPTIMISM]: 'Optimism',
};

export enum AssetType {
  STABLE,
  COLLATERAL,
  ANGLE,
  EXTERNAL_STAKING,
}

export enum ActionType {
  MINT,
  BURN,
  POOL_DEPOSIT,
  POOL_WITHDRAW,
  PERPETUAL_CREATE,
  PERPETUAL_LIQUIDATE,
  ROUTER_TX,
  STAKE_SANTOKEN,
  STAKE_AGTOKEN,
  STAKE_EXTERNAL,
}

export const BigNumber_BASE = (decimals: number): BigNumber => BigNumber.from(10).pow(decimals);
export const BASE_18 = BigNumber_BASE(18);

// exports for internal use
export enum SolidityType {
  uint8 = 'uint8',
  uint256 = 'uint256',
}

export const SOLIDITY_TYPE_MAXIMA = {
  [SolidityType.uint8]: BigNumber.from('0xff'),
  [SolidityType.uint256]: BigNumber.from('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'),
};

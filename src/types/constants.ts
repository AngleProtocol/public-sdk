import { BigNumber } from 'ethers';

export enum ChainId {
  ARBITRUM = 42161,
  AURORA = 1313161554,
  AVALANCHE = 43114,
  BSC = 56,
  CELO = 42220,
  FANTOM = 250,
  LOCAL = 1337,
  MAINNET = 1,
  OPTIMISM = 10,
  POLYGON = 137,
  GNOSIS = 100,
  POLYGONZKEVM = 1101,
}

export const NETWORK_LABELS: { [key in ChainId]: string } = {
  [ChainId.ARBITRUM]: 'Arbitrum',
  [ChainId.CELO]: 'Celo Mainnet',
  [ChainId.LOCAL]: 'Local Chain',
  [ChainId.MAINNET]: 'Ethereum',
  [ChainId.FANTOM]: 'Fantom',
  [ChainId.POLYGON]: 'Polygon',
  [ChainId.AURORA]: 'Aurora',
  [ChainId.AVALANCHE]: 'Avalanche',
  [ChainId.BSC]: 'BNB Smart Chain',
  [ChainId.OPTIMISM]: 'Optimism',
  [ChainId.GNOSIS]: 'Gnosis Chain',
  [ChainId.POLYGONZKEVM]: 'Polygon zkEVM',
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

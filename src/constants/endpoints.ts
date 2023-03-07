import { ChainId } from '../types/constants';
import { SupportedChainsType } from '../types/merkl';

const theGraphPrefix = 'https://api.thegraph.com/subgraphs/name/guillaumenervoxs/angle-merkl-reward';

export const tgEndpoints: { [chainId in SupportedChainsType]: string } = {
  [ChainId.MAINNET]: theGraphPrefix,
  [ChainId.POLYGON]: theGraphPrefix + '-polygon',
  [ChainId.OPTIMISM]: theGraphPrefix + '-optimism',
};

export const uniswapV3TheGraphEndpoints: { [chainId in SupportedChainsType]: string } = {
  [ChainId.MAINNET]: 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3',
  [ChainId.POLYGON]: 'https://api.thegraph.com/subgraphs/name/ianlapham/uniswap-v3-polygon',
  [ChainId.OPTIMISM]: 'https://api.thegraph.com/subgraphs/name/ianlapham/optimism-post-regenesis',
};

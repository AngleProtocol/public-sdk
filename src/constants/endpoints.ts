import { ChainId } from '../types/constants';
import { MerklSupportedChainIdsType } from '../types/merkl';

const merklSubgraphPrefix = 'https://api.thegraph.com/subgraphs/name/guillaumenervoxs/uniswap-global-';
export const merklSubgraphEndpoints: { [chainId in MerklSupportedChainIdsType]: string } = {
  [ChainId.ARBITRUM]: merklSubgraphPrefix + 'arbitrum',
  [ChainId.MAINNET]: merklSubgraphPrefix + 'ethereum',
  [ChainId.OPTIMISM]: merklSubgraphPrefix + 'optimism',
  [ChainId.POLYGON]: merklSubgraphPrefix + 'polygon',
};

export const uniswapV3TheGraphEndpoints: { [chainId in MerklSupportedChainIdsType]: string } = {
  [ChainId.ARBITRUM]: 'https://api.thegraph.com/subgraphs/name/ianlapham/arbitrum-minimal',
  [ChainId.MAINNET]: 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3',
  [ChainId.OPTIMISM]: 'https://api.thegraph.com/subgraphs/name/ianlapham/optimism-post-regenesis',
  [ChainId.POLYGON]: 'https://api.thegraph.com/subgraphs/name/ianlapham/uniswap-v3-polygon',
};

/** Fallback enddpoints
 * @dev it is not used at the moment
 */
const merklFallbackSubgraphPrefix = 'https://api.thegraph.com/subgraphs/name/guillaumenervoxs/angle-merkl-reward';
export const merklFallbackTGEndpoints: { [chainId in MerklSupportedChainIdsType]: string } = {
  [ChainId.ARBITRUM]: merklFallbackSubgraphPrefix + '-arbitrum',
  [ChainId.MAINNET]: merklFallbackSubgraphPrefix,
  [ChainId.OPTIMISM]: merklFallbackSubgraphPrefix + '-optimism',
  [ChainId.POLYGON]: merklFallbackSubgraphPrefix + '-polygon',
};

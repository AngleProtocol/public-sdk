import { ChainId } from '../types/constants';
import { MerklSupportedChainIdsType } from '../types/merkl';

const merklSubgraphPrefix = 'https://api.thegraph.com/subgraphs/name/guillaumenervoxs/uniswap-global-';
export const merklSubgraphEndpoints: { [chainId in MerklSupportedChainIdsType]: string } = {
  [ChainId.POLYGON]: merklSubgraphPrefix + '-polygon',
  [ChainId.OPTIMISM]: merklSubgraphPrefix + '-optimism',
};

export const uniswapV3TheGraphEndpoints: { [chainId in MerklSupportedChainIdsType]: string } = {
  [ChainId.POLYGON]: 'https://api.thegraph.com/subgraphs/name/ianlapham/uniswap-v3-polygon',
  [ChainId.OPTIMISM]: 'https://api.thegraph.com/subgraphs/name/ianlapham/optimism-post-regenesis',
};

/** Fallback enddpoints
 * @dev cannot be used at the moment
 */
const merklFallbackSubgraphPrefix = 'https://api.thegraph.com/subgraphs/name/guillaumenervoxs/angle-merkl-reward';
export const merklFallbackTGEndpoints: { [chainId in MerklSupportedChainIdsType]: string } = {
  [ChainId.POLYGON]: merklFallbackSubgraphPrefix + '-polygon',
  [ChainId.OPTIMISM]: merklFallbackSubgraphPrefix + '-optimism',
};

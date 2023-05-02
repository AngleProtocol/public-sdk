import { ChainId } from '../types/constants';
import { AMMType, MerklSupportedChainIdsType } from '../types/merkl';

const merklSubgraphPrefix = 'https://api.thegraph.com/subgraphs/name/guillaumenervoxs/uniswap-global-';

export const merklSubgraphEndpoints: { [chainId in MerklSupportedChainIdsType]: { [AMM in AMMType]: string } } = {
  [ChainId.ARBITRUM]: { [AMMType.UniswapV3]: merklSubgraphPrefix + 'arbitrum', [AMMType.SushiSwap]: '' },
  [ChainId.MAINNET]: { [AMMType.UniswapV3]: merklSubgraphPrefix + 'ethereum', [AMMType.SushiSwap]: '' },
  [ChainId.OPTIMISM]: { [AMMType.UniswapV3]: merklSubgraphPrefix + 'optimism', [AMMType.SushiSwap]: '' },
  [ChainId.POLYGON]: { [AMMType.UniswapV3]: merklSubgraphPrefix + 'polygon', [AMMType.SushiSwap]: '' },
};

export const swapsSubgraphsEndpoints: { [chainId in MerklSupportedChainIdsType]: { [AMM in AMMType]: string } } = {
  [ChainId.ARBITRUM]: {
    [AMMType.UniswapV3]: 'https://api.thegraph.com/subgraphs/name/ianlapham/arbitrum-minimal',
    [AMMType.SushiSwap]: '',
  },
  [ChainId.MAINNET]: {
    [AMMType.UniswapV3]: 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3',
    [AMMType.SushiSwap]: '',
  },
  [ChainId.OPTIMISM]: {
    [AMMType.UniswapV3]: 'https://api.thegraph.com/subgraphs/name/ianlapham/optimism-post-regenesis',
    [AMMType.SushiSwap]: '',
  },
  [ChainId.POLYGON]: {
    [AMMType.UniswapV3]: 'https://api.thegraph.com/subgraphs/name/ianlapham/uniswap-v3-polygon',
    [AMMType.SushiSwap]: '',
  },
};

/** Fallback enddpoints
 * @dev it is not used at the moment
 * @dev TODO: switch to the new system
 */
const merklFallbackSubgraphPrefix = 'https://api.thegraph.com/subgraphs/name/guillaumenervoxs/angle-merkl-reward';
export const merklFallbackTGEndpoints: { [chainId in MerklSupportedChainIdsType]: string } = {
  [ChainId.ARBITRUM]: merklFallbackSubgraphPrefix + '-arbitrum',
  [ChainId.MAINNET]: merklFallbackSubgraphPrefix,
  [ChainId.OPTIMISM]: merklFallbackSubgraphPrefix + '-optimism',
  [ChainId.POLYGON]: merklFallbackSubgraphPrefix + '-polygon',
};

import { ChainId } from '../../types/constants';
import { AMMType, MerklSupportedChainIdsType } from '../../types/merkl';

const merklSubgraphPrefix = 'https://api.thegraph.com/subgraphs/name/anglekeeper/merkl-';
const merklSubgraphPrefixUniswapV3 = `${merklSubgraphPrefix}uniswapv3-`;
const merklSubgraphPrefixSushiswapV3 = `${merklSubgraphPrefix}sushiswapv3-`;
const merklSubgraphPrefixRetro = `${merklSubgraphPrefix}retro-`;

export const merklSubgraphEndpoint: { [chainId in MerklSupportedChainIdsType]: { [AMM in AMMType]: string } } = {
  [ChainId.ARBITRUM]: {
    [AMMType.Retro]: merklSubgraphPrefixRetro + 'arbitrum',
    [AMMType.SushiSwapV3]: merklSubgraphPrefixSushiswapV3 + 'arbitrum',
    [AMMType.UniswapV3]: merklSubgraphPrefixUniswapV3 + 'arbitrum',
  },
  [ChainId.MAINNET]: {
    [AMMType.Retro]: merklSubgraphPrefixRetro + 'ethereum',
    [AMMType.SushiSwapV3]: merklSubgraphPrefixSushiswapV3 + 'ethereum',
    [AMMType.UniswapV3]: merklSubgraphPrefixUniswapV3 + 'ethereum',
  },
  [ChainId.OPTIMISM]: {
    [AMMType.Retro]: merklSubgraphPrefixRetro + 'optimism',
    [AMMType.SushiSwapV3]: merklSubgraphPrefixSushiswapV3 + 'optimism',
    [AMMType.UniswapV3]: merklSubgraphPrefixUniswapV3 + 'optimism',
  },
  [ChainId.POLYGON]: {
    [AMMType.Retro]: merklSubgraphPrefixRetro + 'polygon',
    [AMMType.SushiSwapV3]: merklSubgraphPrefixSushiswapV3 + 'polygon',
    [AMMType.UniswapV3]: merklSubgraphPrefixUniswapV3 + 'polygon',
  },
};

const sushiswapV3SubgraphPrefix = 'https://api.thegraph.com/subgraphs/name/sushi-v3/v3-';
export const swapsSubgraphsEndpoint: { [chainId in MerklSupportedChainIdsType]: { [AMM in AMMType]: string } } = {
  [ChainId.ARBITRUM]: {
    [AMMType.Retro]: '',
    [AMMType.SushiSwapV3]: sushiswapV3SubgraphPrefix + 'arbitrum',
    [AMMType.UniswapV3]: 'https://api.thegraph.com/subgraphs/name/ianlapham/arbitrum-minimal',
  },
  [ChainId.MAINNET]: {
    [AMMType.Retro]: '',
    [AMMType.SushiSwapV3]: sushiswapV3SubgraphPrefix + 'ethereum',
    [AMMType.UniswapV3]: 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3',
  },
  [ChainId.OPTIMISM]: {
    [AMMType.Retro]: '',
    [AMMType.SushiSwapV3]: sushiswapV3SubgraphPrefix + 'optimism',
    [AMMType.UniswapV3]: 'https://api.thegraph.com/subgraphs/name/ianlapham/optimism-post-regenesis',
  },
  [ChainId.POLYGON]: {
    [AMMType.Retro]: '',
    [AMMType.SushiSwapV3]: sushiswapV3SubgraphPrefix + 'polygon',
    [AMMType.UniswapV3]: 'https://api.thegraph.com/subgraphs/name/ianlapham/uniswap-v3-polygon',
  },
};

/** Fallback enddpoints
 * @dev it is not used at the moment
 */
const merklFallbackSubgraphPrefix = 'https://api.thegraph.com/subgraphs/name/anglekeeper/backup-';
const merklFallbackSubgraphPrefixUniswapV3 = `${merklFallbackSubgraphPrefix}uniswapv3-`;
const merklFallbackSubgraphPrefixSushiswapV3 = `${merklFallbackSubgraphPrefix}sushiswapv3-`;
const merklFallbackSubgraphPrefixRetro = `${merklSubgraphPrefix}retro-`;
export const merklFallbackTGEndpoint: { [chainId in MerklSupportedChainIdsType]: { [AMM in AMMType]: string } } = {
  [ChainId.ARBITRUM]: {
    [AMMType.Retro]: merklFallbackSubgraphPrefixRetro + 'arbitrum',
    [AMMType.SushiSwapV3]: merklFallbackSubgraphPrefixSushiswapV3 + 'arbitrum',
    [AMMType.UniswapV3]: merklFallbackSubgraphPrefixUniswapV3 + 'arbitrum',
  },
  [ChainId.MAINNET]: {
    [AMMType.Retro]: merklFallbackSubgraphPrefixRetro + 'ethereum',
    [AMMType.SushiSwapV3]: merklFallbackSubgraphPrefixSushiswapV3 + 'ethereum',
    [AMMType.UniswapV3]: merklFallbackSubgraphPrefixUniswapV3 + 'ethereum',
  },
  [ChainId.OPTIMISM]: {
    [AMMType.Retro]: merklFallbackSubgraphPrefixRetro + 'optimism',
    [AMMType.SushiSwapV3]: merklFallbackSubgraphPrefixSushiswapV3 + 'optimism',
    [AMMType.UniswapV3]: merklFallbackSubgraphPrefixUniswapV3 + 'optimism',
  },
  [ChainId.POLYGON]: {
    [AMMType.Retro]: merklFallbackSubgraphPrefixRetro + 'polygon',
    [AMMType.SushiSwapV3]: merklFallbackSubgraphPrefixSushiswapV3 + 'polygon',
    [AMMType.UniswapV3]: merklFallbackSubgraphPrefixUniswapV3 + 'polygon',
  },
};

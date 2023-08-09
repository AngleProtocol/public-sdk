import { ChainId } from '../../types/constants';
import { AMMType, MerklSupportedChainIdsType, Wrapper, WrapperType } from '../../types/merkl';

const sushiswapV3SubgraphPrefix = 'https://api.thegraph.com/subgraphs/name/sushi-v3/v3-';
export const swapsSubgraphsEndpoint: { [chainId in MerklSupportedChainIdsType]: { [AMM in AMMType]?: string } } = {
  [ChainId.ARBITRUM]: {
    [AMMType.SushiSwapV3]: sushiswapV3SubgraphPrefix + 'arbitrum',
    [AMMType.UniswapV3]: 'https://api.thegraph.com/subgraphs/name/ianlapham/arbitrum-minimal',
  },
  [ChainId.MAINNET]: {
    [AMMType.SushiSwapV3]: sushiswapV3SubgraphPrefix + 'ethereum',
    [AMMType.UniswapV3]: 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3',
    [AMMType.PancakeSwap]: 'https://api.thegraph.com/subgraphs/name/pancakeswap/exchange-v3-eth',
  },
  [ChainId.OPTIMISM]: {
    [AMMType.SushiSwapV3]: sushiswapV3SubgraphPrefix + 'optimism',
    [AMMType.UniswapV3]: 'https://api.thegraph.com/subgraphs/name/ianlapham/optimism-post-regenesis',
  },
  [ChainId.POLYGON]: {
    [AMMType.SushiSwapV3]: sushiswapV3SubgraphPrefix + 'polygon',
    [AMMType.UniswapV3]: 'https://api.thegraph.com/subgraphs/name/ianlapham/uniswap-v3-polygon',
    [AMMType.Retro]: 'https://api.thegraph.com/subgraphs/name/ruvlol/univ3-test',
  },
  [ChainId.POLYGONZKEVM]: { [AMMType.PancakeSwap]: 'https://api.studio.thegraph.com/query/45376/exchange-v3-polygon-zkevm/version/latest' },
  [ChainId.BASE]: { [AMMType.SushiSwapV3]: 'https://api.studio.thegraph.com/query/32073/v3-base/version/latest' },
};

/** Fallback enddpoints
 */
const merklFallbackSubgraphPrefix = 'https://api.thegraph.com/subgraphs/name/anglekeeper/backup-';
const merklFallbackSubgraphPrefixUniswapV3 = `${merklFallbackSubgraphPrefix}uniswapv3-`;
const merklFallbackSubgraphPrefixSushiswapV3 = `${merklFallbackSubgraphPrefix}sushiswapv3-`;
const merklFallbackSubgraphPrefixRetro = `${merklFallbackSubgraphPrefix}retro-`;
export const merklFallbackTGEndpoint: { [chainId in MerklSupportedChainIdsType]: { [AMM in AMMType]?: string } } = {
  [ChainId.ARBITRUM]: {
    [AMMType.Retro]: merklFallbackSubgraphPrefixRetro + 'arbitrum',
    [AMMType.SushiSwapV3]: merklFallbackSubgraphPrefixSushiswapV3 + 'arbitrum',
    [AMMType.UniswapV3]: merklFallbackSubgraphPrefixUniswapV3 + 'arbitrum',
  },
  [ChainId.MAINNET]: {
    [AMMType.Retro]: merklFallbackSubgraphPrefixRetro + 'ethereum',
    [AMMType.SushiSwapV3]: merklFallbackSubgraphPrefixSushiswapV3 + 'ethereum',
    [AMMType.UniswapV3]: merklFallbackSubgraphPrefixUniswapV3 + 'ethereum',
    [AMMType.PancakeSwap]: 'https://api.thegraph.com/subgraphs/name/pancakeswap/exchange-v3-eth',
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
  [ChainId.POLYGONZKEVM]: { [AMMType.PancakeSwap]: 'https://api.studio.thegraph.com/query/45376/exchange-v3-polygon-zkevm/version/latest' },
  [ChainId.BASE]: { [AMMType.SushiSwapV3]: 'https://api.studio.thegraph.com/query/32073/v3-base/version/latest' },
};

const merklSubgraphPrefix = 'https://api.thegraph.com/subgraphs/name/angleprotocol/';
const merklSubgraphPrefixStudio = 'https://api.studio.thegraph.com/query/12694/';

export const getMerklSubgraphPrefix = (env: 'prod' | 'dev' | 'local', isStudio = false) => {
  return isStudio
    ? merklSubgraphPrefixStudio + (env !== 'prod' ? 'test-merkl-' : 'merkl-')
    : merklSubgraphPrefix + (env !== 'prod' ? 'test-merkl-' : 'merkl-');
};

export const merklSubgraphAMMEndpoints = (
  env: 'prod' | 'dev' | 'local'
): { [chainId in MerklSupportedChainIdsType]: { [AMM in AMMType]?: string } } => {
  return {
    [ChainId.ARBITRUM]: {
      [AMMType.SushiSwapV3]: getMerklSubgraphPrefix(env) + 'sushiswapv3-arb',
      [AMMType.UniswapV3]: getMerklSubgraphPrefix(env) + 'uniswapv3-arb',
    },
    [ChainId.MAINNET]: {
      [AMMType.SushiSwapV3]: getMerklSubgraphPrefix(env) + 'sushiswapv3-eth',
      [AMMType.UniswapV3]: getMerklSubgraphPrefix(env) + 'uniswapv3-eth',
      [AMMType.PancakeSwap]: getMerklSubgraphPrefix(env) + 'pancakeswapv3-eth',
    },
    [ChainId.OPTIMISM]: {
      [AMMType.SushiSwapV3]: getMerklSubgraphPrefix(env) + 'sushiswapv3-opt',
      [AMMType.UniswapV3]: getMerklSubgraphPrefix(env) + 'uniswapv3-opt',
    },
    [ChainId.POLYGON]: {
      [AMMType.Retro]: getMerklSubgraphPrefix(env) + 'retro-pol',
      [AMMType.SushiSwapV3]: getMerklSubgraphPrefix(env) + 'sushiswapv3-pol',
      [AMMType.UniswapV3]: getMerklSubgraphPrefix(env) + 'uniswapv3-pol',
    },
    [ChainId.POLYGONZKEVM]: {
      [AMMType.PancakeSwap]: getMerklSubgraphPrefix(env, true) + 'pancakeswapv3-zkevm/version/latest',
    },
    [ChainId.BASE]: {
      [AMMType.SushiSwapV3]: getMerklSubgraphPrefix(env, true) + 'sushiswapv3-base/version/latest',
    },
  };
};

export const merklSubgraphALMEndpoints = (
  env: 'prod' | 'dev' | 'local'
): {
  [chainId in MerklSupportedChainIdsType]: { [wrapper in WrapperType<AMMType.UniswapV3>]?: string };
} => {
  return {
    [ChainId.ARBITRUM]: {
      [Wrapper[AMMType.UniswapV3].Arrakis]: getMerklSubgraphPrefix(env) + 'arrakis-arb',
      [Wrapper[AMMType.UniswapV3].Gamma]: getMerklSubgraphPrefix(env) + 'gamma-arb',
      [Wrapper[AMMType.UniswapV3].DefiEdge]: getMerklSubgraphPrefix(env) + 'defiedge-arb',
      [Wrapper[AMMType.UniswapV3].Steer]: getMerklSubgraphPrefix(env) + 'steer-arb',
    },
    [ChainId.MAINNET]: {
      [Wrapper[AMMType.UniswapV3].Arrakis]: getMerklSubgraphPrefix(env) + 'arrakis-eth',
      [Wrapper[AMMType.UniswapV3].Gamma]: getMerklSubgraphPrefix(env) + 'gamma-eth',
      [Wrapper[AMMType.UniswapV3].DefiEdge]: getMerklSubgraphPrefix(env) + 'defiedge-eth',
      [Wrapper[AMMType.UniswapV3].Ichi]: getMerklSubgraphPrefix(env) + 'ichi-eth',
    },
    [ChainId.OPTIMISM]: {
      [Wrapper[AMMType.UniswapV3].Arrakis]: getMerklSubgraphPrefix(env) + 'arrakis-opt',
      [Wrapper[AMMType.UniswapV3].Gamma]: getMerklSubgraphPrefix(env) + 'gamma-opt',
      [Wrapper[AMMType.UniswapV3].DefiEdge]: getMerklSubgraphPrefix(env) + 'defiedge-opt',
      [Wrapper[AMMType.UniswapV3].Steer]: getMerklSubgraphPrefix(env) + 'steer-opt',
    },
    [ChainId.POLYGON]: {
      [Wrapper[AMMType.UniswapV3].Arrakis]: getMerklSubgraphPrefix(env) + 'arrakis-pol',
      [Wrapper[AMMType.UniswapV3].Gamma]: getMerklSubgraphPrefix(env) + 'gamma-pol',
      [Wrapper[AMMType.UniswapV3].DefiEdge]: getMerklSubgraphPrefix(env) + 'defiedge-pol',
      [Wrapper[AMMType.UniswapV3].Ichi]: getMerklSubgraphPrefix(env) + 'ichi-pol',
      [Wrapper[AMMType.UniswapV3].Steer]: getMerklSubgraphPrefix(env) + 'steer-pol',
    },
    [ChainId.POLYGONZKEVM]: {},
    [ChainId.BASE]: {},
  };
};

import { ChainId } from '../../types/constants';
import { AMMType, MerklSupportedChainIdsType, Wrapper, WrapperType } from '../../types/merkl';

const sushiswapV3SubgraphPrefix = 'https://api.thegraph.com/subgraphs/name/sushi-v3/v3-';
export const swapsSubgraphsEndpoint: { [chainId in MerklSupportedChainIdsType]: { [AMM in AMMType]?: string } } = {
  [ChainId.ARBITRUM]: {
    [AMMType.SushiSwapV3]: sushiswapV3SubgraphPrefix + 'arbitrum',
    [AMMType.UniswapV3]: 'https://api.thegraph.com/subgraphs/name/ianlapham/arbitrum-minimal',
    [AMMType.Quickswap]: '',
  },
  [ChainId.MAINNET]: {
    [AMMType.SushiSwapV3]: sushiswapV3SubgraphPrefix + 'ethereum',
    [AMMType.UniswapV3]: 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3',
    [AMMType.Quickswap]: '',
  },
  [ChainId.OPTIMISM]: {
    [AMMType.SushiSwapV3]: sushiswapV3SubgraphPrefix + 'optimism',
    [AMMType.UniswapV3]: 'https://api.thegraph.com/subgraphs/name/ianlapham/optimism-post-regenesis',
    [AMMType.Quickswap]: '',
  },
  [ChainId.POLYGON]: {
    [AMMType.Retro]: '',
    [AMMType.SushiSwapV3]: sushiswapV3SubgraphPrefix + 'polygon',
    [AMMType.UniswapV3]: 'https://api.thegraph.com/subgraphs/name/ianlapham/uniswap-v3-polygon',
    [AMMType.Quickswap]: '',
  },
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
    [AMMType.Quickswap]: '',
  },
  [ChainId.MAINNET]: {
    [AMMType.Retro]: merklFallbackSubgraphPrefixRetro + 'ethereum',
    [AMMType.SushiSwapV3]: merklFallbackSubgraphPrefixSushiswapV3 + 'ethereum',
    [AMMType.UniswapV3]: merklFallbackSubgraphPrefixUniswapV3 + 'ethereum',
    [AMMType.Quickswap]: '',
  },
  [ChainId.OPTIMISM]: {
    [AMMType.Retro]: merklFallbackSubgraphPrefixRetro + 'optimism',
    [AMMType.SushiSwapV3]: merklFallbackSubgraphPrefixSushiswapV3 + 'optimism',
    [AMMType.UniswapV3]: merklFallbackSubgraphPrefixUniswapV3 + 'optimism',
    [AMMType.Quickswap]: '',
  },
  [ChainId.POLYGON]: {
    [AMMType.Retro]: merklFallbackSubgraphPrefixRetro + 'polygon',
    [AMMType.SushiSwapV3]: merklFallbackSubgraphPrefixSushiswapV3 + 'polygon',
    [AMMType.UniswapV3]: merklFallbackSubgraphPrefixUniswapV3 + 'polygon',
    [AMMType.Quickswap]: '',
  },
};

/**
 *  Merkl Subgraph Endpoints V2
 * @notice transition still in progress
 */
const merklSubgraphPrefix = 'https://api.thegraph.com/subgraphs/name/angleprotocol/';
export const getMerklSubgraphPrefix = (env: 'prod' | 'dev' | 'local') => {
  return merklSubgraphPrefix + (env !== 'prod' ? 'test-merkl-' : 'merkl-');
};
/**
 * @dev TODO add ALGEBRA here
 */
export const merklSubgraphAMMEndpoints = (
  merklSubgraphPrefix: string
): { [chainId in MerklSupportedChainIdsType]: { [AMM in AMMType]?: string } } => {
  return {
    [ChainId.ARBITRUM]: {
      [AMMType.SushiSwapV3]: merklSubgraphPrefix + 'sushiswapv3-arb',
      [AMMType.UniswapV3]: merklSubgraphPrefix + 'uniswapv3-arb',
      [AMMType.Quickswap]: '',
    },
    [ChainId.MAINNET]: {
      [AMMType.SushiSwapV3]: merklSubgraphPrefix + 'sushiswapv3-eth',
      [AMMType.UniswapV3]: merklSubgraphPrefix + 'uniswapv3-eth',
      [AMMType.Quickswap]: '',
    },
    [ChainId.OPTIMISM]: {
      [AMMType.SushiSwapV3]: merklSubgraphPrefix + 'sushiswapv3-opt',
      [AMMType.UniswapV3]: merklSubgraphPrefix + 'uniswapv3-opt',
      [AMMType.Quickswap]: '',
    },

    [ChainId.POLYGON]: {
      [AMMType.Retro]: merklSubgraphPrefix + 'retro-pol',
      [AMMType.SushiSwapV3]: merklSubgraphPrefix + 'sushiswapv3-pol',
      [AMMType.UniswapV3]: merklSubgraphPrefix + 'uniswapv3-pol',
      [AMMType.Quickswap]: merklSubgraphPrefix + 'quickswap-pol',
    },
  };
};
export const merklSubgraphALMEndpoints = (
  merklSubgraphPrefix: string
): {
  [chainId in MerklSupportedChainIdsType]: { [wrapper in WrapperType<AMMType.UniswapV3>]?: string };
} => {
  return {
    [ChainId.ARBITRUM]: {
      [Wrapper[AMMType.UniswapV3].Arrakis]: merklSubgraphPrefix + 'arrakis-arb',
      [Wrapper[AMMType.UniswapV3].Gamma]: merklSubgraphPrefix + 'gamma-arb',
      [Wrapper[AMMType.UniswapV3].DefiEdge]: merklSubgraphPrefix + 'defiedge-arb',
      [Wrapper[AMMType.UniswapV3].Steer]: merklSubgraphPrefix + 'steer-arb',
    },
    [ChainId.MAINNET]: {
      [Wrapper[AMMType.UniswapV3].Arrakis]: merklSubgraphPrefix + 'arrakis-eth',
      [Wrapper[AMMType.UniswapV3].Gamma]: merklSubgraphPrefix + 'gamma-eth',
      [Wrapper[AMMType.UniswapV3].DefiEdge]: merklSubgraphPrefix + 'defiedge-eth',
      [Wrapper[AMMType.UniswapV3].Ichi]: merklSubgraphPrefix + 'ichi-eth',
    },
    [ChainId.OPTIMISM]: {
      [Wrapper[AMMType.UniswapV3].Arrakis]: merklSubgraphPrefix + 'arrakis-opt',
      [Wrapper[AMMType.UniswapV3].Gamma]: merklSubgraphPrefix + 'gamma-opt',
      [Wrapper[AMMType.UniswapV3].DefiEdge]: merklSubgraphPrefix + 'defiedge-opt',
      [Wrapper[AMMType.UniswapV3].Steer]: merklSubgraphPrefix + 'steer-opt',
    },
    [ChainId.POLYGON]: {
      [Wrapper[AMMType.UniswapV3].Arrakis]: merklSubgraphPrefix + 'arrakis-pol',
      [Wrapper[AMMType.UniswapV3].Gamma]: merklSubgraphPrefix + 'gamma-pol',
      [Wrapper[AMMType.UniswapV3].DefiEdge]: merklSubgraphPrefix + 'defiedge-pol',
      [Wrapper[AMMType.UniswapV3].Ichi]: merklSubgraphPrefix + 'ichi-pol',
      [Wrapper[AMMType.UniswapV3].Steer]: merklSubgraphPrefix + 'steer-pol',
    },
  };
};

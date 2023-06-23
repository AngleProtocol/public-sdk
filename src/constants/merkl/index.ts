import { ChainId } from '../../types/constants';
import { AMMType, MerklSupportedChainIdsType, Wrapper } from '../../types/merkl';

export const calculatorUsedWrappersList: {
  [chainId in MerklSupportedChainIdsType]: { [amm in AMMType]: any[] };
} = {
  [ChainId.ARBITRUM]: {
    [AMMType.UniswapV3]: [
      Wrapper[AMMType.UniswapV3].Arrakis,
      Wrapper[AMMType.UniswapV3].Gamma,
      Wrapper[AMMType.UniswapV3].DefiEdge,
      Wrapper[AMMType.UniswapV3].Steer,
    ],
    [AMMType.SushiSwapV3]: [],
    [AMMType.Retro]: [],
  },
  [ChainId.MAINNET]: {
    [AMMType.UniswapV3]: [
      Wrapper[AMMType.UniswapV3].Arrakis,
      Wrapper[AMMType.UniswapV3].Gamma,
      Wrapper[AMMType.UniswapV3].DefiEdge,
      Wrapper[AMMType.UniswapV3].Ichi,
    ],
    [AMMType.SushiSwapV3]: [],
    [AMMType.Retro]: [],
  },
  [ChainId.OPTIMISM]: {
    [AMMType.UniswapV3]: [
      Wrapper[AMMType.UniswapV3].Arrakis,
      Wrapper[AMMType.UniswapV3].Gamma,
      Wrapper[AMMType.UniswapV3].DefiEdge,
      Wrapper[AMMType.UniswapV3].Steer,
    ],
    [AMMType.SushiSwapV3]: [],
    [AMMType.Retro]: [],
  },
  [ChainId.POLYGON]: {
    [AMMType.UniswapV3]: [
      Wrapper[AMMType.UniswapV3].Arrakis,
      Wrapper[AMMType.UniswapV3].Gamma,
      Wrapper[AMMType.UniswapV3].DefiEdge,
      Wrapper[AMMType.UniswapV3].Steer,
      Wrapper[AMMType.UniswapV3].Ichi,
    ],
    [AMMType.SushiSwapV3]: [],
    [AMMType.Retro]: [],
  },
};

export * from './addresses';
export * from './endpoints';

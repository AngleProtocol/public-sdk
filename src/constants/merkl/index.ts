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
    [AMMType.SushiSwapV3]: [Wrapper[AMMType.SushiSwapV3].Gamma, Wrapper[AMMType.SushiSwapV3].Steer, Wrapper[AMMType.SushiSwapV3].DefiEdge],
    [AMMType.Retro]: [],
    [AMMType.PancakeSwap]: [],
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
    [AMMType.PancakeSwap]: [],
  },
  [ChainId.OPTIMISM]: {
    [AMMType.UniswapV3]: [
      Wrapper[AMMType.UniswapV3].Arrakis,
      Wrapper[AMMType.UniswapV3].Gamma,
      Wrapper[AMMType.UniswapV3].DefiEdge,
      Wrapper[AMMType.UniswapV3].Steer,
    ],
    [AMMType.SushiSwapV3]: [Wrapper[AMMType.SushiSwapV3].Gamma, Wrapper[AMMType.SushiSwapV3].Steer],
    [AMMType.Retro]: [],
    [AMMType.PancakeSwap]: [],
  },
  [ChainId.POLYGON]: {
    [AMMType.UniswapV3]: [
      Wrapper[AMMType.UniswapV3].Arrakis,
      Wrapper[AMMType.UniswapV3].Gamma,
      Wrapper[AMMType.UniswapV3].DefiEdge,
      Wrapper[AMMType.UniswapV3].Steer,
      Wrapper[AMMType.UniswapV3].Ichi,
    ],
    [AMMType.SushiSwapV3]: [Wrapper[AMMType.SushiSwapV3].Gamma, Wrapper[AMMType.SushiSwapV3].Steer, Wrapper[AMMType.SushiSwapV3].DefiEdge],
    [AMMType.Retro]: [Wrapper[AMMType.Retro].Ichi, Wrapper[AMMType.Retro].Gamma, Wrapper[AMMType.UniswapV3].Steer],
    [AMMType.PancakeSwap]: [],
  },
  [ChainId.POLYGONZKEVM]: { [AMMType.PancakeSwap]: [], [AMMType.Retro]: [], [AMMType.SushiSwapV3]: [], [AMMType.UniswapV3]: [] },
  [ChainId.BASE]: { [AMMType.PancakeSwap]: [], [AMMType.Retro]: [], [AMMType.SushiSwapV3]: [], [AMMType.UniswapV3]: [] },
};

export * from './addresses';
export * from './endpoints';

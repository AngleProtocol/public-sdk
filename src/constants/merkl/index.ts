import { ChainId } from '../../types/constants';
import { AMMType, MerklSupportedChainIdsType, Wrapper } from '../../types/merkl';

// TODO: @greedythib improve typings
export const calculatorUsedWrappersList: {
  [chainId in MerklSupportedChainIdsType]: { [amm in AMMType]: any[] };
} = {
  [ChainId.ARBITRUM]: {
    [AMMType.UniswapV3]: [
      Wrapper[AMMType.UniswapV3].Arrakis,
      Wrapper[AMMType.UniswapV3].ArrakisV2,
      Wrapper[AMMType.UniswapV3].Gamma,
      Wrapper[AMMType.UniswapV3].DefiEdge,
      Wrapper[AMMType.UniswapV3].Range,
      Wrapper[AMMType.UniswapV3].Steer,
      Wrapper[AMMType.UniswapV3].Unipilot,
    ],
    [AMMType.SushiSwapV3]: [Wrapper[AMMType.SushiSwapV3].Gamma, Wrapper[AMMType.SushiSwapV3].Steer, Wrapper[AMMType.SushiSwapV3].DefiEdge],
    [AMMType.Retro]: [],
    [AMMType.PancakeSwapV3]: [],
    [AMMType.Camelot]: [Wrapper[AMMType.Camelot].Gamma],
    [AMMType.BaseSwap]: [],
    [AMMType.Horiza]: [],
  },
  [ChainId.MAINNET]: {
    [AMMType.UniswapV3]: [
      Wrapper[AMMType.UniswapV3].Arrakis,
      Wrapper[AMMType.UniswapV3].Gamma,
      Wrapper[AMMType.UniswapV3].DefiEdge,
      Wrapper[AMMType.UniswapV3].Ichi,
      Wrapper[AMMType.UniswapV3].Range,
    ],
    [AMMType.SushiSwapV3]: [],
    [AMMType.Retro]: [],
    [AMMType.PancakeSwapV3]: [],
    [AMMType.Camelot]: [],
    [AMMType.BaseSwap]: [],
    [AMMType.Horiza]: [],
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
    [AMMType.PancakeSwapV3]: [],
    [AMMType.Camelot]: [],
    [AMMType.BaseSwap]: [],
    [AMMType.Horiza]: [],
  },
  [ChainId.POLYGON]: {
    [AMMType.UniswapV3]: [
      Wrapper[AMMType.UniswapV3].Arrakis,
      Wrapper[AMMType.UniswapV3].Gamma,
      Wrapper[AMMType.UniswapV3].DefiEdge,
      Wrapper[AMMType.UniswapV3].Steer,
      Wrapper[AMMType.UniswapV3].Ichi,
      Wrapper[AMMType.UniswapV3].Range,
    ],
    [AMMType.SushiSwapV3]: [Wrapper[AMMType.SushiSwapV3].Gamma, Wrapper[AMMType.SushiSwapV3].Steer, Wrapper[AMMType.SushiSwapV3].DefiEdge],
    [AMMType.Retro]: [
      Wrapper[AMMType.Retro].Ichi,
      Wrapper[AMMType.Retro].Gamma,
      Wrapper[AMMType.Retro].Steer,
      Wrapper[AMMType.Retro].Range,
      Wrapper[AMMType.Retro].DefiEdge,
    ],
    [AMMType.PancakeSwapV3]: [],
    [AMMType.Camelot]: [],
    [AMMType.BaseSwap]: [],
    [AMMType.Horiza]: [],
  },
  [ChainId.POLYGONZKEVM]: {
    [AMMType.PancakeSwapV3]: [],
    [AMMType.Retro]: [],
    [AMMType.SushiSwapV3]: [],
    [AMMType.UniswapV3]: [],
    [AMMType.Camelot]: [],
    [AMMType.BaseSwap]: [],
    [AMMType.Horiza]: [],
  },
  [ChainId.BASE]: {
    [AMMType.PancakeSwapV3]: [],
    [AMMType.Retro]: [],
    [AMMType.SushiSwapV3]: [Wrapper[AMMType.SushiSwapV3].Gamma],
    [AMMType.UniswapV3]: [],
    [AMMType.Camelot]: [],
    [AMMType.BaseSwap]: [],
    [AMMType.Horiza]: [],
  },
};

export * from './addresses';
export * from './endpoints';

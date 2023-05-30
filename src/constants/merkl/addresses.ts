import { ChainId } from '../../types/constants';
import { AMMType, MerklSupportedChainIdsType } from '../../types/merkl';

export const NFTManagerAddress: { [chainId in MerklSupportedChainIdsType]: { [AMM in AMMType]: string } } = {
  [ChainId.ARBITRUM]: {
    [AMMType.Retro]: '',
    [AMMType.SushiSwapV3]: '',
    [AMMType.UniswapV3]: '0xC36442b4a4522E871399CD717aBDD847Ab11FE88',
  },
  [ChainId.MAINNET]: {
    [AMMType.Retro]: '',
    [AMMType.SushiSwapV3]: '0x2214a42d8e2a1d20635c2cb0664422c528b6a432',
    [AMMType.UniswapV3]: '0xC36442b4a4522E871399CD717aBDD847Ab11FE88',
  },
  [ChainId.OPTIMISM]: {
    [AMMType.Retro]: '',
    [AMMType.SushiSwapV3]: '0x1af415a1EbA07a4986a52B6f2e7dE7003D82231e',
    [AMMType.UniswapV3]: '0xC36442b4a4522E871399CD717aBDD847Ab11FE88',
  },
  [ChainId.POLYGON]: {
    [AMMType.Retro]: '0x15f2B5606994e8D7F1930E5F305b02c20e12A473',
    [AMMType.SushiSwapV3]: '0xb7402ee99F0A008e461098AC3A27F4957Df89a40',
    [AMMType.UniswapV3]: '0xC36442b4a4522E871399CD717aBDD847Ab11FE88',
  },
};

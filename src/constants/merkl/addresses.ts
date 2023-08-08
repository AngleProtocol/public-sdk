import { ChainId } from '../../types/constants';
import { AMMType, MerklSupportedChainIdsType } from '../../types/merkl';

export const NFTManagerAddress: { [chainId in MerklSupportedChainIdsType]: { [AMM in AMMType]?: string } } = {
  [ChainId.ARBITRUM]: {
    [AMMType.SushiSwapV3]: '0xF0cBce1942A68BEB3d1b73F0dd86C8DCc363eF49',
    [AMMType.UniswapV3]: '0xC36442b4a4522E871399CD717aBDD847Ab11FE88',
  },
  [ChainId.MAINNET]: {
    [AMMType.SushiSwapV3]: '0x2214a42d8e2a1d20635c2cb0664422c528b6a432',
    [AMMType.UniswapV3]: '0xC36442b4a4522E871399CD717aBDD847Ab11FE88',
    [AMMType.PancakeSwap]: '0x46A15B0b27311cedF172AB29E4f4766fbE7F4364',
  },
  [ChainId.OPTIMISM]: {
    [AMMType.SushiSwapV3]: '0x1af415a1EbA07a4986a52B6f2e7dE7003D82231e',
    [AMMType.UniswapV3]: '0xC36442b4a4522E871399CD717aBDD847Ab11FE88',
  },
  [ChainId.POLYGON]: {
    [AMMType.Retro]: '0x8aAc493fd8C78536eF193882AeffEAA3E0B8b5c5',
    [AMMType.SushiSwapV3]: '0xb7402ee99F0A008e461098AC3A27F4957Df89a40',
    [AMMType.UniswapV3]: '0xC36442b4a4522E871399CD717aBDD847Ab11FE88',
  },
  [ChainId.POLYGONZKEVM]: {
    [AMMType.PancakeSwap]: '0x46A15B0b27311cedF172AB29E4f4766fbE7F4364',
  },
  [ChainId.BASE]: {
    [AMMType.SushiSwapV3]: '0x80C7DD17B01855a6D2347444a0FCC36136a314de',
  },
};

export const FactoryAddress: { [chainId in MerklSupportedChainIdsType]: { [AMM in AMMType]?: string } } = {
  [ChainId.ARBITRUM]: {
    [AMMType.SushiSwapV3]: '0x1af415a1EbA07a4986a52B6f2e7dE7003D82231e',
    [AMMType.UniswapV3]: '0x1F98431c8aD98523631AE4a59f267346ea31F984',
  },
  [ChainId.MAINNET]: {
    [AMMType.SushiSwapV3]: '0xbACEB8eC6b9355Dfc0269C18bac9d6E2Bdc29C4F',
    [AMMType.UniswapV3]: '0x1F98431c8aD98523631AE4a59f267346ea31F984',
    [AMMType.PancakeSwap]: '0x0BFbCF9fa4f9C56B0F40a671Ad40E0805A091865',
  },
  [ChainId.OPTIMISM]: {
    [AMMType.SushiSwapV3]: '0x9c6522117e2ed1fE5bdb72bb0eD5E3f2bdE7DBe0',
    [AMMType.UniswapV3]: '0x1F98431c8aD98523631AE4a59f267346ea31F984',
  },
  [ChainId.POLYGON]: {
    [AMMType.Retro]: '0x91e1B99072f238352f59e58de875691e20Dc19c1',
    [AMMType.SushiSwapV3]: '0x917933899c6a5f8e37f31e19f92cdbff7e8ff0e2',
    [AMMType.UniswapV3]: '0x1F98431c8aD98523631AE4a59f267346ea31F984',
  },
  [ChainId.POLYGONZKEVM]: { [AMMType.PancakeSwap]: '0x0BFbCF9fa4f9C56B0F40a671Ad40E0805A091865' },
  [ChainId.BASE]: { [AMMType.SushiSwapV3]: '0xc35DADB65012eC5796536bD9864eD8773aBc74C4' },
};

import { ChainId } from '../../types/constants';
import { AMMType, MerklSupportedChainIdsType } from '../../types/merkl';

export const NFTManagerAddress: { [chainId in MerklSupportedChainIdsType]: { [AMM in AMMType]?: string } } = {
  [ChainId.ARBITRUM]: {
    [AMMType.SushiSwapV3]: '0xF0cBce1942A68BEB3d1b73F0dd86C8DCc363eF49',
    [AMMType.UniswapV3]: '0xC36442b4a4522E871399CD717aBDD847Ab11FE88',
    [AMMType.Camelot]: '0x00c7f3082833e796A5b3e4Bd59f6642FF44DCD15',
    [AMMType.Horiza]: '0x39f16045432dc7cb6160269724821459b35938f9',
  },
  [ChainId.MAINNET]: {
    [AMMType.SushiSwapV3]: '0x2214a42d8e2a1d20635c2cb0664422c528b6a432',
    [AMMType.UniswapV3]: '0xC36442b4a4522E871399CD717aBDD847Ab11FE88',
    [AMMType.PancakeSwapV3]: '0x46A15B0b27311cedF172AB29E4f4766fbE7F4364',
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
    [AMMType.PancakeSwapV3]: '0x46A15B0b27311cedF172AB29E4f4766fbE7F4364',
  },
  [ChainId.BASE]: {
    [AMMType.SushiSwapV3]: '0x80C7DD17B01855a6D2347444a0FCC36136a314de',
    [AMMType.BaseSwap]: '0xDe151D5c92BfAA288Db4B67c21CD55d5826bCc93',
    [AMMType.Horiza]: '0xa0AAFa3f0613c8c22dBf4203173eCaFb15B3724b',
  },
};

export const FactoryAddress: { [chainId in MerklSupportedChainIdsType]: { [AMM in AMMType]?: string } } = {
  [ChainId.ARBITRUM]: {
    [AMMType.SushiSwapV3]: '0x1af415a1EbA07a4986a52B6f2e7dE7003D82231e',
    [AMMType.UniswapV3]: '0x1F98431c8aD98523631AE4a59f267346ea31F984',
    [AMMType.Camelot]: '0x1a3c9B1d2F0529D97f2afC5136Cc23e58f1FD35B',
    [AMMType.Horiza]: '0x5b1C257B88537d1Ce2AF55a1760336288CcD28B6',
  },
  [ChainId.MAINNET]: {
    [AMMType.SushiSwapV3]: '0xbACEB8eC6b9355Dfc0269C18bac9d6E2Bdc29C4F',
    [AMMType.UniswapV3]: '0x1F98431c8aD98523631AE4a59f267346ea31F984',
    [AMMType.PancakeSwapV3]: '0x0BFbCF9fa4f9C56B0F40a671Ad40E0805A091865',
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
  [ChainId.POLYGONZKEVM]: { [AMMType.PancakeSwapV3]: '0x0BFbCF9fa4f9C56B0F40a671Ad40E0805A091865' },
  [ChainId.BASE]: {
    [AMMType.SushiSwapV3]: '0xc35DADB65012eC5796536bD9864eD8773aBc74C4',
    [AMMType.BaseSwap]: '0x38015D05f4fEC8AFe15D7cc0386a126574e8077B',
    [AMMType.Horiza]: '0x9DAaA9041E84025aF8b8d941B302B22204f0a267',
  },
};

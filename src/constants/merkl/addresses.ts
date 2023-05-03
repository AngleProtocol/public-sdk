import { ChainId } from '../../types/constants';
import { AMMType, MerklSupportedChainIdsType } from '../../types/merkl';

export const NFTManagerAddress: { [chainId in MerklSupportedChainIdsType]: { [AMM in AMMType]: string } } = {
  [ChainId.ARBITRUM]: {
    [AMMType.UniswapV3]: '0xC36442b4a4522E871399CD717aBDD847Ab11FE88',
    [AMMType.SushiSwap]: '',
  },
  [ChainId.MAINNET]: { [AMMType.UniswapV3]: '0xC36442b4a4522E871399CD717aBDD847Ab11FE88', [AMMType.SushiSwap]: '' },
  [ChainId.OPTIMISM]: { [AMMType.UniswapV3]: '0xC36442b4a4522E871399CD717aBDD847Ab11FE88', [AMMType.SushiSwap]: '' },
  [ChainId.POLYGON]: { [AMMType.UniswapV3]: '0xC36442b4a4522E871399CD717aBDD847Ab11FE88', [AMMType.SushiSwap]: '' },
};

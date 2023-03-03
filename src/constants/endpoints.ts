import { ChainId } from 'src';

import { SupportedChainsType } from '../types/merkl';

export const tgEndpoints: { [chainId in SupportedChainsType]: string } = {
  [ChainId.MAINNET]: 'https://api.thegraph.com/subgraphs/name/guillaumenervoxs/angle-merkl-reward',
  [ChainId.POLYGON]: 'https://api.thegraph.com/subgraphs/name/guillaumenervoxs/angle-merkl-reward-polygon',
  [ChainId.OPTIMISM]: 'https://api.thegraph.com/subgraphs/name/guillaumenervoxs/angle-merkl-reward-optimism',
};

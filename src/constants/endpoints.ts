import { ChainId } from '../types/constants';
import { SupportedChainsType } from '../types/merkl';

const theGraphPrefix = 'https://api.thegraph.com/subgraphs/name/guillaumenervoxs/angle-merkl-reward';

export const tgEndpoints: { [chainId in SupportedChainsType]: string } = {
  [ChainId.MAINNET]: theGraphPrefix,
  [ChainId.POLYGON]: theGraphPrefix + '-polygon',
  [ChainId.OPTIMISM]: theGraphPrefix + '-optimism',
};

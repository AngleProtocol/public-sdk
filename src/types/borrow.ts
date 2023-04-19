import { ChainId } from './constants';

const BorrowSupportedChainIds = <const>[ChainId.ARBITRUM, ChainId.AVALANCHE, ChainId.MAINNET, ChainId.OPTIMISM, ChainId.POLYGON];
export type BorrowSupportedChainIdsType = typeof BorrowSupportedChainIds[number];
export const isBorrowSupportedChainId = (chainId: any): chainId is BorrowSupportedChainIdsType => {
  return BorrowSupportedChainIds.includes(chainId);
};

import { ChainId } from '.';

const BorrowSupportedChainIds = <const>[ChainId.MAINNET, ChainId.AVALANCHE, ChainId.POLYGON, ChainId.ARBITRUM, ChainId.OPTIMISM];
export type BorrowSupportedChainIdsType = typeof BorrowSupportedChainIds[number];
export const isBorrowSupportedChainId = (chainId: any): chainId is BorrowSupportedChainIdsType => {
  return BorrowSupportedChainIds.includes(chainId);
};

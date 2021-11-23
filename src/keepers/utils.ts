import { ALL_TOKENS, CONTRACTS_ADDRESSES, StableTokens } from '../constants';
import { Perpetual, TGPerpetual } from '../lib';
import { AssetType, ChainId, Token } from '../types';

const getPairs = (chainId: ChainId) => {
  const allPairs: { stable: Token; collateral: Token }[] = [];

  for (const stableAddr in ALL_TOKENS[chainId][AssetType.STABLE]) {
    const stable = ALL_TOKENS[chainId][AssetType.STABLE][stableAddr];

    for (const collatAddr in ALL_TOKENS[chainId][AssetType.COLLATERAL]) {
      const collateral = ALL_TOKENS[chainId][AssetType.COLLATERAL][collatAddr];

      if (CONTRACTS_ADDRESSES[chainId][stable.symbol as typeof StableTokens[number]]?.collaterals?.[collateral.symbol].PerpetualManager) {
        allPairs.push({ stable: stable, collateral: collateral });
      }
    }
  }

  return allPairs;
};

export const getPair = (stableSymbol: string, collateralSymbol: string, chainId: ChainId) => {
  return getPairs(chainId).filter((pair) => pair.stable.symbol === stableSymbol && pair.collateral.symbol === collateralSymbol)[0];
};

export const getAllPairNames = (chainId: ChainId): string[] => {
  const pairs = getPairs(chainId);
  return pairs.map((pair) => `${pair.stable.symbol}/${pair.collateral.symbol}`);
};

export const getContractAddressFromPairName = (pairName: string, chainId: ChainId): string | undefined => {
  const [stableSymbol, collateralSymbol] = pairName.split('/');
  if (!stableSymbol || !collateralSymbol) return undefined;

  const contract =
    CONTRACTS_ADDRESSES[chainId][stableSymbol as typeof StableTokens[number]]?.collaterals?.[collateralSymbol]?.PerpetualManager;

  return contract;
};

export type PairWithIds = { [pairName: string]: number[] };

export const convertTGPerpToPerpetual = (perp: TGPerpetual, chainId: ChainId) => {
  const { stable, collateral } = getPair(perp.stableName, perp.collatName, chainId);
  return Perpetual.fromTgPerp(perp, stable, collateral, chainId);
};

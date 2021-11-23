import { providers } from 'ethers';

import { Int256, Perpetual } from '../../lib';
import { ChainId } from '../../types';
import { Logger } from '../logger';
import { fetchPairs, getCalls } from '../multicall/calls';
import { Pair } from '../pair';
import { convertTGPerpToPerpetual, getAllPairNames, PairWithIds } from '../utils';
import { fetchPerpetuals } from './gql';

function sortingPerpetualsFunc(a: Perpetual, b: Perpetual) {
  return a.coveredAmount.lt(b.coveredAmount) ? 1 : -1;
}

function sortPerpetuals(perpetuals: Perpetual[]) {
  return perpetuals.slice().sort(sortingPerpetualsFunc);
}

const computeLiquidationByPair = (pair: Pair, perpetuals: Perpetual[]) => {
  const { requireForceClose, targetHedgeAmount } = pair.computeRequireForceClose();
  let totalHedgeAmountAfterClose = pair.totalHedgeAmount;

  const liquidables = perpetuals.reduce((_liquidables, perpetual) => {
    const isLiquidable = pair?.lowerExchangeRate.lt(perpetual.liquidationPrice);

    if (isLiquidable) {
      _liquidables.push(perpetual.perpetualId);
      totalHedgeAmountAfterClose = totalHedgeAmountAfterClose.sub(perpetual.coveredAmount)!;
    }
    return _liquidables;
  }, [] as number[]);

  return { liquidables, requireForceClose, totalHedgeAmountAfterClose, targetHedgeAmount };
};

const computeForceCloseByPair = (pair: Pair, perpetuals: Perpetual[]) => {
  const { requireForceClose, targetHedgeAmount } = pair.computeRequireForceClose();
  const forceClosables: number[] = [];
  let totalHedgeAmountAfterClose = pair.totalHedgeAmount;
  const now = Date.now();

  if (requireForceClose) {
    Logger('requireForceClose', `${pair.stable.symbol}/${pair.collateral.symbol}`);
    perpetuals = sortPerpetuals(perpetuals);

    for (const perpetual of perpetuals) {
      if (!requireForceClose || totalHedgeAmountAfterClose.lte(targetHedgeAmount)) {
        break;
      }
      if (now - perpetual.lastUpdated >= pair.lockTime) {
        // Check that the perpetual isn't locked
        totalHedgeAmountAfterClose = totalHedgeAmountAfterClose.sub(perpetual.coveredAmount)!;
        forceClosables.push(perpetual.perpetualId);
      }
    }
  }

  return { forceClosables, requireForceClose, totalHedgeAmountAfterClose, targetHedgeAmount };
};

type MemoryPair = {
  name: string;
  perpetuals: Perpetual[];
  pairData?: Pair;
  pairComputedData?: {
    requireForceClose: boolean;
    targetHedgeAmount: Int256;
    initialTotalHedgeAmount: Int256;
    totalHedgeAmountAfterClose?: Int256;
  };
};

type TAllPairs = { [pairName: string]: MemoryPair };

const setupPairs = async (provider: providers.JsonRpcProvider, chainId: ChainId): Promise<TAllPairs> => {
  const { allPairs, calls } = getCalls(chainId);

  const ALL_PAIRS: TAllPairs = getAllPairNames(chainId).reduce((acc, value) => {
    acc[value] = {
      name: value,
      perpetuals: [],
    };
    return acc;
  }, {} as TAllPairs);

  const before = Date.now();
  const [pairs, perpetuals] = await Promise.all([fetchPairs(calls, allPairs, provider, chainId), fetchPerpetuals(chainId)]);
  Logger(`fetchAll: ${Date.now() - before}ms`);

  for (const pair of pairs) {
    const pairName = `${pair.stable.symbol}/${pair.collateral.symbol}`;
    ALL_PAIRS[pairName].pairData = pair;
  }

  perpetuals.forEach((perp) => {
    const perpetual = convertTGPerpToPerpetual(perp, chainId);
    const pairName = `${perpetual.stable.symbol}/${perpetual.collateral.symbol}`;
    ALL_PAIRS[pairName].perpetuals.push(perpetual);
  });

  return ALL_PAIRS;
};

/**
 * Returns all perpetuals ready to be liquidated
 *
 * @param provider - Ethers provider
 * @param chainId - ChainId of the required network
 * @returns
 */
export const computeLiquidation = async (
  provider: providers.JsonRpcProvider,
  chainId: ChainId
): Promise<{ allLiquidables: PairWithIds }> => {
  const ALL_PAIRS = await setupPairs(provider, chainId);

  const allLiquidables: PairWithIds = {};

  for (const pairName in ALL_PAIRS) {
    const data = ALL_PAIRS[pairName];

    const { liquidables } = computeLiquidationByPair(data.pairData!, data.perpetuals);

    Logger(pairName, 'LIQUIDABLES:', liquidables);

    if (liquidables.length > 0) {
      allLiquidables[pairName] = [...liquidables];
    }
  }

  return { allLiquidables };
};

/**
 * Returns all perpetuals that can be force closed
 *
 * @param provider - Ethers provider
 * @param chainId - chainID of the network
 * @returns
 */
export const computeForceClose = async (
  provider: providers.JsonRpcProvider,
  chainId: ChainId
): Promise<{ allForceClosables: PairWithIds }> => {
  const ALL_PAIRS = await setupPairs(provider, chainId);
  const allForceClosables: PairWithIds = {};

  for (const pairName in ALL_PAIRS) {
    const data = ALL_PAIRS[pairName];
    const { requireForceClose, targetHedgeAmount, totalHedgeAmountAfterClose, forceClosables } = computeForceCloseByPair(
      data.pairData!,
      data.perpetuals
    );

    ALL_PAIRS[pairName].pairComputedData = {
      requireForceClose,
      targetHedgeAmount,
      initialTotalHedgeAmount: data.pairData!.totalHedgeAmount,
      totalHedgeAmountAfterClose,
    };

    Logger(pairName, requireForceClose, targetHedgeAmount.toFixed(2), totalHedgeAmountAfterClose.toFixed(2), forceClosables);

    if (forceClosables.length > 0) {
      allForceClosables[pairName] = [...forceClosables];
    }
  }

  return { allForceClosables };
};

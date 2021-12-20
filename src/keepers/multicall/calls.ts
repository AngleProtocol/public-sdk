import { BigNumber, providers } from 'ethers';

import { ALL_TOKENS, AngleContractsStableType, CONTRACTS_ADDRESSES, Interfaces, StableTokens } from '../../constants';
import { AssetType, ChainId, Token } from '../../types';
import { Pair } from '../pair';
import { addCall, execMulticall, MulticallEntry } from './index';

export const getCalls = (chainId: ChainId) => {
  const allPairs: { stable: Token; collateral: Token }[] = [];

  const maintenanceMargins: MulticallEntry[] = [];
  const totalHedgeAmounts: MulticallEntry[] = [];
  const limitHAHedges: MulticallEntry[] = [];
  const targetHAHedges: MulticallEntry[] = [];
  const lockTimes: MulticallEntry[] = [];
  const rates: MulticallEntry[] = [];
  const collateralMaps: MulticallEntry[] = [];
  for (const stableAddr in ALL_TOKENS[chainId][AssetType.STABLE]) {
    const stable = ALL_TOKENS[chainId][AssetType.STABLE][stableAddr];
    const stableMasterAddr = (CONTRACTS_ADDRESSES[chainId][stable.symbol as typeof StableTokens[number]] as AngleContractsStableType)
      .StableMaster;
    for (const collatAddr in ALL_TOKENS[chainId][AssetType.COLLATERAL]) {
      const collateral = ALL_TOKENS[chainId][AssetType.COLLATERAL][collatAddr];
      const perpetualManagerAddr = (CONTRACTS_ADDRESSES[chainId][stable.symbol as typeof StableTokens[number]] as AngleContractsStableType)
        .collaterals[collateral.symbol]?.PerpetualManager;
      const poolManagerAddr = (CONTRACTS_ADDRESSES[chainId][stable.symbol as typeof StableTokens[number]] as AngleContractsStableType)
        .collaterals[collateral.symbol]?.PoolManager;
      const oracleAddr = (CONTRACTS_ADDRESSES[chainId][stable.symbol as typeof StableTokens[number]] as AngleContractsStableType)
        .collaterals[collateral.symbol]?.Oracle;
      if (perpetualManagerAddr && oracleAddr) {
        allPairs.push({ stable: stable, collateral: collateral });

        /* Perpetual Manager */
        maintenanceMargins.push(
          addCall(
            Interfaces.Perpetual_Manager_Interface,
            perpetualManagerAddr,
            Interfaces.Perpetual_Manager_Interface.functions['maintenanceMargin()'].name
          )
        );
        totalHedgeAmounts.push(
          addCall(
            Interfaces.Perpetual_Manager_Interface,
            perpetualManagerAddr,
            Interfaces.Perpetual_Manager_Interface.functions['totalHedgeAmount()'].name
          )
        );
        limitHAHedges.push(
          addCall(
            Interfaces.Perpetual_Manager_Interface,
            perpetualManagerAddr,
            Interfaces.Perpetual_Manager_Interface.functions['limitHAHedge()'].name
          )
        );
        targetHAHedges.push(
          addCall(
            Interfaces.Perpetual_Manager_Interface,
            perpetualManagerAddr,
            Interfaces.Perpetual_Manager_Interface.functions['targetHAHedge()'].name
          )
        );
        lockTimes.push(
          addCall(
            Interfaces.Perpetual_Manager_Interface,
            perpetualManagerAddr,
            Interfaces.Perpetual_Manager_Interface.functions['lockTime()'].name
          )
        );

        /* Oracle */
        rates.push(addCall(Interfaces.Oracle__factory.createInterface(), oracleAddr, Interfaces.Oracle__factory.createInterface().functions['readAll()'].name));

        /* Stable Master */
        collateralMaps.push(
          addCall(
            Interfaces.StableMasterFront_Interface,
            stableMasterAddr,
            Interfaces.StableMasterFront_Interface.functions['collateralMap(address)'].name,
            [poolManagerAddr]
          )
        );
      }
    }
  }

  return {
    allPairs,
    calls: encodeCalls(allPairs, maintenanceMargins, totalHedgeAmounts, limitHAHedges, targetHAHedges, lockTimes, rates, collateralMaps),
  };
};

const encodeCalls = (
  pairs: any[],
  maintenanceMargins: MulticallEntry[],
  totalHedgeAmounts: MulticallEntry[],
  limitHAHedges: MulticallEntry[],
  targetHAHedges: MulticallEntry[],
  lockTimes: MulticallEntry[],
  rates: MulticallEntry[],
  collateralMaps: MulticallEntry[]
): MulticallEntry[] => {
  const calls: MulticallEntry[] = [];
  for (let i = 0; i < pairs.length; i++) {
    calls.push(maintenanceMargins[i]);
    calls.push(totalHedgeAmounts[i]);
    calls.push(limitHAHedges[i]);
    calls.push(targetHAHedges[i]);
    calls.push(lockTimes[i]);
    calls.push(rates[i]);
    calls.push(collateralMaps[i]);
  }
  return calls;
};

const decodeResults = (
  pairs: any[],
  results: any[]
): {
  maintenanceMargin: [BigNumber];
  totalHedgeAmount: [BigNumber];
  limitHAHedge: [BigNumber];
  targetHAHedge: [BigNumber];
  lockTime: [BigNumber];
  rate: [BigNumber, BigNumber];
  collateralMap: { stocksUsers: BigNumber };
}[] => {
  const decoded: {
    maintenanceMargin: [BigNumber];
    totalHedgeAmount: [BigNumber];
    limitHAHedge: [BigNumber];
    targetHAHedge: [BigNumber];
    lockTime: [BigNumber];
    rate: [BigNumber, BigNumber];
    collateralMap: { stocksUsers: BigNumber };
  }[] = [];
  const ratio = results.length / pairs.length;
  for (let i = 0; i < pairs.length; i++) {
    decoded.push({
      maintenanceMargin: results[i * ratio],
      totalHedgeAmount: results[1 + i * ratio],
      limitHAHedge: results[2 + i * ratio],
      targetHAHedge: results[3 + i * ratio],
      lockTime: results[4 + i * ratio],
      rate: results[5 + i * ratio],
      collateralMap: results[6 + i * ratio],
    });
  }
  return decoded;
};

export const fetchPairs = async (
  calls: MulticallEntry[],
  pairs: any[],
  provider: providers.Provider,
  chainId: ChainId
): Promise<Pair[]> => {
  console.time('fetchPairs');
  const results = await execMulticall(calls, provider, chainId);
  const decoded = decodeResults(pairs, results);
  console.timeEnd('fetchPairs');
  return pairs.map((pair, i) => {
    const result = decoded[i];
    return new Pair(
      pair.stable,
      pair.collateral,
      result.maintenanceMargin[0],
      result.totalHedgeAmount[0],
      result.limitHAHedge[0],
      result.targetHAHedge[0],
      result.lockTime[0],
      result.rate[0],
      result.collateralMap.stocksUsers
    );
  });
};

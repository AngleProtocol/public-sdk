import { BigNumber, ethers, utils } from 'ethers';
import keccak256 from 'keccak256';
import MerkleTree from 'merkletreejs';

import { calculatorUsedWrappersList } from '../constants/merkl';
import { getMerklSubgraphPrefix, merklSubgraphALMEndpoints } from '../constants/merkl/endpoints';
import { ExtensiveDistributionParametersStructOutput } from '../constants/types/DistributionCreator';
import {
  AggregatedRewardsType,
  AMMType,
  EnvType,
  MerklAPIData,
  MerklSupportedChainIdsType,
  UnderlyingTreeType,
  WrapperType,
} from '../types';
import { findMerklAMMType } from '../types/utils';
import { BN2Number } from './index';
import { getVaultsForPoolId } from './thegraph';

/**
 * @param underylingTreeData
 * @param user
 * @returns
 */
export const buildMerklTree = (
  underylingTreeData: UnderlyingTreeType,
  user?: string
): {
  tree: MerkleTree;
  transactionData: MerklAPIData['transactionData'];
} => {
  /**
   * 1 - Build the global list of users
   */
  const users: string[] = [];
  for (const id of Object.keys(underylingTreeData)) {
    const rewardUsers = Object.keys(underylingTreeData[id].holders);
    for (const r of rewardUsers) {
      if (!users.includes(r)) {
        users.push(r);
      }
    }
  }

  /**
   * 2 - Build the global list of tokens
   */
  const tokens: string[] = tokensFromTree(underylingTreeData);

  /**
   * 3 - Build the tree
   */
  const elements = [];
  const transactionData: MerklAPIData['transactionData'] = {};
  for (const u of users) {
    for (const t of tokens) {
      let sum = BigNumber.from(0);
      for (const id of Object.keys(underylingTreeData)) {
        const distribution = underylingTreeData[id];
        if (distribution.token === t) {
          sum = sum?.add(distribution?.holders[u]?.amount.toString() ?? 0);
        }
      }
      const hash = ethers.utils.keccak256(
        ethers.utils.defaultAbiCoder.encode(['address', 'address', 'uint256'], [utils.getAddress(u), t, sum])
      );
      if (u === user) {
        transactionData[t] = { claim: sum.toString(), leaf: hash, token: t };
      }
      elements.push(hash);
    }
  }
  const tree = new MerkleTree(elements, keccak256, { hashLeaves: false, sortPairs: true });

  // Build proofs
  for (const k of Object.keys(transactionData)) {
    transactionData[k].proof = tree.getHexProof(transactionData[k].leaf);
  }

  return {
    transactionData,
    tree,
  };
};

export const tokensFromTree = (json: AggregatedRewardsType['rewards']): string[] => {
  const tokens: string[] = [];
  for (const id of Object.keys(json)) {
    if (!tokens.includes(json[id].token)) {
      tokens.push(json[id].token);
    }
  }
  return tokens;
};

/**
 * @notice Returns the deduped list of pools from the list of distribution fetched from solidity
 */
export const poolListFromSolidityStruct = (data: ExtensiveDistributionParametersStructOutput[]): { address: string; amm: AMMType }[] => {
  const pools: { address: string; amm: AMMType }[] = [];
  for (const d of data) {
    if (!pools.map((pool) => pool.address).includes(d.base.uniV3Pool)) {
      pools.push({ address: d.base.uniV3Pool, amm: findMerklAMMType(d.base.additionalData?.toString()) });
    }
  }
  return pools;
};

/**
 * @notice Returns the deduped list of wrappers per pools from the list of distribution fetched from solidity
 */
export const wrappersPerPoolFromSolidityStruct = async (
  chainId: MerklSupportedChainIdsType,
  data: ExtensiveDistributionParametersStructOutput[],
  env: EnvType = 'prod'
): Promise<
  {
    amm: AMMType;
    pool: string;
    decimal0: number;
    token0: string;
    decimal1: number;
    token1: string;
    wrappers: { type: WrapperType<AMMType>; address: string }[];
  }[]
> => {
  const pools = poolListFromSolidityStruct(data);
  const dedupedWrapperList = [];
  /** Iterate over all pools */
  for (const pool of pools) {
    const p = pool.address;
    const amm = pool.amm;
    const poolData: {
      amm: AMMType;
      decimal0: number;
      decimal1: number;
      pool: string;
      token0: string;
      token1: string;
      wrappers: { type: WrapperType<typeof amm>; address: string }[];
    } = {
      amm: amm,
      decimal0: BN2Number(data.filter((d) => d.base.uniV3Pool === p)[0].token0.decimals, 0),
      decimal1: BN2Number(data.filter((d) => d.base.uniV3Pool === p)[0].token1.decimals, 0),
      token0: data.filter((d) => d.base.uniV3Pool === p)[0].token0.symbol,
      token1: data.filter((d) => d.base.uniV3Pool === p)[0].token1.symbol,
      pool: p,
      wrappers: [],
    };
    // TODO @greedythib -> change uniswapv3 ALM according to the ALM used
    const merklSubgraphPrefix = getMerklSubgraphPrefix(env);
    // TODO: SPECIFIC TO UNISWAPV3
    if (amm === AMMType.UniswapV3) {
      for (const wrapper of calculatorUsedWrappersList[chainId][amm]) {
        const tgURL = merklSubgraphALMEndpoints(merklSubgraphPrefix)[chainId][AMMType.UniswapV3][wrapper as WrapperType<AMMType.UniswapV3>];
        try {
          if (!!tgURL) {
            const vaults_per_wrapper = await getVaultsForPoolId(p, tgURL);
            vaults_per_wrapper.forEach((vault) => poolData.wrappers.push({ address: vault, type: wrapper }));
          }
        } catch {}
      }
    }
    dedupedWrapperList.push(poolData);
  }
  return dedupedWrapperList;
};

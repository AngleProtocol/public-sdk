import { BigNumber, ethers, utils } from 'ethers';
import keccak256 from 'keccak256';
import MerkleTree from 'merkletreejs';

import { ExtensiveDistributionParametersStruct } from '../constants/types/DistributionCreator';
import { AggregatedRewardsType, UnderlyingTreeType, WrapperType } from '../types';
import { BN2Number } from './index';

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
  transactionData: {
    claim: string;
    token: string;
    leaf: string;
    proof?: string[];
  }[];
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
  const transactionData: { claim: string; token: string; leaf: string }[] = [];
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
        transactionData.push({ claim: sum.toString(), leaf: hash, token: t });
      }
      elements.push(hash);
    }
  }
  const tree = new MerkleTree(elements, keccak256, { hashLeaves: false, sortPairs: true });
  //console.log(`${elements.length} leaves. Root: ${tree.getHexRoot()}`);
  return {
    transactionData: transactionData.map((u) => {
      return { ...u, proof: tree.getHexProof(u.leaf) };
    }),
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
export const poolListFromSolidityStruct = (data: ExtensiveDistributionParametersStruct[]): string[] => {
  const pools: string[] = [];
  for (const d of data) {
    if (!pools.includes(d.base.uniV3Pool)) {
      pools.push(d.base.uniV3Pool);
    }
  }
  return pools;
};

/**
 * @notice Returns the deduped list of wrappers per pools from the list of distribution fetched from solidity
 */
export const wrappersPerPoolFromSolidityStruct = (
  data: ExtensiveDistributionParametersStruct[]
): { pool: string; decimal0: number; decimal1: number; wrappers: { type: WrapperType; address: string }[] }[] => {
  const pools = poolListFromSolidityStruct(data);
  const res = [];

  for (const p of pools) {
    const aux: { pool: string; decimal0: number; decimal1: number; wrappers: { type: WrapperType; address: string }[] } = {
      decimal0: BN2Number(data.filter((d) => d.base.uniV3Pool === p)[0].token0.decimals, 0),
      decimal1: BN2Number(data.filter((d) => d.base.uniV3Pool === p)[0].token1.decimals, 0),
      pool: p,
      wrappers: [],
    };
    for (const d of data.filter((d) => d.base.uniV3Pool === p)) {
      for (const [index, type] of d.base.wrapperTypes.entries()) {
        if (!aux.wrappers.map((t) => t.type).includes(BN2Number(type, 0))) {
          aux.wrappers.push({ address: d.base.positionWrappers[index], type: BN2Number(type, 0) });
        }
      }
    }
    res.push(aux);
  }

  return res;
};

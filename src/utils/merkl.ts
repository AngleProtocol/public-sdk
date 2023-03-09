import { BigNumber, ethers, utils } from 'ethers';
import keccak256 from 'keccak256';
import MerkleTree from 'merkletreejs';

import { ExtensiveDistributionParametersStruct } from '../constants/types/DistributionCreator';
import { AggregatedRewardsType, MerklAPIData, SupportedChainsType, UnderlyingTreeType, WrapperType } from '../types';
import { BN2Number } from './index';
import { getMerklWrapperAddressesFromTheGraph } from './thegraph';

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
export const wrappersPerPoolFromSolidityStruct = async (
  chainId: SupportedChainsType,
  data: ExtensiveDistributionParametersStruct[]
): Promise<
  {
    pool: string;
    decimal0: number;
    token0: string;
    decimal1: number;
    token1: string;
    wrappers: { type: WrapperType; address: string }[];
  }[]
> => {
  const pools = poolListFromSolidityStruct(data);
  const res = [];

  for (const p of pools) {
    const aux: {
      pool: string;
      decimal0: number;
      token0: string;
      decimal1: number;
      token1: string;
      wrappers: { type: WrapperType; address: string }[];
    } = {
      decimal0: BN2Number(data.filter((d) => d.base.uniV3Pool === p)[0].token0.decimals, 0),
      decimal1: BN2Number(data.filter((d) => d.base.uniV3Pool === p)[0].token1.decimals, 0),
      token0: data.filter((d) => d.base.uniV3Pool === p)[0].token0.symbol,
      token1: data.filter((d) => d.base.uniV3Pool === p)[0].token1.symbol,
      pool: p,
      wrappers: [],
    };
    /** Gamma and Arrakis wrapper */
    const { arrakisPools, gammaPools } = await getMerklWrapperAddressesFromTheGraph(chainId, p);
    arrakisPools.forEach((arrakis) => aux.wrappers.push({ address: arrakis, type: WrapperType.Arrakis }));
    gammaPools.forEach((gamma) => aux.wrappers.push({ address: gamma, type: WrapperType.Gamma }));
    /** Other wrappers */
    for (const d of data.filter((d) => d.base.uniV3Pool === p)) {
      for (const [index, type] of d.base.wrapperTypes.entries()) {
        // @picodes are we sure about the condition below? we want to accept several potential vault addresses per wrapper type?
        if (!aux.wrappers.map((t) => t.type).includes(BN2Number(type, 0))) {
          aux.wrappers.push({ address: d.base.positionWrappers[index], type: BN2Number(type, 0) });
        }
      }
    }
    res.push(aux);
  }

  return res;
};

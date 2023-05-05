import { BigNumber, ethers, utils } from 'ethers';
import keccak256 from 'keccak256';
import MerkleTree from 'merkletreejs';

import { ExtensiveDistributionParametersStruct } from '../constants/types/DistributionCreator';
import {
  AggregatedRewardsType,
  AMMType,
  MerklAPIData,
  MerklSupportedChainIdsType,
  UnderlyingTreeType,
  Wrapper,
  WrapperType,
} from '../types';
import { findMerklAMMType } from '../types/utils';
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
export const poolListFromSolidityStruct = (data: ExtensiveDistributionParametersStruct[]): { address: string; amm: AMMType }[] => {
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
  data: ExtensiveDistributionParametersStruct[]
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
  const res = [];
  /** Iterate over all distributions */
  for (const pool of pools) {
    const p = pool.address;
    const amm = pool.amm;
    const aux: {
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
    const result = await getMerklWrapperAddressesFromTheGraph(chainId, amm, p);
    // TODO: SPECIFIC TO UNISWAPV3
    if (amm === AMMType.UniswapV3 && !!result) {
      /** Gamma and Arrakis wrapper */
      const { arrakisPools, gammaPools } = result;
      arrakisPools.forEach((arrakis) => aux.wrappers.push({ address: arrakis, type: Wrapper[amm].Arrakis }));
      gammaPools.forEach((gamma) => aux.wrappers.push({ address: gamma, type: Wrapper[amm].Gamma }));
      /** Other wrappers */
      for (const d of data.filter((d) => d.base.uniV3Pool === p)) {
        for (const [index, type] of d.base.wrapperTypes.entries()) {
          if (BN2Number(type, 0) !== Wrapper[amm].Arrakis && BN2Number(type, 0) !== Wrapper[amm].Gamma) {
            aux.wrappers.push({ address: d.base.positionWrappers[index], type: BN2Number(type, 0) });
          }
        }
      }
      res.push(aux);
    }
  }
  return res;
};

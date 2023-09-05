import { BigNumber, ethers, utils } from 'ethers';
import keccak256 from 'keccak256';
import MerkleTree from 'merkletreejs';

import { ExtensiveDistributionParametersStructOutput } from '../constants/types/DistributionCreator';
import { AggregatedRewardsType, AMMType, MerklSupportedChainIdsType, UnderlyingTreeType } from '../types';
import { fetchMerklAMMType } from '../types/utils';

/**
 * @param underylingTreeData
 *
 * @returns
 */
export const buildMerklTree = (
  underylingTreeData: UnderlyingTreeType
): {
  tree: MerkleTree;
  tokens: string[];
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
  for (const u of users) {
    for (const t of tokens) {
      let sum = BigNumber.from(0);
      for (const id of Object.keys(underylingTreeData)) {
        const distribution = underylingTreeData[id];
        if (distribution.token === t) {
          sum = sum?.add(distribution?.holders[u]?.amount.toString() ?? 0);
        }
      }
      const hash = ethers.utils.defaultAbiCoder.encode(['address', 'address', 'uint256'], [utils.getAddress(u), t, sum]);

      elements.push(hash);
    }
  }
  const tree = new MerkleTree(elements, keccak256, { hashLeaves: true, sortPairs: true });

  return {
    tokens,
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
 * @notice DEPRECATED - Returns the deduped list of pools from the list of distribution fetched from solidity
 */
export const buildPoolList = async (
  chainId: MerklSupportedChainIdsType,
  data: ExtensiveDistributionParametersStructOutput[]
): Promise<{ address: string; amm: AMMType }[]> => {
  const pools: { address: string; amm: AMMType }[] = [];

  await Promise.all(
    data.map(async (d) =>
      (async () => {
        try {
          const amm = await fetchMerklAMMType(chainId, d.base.uniV3Pool);
          // Warning to not add duplicates as the above call is async so additions are async
          if (!pools.map((pool) => pool.address).includes(d.base.uniV3Pool)) {
            pools.push({ address: d.base.uniV3Pool, amm: amm });
          }
        } catch {
          console.log(`${d.base.uniV3Pool.toLowerCase()} not found in the graphs`);
        }
      })()
    )
  );

  return pools;
};

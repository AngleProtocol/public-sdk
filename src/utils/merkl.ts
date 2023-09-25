import { BigNumber, ethers, utils } from 'ethers';
import { Interface } from 'ethers/lib/utils';
import keccak256 from 'keccak256';
import MerkleTree from 'merkletreejs';

import {
  AlgebraV19NonFungibleManager__factory,
  AlgebraV19Pool__factory,
  BaseXNonFungiblePositionManager__factory,
  UniswapV3NFTManager__factory,
  UniswapV3Pool__factory,
} from '../constants/types';
import { ExtensiveDistributionParametersStructOutput } from '../constants/types/DistributionCreator';
import { AggregatedRewardsType, AMMAlgorithmType, AMMType, MerklSupportedChainIdsType, UnderlyingTreeType } from '../types';
import { fetchMerklAMMType } from '../types/utils';

/**
 * NonFungiblePositionManager
 */
export const NonFungiblePositionManagerInterface = (ammType: AMMAlgorithmType): Interface => {
  if (ammType === AMMAlgorithmType.AlgebraV1_9) {
    return AlgebraV19NonFungibleManager__factory.createInterface();
  } else if (ammType === AMMAlgorithmType.UniswapV3) {
    return UniswapV3NFTManager__factory.createInterface();
  } else if (ammType === AMMAlgorithmType.BaseX) {
    return BaseXNonFungiblePositionManager__factory.createInterface();
  } else {
    throw new Error('Invalid AMM type');
  }
};

/**
 * Pools
 */
export const PoolInterface = (ammType: AMMAlgorithmType): Interface => {
  if (ammType === AMMAlgorithmType.AlgebraV1_9) {
    return AlgebraV19Pool__factory.createInterface();
  } else if (ammType === AMMAlgorithmType.UniswapV3 || ammType === AMMAlgorithmType.BaseX) {
    return UniswapV3Pool__factory.createInterface();
  } else {
    throw new Error('Invalid AMM type');
  }
};

export const SwapPriceField = {
  [AMMAlgorithmType.AlgebraV1_9]: 'price',
  [AMMAlgorithmType.UniswapV3]: 'sqrtPriceX96',
  [AMMAlgorithmType.BaseX]: 'sqrtPriceX96',
};
export const PoolStateName = {
  [AMMAlgorithmType.AlgebraV1_9]: 'globalState',
  [AMMAlgorithmType.UniswapV3]: 'slot0',
  [AMMAlgorithmType.BaseX]: 'slot0',
};

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
      const hash = ethers.utils.keccak256(
        ethers.utils.defaultAbiCoder.encode(['address', 'address', 'uint256'], [utils.getAddress(u), t, sum])
      );

      elements.push(hash);
    }
  }
  const tree = new MerkleTree(elements, keccak256, { hashLeaves: false, sortPairs: true, sortLeaves: true });

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

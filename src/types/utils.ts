import { BigNumber, utils } from 'ethers';
import { Interface } from 'ethers/lib/utils';
import request, { gql } from 'graphql-request';
import invariant from 'tiny-invariant';

import {
  AlgebraV19NonFungibleManager__factory,
  AlgebraV19Pool__factory,
  BaseXNonFungiblePositionManager__factory,
  calculatorUsedWrappersList,
  merklSubgraphAMMEndpoints,
  UniswapV3NFTManager__factory,
  UniswapV3Pool__factory,
} from '../constants';
import { SOLIDITY_TYPE_MAXIMA, SolidityType } from './constants';
import { AMMAlgorithmType, AMMType, MerklSupportedChainIdsType } from './merkl';

export function validateSolidityTypeInstance(value: BigNumber, solidityType: SolidityType): void {
  // invariant(value.gte(0), `${value} is not a ${solidityType}.`);
  invariant(value.lte(SOLIDITY_TYPE_MAXIMA[solidityType]), `${value} is not a ${solidityType}.`);
}

/**
 * Validates an address and returns the parsed (checksummed) version of that address
 * @param address - the unchecksummed hex address
 */
export function validateAndParseAddress(address: string): string {
  try {
    return utils.getAddress(address);
  } catch (error) {
    throw new Error(`${address} is not a valid address.`);
  }
}

/**
 * @notice DEPRECATED
 */
export const findMerklAMMTypeDeprecated = (bytes: string): AMMType => {
  if (!bytes || !utils.isBytesLike(bytes) || bytes === '0x') return AMMType.UniswapV3;
  try {
    const firstDecodedValue = (utils.defaultAbiCoder.decode(['uint256'], bytes)[0] as BigNumber)?.toNumber();
    if (!Object.values(AMMType).includes(firstDecodedValue)) return AMMType.UniswapV3;
    return firstDecodedValue as AMMType;
  } catch {
    return AMMType.UniswapV3;
  }
};

export const fetchMerklAMMType = async (
  chainId: MerklSupportedChainIdsType,
  pool: string,
  env: 'prod' | 'dev' | 'local' = 'prod'
): Promise<AMMType> => {
  const promises = [];
  for (const amm of Object.keys(calculatorUsedWrappersList?.[chainId])) {
    const endpoint = merklSubgraphAMMEndpoints(env)?.[chainId]?.[parseInt(amm) as AMMType];
    promises.push(
      (async () => {
        const query = gql`
          query Pool($poolId: ID!) {
            pool(id: $poolId) {
              id
            }
          }
        `;

        const res = await request(endpoint ?? '', query, { poolId: pool.toLowerCase() });
        if (!!res.pool) return parseInt(amm) as AMMType;
      })()
    );
  }
  const resolvedPromises = await Promise.allSettled(promises);
  for (const p of resolvedPromises) {
    if (p.status === 'fulfilled' && p.value !== undefined && parseInt(p.value?.toString()) == p.value) return p.value;
  }
  throw new Error('Unable to solve AMM type'); // To silence warning
};

export enum RouterActionType {
  transfer,
  wrapNative,
  unwrapNative,
  sweep,
  sweepNative,
  uniswapV3,
  oneInch,
  claimRewards,
  gaugeDeposit,
  borrower,
  swapper,
  mint4626,
  deposit4626,
  redeem4626,
  withdraw4626,
  prepareRedeemSavingsRate,
  claimRedeemSavingsRate,
  swapIn,
  swapOut,
  claimWeeklyInterest,
  withdraw,
  mint,
  deposit,
  openPerpetual,
  addToPerpetual,
  veANGLEDeposit,
  claimRewardsWithPerps,
}

export enum BorrowActionType {
  createVault,
  closeVault,
  addCollateral,
  removeCollateral,
  repayDebt,
  borrow,
  getDebtIn,
  permit,
}

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

export const SqrtPrice = {
  [AMMAlgorithmType.AlgebraV1_9]: 'price',
  [AMMAlgorithmType.UniswapV3]: 'sqrtPriceX96',
  [AMMAlgorithmType.BaseX]: 'sqrtPriceX96',
};
export const PoolState = {
  [AMMAlgorithmType.AlgebraV1_9]: 'globalState',
  [AMMAlgorithmType.UniswapV3]: 'slot0',
  [AMMAlgorithmType.BaseX]: 'slot0',
};

import { gql, request } from 'graphql-request';

import { tgEndpoints } from '../constants/endpoints';
import { SupportedChainsType } from '../types/merkl';

type PoolAddressesType = { arrakisPools: string[]; gammaPools: string[] };

export const getMerklWrapperAddressesFromTheGraph = async (chainId: SupportedChainsType, pool: string): Promise<PoolAddressesType> => {
  const tg_merkl = tgEndpoints[chainId];
  const wrapperQuery = gql`
    query Query($poolId: ID!) {
      pool(id: $poolId) {
        arrakisPools
        gammaPools
      }
      s
    }
  `;
  const poolData = await request<{
    pool: PoolAddressesType;
  }>(tg_merkl as string, wrapperQuery, {
    poolId: pool?.toLowerCase(),
  });
  const arrakisPools = poolData?.pool.arrakisPools.filter(function (elem, pos) {
    return poolData?.pool.arrakisPools.indexOf(elem) == pos;
  });
  const gammaPools = poolData?.pool.gammaPools.filter(function (elem, pos) {
    return poolData?.pool.gammaPools.indexOf(elem) == pos;
  });

  return { arrakisPools, gammaPools };
};

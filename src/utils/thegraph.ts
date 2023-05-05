import { gql, request } from 'graphql-request';

import { merklSubgraphEndpoint } from '../constants/merkl/endpoints';
import { AMMType, MerklSupportedChainIdsType } from '../types/merkl';

type PoolAddressesType = { arrakisPools: string[]; gammaPools: string[] };

export const getMerklWrapperAddressesFromTheGraph = async (
  chainId: MerklSupportedChainIdsType,
  amm: AMMType,
  pool: string
): Promise<PoolAddressesType | null> => {
  const tg_merkl = merklSubgraphEndpoint[chainId][amm];
  if (amm === AMMType.UniswapV3) {
    const wrapperQuery = gql`
      query Query($poolId: ID!) {
        pool(id: $poolId) {
          arrakisPools
          gammaPools
        }
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
  } else {
    return null;
  }
};

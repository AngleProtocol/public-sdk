import { gql, request } from 'graphql-request';

import { withRetry } from '../helpers/index';

export const vaultQuery = gql`
  query Vaults($poolId: String!) {
    vaults(where: { pool: $poolId }) {
      id
    }
  }
`;
export async function getVaultsForPoolId(poolAddress: string, graphUrl: string): Promise<string[]> {
  const vaultData = await withRetry<any, { vaults: { id: string }[] }>(request, [
    graphUrl as string,
    vaultQuery,
    {
      poolId: poolAddress.toLowerCase(),
    },
  ]);
  const vaults = vaultData?.vaults;
  const vaultAddresses: string[] = [];
  if (!vaults) {
    return vaultAddresses;
  }
  for (const vault of vaults) {
    vaultAddresses.push(vault.id);
  }
  return vaultAddresses;
}
// export const getMerklWrapperAddressesFromTheGraph = async (
//   chainId: MerklSupportedChainIdsType,
//   amm: AMMType,
//   pool: string
// ): Promise<PoolAddressesType | null> => {
//   const tg_merkl = merklSubgraphEndpoint[chainId][amm];
//   if (amm === AMMType.UniswapV3) {
//     const wrapperQuery = gql`
//       query Query($poolId: ID!) {
//         pool(id: $poolId) {
//           arrakisPools
//           gammaPools
//         }
//       }
//     `;
//     const poolData = await request<{
//       pool: PoolAddressesType;
//     }>(tg_merkl as string, wrapperQuery, {
//       poolId: pool?.toLowerCase(),
//     });
//     const arrakisPools = poolData?.pool.arrakisPools.filter(function (elem, pos) {
//       return poolData?.pool.arrakisPools.indexOf(elem) == pos;
//     });
//     const gammaPools = poolData?.pool.gammaPools.filter(function (elem, pos) {
//       return poolData?.pool.gammaPools.indexOf(elem) == pos;
//     });
//     return { arrakisPools, gammaPools };
//   } else {
//     return null;
//   }
// };

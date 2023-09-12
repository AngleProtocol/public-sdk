import { gql, request } from 'graphql-request';

import { withRetry } from '../helpers/index';

export const vaultQuery = gql`
  query Vaults($poolId: String!) {
    vaults(where: { pool_in: [$poolId] }) {
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

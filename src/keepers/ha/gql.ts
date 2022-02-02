import { gql, request } from 'graphql-request';

import { TGPerpetual } from '../../lib';
import { ChainId } from '../../types';
import { Logger } from '../logger';

const THEGRAPH_URLS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: 'https://api.thegraph.com/subgraphs/name/picodes/perpetual',
  [ChainId.POLYGON]: '',
  [ChainId.AVALANCHE]: '',
  [ChainId.AURORA]: '',
  [ChainId.FANTOM]: '',
  [ChainId.BSC]: '',
  [ChainId.RINKEBY]: 'https://api.thegraph.com/subgraphs/name/picodes/rinkeby-perpetual',
  [ChainId.LOCAL]: '',
};

/**
 * Fetches all the perpetuals from TheGraph. Perpetuals can only be fetched by 1000 so we need a recursive function to fetch them all.
 *
 * @param chainId - ChainId of the network
 * @param lastId - last perpetual ID seen until now
 * @returns
 */
export const fetchPerpetuals = async (chainId: ChainId, lastId = ''): Promise<TGPerpetual[]> => {
  const fetchLength = 1000;

  const query = gql`
    query manyPerpetuals($lastId: String) {
      perpetuals(where: { status: open, id_gt: $lastId }, first: ${fetchLength}, orderBy: id) {
        id
        perpetualID
        owner
        margin
        committedAmount
        entryRate
        perpetualManager
        stableAddress
        collatAddress
        stableName
        collatName
        openingBlockNumber
        openingTimestamp
        lastUpdateBlockNumber
        lastUpdateTimestamp
        status
        liquidationPrice
      }
    }
  `;
  let response: TGPerpetual[] = [];

  try {
    const firstQuery = await request<{ perpetuals: TGPerpetual[] }>(THEGRAPH_URLS[chainId], query, { lastId });
    response = firstQuery.perpetuals;
  } catch (e) {
    console.error('The Graph error (in fetchPerpetuals):', e);
    throw e;
    // TODO: send alert on Discord
  }

  if (response.length === fetchLength) {
    const nextLastId = response[response.length - 1].id;
    const secondQuery = await fetchPerpetuals(chainId, nextLastId);
    response.push(...secondQuery);
  }

  if (lastId === '') {
    Logger('Perpetuals: ', response.length);
  }

  return response;
};

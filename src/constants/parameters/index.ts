import { ChainId } from '../../types';
import arbitrum from './arbitrum';
import avalanche from './avalanche';
import localhost from './localhost';
import mainnet from './mainnet';
import optimism from './optimism';
import polygon from './polygon';
import rinkeby from './rinkeby';
import test from './test';
import { GlobalParameters, PoolsParameters, StablesParameters } from './types';

export default (
  chainID: number
): { globalParameters?: GlobalParameters; stablesParameters: StablesParameters; poolsParameters?: PoolsParameters } => {
  if (chainID === ChainId.RINKEBY) {
    return rinkeby;
  }
  if (chainID === ChainId.MAINNET) {
    return mainnet;
  }
  if (chainID === 1337) {
    return localhost;
  }
  if (chainID === ChainId.POLYGON) {
    return polygon;
  }
  if (chainID === ChainId.OPTIMISM) {
    return optimism;
  }
  if (chainID === ChainId.ARBITRUM) {
    return arbitrum;
  }
  if (chainID === ChainId.AVALANCHE) {
    return avalanche;
  }
  return test;
};

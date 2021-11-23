import { ChainId } from '../../types';
import localhost from './localhost';
import mainnet from './mainnet';
import rinkeby from './rinkeby';
import { GlobalParameters, PoolsParameters, StablesParameters } from './types';

export default (
  chainID: number
): { globalParameters: GlobalParameters; stablesParameters: StablesParameters; poolsParameters: PoolsParameters } => {
  if (chainID === ChainId.RINKEBY) {
    return rinkeby;
  }
  if (chainID === ChainId.MAINNET) {
    return mainnet;
  }
  return localhost;
};

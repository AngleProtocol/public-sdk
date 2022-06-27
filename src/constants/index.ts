import { BigNumber } from 'ethers';

import { ChainId } from '../types';
import { ether, gwei } from '../utils/bignumber';
import getParams from './parameters';
import { GlobalParameters, PoolsParameters, StablesParameters } from './parameters/types';

export default (
  chainID: ChainId
): {
  ZERO: BigNumber;
  BASE_TOKENS: BigNumber;
  BASE_PARAMS: BigNumber;
  DECIMAL_TOKENS: number;
  DECIMAL_PARAMS: number;
  globalParameters?: GlobalParameters;
  stablesParameters: StablesParameters;
  poolsParameters?: PoolsParameters;
} => {
  return {
    ZERO: BigNumber.from(0),
    BASE_TOKENS: ether(1),
    BASE_PARAMS: gwei(1),
    DECIMAL_TOKENS: 18,
    DECIMAL_PARAMS: 9,
    ...getParams(chainID),
  };
};

export * from './contracts';
export * as Interfaces from './interfaces';
export * from './tokens';

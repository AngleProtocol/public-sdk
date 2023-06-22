import { BigNumber, Contract, providers, utils, Wallet } from 'ethers';

import { ChainId } from '../../types/constants';
import MULTICALL_ABI from './abi.json';

const MULTICALL_NETWORKS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: '0xeefBa1e63905eF1D7ACbA5a8513c70307C1cE441',
  [ChainId.POLYGON]: '0x11ce4B23bD875D7F5C6a31084f55fDe1e9A87507',
  [ChainId.AVALANCHE]: '',
  [ChainId.AURORA]: '',
  [ChainId.FANTOM]: '',
  [ChainId.CELO]: '',
  [ChainId.BSC]: '',
  [ChainId.LOCAL]: '0x0',
  [ChainId.ARBITRUM]: '',
  [ChainId.OPTIMISM]: '',
  [ChainId.GNOSIS]: '',
  [ChainId.POLYGONZKEVM]: '',
};

const MULTICALL_INTERFACE = new utils.Interface(MULTICALL_ABI);

export interface MulticallEntry {
  address: string;
  callData: string;
  fragment: utils.FunctionFragment;
  contractInterface: utils.Interface;
}

type MulticallResult = utils.Result | any;

export async function execMulticall<ResultType extends MulticallResult = MulticallResult>(
  calls: MulticallEntry[],
  provider: providers.Provider | Wallet,
  chainId: ChainId
): Promise<ResultType[]> {
  const contract = new Contract(MULTICALL_NETWORKS[chainId], MULTICALL_INTERFACE, provider);

  const [, returnData] = (await contract.aggregate(calls.map((obj) => [obj.address, obj.callData]))) as [BigNumber, [string]];

  return returnData.map((data, i) => {
    // we check data.length > 2, to make sure that the result is not just "0x"
    const success = data && data.length > 2;
    if (success) {
      try {
        return calls[i].contractInterface.decodeFunctionResult(calls[i].fragment, data) as any;
      } catch (e) {
        console.error('Error decoding response', e);
      }
    }
  });
}

export const addCall = (contractInterface: utils.Interface, address: string, method: string, callInputs?: any): MulticallEntry => {
  const fragment = contractInterface.getFunction(method);
  const callData = contractInterface.encodeFunctionData(fragment, callInputs);

  return {
    address,
    callData,
    fragment,
    contractInterface,
  };
};

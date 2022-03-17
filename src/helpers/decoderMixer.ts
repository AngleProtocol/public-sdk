import { BigNumber, ethers } from 'ethers';

import { AngleRouter__factory } from '../constants/types';

const data =
  '0xcef5cd0a00000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000e000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000140000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000001a0000000000000000000000000cf263cee139763114faafc5f52865135412f50ec000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e00000000000000000000000000000000000000000000000000000000000000140000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000001600000000000000000000000000000000000000000000000000000000000000180000000000000000000000000000000000000000000000000000000000000000200000000000000000000000051fe22abaf4a26631b2913e417c0560d547797a7000000000000000000000000ba625b318483516f7483dd2c4706ac92d44dbb2b000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000';

const interfaceRouter = AngleRouter__factory.createInterface();

export function main(data: string) {
  const txInfo = interfaceRouter.parseTransaction({ data });

  const paramsPermit: PermitType[] = txInfo.args.paramsPermit;
  const paramsTransfer: TransferType[] = txInfo.args.paramsTransfer;
  const paramsSwap: ParamsSwapType[] = txInfo.args.paramsSwap;
  const actions: ActionType[] = txInfo.args.actions;
  const datas: string[] = txInfo.args.datas;

  console.log(paramsPermit);
  console.log(paramsTransfer);
  console.log(paramsSwap);

  console.log(actions);

  console.log(
    datas.map((data, index) => {
      if (actions[index] === ActionType.mint) return decodeMint(data);
      else if (actions[index] === ActionType.deposit) return decodeDeposit(data);
      else if (actions[index] === ActionType.withdraw) return decodeWithdraw(data);
      else if (actions[index] === ActionType.openPerpetual) return decodeOpenPerp(data);
      else if (actions[index] === ActionType.addToPerpetual) return decodeAddPerp(data);
      else if (actions[index] === ActionType.claimRewards) return decodeClaimRewards(data);
      else if (actions[index] === ActionType.claimWeeklyInterest) return decodeClaimWeeklyInterest(data);
      else if (actions[index] === ActionType.gaugeDeposit) return decodeGaugeDeposit(data);
    })
  );
}

enum ActionType {
  claimRewards,
  claimWeeklyInterest,
  gaugeDeposit,
  withdraw,
  mint,
  deposit,
  openPerpetual,
  addToPerpetual,
}

enum SwapType {
  UniswapV3,
  oneINCH,
}

type ParamsSwapType = {
  inToken: string;
  collateral: string;
  amountIn: BigNumber;
  minAmountOut: BigNumber;
  args: string;
  swapType: SwapType;
};

type TransferType = {
  inToken: string;
  amountIn: BigNumber;
};

/// @notice Data needed to get permits
type PermitType = {
  token: string;
  owner: string;
  value: BigNumber;
  deadline: BigNumber;
  v: number;
  r: string;
  s: string;
};

function decodeMint(data: string) {
  return processBigNumber(
    ethers.utils.defaultAbiCoder.decode(['address', 'uint256', 'uint256', 'bool', 'address', 'address', 'address'], data)
  );
}

function decodeDeposit(data: string) {
  return processBigNumber(
    ethers.utils.defaultAbiCoder.decode(['address', 'uint256', 'bool', 'address', 'address', 'address', 'address'], data)
  );
}

function decodeWithdraw(data: string) {
  return processBigNumber(ethers.utils.defaultAbiCoder.decode(['uint256', 'bool', 'address', 'address', 'address'], data));
}

function decodeOpenPerp(data: string) {
  return processBigNumber(
    ethers.utils.defaultAbiCoder.decode(['address', 'uint256', 'uint256', 'uint256', 'uint256', 'bool', 'address', 'address'], data)
  );
}
function decodeAddPerp(data: string) {
  return processBigNumber(ethers.utils.defaultAbiCoder.decode(['uint256', 'uint256', 'bool', 'address', 'address'], data));
}

function decodeGaugeDeposit(data: string) {
  return processBigNumber(ethers.utils.defaultAbiCoder.decode(['address', 'uint256', 'address', 'address', 'bool'], data));
}

function decodeClaimWeeklyInterest(data: string) {
  return processBigNumber(ethers.utils.defaultAbiCoder.decode(['address', 'address', 'bool'], data));
}

function decodeClaimRewards(data: string) {
  return processBigNumber(
    ethers.utils.defaultAbiCoder.decode(['address', 'uint256', 'address[]', 'uint256[]', 'bool', 'address[]', 'address[]'], data)
  );
}

function processBigNumber(data: ethers.utils.Result) {
  return data.map((arg) => {
    if (ethers.BigNumber.isBigNumber(arg)) return arg.toString();
    else return arg;
  });
}

main(data);

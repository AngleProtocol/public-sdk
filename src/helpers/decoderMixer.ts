import { BigNumber, ethers } from 'ethers';

import { AngleRouter__factory } from '../constants/types';

const data =
  '0xcef5cd0a00000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000001a000000000000000000000000000000000000000000000000000000000000001c000000000000000000000000000000000000000000000000000000000000001e0000000000000000000000000000000000000000000000000000000000000026000000000000000000000000000000000000000000000000000000000000000010000000000000000000000009c215206da4bf108ae5aeef9da7cad3352a36dad000000000000000000000000cf263cee139763114faafc5f52865135412f50ec000000000000000000000000000000000000000000000000000000019f1bddea0000000000000000000000000000000000000000000000000000000062333fce000000000000000000000000000000000000000000000000000000000000001ce4b0aac5c3b8dd04856a9e58b04d2ccda8e26027d3312024a543bb7af5cbd86c08f5a5551d6b8daad09ee9a3f46a1ab73b401b7ded181c3e6536134d977e2ba60000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000030000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000300000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000003000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000e000000000000000000000000000000000000000000000000000000000000001a00000000000000000000000000000000000000000000000000000000000000060000000000000000000000000cf263cee139763114faafc5f52865135412f50ec0000000000000000000000007f82ff050128e29fd89d85d01b93246f744e62a0000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000000000000000000000000000000000003b9aca0000000000000000000000000000000000000000000000000000000000000000010000000000000000000000005addc89785d75c86ab939e9e15bfbbb7fc086a87000000000000000000000000e9f183fc656656f1f17af1f2b0df79b8ff9ad8ed0000000000000000000000009c215206da4bf108ae5aeef9da7cad3352a36dad00000000000000000000000000000000000000000000000000000000000000e0000000000000000000000000cf263cee139763114faafc5f52865135412f50ec000000000000000000000000000000000000000000000000000000003b9aca0000000000000000000000000000000000000000000000017466408a9fb9901e6f00000000000000000000000000000000000000000000000000000000000000010000000000000000000000005addc89785d75c86ab939e9e15bfbbb7fc086a87000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48000000000000000000000000e9f183fc656656f1f17af1f2b0df79b8ff9ad8ed';

const interfaceRouter = AngleRouter__factory.createInterface();

export function main(data: string) {
  const txInfo = interfaceRouter.parseTransaction({ data });

  const paramsPermit: PermitType[] = txInfo.args.paramsPermit;
  const paramsTransfer: TransferType[] = txInfo.args.paramsTransfer;
  const paramsSwap: ParamsSwapType[] = txInfo.args.paramsSwap;
  const actions: ActionType[] = txInfo.args.actions;
  const datas: string[] = txInfo.args.datas;

  console.log('paramsPermit ', paramsPermit);
  console.log('paramsTransfer ', paramsTransfer);
  console.log('paramsSwap ', paramsSwap);

  console.log('actions', actions);

  console.log(
    'data ',
    datas.map((data, index) => {
      if (actions[index] === ActionType.mint) return decodeMint(data);
      else if (actions[index] === ActionType.deposit) return decodeDeposit(data);
      else if (actions[index] === ActionType.withdraw) return decodeWithdraw(data);
      else if (actions[index] === ActionType.openPerpetual) return decodeOpenPerp(data);
      else if (actions[index] === ActionType.addToPerpetual) return decodeAddPerp(data);
      else if (actions[index] === ActionType.claimRewards) return decodeClaimRewards(data);
      else if (actions[index] === ActionType.claimWeeklyInterest) return decodeClaimWeeklyInterest(data);
      else if (actions[index] === ActionType.gaugeDeposit) return decodeGaugeDeposit(data);
      else if (actions[index] === ActionType.veANGLEDeposit) return decodeVeAngleDeposit(data);
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
  veANGLEDeposit,
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

function decodeVeAngleDeposit(data: string) {
  return processBigNumber(ethers.utils.defaultAbiCoder.decode(['address', 'uint256'], data));
}

function processBigNumber(data: ethers.utils.Result) {
  return data.map((arg) => {
    if (ethers.BigNumber.isBigNumber(arg)) return arg.toString();
    else return arg;
  });
}

main(data);

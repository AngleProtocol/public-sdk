import { BigNumber, ethers } from 'ethers';
import { AngleRouter__factory } from '../constants/types';

const data =
  '0xcef5cd0a00000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000001a00000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000022000000000000000000000000000000000000000000000000000000000000002600000000000000000000000000000000000000000000000000000000000000001000000000000000000000000fafc4c0318f8758a17585767890da43db1a560a50000000000000000000000008a97fbd532a5c1ed67fd67c11dd76013abac840e0000000000000000000000000000000000000000000000007e308f591ea39af9000000000000000000000000000000000000000000000000000000006218d7ec000000000000000000000000000000000000000000000000000000000000001b96461758bc3282b6badc5fe32a3b94536ae65bc268190276d636949c8643710c069c4bfb93f403366a70ee7a46283b98a78d1e84ded040d98cdb52d8585fb30b0000000000000000000000000000000000000000000000000000000000000001000000000000000000000000fafc4c0318f8758a17585767890da43db1a560a50000000000000000000000000000000000000000000000007e308f591ea39af90000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000070000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000000000000000000000000000000000003b9aca0000000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000001000000000000000000000000d5fc0dd38390a2fa3d04e2b51aaf93f024f7e8a9000000000000000000000000fafc4c0318f8758a17585767890da43db1a560a5';

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
      return;
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
    ethers.utils.defaultAbiCoder.decode(['address', 'address[]', 'uint256[]', 'bool', 'address[]', 'address[]'], data)
  );
}

function processBigNumber(data: ethers.utils.Result) {
  return data.map((arg) => {
    if (ethers.BigNumber.isBigNumber(arg)) return arg.toString();
    else return arg;
  });
}

main(data);

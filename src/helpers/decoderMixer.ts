import { BigNumber, ethers } from 'ethers';
import { AngleRouter__factory } from 'src/constants/interfaces';

const data =
  '0xcef5cd0a00000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000001a00000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000022000000000000000000000000000000000000000000000000000000000000002600000000000000000000000000000000000000000000000000000000000000001000000000000000000000000fafc4c0318f8758a17585767890da43db1a560a50000000000000000000000008a97fbd532a5c1ed67fd67c11dd76013abac840e00000000000000000000000000000000000000000000021e19e0c9bab2400000000000000000000000000000000000000000000000000000000000006218b43d000000000000000000000000000000000000000000000000000000000000001b7a41fd386413db7e5ba49b6bd8886ccaddfe9c2819855e82ed0eac914019573104383246f41b03a80e5f7474d04e0cee4a7b382a4f1e0393f749305c55ea14040000000000000000000000000000000000000000000000000000000000000001000000000000000000000000fafc4c0318f8758a17585767890da43db1a560a500000000000000000000000000000000000000000000021e19e0c9bab24000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000e00000000000000000000000008a97fbd532a5c1ed67fd67c11dd76013abac840e000000000000000000000000000000000000000000000000000000003b9aca000000000000000000000000000000000000000000000001ded01c30d8fe8f9f0200000000000000000000000000000000000000000000000000000000000000010000000000000000000000005166f26a8677905004d2be10be559124191627f1000000000000000000000000fafc4c0318f8758a17585767890da43db1a560a500000000000000000000000002b6f8efa9209712095efadf7b24206461fcc770';

const interfaceRouter = AngleRouter__factory.createInterface();

export function main(data: string) {
  const txInfo = interfaceRouter.parseTransaction({ data });

  const paramsPermit: PermitType[] = txInfo.args.paramsPermit;
  const paramsTransfer: TransferType[] = txInfo.args.paramsTransfer;
  const paramsSwap: ParamsSwapType[] = txInfo.args.paramsSwap;
  const actions: ActionType[] = txInfo.args.actions;
  const datas: string[] = txInfo.args.datas;

  console.log(
    paramsPermit.map((arg) => {
      if (ethers.BigNumber.isBigNumber(arg)) return arg.toNumber();
      else return arg;
    })
  );
  console.log(
    paramsTransfer.map((arg) => {
      if (ethers.BigNumber.isBigNumber(arg)) return arg.toNumber();
      else return arg;
    })
  );
  console.log(
    paramsSwap.map((arg) => {
      if (ethers.BigNumber.isBigNumber(arg)) return arg.toNumber();
      else return arg;
    })
  );

  console.log(
    actions.map((arg) => {
      ActionType[arg];
    })
  );

  console.log(
    datas.map((data, index) => {
      if (actions[index] === ActionType.mint) return decodeMint(data);
      else if (index === ActionType.deposit) return decodeDeposit(data);
      else if (index === ActionType.withdraw) return decodeWithdraw(data);
      else if (index === ActionType.openPerpetual) return decodeOpenPerp(data);
      else if (index === ActionType.addToPerpetual) return decodeAddPerp(data);
      else if (index === ActionType.claimRewards) return decodeClaimRewards(data);
      else if (index === ActionType.claimWeeklyInterest) return decodeClaimRewards(data);
      else if (index === ActionType.gaugeDeposit) return decodeGaugeDeposit(data);
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

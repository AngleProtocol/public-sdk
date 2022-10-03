import { expect } from 'chai';
import { BigNumber } from 'ethers';
import { formatUnits, parseEther, parseUnits } from 'ethers/lib/utils';

import { ALL_TOKENS, AssetType, ChainId, CONSTANTS } from '../../src';
import { computeForceCloseByPair } from '../../src/keepers/ha/computeLiquidationForceClose';
import { Pair } from '../../src/keepers/pair';
import { Perpetual } from '../../src/lib/perpetual';

function getRandomIntInclusive(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

let perpetuals: Perpetual[];
let pair: Pair;
const chainId = ChainId.MAINNET;
const stable = ALL_TOKENS[chainId][AssetType.STABLE]['0x1a7e4e63778b4f12a199c062f3efdd288afcbce8'];
const collateral = ALL_TOKENS[chainId][AssetType.ANGLE];
const dateNow = Date.now();
const lastBlock = ((dateNow - 10000) / 12).toString();

beforeEach(async () => {
  // create perps
  perpetuals = Array.from(
    { length: 10 },
    (v, index) =>
      new Perpetual(
        chainId,
        index,
        parseEther(getRandomIntInclusive(1, 100).toString()),
        parseEther(getRandomIntInclusive(1, 100).toString()),
        stable,
        collateral,
        parseEther(getRandomIntInclusive(0.1, 2).toString()),
        ALL_TOKENS[chainId][AssetType.ANGLE].address,
        dateNow - 10000,
        'open',
        dateNow - 10000,
        lastBlock,
        lastBlock,
        BigNumber.from(0)
      )
  );

  let currentHedgeAmount = BigNumber.from(0);
  for (let i = 0; i < perpetuals.length; i++) {
    const covAmount = parseUnits(perpetuals[i].coveredAmount.toExact(), collateral.decimals);
    currentHedgeAmount = currentHedgeAmount.add(covAmount) ? currentHedgeAmount.add(covAmount) : BigNumber.from(0);
  }

  const limitHAHedge = BigNumber.from(900_000_000);
  const targetHAHedge = BigNumber.from(700_000_000);
  const stockUsers = currentHedgeAmount
    .mul(parseUnits('1', CONSTANTS(stable.chainId).DECIMAL_PARAMS))
    .div(limitHAHedge.toString())
    .mul(9)
    .div(10);

  pair = new Pair(
    stable,
    collateral,
    BigNumber.from(0),
    BigNumber.from(currentHedgeAmount),
    limitHAHedge,
    targetHAHedge,
    BigNumber.from(0),
    BigNumber.from(0),
    BigNumber.from(stockUsers)
  );
});

describe('ForceClose', () => {
  //   it('forceClose -- look at the ordering ', async () => {
  //     computeForceCloseByPair(pair, perpetuals);
  //   });
  it('forceClose -- only one ', async () => {
    const { targetHedgeAmount: targetHedgeAmountTmp } = pair.computeRequireForceClose();
    const totalHedgeAmountAfterCloseTmp = pair.totalHedgeAmount;
    const curDistance = totalHedgeAmountAfterCloseTmp.sub(targetHedgeAmountTmp)?.toExact();
    const curDistanceToTarget = parseUnits(curDistance ? curDistance : '', collateral.decimals);

    const fakePerp = [
      new Perpetual(
        chainId,
        0,
        parseEther(getRandomIntInclusive(1, 100).toString()),
        BigNumber.from(curDistanceToTarget),
        stable,
        collateral,
        parseEther('1'),
        ALL_TOKENS[chainId][AssetType.ANGLE].address,
        dateNow - 10000,
        'open',
        dateNow - 10000,
        lastBlock,
        lastBlock,
        BigNumber.from(0)
      ),
      new Perpetual(
        chainId,
        1,
        parseEther(getRandomIntInclusive(1, 100).toString()),
        BigNumber.from(curDistanceToTarget).mul(BigNumber.from(2)),
        stable,
        collateral,
        parseEther('1'),
        ALL_TOKENS[chainId][AssetType.ANGLE].address,
        dateNow - 10000,
        'open',
        dateNow - 10000,
        lastBlock,
        lastBlock,
        BigNumber.from(0)
      ),
    ];

    const { forceClosables, requireForceClose, totalHedgeAmountAfterClose, targetHedgeAmount } = computeForceCloseByPair(pair, fakePerp);

    const expectedClose = [0];
    expect(requireForceClose).to.equal(true);
    expect(forceClosables).to.be.eql(expectedClose);
    expect(totalHedgeAmountAfterClose?.toExact()).to.equal(targetHedgeAmountTmp?.toExact());
    expect(targetHedgeAmount.toExact()).to.equal(targetHedgeAmountTmp.toExact());
  });
  it('forceClose -- even all is not enough', async () => {
    const { targetHedgeAmount: targetHedgeAmountTmp } = pair.computeRequireForceClose();
    const totalHedgeAmountAfterCloseTmp = pair.totalHedgeAmount;
    const curDistance = totalHedgeAmountAfterCloseTmp.sub(targetHedgeAmountTmp)?.toExact();
    const curDistanceToTarget = parseUnits(curDistance ? curDistance : '', collateral.decimals);

    const fakePerp = [
      new Perpetual(
        chainId,
        0,
        parseEther(getRandomIntInclusive(1, 100).toString()),
        BigNumber.from(curDistanceToTarget).div(BigNumber.from(3)),
        stable,
        collateral,
        parseEther('1'),
        ALL_TOKENS[chainId][AssetType.ANGLE].address,
        dateNow - 10000,
        'open',
        dateNow - 10000,
        lastBlock,
        lastBlock,
        BigNumber.from(0)
      ),
      new Perpetual(
        chainId,
        1,
        parseEther(getRandomIntInclusive(1, 100).toString()),
        BigNumber.from(curDistanceToTarget).div(BigNumber.from(3)),
        stable,
        collateral,
        parseEther('1'),
        ALL_TOKENS[chainId][AssetType.ANGLE].address,
        dateNow - 10000,
        'open',
        dateNow - 10000,
        lastBlock,
        lastBlock,
        BigNumber.from(0)
      ),
    ];

    const { forceClosables, requireForceClose, totalHedgeAmountAfterClose, targetHedgeAmount } = computeForceCloseByPair(pair, fakePerp);

    const expectedClose = [0, 1];
    expect(requireForceClose).to.equal(true);
    expect(forceClosables).to.have.members(expectedClose);
    const endDistance = totalHedgeAmountAfterClose?.sub(targetHedgeAmount)?.toExact();

    expect(parseFloat(endDistance ? endDistance : '')).to.be.closeTo(
      parseFloat(formatUnits(curDistanceToTarget.div(BigNumber.from(3)), collateral.decimals)),
      1
    );
    expect(targetHedgeAmount.toExact()).to.equal(targetHedgeAmountTmp.toExact());
  });
  it('forceClose -- 2 are needed', async () => {
    const { targetHedgeAmount: targetHedgeAmountTmp } = pair.computeRequireForceClose();
    const totalHedgeAmountAfterCloseTmp = pair.totalHedgeAmount;

    const curDistance = totalHedgeAmountAfterCloseTmp.sub(targetHedgeAmountTmp)?.toExact();
    const curDistanceToTarget = parseUnits(curDistance ? curDistance : '', collateral.decimals);

    const fakePerp = [
      new Perpetual(
        chainId,
        0,
        parseEther(getRandomIntInclusive(1, 100).toString()),
        BigNumber.from(curDistanceToTarget).div(BigNumber.from(2)),
        stable,
        collateral,
        parseEther('1'),
        ALL_TOKENS[chainId][AssetType.ANGLE].address,
        dateNow - 10000,
        'open',
        dateNow - 10000,
        lastBlock,
        lastBlock,
        BigNumber.from(0)
      ),
      new Perpetual(
        chainId,
        1,
        parseEther(getRandomIntInclusive(1, 100).toString()),
        BigNumber.from(curDistanceToTarget).div(BigNumber.from(3)),
        stable,
        collateral,
        parseEther('1'),
        ALL_TOKENS[chainId][AssetType.ANGLE].address,
        dateNow - 10000,
        'open',
        dateNow - 10000,
        lastBlock,
        lastBlock,
        BigNumber.from(0)
      ),
      new Perpetual(
        chainId,
        2,
        parseEther(getRandomIntInclusive(1, 100).toString()),
        BigNumber.from(curDistanceToTarget).mul(BigNumber.from(4)).div(BigNumber.from(5)),
        stable,
        collateral,
        parseEther('1'),
        ALL_TOKENS[chainId][AssetType.ANGLE].address,
        dateNow - 10000,
        'open',
        dateNow - 10000,
        lastBlock,
        lastBlock,
        BigNumber.from(0)
      ),
    ];

    const { forceClosables, requireForceClose, totalHedgeAmountAfterClose, targetHedgeAmount } = computeForceCloseByPair(pair, fakePerp);

    const expectedClose = [2, 1];
    expect(requireForceClose).to.equal(true);
    expect(forceClosables).to.be.eql(expectedClose);
    const endDistance = totalHedgeAmountAfterClose?.sub(targetHedgeAmount)?.toExact();
    expect(parseFloat(endDistance ? endDistance : '')).to.be.closeTo(
      -parseFloat(formatUnits(curDistanceToTarget.mul(BigNumber.from(2)).div(BigNumber.from(15)), collateral.decimals)),
      1
    );
    expect(targetHedgeAmount.toExact()).to.equal(targetHedgeAmountTmp.toExact());
  });
  it('forceClose -- 3 are needed', async () => {
    const { targetHedgeAmount: targetHedgeAmountTmp } = pair.computeRequireForceClose();
    const totalHedgeAmountAfterCloseTmp = pair.totalHedgeAmount;
    const curDistance = totalHedgeAmountAfterCloseTmp.sub(targetHedgeAmountTmp)?.toExact();
    const curDistanceToTarget = parseUnits(curDistance ? curDistance : '', collateral.decimals);

    const fakePerp = [
      new Perpetual(
        chainId,
        0,
        parseEther(getRandomIntInclusive(1, 100).toString()),
        BigNumber.from(curDistanceToTarget).div(BigNumber.from(2)),
        stable,
        collateral,
        parseEther('1'),
        ALL_TOKENS[chainId][AssetType.ANGLE].address,
        dateNow - 10000,
        'open',
        dateNow - 10000,
        lastBlock,
        lastBlock,
        BigNumber.from(0)
      ),
      new Perpetual(
        chainId,
        1,
        parseEther(getRandomIntInclusive(1, 100).toString()),
        BigNumber.from(curDistanceToTarget).div(BigNumber.from(3)),
        stable,
        collateral,
        parseEther('1'),
        ALL_TOKENS[chainId][AssetType.ANGLE].address,
        dateNow - 10000,
        'open',
        dateNow - 10000,
        lastBlock,
        lastBlock,
        BigNumber.from(0)
      ),
      new Perpetual(
        chainId,
        2,
        parseEther(getRandomIntInclusive(1, 100).toString()),
        BigNumber.from(curDistanceToTarget).mul(BigNumber.from(1)).div(BigNumber.from(4)),
        stable,
        collateral,
        parseEther('1'),
        ALL_TOKENS[chainId][AssetType.ANGLE].address,
        dateNow - 10000,
        'open',
        dateNow - 10000,
        lastBlock,
        lastBlock,
        BigNumber.from(0)
      ),
      new Perpetual(
        chainId,
        3,
        parseEther(getRandomIntInclusive(1, 100).toString()),
        BigNumber.from(curDistanceToTarget).mul(BigNumber.from(1)).div(BigNumber.from(5)),
        stable,
        collateral,
        parseEther('1'),
        ALL_TOKENS[chainId][AssetType.ANGLE].address,
        dateNow - 10000,
        'open',
        dateNow - 10000,
        lastBlock,
        lastBlock,
        BigNumber.from(0)
      ),
    ];

    const { forceClosables, requireForceClose, totalHedgeAmountAfterClose, targetHedgeAmount } = computeForceCloseByPair(pair, fakePerp);

    const expectedClose = [0, 1, 3];
    expect(requireForceClose).to.equal(true);
    expect(forceClosables).to.be.eql(expectedClose);
    const endDistance = totalHedgeAmountAfterClose?.sub(targetHedgeAmount)?.toExact();
    expect(parseFloat(endDistance ? endDistance : '')).to.be.closeTo(
      -parseFloat(formatUnits(curDistanceToTarget.mul(BigNumber.from(1)).div(BigNumber.from(30)), collateral.decimals)),
      1
    );
    expect(targetHedgeAmount.toExact()).to.equal(targetHedgeAmountTmp.toExact());
  });
});

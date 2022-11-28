import {
  // estimateBurn,
  estimateClosePerpetual,
  estimateDeposit,
  estimateInverseBurn,
  estimateInverseMint,
  estimateMint,
  estimateOpenPerpetual,
  estimateWithdraw,
} from '../../src/estimators';
import { parseAmount } from '../../src/utils/bignumber';

describe('Users', () => {
  it('estimateMint', async () => {
    console.log((await estimateMint(parseAmount.usdc(1), 'USDC', 'agEUR')).toString());
  });

  it('estimateInverseMint', async () => {
    console.log((await estimateInverseMint(parseAmount.ether(1), 'USDC', 'agEUR')).toString());
  });

  // it('estimateBurn', async () => {
  //   console.log((await estimateBurn(parseAmount.ether(1), 'USDC', 'agEUR')).toString());
  // });

  it('estimateInverseBurn', async () => {
    console.log((await estimateInverseBurn(parseAmount.usdc(1), 'USDC', 'agEUR')).toString());
  });
});

describe('SLPs', () => {
  it('estimateDeposit', async () => {
    console.log((await estimateDeposit(parseAmount.usdc(1), 'USDC', 'agEUR')).toString());
  });

  it('estimateWithdraw', async () => {
    console.log((await estimateWithdraw(parseAmount.ether(1), 'USDC', 'agEUR')).toString());
  });
});

describe('HAs', () => {
  it('estimateOpenPerpetual', async () => {
    console.log((await estimateOpenPerpetual(parseAmount.usdc(1), 2, 'USDC', 'agEUR')).percentageFee.toString());
  });

  it('estimateClosePerpetual', async () => {
    console.log(
      (await estimateClosePerpetual(parseAmount.ether(1), parseAmount.ether(1), parseAmount.ether(1), 'USDC', 'agEUR')).toString()
    );
  });
});

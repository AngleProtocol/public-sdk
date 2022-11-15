import { utils } from 'ethers';

import { CONTRACTS_ADDRESSES } from '../src';

const checkAddress = (address: string) => {
  if (utils.isAddress(address) && utils.getAddress(address) !== address) {
    throw new Error(`Incorrect address: ${address} instead of ${utils.getAddress(address)}`);
  }
};

for (const a of Object.values(CONTRACTS_ADDRESSES)) {
  if (typeof a === 'string') {
    checkAddress(a);
  } else {
    for (const b of Object.values(a)) {
      if (typeof b === 'string') {
        checkAddress(b);
      } else {
        for (const c of Object.values(b)) {
          if (typeof c === 'string') {
            checkAddress(c);
          } else {
            for (const d of Object.values(c)) {
              if (typeof d === 'string') {
                checkAddress(d);
              }
            }
          }
        }
      }
    }
  }
}

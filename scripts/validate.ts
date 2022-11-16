import { utils } from 'ethers';

import { CONTRACTS_ADDRESSES } from '../src';

let error = false;

const checkAddress = (address: string) => {
  if (utils.isAddress(address) && utils.getAddress(address) !== address) {
    console.log(`Incorrect address: ${address} instead of ${utils.getAddress(address)}`);
    error = true;
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
              } else {
                for (const e of Object.values(d as any)) {
                  if (typeof e === 'string') {
                    checkAddress(e);
                  } else {
                    for (const f of Object.values(e as any)) {
                      if (typeof f === 'string') {
                        checkAddress(f);
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}

if (error) {
  throw 'Some address are not in the correct casing';
}

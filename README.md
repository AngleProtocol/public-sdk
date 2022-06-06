# <img src="logo.svg" alt="Angle SDK" height="40px"> Angle SDK

- [Angle SDK](#angle-sdk)
- [Warning:](#warning)
- [Estimators](#estimators)
  - [Example:](#example)
- [Ethereum Read & Write](#ethereum-read--write)
  - [Example:](#example-1)
- [Keeper functions](#keeper-functions)
- [Constants](#constants)
- [Lib](#lib)
- [Tests](#tests)
  - [Build and use in development enviroment](#build-and-use-in-development-enviroment)

SDK to build applications on top of [Angle Protocol](https://angle.money).

## Warning

This SDK is in open beta, and is constantly under development. USE AT YOUR OWN RISK.

Please make sure you're using the last SDK version, otherwise the results / addresses may be incorrect.

## Estimators

Estimators are utility functions to preview the result of Angle's operations.

```js
import { estimateMint, parseAmount } from '@angleprotocol/sdk';
// To compute the amount of stablecoin you'd get from a mint

const stablecoinsObtained = await estimateMint(parseAmount.usdc(1), 'USDC', 'agEUR');
console.log(stablecoinsObtained);
```

## Ethereum Read & Write

Located in the `calls` folder, these functions are example of scripted interactions with Angle Protocol's contracts.

```js
import { ethers } from 'ethers';

import { ChainId, harvest } from '@angleprotocol/sdk';
// To harvest a collateral strategy

const signer = // initialize an ethers signer

const receipt = await harvest(ChainId.MAINNET, 'agEUR', 'USDC', signer);
await receipt.wait();
```

## Keeper functions

Located in the `calls` folder, a set of functions that can be used to build keeper bots

## Constants

Located in the `constants` folder, all the contract addresses, parameters and abis

## Lib

Located in the `lib` folder, a set of classes and utilities that can be used to work with big numbers

## Tests

To run the test suite 2 env variables are needed:

- PROVIDER_URL: the api to push transactions.
- MNEMONIC: the mnemonic of a test wallet.

### Build and use in development enviroment

1. To properly generate the ABI types run `yarn generate-types-from-abis`.

2. To build the SDK run `yarn build`.

3. Once built, run `yarn link`. This will create a symbolic link to this package in your local yarn repositories.

4. To add the local package to your project, go in the root directory of your project (where you would typically run `yarn add ...`) and run `yarn link @angleprotocol/sdk`. _Notice that `@angleprotocol/sdk` is the name of the SDK project in its `package.json` file._

If you update the SDK you will have to rerun Step 1 but the linking to the newest version will be done automatically in the other projects (you do not need to rerun Steps 2 and 3)

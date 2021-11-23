/**
 * This file contains tests to make sur the call helpers are working.
 * To run it you'll need a signer and a mainnet fork.
 */

// import { expect } from 'chai';
// import { ethers } from 'hardhat';

// import { burn, ChainId, closePerpetual, deposit, harvest, mint, openPerpetual, updateUsersSLP, withdraw } from '../../src';

// describe('Keepers', () => {
//   it('Testing harvest', async () => {
//     const signer = (await ethers.getSigners())[0];

//     const receipt = await harvest(ChainId.MAINNET, 'USDC', 'agEUR', signer);
//     await receipt.wait();
//     expect(receipt.hash !== null).to.be.true;
//   });

//   it('Testing updateUserSLP', async () => {
//     const signer = (await ethers.getSigners())[0];

//     const receipt = await updateUsersSLP(ChainId.MAINNET, 'USDC', 'agEUR', signer);
//     await receipt.wait();
//     expect(receipt.hash !== null).to.be.true;
//   });
// });

// describe('Users', () => {
//   it('Testing mint', async () => {
//     const signer = (await ethers.getSigners())[0];

//     const receipt = await mint(ChainId.MAINNET, 'USDC', 'agEUR', signer, 1000000);
//     await receipt.wait();
//     expect(receipt.hash !== null).to.be.true;
//   });

//   it('Testing burn', async () => {
//     const signer = (await ethers.getSigners())[0];

//     const receipt = await burn(ChainId.MAINNET, 'USDC', 'agEUR', signer, 1000000);
//     await receipt.wait();
//     expect(receipt.hash !== null).to.be.true;
//   });
// });

// describe('SLPs', () => {
//   it('Testing deposit', async () => {
//     const signer = (await ethers.getSigners())[0];

//     const receipt = await deposit(ChainId.MAINNET, 'USDC', 'agEUR', signer, 1000000);
//     await receipt.wait();
//     expect(receipt.hash !== null).to.be.true;
//   });

//   it('Testing withdraw', async () => {
//     const signer = (await ethers.getSigners())[0];

//     const receipt = await withdraw(ChainId.MAINNET, 'USDC', 'agEUR', signer, 1000000);
//     await receipt.wait();
//     expect(receipt.hash !== null).to.be.true;
//   });
// });

// describe('HAs', () => {
//   it('Testing openPerp', async () => {
//     const signer = (await ethers.getSigners())[0];

//     const receipt = await openPerpetual(ChainId.MAINNET, 'USDC', 'agEUR', signer, 1000000, 1000000, 1, 1);
//     await receipt.wait();
//     expect(receipt.hash !== null).to.be.true;
//   });

//   it('Testing closePerp', async () => {
//     const signer = (await ethers.getSigners())[0];

//     const receipt = await closePerpetual(ChainId.MAINNET, 'USDC', 'agEUR', signer, 1, 0);
//     await receipt.wait();
//     expect(receipt.hash !== null).to.be.true;
//   });
// });

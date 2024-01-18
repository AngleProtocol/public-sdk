import { ContractsRegistryType } from '../contracts';

const addresses: ContractsRegistryType['1'] = {
  agEUR: {
    AgToken: '0x1a7e4e63778B4f12a199C062f3eFdD288afCBce8',
    bridges: {
      LayerZero: '0x12f31B73D812C6Bb0d735a218c086d44D5fe5f89',
    },
    Treasury: '0xf1dDcACA7D17f8030Ab2eb54f2D9811365EFe123',
  },
  agUSD: {
    AgToken: '0x0000206329b97DB379d5E1Bf586BbDB969C63274',
    bridges: {
      LayerZero: '0x07C89CC845D046aEad377DddC61114AA9D920Ac0',
    },
    Savings: '0x0022228a2cc5E7eF0274A7Baa600d44da5aB5776',
    Treasury: '0x840b25c87B626a259CA5AC32124fA752F0230a72',
  },
  CoreBorrow: '0x4b1E2c2762667331Bc91648052F646d1b0d35984',
  Governor: '0x7D47A94Bc2eA9f6A65aD7a46CF454d6F2b676CFb',
  Guardian: '0x007475B60d88B02663D6f975927b70BB4335e4b3',
  AngleLabs: '0x65e043c894F15A899FD18d454BeeAd577e792B81',
  ProxyAdmin: '0x1D941EF0D3Bba4ad67DBfBCeE5262F4CEE53A32b',
  ProxyAdminGuardian: '0x007475B60d88B02663D6f975927b70BB4335e4b3',
  Merkl: {
    CoreMerkl: '0x5adDc89785D75C86aB939E9e15bfBBb7Fc086A87',
    DistributionCreator: '0x8BB4C975Ff3c250e0ceEA271728547f3802B36Fd',
    Distributor: '0x3Ef3D8bA38EBe18DB133cEc108f4D14CE00Dd9Ae',
  },
  ProposalReceiver: '0x4A44f77978Daa3E92Eb3D97210bd11645cF935Ab',
  Timelock: '0xd23B51d6F2cB3eC7ca9599D4332a2F10C3CFDF85',
};

export default addresses;

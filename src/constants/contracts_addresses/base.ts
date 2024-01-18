import { ContractsRegistryType } from '../contracts';

const addresses: ContractsRegistryType['1'] = {
  agEUR: {
    AgToken: '0xA61BeB4A3d02decb01039e378237032B351125B4',
    bridges: {
      LayerZero: '0x2859a4eBcB58c8Dd5cAC1419C4F63A071b642B20',
    },
    Savings: '0x004626A008B1aCdC4c74ab51644093b155e59A23',
    Treasury: '0xFA5Ed56A203466CbBC2430a43c66b9D8723528E7',
  },
  agUSD: {
    AgToken: '0x0000206329b97DB379d5E1Bf586BbDB969C63274',
    bridges: {
      LayerZero: '0x1A42a30dCbA20A22b69C40098d89cB7304f429B9',
    },
    Savings: '0x0022228a2cc5E7eF0274A7Baa600d44da5aB5776',
    Treasury: '0xdD6A0A00fE3353e813F3B3864694D55D2a7cE11C',
  },
  CoreBorrow: '0x4b1E2c2762667331Bc91648052F646d1b0d35984',
  Governor: '0x7DF37fc774843b678f586D55483819605228a0ae',
  Guardian: '0xe4BB74804edf5280c9203f034036f7CB15196078',
  AngleLabs: '0x19c41F6607b2C0e80E84BaadaF886b17565F278e',
  ProxyAdmin: '0x31429d1856aD1377A8A0079410B297e1a9e214c2',
  ProxyAdminGuardian: '0x1D941EF0D3Bba4ad67DBfBCeE5262F4CEE53A32b',
  Merkl: {
    CoreMerkl: '0xC16B81Af351BA9e64C1a069E3Ab18c244A1E3049',
    DistributionCreator: '0x8BB4C975Ff3c250e0ceEA271728547f3802B36Fd',
    Distributor: '0x3Ef3D8bA38EBe18DB133cEc108f4D14CE00Dd9Ae',
    CampaignCreator: '0xd31D6E964f96b38b8E324212fC423B6b4E52e20b',
    CampaignDistributor: '0x9b3C71EdeB2E965d043e546d01323690a3101Dc6',
  },
  ProposalReceiver: '0x892bf71463Bd9fa57f3c2266aB74dbe1B96DECEa',
  Timelock: '0xf868da244C17CF0E288AE4A92c8636f072A7BaE3',
};

export default addresses;

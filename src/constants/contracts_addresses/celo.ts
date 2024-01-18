import { ContractsRegistryType } from '../contracts';

const addresses: ContractsRegistryType['1'] = {
  agEUR: {
    AgToken: '0xC16B81Af351BA9e64C1a069E3Ab18c244A1E3049',
    bridges: {
      LayerZero: '0xf1dDcACA7D17f8030Ab2eb54f2D9811365EFe123',
    },
    Savings: '0x004626A008B1aCdC4c74ab51644093b155e59A23',
    Treasury: '0xA61BeB4A3d02decb01039e378237032B351125B4',
  },
  agUSD: {
    AgToken: '0x0000206329b97DB379d5E1Bf586BbDB969C63274',
    bridges: {
      LayerZero: '0xdD6A0A00fE3353e813F3B3864694D55D2a7cE11C',
    },
    Savings: '0x0022228a2cc5E7eF0274A7Baa600d44da5aB5776',
    Treasury: '0x029F049C59A6b56610a34ba01d0d28E26ed407A8',
  },
  CoreBorrow: '0x59153e939c5b4721543251ff3049Ea04c755373B',
  Governor: '0x2ba5a55DBDAD03023e6872A8D57c458E9399bFE1',
  Guardian: '0x434153aA505959BCD5aAa7c17445EB8d835086f5',
  ProxyAdmin: '0x5183f032bf42109cD370B9559FD22207e432301E',
  ProxyAdminGuardian: '0x9a5b060Bd7b8f86c4C0D720a17367729670AfB19',
  ProposalReceiver: '0x456F478A7210E0Dc35eD67A5FEC1d86CdCdABd6B',
  Timelock: '0x9b3C71EdeB2E965d043e546d01323690a3101Dc6',
};

export default addresses;

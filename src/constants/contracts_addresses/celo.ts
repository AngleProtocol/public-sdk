import { ContractsRegistryType } from '../contracts';

const addresses: ContractsRegistryType['1'] = {
  agEUR: {
    AgToken: '0xC16B81Af351BA9e64C1a069E3Ab18c244A1E3049',
    bridges: {
      LayerZero: '0xf1dDcACA7D17f8030Ab2eb54f2D9811365EFe123',
    },
    Treasury: '0xA61BeB4A3d02decb01039e378237032B351125B4',
  },
  CoreBorrow: '0x59153e939c5b4721543251ff3049Ea04c755373B',
  Governor: '0x2ba5a55DBDAD03023e6872A8D57c458E9399bFE1',
  Guardian: '0x434153aA505959BCD5aAa7c17445EB8d835086f5',
  ProxyAdmin: '0x5183f032bf42109cD370B9559FD22207e432301E',
  ProxyAdminGuardian: '0x9a5b060Bd7b8f86c4C0D720a17367729670AfB19',
};

export default addresses;

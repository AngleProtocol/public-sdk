import { ContractsRegistryType } from '../contracts';

const addresses: ContractsRegistryType['1'] = {
  agEUR: {
    AgToken: '0xA61BeB4A3d02decb01039e378237032B351125B4',
    bridges: {
      LayerZero: '0x2859a4eBcB58c8Dd5cAC1419C4F63A071b642B20',
    },
    Treasury: '0xFA5Ed56A203466CbBC2430a43c66b9D8723528E7',
  },
  CoreBorrow: '0x4b1E2c2762667331Bc91648052F646d1b0d35984',
  Governor: '0x2a42Aeec7519883713272ec10FE44461a2Dfe354',
  Guardian: '0x10DeF8a92c51C8082087356186a1485301078DCd',
  ProxyAdmin: '0x1D941EF0D3Bba4ad67DBfBCeE5262F4CEE53A32b',
  ProxyAdminGuardian: '0x31429d1856aD1377A8A0079410B297e1a9e214c2',
};

export default addresses;

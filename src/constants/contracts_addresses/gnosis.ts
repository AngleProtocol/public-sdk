import { ContractsRegistryType } from '../contracts';

const addresses: ContractsRegistryType['1'] = {
  agEUR: {
    AgToken: '0x4b1E2c2762667331Bc91648052F646d1b0d35984',
    bridges: {
      LayerZero: '0xFA5Ed56A203466CbBC2430a43c66b9D8723528E7',
    },
    Savings: '0x004626A008B1aCdC4c74ab51644093b155e59A23',
    Treasury: '0x5adDc89785D75C86aB939E9e15bfBBb7Fc086A87',
  },
  AngleRouterV2: '0xB8C1350C2FdBE2F652c6869C5cD48268D0b732a7',
  CoreBorrow: '0x3E399AE5B4D8bc0021e53b51c8BCdD66DD62c03b',
  Governor: '0x0F70EeD1Bb51d5eDB1a2E46142638df959bAFD69',
  Guardian: '0xf0A31faec2B4fC6396c65B1aF1F6A71E653f11F0',
  ProxyAdmin: '0x9a5b060Bd7b8f86c4C0D720a17367729670AfB19',
  ProxyAdminGuardian: '0x2101F65A51d545CD51896160230bcc6A360a6671',
};

export default addresses;

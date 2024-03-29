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
  ANGLE: '0xE09E56C778d24859aa12a731c430921Ed811d38A',
  AngleGovernor: '0xf18303E2Dd58Cf29cad655B3bD2e1Cc4582C6A16',
  ProposalSender: '0x2AAaE852a35332BBA4abAd69bbf9B256b683624c',
  veANGLE: '0x606b609456289176ba80272e57F0BaA9782864b7',
  veANGLEDelegation: '0xD622c71aba9060F393FEC67D3e2B9335292bf23B',
  Timelock: '0xF929345E5A5Ac2f86c7a5802c1CE4aa46f524b28',
  AngleRouterV2: '0xB8C1350C2FdBE2F652c6869C5cD48268D0b732a7',
  CoreBorrow: '0x3E399AE5B4D8bc0021e53b51c8BCdD66DD62c03b',
  Governor: '0x0F70EeD1Bb51d5eDB1a2E46142638df959bAFD69',
  Guardian: '0xf0A31faec2B4fC6396c65B1aF1F6A71E653f11F0',
  ProxyAdmin: '0x9a5b060Bd7b8f86c4C0D720a17367729670AfB19',
  ProxyAdminGuardian: '0x2101F65A51d545CD51896160230bcc6A360a6671',
};

export default addresses;

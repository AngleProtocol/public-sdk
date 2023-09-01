import { ContractsRegistryType } from '../contracts';

const addresses: ContractsRegistryType['1'] = {
  ANGLE: '0x5EE94c25e3d5113CD055537340B9d19CFA4D9217',
  AngleHelpers: '0x431dC3341f401451B3b42420d2571AE09E0234a0',
  bridges: {
    LayerZero: '0xC011882d0f7672D8942e7fE2248C174eeD640c8f',
  },
  AngleRouterV2: '0xf530b844fb797D2C6863D56a94777C3e411CEc86',
  agEUR: {
    AgToken: '0xAEC8318a9a59bAEb39861d10ff6C7f7bf1F96C57',
    borrowCollaterals: {
      USDC: {
        Oracle: '0xd23B51d6F2cB3eC7ca9599D4332a2F10C3CFDF85',
        VaultManager: '0x65e4992250B296790c07FAdF0f0723902a07E91d',
      },
      wAVAX: {
        Oracle: '0xF664118E79C0B34f1Ed20e6606a0068d213839b9',
        VaultManager: '0xc4DF24680FE23AD109401A4a200DE3994AD3c564',
      },
    },
    bridges: {
      Anyswap: '0x6feFd97F328342a8A840546A55FDcfEe7542F9A8',
      LayerZero: '0x14C00080F97B9069ae3B4Eb506ee8a633f8F5434',
    },
    OracleTokenUSD: '0x192f2DBA961Bb0277520C082d6bfa87D5961333E',
    Savings: '0x004626A008B1aCdC4c74ab51644093b155e59A23',
    Swapper: '0x656B80B667a46869144047E6e6C0000C81610253',
    SwapperV2: '0x5e6955627e30660ecA4bCA2fB8Ac09e0DBEb63C1',
    Treasury: '0xa014A485D64efb236423004AB1a99C0aaa97a549',
  },
  ExternalStakings: [
    {
      tokenName: 'Pangolin agEUR/AVAX',
      stakingContractAddress: '',
      poolContractAddress: '0x4A045a80967B5ecc440c88dF9a15a3339d43D029',
    },
  ],
  CoreBorrow: '0xe9f183FC656656f1F17af1F2b0dF79b8fF9ad8eD',
  FlashAngle: '0x9C215206Da4bf108aE5aEEf9dA7caD3352A36Dad',
  Governor: '0x43a7947A1288e65fAF30D8dDb3ca61Eaabd41613',
  Guardian: '0xCcD44983f597aE4d4E2B70CF979597D63a10870D',
  Merkl: {
    CoreMerkl: '0x41F064e85e2558171711B90Cc95292D2f893F7f5',
    DistributionCreator: '0x8BB4C975Ff3c250e0ceEA271728547f3802B36Fd',
    Distributor: '0x3Ef3D8bA38EBe18DB133cEc108f4D14CE00Dd9Ae',
  },
  MulticallWithFailure: '0x03C2d2014795EE8cA78B62738433B457AB19F4b3',
  OracleNativeUSD: '0x0A77230d17318075983913bC2145DB16C7366156',
  ProxyAdmin: '0x7AB641E661a9728913A44e06f6a4879481142DDb',
  ProxyAdminGuardian: '0xb1F2A25fFB2b095E99f430cAF507cC31F9A3EaAB',
};

export default addresses;

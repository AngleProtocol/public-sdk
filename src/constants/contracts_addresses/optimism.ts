import { ContractsRegistryType } from '../contracts';

const addresses: ContractsRegistryType['1'] = {
  ANGLE: '0x58441E37255b09F9f545e9Dc957F1C41658ff665',
  AngleHelpers: '0x0331814f183d6A782E93E46810e76B5d21294B27',
  bridges: {
    LayerZero: '0x9201cC18965792808549566e6B06B016d915313A',
  },
  AngleRouter: '0x2859a4eBcB58c8Dd5cAC1419C4F63A071b642B20',
  AngleRouterV2: '0x658286Fc9605F6FF4d0311d0B58670e26eCB27e1',
  agEUR: {
    AgToken: '0x9485aca5bbBE1667AD97c7fE7C4531a624C8b1ED',
    borrowCollaterals: {
      OP: {
        Oracle: '0x5199ba2B0EE6cc970F42ab35BBEd3a265c542991',
        VaultManager: '0xcF5A2934fE43666C24823dfD455C617EDfF78bB6',
      },
      USDC: {
        Oracle: '0x5efE48F8383921d950683C46B87E28e21DEa9FB5',
        VaultManager: '0x16cd38b1B54E7abf307Cb2697E2D9321e843d5AA',
      },
      wETH: {
        Oracle: '0x62Cba6DcdAE5992d44CD9BD8989d27718eFF5F73',
        VaultManager: '0xAEC8318a9a59bAEb39861d10ff6C7f7bf1F96C57',
      },
    },
    bridges: {
      LayerZero: '0x840b25c87B626a259CA5AC32124fA752F0230a72',
    },
    OracleTokenUSD: '0x3626369857A10CcC6cc3A6e4f5C2f5984a519F20',
    Savings: '0x004626A008B1aCdC4c74ab51644093b155e59A23',
    Swapper: '0xa014A485D64efb236423004AB1a99C0aaa97a549',
    SwapperV2: '0x3f125ECD51181Af1f344aDF76E4271d2923707AB',
    Treasury: '0xe9f183FC656656f1F17af1F2b0dF79b8fF9ad8eD',
  },
  CoreBorrow: '0x1a7e4e63778B4f12a199C062f3eFdD288afCBce8',
  FlashAngle: '0xf1dDcACA7D17f8030Ab2eb54f2D9811365EFe123',
  Governor: '0x3245d3204EEB67afba7B0bA9143E8081365e08a6',
  Guardian: '0xD245678e417aEE2d91763F6f4eFE570FF52fD080',
  Merkl: {
    CoreMerkl: '0xc2c7a0d9a9e0467090281c3a4f28D40504d08FB4',
    DistributionCreator: '0x8BB4C975Ff3c250e0ceEA271728547f3802B36Fd',
    Distributor: '0x3Ef3D8bA38EBe18DB133cEc108f4D14CE00Dd9Ae',
  },
  MulticallWithFailure: '0x6cd24ac05103C2C911347a6D3628d64a9F07eAf5',
  OracleNativeUSD: '0x13e3Ee699D1909E989722E753853AE30b17e08c5',
  ProxyAdmin: '0xC16B81Af351BA9e64C1a069E3Ab18c244A1E3049',
  ProxyAdminGuardian: '0xe14bFA5575d9906BA35beb15C9DBe5C77bFdd5b5',
};

export default addresses;

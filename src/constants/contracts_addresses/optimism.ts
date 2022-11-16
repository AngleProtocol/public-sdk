import { ContractsRegistryType } from '../contracts';

const addresses: ContractsRegistryType['1'] = {
  ANGLE: '0x58441E37255b09F9f545e9Dc957F1C41658ff665',
  AngleHelpers: '0x0331814f183d6A782E93E46810e76B5d21294B27',
  bridges: {
    LayerZero: '0x9201cC18965792808549566e6B06B016d915313A',
  },
  AngleRouter: '0x2859a4eBcB58c8Dd5cAC1419C4F63A071b642B20',
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
      WETH: {
        Oracle: '0x62Cba6DcdAE5992d44CD9BD8989d27718eFF5F73',
        VaultManager: '0xAEC8318a9a59bAEb39861d10ff6C7f7bf1F96C57',
      },
    },
    bridges: {
      Synapse: '0xa0554607e477cdC9d0EE2A6b087F4b2DC2815C22',
      LayerZero: '0x840b25c87B626a259CA5AC32124fA752F0230a72',
    },
    Swapper: '0xa014A485D64efb236423004AB1a99C0aaa97a549',
    Treasury: '0xe9f183FC656656f1F17af1F2b0dF79b8fF9ad8eD',
  },
  CoreBorrow: '0x1a7e4e63778B4f12a199C062f3eFdD288afCBce8',
  FlashAngle: '0xf1dDcACA7D17f8030Ab2eb54f2D9811365EFe123',
  Governor: '0x3245d3204EEB67afba7B0bA9143E8081365e08a6',
  Guardian: '0xD245678e417aEE2d91763F6f4eFE570FF52fD080',
  MulticallWithFailure: '0x6cd24ac05103C2C911347a6D3628d64a9F07eAf5',
  ProxyAdmin: '0xC16B81Af351BA9e64C1a069E3Ab18c244A1E3049',
};

export default addresses;

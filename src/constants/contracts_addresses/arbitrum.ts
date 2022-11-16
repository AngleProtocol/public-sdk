import { ContractsRegistryType } from '../contracts';

const addresses: ContractsRegistryType['1'] = {
  ANGLE: '0x656B80B667a46869144047E6e6C0000C81610253',
  AngleHelpers: '0xdD6A0A00fE3353e813F3B3864694D55D2a7cE11C',
  bridges: {
    LayerZero: '0x366CEE609A64037a4910868c5b3cd62b9D019695',
  },
  AngleRouter: '0xC16B81Af351BA9e64C1a069E3Ab18c244A1E3049',
  agEUR: {
    AgToken: '0xFA5Ed56A203466CbBC2430a43c66b9D8723528E7',
    borrowCollaterals: {
      USDC: {
        Oracle: '0x9485aca5bbBE1667AD97c7fE7C4531a624C8b1ED',
        VaultManager: '0x04437e94Af860AfBb0429a7D36b9c00A5a5173b9',
      },
      WBTC: {
        Oracle: '0x2Fa1255383364F6e17Be6A6aC7A56C9aCD6850a3',
        VaultManager: '0xF664118E79C0B34f1Ed20e6606a0068d213839b9',
      },
      WETH: {
        Oracle: '0x7AB641E661a9728913A44e06f6a4879481142DDb',
        VaultManager: '0xe9f183FC656656f1F17af1F2b0dF79b8fF9ad8eD',
      },
    },
    bridges: {
      Synapse: '0x16BFc5fe024980124bEf51d1D792dC539d1B5Bf0',
      LayerZero: '0x16cd38b1B54E7abf307Cb2697E2D9321e843d5AA',
    },
    Swapper: '0x9C215206Da4bf108aE5aEEf9dA7caD3352A36Dad',
    Treasury: '0x0D710512E100C171139D2Cf5708f22C680eccF52',
  },
  CoreBorrow: '0x31429d1856aD1377A8A0079410B297e1a9e214c2',
  FlashAngle: '0x59153e939c5b4721543251ff3049Ea04c755373B',
  Governor: '0xAA2DaCCAb539649D1839772C625108674154df0B',
  Guardian: '0x55F01DDaE74b60e3c255BD2f619FEbdFce560a9C',
  MulticallWithFailure: '0x97B6897AAd7aBa3861c04C0e6388Fc02AF1F227f',
  ProxyAdmin: '0x9a5b060Bd7b8f86c4C0D720a17367729670AfB19',
};

export default addresses;

import { ContractsRegistryType } from '../contracts';

const addresses: ContractsRegistryType['1'] = {
  agEUR: {
    AgToken: '0x1a7e4e63778B4f12a199C062f3eFdD288afCBce8',
    bridges: {
      LayerZero: '0x4Fa745FCCC04555F2AFA8874cd23961636CdF982',
    },
    borrowCollaterals: {
      LUSD: {
        Oracle: '0xE37ff75D665066292D350fF4BCD2679fc1814cb3',
        VaultManager: '0x8E2277929B2D849c0c344043D9B9507982e6aDd0',
      },
      WBTC: {
        Oracle: '0xd23269834c450D4978968D1b118172385bB2348d',
        VaultManager: '0x241D7598BD1eb819c0E9dEd456AcB24acA623679',
      },
      WETH: {
        Oracle: '0xc0837E3EC218f1A768BE4207ba47Fb632915289a',
        VaultManager: '0x1beCE8193f8Dc2b170135Da9F1fA8b81C7aD18b1',
      },
      WSTETH: {
        Oracle: '0x885448f5fC6F636901cc0cc92ef7477aE132bAF0',
        VaultManager: '0x73aaf8694BA137a7537E7EF544fcf5E2475f227B',
      },
    },
    collaterals: {
      DAI: {
        FeeManager: '0xE6d9bD6796bDAF9B391Fac2A2D34bAE9c1c3c1C4',
        LiquidityGauge: '0x8E2c0CbDa6bA7B65dbcA333798A3949B07638026',
        Oracle: '0xb41A7CE1Def5a9557695C6Ca0B63fAF05F99daA5',
        PerpetualManager: '0xfc8f9eefC5FCe1D9dAcE2B0a11A1e184381787C4',
        PoolManager: '0xc9daabC677F3d1301006e723bD21C60be57a5915',
        SanToken: '0x7B8E89b0cE7BAC2cfEC92A371Da899eA8CBdb450',
        Staking: '0x65e4992250B296790c07FAdF0f0723902a07E91d',
        Strategies: {
          GenericOptimisedLender: {
            Contract: '0xFd04BcE2Cd25fC69f30813f0342Bf0C0B5e22461',
            GenericAave: '0xa30b7A2caC38c4AA10A607e76B1912c883A413a4',
            GenericCompound: '0x07D174dF93bC8e90709846a69D571afCf587f507',
          },
          AaveFlashloan: {
            Contract: '0x9fBbCB9e5399693cDeAE803d7e08938Bb6A847AA',
          },
        },
      },
      FEI: {
        FeeManager: '0x4A5E967100CA28566CB2A39216992C6dB57e95A4',
        LiquidityGauge: '0x7c0fF11bfbFA3cC2134Ce62034329a4505408924',
        Oracle: '0x236D9032d96226b900B0D557Ae6Fd202f3a26b6a',
        PerpetualManager: '0x98fDBC5497599eFF830923ea1EE152Adb9a4cEA5',
        PoolManager: '0x53b981389Cfc5dCDA2DC2e903147B5DD0E985F44',
        SanToken: '0x5d8D3Ac6D21C016f9C935030480B7057B21EC804',
        Staking: '0x3d7E670d105e8FBcAE3BF2bFC54324302cDb6aD5',
        Strategies: {
          GenericOptimisedLender: {
            Contract: '0xb46a42427e412869F1bd7B9b3a2b5E5856A8907e',
            GenericAave: '0xe2a58De0B3A8a1143d541935bf78F04a84fb6303',
          },
        },
      },
      FRAX: {
        FeeManager: '0x9c8438713cEa5466125f0331d9d875Ea43115bc9',
        LiquidityGauge: '0xb40432243E4F317cE287398e72Ab8f0312fc2FE8',
        Oracle: '0x98aa7123e524F7d60DaE238Bdd35ec53a654cf69',
        PerpetualManager: '0x4121a258674e507c990cDF390F74d4EF27592114',
        PoolManager: '0x6b4eE7352406707003bC6f6b96595FD35925af48',
        SanToken: '0xb3B209Bb213A5Da5B947C56f2C770b3E1015f1FE',
        Staking: '0xbB9485e2b9B0da40Db3874A144700e31bd9c40C2',
        Strategies: {
          GenericOptimisedLender: {
            Contract: '0x2D78B6f5Dc8985D90145F27C8f5A3782Eb9DeB2E',
            GenericAave: '0x00aFAEF24D5D6814DbE64Cb97da9B0eea37475B5',
            AaveConvexStaker: '0x9354f45b62c4217652053df752ae7ad2f9ff854a',
          },
        },
      },
      USDC: {
        FeeManager: '0x97B6897AAd7aBa3861c04C0e6388Fc02AF1F227f',
        LiquidityGauge: '0x51fE22abAF4a26631b2913E417c0560D547797a7',
        Oracle: '0xccaC05D378342B4717195d3436a4Cb083ca604bc',
        PerpetualManager: '0x5efE48F8383921d950683C46B87E28e21DEa9FB5',
        PoolManager: '0xe9f183FC656656f1F17af1F2b0dF79b8fF9ad8eD',
        SanToken: '0x9C215206Da4bf108aE5aEEf9dA7caD3352A36Dad',
        Staking: '0x2Fa1255383364F6e17Be6A6aC7A56C9aCD6850a3',
        Strategies: {
          GenericOptimisedLender: {
            Contract: '0x5fE0E497Ac676d8bA78598FC8016EBC1E6cE14a3',
            GenericAave: '0xbe67bb1aa7baCFC5D40d963D47E11e3d382a56Bd',
            GenericCompound: '0x6D7cCd6d3E4948579891f90e98C1bb09a8c677ea',
          },
          AaveFlashloan: {
            Contract: '0x1F847FD5E08Fb559A69280A14e7E904e6DBfF81f',
          },
        },
      },
      WETH: {
        FeeManager: '0x3C69835bc56cf4F356CdedE634415f847DaA4753',
        Oracle: '0xF7bE58afEa895c3Dde1dbe4CfdB5a815d990fE3c',
        PerpetualManager: '0xB924497a1157B1F8835c93cb7F3d4Aa6D2f227BA',
        PoolManager: '0x3f66867b4b6eCeBA0dBb6776be15619F73BC30A2',
        SanToken: '0x30c955906735e48D73080fD20CB488518A6333C8',
        Strategies: {
          StETH: '0x41A65AAE5d1C8437288d5a29B4D049897572758E',
        },
      },
    },
    StableMaster: '0x5adDc89785D75C86aB939E9e15bfBBb7Fc086A87',
    Staking: '0xb1F2A25fFB2b095E99f430cAF507cC31F9A3EaAB',
    Swapper: '0x4E4A605c1F2E3303e6967Cb6D3D964474Eb3C4Fd',
    Treasury: '0x8667DBEBf68B0BFa6Db54f550f41Be16c4067d60',
  },
  AMO: {
    AMOMinter: '0xec876Edc3F1a24c99d7c56F017E1D51581952F84',
    BPAMOs: {
      agEURvEUROC: {
        AMO: '0xC1e8Dba1cbF29f1CaA8343CAe96d5AdFD9bca736',
        KeeperJob: '0xaa8787423EA62F55d90A3D98E8b05F684A79e348',
      },
    },
  },
  ANGLE: '0x31429d1856aD1377A8A0079410B297e1a9e214c2',
  AngleHelpers: '0x1B17ac6B8371D63E030C5981891d5FBb3E4e068E',
  AngleDistributor: '0x4f91F01cE8ec07c9B1f6a82c18811848254917Ab',
  AngleRouter: '0xBB755240596530be0c1DE5DFD77ec6398471561d',
  // AngleRouterV2: '0x4579709627CA36BCe92f51ac975746f431890930',
  bridges: {
    LayerZero: '0x1056178977457A5F4BE33929520455A7d2E28670',
  },
  Core: '0x61ed74de9Ca5796cF2F8fD60D54160D47E30B7c3',
  CoreBorrow: '0x5bc6BEf80DA563EBf6Df6D6913513fa9A7ec89BE',
  FeeDistributor_sanUSDC_EUR: '0x7F82ff050128e29Fd89D85d01b93246F744E62A0',
  FlashAngle: '0x4A2FF9bC686A0A23DA13B6194C69939189506F7F',
  GaugeController: '0x9aD7e7b0877582E14c17702EecF49018DD6f2367',
  Governor: '0xdC4e6DFe07EFCa50a197DF15D9200883eF4Eb1c8',
  Guardian: '0x0C2553e4B9dFA9f83b1A6D3EAB96c4bAaB42d430',
  KeeperMulticall: '0xa0062b7A5e494d569059E2f1A98B5f6C99BFAAfe',
  KeeperRegistry: '0xc48B15492A4c4F48808576f6fCbC6dea9388E942',
  MerkleRootDistributor: '0x5a93D504604fB57E15b0d73733DDc86301Dde2f1',
  Middleman: '0x4B00103802Da5f51A9218010a1073Ea432165f13',
  MulticallWithFailure: '0xbd26A92D587981482B4Eec012d13fA0D55ca0135',
  ProxyAdmin: '0x1D941EF0D3Bba4ad67DBfBCeE5262F4CEE53A32b',
  ProxyAdminGuardian: '0xD9F1A8e00b0EEbeDddd9aFEaB55019D55fcec017',
  RewardsDistributor: '0xC06481fc1D0196C138770fD2148DCB306cB24E20',
  SmartWalletWhitelist: '0xAa241Ccd398feC742f463c534a610529dCC5888E',
  SurplusConverterSanTokens_EUR_USDC: '0x2E2063080A05FfdaA6D57f9358C2a5e1C65c70EC',
  SurplusConverterUniV3_IntraCollaterals: '0xD302484DC0fB3D50F60E1a2a82c882174aBC6eBe',
  Timelock: '0x5183f032bf42109cD370B9559FD22207e432301E',
  veANGLE: '0x0C462Dbb9EC8cD1630f1728B2CFD2769d09f0dd5',
  veBoostProxy: '0x52701bFA0599db6db2b2476075D9a2f4Cb77DAe3',
  ExternalStakings: [
    {
      tokenName: 'Gelato Uniswap agEUR/USDC LP',
      stakingContractAddress: '0xd97f480266B8c220929EFDF9B00d72E94Fa1f7d1',
      poolContractAddress: '0x2bD9F7974Bc0E4Cb19B8813F8Be6034F3E772add',
      liquidityGaugeAddress: '0xEB7547a8a734b6fdDBB8Ce0C314a9E6485100a3C',
    },
    {
      tokenName: 'Gelato Uniswap agEUR/wETH LP',
      stakingContractAddress: '0x7eE4A0F368681E4d97a8dBe78dBD756e097B6a76',
      poolContractAddress: '0x26C2251801D2cfb5461751c984Dc3eAA358bdf0f',
      liquidityGaugeAddress: '0x3785Ce82be62a342052b9E5431e9D3a839cfB581',
    },
    {
      tokenName: 'SushiSwap LP Token agEUR/ANGLE',
      stakingContractAddress: '0xA86CC1ae2D94C6ED2aB3bF68fB128c2825673267',
      poolContractAddress: '0x1f4c763BdE1D4832B3EA0640e66Da00B98831355',
      liquidityGaugeAddress: '0xBa625B318483516F7483DD2c4706aC92d44dBB2B',
    },
    {
      tokenName: 'Uniswap V2 agEUR/FEI',
      stakingContractAddress: '0xBcb307F590972B1C3188b7916d2969Cf75309dc6',
      poolContractAddress: '0xF89CE5eD65737dA8440411544b0499c9FaD323B2',
      liquidityGaugeAddress: '0xd6282C5aEAaD4d776B932451C44b8EB453E44244',
    },
    {
      tokenName: 'Curve.fi Factory Plain Pool: 3EURpool',
      stakingContractAddress: '0xf868da244C17CF0E288AE4A92c8636f072A7BaE3',
      poolContractAddress: '0xb9446c4Ef5EBE66268dA6700D26f96273DE3d571',
    },
  ],
  Gauges: [
    {
      gaugeName: 'Curve agEUR/ibEUR',
      gaugeAddress: '0xfdA462548Ce04282f4B6D6619823a7C64Fdc0185',
      type: 2,
    },
    {
      gaugeName: 'Curve 3EUR',
      gaugeAddress: '0x5EB715d601C2F27f83Cb554b6B36e047822fB70a',
      type: 2,
    },
    {
      gaugeName: 'Quickswap agEUR/USDC',
      gaugeAddress: '0x4EA4C5ca64A3950E53c61d0616DAF92727119093',
      type: 2,
    },
    {
      gaugeName: 'Convex Bribes',
      gaugeAddress: '0x957c66E97870e42301081217fBB1Aac45bc4eb4D',
      type: 2,
    },
    {
      gaugeName: 'Pangolin agEUR/AVAX',
      gaugeAddress: '0x9b8308742A0Faefbd7d39F7073eA07a328551eD4',
      type: 2,
    },
  ],
};

export default addresses;

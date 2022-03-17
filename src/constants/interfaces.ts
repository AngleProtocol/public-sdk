import {
  AgToken__factory,
  ANGLE__factory,
  AngleDistributor__factory,
  AngleRouter__factory,
  BaseSurplusConverter__factory,
  Core__factory,
  Erc20__factory,
  Erc20Bytes32__factory,
  FeeDistributor__factory,
  FeeManager__factory,
  GaugeController__factory,
  GenericCompound__factory,
  Governor__factory,
  Guardian__factory,
  LiquidityGaugeV4__factory,
  OneInchAggregatorV4__factory,
  OracleMulti__factory,
  PerpetualManagerFront__factory,
  PoolManager__factory,
  ProxyAdmin__factory,
  RewardsDistributor__factory,
  SanToken__factory,
  StableMasterFront__factory,
  StakingRewards__factory,
  Strategy__factory,
  SurplusConverterSanTokens__factory,
  SurplusConverterUniV3__factory,
  Timelock__factory,
  VeANGLE__factory,
  VeBoostProxy__factory,
  Weth__factory,
} from './types';

export const ERC20_Interface = Erc20__factory.createInterface();
export const ERC20_BYTES32_Interface = Erc20Bytes32__factory.createInterface();

export const AgToken_Interface = AgToken__factory.createInterface();
export const AngleDistributor_Interface = AngleDistributor__factory.createInterface();
export const ProxyAdmin_Interface = ProxyAdmin__factory.createInterface();
export const Core_Interface = Core__factory.createInterface();
export const GenericCompound_Interface = GenericCompound__factory.createInterface();
export const OracleMulti_Interface = OracleMulti__factory.createInterface();
export const Perpetual_Manager_Interface = PerpetualManagerFront__factory.createInterface();
export const StableMasterFront_Interface = StableMasterFront__factory.createInterface();
export const PoolManager_Interface = PoolManager__factory.createInterface();
export const StakingRewards_Interface = StakingRewards__factory.createInterface();
export const RewardsDistributor_Interface = RewardsDistributor__factory.createInterface();
export const SanToken_Interface = SanToken__factory.createInterface();
export const Strategy_Interface = Strategy__factory.createInterface();
export const FeeManager_Interface = FeeManager__factory.createInterface();

export const BaseSurplusConverter_Interface = BaseSurplusConverter__factory.createInterface();
export const SurplusConverterSanTokens_Interface = SurplusConverterSanTokens__factory.createInterface();
export const SurplusConverterUniV3_Interface = SurplusConverterUniV3__factory.createInterface();
export const FeeDistributor_Interface = FeeDistributor__factory.createInterface();
export const GaugeController_Interface = GaugeController__factory.createInterface();
export const LiquidityGaugeV4_Interface = LiquidityGaugeV4__factory.createInterface();
export const veANGLE_Interface = VeANGLE__factory.createInterface();
export const veBoostProxy_Interface = VeBoostProxy__factory.createInterface();

export const AngleRouter_Interface = AngleRouter__factory.createInterface();
export const OneInchAggregatorV4_Interface = OneInchAggregatorV4__factory.createInterface();

export const AgToken_Abi = AgToken__factory.abi;
export const ERC20_Abi = Erc20__factory.abi;
export const WETH_Abi = Weth__factory.abi;
export const FeeManager_Abi = FeeManager__factory.abi;
export const GenericCompound_Abi = GenericCompound__factory.abi;
export const Strategy_Abi = Strategy__factory.abi;
export const SanToken_Abi = SanToken__factory.abi;
export const Staking_Abi = StakingRewards__factory.abi;
export const RewardsDistributor_Abi = RewardsDistributor__factory.abi;
export const StableMasterFront_Abi = StableMasterFront__factory.abi;
export const PerpetualManagerFront_Abi = PerpetualManagerFront__factory.abi;
export const PoolManager_Abi = PoolManager__factory.abi;

export const ANGLE_Interface = ANGLE__factory.createInterface();
export const Guardian_Interface = Guardian__factory.createInterface();
export const Governor_Interface = Governor__factory.createInterface();
export const Timelock_Interface = Timelock__factory.createInterface();

export const AngleDistributor_Abi = AngleDistributor__factory.abi;
export const BaseSurplusConverter_Abi = BaseSurplusConverter__factory.abi;
export const SurplusConverterSanTokens_Abi = SurplusConverterSanTokens__factory.abi;
export const SurplusConverterUniV3_Abi = SurplusConverterUniV3__factory.abi;
export const FeeDistributor_Abi = FeeDistributor__factory.abi;
export const GaugeController_Abi = GaugeController__factory.abi;
export const LiquidityGaugeV4_Abi = LiquidityGaugeV4__factory.abi;
export const veBoostProxy_Abi = VeBoostProxy__factory.abi;

export const ANGLE_Abi = ANGLE__factory.abi;
export const Guardian_Abi = Guardian__factory.abi;
export const Governor_Abi = Governor__factory.abi;
export const Timelock_Abi = Timelock__factory.abi;
export const veANGLE_Abi = VeANGLE__factory.abi;

export const AngleRouter_Abi = AngleRouter__factory.abi;
export const OneInchAggregatorV4 = OneInchAggregatorV4__factory.abi;

export * from './types';

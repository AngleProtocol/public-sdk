import {
  ANGLE__factory,
  AngleDistributor__factory,
  Erc20__factory,
  Erc20Bytes32__factory,
  FeeManager,
  FeeManager__factory,
  Governor__factory,
  Oracle__factory,
  PerpetualManagerFront,
  PerpetualManagerFront__factory,
  PoolManager,
  PoolManager__factory,
  ProxyAdmin__factory,
  RewardsDistributor,
  RewardsDistributor__factory,
  StableMasterFront,
  StableMasterFront__factory,
  StakingRewards,
  StakingRewards__factory,
  Strategy,
  Strategy__factory,
  Timelock__factory,
  Weth__factory,
} from './types';

export const ERC20_Interface = Erc20__factory.createInterface();
export const ERC20_BYTES32_Interface = Erc20Bytes32__factory.createInterface();

export const AngleDistributor_Interface = AngleDistributor__factory.createInterface();
export const ProxyAdmin_Interface = ProxyAdmin__factory.createInterface();
export const Oracle_Interface = Oracle__factory.createInterface();
export const Perpetual_Manager_Interface = PerpetualManagerFront__factory.createInterface();
export const StableMasterFront_Interface = StableMasterFront__factory.createInterface();
export const PoolManager_Interface = PoolManager__factory.createInterface();
export const StakingRewards_Interface = StakingRewards__factory.createInterface();
export const RewardsDistributor_Interface = RewardsDistributor__factory.createInterface();
export const Strategy_Interface = Strategy__factory.createInterface();
export const FeeManager_Interface = FeeManager__factory.createInterface();

export const ERC20_Abi = Erc20__factory.abi;
export const WETH_Abi = Weth__factory.abi;
export const FeeManager_Abi = FeeManager__factory.abi;
export const Strategy_Abi = Strategy__factory.abi;
export const Staking_Abi = StakingRewards__factory.abi;
export const RewardsDistributor_Abi = RewardsDistributor__factory.abi;
export const StableMasterFront_Abi = StableMasterFront__factory.abi;
export const PerpetualManagerFront_Abi = PerpetualManagerFront__factory.abi;
export const PoolManager_Abi = PoolManager__factory.abi;

export const ANGLE_Interface = ANGLE__factory.createInterface();
export const Governor_Interface = Governor__factory.createInterface();
export const Timelock_Interface = Timelock__factory.createInterface();

export const ANGLE_Abi = ANGLE__factory.abi;
export const Governor_Abi = Governor__factory.abi;
export const Timelock_Abi = Timelock__factory.abi;

export { FeeManager, PerpetualManagerFront, PoolManager, RewardsDistributor, StableMasterFront, StakingRewards, Strategy };

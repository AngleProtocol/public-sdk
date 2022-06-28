import { BigNumber } from 'ethers';

export type MockOracleType = {
  inDecimals: BigNumber;
  rate: BigNumber;
};

export type OracleChainlinkMultiType = {
  pairs: string[];
  multipliers: number[];
  inBase: BigNumber;
  stalePeriod: number;
};

export type OracleChainlinkSingleType = {
  pair: string;
  multiplier: number;
  inBase: BigNumber;
  stalePeriod: number;
};

export type OracleMultiType = {
  chainlinkPairs: string[];
  uniswapTokens: string[];
  uniswapPoolFees: number[];
  twapPeriod: number;
  observationLength: number;
  uniFinalCurrency: number;
  chainlinkIsMultiplied: number[];
  stalePeriod: number;
};

export type OracleType = {
  type: 'MockOracle' | 'OracleChainlinkMulti' | 'OracleMulti' | 'OracleChainlinkSingle';
  inName: string;
  outName: string;
  params: MockOracleType | OracleChainlinkMultiType | OracleMultiType | OracleChainlinkSingleType;
};

export type LenderStrategyMultipleType = {
  pathComp: string;
  pathAave: string;
};

export type LenderStrategyType = {
  path: string;
};

export type StrategyType = {
  type: 'MockStrategy' | 'Strategy' | 'StrategyStETH';
  debtRatio: BigNumber;
  params: LenderStrategyType | LenderStrategyMultipleType;
};

export type GaugeType = {
  weigth: BigNumber;
  name: string;
};

export type DistributorType = {
  initialRate: BigNumber;
  startEpochSupply: BigNumber;
};

export type LiquidityGaugeType = {
  type: BigNumber;
  weigth: BigNumber;
  name: string;
};

export type StakingType = {
  type: 'HA' | 'SLP' | 'User';
  duration: BigNumber;
  incentiveAmount: BigNumber;
  updateFrequency: BigNumber;
  amountToDistribute: BigNumber;
  rewardDuration: BigNumber;
  santoken?: string;
};

export type PoolParameters = {
  decimals: number;

  xFeeMint: BigNumber[];
  yFeeMint: BigNumber[];

  xFeeBurn: BigNumber[];
  yFeeBurn: BigNumber[];

  xHAFeesDeposit: BigNumber[];
  yHAFeesDeposit: BigNumber[];

  haBonusMalusDeposit: BigNumber;
  haBonusMalusWithdraw: BigNumber;

  xHAFeesWithdraw: BigNumber[];
  yHAFeesWithdraw: BigNumber[];

  xSlippage: BigNumber[];
  ySlippage: BigNumber[];
  xSlippageFee: BigNumber[];
  ySlippageFee: BigNumber[];

  haFeeDeposit: BigNumber;
  haFeeWithdraw: BigNumber;

  xBonusMalusMint: BigNumber[];
  yBonusMalusMint: BigNumber[];
  xBonusMalusBurn: BigNumber[];
  yBonusMalusBurn: BigNumber[];

  xKeeperFeesClosing: BigNumber[];
  yKeeperFeesClosing: BigNumber[];

  maxInterestsDistributed: BigNumber;

  feesForSLPs: BigNumber;
  interestsForSLPs: BigNumber;
  interestsForSurplus: BigNumber;

  capOnStableMinted: BigNumber;

  limitHAHedge: BigNumber;
  targetHAHedge: BigNumber;
  maxLeverage: BigNumber;
  maintenanceMargin: BigNumber;
  keeperFeesLiquidationRatio: BigNumber;
  lockTime: BigNumber;

  keeperFeesLiquidationCap: BigNumber;
  keeperFeesClosingCap: BigNumber;

  strategies: StrategyType[];
  stakings: StakingType[];

  currencyDigits: number;
  nbrStakingToken: number;
};

export type PoolsParameters = { [stableName: string]: { [collateralName: string]: PoolParameters } };

export type FlashLoanParameters = {
  maxBorrowable: BigNumber;
  flashLoanFee: BigNumber;
};

export type VaultManagerParameters = {
  collateral: string; // Collateral Address
  symbol: string;
  oracle: string; // Oracle Name
  params: {
    debtCeiling: BigNumber;
    collateralFactor: BigNumber;
    targetHealthFactor: BigNumber;
    borrowFee: BigNumber;
    repayFee: BigNumber;
    interestRate: BigNumber;
    liquidationSurcharge: BigNumber;
    maxLiquidationDiscount: BigNumber;
    whitelistingActivated: boolean;
    baseBoost: BigNumber;
  };
};

export type BridgeParameters = {
  name: string;
  token: string;
  params: {
    fees: BigNumber;
    limit: BigNumber;
    hourlyLimit: BigNumber;
  };
};

export type StableParameters = {
  stakings?: StakingType[];
  currencySymbol: string;
  flashloan?: FlashLoanParameters;
  vaultManagers?: VaultManagerParameters[];
  bridges?: BridgeParameters[];
};

export type StablesParameters = { [stableName: string]: StableParameters };

export type GlobalParameters = {
  oracles: OracleType[];
};

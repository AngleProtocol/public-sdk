import { BigNumber } from 'ethers';

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
    dust?: BigNumber;
    dustLiquidation?: BigNumber;
    dustCollateral?: BigNumber;
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
  currencySymbol: string;
  flashloan?: FlashLoanParameters;
  vaultManagers?: VaultManagerParameters[];
  bridges?: BridgeParameters[];
};

export type StablesParameters = { [stableName: string]: StableParameters };

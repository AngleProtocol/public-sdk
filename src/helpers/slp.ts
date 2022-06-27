import { BigNumber, BigNumberish } from 'ethers';

import constants from '../constants';
import { piecewiseFunction } from '../utils/bignumber';
import { computeCollateralRatio } from './feeManager';

type EstimateSlippageReturn = {
  slippage: BigNumber;
  slippageFee: BigNumber;
};

export type CollatRatioParams = {
  agTokensMinted: BigNumber;
  amountInProtocol: BigNumber[];
  inDecimals: BigNumberish[];
  rates: BigNumber[];
  base?: BigNumber;
};

/**
 * Used by SLPs to estimate the slippage they would face for a given collateral ratio
 *
 * @param chainId - chainId of the network targeted
 * @param stableSymbol - Symbol of the stablecoin targeted
 * @param collateralSymbol - Symbol of the collateral targeted
 * @param collatRatio - Collateral ratio
 * @param callRatioParams - Parameters used to compute the collateral ratio. See: {@link computeCollateralRatio} and {@link CollatRatioParams}
 * @param xSlippage - Array of values when the slippage changes, based on the collateral ratio
 * @param ySlippage - Array of values the slippage values, based on xSlippage
 * @param xSlippageFee - Array of values when the slippage fee changes, based on the collateral ratio. Sleepage fee is the portion of the fee that is not given back to the SLP
 * @param ySlippageFee - Array of values the slippage values, based on xSlippageFee
 *
 * @returns The slippage and slippageFee computed values
 */
export function estimateSlippage(
  chainID: number,
  stableSymbol: string,
  collateralSymbol: string,
  collatRatio?: BigNumberish,
  callRatioParams?: CollatRatioParams,
  _xSlippage: BigNumberish[] = constants(chainID).poolsParameters![stableSymbol][collateralSymbol].xSlippage,
  _ySlippage: BigNumberish[] = constants(chainID).poolsParameters![stableSymbol][collateralSymbol].ySlippage,
  _xSlippageFee: BigNumberish[] = constants(chainID).poolsParameters![stableSymbol][collateralSymbol].xSlippageFee,
  _ySlippageFee: BigNumberish[] = constants(chainID).poolsParameters![stableSymbol][collateralSymbol].ySlippageFee
): EstimateSlippageReturn {
  if (!collatRatio && callRatioParams !== undefined)
    collatRatio = computeCollateralRatio(
      callRatioParams.agTokensMinted,
      callRatioParams.amountInProtocol,
      callRatioParams.inDecimals,
      callRatioParams.rates,
      callRatioParams.base
    );

  collatRatio = BigNumber.from(collatRatio!);

  const xSlippage_ = _xSlippage.map((v) => BigNumber.from(v));
  const ySlippage_ = _ySlippage.map((v) => BigNumber.from(v));
  const xSlippageFee_ = _xSlippageFee.map((v) => BigNumber.from(v));
  const ySlippageFee_ = _ySlippageFee.map((v) => BigNumber.from(v));

  // Computing the fees based on the collateral ratio
  const slippage = piecewiseFunction(collatRatio!, xSlippage_, ySlippage_);
  const slippageFee = piecewiseFunction(collatRatio!, xSlippageFee_, ySlippageFee_);

  return { slippage, slippageFee };
}

/**
 * Get the amount of collateral received by an SLP when she decides to withdraw her funds
 *
 * @param chainId - chainId of the network targeted
 * @param stableSymbol - Symbol of the stablecoin targeted
 * @param collateralSymbol - Symbol of the collateral targeted
 * @param sanTokensAmount - Amount of sanTokens the SLP currently has
 * @param sanRate - Current sanRate
 * @param collatRatio - Collateral ratio
 * @param callRatioParams - Parameters used to compute the collateral ratio. See: {@link computeCollateralRatio} and {@link CollatRatioParams}
 *
 * @returns The value of the collateral she will be receiving
 */
export function simulateWithdraw(
  chainID: number,
  stableSymbol: string,
  collateralSymbol: string,
  sanTokensAmount: BigNumberish,
  sanRate: BigNumberish,
  collatRatio?: BigNumberish,
  callRatioParams?: CollatRatioParams
): BigNumber {
  const cons = constants(chainID);
  const { slippage } = estimateSlippage(chainID, stableSymbol, collateralSymbol, collatRatio, callRatioParams);
  const withdrawAmount = cons.BASE_PARAMS.sub(slippage).mul(sanTokensAmount).mul(sanRate).div(cons.BASE_TOKENS.mul(cons.BASE_PARAMS));
  return withdrawAmount;
}

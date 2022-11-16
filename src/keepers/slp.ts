import { Contract, providers, utils, Wallet } from 'ethers';

import { ALL_TOKENS, PoolManager, PoolManager__factory, registry, Strategy, Strategy__factory } from '../constants';
import { AssetType, ChainId } from '../types';
import { Logger } from './logger';

type ColleteralContract = {
  strategy: string;
  poolManager: string;
  collateralDecimals: number;
};

export function getStrategies(chainId: ChainId): ColleteralContract[] {
  const stablesSymbols = Object.values(ALL_TOKENS[chainId][AssetType.STABLE]).map((token) => token.symbol);

  const strategyContracts = stablesSymbols.reduce((acc, stableSymbol) => {
    const collaterals = registry(chainId, { stablecoin: stableSymbol })?.collaterals;
    if (!!collaterals) {
      for (const collateral of Object.values(collaterals)) {
        if (collateral.PoolManager) {
          const collateralToken = Object.values(ALL_TOKENS[chainId][AssetType.COLLATERAL]).filter(
            (token) => token.symbol === collateral
          )[0];
          if (collateral.Strategies) {
            for (const strat of Object.values(collateral.Strategies)) {
              if (typeof strat === 'string') {
                acc.push({
                  strategy: strat,
                  poolManager: collateral.PoolManager,
                  collateralDecimals: collateralToken.decimals,
                });
              } else {
                acc.push({
                  strategy: strat.Contract as string,
                  poolManager: collateral.PoolManager,
                  collateralDecimals: collateralToken.decimals,
                });
              }
            }
          }
        }
      }
    }

    return acc;
  }, [] as ColleteralContract[]);

  Logger('strategies', strategyContracts);
  return strategyContracts;
}

/**
 * Calls the harvest() function of a Strategy. A Provider and a Signer are needed to execute the call
 * The address of the Strategy contract, the address of the PoolManager and the decimals of the collateral need to be passed as parameters
 *
 * @param contract - `{ strategy(string), poolManager(string), collateralDecimals(number) }`
 * @param provider - Ethers provider
 * @param signer - Ethers signer
 * @param chainId - ChainId of the network
 */
// eslint-disable-next-line
export async function harvest(contract: ColleteralContract, provider: providers.JsonRpcProvider, signer: Wallet, chainId: ChainId) {
  const strategyContract = new Contract(contract.strategy, Strategy__factory.createInterface(), provider) as Strategy;
  const poolManagerContract = new Contract(contract.poolManager, PoolManager__factory.createInterface(), provider) as PoolManager;
  const creditAvailable = await poolManagerContract.creditAvailable();

  const harvestTrigger = await strategyContract.harvestTrigger();
  Logger('harvestTrigger', harvestTrigger);

  // const poolTotalAssets = await poolManagerContract.getTotalAsset();
  // const poolBalance = await poolManagerContract.getBalance();
  // const debtRatio = poolTotalAssets.sub(poolBalance);
  // const { BASE_PARAMS } = constants(chainId);
  // && debtRatio.gt(utils.parseUnits('0,2', BASE_PARAMS))
  if (harvestTrigger && creditAvailable.gt(utils.parseUnits('500000', contract.collateralDecimals))) {
    await strategyContract.connect(signer).harvest();
  }
}

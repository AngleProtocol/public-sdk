import { Contract, providers, utils, Wallet } from 'ethers';

import { ALL_TOKENS, AngleContractsStableType, CONTRACTS_ADDRESSES, Interfaces, StableTokens } from '../constants';
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
    const agToken = CONTRACTS_ADDRESSES[chainId][stableSymbol as typeof StableTokens[number]] as AngleContractsStableType;

    for (const collateral in agToken.collaterals) {
      const collateralContract = agToken.collaterals[collateral];
      if (collateralContract.PoolManager) {
        const collateralToken = Object.values(ALL_TOKENS[chainId][AssetType.COLLATERAL]).filter((token) => token.symbol === collateral)[0];
        if (collateralContract.Strategy) {
          acc.push({
            strategy: collateralContract.Strategy,
            poolManager: collateralContract.PoolManager,
            collateralDecimals: collateralToken.decimals,
          });
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
export async function harvest(contract: ColleteralContract, provider: providers.JsonRpcProvider, signer: Wallet, chainId: ChainId) {
  const strategyContract = new Contract(contract.strategy, Interfaces.Strategy_Interface, provider) as Interfaces.Strategy;
  const poolManagerContract = new Contract(contract.poolManager, Interfaces.PoolManager_Interface, provider) as Interfaces.PoolManager;
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

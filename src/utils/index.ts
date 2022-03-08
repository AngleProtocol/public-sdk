import { ALL_TOKENS, AssetType, ChainId } from '../index';
import { Token } from '../types';

export const requireEnvVars = <T extends string>(vars: T[]): Record<typeof vars[number], string> => {
  const missingEnvVars = vars.filter((v) => !process.env[v]);
  if (missingEnvVars.length) {
    throw new Error(`Missing env vars: ${missingEnvVars.join(', ')}`);
  }

  return vars.reduce((acc, envVar) => {
    acc[envVar] = process.env[envVar] as string;
    return acc;
  }, {} as Record<typeof vars[number], string>);
};

export function parseStable(stablecoin: string): Token {
  let stable;
  for (const token of Object.values(ALL_TOKENS[ChainId.MAINNET][AssetType.STABLE])) {
    if (token.symbol === stablecoin || token.address === stablecoin || token.name === stablecoin || token.symbol === 'ag' + stablecoin) {
      stable = token;
    }
  }
  if (stable === undefined) throw 'Incorrect stablecoin value';

  return stable;
}

export function parseCollat(collateral: string): Token {
  let collat;
  for (const token of Object.values(ALL_TOKENS[ChainId.MAINNET][AssetType.COLLATERAL])) {
    if (token.symbol === collateral || token.address === collateral || token.name === collateral) {
      collat = token;
    }
  }
  if (collat === undefined) throw 'Incorrect collateral value';

  return collat;
}

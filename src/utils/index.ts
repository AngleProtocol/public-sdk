import { BigNumberish } from 'ethers';
import { formatUnits } from 'ethers/lib/utils';

export * from './merkl';
export * from './thegraph';

export function BN2Number(bn: BigNumberish, base = 18) {
  return parseFloat(formatUnits(bn, base));
}

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

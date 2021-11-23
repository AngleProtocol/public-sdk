import { constants } from 'ethers';

import { AssetType, ChainId, Token } from '../types';
import { CONTRACTS_ADDRESSES, StableTokens } from './contracts';

// TODO: replace all "constants.AddressZero"

const listStables = (chainId: ChainId) => {
  return Object.keys(CONTRACTS_ADDRESSES[chainId])
    .filter((key) => key.substr(0, 2) === 'ag')
    .map((key) => {
      const contractAddress = CONTRACTS_ADDRESSES[chainId][key as typeof StableTokens[number]]?.AgToken;
      if (contractAddress) return { key: key, contractAddress: contractAddress };
      return { key: '', contractAddress: '' };
    })
    .filter((obj) => {
      return !!obj.key && !!obj.contractAddress;
    })
    .map((obj: { key: string; contractAddress: string }) => {
      return new Token(chainId, obj.contractAddress, 18, obj.key, `Angle ${obj.key.slice(2)}`, true);
    });
};

type TokenDict = {
  [tokenAddress: string]: Token;
};
type AllTokens = Readonly<{
  [chainId in ChainId]: Readonly<{
    [AssetType.STABLE]: Readonly<TokenDict>;
    [AssetType.COLLATERAL]: Readonly<TokenDict>;
    [AssetType.EXTERNAL_STAKING]: Readonly<TokenDict>;
    [AssetType.ANGLE]: Token;
  }>;
}>;
const arrayOfTokensToTokenDict = (arr: Token[]): TokenDict => {
  return arr.reduce<TokenDict>((acc, token) => {
    return {
      ...acc,
      [token.address.toLowerCase()]: token,
    };
  }, {});
};

export const ALL_TOKENS: AllTokens = {
  [ChainId.MAINNET]: {
    [AssetType.STABLE]: arrayOfTokensToTokenDict(listStables(ChainId.MAINNET)),
    [AssetType.COLLATERAL]: arrayOfTokensToTokenDict([
      new Token(ChainId.MAINNET, '0x6B175474E89094C44Da98b954EedeAC495271d0F', 18, 'DAI', 'Dai Stablecoin'),
      new Token(ChainId.MAINNET, '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', 6, 'USDC', 'USD Coin'),
      new Token(ChainId.MAINNET, '0x956f47f50a910163d8bf957cf5846d573e7f87ca', 18, 'FEI', 'FEI USD'),
      new Token(ChainId.MAINNET, '0x853d955acef822db058eb8505911ed77f175b99e', 18, 'FRAX', 'FRAX'),
    ]),
    // TODO: add addresses for mainnet
    [AssetType.EXTERNAL_STAKING]: arrayOfTokensToTokenDict([
      new Token(ChainId.MAINNET, '0x2bD9F7974Bc0E4Cb19B8813F8Be6034F3E772add', 18, 'G-Uni agEUR/USDC', 'Gelato Uniswap agEUR/USDC LP'),
      new Token(ChainId.MAINNET, '0x1f4c763bde1d4832b3ea0640e66da00b98831355', 18, 'SLP agEUR/ANGLE', 'Sushiswap LP agEUR/ANGLE'),
      new Token(ChainId.MAINNET, '0xb9446c4Ef5EBE66268dA6700D26f96273DE3d571', 18, '3EURpool-f', 'Curve.fi Factory Plain Pool: 3EURpool'),
      new Token(ChainId.MAINNET, '0xF89CE5eD65737dA8440411544b0499c9FaD323B2', 18, 'UNI-V2 agEUR/FEI', 'Uniswap V2 agEUR/FEI'),
    ]),
    [AssetType.ANGLE]: new Token(
      ChainId.MAINNET,
      CONTRACTS_ADDRESSES[ChainId.MAINNET].ANGLE ?? constants.AddressZero,
      18,
      'ANGLE',
      'Angle Governance Token'
    ),
  },
  [ChainId.RINKEBY]: {
    [AssetType.STABLE]: arrayOfTokensToTokenDict(listStables(ChainId.RINKEBY)),
    [AssetType.COLLATERAL]: arrayOfTokensToTokenDict([
      new Token(ChainId.RINKEBY, '0x5592EC0cfb4dbc12D3aB100b257153436a1f0FEa', 18, 'DAI', 'Dai Stablecoin'),
      new Token(ChainId.RINKEBY, '0x4DBCdF9B62e891a7cec5A2568C3F4FAF9E8Abe2b', 6, 'USDC', 'USD Coin'),
      new Token(ChainId.RINKEBY, '0xc778417E063141139Fce010982780140Aa0cD5Ab', 18, 'WETH', 'Wrapped Ether'),
      new Token(ChainId.RINKEBY, '0x577d296678535e4903d59a4c929b718e1d575e0a', 8, 'WBTC', 'Wrapped Bitcoin'),
    ]),
    [AssetType.EXTERNAL_STAKING]: arrayOfTokensToTokenDict([
      // TODO: change to correct token
      new Token(ChainId.RINKEBY, '0xbf7a7169562078c96f0ec1a8afd6ae50f12e5a99', 18, 'BAT', 'Basic Attention Token'),
    ]),
    [AssetType.ANGLE]: new Token(
      ChainId.RINKEBY,
      CONTRACTS_ADDRESSES[ChainId.RINKEBY].ANGLE ?? constants.AddressZero,
      18,
      'ANGLE',
      'Angle Governance Token'
    ),
  },
  [ChainId.LOCAL]: {
    [AssetType.STABLE]: arrayOfTokensToTokenDict(listStables(ChainId.LOCAL)),
    [AssetType.COLLATERAL]: arrayOfTokensToTokenDict([
      new Token(ChainId.LOCAL, '0x6B175474E89094C44Da98b954EedeAC495271d0F', 18, 'DAI', 'Dai Stablecoin'),
      // new Token(ChainId.LOCAL, '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', 6, 'USDC', 'USD Coin'),
    ]),
    [AssetType.EXTERNAL_STAKING]: {},
    [AssetType.ANGLE]: new Token(
      ChainId.LOCAL,
      CONTRACTS_ADDRESSES[ChainId.LOCAL].ANGLE ?? constants.AddressZero,
      18,
      'ANGLE',
      'Angle Governance Token'
    ),
  },
};

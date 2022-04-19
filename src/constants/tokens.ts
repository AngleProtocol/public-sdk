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
      new Token(ChainId.MAINNET, '0x956f47f50a910163d8bf957cf5846d573e7f87ca', 18, 'FEI', 'Fei USD'),
      new Token(ChainId.MAINNET, '0x853d955acef822db058eb8505911ed77f175b99e', 18, 'FRAX', 'FRAX'),
    ]),
    // TODO: add addresses for mainnet
    [AssetType.EXTERNAL_STAKING]: arrayOfTokensToTokenDict([
      new Token(
        ChainId.MAINNET,
        '0x2bD9F7974Bc0E4Cb19B8813F8Be6034F3E772add',
        18,
        'G-Uni agEUR/USDC old',
        'Gelato Uniswap agEUR/USDC LP old'
      ),
      new Token(ChainId.MAINNET, '0xEDECB43233549c51CC3268b5dE840239787AD56c', 18, 'G-Uni agEUR/USDC', 'Gelato Uniswap agEUR/USDC LP'),
      new Token(ChainId.MAINNET, '0x26C2251801D2cfb5461751c984Dc3eAA358bdf0f', 18, 'G-Uni agEUR/wETH', 'Gelato Uniswap agEUR/wETH LP'),
      new Token(ChainId.MAINNET, '0x1f4c763bde1d4832b3ea0640e66da00b98831355', 18, 'SLP agEUR/ANGLE', 'SushiSwap LP agEUR/ANGLE'),
      new Token(ChainId.MAINNET, '0xb9446c4Ef5EBE66268dA6700D26f96273DE3d571', 18, '3EURpool-f', 'Curve.fi Factory Plain Pool: 3EURpool'),
      new Token(
        ChainId.MAINNET,
        '0xb37d6c07482bc11cd28a1f11f1a6ad7b66dec933',
        18,
        'ag+ib-EUR-f',
        'Curve.fi Factory Plain Pool:ag+ib-EUR-f'
      ),
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
  [ChainId.POLYGON]: {
    [AssetType.STABLE]: arrayOfTokensToTokenDict(listStables(ChainId.POLYGON)),
    [AssetType.COLLATERAL]: {},
    [AssetType.EXTERNAL_STAKING]: arrayOfTokensToTokenDict([
      new Token(ChainId.POLYGON, '0x82A54e66c05FCd555ADAE593848a4257C9e51AD9', 18, 'UNI-V2', 'Uniswap V2'), // Quickswap LP token
    ]),
    [AssetType.ANGLE]: new Token(
      ChainId.POLYGON,
      CONTRACTS_ADDRESSES[ChainId.POLYGON].ANGLE ?? constants.AddressZero,
      18,
      'ANGLE',
      'Angle Governance Token'
    ),
  },
  [ChainId.AVALANCHE]: {
    [AssetType.STABLE]: arrayOfTokensToTokenDict(listStables(ChainId.AVALANCHE)),
    [AssetType.COLLATERAL]: {},
    [AssetType.EXTERNAL_STAKING]: arrayOfTokensToTokenDict([]),
    [AssetType.ANGLE]: new Token(
      ChainId.AVALANCHE,
      CONTRACTS_ADDRESSES[ChainId.AVALANCHE].ANGLE ?? constants.AddressZero,
      18,
      'ANGLE',
      'Angle Governance Token'
    ),
  },
  [ChainId.FANTOM]: {
    [AssetType.STABLE]: arrayOfTokensToTokenDict(listStables(ChainId.FANTOM)),
    [AssetType.COLLATERAL]: {},
    [AssetType.EXTERNAL_STAKING]: arrayOfTokensToTokenDict([]),
    [AssetType.ANGLE]: new Token(
      ChainId.FANTOM,
      CONTRACTS_ADDRESSES[ChainId.FANTOM].ANGLE ?? constants.AddressZero,
      18,
      'ANGLE',
      'Angle Governance Token'
    ),
  },
  [ChainId.BSC]: {
    [AssetType.STABLE]: arrayOfTokensToTokenDict(listStables(ChainId.BSC)),
    [AssetType.COLLATERAL]: {},
    [AssetType.EXTERNAL_STAKING]: arrayOfTokensToTokenDict([]),
    [AssetType.ANGLE]: new Token(
      ChainId.BSC,
      CONTRACTS_ADDRESSES[ChainId.BSC].ANGLE ?? constants.AddressZero,
      18,
      'ANGLE',
      'Angle Governance Token'
    ),
  },
  [ChainId.AURORA]: {
    [AssetType.STABLE]: arrayOfTokensToTokenDict(listStables(ChainId.AURORA)),
    [AssetType.COLLATERAL]: {},
    [AssetType.EXTERNAL_STAKING]: arrayOfTokensToTokenDict([]),
    [AssetType.ANGLE]: new Token(
      ChainId.AURORA,
      CONTRACTS_ADDRESSES[ChainId.AURORA].ANGLE ?? constants.AddressZero,
      18,
      'ANGLE',
      'Angle Governance Token'
    ),
  },
  [ChainId.RINKEBY]: {
    [AssetType.STABLE]: arrayOfTokensToTokenDict(listStables(ChainId.RINKEBY)),
    [AssetType.COLLATERAL]: arrayOfTokensToTokenDict([
      new Token(ChainId.RINKEBY, '0xFafc4C0318F8758A17585767890Da43db1a560A5', 18, 'DAI', 'Dai Stablecoin'),
      new Token(ChainId.RINKEBY, '0x490Fb85babC4601Da0A6D7dd549082e7CF9745B0', 6, 'USDC', 'USD Coin'),
      new Token(ChainId.RINKEBY, '0x36831B2cc0371436A361fFC0EFd34bC0eCC33e2b', 18, 'WETH', 'Wrapped Ether'),
      new Token(ChainId.RINKEBY, '0x0e23236781A99ab9c9f1D6e4c1853597f3510768', 8, 'WBTC', 'Wrapped Bitcoin'),
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

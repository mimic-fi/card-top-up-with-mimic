export interface Token {
  symbol: string
  address: string
  decimals: number
}

export const TOKENS: Record<string, Record<string, Token>> = {
  ethereum: {
    USDC: {
      symbol: 'USDC',
      address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      decimals: 6,
    },
  },
  base: {
    USDC: {
      symbol: 'USDC',
      address: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
      decimals: 6,
    },
  },
  arbitrum: {
    USDC: {
      symbol: 'USDC',
      address: '0xaf88d065e77c8cc2239327c5edb3a432268e5831',
      decimals: 6,
    },
  },
  optimism: {
    USDC: {
      symbol: 'USDC',
      address: '0x0b2c639c533813f4aa9d7837caf62653d097ff85',
      decimals: 6,
    },
  },
  gnosis: {
    USDC: {
      symbol: 'USDC',
      address: '0xddafbb505ad214d7b80b1f830eb538421b995a0c',
      decimals: 6,
    },
  },
}

export interface Chain {
  id: number
  key: string
  name: string
  image?: string
}

export const CHAINS: Record<string, Chain> = {
  ethereum: {
    id: 1,
    key: 'ethereum',
    name: 'Ethereum',
  },
  base: {
    id: 8453,
    key: 'base',
    name: 'Base',
  },
  arbitrum: {
    id: 42161,
    key: 'arbitrum',
    name: 'Arbitrum',
  },
  optimism: {
    id: 10,
    key: 'optimism',
    name: 'Optimism',
  },
  gnosis: {
    id: 100,
    key: 'gnosis',
    name: 'Gnosis',
  },
}

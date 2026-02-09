const TOKENS_DICTIONARY: Record<string, { symbol: string; name: string; icon: string }> = {
  usdc: { symbol: 'USDC', name: 'USDC', icon: 'https://icons.llamao.fi/icons/protocols/usdc?w=48&h=48' },
  usdt: { symbol: 'USDT', name: 'Tether', icon: 'https://icons.llamao.fi/icons/protocols/tether?w=48&h=48' },
  dai: { symbol: 'DAI', name: 'Dai', icon: 'https://icons.llamao.fi/icons/protocols/dai?w=48&h=48' },
}

export type TokenKey = keyof typeof TOKENS_DICTIONARY

export type Token = (typeof TOKENS_DICTIONARY)[TokenKey] & { key: TokenKey }

export const TOKENS = (Object.keys(TOKENS_DICTIONARY) as TokenKey[]).reduce(
  (tokens, key) => {
    tokens[key] = { ...TOKENS_DICTIONARY[key], key }
    return tokens
  },
  {} as Record<TokenKey, Token>
)

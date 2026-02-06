'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { TOKENS, Token } from '@/lib/tokens'
import type { Chain } from '@/lib/chains'

interface TokenSelectorProps {
  chain: Chain
  value: Token
  onChange: (token: Token) => void
}

export function TokenSelector({ chain, value, onChange }: TokenSelectorProps) {
  const chainKey = chain.key

  return (
    <Select value={value.symbol} onValueChange={(tokenSymbol) => onChange(TOKENS[chainKey][tokenSymbol])}>
      <SelectTrigger className="w-full">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <div className="px-2 py-1.5">
          <p className="text-sm font-medium">{value.symbol}</p>
        </div>

        {Object.keys(TOKENS[chainKey]).map((tokenSymbol) => (
          <SelectItem key={tokenSymbol} value={tokenSymbol}>
            <span className="text-sm">{tokenSymbol}</span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

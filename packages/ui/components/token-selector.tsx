'use client'

import { TOKENS, type Token } from '@/lib/tokens'
import { Chain } from '@/lib/chains'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface TokenSelectorProps {
  value: Token
  onChange: (token: Token) => void
  chain: Chain
  disabled?: boolean
  label?: string
}

export function TokenSelector({
  value,
  onChange,
  chain,
  disabled = false,
  label = 'Token',
}: TokenSelectorProps) {
  const chainTokens = TOKENS[chain.key] || {}

  return (
    <div>
      <label className="text-sm font-medium text-foreground block mb-2">
        {label}
      </label>
      <Select
        value={value.symbol}
        onValueChange={(symbol) => {
          const token = chainTokens[symbol]
          if (token) onChange(token)
        }}
        disabled={disabled}
      >
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(chainTokens).map(([symbol, token]) => (
            <SelectItem key={symbol} value={symbol}>
              {symbol}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

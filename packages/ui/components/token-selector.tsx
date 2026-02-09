'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { TOKENS, Token, TokenKey } from '@/lib/tokens'

interface TokenSelectorProps {
  value: Token
  onChange: (token: Token) => void
}

export function TokenSelector({ value, onChange }: TokenSelectorProps) {
  return (
    <Select value={value.key} onValueChange={(tokenKey) => onChange(TOKENS[tokenKey as TokenKey])}>
      <SelectTrigger className="w-full h-12 bg-secondary/50 border-border">
        <SelectValue>
          <div className="flex items-center gap-2">
            <img src={value.icon} alt={value.symbol} className="w-6 h-6 rounded-full" />
            <span>{value.symbol}</span>
          </div>
        </SelectValue>
      </SelectTrigger>

      <SelectContent>
        {(Object.keys(TOKENS) as TokenKey[]).map((tokenKey) => (
          <SelectItem key={tokenKey} value={tokenKey}>
            <div className="flex items-center gap-2">
              <img src={TOKENS[tokenKey].icon} alt={TOKENS[tokenKey].symbol} className="w-6 h-6 rounded-full" />
              <span>{TOKENS[tokenKey].symbol}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

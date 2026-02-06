'use client'

import Image from 'next/image'
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

const tokenLogos: Record<string, string> = {
  USDC: '/tokens/usdc.png',
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
          <div className="flex items-center gap-2">
            <Image
              src={tokenLogos[value.symbol] || '/tokens/usdc.png'}
              alt={value.symbol}
              width={20}
              height={20}
              className="w-5 h-5"
            />
            <span>{value.symbol}</span>
          </div>
        </SelectTrigger>
        <SelectContent>
          {Object.entries(chainTokens).map(([symbol, token]) => (
            <SelectItem key={symbol} value={symbol}>
              <div className="flex items-center gap-2">
                <Image
                  src={tokenLogos[symbol] || '/tokens/usdc.png'}
                  alt={symbol}
                  width={20}
                  height={20}
                  className="w-5 h-5"
                />
                {symbol}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

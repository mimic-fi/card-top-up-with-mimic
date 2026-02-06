'use client'

import { CHAINS, type Chain } from '@/lib/chains'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface ChainSelectorProps {
  value: Chain
  onChange: (chain: Chain) => void
  disabled?: boolean
  label?: string
}

export function ChainSelector({
  value,
  onChange,
  disabled = false,
  label = 'Chain',
}: ChainSelectorProps) {
  return (
    <div>
      <label className="text-sm font-medium text-foreground block mb-2">
        {label}
      </label>
      <Select
        value={value.key}
        onValueChange={(key) => {
          const chain = Object.values(CHAINS).find((c) => c.key === key)
          if (chain) onChange(chain)
        }}
        disabled={disabled}
      >
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {Object.values(CHAINS).map((chain) => (
            <SelectItem key={chain.key} value={chain.key}>
              {chain.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

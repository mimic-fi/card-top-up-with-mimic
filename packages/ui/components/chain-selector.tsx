'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CHAINS, Chain, ChainKey } from '@/lib/chains'

interface ChainSelectorProps {
  value: Chain
  onChange: (chain: Chain) => void
}

export function ChainSelector({ value, onChange }: ChainSelectorProps) {
  return (
    <Select value={value.key} onValueChange={(chainKey) => onChange(CHAINS[chainKey as ChainKey])}>
      <SelectTrigger className="w-full">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <div className="px-2 py-1.5">
          <p className="text-sm font-medium">{value.name}</p>
        </div>

        {(Object.keys(CHAINS) as ChainKey[]).map((chainKey) => (
          <SelectItem key={chainKey} value={chainKey}>
            <span className="text-sm">{CHAINS[chainKey].name}</span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

'use client'

import Image from 'next/image'
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

const chainLogos: Record<string, string> = {
  ethereum: '/chains/ethereum.png',
  arbitrum: '/chains/arbitrum.png',
  optimism: '/chains/optimism.png',
  gnosis: '/chains/gnosis.png',
  base: '/chains/base.webp',
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
          <div className="flex items-center gap-2">
            <Image
              src={chainLogos[value.key] || '/chains/ethereum.png'}
              alt={value.name}
              width={20}
              height={20}
              className="w-5 h-5"
            />
            <span>{value.name}</span>
          </div>
        </SelectTrigger>
        <SelectContent>
          {Object.values(CHAINS).map((chain) => (
            <SelectItem key={chain.key} value={chain.key}>
              <div className="flex items-center gap-2">
                <Image
                  src={chainLogos[chain.key] || '/chains/ethereum.png'}
                  alt={chain.name}
                  width={20}
                  height={20}
                  className="w-5 h-5"
                />
                {chain.name}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

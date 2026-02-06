'use client'

import React from 'react'
import QueryClientProvider from './react-query'
import WalletProvider from './wagmi'
import { TooltipProvider } from '@/components/ui/tooltip'

export default function Providers({ children, cookies }: { children: React.ReactNode; cookies: string | null }) {
  return (
    <WalletProvider cookies={cookies}>
      <QueryClientProvider>
        <TooltipProvider>
          {children}
        </TooltipProvider>
      </QueryClientProvider>
    </WalletProvider>
  )
}

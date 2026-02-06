'use client'

import Image from 'next/image'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { injected } from 'wagmi/connectors'
import { Button } from '@/components/ui/button'

export function Header() {
  const { address, isConnected } = useAccount()
  const { connect } = useConnect()
  const { disconnect } = useDisconnect()

  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <Image src="/logo.svg" alt="Mimic" width={140} height={32} className="h-8 w-auto" />
          <div className="h-6 w-px bg-border"></div>
          <span className="text-sm font-semibold text-foreground tracking-wide">CARD TOP-UP</span>
        </div>
        <div>
          {isConnected ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">{address?.slice(0, 6)}...{address?.slice(-4)}</span>
              <Button onClick={() => disconnect()} variant="outline" size="sm">
                Disconnect
              </Button>
            </div>
          ) : (
            <Button onClick={() => connect({ connector: injected() })} size="sm">
              Connect Wallet
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}

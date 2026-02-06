'use client'

import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { injected } from 'wagmi/connectors'
import { Button } from '@/components/ui/button'

export function Header() {
  const { address, isConnected } = useAccount()
  const { connect } = useConnect()
  const { disconnect } = useDisconnect()

  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Card Top-Up</h1>
          <p className="text-sm text-muted-foreground">Automatic credit card top-ups powered by Mimic</p>
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

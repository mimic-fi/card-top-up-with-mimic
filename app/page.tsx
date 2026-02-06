'use client'

import { useAccount, useConnect } from 'wagmi'
import { injected } from 'wagmi/connectors'
import { useState } from 'react'

export default function Home() {
  const { address, isConnected } = useAccount()
  const { connect } = useConnect()
  const [threshold, setThreshold] = useState('')
  const [topUpOverThreshold, setTopUpOverThreshold] = useState('')

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto py-8 px-4 flex flex-col gap-8">
        {/* Header */}
        <div className="bg-card rounded-lg p-6 border border-border">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Mimic Card Top-Up</h1>
            <button
              onClick={() => connect({ connector: injected() })}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              {isConnected ? `${address?.slice(0, 6)}...${address?.slice(-4)}` : 'Connect Wallet'}
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="bg-card rounded-lg p-6 border border-border">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Set up your card top-up</h2>
            <button className="p-2 hover:bg-secondary rounded-md transition-colors">⚙️</button>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-2">Chain</label>
              <select className="w-full px-3 py-2 bg-secondary border border-border rounded-md text-foreground">
                <option>Base</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Token</label>
              <select className="w-full px-3 py-2 bg-secondary border border-border rounded-md text-foreground">
                <option>USDC</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-2">Target Limit (USD)</label>
              <input
                type="number"
                placeholder="100"
                value={threshold}
                onChange={(e) => setThreshold(e.target.value)}
                className="w-full px-3 py-2 bg-secondary border border-border rounded-md text-foreground placeholder:text-muted-foreground"
              />
              <p className="text-xs text-muted-foreground mt-2">Triggers top-up when balance falls below this amount</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Top-up Buffer (USD)</label>
              <input
                type="number"
                placeholder="50"
                value={topUpOverThreshold}
                onChange={(e) => setTopUpOverThreshold(e.target.value)}
                className="w-full px-3 py-2 bg-secondary border border-border rounded-md text-foreground placeholder:text-muted-foreground"
              />
              <p className="text-xs text-muted-foreground mt-2">Additional amount to top-up beyond the target limit</p>
            </div>
          </div>

          <button className="w-full px-4 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors font-medium">
            Activate top-up
          </button>

          <div className="mt-6 pt-6 border-t border-border text-center text-xs text-muted-foreground">
            Powered by <a href="https://mimic.fi" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Mimic</a>
          </div>
        </div>

        {/* History */}
        <div className="bg-card rounded-lg p-6 border border-border">
          <h2 className="text-lg font-semibold mb-4">Past Top-Ups</h2>
          <p className="text-muted-foreground text-sm">{isConnected ? 'No top-ups registered yet' : 'Please connect your wallet'}</p>
        </div>
      </div>
    </main>
  )
}

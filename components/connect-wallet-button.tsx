'use client'

import React from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount } from 'wagmi'
import type { Connector } from 'wagmi'

type Props = {
  className?: string
}

const WALLET_LOGOS: Record<string, string> = {
  metamask: 'https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg',
  walletconnect: 'https://walletconnect.org/walletconnect-logo.svg',
  coinbasewallet: 'https://avatars.githubusercontent.com/u/18732972',
  'io.rabby': 'https://avatars.githubusercontent.com/u/134722610',
  trustwallet: 'https://avatars.githubusercontent.com/u/11744586',
}

function normalizeConnectorKey(connector?: Connector | null): string | null {
  if (!connector) return null
  const candidates = [connector.type, connector.name, connector.id]
  for (const c of candidates) {
    if (!c) continue
    const key = String(c).replace(/\s+/g, '').toLowerCase()
    if (WALLET_LOGOS[key]) return key
  }
  return null
}

export function ConnectWalletButton({ className }: Props) {
  const { connector } = useAccount()

  return (
    <ConnectButton
      showBalance={false}
      chainStatus="icon"
      accountStatus={{
        smallScreen: 'avatar',
        largeScreen: 'full',
      }}
    />
  )
}

'use client'

import React from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'

export function ConnectWalletButton() {
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

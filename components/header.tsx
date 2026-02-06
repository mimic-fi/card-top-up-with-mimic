'use client'

import Image from 'next/image'
import { ConnectButton } from '@rainbow-me/rainbowkit'

export function Header() {
  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <Image src="/logo-white.svg" alt="Mimic" width={140} height={32} className="h-8 w-auto" />
          <div className="h-6 w-px bg-border"></div>
          <span className="text-sm font-semibold text-foreground tracking-wide">CARD TOP-UP</span>
        </div>
        <ConnectButton />
      </div>
    </header>
  )
}

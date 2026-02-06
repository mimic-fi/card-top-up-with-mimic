'use client'

import Image from 'next/image'
import { ConnectButton } from '@rainbow-me/rainbowkit'

export function Header() {
  return (
    <header className="w-full border-b border-border bg-card">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        <div className="flex items-center gap-4">
          <Image src="/logo-white.svg" alt="Mimic" width={140} height={32} className="h-8 w-auto" priority />
          <div className="h-6 w-px bg-border"></div>
          <span className="text-sm font-semibold text-foreground uppercase tracking-widest">Card Top-Up</span>
        </div>
        <div className="flex-shrink-0">
          <ConnectButton />
        </div>
      </div>
    </header>
  )
}

import Image from 'next/image'
import ConnectWalletButton from '@/components/ui/connect-wallet-button'

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 flex h-14 items-center justify-between">
        <div className="flex items-center gap-2">
          <Image src="/logo-white.svg" alt="Mimic" width={120} height={32} className="h-6 w-auto" priority />
          <span className="text-sm font-semibold ml-2">CARD TOP-UP</span>
        </div>
        <ConnectWalletButton />
      </div>
    </header>
  )
}

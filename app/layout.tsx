import type React from 'react'
import type { Metadata } from 'next'
import Providers from '@/providers/providers'
import { Toaster } from '@/components/ui/toaster'
import './globals.css'

interface Props {
  children: React.ReactNode
}

export const metadata: Metadata = {
  title: 'Mimic Card Top-Up',
  description: 'Card auto top-up app powered by Mimic',
}

export default function RootLayout({ children }: Props) {
  return (
    <html lang="en" className="dark">
      <body className="bg-background text-foreground antialiased">
        <Providers>{children}</Providers>
        <Toaster />
      </body>
    </html>
  )
}

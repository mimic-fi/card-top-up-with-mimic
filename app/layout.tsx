import type React from 'react'
import type { Metadata } from 'next'
import { headers } from 'next/headers'
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

export default async function RootLayout({ children }: Props) {
  const headersList = await headers()
  const cookies = headersList.get('cookie')

  return (
    <html lang="en">
      <body className="bg-background text-foreground antialiased">
        <Providers cookies={cookies}>{children}</Providers>
        <Toaster />
      </body>
    </html>
  )
}

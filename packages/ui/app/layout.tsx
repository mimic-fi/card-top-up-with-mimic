import type React from 'react'
import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { Geist, Geist_Mono } from 'next/font/google'
import { Toaster } from '@/components/ui/toaster'
import Providers from '@/providers/providers'
import './globals.css'

const _geist = Geist({ subsets: ['latin'] })
const _geistMono = Geist_Mono({ subsets: ['latin'] })

interface Props {
  children: React.ReactNode
}

export const metadata: Metadata = {
  title: 'Mimic Card Top-Up',
  description: 'Card auto top-up powered by Mimic',
  generator: 'v0.app',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    shortcut: ['/favicon.ico'],
  },
}

export default async function RootLayout({ children }: Props) {
  const headersList = await headers()
  const cookies = headersList.get('cookie')

  return (
    <html lang="en">
      <body className={`${_geist.variable} ${_geistMono.variable} font-sans`}>
        <Providers cookies={cookies}>{children}</Providers>
        <Toaster />
      </body>
    </html>
  )
}

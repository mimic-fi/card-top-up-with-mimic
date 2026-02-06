import type React from 'react'
import type { Metadata } from 'next'

interface Props {
  children: React.ReactNode
}

export const metadata: Metadata = {
  title: 'Mimic Card Top-Up',
  description: 'Card auto top-up app powered by Mimic',
}

export default function RootLayout({ children }: Props) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'sans-serif' }}>
        {children}
      </body>
    </html>
  )
}

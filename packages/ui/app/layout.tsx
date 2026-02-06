import type React from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Mimic Card Top-Up',
  description: 'Card auto top-up powered by Mimic',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}

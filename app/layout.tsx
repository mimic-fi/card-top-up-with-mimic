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
      <head>
        <style>{`
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          html, body {
            width: 100%;
            height: 100%;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
              'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
              sans-serif;
            background-color: #0f0f0f;
            color: #ffffff;
          }
        `}</style>
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}

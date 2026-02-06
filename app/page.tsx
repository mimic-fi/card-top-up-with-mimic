'use client'

import { Header } from '@/components/header'
import { Form } from '@/components/form'
import { History } from '@/components/history'

export default function Home() {
  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#fafafa' }}>
      <Header />
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          <div style={{ gridColumn: 'span 2' }}>
            <Form />
          </div>
          <div>
            <History />
          </div>
        </div>
      </div>
    </main>
  )
}

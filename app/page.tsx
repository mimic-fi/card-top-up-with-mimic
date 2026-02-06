'use client'

import { Header } from '@/components/header'
import { Form } from '@/components/form'
import { History } from '@/components/history'

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
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

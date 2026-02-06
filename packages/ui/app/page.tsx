'use client'
import { Form } from '@/components/form'
import { Header } from '@/components/header'
import { History } from '@/components/history'

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="flex flex-col gap-8 container mx-auto py-8 px-4">
        <Form />
        <History />
      </div>
    </main>
  )
}

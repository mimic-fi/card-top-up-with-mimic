'use client'

console.log('[v0] Page component rendering')

export default function Home() {
  console.log('[v0] Home component rendering')
  
  return (
    <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f5f5f5' }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#5B63FF', marginBottom: '1rem' }}>Card Top-Up</h1>
        <p style={{ fontSize: '1.125rem', color: '#666' }}>Testing render with inline styles...</p>
        <p style={{ fontSize: '0.875rem', color: '#999', marginTop: '2rem' }}>If you see this, the app is running!</p>
      </div>
    </main>
  )
}

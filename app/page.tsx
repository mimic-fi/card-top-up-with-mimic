'use client'

import { useState } from 'react'

export default function Home() {
  const [threshold, setThreshold] = useState('')
  const [topUpOverThreshold, setTopUpOverThreshold] = useState('')
  const [isConnected, setIsConnected] = useState(false)

  return (
    <main style={{ minHeight: '100vh', padding: '32px 16px', backgroundColor: '#0f0f0f', color: '#ffffff' }}>
      <div style={{ maxWidth: '960px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>
        <div style={{ backgroundColor: '#1a1a1a', borderRadius: '8px', padding: '24px', border: '1px solid #333' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: 0 }}>Mimic Card Top-Up</h1>
            <button
              onClick={() => setIsConnected(!isConnected)}
              style={{
                padding: '8px 16px',
                backgroundColor: '#0066cc',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              {isConnected ? '0x1234...5678' : 'Connect Wallet'}
            </button>
          </div>
        </div>

        <div style={{ backgroundColor: '#1a1a1a', borderRadius: '8px', padding: '24px', border: '1px solid #333' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', margin: 0 }}>Set up your card top-up</h2>
            <button style={{ padding: '8px', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', fontSize: '18px' }}>⚙️</button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>Chain</label>
              <select style={{ width: '100%', padding: '8px', backgroundColor: '#0f0f0f', border: '1px solid #333', borderRadius: '4px', color: '#fff' }}>
                <option>Base</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>Token</label>
              <select style={{ width: '100%', padding: '8px', backgroundColor: '#0f0f0f', border: '1px solid #333', borderRadius: '4px', color: '#fff' }}>
                <option>USDC</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>Target Limit (USD)</label>
              <input
                type="number"
                placeholder="100"
                value={threshold}
                onChange={(e) => setThreshold(e.target.value)}
                style={{ width: '100%', padding: '8px', backgroundColor: '#0f0f0f', border: '1px solid #333', borderRadius: '4px', color: '#fff' }}
              />
              <p style={{ fontSize: '12px', color: '#999', marginTop: '8px' }}>Triggers top-up when balance falls below this amount</p>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>Top-up Buffer (USD)</label>
              <input
                type="number"
                placeholder="50"
                value={topUpOverThreshold}
                onChange={(e) => setTopUpOverThreshold(e.target.value)}
                style={{ width: '100%', padding: '8px', backgroundColor: '#0f0f0f', border: '1px solid #333', borderRadius: '4px', color: '#fff' }}
              />
              <p style={{ fontSize: '12px', color: '#999', marginTop: '8px' }}>Additional amount to top-up beyond the target limit</p>
            </div>
          </div>

          <button style={{ width: '100%', padding: '12px', backgroundColor: '#0066cc', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px', fontWeight: '500' }}>
            Activate top-up
          </button>

          <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #333', textAlign: 'center', fontSize: '12px', color: '#999' }}>
            Powered by <a href="https://mimic.fi" target="_blank" rel="noopener noreferrer" style={{ color: '#0066cc', textDecoration: 'none' }}>Mimic</a>
          </div>
        </div>

        <div style={{ backgroundColor: '#1a1a1a', borderRadius: '8px', padding: '24px', border: '1px solid #333' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', margin: 0, paddingBottom: '16px' }}>Past Top-Ups</h2>
          <p style={{ color: '#999', fontSize: '14px', margin: 0 }}>{isConnected ? 'No top-ups registered yet' : 'Please connect your wallet'}</p>
        </div>
      </div>
    </main>
  )
}

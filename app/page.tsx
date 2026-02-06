'use client'

export default function Home() {
  return (
    <main style={{ minHeight: '100vh', background: '#f5f5f5', padding: '20px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ background: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>Mimic Card Top-Up</h1>
            <button style={{ padding: '8px 16px', background: '#f0f0f0', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              Connect Wallet
            </button>
          </div>
        </div>

        <div style={{ background: 'white', padding: '24px', borderRadius: '8px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', margin: 0 }}>Set up your card top-up</h2>
            <button style={{ padding: '4px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' }}>⚙️</button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>Chain</label>
              <select style={{ width: '100%', padding: '12px', border: '1px solid #e0e0e0', borderRadius: '4px' }}>
                <option>Base</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>Token</label>
              <select style={{ width: '100%', padding: '12px', border: '1px solid #e0e0e0', borderRadius: '4px' }}>
                <option>USDC</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>Target Limit (USD)</label>
              <input type="number" placeholder="100" style={{ width: '100%', padding: '12px', border: '1px solid #e0e0e0', borderRadius: '4px', boxSizing: 'border-box' }} />
              <p style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>Triggers top-up when balance falls below this amount</p>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>Top-up Buffer (USD)</label>
              <input type="number" placeholder="50" style={{ width: '100%', padding: '12px', border: '1px solid #e0e0e0', borderRadius: '4px', boxSizing: 'border-box' }} />
              <p style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>Additional amount to top-up beyond the target limit</p>
            </div>
          </div>

          <button style={{ width: '100%', padding: '12px', background: '#000', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '16px', fontWeight: '500', cursor: 'pointer' }}>
            Activate top-up
          </button>

          <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #e0e0e0', textAlign: 'center', fontSize: '12px', color: '#999' }}>
            Powered by <a href="https://mimic.fi" style={{ color: '#0066cc', textDecoration: 'none' }}>Mimic</a>
          </div>
        </div>

        <div style={{ background: 'white', padding: '24px', borderRadius: '8px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', margin: 0 }}>Past Top-Ups</h2>
          <p style={{ color: '#999', fontSize: '14px' }}>No top-ups registered yet</p>
        </div>
      </div>
    </main>
  )
}

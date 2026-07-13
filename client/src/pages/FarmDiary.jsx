import { useState } from 'react'

const entries = [
  { type: 'expense', icon: 'shopping_cart', label: 'Fertilizer Purchase', crop: 'Wheat', amount: 4200, date: 'Jul 5', color: '#ba1a1a' },
  { type: 'income', icon: 'payments', label: 'Wheat Sale - Mandi', crop: 'Wheat', amount: 28400, date: 'Jul 3', color: '#16a34a' },
  { type: 'expense', icon: 'water_drop', label: 'Irrigation Cost', crop: 'Rice', amount: 1800, date: 'Jul 1', color: '#ba1a1a' },
  { type: 'income', icon: 'payments', label: 'Rice Sale - Direct', crop: 'Rice', amount: 15600, date: 'Jun 28', color: '#16a34a' },
  { type: 'expense', icon: 'local_shipping', label: 'Transport to Mandi', crop: 'Cotton', amount: 900, date: 'Jun 25', color: '#ba1a1a' },
]

export default function FarmDiary() {
  const [activeTab, setActiveTab] = useState('all')
  const totalIncome = entries.filter(e => e.type === 'income').reduce((s, e) => s + e.amount, 0)
  const totalExpense = entries.filter(e => e.type === 'expense').reduce((s, e) => s + e.amount, 0)

  const filtered = activeTab === 'all' ? entries : entries.filter(e => e.type === activeTab)

  return (
    <div style={{ padding: 32, paddingBottom: 80 }}>
      <div style={{ marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <p style={{ fontFamily: 'Geist, monospace', fontSize: 11, fontWeight: 600, color: '#f97316', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Records & Finances</p>
          <h1 style={{ fontSize: 44, fontWeight: 700, color: '#251913', letterSpacing: '-0.02em' }}>Farm Diary</h1>
          <p style={{ fontSize: 16, color: '#584237', marginTop: 8 }}>Track income, expenses, and farm activities in one place.</p>
        </div>
        <button style={{
          display: 'flex', alignItems: 'center', gap: 8, padding: '14px 24px', borderRadius: 12,
          background: '#f97316', color: 'white', border: 'none', fontWeight: 700, fontSize: 14, cursor: 'pointer',
          boxShadow: '0 4px 14px rgba(249,115,22,0.3)', transition: 'all 0.2s ease',
        }}>
          <span className="material-symbols-outlined" style={{ fontSize: 20 }}>add</span>
          Add Entry
        </button>
      </div>

      {/* Summary Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'Total Income', value: `₹${totalIncome.toLocaleString()}`, icon: 'trending_up', color: '#16a34a', bg: 'rgba(22,163,74,0.1)' },
          { label: 'Total Expense', value: `₹${totalExpense.toLocaleString()}`, icon: 'trending_down', color: '#ba1a1a', bg: 'rgba(186,26,26,0.1)' },
          { label: 'Net Profit', value: `₹${(totalIncome - totalExpense).toLocaleString()}`, icon: 'account_balance_wallet', color: '#f97316', bg: 'rgba(249,115,22,0.1)' },
        ].map((stat, i) => (
          <div key={stat.label} className="glass-card" style={{ padding: 24, borderRadius: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: stat.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span className="material-symbols-outlined" style={{ color: stat.color, fontSize: 22 }}>{stat.icon}</span>
              </div>
              <p style={{ fontFamily: 'Geist, monospace', fontSize: 10, fontWeight: 600, color: '#584237', textTransform: 'uppercase', letterSpacing: '0.07em' }}>{stat.label}</p>
            </div>
            <div style={{ fontSize: 30, fontWeight: 700, color: stat.color, letterSpacing: '-0.02em' }}>{stat.value}</div>
            <div style={{ fontSize: 11, color: '#8c7164', marginTop: 4 }}>This month</div>
          </div>
        ))}
      </div>

      {/* Entries Table */}
      <div className="glass-card" style={{ borderRadius: 24, overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #e0c0b1', display: 'flex', gap: 8 }}>
          {[['all', 'All'], ['income', 'Income'], ['expense', 'Expenses']].map(([val, label]) => (
            <button key={val} onClick={() => setActiveTab(val)} style={{
              padding: '8px 18px', borderRadius: 999, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 700, fontFamily: 'Geist, monospace',
              background: activeTab === val ? '#f97316' : '#ffeae0',
              color: activeTab === val ? '#ffffff' : '#584237',
              transition: 'all 0.2s ease',
            }}>{label}</button>
          ))}
        </div>

        <div>
          {filtered.map((entry, i) => (
            <div key={i}
              style={{
                display: 'flex', alignItems: 'center', gap: 16, padding: '16px 24px',
                borderBottom: '1px solid rgba(224,192,177,0.3)', cursor: 'pointer', transition: 'background 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#fff8f6'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <div style={{ width: 44, height: 44, borderRadius: 12, background: entry.type === 'income' ? 'rgba(22,163,74,0.1)' : 'rgba(186,26,26,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span className="material-symbols-outlined" style={{ color: entry.color, fontSize: 22 }}>{entry.icon}</span>
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 600, color: '#251913', fontSize: 14 }}>{entry.label}</p>
                <p style={{ fontSize: 12, color: '#584237', marginTop: 2 }}>{entry.crop} · {entry.date}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: 18, fontWeight: 700, color: entry.color }}>
                  {entry.type === 'income' ? '+' : '-'}₹{entry.amount.toLocaleString()}
                </p>
                <span style={{
                  fontSize: 10, padding: '2px 8px', borderRadius: 4, fontFamily: 'Geist, monospace', fontWeight: 600,
                  background: entry.type === 'income' ? 'rgba(22,163,74,0.1)' : 'rgba(186,26,26,0.1)',
                  color: entry.color,
                }}>
                  {entry.type.toUpperCase()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

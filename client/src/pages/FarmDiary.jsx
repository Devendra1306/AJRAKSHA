import { useState, useEffect } from 'react'

export default function FarmDiary() {
  const [activeTab, setActiveTab] = useState('all')
  const [dbEntries, setDbEntries] = useState([])

  useEffect(() => {
    const fetchDiary = async () => {
      const token = localStorage.getItem('ajraksha_token');
      if (!token) return;
      try {
        const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';
        const response = await fetch(`${API_BASE_URL}/diary`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setDbEntries(data.entries || []);
        }
      } catch (err) {
        console.error('Failed to load farm diary:', err);
      }
    };
    fetchDiary();
  }, []);

  const entries = dbEntries.map(e => ({
    type: e.type,
    icon: e.type === 'income' ? 'payments' : e.type === 'expense' ? 'shopping_cart' : 'local_florist',
    label: e.description,
    crop: e.crop,
    amount: parseFloat(e.amount) || 0,
    date: new Date(e.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
    color: e.type === 'income' ? '#16a34a' : e.type === 'expense' ? '#ba1a1a' : '#f97316'
  }));

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
          {[['all', 'All'], ['income', 'Income'], ['expense', 'Expenses'], ['activity', 'Activities']].map(([val, label]) => (
            <button key={val} onClick={() => setActiveTab(val)} style={{
              padding: '8px 18px', borderRadius: 999, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 700, fontFamily: 'Geist, monospace',
              background: activeTab === val ? '#f97316' : '#ffeae0',
              color: activeTab === val ? '#ffffff' : '#584237',
              transition: 'all 0.2s ease',
            }}>{label}</button>
          ))}
        </div>

        <div>
          {filtered.length === 0 ? (
            <p style={{ fontSize: 14, color: '#8c7164', textAlign: 'center', padding: '48px 0' }}>No diary entries found.</p>
          ) : (
            filtered.map((entry, i) => (
              <div key={i}
                style={{
                  display: 'flex', alignItems: 'center', gap: 16, padding: '16px 24px',
                  borderBottom: '1px solid rgba(224,192,177,0.3)', cursor: 'pointer', transition: 'background 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#fff8f6'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <div style={{ width: 44, height: 44, borderRadius: 12, background: entry.type === 'income' ? 'rgba(22,163,74,0.1)' : entry.type === 'expense' ? 'rgba(186,26,26,0.1)' : 'rgba(249,115,22,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span className="material-symbols-outlined" style={{ color: entry.color, fontSize: 22 }}>{entry.icon}</span>
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 600, color: '#251913', fontSize: 14 }}>{entry.label}</p>
                  <p style={{ fontSize: 12, color: '#584237', marginTop: 2 }}>{entry.crop} · {entry.date}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  {entry.type !== 'activity' && (
                    <p style={{ fontSize: 18, fontWeight: 700, color: entry.color }}>
                      {entry.type === 'income' ? '+' : '-'}₹{entry.amount.toLocaleString()}
                    </p>
                  )}
                  <span style={{
                    fontSize: 10, padding: '2px 8px', borderRadius: 4, fontFamily: 'Geist, monospace', fontWeight: 600,
                    background: entry.type === 'income' ? 'rgba(22,163,74,0.1)' : entry.type === 'expense' ? 'rgba(186,26,26,0.1)' : 'rgba(249,115,22,0.1)',
                    color: entry.color,
                  }}>
                    {entry.type.toUpperCase()}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

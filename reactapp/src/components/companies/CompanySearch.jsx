import React, { useState, useEffect } from 'react';
import { getCompanies, searchCompanies } from '../../services/companyService';

export default function CompanySearch() {
  const [all, setAll] = useState([]);
  const [displayed, setDisplayed] = useState([]);
  const [topSearch, setTopSearch] = useState('');
  const [tableSearch, setTableSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    getCompanies()
      .then(res => {
        const data = Array.isArray(res.data) ? res.data : [];
        setAll(data);
        setDisplayed(data);
      })
      .catch(() => setDisplayed([]))
      .finally(() => setLoading(false));
  }, []);

  const handleTopSearch = async (e) => {
    e.preventDefault();
    if (!topSearch.trim()) { setDisplayed(all); return; }
    try {
      const res = await searchCompanies(topSearch.trim());
      setDisplayed(Array.isArray(res.data) ? res.data : []);
    } catch { setDisplayed([]); }
    setTableSearch('');
  };

  const filtered = displayed.filter(c =>
    !tableSearch.trim() ||
    c.name?.toLowerCase().includes(tableSearch.toLowerCase()) ||
    c.industry?.toLowerCase().includes(tableSearch.toLowerCase())
  );

  return (
    <div style={{ padding: '28px 24px', maxWidth: 1200 }}>
      <h1 style={{ margin: '0 0 24px', fontSize: 28, fontWeight: 700, color: 'var(--text)' }}>
        Company Research
      </h1>

      {/* Top search card */}
      <div style={card}>
        <p style={{ margin: '0 0 12px', fontWeight: 600, fontSize: 14, color: 'var(--text)' }}>
          Search Companies
        </p>
        <form onSubmit={handleTopSearch} style={{ display: 'flex', gap: 12 }}>
          <input
            style={input}
            placeholder="Enter company name or industry..."
            value={topSearch}
            onChange={e => setTopSearch(e.target.value)}
          />
          <button type="submit" style={searchBtn}>Search</button>
        </form>
      </div>

      {/* Table card */}
      <div style={card}>
        <input
          style={{ ...input, maxWidth: 300, marginBottom: 20 }}
          placeholder="Search..."
          value={tableSearch}
          onChange={e => setTableSearch(e.target.value)}
        />

        {loading ? (
          <div style={{ color: 'var(--text-muted)', padding: 20, textAlign: 'center' }}>Loading...</div>
        ) : (
          <div style={{ overflowX: 'auto', border: '1px solid var(--border)', borderRadius: 8 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', color: 'var(--text)', background: 'var(--bg-surface)' }}>
              <thead>
                <tr style={{ background: 'var(--bg)', borderBottom: '2px solid var(--border)' }}>
                  {['COMPANY', 'INDUSTRY', 'SIZE', 'RATING', 'SUCCESS RATE', 'ACTION'].map(h => (
                    <th key={h} style={th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 14 }}>
                      No companies found.
                    </td>
                  </tr>
                ) : filtered.map(c => (
                  <tr key={c.id} style={{ borderBottom: '1px solid var(--border)' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={td}>{c.name}</td>
                    <td style={td}>{c.industry}</td>
                    <td style={td}>{c.size}</td>
                    <td style={td}>
                      {c.rating} <span style={{ color: '#f59e0b' }}>★</span>
                    </td>
                    <td style={td}>{Math.round((c.successRate || 0) * 100)}%</td>
                    <td style={td}>
                      <button style={viewBtn} onClick={() => setSelected(c)}>View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* View modal */}
      {selected && (
        <div style={overlay} onClick={() => setSelected(null)}>
          <div style={modal} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
              <div>
                <h2 style={{ margin: '0 0 4px', fontSize: 22, fontWeight: 700, color: 'var(--text)' }}>{selected.name}</h2>
                <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{selected.industry} · {selected.location}</span>
              </div>
              <button onClick={() => setSelected(null)} style={closeBtn}>✕</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
              {[
                ['Size', selected.size],
                ['Rating', `${selected.rating} ★`],
                ['Success Rate', `${Math.round((selected.successRate || 0) * 100)}%`],
                ['Avg Salary', selected.averageSalary ? `$${selected.averageSalary.toLocaleString()}` : '—'],
                ['Applications', selected.applicationCount?.toLocaleString() || '—'],
                ['Growth', selected.growthTrend || '—'],
              ].map(([label, value]) => (
                <div key={label} style={{ background: 'var(--bg)', borderRadius: 8, padding: '12px 16px' }}>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>{label}</div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)' }}>{value}</div>
                </div>
              ))}
            </div>

            {selected.description && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 6 }}>About</div>
                <p style={{ margin: 0, fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6 }}>{selected.description}</p>
              </div>
            )}

            {selected.culture && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 6 }}>Culture</div>
                <p style={{ margin: 0, fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6 }}>{selected.culture}</p>
              </div>
            )}

            {selected.recentNews?.length > 0 && (
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 8 }}>Recent News</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {selected.recentNews.map(n => (
                    <span key={n} style={newsBadge}>{n}</span>
                  ))}
                </div>
              </div>
            )}

            <div style={{ marginTop: 24, textAlign: 'right' }}>
              <button style={closeFullBtn} onClick={() => setSelected(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const card = {
  background: 'var(--bg-surface)', border: '1px solid var(--border)',
  borderRadius: 12, padding: '20px 24px', marginBottom: 20,
  boxShadow: 'var(--shadow)',
};
const input = {
  flex: 1, height: 44, padding: '0 14px', fontSize: 14,
  border: '1px solid var(--border)', borderRadius: 8,
  background: 'var(--bg-surface)', color: 'var(--text)', outline: 'none',
};
const searchBtn = {
  height: 44, padding: '0 28px', background: '#4361ee', color: '#fff',
  border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer',
};
const th = {
  padding: '14px 16px', textAlign: 'left', fontSize: 12,
  fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px', color: 'var(--text)',
};
const td = { padding: '14px 16px', fontSize: 14 };
const viewBtn = {
  background: '#4361ee', color: '#fff', border: 'none',
  borderRadius: 7, padding: '7px 20px', fontSize: 13,
  fontWeight: 600, cursor: 'pointer',
};
const overlay = {
  position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
  display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
};
const modal = {
  background: 'var(--bg-surface)', borderRadius: 12, padding: 28,
  width: '90%', maxWidth: 560, maxHeight: '85vh', overflowY: 'auto',
  boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
};
const closeBtn = {
  background: 'none', border: 'none', fontSize: 18,
  cursor: 'pointer', color: 'var(--text-muted)', padding: 4,
};
const closeFullBtn = {
  background: 'var(--bg)', border: '1px solid var(--border)',
  borderRadius: 8, padding: '8px 24px', fontSize: 14,
  fontWeight: 500, cursor: 'pointer', color: 'var(--text)',
};
const newsBadge = {
  background: 'rgba(67,97,238,0.1)', color: '#4361ee',
  borderRadius: 20, padding: '4px 12px', fontSize: 12, fontWeight: 500,
};

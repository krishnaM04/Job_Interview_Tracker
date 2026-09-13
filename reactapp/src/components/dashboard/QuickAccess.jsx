import React from 'react';
import { useNavigate } from 'react-router-dom';

const ITEMS = [
  { id: 'co', label: 'Company Research',  abbr: 'CO', color: '#8b5cf6', glow: 'rgba(139,92,246,0.3)',  route: '/companies' },
  { id: 'dl', label: 'Document Library',  abbr: 'DL', color: '#3b82f6', glow: 'rgba(59,130,246,0.3)',  route: '/documents' },
  { id: 'an', label: 'Analytics Center',  abbr: 'AN', color: '#10b981', glow: 'rgba(16,185,129,0.3)',  route: '/analytics' },
  { id: 'cp', label: 'Counselor Panel',   abbr: 'CP', color: '#f59e0b', glow: 'rgba(245,158,11,0.3)',  route: '/counselor' },
];

export default function QuickAccess() {
  const navigate = useNavigate();

  return (
    <div>
      <h3 style={s.heading}>Quick Access</h3>
      <div style={s.grid}>
        {ITEMS.map(item => (
          <button
            key={item.id}
            onClick={() => navigate(item.route)}
            style={s.card}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = `0 8px 24px ${item.glow}`;
              e.currentTarget.style.borderColor = `${item.color}60`;
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.12)';
              e.currentTarget.style.borderColor = 'var(--border)';
            }}
          >
            <div style={{
              ...s.badge,
              background: `linear-gradient(135deg, ${item.color}30, ${item.color}15)`,
              border: `1.5px solid ${item.color}50`,
              color: item.color,
              boxShadow: `0 0 12px ${item.color}30`,
            }}>
              {item.abbr}
            </div>
            <span style={s.label}>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

const s = {
  heading: {
    fontSize: 18, fontWeight: 700,
    color: 'var(--text)', margin: '0 0 16px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: 16,
  },
  card: {
    display: 'flex', alignItems: 'center', gap: 16,
    padding: '18px 22px',
    background: 'var(--bg-surface)',
    border: '1px solid var(--border)',
    borderRadius: 14,
    cursor: 'pointer', textAlign: 'left',
    boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
    transition: 'transform 0.2s, box-shadow 0.2s, border-color 0.2s',
    minHeight: 44,
  },
  badge: {
    width: 44, height: 44, borderRadius: '50%', flexShrink: 0,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontWeight: 800, fontSize: 12, letterSpacing: '0.5px',
  },
  label: { fontSize: 14, fontWeight: 600, color: 'var(--text)' },
};

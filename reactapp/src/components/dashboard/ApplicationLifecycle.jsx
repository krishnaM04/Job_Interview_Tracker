import React from 'react';

const STATUSES = [
  { key: 'Applied',              color: '#f59e0b' },
  { key: 'Under Review',         color: '#f59e0b' },
  { key: 'Interview Scheduled',  color: '#8b5cf6' },
  { key: 'Offer Received',       color: '#10b981' },
];

export default function ApplicationLifecycle({ stats = {}, total = 0 }) {
  const computedTotal = total || Object.values(stats).reduce((a, b) => a + (b || 0), 0);

  return (
    <div style={s.card}>
      <div style={s.header}>
        <h3 style={s.title}>Application Lifecycle</h3>
        <span style={s.totalBadge}>{computedTotal} total</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
        {STATUSES.map(({ key, color }) => {
          const count = stats[key] || 0;
          const pct = computedTotal > 0 ? (count / computedTotal) * 100 : 0;
          return (
            <div key={key} style={s.row}>
              <div style={s.labelCell}>
                <span style={{ ...s.dot, background: color, boxShadow: `0 0 6px ${color}80` }} />
                <span style={s.labelText}>{key}</span>
              </div>
              <div style={s.track}>
                <div style={{
                  ...s.fill,
                  width: `${Math.max(pct, count > 0 ? 4 : 0)}%`,
                  background: `linear-gradient(90deg, ${color}, ${color}cc)`,
                  boxShadow: count > 0 ? `0 0 8px ${color}60` : 'none',
                }} />
              </div>
              <span style={s.count}>{count}</span>
            </div>
          );
        })}
      </div>

      <div style={s.footnote}>
        <span style={s.footnoteText}>Status flow — Applied › Under Review › Interview Scheduled › Offer</span>
      </div>
    </div>
  );
}

const s = {
  card: {
    background: 'var(--bg-surface)',
    border: '1px solid var(--border)',
    borderRadius: 16,
    padding: '24px 28px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
  },
  header: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 28,
  },
  title: { margin: 0, fontSize: 18, fontWeight: 700, color: 'var(--text)' },
  totalBadge: {
    fontSize: 12, color: 'var(--text-muted)',
    fontWeight: 600, letterSpacing: '0.3px',
  },
  row: { display: 'flex', alignItems: 'center', gap: 14 },
  labelCell: { display: 'flex', alignItems: 'center', gap: 10, minWidth: 170 },
  dot: {
    width: 10, height: 10, borderRadius: '50%', flexShrink: 0,
  },
  labelText: { fontSize: 14, fontWeight: 500, color: 'var(--text)' },
  track: {
    flex: 1, height: 10, borderRadius: 6,
    background: 'var(--border)', overflow: 'hidden',
  },
  fill: {
    height: '100%', borderRadius: 6,
    transition: 'width 0.5s cubic-bezier(0.4,0,0.2,1)',
  },
  count: {
    minWidth: 20, textAlign: 'right',
    fontSize: 14, fontWeight: 700, color: 'var(--text)',
  },
  footnote: {
    marginTop: 24, paddingTop: 16,
    borderTop: '1px solid var(--border)',
  },
  footnoteText: {
    fontSize: 11, color: 'var(--text-muted)', letterSpacing: '0.2px',
  },
};

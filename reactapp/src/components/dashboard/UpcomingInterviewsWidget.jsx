import React from 'react';

export default function UpcomingInterviewsWidget({ interviews = [], onAddInterview }) {
  const fmt = (date, time) => {
    if (!date) return 'Date TBA';
    const d = new Date(date);
    const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    return time ? `${label} · ${time}` : label;
  };

  const TYPE_COLOR = {
    Phone: '#3b82f6', Video: '#8b5cf6',
    'In-Person': '#10b981', Technical: '#f59e0b', Panel: '#6366f1',
  };

  return (
    <div style={s.card}>
      <h3 style={s.title}>Upcoming Interviews</h3>

      {interviews.length === 0 ? (
        <div style={s.empty}>
          <div style={s.calIcon}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
              stroke="#f59e0b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </div>
          <p style={s.emptyTitle}>No upcoming interviews scheduled</p>
          <p style={s.emptySubtitle}>New interviews will appear here once confirmed</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {interviews.slice(0, 5).map((iv, i) => {
            const color = TYPE_COLOR[iv.type] || '#6b7280';
            return (
              <div key={iv.id || i} style={s.row}>
                <div style={{ ...s.typeBadge, background: `${color}20`, border: `1px solid ${color}40` }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color, letterSpacing: '0.5px' }}>
                    {(iv.type || 'IV').slice(0, 2).toUpperCase()}
                  </span>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={s.company}>{iv.companyName || 'Company'}</p>
                  <p style={s.meta}>{iv.type || 'Interview'} · {fmt(iv.scheduledDate, iv.scheduledTime)}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const s = {
  card: {
    background: 'var(--bg-surface)',
    border: '1px solid var(--border)',
    borderRadius: 16, padding: '24px 28px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
    display: 'flex', flexDirection: 'column',
  },
  title: { margin: '0 0 20px', fontSize: 18, fontWeight: 700, color: 'var(--text)' },
  empty: {
    flex: 1, display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    padding: '32px 16px', textAlign: 'center',
  },
  calIcon: {
    width: 64, height: 64, borderRadius: '50%',
    background: 'rgba(245,158,11,0.12)',
    border: '1px solid rgba(245,158,11,0.25)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: { margin: '0 0 6px', fontSize: 14, fontWeight: 600, color: 'var(--text)' },
  emptySubtitle: { margin: 0, fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5 },
  row: {
    display: 'flex', alignItems: 'center', gap: 12,
    padding: '12px 14px', borderRadius: 10,
    background: 'var(--bg)', border: '1px solid var(--border)',
  },
  typeBadge: {
    width: 36, height: 36, borderRadius: 8, flexShrink: 0,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  company: { margin: 0, fontSize: 14, fontWeight: 600, color: 'var(--text)' },
  meta: { margin: '2px 0 0', fontSize: 12, color: 'var(--text-muted)' },
};

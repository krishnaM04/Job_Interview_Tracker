import React from 'react';

export default function StatCard({ label, value, sublabel, accent = '#f59e0b' }) {
  return (
    <div
      style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        borderRadius: 14,
        padding: '22px 24px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
        transition: 'transform 0.2s, box-shadow 0.2s',
        cursor: 'default',
        position: 'relative',
        overflow: 'hidden',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-3px)';
        e.currentTarget.style.boxShadow = '0 8px 28px rgba(0,0,0,0.22)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.15)';
      }}
    >
      {/* Top accent line */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        height: 3, background: accent, borderRadius: '14px 14px 0 0',
      }} />

      <p style={{
        margin: '0 0 14px',
        fontSize: 11,
        fontWeight: 700,
        color: 'var(--text-muted)',
        textTransform: 'uppercase',
        letterSpacing: '0.8px',
      }}>
        {label}
      </p>

      <h3 style={{
        margin: 0,
        fontSize: 40,
        fontWeight: 800,
        color: 'var(--text)',
        letterSpacing: '-1px',
        lineHeight: 1,
      }}>
        {value}
      </h3>

      {sublabel && (
        <p style={{
          margin: '10px 0 0',
          fontSize: 12,
          color: accent,
          fontWeight: 600,
        }}>
          {sublabel}
        </p>
      )}
    </div>
  );
}

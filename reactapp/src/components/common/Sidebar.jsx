import React from 'react';
import { NavLink } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const NAV = {
  STANDARD_CANDIDATE: [
    { to: '/dashboard',    label: '🏠 Dashboard' },
    { to: '/applications', label: '📋 Applications' },
    { to: '/interviews',   label: '🗓 Interviews' },
    { to: '/counselor',    label: '🎓 Counselor Panel' },
  ],
  PREMIUM_CANDIDATE: [
    { to: '/dashboard',    label: '🏠 Dashboard' },
    { to: '/applications', label: '📋 Applications' },
    { to: '/interviews',   label: '🗓 Interviews' },
    { to: '/documents',    label: '📄 Documents' },
    { to: '/analytics',    label: '📊 Analytics' },
    { to: '/companies',    label: '🏢 Companies' },
    { to: '/counselor',    label: '🎓 Counselor Panel' },
  ],
  CAREER_COUNSELOR: [
    { to: '/dashboard',    label: '🏠 Dashboard' },
    { to: '/counselor',    label: '🎓 Counselor Panel' },
    { to: '/analytics',    label: '📊 Analytics' },
  ],
  ADMIN: [
    { to: '/dashboard',    label: '🏠 Dashboard' },
    { to: '/analytics',    label: '📊 Analytics' },
    { to: '/counselor',    label: '🎓 Counselor Panel' },
  ],
};

export default function Sidebar({ open }) {
  const auth = useAuth();
  const links = NAV[auth?.user?.role] || [];

  return (
    <aside
      aria-label="Main navigation"
      aria-hidden={!open}
      style={{ ...styles.sidebar, ...(open ? styles.open : styles.closed) }}
    >
      <nav>
        <ul style={styles.list} role="list">
          {links.map(({ to, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                style={({ isActive }) => ({ ...styles.link, ...(isActive ? styles.active : {}) })}
                aria-current={undefined}
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      {/* Profile completeness bar */}
      <div style={{ padding: '16px 20px', borderTop: '1px solid var(--border)', boxSizing: 'border-box', width: '100%' }}>
        <p style={{ margin: '0 0 8px', fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.6px', whiteSpace: 'nowrap' }}>
          Profile Completeness
        </p>
        <div style={{ width: '100%', height: 6, borderRadius: 4, background: 'var(--border)', overflow: 'hidden', boxSizing: 'border-box' }}>
          <div style={{ width: '85%', height: '100%', borderRadius: 4, background: 'linear-gradient(90deg,#f59e0b,#d97706)' }} />
        </div>
        <p style={{ margin: '6px 0 0', fontSize: 12, color: '#f59e0b', fontWeight: 600 }}>85% complete</p>
      </div>
    </aside>
  );
}

const styles = {
  sidebar: {
    background: 'var(--sidebar-bg)',
    borderRight: '1px solid var(--border)',
    width: 220,
    minHeight: '100%',
    transition: 'transform 0.25s ease, width 0.25s ease',
    overflow: 'hidden',
    flexShrink: 0,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    boxSizing: 'border-box',
  },
  open: { transform: 'translateX(0)' },
  closed: { transform: 'translateX(-100%)', width: 0 },
  list: { listStyle: 'none', margin: 0, padding: '16px 0' },
  link: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px 20px',
    minHeight: 44,
    color: 'var(--text-muted)',
    textDecoration: 'none',
    fontSize: '0.95rem',
    borderLeft: '3px solid transparent',
    borderRadius: '0 8px 8px 0',
    margin: '2px 8px 2px 0',
    transition: 'background 0.15s, color 0.15s',
    fontWeight: 500,
  },
  active: {
    borderLeftColor: '#f59e0b',
    color: 'var(--text)',
    background: 'rgba(245,158,11,0.1)',
    fontWeight: 700,
  },
};

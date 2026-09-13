import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import useAuth from '../../hooks/useAuth';

export default function Header({ onMenuToggle }) {
  const { theme, toggle } = useTheme();
  const auth = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  function handleLogout() {
    auth.logout();
    navigate('/login');
  }

  function handleMenu() {
    setMenuOpen(o => !o);
    onMenuToggle?.();
  }

  return (
    <header style={styles.header} role="banner">
      <div style={styles.left}>
        <button
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
          onClick={handleMenu}
          style={styles.iconBtn}
          className="sidebar-toggle"
        >
          ☰
        </button>
        <Link to="/dashboard" style={styles.brand} aria-label="Job Interview Tracker home">
          Job Interview Tracker
        </Link>
      </div>

      <nav style={styles.right} aria-label="User actions">
        <button
          onClick={toggle}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          style={styles.iconBtn}
          title={`${theme === 'dark' ? 'Light' : 'Dark'} mode`}
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>

        {auth?.user && (
          <>
            <span style={styles.username} aria-label={`Logged in as ${auth.user.username}`}>
              {auth.user.username}
            </span>
            <button onClick={handleLogout} className="btn btn-ghost" style={styles.logoutBtn}>
              Logout
            </button>
          </>
        )}
      </nav>
    </header>
  );
}

const styles = {
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 16px',
    height: 56,
    background: 'var(--header-bg)',
    borderBottom: '1px solid var(--border)',
    boxShadow: 'var(--shadow)',
    position: 'sticky',
    top: 0,
    zIndex: 200,
  },
  left: { display: 'flex', alignItems: 'center', gap: 12 },
  brand: {
    fontWeight: 700,
    fontSize: '1.1rem',
    color: 'var(--accent)',
    textDecoration: 'none',
  },
  right: { display: 'flex', alignItems: 'center', gap: 8 },
  iconBtn: {
    background: 'none',
    border: 'none',
    fontSize: '1.25rem',
    padding: '0 8px',
    color: 'var(--text)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  username: {
    fontSize: '0.875rem',
    color: 'var(--text-muted)',
    display: 'none',
  },
  logoutBtn: { fontSize: '0.875rem', padding: '6px 14px', minHeight: 44 },
};

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

export default function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [focusedField, setFocusedField] = useState(null);
  const auth = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    try {
      await auth.login({ username, password });
      navigate('/dashboard');
    } catch (err) {
      setError(err?.response?.data?.message || 'Login failed. Please check your credentials.');
    }
  }

  return (
    <main style={styles.page} aria-label="Sign in page">
      <div style={styles.container}>
        {/* Left decorative section */}
        <div style={styles.decorativeSection}>
          <div style={styles.decorativeContent}>
            <div style={styles.decorativeIcon}>🎯</div>
            <h2 style={styles.decorativeTitle}>Welcome Back</h2>
            <p style={styles.decorativeText}>Continue managing your interview process and achieve your career goals.</p>
            <div style={styles.decorativeBullets}>
              <div style={styles.bullet}>
                <span>✓</span>
                <span>View all your applications</span>
              </div>
              <div style={styles.bullet}>
                <span>✓</span>
                <span>Track interview schedules</span>
              </div>
              <div style={styles.bullet}>
                <span>✓</span>
                <span>Monitor performance metrics</span>
              </div>
              <div style={styles.bullet}>
                <span>✓</span>
                <span>Connect with counselors</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right form section */}
        <div style={styles.formSection}>
          <div style={styles.card}>
            <div style={styles.brandRow}>
              <div style={styles.brandIcon}>J</div>
              <span style={styles.brandText}>Job Interview Tracker</span>
            </div>

            <div style={styles.headerBlock}>
              <h1 style={styles.heading}>Sign In</h1>
              <p style={styles.subtitle}>Access your account to continue</p>
            </div>

            <form onSubmit={handleSubmit} noValidate style={styles.form}>
              <div style={styles.inputGroup}>
                <label htmlFor="username" style={styles.label}>
                  <span style={styles.labelText}>Username</span>
                </label>
                <div style={styles.inputWrapper}>
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    onFocus={() => setFocusedField('username')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Enter your username"
                    style={{
                      ...styles.input,
                      ...(focusedField === 'username' ? styles.inputFocus : {})
                    }}
                    autoComplete="username"
                    required
                    aria-required="true"
                  />
                </div>
              </div>

              <div style={styles.inputGroup}>
                <label htmlFor="password" style={styles.label}>
                  <span style={styles.labelText}>Password</span>
                </label>
                <div style={styles.inputWrapper}>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Enter your password"
                    style={{
                      ...styles.input,
                      ...(focusedField === 'password' ? styles.inputFocus : {})
                    }}
                    autoComplete="current-password"
                    required
                    aria-required="true"
                  />
                </div>
              </div>

              {error && (
                <div style={styles.error} role="alert" aria-live="assertive">
                  {error}
                </div>
              )}

              <button
                type="submit"
                style={styles.button}
                disabled={auth.loading}
                aria-busy={auth.loading}
              >
                {auth.loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <div style={styles.divider}>
              <span style={styles.dividerText}>New user?</span>
            </div>

            <p style={styles.footerText}>
              <Link to="/register" style={styles.link}>Create a new account</Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    background: '#f8f9fa',
    fontFamily: "'Segoe UI', 'Roboto', sans-serif",
    position: 'relative'
  },
  container: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '0',
    width: '100%',
    maxWidth: '1100px',
    height: 'auto',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08)',
    backgroundColor: '#ffffff',
    '@media (max-width: 768px)': {
      gridTemplateColumns: '1fr',
    }
  },
  decorativeSection: {
    background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
    padding: '60px 40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    position: 'relative'
  },
  decorativeContent: {
    textAlign: 'left',
    zIndex: 1
  },
  decorativeIcon: {
    fontSize: '48px',
    marginBottom: '24px',
    display: 'block'
  },
  decorativeTitle: {
    fontSize: '28px',
    fontWeight: '700',
    margin: '0 0 12px 0',
    letterSpacing: '-0.3px',
    lineHeight: 1.3
  },
  decorativeText: {
    fontSize: '14px',
    opacity: 0.85,
    marginBottom: '40px',
    lineHeight: 1.7
  },
  decorativeBullets: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  bullet: {
    fontSize: '14px',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    fontWeight: '500',
    lineHeight: 1.5,
    opacity: 0.9
  },
  formSection: {
    background: '#ffffff',
    padding: '60px 48px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  card: {
    width: '100%',
    maxWidth: '400px'
  },
  brandRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '40px'
  },
  brandIcon: {
    width: '40px',
    height: '40px',
    borderRadius: '8px',
    background: '#2c3e50',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '700',
    fontSize: '20px',
    flexShrink: 0
  },
  brandText: {
    fontSize: '15px',
    fontWeight: '700',
    color: '#2c3e50',
    letterSpacing: '0.2px'
  },
  headerBlock: {
    marginBottom: '36px'
  },
  heading: {
    margin: '0 0 10px 0',
    fontSize: '28px',
    lineHeight: 1.2,
    color: '#1a1a1a',
    fontWeight: '700',
    letterSpacing: '-0.3px'
  },
  subtitle: {
    margin: '0',
    color: '#666666',
    fontSize: '14px',
    lineHeight: 1.6,
    fontWeight: '400'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  label: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontSize: '14px',
    fontWeight: '600',
    color: '#333333',
    textTransform: 'capitalize'
  },
  labelText: {
    display: 'block'
  },
  labelIcon: {
    fontSize: '14px',
    display: 'block',
    opacity: 0.7
  },
  inputWrapper: {
    position: 'relative'
  },
  input: {
    width: '100%',
    minHeight: '48px',
    borderRadius: '6px',
    border: '1px solid #d1d5db',
    background: '#f9fafb',
    color: '#111827',
    fontSize: '14px',
    padding: '12px 14px',
    outline: 'none',
    transition: 'all 0.2s ease',
    fontFamily: 'inherit',
    fontWeight: '400'
  },
  inputFocus: {
    borderColor: '#2c3e50',
    backgroundColor: '#ffffff',
    boxShadow: '0 0 0 3px rgba(44, 62, 80, 0.1)'
  },
  error: {
    color: '#d32f2f',
    background: '#ffebee',
    border: '1px solid #ef5350',
    borderRadius: '6px',
    padding: '12px 14px',
    fontSize: '13px',
    fontWeight: '500',
    marginTop: '-8px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  button: {
    minHeight: '48px',
    border: 'none',
    borderRadius: '6px',
    background: '#2c3e50',
    color: '#fff',
    fontSize: '14px',
    fontWeight: '700',
    cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(44, 62, 80, 0.15)',
    transition: 'all 0.2s ease',
    letterSpacing: '0.2px',
    marginTop: '8px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    margin: '28px 0',
    position: 'relative'
  },
  dividerText: {
    color: '#999999',
    fontSize: '11px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    zIndex: 1,
    background: '#ffffff',
    padding: '0 8px'
  },
  footerText: {
    margin: '0',
    textAlign: 'center',
    fontSize: '13px',
    color: '#666666',
    fontWeight: '400'
  },
  link: {
    color: '#2c3e50',
    textDecoration: 'none',
    fontWeight: '700',
    transition: 'all 0.2s ease'
  }
};

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

export default function RegisterForm() {
  const [form, setForm] = useState({ username: '', email: '', password: '', role: 'STANDARD_CANDIDATE' });
  const [error, setError] = useState(null);
  const [focusedField, setFocusedField] = useState(null);
  const auth = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    try {
      await auth.register(form);
      // Auto-login after registration
      await auth.login({ username: form.username, password: form.password });
      navigate('/dashboard');
    } catch (err) {
      setError(err?.response?.data?.message || 'Registration failed. Please try again.');
    }
  }

  return (
    <main style={styles.page} aria-label="Create account page">
      <div style={styles.container}>
        {/* Left decorative section */}
        <div style={styles.decorativeSection}>
          <div style={styles.decorativeContent}>
            <div style={styles.decorativeIcon}>�</div>
            <h2 style={styles.decorativeTitle}>Build Your Career</h2>
            <p style={styles.decorativeText}>Start tracking your interview progress today and take control of your career journey.</p>
            <div style={styles.decorativeBullets}>
              <div style={styles.bullet}>
                <span>✓</span>
                <span>Track all your applications</span>
              </div>
              <div style={styles.bullet}>
                <span>✓</span>
                <span>Manage interview schedules</span>
              </div>
              <div style={styles.bullet}>
                <span>✓</span>
                <span>Analyze your progress with insights</span>
              </div>
              <div style={styles.bullet}>
                <span>✓</span>
                <span>Access expert counseling</span>
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
              <h1 style={styles.heading}>Create Account</h1>
              <p style={styles.subtitle}>Join professionals managing their career growth</p>
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
                    value={form.username}
                    onChange={(e) => setForm({ ...form, username: e.target.value })}
                    onFocus={() => setFocusedField('username')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Enter your username"
                    style={{
                      ...styles.input,
                      ...(focusedField === 'username' ? styles.inputFocus : {})
                    }}
                    required
                  />
                </div>
              </div>

              <div style={styles.inputGroup}>
                <label htmlFor="email" style={styles.label}>
                  <span style={styles.labelText}>Email Address</span>
                </label>
                <div style={styles.inputWrapper}>
                  <input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="name@example.com"
                    style={{
                      ...styles.input,
                      ...(focusedField === 'email' ? styles.inputFocus : {})
                    }}
                    required
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
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Create a strong password"
                    style={{
                      ...styles.input,
                      ...(focusedField === 'password' ? styles.inputFocus : {})
                    }}
                    required
                  />
                </div>
              </div>

              <div style={styles.inputGroup}>
                <label htmlFor="role" style={styles.label}>
                  <span style={styles.labelText}>Account Type</span>
                </label>
                <select
                  id="role"
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  style={{ ...styles.input, ...(focusedField === 'role' ? styles.inputFocus : {}) }}
                  onFocus={() => setFocusedField('role')}
                  onBlur={() => setFocusedField(null)}
                  required
                >
                  <option value="STANDARD_CANDIDATE">Standard Candidate</option>
                  <option value="PREMIUM_CANDIDATE">Premium Candidate</option>
                  <option value="CAREER_COUNSELOR">Career Counselor</option>
                </select>
              </div>

              {error && (
                <div style={styles.error} role="alert" aria-live="assertive">
                  {error}
                </div>
              )}

              <button type="submit" style={styles.button} disabled={auth.loading}>
                {auth.loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>

            <div style={styles.divider}>
              <span style={styles.dividerText}>Already registered?</span>
            </div>

            <p style={styles.footerText}>
              <Link to="/login" style={styles.link}>Sign in to your account</Link>
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

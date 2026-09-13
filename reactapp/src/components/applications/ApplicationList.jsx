import React, { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { createApi } from '../../api/axiosInstance';
import { fetchApplications, deleteApplication } from '../../services/applicationService';
import { localStore } from '../../utils/localStore';

const STATUS_LABELS = {
  APPLIED: 'Applied', UNDER_REVIEW: 'Under Review',
  INTERVIEW_SCHEDULED: 'Interview Scheduled', INTERVIEW_COMPLETED: 'Interview Completed',
  OFFER_RECEIVED: 'Offer Received', ACCEPTED: 'Accepted', REJECTED: 'Rejected',
};

const STATUS_COLORS = {
  APPLIED: '#4361ee', UNDER_REVIEW: '#f59e0b', INTERVIEW_SCHEDULED: '#8b5cf6',
  INTERVIEW_COMPLETED: '#3b82f6', OFFER_RECEIVED: '#10b981', ACCEPTED: '#059669', REJECTED: '#ef4444',
};

const PRIORITY_COLORS = { LOW: '#10b981', MEDIUM: '#f59e0b', HIGH: '#ef4444' };

export default function ApplicationList() {
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadApps = useCallback(async () => {
    setLoading(true);
    let apiApps = [];
    if (auth?.token) {
      try {
        const api = createApi(auth.token, auth.logout);
        const data = await fetchApplications(api, { page: 0, size: 100 });
        const list = data?.content ?? data;
        apiApps = Array.isArray(list) ? list : [];
      } catch (e) { /* backend unavailable */ }
    }
    const local = localStore.getAll();
    const apiIds = new Set(apiApps.map(a => String(a.id)));
    const merged = [...apiApps, ...local.filter(a => !apiIds.has(String(a.id)))];
    setApps(merged);
    setLoading(false);
  }, [auth?.token]); // eslint-disable-line

  // Reload on mount AND whenever navigated back with a refresh state
  useEffect(() => { loadApps(); }, [loadApps, location.state?.refresh]);

  async function handleDelete(id) {
    if (!window.confirm('Delete this application?')) return;
    try {
      if (auth?.token) {
        const api = createApi(auth.token, auth.logout);
        await deleteApplication(api, id);
      }
    } catch (e) { /* ignore */ }
    localStore.delete(id);
    setApps(s => s.filter(a => a.id !== id));
  }

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Applications</h1>
          <p style={styles.subtitle}>{apps.length} total application{apps.length !== 1 ? 's' : ''}</p>
        </div>
        <button
          style={styles.newBtn}
          onClick={() => navigate('/applications/new')}
        >
          + New Application
        </button>
      </div>

      {loading ? (
        <div style={styles.empty}>Loading…</div>
      ) : apps.length === 0 ? (
        <div style={styles.emptyCard}>
          <p style={{ margin: '0 0 16px', fontSize: 15, color: 'var(--text-muted)' }}>
            No applications yet. Start tracking your job search!
          </p>
          <button style={styles.newBtn} onClick={() => navigate('/applications/new')}>
            + Create your first application
          </button>
        </div>
      ) : (
        <div style={styles.tableCard}>
          <table style={styles.table}>
            <thead>
              <tr>
                {['Company', 'Position', 'Date', 'Status', 'Priority', 'Actions'].map(h => (
                  <th key={h} style={styles.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {apps.map(a => (
                <tr key={a.id} style={styles.tr}>
                  <td style={styles.td}><strong>{a.company || '—'}</strong></td>
                  <td style={styles.td}>{a.positionTitle || '—'}</td>
                  <td style={styles.td}>{a.applicationDate || '—'}</td>
                  <td style={styles.td}>
                    <span style={{
                      ...styles.badge,
                      background: `${STATUS_COLORS[a.status] || '#6b7280'}18`,
                      color: STATUS_COLORS[a.status] || '#6b7280',
                    }}>
                      {STATUS_LABELS[a.status] || a.status || '—'}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <span style={{
                      ...styles.badge,
                      background: `${PRIORITY_COLORS[a.priority] || '#6b7280'}18`,
                      color: PRIORITY_COLORS[a.priority] || '#6b7280',
                    }}>
                      {a.priority ? a.priority.charAt(0) + a.priority.slice(1).toLowerCase() : '—'}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <Link to={`/applications/${a.id}/edit`} style={styles.editBtn}>Edit</Link>
                      <button onClick={() => handleDelete(a.id)} style={styles.deleteBtn}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const styles = {
  page: { padding: '32px 28px', maxWidth: 1200 },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28, flexWrap: 'wrap', gap: 12 },
  title: { margin: '0 0 4px', fontSize: 28, fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.5px' },
  subtitle: { margin: 0, fontSize: 14, color: 'var(--text-muted)' },
  newBtn: {
    background: '#4361ee', color: '#fff', border: 'none',
    borderRadius: 8, padding: '0 20px', height: 44, minHeight: 44,
    fontSize: 14, fontWeight: 600, cursor: 'pointer',
  },
  empty: { padding: 40, textAlign: 'center', color: 'var(--text-muted)' },
  emptyCard: {
    background: 'var(--bg-surface)', border: '1px solid var(--border)',
    borderRadius: 12, padding: 40, textAlign: 'center', boxShadow: 'var(--shadow)',
  },
  tableCard: {
    background: 'var(--bg-surface)', border: '1px solid var(--border)',
    borderRadius: 12, overflow: 'hidden', boxShadow: 'var(--shadow)',
  },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: {
    padding: '12px 16px', textAlign: 'left', fontSize: 12,
    fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase',
    letterSpacing: '0.5px', borderBottom: '1px solid var(--border)',
    background: 'var(--bg)',
  },
  tr: { borderBottom: '1px solid var(--border)', transition: 'background 0.15s' },
  td: { padding: '14px 16px', fontSize: 14, color: 'var(--text)', verticalAlign: 'middle' },
  badge: { padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 },
  editBtn: {
    padding: '5px 14px', borderRadius: 6, fontSize: 13, fontWeight: 500,
    background: 'rgba(67,97,238,0.1)', color: '#4361ee',
    textDecoration: 'none', minHeight: 'unset',
  },
  deleteBtn: {
    padding: '5px 14px', borderRadius: 6, fontSize: 13, fontWeight: 500,
    background: 'rgba(239,68,68,0.1)', color: '#ef4444',
    border: 'none', cursor: 'pointer', minHeight: 'unset',
  },
};

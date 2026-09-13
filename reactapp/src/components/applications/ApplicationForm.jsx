import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { createApi } from '../../api/axiosInstance';
import { createApplication, fetchApplicationById, updateApplication } from '../../services/applicationService';
import { localStore } from '../../utils/localStore';

const STATUS_OPTIONS = [
  { value: 'APPLIED',               label: 'Applied',               color: '#4361ee' },
  { value: 'UNDER_REVIEW',          label: 'Under Review',          color: '#f59e0b' },
  { value: 'INTERVIEW_SCHEDULED',   label: 'Interview Scheduled',   color: '#8b5cf6' },
  { value: 'INTERVIEW_COMPLETED',   label: 'Interview Completed',   color: '#3b82f6' },
  { value: 'OFFER_RECEIVED',        label: 'Offer Received',        color: '#10b981' },
  { value: 'ACCEPTED',              label: 'Accepted',              color: '#059669' },
  { value: 'REJECTED',              label: 'Rejected',              color: '#ef4444' },
];

const PRIORITY_OPTIONS = [
  { value: 'LOW',    label: 'Low',    color: '#10b981' },
  { value: 'MEDIUM', label: 'Medium', color: '#f59e0b' },
  { value: 'HIGH',   label: 'High',   color: '#ef4444' },
];

function DotSelect({ options, value, onChange, id }) {
  const selected = options.find(o => o.value === value) || options[0];
  return (
    <div style={styles.dotSelectWrapper}>
      <span style={{ ...styles.dot, background: selected.color }} />
      <select
        id={id}
        value={value}
        onChange={onChange}
        style={styles.dotSelect}
      >
        {options.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      {/* chevron */}
      <svg style={styles.chevron} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </div>
  );
}

export default function ApplicationForm() {
  const { id } = useParams();
  const isEdit = !!id;
  const auth = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    company: '', positionTitle: '',
    applicationDate: '', deadline: '',
    status: 'APPLIED', priority: 'MEDIUM', notes: '',
  });

  useEffect(() => {
    if (!isEdit) return;
    // Try local store first (instant), then API
    const local = localStore.getById(id);
    if (local) { setForm(prev => ({ ...prev, ...local })); return; }
    if (!auth?.token) return;
    const api = createApi(auth.token, auth.logout);
    let mounted = true;
    async function load() {
      try {
        const data = await fetchApplicationById(api, id);
        if (mounted) setForm(prev => ({ ...prev, ...data }));
      } catch (e) {}
    }
    load();
    return () => { mounted = false; };
  }, [id, isEdit, auth]);

  function set(field) {
    return e => setForm(prev => ({ ...prev, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.company.trim() || !form.positionTitle.trim()) {
      setError('Company and Position are required.');
      return;
    }
    setError(null);
    setLoading(true);

    // Persist to local store first — it's the source of truth for the list,
    // so a newly created/edited application always shows up immediately.
    if (isEdit) localStore.update(id, form);
    else localStore.create(form);

    // Best-effort sync with the backend. The stub backend returns 200 without
    // persisting, so ignore failures — the local copy is already saved.
    if (auth?.token) {
      try {
        const api = createApi(auth.token, auth.logout);
        if (isEdit) await updateApplication(api, id, form);
        else await createApplication(api, form);
      } catch {
        // Backend unavailable — local copy already saved.
      }
    }

    setLoading(false);
    navigate('/applications', { replace: false, state: { refresh: Date.now() } });
  }

  return (
    <div style={styles.page}>
      {/* Page heading */}
      <div style={styles.pageHeader}>
        <h1 style={styles.pageTitle}>{isEdit ? 'Edit Application' : 'Create Application'}</h1>
        <p style={styles.pageSubtitle}>
          {isEdit ? 'Update your job application details' : 'Add a new job application to your tracker'}
        </p>
      </div>

      {/* Form card */}
      <div style={styles.card}>
        {error && (
          <div style={styles.errorBanner} role="alert">{error}</div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          {/* Row 1: Company + Position */}
          <div style={styles.row}>
            <div style={styles.field}>
              <label htmlFor="company" style={styles.label}>Company</label>
              <input
                id="company"
                style={styles.input}
                placeholder="e.g. TechNova Systems"
                value={form.company}
                onChange={set('company')}
                required
              />
            </div>
            <div style={styles.field}>
              <label htmlFor="position" style={styles.label}>Position</label>
              <input
                id="position"
                style={styles.input}
                placeholder="e.g. Backend Engineer"
                value={form.positionTitle}
                onChange={set('positionTitle')}
                required
              />
            </div>
          </div>

          {/* Row 2: Application date + Deadline */}
          <div style={styles.row}>
            <div style={styles.field}>
              <label htmlFor="appDate" style={styles.label}>Application date</label>
              <input
                id="appDate"
                type="date"
                style={styles.input}
                value={form.applicationDate}
                onChange={set('applicationDate')}
              />
            </div>
            <div style={styles.field}>
              <label htmlFor="deadline" style={styles.label}>Deadline</label>
              <input
                id="deadline"
                type="date"
                style={styles.input}
                value={form.deadline}
                onChange={set('deadline')}
              />
            </div>
          </div>

          {/* Row 3: Status + Priority */}
          <div style={styles.row}>
            <div style={styles.field}>
              <label htmlFor="status" style={styles.label}>Status</label>
              <DotSelect
                id="status"
                options={STATUS_OPTIONS}
                value={form.status}
                onChange={set('status')}
              />
            </div>
            <div style={styles.field}>
              <label htmlFor="priority" style={styles.label}>Priority</label>
              <DotSelect
                id="priority"
                options={PRIORITY_OPTIONS}
                value={form.priority}
                onChange={set('priority')}
              />
            </div>
          </div>

          {/* Row 4: Notes full width */}
          <div style={{ marginBottom: 32 }}>
            <label htmlFor="notes" style={styles.label}>Notes</label>
            <textarea
              id="notes"
              style={styles.textarea}
              placeholder="Add any notes about this application..."
              value={form.notes}
              onChange={set('notes')}
              rows={5}
            />
          </div>

          {/* Actions */}
          <div style={styles.actions}>
            <button type="submit" style={styles.saveBtn} disabled={loading}>
              {loading ? 'Saving…' : 'Save application'}
            </button>
            <button
              type="button"
              style={styles.cancelBtn}
              onClick={() => navigate('/applications')}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  page: {
    padding: '32px 28px',
    maxWidth: 1100,
  },
  pageHeader: { marginBottom: 28 },
  pageTitle: {
    margin: '0 0 6px',
    fontSize: 28,
    fontWeight: 700,
    color: 'var(--text)',
    letterSpacing: '-0.5px',
  },
  pageSubtitle: {
    margin: 0,
    fontSize: 14,
    color: 'var(--text-muted)',
  },
  card: {
    background: 'var(--bg-surface)',
    border: '1px solid var(--border)',
    borderRadius: 12,
    padding: '32px',
    boxShadow: 'var(--shadow)',
  },
  errorBanner: {
    background: 'rgba(239,68,68,0.1)',
    border: '1px solid #ef4444',
    color: '#ef4444',
    borderRadius: 8,
    padding: '12px 16px',
    fontSize: 14,
    marginBottom: 24,
  },
  row: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 24,
    marginBottom: 24,
  },
  field: { display: 'flex', flexDirection: 'column', gap: 8 },
  label: {
    fontSize: 13,
    fontWeight: 600,
    color: 'var(--text)',
    minHeight: 'unset',
  },
  input: {
    height: 44,
    padding: '0 14px',
    border: '1px solid var(--border)',
    borderRadius: 8,
    background: 'var(--bg-surface)',
    color: 'var(--text)',
    fontSize: 14,
    outline: 'none',
    transition: 'border-color 0.15s',
    width: '100%',
    minHeight: 44,
  },
  dotSelectWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    border: '1px solid var(--border)',
    borderRadius: 8,
    background: 'var(--bg-surface)',
    height: 44,
    paddingLeft: 12,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: '50%',
    flexShrink: 0,
    marginRight: 8,
  },
  dotSelect: {
    flex: 1,
    border: 'none',
    background: 'transparent',
    color: 'var(--text)',
    fontSize: 14,
    fontWeight: 500,
    outline: 'none',
    appearance: 'none',
    cursor: 'pointer',
    paddingRight: 32,
    height: '100%',
    minHeight: 'unset',
  },
  chevron: {
    position: 'absolute',
    right: 10,
    width: 16,
    height: 16,
    color: 'var(--text-muted)',
    pointerEvents: 'none',
  },
  textarea: {
    width: '100%',
    padding: '12px 14px',
    border: '1px solid var(--border)',
    borderRadius: 8,
    background: 'var(--bg-surface)',
    color: 'var(--text)',
    fontSize: 14,
    resize: 'vertical',
    outline: 'none',
    fontFamily: 'inherit',
    minHeight: 100,
    boxSizing: 'border-box',
  },
  actions: { display: 'flex', gap: 12, alignItems: 'center' },
  saveBtn: {
    background: '#4361ee',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    padding: '0 28px',
    height: 44,
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    minHeight: 44,
  },
  cancelBtn: {
    background: 'var(--bg-surface)',
    color: 'var(--text)',
    border: '1px solid var(--border)',
    borderRadius: 8,
    padding: '0 24px',
    height: 44,
    fontSize: 14,
    fontWeight: 500,
    cursor: 'pointer',
    minHeight: 44,
  },
};

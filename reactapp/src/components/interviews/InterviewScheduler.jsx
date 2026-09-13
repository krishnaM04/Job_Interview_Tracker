import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getInterviews, scheduleInterview } from '../../services/interviewService';

const EMPTY_FORM = {
  companyName: '', position: '', type: 'Phone',
  round: 1, scheduledDate: '', scheduledTime: '10:00 AM', timezone: 'EST',
};

export default function InterviewScheduler() {
  const navigate = useNavigate();
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState('');

  useEffect(() => {
    getInterviews()
      .then(res => setInterviews(Array.isArray(res.data) ? res.data : []))
      .catch(() => setInterviews([]))
      .finally(() => setLoading(false));
  }, []);

  const set = field => e => setForm(prev => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.companyName.trim() || !form.position.trim() || !form.scheduledDate) {
      setError('Company, Position and Date are required.');
      return;
    }
    setError('');
    try {
      const res = await scheduleInterview(form);
      setInterviews(prev => {
        const exists = prev.some(i => i.id === res.data.id);
        return exists ? prev : [...prev, res.data];
      });
      setShowModal(false);
      setForm(EMPTY_FORM);
    } catch {
      setError('Failed to schedule. Please try again.');
    }
  };

  const upcoming = interviews.filter(i =>
    ['Scheduled', 'SCHEDULED', 'scheduled'].includes(i.status)
  );
  const completed = interviews.filter(i =>
    ['Completed', 'COMPLETED', 'completed'].includes(i.status)
  );

  return (
    <div style={{ padding: '28px 24px', maxWidth: 1200 }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700, color: 'var(--text)' }}>
          Interview Scheduler
        </h1>
        <button style={primaryBtn} onClick={() => { setShowModal(true); setError(''); }}>
          ＋ Schedule Interview
        </button>
      </div>

      {loading ? (
        <div style={{ color: 'var(--text-muted)', padding: 40, textAlign: 'center' }}>Loading interviews…</div>
      ) : (
        <>
          {/* Upcoming */}
          <div style={card}>
            <h2 style={sectionTitle}>Upcoming Interviews ({upcoming.length})</h2>
            {upcoming.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: 14, padding: '12px 0' }}>No scheduled interviews yet.</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={table}>
                  <thead>
                    <tr style={theadRow}>
                      {['COMPANY', 'POSITION', 'TYPE', 'DATE', 'TIME', 'ACTION'].map(h => (
                        <th key={h} style={th}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {upcoming.map(iv => (
                      <tr key={iv.id} style={tbodyRow}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--bg)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <td style={td}>{iv.companyName}</td>
                        <td style={td}>{iv.position}</td>
                        <td style={td}>{iv.type}</td>
                        <td style={td}>{iv.scheduledDate}</td>
                        <td style={td}>{iv.scheduledTime}</td>
                        <td style={td}>
                          <button
                            style={prepBtn}
                            onClick={() => navigate(`/interviews/${iv.id}`)}
                          >
                            Prepare
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Completed */}
          <div style={card}>
            <h2 style={sectionTitle}>Completed Interviews ({completed.length})</h2>
            {completed.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: 14, padding: '12px 0' }}>No completed interviews yet.</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={table}>
                  <thead>
                    <tr style={theadRow}>
                      {['COMPANY', 'POSITION', 'TYPE', 'RATING', 'DATE'].map(h => (
                        <th key={h} style={th}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {completed.map(iv => (
                      <tr key={iv.id} style={tbodyRow}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--bg)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <td style={td}>{iv.companyName}</td>
                        <td style={td}>{iv.position}</td>
                        <td style={td}>{iv.type}</td>
                        <td style={{ ...td, color: '#4361ee', fontWeight: 600 }}>
                          {iv.rating ? `${iv.rating}/5` : 'N/A'}
                        </td>
                        <td style={td}>{iv.scheduledDate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      {/* Schedule Modal */}
      {showModal && (
        <div style={overlay} onClick={() => setShowModal(false)}>
          <div style={modal} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: 'var(--text)' }}>Schedule Interview</h2>
              <button onClick={() => setShowModal(false)} style={closeBtn}>✕</button>
            </div>

            {error && (
              <div style={errorBox}>{error}</div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { label: 'Company Name', field: 'companyName', type: 'text', placeholder: 'e.g. Google' },
                { label: 'Position', field: 'position', type: 'text', placeholder: 'e.g. Software Engineer' },
                { label: 'Date', field: 'scheduledDate', type: 'date' },
                { label: 'Time', field: 'scheduledTime', type: 'text', placeholder: 'e.g. 10:00 AM' },
              ].map(({ label, field, type, placeholder }) => (
                <div key={field}>
                  <label style={formLabel}>{label}</label>
                  <input
                    type={type}
                    style={formInput}
                    placeholder={placeholder}
                    value={form[field]}
                    onChange={set(field)}
                  />
                </div>
              ))}

              <div>
                <label style={formLabel}>Interview Type</label>
                <select style={formInput} value={form.type} onChange={set('type')}>
                  {['Phone', 'Video', 'In-Person', 'Technical', 'Panel'].map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={formLabel}>Round</label>
                <input
                  type="number" min={1} style={formInput}
                  value={form.round}
                  onChange={e => setForm(p => ({ ...p, round: parseInt(e.target.value) || 1 }))}
                />
              </div>

              <div>
                <label style={formLabel}>Timezone</label>
                <select style={formInput} value={form.timezone} onChange={set('timezone')}>
                  {['EST', 'CST', 'MST', 'Pacific', 'GMT'].map(tz => (
                    <option key={tz} value={tz}>{tz}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 6 }}>
                <button type="button" style={cancelBtn} onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" style={primaryBtn}>Schedule</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const card = {
  background: 'var(--bg-surface)', border: '1px solid var(--border)',
  borderRadius: 12, padding: '20px 24px', marginBottom: 20,
  boxShadow: 'var(--shadow)',
};
const sectionTitle = { margin: '0 0 16px', fontSize: 16, fontWeight: 700, color: 'var(--text)' };
const table = { width: '100%', borderCollapse: 'collapse', color: 'var(--text)', background: 'var(--bg-surface)' };
const theadRow = { background: 'var(--bg)', borderBottom: '2px solid var(--border)' };
const tbodyRow = { borderBottom: '1px solid var(--border)', transition: 'background 0.15s' };
const th = { padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px', color: 'var(--text)' };
const td = { padding: '14px 16px', fontSize: 14 };
const primaryBtn = {
  background: '#4361ee', color: '#fff', border: 'none',
  borderRadius: 8, padding: '10px 22px', fontSize: 14,
  fontWeight: 600, cursor: 'pointer', minHeight: 44,
};
const prepBtn = {
  background: '#4361ee', color: '#fff', border: 'none',
  borderRadius: 7, padding: '7px 18px', fontSize: 13,
  fontWeight: 600, cursor: 'pointer',
};
const overlay = {
  position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
  display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
};
const modal = {
  background: 'var(--bg-surface)', borderRadius: 12, padding: 28,
  width: '90%', maxWidth: 480, maxHeight: '90vh', overflowY: 'auto',
  boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
};
const closeBtn = { background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: 'var(--text-muted)' };
const formLabel = { display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 6 };
const formInput = {
  width: '100%', height: 44, padding: '0 12px', fontSize: 14,
  border: '1px solid var(--border)', borderRadius: 8,
  background: 'var(--bg-surface)', color: 'var(--text)',
  outline: 'none', boxSizing: 'border-box',
};
const cancelBtn = {
  background: 'var(--bg-surface)', color: 'var(--text)',
  border: '1px solid var(--border)', borderRadius: 8,
  padding: '10px 20px', fontSize: 14, fontWeight: 500, cursor: 'pointer',
};
const errorBox = {
  background: 'rgba(239,68,68,0.1)', border: '1px solid #ef4444',
  color: '#ef4444', borderRadius: 8, padding: '10px 14px',
  fontSize: 13, marginBottom: 14,
};

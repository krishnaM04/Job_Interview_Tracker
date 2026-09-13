import React, { useState, useEffect } from 'react';
import { getNotifications, markAsRead, markAllAsRead, archiveNotification } from '../../services/notificationService';

const TYPE_STYLE = {
  deadline: { color: '#ef4444', bg: 'rgba(239,68,68,0.1)', label: 'Deadline' },
  interview: { color: '#4361ee', bg: 'rgba(67,97,238,0.1)', label: 'Interview' },
  status:    { color: '#10b981', bg: 'rgba(16,185,129,0.1)', label: 'Status' },
  system:    { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', label: 'System' },
};

const STORE_KEY = 'local_notifications_state';

function loadState() {
  try { return JSON.parse(sessionStorage.getItem(STORE_KEY) || '{}'); }
  catch { return {}; }
}
function saveState(state) {
  sessionStorage.setItem(STORE_KEY, JSON.stringify(state));
}

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all | unread | read

  useEffect(() => {
    getNotifications()
      .then(res => {
        const data = Array.isArray(res.data) ? res.data : [];
        // Merge persisted read/archived state
        const state = loadState();
        const merged = data
          .filter(n => !state[n.id]?.archived)
          .map(n => ({ ...n, read: state[n.id]?.read ?? n.read }));
        setNotifications(merged);
      })
      .catch(() => setNotifications([]))
      .finally(() => setLoading(false));
  }, []);

  const persistState = (notifs) => {
    const state = loadState();
    notifs.forEach(n => {
      state[n.id] = { read: n.read, archived: false };
    });
    saveState(state);
  };

  const handleMarkRead = async (id) => {
    try { await markAsRead(id); } catch { /* local only */ }
    setNotifications(prev => {
      const updated = prev.map(n => n.id === id ? { ...n, read: true } : n);
      persistState(updated);
      return updated;
    });
  };

  const handleMarkAllRead = async () => {
    try { await markAllAsRead(); } catch { /* local only */ }
    setNotifications(prev => {
      const updated = prev.map(n => ({ ...n, read: true }));
      persistState(updated);
      return updated;
    });
  };

  const handleArchive = async (id) => {
    try { await archiveNotification(id); } catch { /* local only */ }
    const state = loadState();
    state[id] = { ...(state[id] || {}), archived: true };
    saveState(state);
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const filtered = notifications.filter(n => {
    if (filter === 'unread') return !n.read;
    if (filter === 'read') return n.read;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const fmtDate = (str) => {
    try { return new Date(str).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }); }
    catch { return str; }
  };

  return (
    <div style={{ padding: '28px 24px', maxWidth: 900 }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700, color: 'var(--text)' }}>
          Notifications {unreadCount > 0 && <span style={{ color: '#4361ee' }}>({unreadCount} new)</span>}
        </h1>
        {unreadCount > 0 && (
          <button style={markAllBtn} onClick={handleMarkAllRead}>
            ✓ Mark all as read
          </button>
        )}
      </div>

      {/* Filter tabs */}
      <div style={tabRow}>
        {[['all', 'All'], ['unread', 'Unread'], ['read', 'Read']].map(([val, label]) => (
          <button
            key={val}
            style={{ ...tab, ...(filter === val ? tabActive : {}) }}
            onClick={() => setFilter(val)}
          >
            {label}
            {val === 'unread' && unreadCount > 0 && (
              <span style={tabBadge}>{unreadCount}</span>
            )}
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div style={{ color: 'var(--text-muted)', padding: 40, textAlign: 'center' }}>Loading notifications…</div>
      ) : filtered.length === 0 ? (
        <div style={emptyBox}>
          <span style={{ fontSize: 32, marginBottom: 12 }}>🔔</span>
          <p style={{ margin: 0, fontSize: 15, color: 'var(--text-muted)' }}>No notifications here.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.map(n => {
            const ts = TYPE_STYLE[n.type] || TYPE_STYLE.system;
            return (
              <div key={n.id} style={{ ...notifCard, background: n.read ? 'var(--bg-surface)' : 'var(--bg-surface)', borderLeft: `4px solid ${n.read ? 'var(--border)' : ts.color}` }}>
                {/* Top row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ ...typeBadge, background: ts.bg, color: ts.color }}>
                      {ts.label}
                    </span>
                    {!n.read && <span style={newBadge}>NEW</span>}
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {!n.read && (
                      <button style={actionBtn} onClick={() => handleMarkRead(n.id)}>
                        Mark Read
                      </button>
                    )}
                    <button style={{ ...actionBtn, color: '#ef4444' }} onClick={() => handleArchive(n.id)}>
                      Archive
                    </button>
                  </div>
                </div>

                {/* Content */}
                <h3 style={{ margin: '0 0 6px', fontSize: 16, fontWeight: 700, color: 'var(--text)' }}>
                  {n.title}
                </h3>
                <p style={{ margin: '0 0 8px', fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  {n.message}
                </p>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{fmtDate(n.createdAt)}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const markAllBtn = {
  background: 'rgba(67,97,238,0.1)', color: '#4361ee',
  border: '1px solid rgba(67,97,238,0.3)', borderRadius: 8,
  padding: '8px 18px', fontSize: 13, fontWeight: 600, cursor: 'pointer',
};
const tabRow = {
  display: 'flex', gap: 4, marginBottom: 20,
  background: 'var(--bg-surface)', border: '1px solid var(--border)',
  borderRadius: 10, padding: 4, width: 'fit-content',
};
const tab = {
  padding: '8px 20px', borderRadius: 8, border: 'none',
  background: 'transparent', color: 'var(--text-muted)',
  fontSize: 13, fontWeight: 600, cursor: 'pointer',
  display: 'flex', alignItems: 'center', gap: 6,
  transition: 'all 0.15s',
};
const tabActive = {
  background: '#4361ee', color: '#fff',
  boxShadow: '0 2px 8px rgba(67,97,238,0.3)',
};
const tabBadge = {
  background: '#ef4444', color: '#fff',
  borderRadius: '50%', width: 18, height: 18,
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
  fontSize: 10, fontWeight: 700,
};
const notifCard = {
  background: 'var(--bg-surface)', border: '1px solid var(--border)',
  borderRadius: 12, padding: '18px 20px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  transition: 'box-shadow 0.2s',
};
const typeBadge = {
  padding: '3px 10px', borderRadius: 20,
  fontSize: 11, fontWeight: 700, textTransform: 'capitalize',
};
const newBadge = {
  color: '#4361ee', fontSize: 11, fontWeight: 800,
  letterSpacing: '0.5px',
};
const actionBtn = {
  background: 'none', border: 'none', color: '#4361ee',
  fontSize: 13, fontWeight: 600, cursor: 'pointer',
  padding: '4px 8px', borderRadius: 6,
};
const emptyBox = {
  display: 'flex', flexDirection: 'column', alignItems: 'center',
  justifyContent: 'center', padding: '60px 20px',
  background: 'var(--bg-surface)', border: '1px solid var(--border)',
  borderRadius: 12, textAlign: 'center',
};

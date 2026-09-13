import React, { useState, useEffect } from 'react';
import Card from '../base/Card';
import Button from '../base/Button';
import Badge from '../base/Badge';
import Stats from '../base/Stats';
import Table from '../base/Table';
import Modal from '../base/Modal';
import { getCounselorClients, scheduleGuidanceSession } from '../../services/counselorService';
import useAuth from '../../hooks/useAuth';

const CLIENT_KEY = 'local_clients';
function loadLocalClients() {
  try { return JSON.parse(sessionStorage.getItem(CLIENT_KEY)) || []; }
  catch { return []; }
}
function saveLocalClients(list) {
  sessionStorage.setItem(CLIENT_KEY, JSON.stringify(list));
}

const EMPTY_CLIENT = { name: '', email: '', phone: '', status: 'Active', notes: '' };
const EMPTY_SESSION = { topic: '', date: '', time: '', notes: '' };

export default function CounselorDashboard() {
  const { user } = useAuth();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showAddClient, setShowAddClient] = useState(false);
  const [clientForm, setClientForm] = useState(EMPTY_CLIENT);
  const [clientError, setClientError] = useState('');

  const [showSessionModal, setShowSessionModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [sessionFormData, setSessionFormData] = useState(EMPTY_SESSION);

  useEffect(() => {
    const loadClients = async () => {
      try {
        const local = loadLocalClients();
        if (user?.id) {
          const res = await getCounselorClients(user.id);
          const api = Array.isArray(res.data) ? res.data : [];
          const apiIds = new Set(api.map(c => String(c.id)));
          setClients([...api, ...local.filter(c => !apiIds.has(String(c.id)))]);
        } else {
          setClients(local);
        }
      } catch {
        setClients(loadLocalClients());
      } finally {
        setLoading(false);
      }
    };
    loadClients();
  }, [user?.id]);

  function handleAddClient(e) {
    e.preventDefault();
    if (!clientForm.name.trim() || !clientForm.email.trim()) {
      setClientError('Name and Email are required.');
      return;
    }
    const newClient = {
      ...clientForm,
      id: `local-${Date.now()}`,
      applications: 0,
      interviews: 0,
      conversionRate: 0,
      nextSession: null,
      lastActivity: new Date().toISOString(),
      sessions: [],
    };
    const updated = [...clients, newClient];
    setClients(updated);
    saveLocalClients([...loadLocalClients(), newClient]);
    setShowAddClient(false);
    setClientForm(EMPTY_CLIENT);
    setClientError('');
  }

  async function handleScheduleSession() {
    if (!selectedClient || !sessionFormData.topic || !sessionFormData.date) return;
    try {
      await scheduleGuidanceSession(user?.id, selectedClient.id, sessionFormData);
    } catch { /* ignore if backend down */ }
    setClients(clients.map(c =>
      c.id === selectedClient.id
        ? { ...c, sessions: [...(c.sessions || []), { ...sessionFormData, id: Date.now() }], nextSession: sessionFormData.date }
        : c
    ));
    setShowSessionModal(false);
    setSessionFormData(EMPTY_SESSION);
    setSelectedClient(null);
  }

  const tableColumns = [
    { key: 'name', label: 'Client Name', width: '15%' },
    { key: 'email', label: 'Email', width: '18%' },
    { key: 'status', label: 'Status', width: '12%' },
    { key: 'applications', label: 'Applications', width: '12%' },
    { key: 'interviews', label: 'Interviews', width: '12%' },
    { key: 'conversionRate', label: 'Conversion', width: '12%' },
    { key: 'nextSession', label: 'Next Session', width: '15%' },
    { key: 'actions', label: 'Actions', width: '4%' },
  ];

  const tableData = clients.map(client => ({
    ...client,
    status: <Badge variant={client.status === 'Active' ? 'success' : 'warning'}>{client.status}</Badge>,
    conversionRate: `${client.conversionRate || 0}%`,
    nextSession: client.nextSession ? new Date(client.nextSession).toLocaleDateString() : '—',
    actions: (
      <Button size="small" variant="ghost" onClick={() => { setSelectedClient(client); setShowSessionModal(true); }}>
        Schedule
      </Button>
    ),
  }));

  const totalClients = clients.length;
  const activeClients = clients.filter(c => c.status === 'Active').length;
  const avgConversionRate = clients.length > 0
    ? Math.round(clients.reduce((sum, c) => sum + (c.conversionRate || 0), 0) / clients.length)
    : 0;
  const upcomingSessions = clients.filter(c => c.nextSession && new Date(c.nextSession) > new Date()).length;

  if (loading) return <div style={{ padding: 20, color: 'var(--text)' }}>Loading dashboard...</div>;

  return (
    <div style={{ padding: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ color: 'var(--text)', margin: 0, fontSize: 28, fontWeight: 700 }}>Career Counselor Dashboard</h1>
        <Button variant="primary" onClick={() => setShowAddClient(true)}>+ Add Client</Button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 24 }}>
        <Stats title="Total Clients" value={totalClients} icon="👥" subtitle="Active and managed clients" />
        <Stats title="Active Clients" value={activeClients} icon="✅" subtitle="Currently job searching" />
        <Stats title="Avg Conversion Rate" value={`${avgConversionRate}%`} icon="📈" subtitle="Client application success" />
        <Stats title="Upcoming Sessions" value={upcomingSessions} icon="📅" subtitle="Scheduled guidance sessions" />
      </div>

      {/* Client Portfolio */}
      <Card title="Client Portfolio">
        <div style={{ padding: 16 }}>
          {clients.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text-muted)' }}>
              <p style={{ marginBottom: 16 }}>No clients yet. Add your first client to get started.</p>
              <Button variant="primary" onClick={() => setShowAddClient(true)}>+ Add Client</Button>
            </div>
          ) : (
            <Table columns={tableColumns} data={tableData} searchable sortable pageSize={15} />
          )}
        </div>
      </Card>

      {/* Client Alerts */}
      <Card title="Client Alerts" style={{ marginTop: 16 }}>
        <div style={{ padding: 16 }}>
          {clients.filter(c => new Date(c.lastActivity) < new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {clients
                .filter(c => new Date(c.lastActivity) < new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
                .map(client => (
                  <div key={client.id} style={{ padding: 12, backgroundColor: '#fff3cd', border: '1px solid #ffc107', borderRadius: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#856404' }}>⚠️ {client.name} hasn't updated progress in 30+ days</span>
                    <Button size="small" variant="primary">Reach Out</Button>
                  </div>
                ))}
            </div>
          ) : (
            <p style={{ color: 'var(--text)', opacity: 0.7, margin: 0 }}>No urgent alerts. All clients are engaged.</p>
          )}
        </div>
      </Card>

      {/* Add Client Modal */}
      <Modal isOpen={showAddClient} onClose={() => { setShowAddClient(false); setClientForm(EMPTY_CLIENT); setClientError(''); }} title="Add New Client" size="medium">
        <form onSubmit={handleAddClient} style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: '8px 0' }}>
          {clientError && (
            <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid #ef4444', color: '#ef4444', borderRadius: 6, padding: '10px 14px', fontSize: 13 }}>
              {clientError}
            </div>
          )}
          <div style={f.field}>
            <label style={f.label}>Full Name *</label>
            <input style={f.input} placeholder="e.g. Jane Smith" value={clientForm.name} onChange={e => setClientForm({ ...clientForm, name: e.target.value })} required />
          </div>
          <div style={f.field}>
            <label style={f.label}>Email *</label>
            <input style={f.input} type="email" placeholder="e.g. jane@example.com" value={clientForm.email} onChange={e => setClientForm({ ...clientForm, email: e.target.value })} required />
          </div>
          <div style={f.field}>
            <label style={f.label}>Phone</label>
            <input style={f.input} placeholder="e.g. +1 555 000 0000" value={clientForm.phone} onChange={e => setClientForm({ ...clientForm, phone: e.target.value })} />
          </div>
          <div style={f.field}>
            <label style={f.label}>Status</label>
            <select style={f.input} value={clientForm.status} onChange={e => setClientForm({ ...clientForm, status: e.target.value })}>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="On Hold">On Hold</option>
            </select>
          </div>
          <div style={f.field}>
            <label style={f.label}>Notes</label>
            <textarea style={{ ...f.input, minHeight: 80, resize: 'vertical' }} placeholder="Any initial notes..." value={clientForm.notes} onChange={e => setClientForm({ ...clientForm, notes: e.target.value })} />
          </div>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 8 }}>
            <Button variant="ghost" type="button" onClick={() => { setShowAddClient(false); setClientForm(EMPTY_CLIENT); setClientError(''); }}>Cancel</Button>
            <Button variant="primary" type="submit">Add Client</Button>
          </div>
        </form>
      </Modal>

      {/* Schedule Session Modal */}
      {showSessionModal && selectedClient && (
        <Modal isOpen={showSessionModal} title={`Schedule Session — ${selectedClient.name}`} onClose={() => { setShowSessionModal(false); setSelectedClient(null); setSessionFormData(EMPTY_SESSION); }}>
          <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={f.field}>
              <label style={f.label}>Session Topic</label>
              <select style={f.input} value={sessionFormData.topic} onChange={e => setSessionFormData({ ...sessionFormData, topic: e.target.value })}>
                <option value="">Select topic...</option>
                {['Resume Review', 'Interview Prep', 'Salary Negotiation', 'Career Strategy', 'Application Review', 'Other'].map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div style={f.field}>
              <label style={f.label}>Date</label>
              <input type="date" style={f.input} value={sessionFormData.date} onChange={e => setSessionFormData({ ...sessionFormData, date: e.target.value })} />
            </div>
            <div style={f.field}>
              <label style={f.label}>Time</label>
              <input type="time" style={f.input} value={sessionFormData.time} onChange={e => setSessionFormData({ ...sessionFormData, time: e.target.value })} />
            </div>
            <div style={f.field}>
              <label style={f.label}>Notes</label>
              <textarea style={{ ...f.input, minHeight: 80, resize: 'vertical' }} placeholder="Add agenda items..." value={sessionFormData.notes} onChange={e => setSessionFormData({ ...sessionFormData, notes: e.target.value })} />
            </div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 16 }}>
              <Button variant="ghost" onClick={() => { setShowSessionModal(false); setSelectedClient(null); setSessionFormData(EMPTY_SESSION); }}>Cancel</Button>
              <Button variant="primary" onClick={handleScheduleSession}>Schedule Session</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

const f = {
  field: { display: 'flex', flexDirection: 'column', gap: 6 },
  label: { fontSize: 13, fontWeight: 600, color: 'var(--text)', minHeight: 'unset' },
  input: {
    padding: '10px 12px', border: '1px solid var(--border)', borderRadius: 8,
    background: 'var(--bg-surface)', color: 'var(--text)', fontSize: 14,
    outline: 'none', width: '100%', minHeight: 44, fontFamily: 'inherit',
  },
};

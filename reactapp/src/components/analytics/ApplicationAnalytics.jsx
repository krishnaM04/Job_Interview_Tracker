import React, { useState, useEffect } from 'react';
import {
  PieChart, Pie, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import { localStore } from '../../utils/localStore';
import mockData from '../../api/mockData';

const COLORS = ['#4361ee', '#f59e0b', '#8b5cf6', '#3b82f6', '#10b981', '#059669', '#ef4444'];

const STATUS_LIST = [
  'Applied', 'Under Review', 'Interview Scheduled',
  'Interview Completed', 'Offer Received', 'Accepted', 'Rejected'
];

const STATUS_NORM = {
  APPLIED: 'Applied', UNDER_REVIEW: 'Under Review',
  INTERVIEW_SCHEDULED: 'Interview Scheduled', INTERVIEW_COMPLETED: 'Interview Completed',
  OFFER_RECEIVED: 'Offer Received', ACCEPTED: 'Accepted', REJECTED: 'Rejected',
};

function exportCSV(apps) {
  const headers = ['Company', 'Position', 'Status', 'Priority', 'Application Date', 'Deadline'];
  const rows = apps.map(a => [
    a.company || a.companyName || '',
    a.positionTitle || a.position || '',
    STATUS_NORM[a.status] || a.status || '',
    a.priority || '',
    a.applicationDate || a.appliedDate || '',
    a.deadline || '',
  ]);
  const csv = [headers, ...rows].map(r => r.map(v => `"${v}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'applications.csv'; a.click();
  URL.revokeObjectURL(url);
}

export default function ApplicationAnalytics() {
  const [allApps, setAllApps] = useState([]);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    // Merge mockData + localStore
    const mock = (mockData.applications || []).map(a => ({
      ...a,
      company: a.companyName,
      positionTitle: a.position,
      applicationDate: a.appliedDate,
      status: Object.keys(STATUS_NORM).find(k =>
        STATUS_NORM[k].toLowerCase() === (a.status || '').toLowerCase()
      ) || a.status,
    }));
    const local = localStore.getAll();
    const mockIds = new Set(mock.map(a => String(a.id)));
    setAllApps([...mock, ...local.filter(a => !mockIds.has(String(a.id)))]);
  }, []);

  // Apply filters
  const filtered = allApps.filter(a => {
    const date = a.applicationDate || a.appliedDate || '';
    if (dateFrom && date && date < dateFrom) return false;
    if (dateTo && date && date > dateTo) return false;
    if (statusFilter !== 'All') {
      const norm = STATUS_NORM[a.status] || a.status;
      if (norm !== statusFilter) return false;
    }
    return true;
  });

  // Stats
  const totalApps = filtered.length;
  const totalInterviews = mockData.interviews?.length || 0;
  const offers = filtered.filter(a => ['OFFER_RECEIVED', 'ACCEPTED'].includes(a.status)).length;
  const convRate = totalApps > 0 ? Math.round((offers / totalApps) * 100) : 0;
  const ivOffers = totalInterviews > 0 ? Math.round((offers / totalInterviews) * 100) : 0;

  // Bar chart data
  const statusCounts = STATUS_LIST.map(label => ({
    name: label,
    count: filtered.filter(a => (STATUS_NORM[a.status] || a.status) === label).length,
  }));

  // Pie chart data — industry breakdown
  const industryMap = {};
  filtered.forEach(a => {
    const ind = a.industry || 'Other';
    industryMap[ind] = (industryMap[ind] || 0) + 1;
  });
  const industryData = Object.entries(industryMap).map(([name, value]) => ({ name, value }));

  const clearFilters = () => { setDateFrom(''); setDateTo(''); setStatusFilter('All'); };

  return (
    <div style={{ padding: '28px 24px', maxWidth: 1200 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700, color: 'var(--text)' }}>Application Analytics</h1>
        <button style={exportBtn} onClick={() => exportCSV(filtered)}>⬇ Export CSV</button>
      </div>

      {/* Filters */}
      <div style={filterCard}>
        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>Filters</span>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <label style={filterLabel}>From</label>
            <input type="date" style={filterInput} value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <label style={filterLabel}>To</label>
            <input type="date" style={filterInput} value={dateTo} onChange={e => setDateTo(e.target.value)} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <label style={filterLabel}>Status</label>
            <select style={filterInput} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <option value="All">All</option>
              {STATUS_LIST.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          {(dateFrom || dateTo || statusFilter !== 'All') && (
            <button style={clearBtn} onClick={clearFilters}>✕ Clear</button>
          )}
        </div>
        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
          Showing {filtered.length} of {allApps.length} applications
        </span>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'Total Applications', value: totalApps, icon: '📄', color: '#4361ee' },
          { label: 'Total Interviews', value: totalInterviews, icon: '📋', color: '#3b82f6' },
          { label: 'Conversion Rate', value: `${convRate}%`, icon: '📈', color: '#10b981' },
          { label: 'Interview-to-Offer', value: `${ivOffers}%`, icon: '🎉', color: '#f59e0b' },
        ].map(({ label, value, icon, color }) => (
          <div key={label} style={{ ...statCard, borderLeftColor: color }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <span style={{ fontSize: 22 }}>{icon}</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.4px' }}>{label}</span>
            </div>
            <div style={{ fontSize: 32, fontWeight: 700, color: 'var(--text)' }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        {/* Pie */}
        <div style={chartCard}>
          <h3 style={chartTitle}>Success Rate by Industry</h3>
          {industryData.length === 0 ? (
            <div style={empty}>No industry data available.</div>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={industryData} cx="50%" cy="50%"
                  outerRadius={90} dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {industryData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Status summary table */}
        <div style={chartCard}>
          <h3 style={chartTitle}>Status Breakdown</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border)' }}>
                <th style={tth}>Status</th>
                <th style={{ ...tth, textAlign: 'right' }}>Count</th>
                <th style={{ ...tth, textAlign: 'right' }}>%</th>
              </tr>
            </thead>
            <tbody>
              {statusCounts.filter(s => s.count > 0).map(s => (
                <tr key={s.name} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={ttd}>{s.name}</td>
                  <td style={{ ...ttd, textAlign: 'right', fontWeight: 600 }}>{s.count}</td>
                  <td style={{ ...ttd, textAlign: 'right', color: 'var(--text-muted)' }}>
                    {totalApps > 0 ? Math.round((s.count / totalApps) * 100) : 0}%
                  </td>
                </tr>
              ))}
              {statusCounts.every(s => s.count === 0) && (
                <tr><td colSpan={3} style={{ ...ttd, color: 'var(--text-muted)', textAlign: 'center' }}>No data</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bar chart */}
      <div style={chartCard}>
        <h3 style={chartTitle}>Applications by Status</h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={statusCounts} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="name" tick={{ fontSize: 12, fill: 'var(--text-muted)' }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: 'var(--text-muted)' }} />
            <Tooltip
              contentStyle={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 8 }}
              labelStyle={{ color: 'var(--text)', fontWeight: 600 }}
            />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {statusCounts.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

const exportBtn = {
  background: '#4361ee', color: '#fff', border: 'none',
  borderRadius: 8, padding: '10px 20px', fontSize: 14,
  fontWeight: 600, cursor: 'pointer', minHeight: 44,
};
const filterCard = {
  background: 'var(--bg-surface)', border: '1px solid var(--border)',
  borderRadius: 12, padding: '16px 20px', marginBottom: 24,
  display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap',
  boxShadow: 'var(--shadow)',
};
const filterLabel = { fontSize: 13, fontWeight: 600, color: 'var(--text)', whiteSpace: 'nowrap' };
const filterInput = {
  height: 38, padding: '0 10px', fontSize: 13,
  border: '1px solid var(--border)', borderRadius: 7,
  background: 'var(--bg-surface)', color: 'var(--text)', outline: 'none',
};
const clearBtn = {
  background: 'rgba(239,68,68,0.1)', color: '#ef4444',
  border: '1px solid #ef4444', borderRadius: 7,
  padding: '6px 14px', fontSize: 13, fontWeight: 600, cursor: 'pointer',
};
const statCard = {
  background: 'var(--bg-surface)', border: '1px solid var(--border)',
  borderLeft: '4px solid #4361ee', borderRadius: 10,
  padding: '20px 24px', boxShadow: 'var(--shadow)',
};
const chartCard = {
  background: 'var(--bg-surface)', border: '1px solid var(--border)',
  borderRadius: 12, padding: '20px 24px', boxShadow: 'var(--shadow)',
};
const chartTitle = { margin: '0 0 16px', fontSize: 15, fontWeight: 700, color: 'var(--text)' };
const empty = { color: 'var(--text-muted)', fontSize: 14, textAlign: 'center', padding: '40px 0' };
const tth = { padding: '8px 12px', textAlign: 'left', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' };
const ttd = { padding: '10px 12px', fontSize: 13, color: 'var(--text)' };

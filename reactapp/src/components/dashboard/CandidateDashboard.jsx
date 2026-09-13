import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { createApi } from '../../api/axiosInstance';
import StatCard from './StatCard';
import ApplicationLifecycle from './ApplicationLifecycle';
import UpcomingInterviewsWidget from './UpcomingInterviewsWidget';
import QuickAccess from './QuickAccess';
import { localStore } from '../../utils/localStore';

import mockData from '../../api/mockData';

const FALLBACK_ANALYTICS = { totalApplications: 0, applicationConversionRate: 0 };
const FALLBACK_APPS = [];

function getLocalInterviews() {
  try { return JSON.parse(sessionStorage.getItem('local_interviews') || '[]'); }
  catch { return []; }
}

// Merge mockData interviews + local interviews as fallback
function getFallbackInterviews() {
  const local = getLocalInterviews();
  const mock = mockData.interviews || [];
  const localIds = new Set(local.map(i => String(i.id)));
  return [...mock.filter(i => !localIds.has(String(i.id))), ...local];
}

export default function CandidateDashboard() {
  const auth = useAuth();
  const navigate = useNavigate();

  const [analytics, setAnalytics] = useState(FALLBACK_ANALYTICS);
  const [applications, setApplications] = useState(FALLBACK_APPS);
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const localApps = localStore.getAll();
    const fallbackInterviews = getFallbackInterviews();

    if (!auth?.token) {
      setApplications(localApps);
      setInterviews(fallbackInterviews);
      setLoading(false);
      return;
    }

    const api = createApi(auth.token, auth.logout);
    let mounted = true;

    async function load() {
      try {
        const [analyticsRes, appsRes, interviewsRes] = await Promise.allSettled([
          api.get('/analytics/candidate'),
          api.get('/applications/search', { params: { page: 0, size: 100 } }),
          api.get('/interviews'),
        ]);
        if (!mounted) return;
        if (analyticsRes.status === 'fulfilled') setAnalytics(analyticsRes.value.data || FALLBACK_ANALYTICS);

        if (appsRes.status === 'fulfilled') {
          const d = appsRes.value.data;
          const apiApps = Array.isArray(d) ? d : Array.isArray(d?.content) ? d.content : [];
          const merged = [...apiApps];
          localApps.forEach(a => { if (!merged.find(x => x.id === a.id)) merged.push(a); });
          setApplications(merged);
        } else { setApplications(localApps); }

        if (interviewsRes.status === 'fulfilled') {
          const d = interviewsRes.value.data;
          const apiIvs = Array.isArray(d) ? d : Array.isArray(d?.content) ? d.content : [];
          const merged = [...apiIvs];
          fallbackInterviews.forEach(i => { if (!merged.find(x => x.id === i.id)) merged.push(i); });
          setInterviews(merged);
        } else { setInterviews(fallbackInterviews); }
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, [auth]);

  const upcomingInterviews = interviews
    .filter(i => ['Scheduled', 'SCHEDULED', 'scheduled'].includes(i.status))
    .sort((a, b) => new Date(a.scheduledDate || a.date) - new Date(b.scheduledDate || b.date));

  const applicationStats = {
    'Applied': applications.filter(a => ['Applied', 'APPLIED'].includes(a.status)).length,
    'Under Review': applications.filter(a => ['Under Review', 'UNDER_REVIEW'].includes(a.status)).length,
    'Interview Scheduled': applications.filter(a => ['Interview Scheduled', 'INTERVIEW_SCHEDULED'].includes(a.status)).length,
    'Offer Received': applications.filter(a => ['Offer Received', 'OFFER_RECEIVED'].includes(a.status)).length,
  };

  const totalApps = analytics.totalApplications || applications.length || 0;
  const offersCount = applications.filter(a =>
    ['Offer Received', 'OFFER_RECEIVED', 'Accepted', 'ACCEPTED'].includes(a.status)
  ).length;
  const successRate = analytics.applicationConversionRate
    ? Math.round(analytics.applicationConversionRate)
    : totalApps > 0 ? Math.round((offersCount / totalApps) * 100) : 0;

  const roleLabel = auth?.user?.role === 'PREMIUM_CANDIDATE' ? 'Premium Candidate'
    : auth?.user?.role === 'STANDARD_CANDIDATE' ? 'Standard Candidate' : 'Candidate';

  if (loading) {
    return (
      <div style={{ padding: 40, textAlign: 'center', color: '#a0a0b0' }}>
        Loading dashboard…
      </div>
    );
  }

  return (
    <div style={s.page}>

      {/* Header card */}
      <div style={s.headerCard}>
        <div style={s.headerLeft}>
          <div style={s.headerIcon}>💼</div>
          <div>
            <h1 style={s.headerTitle}>Job Interview Tracker</h1>
            <p style={s.headerSub}>Candidate Dashboard · {roleLabel}</p>
          </div>
        </div>
        <div style={s.headerRight}>
          <button onClick={() => navigate('/notifications')} style={s.bellBtn} aria-label="Notifications">
            🔔
            {upcomingInterviews.length > 0 && (
              <span style={s.bellBadge}>{upcomingInterviews.length}</span>
            )}
          </button>
          <button onClick={() => navigate('/applications/new')} style={s.newBtn}>
            ✦ New Application
          </button>
        </div>
      </div>

      {/* Stat cards */}
      <div style={s.statsGrid}>
        <StatCard label="Active Applications"   value={totalApps}           sublabel={`${totalApps} this month`}  accent="#f59e0b" />
        <StatCard label="Interviews This Week"  value={upcomingInterviews.length} sublabel={upcomingInterviews.length === 0 ? 'none scheduled' : 'scheduled'} accent="#3b82f6" />
        <StatCard label="Success Rate"          value={`${successRate}%`}   sublabel={offersCount === 0 ? 'no offers yet' : `${offersCount} offer${offersCount > 1 ? 's' : ''}`} accent="#10b981" />
        <StatCard label="Profile Completeness"  value="85%"                 sublabel="almost there"               accent="#8b5cf6" />
      </div>

      {/* Main grid */}
      <div style={s.mainGrid}>
        <ApplicationLifecycle stats={applicationStats} total={totalApps} />
        <UpcomingInterviewsWidget interviews={upcomingInterviews} onAddInterview={() => navigate('/interviews')} />
      </div>

      {/* Quick access */}
      <QuickAccess />
    </div>
  );
}

const s = {
  page: {
    padding: '28px 24px',
    maxWidth: 1400,
    margin: '0 auto',
    minHeight: '100vh',
  },
  headerCard: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    background: 'var(--bg-surface)', border: '1px solid var(--border)',
    borderRadius: 16, padding: '22px 28px', marginBottom: 24,
    boxShadow: '0 4px 24px rgba(0,0,0,0.18)', flexWrap: 'wrap', gap: 12,
  },
  headerLeft: { display: 'flex', alignItems: 'center', gap: 16 },
  headerIcon: {
    width: 52, height: 52, borderRadius: 14,
    background: 'linear-gradient(135deg,#f59e0b,#d97706)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 24, flexShrink: 0, boxShadow: '0 4px 12px rgba(245,158,11,0.35)',
  },
  headerTitle: { margin: 0, fontSize: 24, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.5px' },
  headerSub: { margin: '3px 0 0', fontSize: 13, color: 'var(--text-muted)', fontWeight: 500 },
  headerRight: { display: 'flex', alignItems: 'center', gap: 12 },
  bellBtn: {
    position: 'relative', width: 44, height: 44, borderRadius: 10,
    border: '1px solid var(--border)', background: 'var(--bg-surface)',
    cursor: 'pointer', fontSize: 18,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  bellBadge: {
    position: 'absolute', top: -5, right: -5,
    background: '#ef4444', color: '#fff',
    width: 17, height: 17, borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 10, fontWeight: 700,
  },
  newBtn: {
    background: 'linear-gradient(135deg,#7c3aed,#4f46e5)',
    color: '#fff', border: 'none', borderRadius: 24,
    padding: '11px 24px', fontWeight: 700, fontSize: 14,
    cursor: 'pointer', minHeight: 44,
    boxShadow: '0 4px 16px rgba(124,58,237,0.4)',
    letterSpacing: '0.2px',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
    gap: 16, marginBottom: 24,
  },
  mainGrid: {
    display: 'grid',
    gridTemplateColumns: '1.5fr 1fr',
    gap: 20, marginBottom: 28,
  },
};

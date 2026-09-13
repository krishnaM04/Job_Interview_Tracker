import React, { useState, useEffect } from 'react';
import Card from '../base/Card';
import Badge from '../base/Badge';
import Stats from '../base/Stats';
import { getMarketInsights } from '../../services/analyticsService';

export default function MarketInsights() {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInsights = async () => {
      try {
        const res = await getMarketInsights();
        setInsights(res.data);
      } catch (error) {
        console.error('Failed to load insights:', error);
      } finally {
        setLoading(false);
      }
    };
    loadInsights();
  }, []);

  if (loading) return <div style={{ padding: '20px', color: 'var(--text)' }}>Loading market insights...</div>;
  if (!insights) return <div style={{ padding: '20px', color: 'var(--text)' }}>No data available</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ color: 'var(--text)' }}>Market Insights</h1>

      {/* Top Roles */}
      <Card title="Top In-Demand Roles" style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {insights.topRoles.map((role, idx) => (
            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', backgroundColor: 'var(--bg)', borderRadius: '6px' }}>
              <div>
                <div style={{ fontWeight: '600', color: 'var(--text)' }}>{idx + 1}. {role.role}</div>
                <div style={{ fontSize: '13px', color: 'var(--text)', opacity: 0.7 }}>
                  {role.demand.toLocaleString()} openings • Avg ${role.avgSalary.toLocaleString()}
                </div>
              </div>
              <Badge variant={role.trend === 'up' ? 'success' : 'warning'}>{role.trend === 'up' ? '↑ Growing' : '→ Stable'}</Badge>
            </div>
          ))}
        </div>
      </Card>

      {/* Top Skills */}
      <Card title="Most Requested Skills" style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {insights.topSkills.map((skill, idx) => (
            <Badge key={idx} variant="primary">
              {skill.skill} ({skill.count.toLocaleString()})
            </Badge>
          ))}
        </div>
      </Card>

      {/* Salary Ranges */}
      <Card title="Salary Ranges by Experience">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          {Object.entries(insights.salaryRanges).map(([level, range]) => (
            <div key={level} style={{ padding: '12px', backgroundColor: 'var(--bg)', borderRadius: '6px' }}>
              <div style={{ fontWeight: '600', color: 'var(--text)', marginBottom: '8px' }}>{level}</div>
              <div style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--accent)' }}>
                ${range.min.toLocaleString()} - ${range.max.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Hiring Season */}
      <Card>
        <Stats
          label="Peak Hiring Season"
          value={insights.hiringSeason}
          icon="📅"
          color="success"
          sublabel="Best time to apply"
        />
      </Card>
    </div>
  );
}

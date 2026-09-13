import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Card from '../base/Card';
import Button from '../base/Button';
import Badge from '../base/Badge';
import Breadcrumb from '../base/Breadcrumb';
import { getInterviewPrep } from '../../services/interviewService';

export default function InterviewPrep() {
  const { id } = useParams();
  const [prep, setPrep] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('company');
  const [completedItems, setCompletedItems] = useState(new Set());

  useEffect(() => {
    const loadPrep = async () => {
      try {
        const res = await getInterviewPrep(id);
        setPrep(res.data);
      } catch (error) {
        console.error('Failed to load interview prep:', error);
      } finally {
        setLoading(false);
      }
    };
    loadPrep();
  }, [id]);

  const toggleCompleted = (item) => {
    const newCompleted = new Set(completedItems);
    if (newCompleted.has(item)) {
      newCompleted.delete(item);
    } else {
      newCompleted.add(item);
    }
    setCompletedItems(newCompleted);
  };

  if (loading) {
    return <div style={{ padding: '20px', color: 'var(--text)' }}>Loading interview preparation...</div>;
  }

  if (!prep) {
    return (
      <div style={{ padding: '28px 24px' }}>
        <button
          onClick={() => window.history.back()}
          style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontSize: 14, marginBottom: 16 }}
        >
          ← Back to Interviews
        </button>
        <div style={{ color: 'var(--text-muted)', fontSize: 14 }}>Interview preparation data not found.</div>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <Breadcrumb links={[
        { label: 'Interviews', href: '/interviews' },
        { label: 'Interview Prep' }
      ]} />

      <div style={{ marginBottom: '20px', marginTop: '12px' }}>
        <h1 style={{ color: 'var(--text)', margin: '0 0 8px 0' }}>
          Interview Preparation: {prep.position} at {prep.company}
        </h1>
        <p style={{ color: 'var(--text)', opacity: 0.7, margin: 0 }}>
          Scheduled for {new Date(prep.interviewDate).toLocaleDateString()} • {prep.interviewType}
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', borderBottom: '1px solid var(--border)' }}>
        {['company', 'questions', 'checklist', 'resources'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '12px 16px',
              border: 'none',
              background: activeTab === tab ? 'var(--accent)' : 'transparent',
              color: activeTab === tab ? 'white' : 'var(--text)',
              cursor: 'pointer',
              fontSize: '14px',
              borderBottom: activeTab === tab ? '2px solid var(--accent)' : 'none'
            }}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Company Research Tab */}
      {activeTab === 'company' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '16px' }}>
          <Card title="Company Overview">
            <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ color: 'var(--text)', fontWeight: 'bold', fontSize: '12px' }}>Founded</label>
                <p style={{ color: 'var(--text)', margin: 0 }}>{prep.companyInfo?.founded || 'N/A'}</p>
              </div>
              <div>
                <label style={{ color: 'var(--text)', fontWeight: 'bold', fontSize: '12px' }}>Headquarters</label>
                <p style={{ color: 'var(--text)', margin: 0 }}>{prep.companyInfo?.headquarters || 'N/A'}</p>
              </div>
              <div>
                <label style={{ color: 'var(--text)', fontWeight: 'bold', fontSize: '12px' }}>Employees</label>
                <p style={{ color: 'var(--text)', margin: 0 }}>{prep.companyInfo?.employees || 'N/A'}</p>
              </div>
              <div>
                <label style={{ color: 'var(--text)', fontWeight: 'bold', fontSize: '12px' }}>Industry</label>
                <p style={{ color: 'var(--text)', margin: 0 }}>{prep.companyInfo?.industry || 'N/A'}</p>
              </div>
            </div>
          </Card>

          <Card title="Key Points to Know">
            <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {(prep.companyInfo?.keyPoints || []).map((point, idx) => (
                <div key={idx} style={{ padding: '12px', backgroundColor: 'var(--bg)', borderRadius: '4px', color: 'var(--text)' }}>
                  <span style={{ color: 'var(--accent)', fontWeight: 'bold' }}>•</span> {point}
                </div>
              ))}
            </div>
          </Card>

          <Card title="Recent News">
            <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {(prep.companyInfo?.recentNews || []).map((news, idx) => (
                <div key={idx} style={{ padding: '12px', borderBottom: '1px solid var(--border)' }}>
                  <p style={{ color: 'var(--text)', fontWeight: 'bold', marginBottom: '4px', margin: 0 }}>{news.title}</p>
                  <p style={{ color: 'var(--text)', opacity: 0.7, fontSize: '12px', margin: 0 }}>{news.date}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card title="Culture & Values">
            <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {(prep.companyInfo?.values || []).map((value, idx) => (
                <Badge key={idx} variant="primary" style={{ display: 'inline-block', marginBottom: '8px' }}>
                  {value}
                </Badge>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Questions Tab */}
      {activeTab === 'questions' && (
        <Card title="Interview Question Bank">
          <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {(prep.questions || []).map((q, idx) => (
              <div key={idx} style={{ padding: '12px', backgroundColor: 'var(--bg)', borderRadius: '4px', borderLeft: '4px solid var(--accent)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <h4 style={{ color: 'var(--text)', margin: '0 0 8px 0' }}>{q.question}</h4>
                  <Badge variant={q.difficulty}>{q.difficulty}</Badge>
                </div>
                <details style={{ cursor: 'pointer' }}>
                  <summary style={{ color: 'var(--accent)', fontWeight: 'bold', marginBottom: '8px' }}>
                    Suggested Answer
                  </summary>
                  <p style={{ color: 'var(--text)', opacity: 0.8, marginTop: '8px', marginBottom: 0 }}>
                    {q.suggestedAnswer}
                  </p>
                </details>
                {q.tips && (
                  <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid var(--border)' }}>
                    <p style={{ color: 'var(--text)', fontWeight: 'bold', fontSize: '12px', margin: '0 0 4px 0' }}>Tips:</p>
                    <p style={{ color: 'var(--text)', opacity: 0.8, fontSize: '12px', margin: 0 }}>
                      {q.tips}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Prep Checklist Tab */}
      {activeTab === 'checklist' && (
        <Card title="Pre-Interview Checklist">
          <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {(prep.checklist || []).map((item, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px',
                  backgroundColor: completedItems.has(item) ? 'rgba(130, 202, 157, 0.1)' : 'var(--bg)',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  textDecoration: completedItems.has(item) ? 'line-through' : 'none'
                }}
                onClick={() => toggleCompleted(item)}
              >
                <input
                  type="checkbox"
                  checked={completedItems.has(item)}
                  onChange={() => toggleCompleted(item)}
                  style={{ cursor: 'pointer', width: '20px', height: '20px' }}
                />
                <span style={{ color: 'var(--text)', flex: 1 }}>{item}</span>
              </div>
            ))}
            <div style={{ marginTop: '12px', padding: '12px', backgroundColor: 'var(--bg)', borderRadius: '4px' }}>
              <p style={{ color: 'var(--text)', opacity: 0.7, margin: 0 }}>
                Progress: {completedItems.size} of {prep.checklist?.length || 0} items completed
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Resources Tab */}
      {activeTab === 'resources' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '16px' }}>
          <Card title="Study Materials">
            <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {(prep.materials || []).map((material, idx) => (
                <a
                  key={idx}
                  href={material.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    padding: '12px',
                    backgroundColor: 'var(--bg)',
                    border: '1px solid var(--border)',
                    borderRadius: '4px',
                    color: 'var(--accent)',
                    textDecoration: 'none',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <span>{material.title}</span>
                  <span>→</span>
                </a>
              ))}
            </div>
          </Card>

          <Card title="Practice Resources">
            <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Button variant="primary" size="small" style={{ width: '100%' }}>
                💻 LeetCode Problems
              </Button>
              <Button variant="primary" size="small" style={{ width: '100%' }}>
                📚 System Design Resources
              </Button>
              <Button variant="primary" size="small" style={{ width: '100%' }}>
                🎤 Mock Interview Practice
              </Button>
              <Button variant="primary" size="small" style={{ width: '100%' }}>
                📖 Behavioral Questions
              </Button>
            </div>
          </Card>

          <Card title="Preparation Timeline">
            <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ padding: '12px', backgroundColor: 'var(--bg)', borderRadius: '4px', borderLeft: '4px solid var(--accent)' }}>
                <p style={{ color: 'var(--text)', fontWeight: 'bold', margin: '0 0 4px 0' }}>1-2 weeks before</p>
                <p style={{ color: 'var(--text)', opacity: 0.7, fontSize: '12px', margin: 0 }}>Company research, role understanding</p>
              </div>
              <div style={{ padding: '12px', backgroundColor: 'var(--bg)', borderRadius: '4px', borderLeft: '4px solid var(--accent)' }}>
                <p style={{ color: 'var(--text)', fontWeight: 'bold', margin: '0 0 4px 0' }}>3-5 days before</p>
                <p style={{ color: 'var(--text)', opacity: 0.7, fontSize: '12px', margin: 0 }}>Technical prep, mock interviews</p>
              </div>
              <div style={{ padding: '12px', backgroundColor: 'var(--bg)', borderRadius: '4px', borderLeft: '4px solid var(--accent)' }}>
                <p style={{ color: 'var(--text)', fontWeight: 'bold', margin: '0 0 4px 0' }}>Day before</p>
                <p style={{ color: 'var(--text)', opacity: 0.7, fontSize: '12px', margin: 0 }}>Light review, rest & relax</p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Action Buttons */}
      <div style={{ marginTop: '20px', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
        <Button variant="secondary">Download Prep Guide</Button>
        <Button variant="primary">Mark as Prepared</Button>
      </div>
    </div>
  );
}

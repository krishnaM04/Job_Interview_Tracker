import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Card from '../base/Card';
import Button from '../base/Button';
import Badge from '../base/Badge';
import Breadcrumb from '../base/Breadcrumb';
import { submitInterviewFeedback } from '../../services/interviewService';

export default function InterviewFeedback() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    rating: 0,
    technicalAssessment: '',
    culturalFit: '',
    notes: '',
    interviewerName: '',
    interviewerEmail: '',
    followUpDate: '',
    nextSteps: ''
  });
  const [hoveredRating, setHoveredRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.rating === 0) {
      alert('Please provide a rating');
      return;
    }
    try {
      await submitInterviewFeedback(id, formData);
      setSubmitted(true);
      setTimeout(() => navigate('/interviews'), 2000);
    } catch (error) {
      console.error('Failed to submit feedback:', error);
      alert('Failed to submit feedback');
    }
  };

  if (submitted) {
    return (
      <div style={{ padding: '20px' }}>
        <Card>
          <div style={{ padding: '40px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
            <div style={{ fontSize: '48px' }}>✅</div>
            <h2 style={{ color: 'var(--text)', margin: 0 }}>Feedback Submitted!</h2>
            <p style={{ color: 'var(--text)', opacity: 0.7, margin: 0 }}>
              Thank you for submitting your interview feedback. Redirecting...
            </p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <Breadcrumb links={[
        { label: 'Interviews', href: '/interviews' },
        { label: 'Interview Feedback' }
      ]} />

      <div style={{ marginBottom: '20px', marginTop: '12px' }}>
        <h1 style={{ color: 'var(--text)', margin: '0 0 8px 0' }}>Interview Feedback</h1>
        <p style={{ color: 'var(--text)', opacity: 0.7, margin: 0 }}>
          Help us improve by sharing your interview experience
        </p>
      </div>

      <div style={{ maxWidth: '700px' }}>
        <form onSubmit={handleSubmit}>
          {/* Overall Rating */}
          <Card title="How did the interview go?" style={{ marginBottom: '16px' }}>
            <div style={{ padding: '20px' }}>
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '16px' }}>
                {[1, 2, 3, 4, 5].map(rating => (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => setFormData({ ...formData, rating })}
                    onMouseEnter={() => setHoveredRating(rating)}
                    onMouseLeave={() => setHoveredRating(0)}
                    style={{
                      fontSize: '36px',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      opacity: (hoveredRating || formData.rating) >= rating ? 1 : 0.3,
                      transition: 'opacity 0.2s'
                    }}
                  >
                    ⭐
                  </button>
                ))}
              </div>
              <div style={{ textAlign: 'center', color: 'var(--text)' }}>
                {formData.rating > 0 ? (
                  <p style={{ margin: 0 }}>
                    <strong>Rating: {formData.rating}/5</strong>
                  </p>
                ) : (
                  <p style={{ margin: 0, opacity: 0.7 }}>Click to rate your experience</p>
                )}
              </div>
            </div>
          </Card>

          {/* Technical Assessment */}
          <Card title="Technical Assessment" style={{ marginBottom: '16px' }}>
            <div style={{ padding: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text)', fontWeight: 'bold' }}>
                How did your technical skills match the role?
              </label>
              <select
                value={formData.technicalAssessment}
                onChange={e => setFormData({ ...formData, technicalAssessment: e.target.value })}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid var(--border)',
                  borderRadius: '4px',
                  color: 'var(--text)',
                  backgroundColor: 'var(--bg)',
                  cursor: 'pointer',
                  marginBottom: '12px'
                }}
              >
                <option value="">Select assessment...</option>
                <option value="excellent">Excellent - I was well prepared</option>
                <option value="good">Good - I performed reasonably well</option>
                <option value="fair">Fair - I could have prepared better</option>
                <option value="poor">Poor - I struggled with questions</option>
              </select>
            </div>
          </Card>

          {/* Cultural Fit */}
          <Card title="Company & Culture Fit" style={{ marginBottom: '16px' }}>
            <div style={{ padding: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text)', fontWeight: 'bold' }}>
                How well do you think you'd fit with this company's culture?
              </label>
              <select
                value={formData.culturalFit}
                onChange={e => setFormData({ ...formData, culturalFit: e.target.value })}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid var(--border)',
                  borderRadius: '4px',
                  color: 'var(--text)',
                  backgroundColor: 'var(--bg)',
                  cursor: 'pointer'
                }}
              >
                <option value="">Select fit level...</option>
                <option value="excellent">Excellent - Great alignment</option>
                <option value="good">Good - Compatible culture</option>
                <option value="neutral">Neutral - Unsure about fit</option>
                <option value="poor">Poor - Different values/style</option>
              </select>
            </div>
          </Card>

          {/* Interviewer Details */}
          <Card title="Interviewer Information" style={{ marginBottom: '16px' }}>
            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', color: 'var(--text)', fontWeight: 'bold', fontSize: '14px' }}>
                  Interviewer Name
                </label>
                <input
                  type="text"
                  value={formData.interviewerName}
                  onChange={e => setFormData({ ...formData, interviewerName: e.target.value })}
                  placeholder="e.g., John Smith"
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid var(--border)',
                    borderRadius: '4px',
                    color: 'var(--text)',
                    backgroundColor: 'var(--bg)',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', color: 'var(--text)', fontWeight: 'bold', fontSize: '14px' }}>
                  Interviewer Email
                </label>
                <input
                  type="email"
                  value={formData.interviewerEmail}
                  onChange={e => setFormData({ ...formData, interviewerEmail: e.target.value })}
                  placeholder="john@company.com"
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid var(--border)',
                    borderRadius: '4px',
                    color: 'var(--text)',
                    backgroundColor: 'var(--bg)',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>
          </Card>

          {/* General Notes */}
          <Card title="Interview Notes" style={{ marginBottom: '16px' }}>
            <div style={{ padding: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text)', fontWeight: 'bold' }}>
                What did we discuss? Any key takeaways or difficult areas?
              </label>
              <textarea
                value={formData.notes}
                onChange={e => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Write your observations here... e.g., Questions I was asked, areas I struggled with, positive discussions, etc."
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid var(--border)',
                  borderRadius: '4px',
                  color: 'var(--text)',
                  backgroundColor: 'var(--bg)',
                  minHeight: '120px',
                  resize: 'vertical',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </Card>

          {/* Follow-up */}
          <Card title="Next Steps" style={{ marginBottom: '16px' }}>
            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', color: 'var(--text)', fontWeight: 'bold', fontSize: '14px' }}>
                  Expected Follow-up Date
                </label>
                <input
                  type="date"
                  value={formData.followUpDate}
                  onChange={e => setFormData({ ...formData, followUpDate: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid var(--border)',
                    borderRadius: '4px',
                    color: 'var(--text)',
                    backgroundColor: 'var(--bg)',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', color: 'var(--text)', fontWeight: 'bold', fontSize: '14px' }}>
                  What are the next steps?
                </label>
                <textarea
                  value={formData.nextSteps}
                  onChange={e => setFormData({ ...formData, nextSteps: e.target.value })}
                  placeholder="e.g., second round interview, take-home assignment, technical assessment, etc."
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid var(--border)',
                    borderRadius: '4px',
                    color: 'var(--text)',
                    backgroundColor: 'var(--bg)',
                    minHeight: '80px',
                    resize: 'vertical',
                    fontFamily: 'inherit',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>
          </Card>

          {/* Submit Buttons */}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <Button
              type="button"
              variant="ghost"
              onClick={() => navigate('/interviews')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
            >
              Submit Feedback
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

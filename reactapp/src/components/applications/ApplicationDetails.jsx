import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import Card from '../base/Card';
import Button from '../base/Button';
import Badge from '../base/Badge';
import Timeline from '../base/Timeline';
import Breadcrumb from '../base/Breadcrumb';

import {
  fetchApplicationById,
  updateApplication,
  deleteApplication
} from '../../services/applicationService';

import { getInterviewsByApplication } from '../../services/interviewService';

export default function ApplicationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [application, setApplication] = useState(null);
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [appRes, interviewsRes] = await Promise.all([
          fetchApplicationById(parseInt(id)),
          getInterviewsByApplication(parseInt(id))
        ]);

        setApplication(appRes.data);
        setInterviews(interviewsRes.data);
      } catch (error) {
        console.error('Failed to load application:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  if (loading) {
    return (
      <div style={{ padding: '20px', color: 'var(--text)' }}>
        Loading application...
      </div>
    );
  }

  if (!application) {
    return (
      <div style={{ padding: '20px', color: 'var(--text)' }}>
        Application not found
      </div>
    );
  }

  const handleStatusChange = async (newStatus) => {
    try {
      const result = await updateApplication(application.id, {
        status: newStatus
      });

      setApplication(result.data);
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this application?')) {
      try {
        await deleteApplication(application.id);
        navigate('/applications');
      } catch (error) {
        console.error('Failed to delete application:', error);
      }
    }
  };

  const timelineItems = [
    {
      label: 'Applied',
      date: application.appliedDate,
      completed: true,
      active: false
    },
    {
      label: 'Under Review',
      completed: [
        'Interview Scheduled',
        'Interview Completed',
        'Offer Received',
        'Accepted'
      ].includes(application.status),
      active: application.status === 'Under Review'
    },
    {
      label: 'Interview',
      completed: [
        'Interview Completed',
        'Offer Received',
        'Accepted'
      ].includes(application.status),
      active: application.status === 'Interview Scheduled'
    },
    {
      label: 'Decision',
      completed: ['Accepted'].includes(application.status),
      active: ['Offer Received', 'Accepted'].includes(application.status)
    }
  ];

  return (
    <div style={{ padding: '20px' }}>
      <Breadcrumb
        items={[
          {
            label: 'Applications',
            href: '/applications'
          },
          {
            label: `${application.companyName} - ${application.position}`
          }
        ]}
      />

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px'
        }}
      >
        <div>
          <h1
            style={{
              color: 'var(--text)',
              margin: '0 0 8px 0'
            }}
          >
            {application.companyName}
          </h1>

          <p
            style={{
              color: 'var(--text)',
              opacity: 0.7,
              margin: 0
            }}
          >
            {application.position} • {application.location}
          </p>
        </div>

        <Badge
          variant={
            application.status === 'Applied'
              ? 'primary'
              : application.status === 'Interview Scheduled'
              ? 'success'
              : application.status === 'Offer Received'
              ? 'offer'
              : application.status === 'Rejected'
              ? 'danger'
              : 'default'
          }
        >
          {application.status}
        </Badge>
      </div>

      {/* Key Info */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '20px'
        }}
      >
        <Card title="Applied Date">
          <p
            style={{
              margin: 0,
              color: 'var(--text)',
              fontSize: '18px',
              fontWeight: 'bold'
            }}
          >
            {application.appliedDate}
          </p>
        </Card>

        <Card title="Deadline">
          <p
            style={{
              margin: 0,
              color: 'var(--text)',
              fontSize: '18px',
              fontWeight: 'bold'
            }}
          >
            {application.deadline}
          </p>
        </Card>

        <Card title="Salary Range">
          <p
            style={{
              margin: 0,
              color: 'var(--text)',
              fontSize: '18px',
              fontWeight: 'bold'
            }}
          >
            ${application.salary.min.toLocaleString()} - $
            {application.salary.max.toLocaleString()}
          </p>
        </Card>

        <Card title="Industry">
          <p
            style={{
              margin: 0,
              color: 'var(--text)',
              fontSize: '18px',
              fontWeight: 'bold'
            }}
          >
            {application.industry}
          </p>
        </Card>
      </div>

      {/* Status Timeline */}
      <Card
        title="Application Timeline"
        style={{ marginBottom: '20px' }}
      >
        <Timeline
          items={timelineItems}
          variant="horizontal"
        />
      </Card>

      {/* Associated Interviews */}
      {interviews.length > 0 && (
        <Card
          title={`Interviews (${interviews.length})`}
          style={{ marginBottom: '20px' }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}
          >
            {interviews.map((interview) => (
              <div
                key={interview.id}
                style={{
                  padding: '12px',
                  border: '1px solid var(--border)',
                  borderRadius: '6px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <div
                    style={{
                      fontWeight: '600',
                      color: 'var(--text)'
                    }}
                  >
                    Round {interview.round} - {interview.type}
                  </div>

                  <div
                    style={{
                      fontSize: '13px',
                      color: 'var(--text)',
                      opacity: 0.7
                    }}
                  >
                    {interview.scheduledDate} at{' '}
                    {interview.scheduledTime}
                  </div>
                </div>

                <Button
                  size="small"
                  variant="primary"
                  onClick={() =>
                    navigate(`/interviews/${interview.id}`)
                  }
                >
                  View Interview
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Notes */}
      <Card
        title="Notes & Comments"
        style={{ marginBottom: '20px' }}
      >
        <div
          style={{
            padding: '12px',
            backgroundColor: 'var(--bg)',
            border: '1px solid var(--border)',
            borderRadius: '6px',
            color: 'var(--text)',
            minHeight: '80px'
          }}
        >
          {application.notes ||
            'No notes yet. Add notes about this application.'}
        </div>
      </Card>

      {/* Tags */}
      <Card
        title="Tags"
        style={{ marginBottom: '20px' }}
      >
        <div
          style={{
            display: 'flex',
            gap: '8px',
            flexWrap: 'wrap'
          }}
        >
          {application.tags.map((tag) => (
            <Badge
              key={tag}
              variant="primary"
            >
              {tag}
            </Badge>
          ))}
        </div>
      </Card>

      {/* Action Buttons */}
      <div
        style={{
          display: 'flex',
          gap: '12px',
          flexWrap: 'wrap'
        }}
      >
        {application.status !== 'Accepted' &&
          application.status !== 'Rejected' && (
            <>
              <Button
                variant="primary"
                onClick={() => setIsEditing(!isEditing)}
              >
                Edit Application
              </Button>

              <Button
                variant="secondary"
                onClick={() =>
                  handleStatusChange('Interview Scheduled')
                }
              >
                Schedule Interview
              </Button>
            </>
          )}

        <Button
          variant="ghost"
          onClick={() => navigate('/applications')}
        >
          Back to List
        </Button>

        <Button
          variant="danger"
          onClick={handleDelete}
        >
          Delete Application
        </Button>
      </div>
    </div>
  );
}
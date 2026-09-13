import mockData from '../api/mockData';

export const getCandidateAnalytics = async (candidateId) => {
  await new Promise(r => setTimeout(r, 400));
  return { data: mockData.analytics.candidate, status: 200 };
};

export const getMarketInsights = async () => {
  await new Promise(r => setTimeout(r, 350));
  return { data: mockData.analytics.marketInsights, status: 200 };
};

export const getMetrics = async (candidateId) => {
  await new Promise(r => setTimeout(r, 300));
  return {
    data: {
      totalApplications: mockData.applications.length,
      totalInterviews: mockData.interviews.length,
      offersReceived: mockData.applications.filter(a => a.status === 'Offer Received').length,
      conversionRate: 0.25,
      successRateByIndustry: { 'Technology': 0.33 },
      timeToResponse: 14
    },
    status: 200
  };
};

export const getApplicationPipeline = async (candidateId) => {
  await new Promise(r => setTimeout(r, 300));
  const statusGroups = {};
  mockData.applications.forEach(app => {
    statusGroups[app.status] = (statusGroups[app.status] || 0) + 1;
  });
  return {
    data: {
      pipeline: statusGroups,
      conversion: {
        applied: mockData.applications.length,
        interviewed: mockData.interviews.length,
        offered: mockData.applications.filter(a => a.status === 'Offer Received').length,
        accepted: mockData.applications.filter(a => a.status === 'Accepted').length
      }
    },
    status: 200
  };
};

export const getSkillAnalytics = async (candidateId) => {
  await new Promise(r => setTimeout(r, 300));
  return {
    data: {
      inDemandSkills: [
        { skill: 'System Design', score: 85 },
        { skill: 'Python', score: 90 },
        { skill: 'AWS', score: 75 }
      ],
      skillGaps: [
        { skill: 'Kubernetes', priority: 'high' },
        { skill: 'Go Programming', priority: 'medium' }
      ]
    },
    status: 200
  };
};

export const getReportData = async (candidateId, params) => {
  await new Promise(r => setTimeout(r, 500));
  return {
    data: {
      period: params.period,
      summary: {
        applicationsSubmitted: 4,
        interviewsCompleted: 2,
        offersReceived: 1,
        successpathCompleted: '25%'
      },
      detailedMetrics: mockData.analytics.candidate,
      recommendations: [
        'Focus on system design interview preparation',
        'Expand your network in target companies',
        'Practice behavioral interview questions'
      ]
    },
    status: 200
  };
};

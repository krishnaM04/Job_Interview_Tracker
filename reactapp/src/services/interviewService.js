import mockData from '../api/mockData';

export const getInterviews = async () => {
  // Simulate API delay
  await new Promise(r => setTimeout(r, 300));
  return { data: mockData.interviews, status: 200 };
};

export const getInterviewById = async (id) => {
  await new Promise(r => setTimeout(r, 200));
  const interview = mockData.interviews.find(i => i.id === id);
  return { data: interview, status: interview ? 200 : 404 };
};

export const getInterviewsByApplication = async (applicationId) => {
  await new Promise(r => setTimeout(r, 250));
  const interviews = mockData.interviews.filter(i => i.applicationId === applicationId);
  return { data: interviews, status: 200 };
};

export const scheduleInterview = async (payload) => {
  await new Promise(r => setTimeout(r, 400));
  const id = `iv-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  // Prevent duplicate if called twice (React StrictMode)
  const alreadyExists = mockData.interviews.some(i => i.id === id);
  if (alreadyExists) return { data: mockData.interviews.find(i => i.id === id), status: 200 };
  const newInterview = {
    id,
    ...payload,
    status: 'Scheduled',
    rating: null,
    feedback: null,
    prepMaterials: []
  };
  mockData.interviews.push(newInterview);
  return { data: newInterview, status: 201 };
};

export const updateInterview = async (id, payload) => {
  await new Promise(r => setTimeout(r, 300));
  const interviewIndex = mockData.interviews.findIndex(i => i.id === id);
  if (interviewIndex === -1) return { status: 404 };
  mockData.interviews[interviewIndex] = {
    ...mockData.interviews[interviewIndex],
    ...payload
  };
  return { data: mockData.interviews[interviewIndex], status: 200 };
};

export const deleteInterview = async (id) => {
  await new Promise(r => setTimeout(r, 250));
  const interviewIndex = mockData.interviews.findIndex(i => i.id === id);
  if (interviewIndex === -1) return { status: 404 };
  const deleted = mockData.interviews.splice(interviewIndex, 1);
  return { data: deleted[0], status: 200 };
};

export const submitInterviewFeedback = async (id, feedback) => {
  await new Promise(r => setTimeout(r, 300));
  return updateInterview(id, { 
    feedback: feedback.feedback,
    rating: feedback.rating,
    status: 'Completed',
    notes: feedback.notes
  });
};

export const getInterviewPrep = async (interviewId) => {
  await new Promise(r => setTimeout(r, 200));
  // id may come in as string from URL params
  const interview = mockData.interviews.find(i => String(i.id) === String(interviewId));
  if (!interview) return { status: 404, data: null };
  return {
    data: {
      company: interview.companyName || interview.company || 'Company',
      position: interview.position,
      interviewType: interview.type,
      interviewDate: interview.scheduledDate || interview.date,
      companyInfo: {
        founded: '1975',
        headquarters: 'Redmond, WA',
        employees: '221000+',
        industry: 'Technology',
        keyPoints: [
          'Leading cloud computing provider (Azure)',
          'Major enterprise AI initiatives',
          'Strong focus on open source',
          'Global workforce across multiple time zones'
        ],
        recentNews: [
          { title: 'Microsoft announces new AI features', date: 'Oct 2024' },
          { title: 'Record Q3 revenue growth', date: 'Sep 2024' }
        ],
        values: ['Innovation', 'Integrity', 'Inclusion', 'Accountability', 'Growth Mindset']
      },
      questions: [
        {
          question: 'Tell me about yourself and your experience',
          difficulty: 'easy',
          suggestedAnswer: 'Start with your current role, highlight key achievements, explain why you\'re interested in this position',
          tips: 'Keep it to 2-3 minutes, focus on what\'s relevant to the role'
        },
        {
          question: 'Why do you want to join our company?',
          difficulty: 'easy',
          suggestedAnswer: 'Research the company and mention specific reasons - products you use, company values, growth opportunities',
          tips: 'Show you\'ve done your homework, avoid generic answers'
        },
        {
          question: 'Describe your most challenging project',
          difficulty: 'medium',
          suggestedAnswer: 'Use STAR method (Situation, Task, Action, Result). Focus on your contribution and lessons learned',
          tips: 'Prepare 2-3 STAR stories before the interview'
        },
        {
          question: 'How do you handle conflicts in a team environment?',
          difficulty: 'medium',
          suggestedAnswer: 'Give an example of conflict resolution. Show empathy, communication, and problem-solving skills',
          tips: 'Emphasize collaborative approach and positive outcomes'
        }
      ],
      checklist: [
        'Research company background and recent news',
        'Review job description and prepare examples for each requirement',
        'Practice common questions with STAR method',
        'Prepare 3-5 questions to ask the interviewer',
        'Test technical setup (camera, microphone, internet)',
        'Prepare notepad and pen for notes',
        'Plan outfit and appearance',
        'Review commute route or setup virtual meeting platform',
        'Get good sleep the night before',
        'Prepare copies of resume (if in-person)'
      ],
      materials: [
        { title: 'Company Website & About Page', url: 'https://example.com' },
        { title: 'LinkedIn Company Profile', url: 'https://linkedin.com' },
        { title: 'Latest Earnings Report', url: 'https://example.com/earnings' },
        { title: 'Interview Questions Database', url: 'https://example.com/questions' }
      ]
    },
    status: 200
  };
};

export const getInterviewMetrics = async (candidateId) => {
  await new Promise(r => setTimeout(r, 300));
  return {
    data: {
      totalInterviews: 4,
      completedInterviews: 2,
      avgRating: 4.5,
      successRateByType: {
        'Phone': 0.75,
        'Video': 0.67,
        'In-Person': 1.0
      },
      timeToNegotiate: 5,
      averageTimePerRound: 7
    },
    status: 200
  };
};

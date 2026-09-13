// Mock data for frontend development
// This data structure matches backend API responses

const mockData = {
  applications: [
    {
      id: 1,
      companyName: 'Google',
      position: 'Senior Software Engineer',
      status: 'Interview Scheduled',
      appliedDate: '2026-08-15',
      deadline: '2026-09-15',
      location: 'Mountain View, CA',
      salary: { min: 180000, max: 220000, currency: 'USD' },
      industry: 'Technology',
      description: 'Looking for experienced SE with 5+ years in distributed systems',
      documentIds: [1, 2],
      notes: 'Interested in this role. Need to prepare for system design round.',
      tags: ['high-priority', 'dream-job'],
      interviews: [2, 3]
    },
    {
      id: 2,
      companyName: 'Microsoft',
      position: 'Software Engineer II',
      status: 'Applied',
      appliedDate: '2026-08-18',
      deadline: '2026-09-18',
      location: 'Redmond, WA',
      salary: { min: 160000, max: 200000, currency: 'USD' },
      industry: 'Technology',
      description: 'Building cloud solutions for enterprise clients',
      documentIds: [1],
      notes: '',
      tags: ['applied'],
      interviews: []
    },
    {
      id: 3,
      companyName: 'Amazon',
      position: 'SDE',
      status: 'Offer Received',
      appliedDate: '2026-08-01',
      deadline: '2026-09-28',
      location: 'Seattle, WA',
      salary: { min: 170000, max: 210000, currency: 'USD' },
      industry: 'Technology',
      description: 'Join AWS team working on infrastructure',
      documentIds: [1, 2, 3],
      notes: 'Offer received! Negotiating salary.',
      tags: ['offer', 'negotiating'],
      interviews: [1, 4]
    },
    {
      id: 4,
      companyName: 'Meta',
      position: 'Software Engineer',
      status: 'Rejected',
      appliedDate: '2026-07-20',
      deadline: '2026-08-20',
      location: 'Menlo Park, CA',
      salary: { min: 180000, max: 250000, currency: 'USD' },
      industry: 'Technology',
      description: 'Working on core platform infrastructure',
      documentIds: [1],
      notes: 'Rejected after first round. Not a good fit.',
      tags: ['rejected'],
      interviews: []
    }
  ],

  interviews: [
    {
      id: 1,
      applicationId: 3,
      companyName: 'Amazon',
      position: 'SDE',
      type: 'Phone',
      round: 1,
      scheduledDate: '2026-08-20',
      scheduledTime: '10:00 AM',
      timezone: 'EST',
      status: 'Completed',
      interviewer: { name: 'John Smith', email: 'john@amazon.com' },
      notes: 'Discussed experience, seemed interested. Will move to next round.',
      rating: 4,
      feedback: 'Good communication, solid technical background',
      followUpDate: '2026-08-23',
      prepMaterials: ['System Design Basics', 'Amazon Leadership Principles']
    },
    {
      id: 2,
      applicationId: 1,
      companyName: 'Google',
      position: 'Senior Software Engineer',
      type: 'Video',
      round: 1,
      scheduledDate: '2026-09-28',
      scheduledTime: '2:00 PM',
      timezone: 'Pacific',
      status: 'Scheduled',
      interviewer: { name: 'Jane Doe', email: 'jane@google.com' },
      notes: 'Preparation in progress',
      rating: null,
      feedback: null,
      followUpDate: null,
      prepMaterials: ['Google Interview Handbook', 'Coding Problems']
    },
    {
      id: 3,
      applicationId: 1,
      companyName: 'Google',
      position: 'Senior Software Engineer',
      type: 'In-Person',
      round: 2,
      scheduledDate: '2026-09-05',
      scheduledTime: '9:00 AM',
      timezone: 'Pacific',
      status: 'Scheduled',
      interviewer: { name: 'Multiple', email: 'hiring@google.com' },
      notes: 'System design and behavioral rounds',
      rating: null,
      feedback: null,
      followUpDate: null,
      prepMaterials: []
    },
    {
      id: 4,
      applicationId: 3,
      companyName: 'Amazon',
      position: 'SDE',
      type: 'In-Person',
      round: 2,
      scheduledDate: '2026-10-25',
      scheduledTime: '1:00 PM',
      timezone: 'EST',
      status: 'Pending Feedback',
      interviewer: { name: 'Team', email: 'team@amazon.com' },
      notes: 'Interviewing with team',
      rating: 5,
      feedback: 'Excellent performance! Moving to offer stage.',
      followUpDate: '2026-10-27',
      prepMaterials: []
    }
  ],

  companies: [
    {
      id: 1,
      name: 'Google',
      industry: 'Technology',
      size: 'Large (10,000+)',
      location: 'Mountain View, CA',
      website: 'www.google.com',
      description: 'Search and advertising company',
      culture: 'Innovation-focused, data-driven, competitive',
      rating: 4.5,
      reviews: 156,
      successRate: 0.12,
      applicationCount: 2348,
      averageSalary: 190000,
      growthTrend: 'Stable',
      recentNews: ['Q3 Earnings Beat', 'New AI Initiative']
    },
    {
      id: 2,
      name: 'Microsoft',
      industry: 'Technology',
      size: 'Large (10,000+)',
      location: 'Redmond, WA',
      website: 'www.microsoft.com',
      description: 'Software and cloud services',
      culture: 'Collaborative, customer-focused, growth mindset',
      rating: 4.3,
      reviews: 203,
      successRate: 0.15,
      applicationCount: 1923,
      averageSalary: 170000,
      growthTrend: 'Growing',
      recentNews: ['Azure Expansion', 'New Partnerships']
    },
    {
      id: 3,
      name: 'Amazon',
      industry: 'Technology',
      size: 'Large (10,000+)',
      location: 'Seattle, WA',
      website: 'www.amazon.com',
      description: 'E-commerce and cloud computing',
      culture: 'Fast-paced, customer obsessed, high bar',
      rating: 3.8,
      reviews: 289,
      successRate: 0.18,
      applicationCount: 3421,
      averageSalary: 185000,
      growthTrend: 'Growing',
      recentNews: ['AWS Growth', 'New Product Lines']
    }
  ],

  documents: [
    {
      id: 1,
      name: 'Resume_2024_Final.pdf',
      type: 'resume',
      uploadedDate: '2026-08-10',
      size: 245000,
      version: 1,
      tags: ['primary', 'latest'],
      usedInApplications: [1, 2, 3, 4]
    },
    {
      id: 2,
      name: 'Cover_Letter_Amazon.pdf',
      type: 'cover-letter',
      uploadedDate: '2026-08-01',
      size: 128000,
      version: 1,
      tags: ['targeted'],
      usedInApplications: [3]
    },
    {
      id: 3,
      name: 'Portfolio.pdf',
      type: 'supporting',
      uploadedDate: '2026-07-25',
      size: 512000,
      version: 2,
      tags: ['projects', 'technical'],
      usedInApplications: [1, 3]
    }
  ],

  notifications: [
    {
      id: 1,
      type: 'deadline',
      title: 'Application Deadline Approaching',
      message: 'Your application to Google expires in 7 days',
      relatedId: 1,
      read: false,
      createdAt: '2026-08-18T10:00:00'
    },
    {
      id: 2,
      type: 'interview',
      title: 'Interview Reminder',
      message: 'Your interview with Google is in 10 days',
      relatedId: 2,
      read: false,
      createdAt: '2026-08-18T09:00:00'
    },
    {
      id: 3,
      type: 'status',
      title: 'Application Status Update',
      message: 'Amazon moved your application to interview stage',
      relatedId: 3,
      read: true,
      createdAt: '2026-08-17T14:30:00'
    }
  ],

  analytics: {
    candidate: {
      totalApplications: 4,
      totalInterviews: 4,
      offersReceived: 1,
      applicationConversionRate: 25,
      interviewConversionRate: 33,
      successRateByIndustry: {
        'Technology': 0.33,
        'Finance': 0.25,
        'Healthcare': 0.20
      },
      successRateByCompanySize: {
        'Startup': 0.40,
        'Mid-size': 0.30,
        'Large': 0.25
      },
      timeToResponseDays: 14,
      upcomingInterviews: 2,
      applicationsByStatus: {
        'Applied': 1,
        'Under Review': 0,
        'Interview Scheduled': 2,
        'Interview Completed': 0,
        'Offer Received': 1,
        'Rejected': 1,
        'Accepted': 0
      },
      averageTimePerRound: 7,
      mostCommonInterviewType: 'Phone'
    },
    marketInsights: {
      topRoles: [
        { role: 'Senior Software Engineer', demand: 2543, avgSalary: 190000, trend: 'up' },
        { role: 'Product Manager', demand: 1823, avgSalary: 165000, trend: 'up' },
        { role: 'Data Engineer', demand: 1645, avgSalary: 185000, trend: 'stable' }
      ],
      topSkills: [
        { skill: 'Python', count: 5234, trend: 'up' },
        { skill: 'System Design', count: 4123, trend: 'up' },
        { skill: 'Cloud (AWS/GCP/Azure)', count: 4523, trend: 'up' }
      ],
      hiringSeason: 'Fall',
      salaryRanges: {
        'Entry Level (0-2 yrs)': { min: 100000, max: 150000 },
        'Mid Level (2-5 yrs)': { min: 150000, max: 220000 },
        'Senior (5+ yrs)': { min: 200000, max: 350000 }
      }
    }
  },

  counselorData: {
    clients: [
      {
        id: 1, 
        name: 'John Doe',
        email: 'john@example.com',
        careerGoal: 'Senior Software Engineer at FAANG',
        applicationCount: 12,
        interviewCount: 8,
        conversionRate: 0.33,
        lastActivity: '2026-08-18',
        status: 'active',
        assignedDate: '2026-07-01'
      },
      {
        id: 2,
        name: 'Jane Smith',
        email: 'jane@example.com',
        careerGoal: 'Product Manager in FinTech',
        applicationCount: 8,
        interviewCount: 3,
        conversionRate: 0.25,
        lastActivity: '2026-08-17',
        status: 'active',
        assignedDate: '2026-07-15'
      }
    ],
    sessions: [
      {
        id: 1,
        clientId: 1,
        date: '2026-08-15',
        time: '2:00 PM',
        topic: 'Interview Prep - System Design',
        notes: 'Discussed scaling challenges, practiced whiteboarding',
        feedback: 'Good progress, needs more practice on trade-offs',
        status: 'completed'
      }
    ]
  },

  adminData: {
    users: [
      {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        role: 'STANDARD_CANDIDATE',
        joinDate: '2026-07-01',
        status: 'active',
        lastLogin: '2026-08-18T14:23:00'
      },
      {
        id: 2,
        name: 'Sarah Johnson',
        email: 'sarah@example.com',
        role: 'CAREER_COUNSELOR',
        joinDate: '2026-07-15',
        status: 'active',
        lastLogin: '2026-08-18T09:15:00'
      },
      {
        id: 3,
        name: 'Admin User',
        email: 'admin@example.com',
        role: 'ADMIN',
        joinDate: '2026-07-01',
        status: 'active',
        lastLogin: '2026-08-18T16:45:00'
      }
    ],
    platformMetrics: {
      totalUsers: 342,
      activeUsers: 287,
      totalApplications: 4523,
      totalInterviews: 3421,
      offerAcceptanceRate: 0.23,
      platformUptime: 0.9999,
      apiHealth: 'healthy'
    }
  }
};

export default mockData;

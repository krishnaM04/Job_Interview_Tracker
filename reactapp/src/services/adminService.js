import mockData from '../api/mockData';

export const getUsers = async (params = {}) => {
  await new Promise(r => setTimeout(r, 300));
  let users = mockData.adminData.users;
  if (params.role) {
    users = users.filter(u => u.role === params.role);
  }
  if (params.status) {
    users = users.filter(u => u.status === params.status);
  }
  return { data: users, status: 200 };
};

export const getUserById = async (userId) => {
  await new Promise(r => setTimeout(r, 200));
  const user = mockData.adminData.users.find(u => u.id === userId);
  return { data: user, status: user ? 200 : 404 };
};

export const updateUserRole = async (userId, newRole) => {
  await new Promise(r => setTimeout(r, 250));
  const user = mockData.adminData.users.find(u => u.id === userId);
  if (!user) return { status: 404 };
  user.role = newRole;
  return { data: user, status: 200 };
};

export const deactivateUser = async (userId) => {
  await new Promise(r => setTimeout(r, 250));
  const user = mockData.adminData.users.find(u => u.id === userId);
  if (!user) return { status: 404 };
  user.status = 'deactivated';
  return { data: user, status: 200 };
};

export const reactivateUser = async (userId) => {
  await new Promise(r => setTimeout(r, 250));
  const user = mockData.adminData.users.find(u => u.id === userId);
  if (!user) return { status: 404 };
  user.status = 'active';
  return { data: user, status: 200 };
};

export const getPlatformMetrics = async () => {
  await new Promise(r => setTimeout(r, 350));
  return { data: mockData.adminData.platformMetrics, status: 200 };
};

export const getPlatformAnalytics = async (params = {}) => {
  await new Promise(r => setTimeout(r, 400));
  return {
    data: {
      period: params.period || 'monthly',
      metrics: {
        totalApplications: 4523,
        totalInterviews: 3421,
        totalOffers: 1023,
        offerAcceptanceRate: 0.23,
        userGrowth: 0.15,
        activeUserRate: 0.84
      },
      trends: {
        applicationsTrend: 'up',
        interviewsTrend: 'up',
        conversionTrend: 'stable'
      }
    },
    status: 200
  };
};

export const getSystemConfig = async () => {
  await new Promise(r => setTimeout(r, 200));
  return {
    data: {
      notificationFrequency: 'daily',
      sessionTimeout: 3600,
      maintenanceMode: false,
      apiVersion: '1.0.0'
    },
    status: 200
  };
};

export const updateSystemConfig = async (config) => {
  await new Promise(r => setTimeout(r, 250));
  return {
    data: config,
    status: 200
  };
};

export const getRBACConfig = async () => {
  await new Promise(r => setTimeout(r, 200));
  return {
    data: {
      STANDARD_CANDIDATE: ['read:own_applications', 'create:application', 'read:interviews'],
      PREMIUM_CANDIDATE: ['read:own_applications', 'create:application', 'read:interviews', 'read:analytics'],
      CAREER_COUNSELOR: ['read:client_data', 'write:feedback', 'read:analytics'],
      ADMIN: ['read:all', 'write:all', 'delete:all']
    },
    status: 200
  };
};

export const getUserActivityLog = async (userId) => {
  await new Promise(r => setTimeout(r, 300));
  return {
    data: [
      { timestamp: '2024-08-18T14:23:00', action: 'login', resource: 'auth' },
      { timestamp: '2024-08-18T14:25:00', action: 'view', resource: 'applications' },
      { timestamp: '2024-08-18T14:30:00', action: 'create', resource: 'application' }
    ],
    status: 200
  };
};

export const getSystemHealth = async () => {
  await new Promise(r => setTimeout(r, 200));
  return {
    data: {
      status: 'healthy',
      uptime: 0.9999,
      apiResponseTime: 145,
      databaseHealth: 'healthy',
      lastCheckTime: new Date().toISOString()
    },
    status: 200
  };
};

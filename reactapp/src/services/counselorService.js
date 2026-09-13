import mockData from '../api/mockData';

export const getCounselorClients = async (counselorId) => {
  await new Promise(r => setTimeout(r, 300));
  return { data: mockData.counselorData.clients, status: 200 };
};

export const getClientById = async (clientId) => {
  await new Promise(r => setTimeout(r, 200));
  const client = mockData.counselorData.clients.find(c => c.id === clientId);
  return { data: client, status: client ? 200 : 404 };
};

export const getClientApplications = async (clientId) => {
  await new Promise(r => setTimeout(r, 250));
  return { data: mockData.applications, status: 200 };
};

export const getClientProgress = async (clientId) => {
  await new Promise(r => setTimeout(r, 250));
  const client = mockData.counselorData.clients.find(c => c.id === clientId);
  return {
    data: {
      client,
      metrics: {
        applicationCount: client.applicationCount,
        interviewCount: client.interviewCount,
        conversionRate: client.conversionRate,
        milestone: 'On track for Q3 goals'
      }
    },
    status: 200
  };
};

export const scheduleGuidanceSession = async (counselorId, clientId, sessionData) => {
  await new Promise(r => setTimeout(r, 300));
  const newSession = {
    id: mockData.counselorData.sessions.length + 1,
    clientId,
    ...sessionData,
    status: 'scheduled'
  };
  mockData.counselorData.sessions.push(newSession);
  return { data: newSession, status: 201 };
};

export const completeSessions = async (sessionId, sessionNotes) => {
  await new Promise(r => setTimeout(r, 250));
  const session = mockData.counselorData.sessions.find(s => s.id === sessionId);
  if (!session) return { status: 404 };
  session.status = 'completed';
  session.notes = sessionNotes.notes;
  session.feedback = sessionNotes.feedback;
  return { data: session, status: 200 };
};

export const provideFeedback = async (clientId, applicationId, feedback) => {
  await new Promise(r => setTimeout(r, 250));
  return {
    data: {
      feedbackId: Date.now(),
      clientId,
      applicationId,
      feedback,
      providedDate: new Date().toISOString(),
      status: 'recorded'
    },
    status: 201
  };
};

export const trackMilestone = async (clientId, milestone) => {
  await new Promise(r => setTimeout(r, 250));
  return {
    data: {
      milestoneId: Date.now(),
      clientId,
      ...milestone,
      achievedDate: new Date().toISOString()
    },
    status: 201
  };
};

export const getSessions = async (counselorId) => {
  await new Promise(r => setTimeout(r, 250));
  return { data: mockData.counselorData.sessions, status: 200 };
};

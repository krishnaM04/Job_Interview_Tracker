import mockData from '../api/mockData';

export const getNotifications = async (userId, params = {}) => {
  await new Promise(r => setTimeout(r, 250));
  let notifications = mockData.notifications;
  if (params.unreadOnly) {
    notifications = notifications.filter(n => !n.read);
  }
  return { data: notifications, status: 200 };
};

export const getNotificationById = async (notificationId) => {
  await new Promise(r => setTimeout(r, 200));
  const notif = mockData.notifications.find(n => n.id === notificationId);
  return { data: notif, status: notif ? 200 : 404 };
};

export const markAsRead = async (notificationId) => {
  await new Promise(r => setTimeout(r, 150));
  const notif = mockData.notifications.find(n => n.id === notificationId);
  if (!notif) return { status: 404 };
  notif.read = true;
  return { data: notif, status: 200 };
};

export const markAllAsRead = async (userId) => {
  await new Promise(r => setTimeout(r, 250));
  mockData.notifications.forEach(n => { n.read = true; });
  return { data: { updated: mockData.notifications.length }, status: 200 };
};

export const archiveNotification = async (notificationId) => {
  await new Promise(r => setTimeout(r, 150));
  const index = mockData.notifications.findIndex(n => n.id === notificationId);
  if (index === -1) return { status: 404 };
  const archived = mockData.notifications.splice(index, 1);
  return { data: archived[0], status: 200 };
};

export const getNotificationPreferences = async (userId) => {
  await new Promise(r => setTimeout(r, 200));
  return {
    data: {
      applicationDeadline: { enabled: true, channel: 'email', frequency: 'daily' },
      interviewReminder: { enabled: true, channel: 'in-app', frequency: 'immediate' },
      statusUpdate: { enabled: true, channel: 'email', frequency: 'weekly' },
      counselorMessage: { enabled: true, channel: 'in-app', frequency: 'immediate' },
      systemAlert: { enabled: true, channel: 'email', frequency: 'immediate' }
    },
    status: 200
  };
};

export const updateNotificationPreferences = async (userId, preferences) => {
  await new Promise(r => setTimeout(r, 250));
  return { data: preferences, status: 200 };
};

export const createNotification = async (notification) => {
  await new Promise(r => setTimeout(r, 200));
  const newNotif = {
    id: mockData.notifications.length + 1,
    ...notification,
    read: false,
    createdAt: new Date().toISOString()
  };
  mockData.notifications.push(newNotif);
  return { data: newNotif, status: 201 };
};

export const getUnreadCount = async (userId) => {
  await new Promise(r => setTimeout(r, 100));
  const count = mockData.notifications.filter(n => !n.read).length;
  return { data: { count }, status: 200 };
};

export const subscribeToNotifications = async (userId, preferences) => {
  await new Promise(r => setTimeout(r, 200));
  return {
    data: {
      subscriptionId: Date.now(),
      userId,
      ...preferences,
      status: 'active'
    },
    status: 201
  };
};

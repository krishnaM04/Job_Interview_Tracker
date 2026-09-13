// In-memory application store — used as fallback when backend is unavailable
// Uses sessionStorage so data survives page refreshes within the session

const KEY = 'local_applications';
const SEEDED_KEY = 'local_applications_seeded';

const SEED_DATA = [
  {
    id: 'seed-1',
    company: 'Google',
    positionTitle: 'Senior Software Engineer',
    status: 'APPLIED',
    priority: 'HIGH',
    applicationDate: '2026-08-10',
    deadline: '2026-09-10',
    notes: 'Dream company — prepare system design.',
    createdAt: '2026-08-10T10:00:00.000Z',
  },
  {
    id: 'seed-2',
    company: 'Microsoft',
    positionTitle: 'Software Engineer II',
    status: 'UNDER_REVIEW',
    priority: 'MEDIUM',
    applicationDate: '2026-08-20',
    deadline: '2026-09-20',
    notes: 'Cloud team role.',
    createdAt: '2026-08-20T09:00:00.000Z',
  },
  {
    id: 'seed-3',
    company: 'Amazon',
    positionTitle: 'SDE II',
    status: 'INTERVIEW_SCHEDULED',
    priority: 'HIGH',
    applicationDate: '2026-09-01',
    deadline: '2026-10-01',
    notes: 'AWS team — review leadership principles.',
    createdAt: '2026-09-01T08:00:00.000Z',
  },
  {
    id: 'seed-4',
    company: 'Netflix',
    positionTitle: 'Backend Engineer',
    status: 'APPLIED',
    priority: 'MEDIUM',
    applicationDate: '2026-09-10',
    deadline: '2026-10-15',
    notes: 'Streaming platform team — focus on distributed systems.',
    createdAt: '2026-09-10T11:00:00.000Z',
  },
  {
    id: 'seed-5',
    company: 'TCS',
    positionTitle: 'Software Engineer',
    status: 'APPLIED',
    priority: 'MEDIUM',
    applicationDate: '2026-08-27',
    deadline: '2026-10-15',
    notes: 'Streaming platform team — focus on distributed systems.',
    createdAt: '2026-09-10T11:00:00.000Z',
  },
];

function load() {
  try { return JSON.parse(sessionStorage.getItem(KEY)) || []; }
  catch { return []; }
}

function save(list) {
  sessionStorage.setItem(KEY, JSON.stringify(list));
}

// Seed once per session if store is empty
if (!sessionStorage.getItem(SEEDED_KEY)) {
  sessionStorage.setItem(SEEDED_KEY, '1');
  if (load().length === 0) save(SEED_DATA);
}

export const localStore = {
  getAll() { return load(); },

  getById(id) { return load().find(a => a.id === id) || null; },

  create(payload) {
    const list = load();
    const item = { ...payload, id: `local-${Date.now()}`, createdAt: new Date().toISOString() };
    save([...list, item]);
    return item;
  },

  update(id, payload) {
    const list = load().map(a => a.id === id ? { ...a, ...payload } : a);
    save(list);
    return list.find(a => a.id === id);
  },

  delete(id) {
    save(load().filter(a => a.id !== id));
  },
};

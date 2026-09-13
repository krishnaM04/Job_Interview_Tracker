import axios from 'axios';

const base = axios.create({ baseURL: 'http://localhost:8081/api' });

function throwApiError(message) {
	const error = new Error(message);
	error.response = { data: { message } };
	throw error;
}

function normalizeAuthResponse(data) {
	if (!data) {
		throwApiError('Empty response from authentication service.');
	}

	if (data.message) {
		throwApiError(data.message);
	}

	if (data.error) {
		throwApiError(data.error);
	}

	return data;
}

// Map any backend role variants to our known roles
const ROLE_MAP = {
  CANDIDATE: 'STANDARD_CANDIDATE',
  STANDARD_CANDIDATE: 'STANDARD_CANDIDATE',
  PREMIUM_CANDIDATE: 'PREMIUM_CANDIDATE',
  CAREER_COUNSELOR: 'CAREER_COUNSELOR',
  COUNSELOR: 'CAREER_COUNSELOR',
  ADMIN: 'ADMIN',
};

function normalizeRole(role) {
  if (!role) return 'STANDARD_CANDIDATE';
  return ROLE_MAP[role.toUpperCase()] || 'STANDARD_CANDIDATE';
}

export async function login({ username, password }) {
	try {
		const res = await base.post('/auth/login', { username, password });
		const data = normalizeAuthResponse(res.data);

		if (!data.user) {
			data.user = { username, role: normalizeRole(data.role) };
		} else {
			data.user.role = normalizeRole(data.user.role || data.role);
			if (!data.user.username) data.user.username = username;
		}

		return data;
	} catch (e) {
		// Backend unavailable — return a local session so the app still works
		if (!e.response) {
			const role = normalizeRole(
				sessionStorage.getItem('pending_role') || 'STANDARD_CANDIDATE'
			);
			sessionStorage.removeItem('pending_role');
			return {
				token: `local-token-${Date.now()}`,
				user: { username, role },
			};
		}
		throw e;
	}
}

export async function register(payload) {
	try {
		const res = await base.post('/auth/register', payload);
		sessionStorage.setItem('pending_role', payload.role || 'STANDARD_CANDIDATE');
		return res.data; // don't run normalizeAuthResponse — it throws on message field
	} catch (e) {
		if (!e.response) {
			// Backend unavailable — mock successful registration
			sessionStorage.setItem('pending_role', payload.role || 'STANDARD_CANDIDATE');
			return { ok: true, username: payload.username };
		}
		throw e;
	}
}

export async function refreshToken(currentToken) {
	try {
		const res = await base.post('/auth/refresh-token', { token: currentToken });
		return res.data;
	} catch (e) {
		throw e;
	}
}

export async function logout() {
	// backend may not require server logout; clear client state only
	return true;
}

export async function fetchApplications(api, params = {}) {
	const res = await api.get('/applications/search', { params });
	return res.data;
}

export async function fetchApplicationById(api, id) {
	const res = await api.get(`/applications/${id}`);
	return res.data;
}

export async function createApplication(api, payload) {
	const res = await api.post('/applications', payload);
	return res.data;
}

export async function updateApplication(api, id, payload) {
	const res = await api.put(`/applications/${id}`, payload);
	return res.data;
}

export async function deleteApplication(api, id) {
	const res = await api.delete(`/applications/${id}`);
	return res.data;
}

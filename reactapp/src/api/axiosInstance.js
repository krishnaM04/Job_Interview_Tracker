import axios from 'axios';

export function createApi(token, onUnauthorized) {
  const api = axios.create({ baseURL: 'http://localhost:8081/api' });

  api.interceptors.request.use((config) => {
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  api.interceptors.response.use(
    (res) => res,
    (err) => {
      if (err.response && err.response.status === 401) {
        if (typeof onUnauthorized === 'function') onUnauthorized();
      }
      return Promise.reject(err);
    }
  );

  return api;
}

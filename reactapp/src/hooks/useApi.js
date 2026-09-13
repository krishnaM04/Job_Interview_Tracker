import { useState, useCallback, useRef } from 'react';
import useAuth from './useAuth';

const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const { logout } = useAuth();

  const retryCountRef = useRef(0);
  const maxRetries = 3;

  const request = useCallback(
    async (
      method,
      url,
      payload = null,
      options = {}
    ) => {
      const {
        retry = true,
        retryDelay = 1000,
        useMock = false
      } = options;

      try {
        setLoading(true);
        setError(null);

        // Simulate API delay for development
        if (useMock) {
          await new Promise((resolve) =>
            setTimeout(resolve, 500)
          );

          setLoading(false);

          return {
            data: {},
            status: 200
          };
        }

        // Build headers
        const headers = {
          'Content-Type': 'application/json',
          ...options.headers
        };

        // Add auth token if available
        const token = localStorage.getItem('token');

        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        // Make request
        const config = {
          method,
          headers,
          body: payload
            ? JSON.stringify(payload)
            : undefined
        };

        const response = await fetch(url, config);

        // Handle 401 - Unauthorized
        if (response.status === 401) {
          logout();

          throw new Error(
            'Session expired. Please login again.'
          );
        }

        if (!response.ok) {
          const errorData = await response
            .json()
            .catch(() => ({}));

          throw new Error(
            errorData.message ||
              `HTTP ${response.status}: ${response.statusText}`
          );
        }

        const responseData = await response.json();

        setData(responseData);

        retryCountRef.current = 0;

        setLoading(false);

        return {
          data: responseData,
          status: response.status
        };
      } catch (err) {
        // Implement retry logic
        if (
          retry &&
          retryCountRef.current < maxRetries &&
          !url.includes('/auth/')
        ) {
          retryCountRef.current += 1;

          await new Promise((resolve) =>
            setTimeout(resolve, retryDelay)
          );

          return request(
            method,
            url,
            payload,
            {
              ...options,
              retry: true
            }
          );
        }

        setError(
          err.message || 'An error occurred'
        );

        setLoading(false);

        throw err;
      }
    },
    [logout]
  );

  // HTTP method shortcuts
  const get = useCallback(
    (url, options = {}) => {
      return request(
        'GET',
        url,
        null,
        options
      );
    },
    [request]
  );

  const post = useCallback(
    (url, payload, options = {}) => {
      return request(
        'POST',
        url,
        payload,
        options
      );
    },
    [request]
  );

  const put = useCallback(
    (url, payload, options = {}) => {
      return request(
        'PUT',
        url,
        payload,
        options
      );
    },
    [request]
  );

  const patch = useCallback(
    (url, payload, options = {}) => {
      return request(
        'PATCH',
        url,
        payload,
        options
      );
    },
    [request]
  );

  const del = useCallback(
    (url, options = {}) => {
      return request(
        'DELETE',
        url,
        null,
        options
      );
    },
    [request]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const clearData = useCallback(() => {
    setData(null);
  }, []);

  return {
    loading,
    error,
    data,
    get,
    post,
    put,
    patch,
    delete: del,
    clearError,
    clearData,
    request
  };
};

export default useApi;
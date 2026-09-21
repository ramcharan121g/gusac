const API_BASE = import.meta.env.VITE_API_BASE || '/api';

export async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem('gusac_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  const config = {
    ...options,
    headers,
  };

  if (options.body && typeof options.body === 'object') {
    config.body = JSON.stringify(options.body);
  }

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, config);
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const error = new Error(data.error || data.message || `Request failed with status ${response.status}`);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (error) {
    // If unauthorized, clear invalid token
    if (error.status === 401 && !endpoint.includes('/auth/login')) {
      localStorage.removeItem('gusac_token');
      localStorage.removeItem('gusac_user');
    }
    throw error;
  }
}

import axios from 'axios';

// Check environment variable or fallback to mock mode
export const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API !== 'false'; // defaults to true in development

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Interceptors for future authentication JWT tokens
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('forma_auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

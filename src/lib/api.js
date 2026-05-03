import axios from 'axios';
import { supabase } from './supabase';

const API_URL = import.meta.env.VITE_API_URL || 'https://chatbotserver-4sqr.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  withCredentials: true,
});

// Request interceptor for JWT
api.interceptors.request.use(
  async (config) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token || localStorage.getItem('token');
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (err) {
      console.warn('[API Interceptor] Token retrieval failed', err);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // If we get a 401, it means the token is invalid or expired
    if (error.response?.status === 401) {
      console.warn('[API] Unauthorized access detected');
      // We don't force redirect here to avoid loops during OAuth callbacks.
      // Instead, we clear the token and let ProtectedRoute handle it.
      localStorage.removeItem('token');
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  signup: (userData) => api.post('/auth/signup', userData),
  getMe: () => api.get('/auth/me'),
};

export const botAPI = {
  getAll: () => api.get('/bots'),
  getById: (id) => api.get(`/bots/${id}`),
  create: (data) => api.post('/bots', data),
  update: (id, data) => api.put(`/bots/${id}`, data),
  delete: (id) => api.delete(`/bots/${id}`),
};

export const chatAPI = {
  interact: (botId, query, sessionId) => 
    api.post(`/chat`, { botId, query, sessionId }),
};

export default api;

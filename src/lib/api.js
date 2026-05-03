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
      // 1. Try Supabase session first
      const { data: { session } } = await supabase.auth.getSession();
      
      // 2. Fallback to localStorage (Legacy)
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

// Response interceptor for session expiry
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Clean up on unauthorized
      localStorage.removeItem('token');
      try {
        await supabase.auth.signOut();
      } catch (e) {}
      
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
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
  getPublicConfig: (id) => api.get(`/bots/public/${id}`),
};

export const chatAPI = {
  interact: (botId, query, sessionId) => 
    api.post(`/chat`, { botId, query, sessionId }), // Simplified chat endpoint
};

export const logAPI = {
  getAll: () => api.get('/logs'),
};

export default api;

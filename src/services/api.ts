// src/services/api.ts
import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios';
import { type ApiResponse,type ErrorResponse } from '../types';
import type { InternalAxiosRequestConfig } from 'axios';

// Create axios instance with default configuration
const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = localStorage.getItem('authToken');
    if (token) {
      //
      config.headers.set('Authorization', `Bearer ${token}`);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    return response;
  },
  (error) => {
    // Handle different types of errors
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          // Unauthorized - clear token and redirect to login
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
          window.location.href = '/login';
          break;
        case 403:
          // Forbidden
          console.error('Access denied');
          break;
        case 404:
          // Not found
          console.error('Resource not found');
          break;
        case 422:
          // Validation error
          console.error('Validation error:', data);
          break;
        case 500:
          // Server error
          console.error('Server error');
          break;
        default:
          console.error(`API Error ${status}:`, data);
      }
      
      return Promise.reject(data || { message: 'An error occurred' });
    } else if (error.request) {
      // Network error
      console.error('Network error:', error.message);
      return Promise.reject({ message: 'Network error. Please check your connection.' });
    } else {
      // Something else happened
      console.error('Error:', error.message);
      return Promise.reject({ message: error.message });
    }
  }
);

// Generic API methods
export const apiClient = {
  // GET request
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await api.get(url, config);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },

  // POST request
  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await api.post(url, data, config);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },

  // PUT request
  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await api.put(url, data, config);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },

  // PATCH request
  async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await api.patch(url, data, config);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },

  // DELETE request
  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await api.delete(url, config);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },

  // Upload files
  async uploadFile<T = any>(url: string, file: File, onProgress?: (progress: number) => void): Promise<ApiResponse<T>> {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await api.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onProgress(progress);
          }
        },
      });
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },

  // Upload multiple files
  async uploadFiles<T = any>(url: string, files: File[], onProgress?: (progress: number) => void): Promise<ApiResponse<T>> {
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append(`files[${index}]`, file);
    });

    try {
      const response = await api.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onProgress(progress);
          }
        },
      });
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }
};

// Specific API endpoints
export const endpoints = {
  // Auth endpoints
  auth: {
    login: '/auth/login',
    signup: '/auth/signup',
    logout: '/auth/logout',
    me: '/auth/me',
    refresh: '/auth/refresh',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
  },

  // Report endpoints
  reports: {
    list: '/reports',
    create: '/reports',
    get: (id: string) => `/reports/${id}`,
    update: (id: string) => `/reports/${id}`,
    delete: (id: string) => `/reports/${id}`,
    verify: (id: string) => `/reports/${id}/verify`,
    stats: '/reports/stats',
  },

  // Social media endpoints
  social: {
    mentions: '/social/mentions',
    search: '/social/search',
    locationMentions: '/social/location',
    reportCorrelation: (reportId: string) => `/social/reports/${reportId}`,
    metrics: '/social/metrics',
    trending: '/social/trending',
  },

  // NLP endpoints
  nlp: {
    analyze: '/nlp/analyze',
    batchAnalyze: '/nlp/batch-analyze',
    sentiment: '/nlp/sentiment',
    hazardDetection: '/nlp/hazard-detection',
  },

  // File upload endpoints
  files: {
    upload: '/files/upload',
    uploadMultiple: '/files/upload-multiple',
    delete: (id: string) => `/files/${id}`,
  },

  // User endpoints
  users: {
    profile: '/users/profile',
    updateProfile: '/users/profile',
    preferences: '/users/preferences',
  },
};

// Export the configured axios instance
export default api;
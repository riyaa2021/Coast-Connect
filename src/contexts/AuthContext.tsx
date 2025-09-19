// src/contexts/AuthContext.tsx (Add debugging)
import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { type User, type AuthContextType, type LoginCredentials, type SignupData } from '../types';
import { apiClient } from '../services/api';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is logged in on app start
  useEffect(() => {
    const checkAuth = async () => {
      console.log('Checking authentication...');
      try {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('authToken');
        
        console.log('Stored user:', storedUser);
        console.log('Stored token:', token);
        
        if (storedUser && token) {
          const userData = JSON.parse(storedUser);
          console.log('Setting user from localStorage:', userData);
          setUser(userData);
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('authToken');
        setUser(null);
      } finally {
        console.log('Auth check completed');
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      console.log('Login attempt with:', credentials.email);
      setIsLoading(true);
      
      // Check for demo accounts first (development only)
      if (process.env.NODE_ENV === 'development') {
        if (credentials.email === 'user@demo.com' && credentials.password === 'demo123') {
          const demoUser: User = {
            id: 'demo-user-1',
            name: 'Demo User',
            email: 'user@demo.com',
            role: 'user',
            createdAt: new Date().toISOString(),
            isVerified: true,
          };
          const demoToken = 'demo-token-user-' + Date.now();
          
          console.log('Demo user login successful:', demoUser);
          localStorage.setItem('user', JSON.stringify(demoUser));
          localStorage.setItem('authToken', demoToken);
          setUser(demoUser);
          return;
        }
        
        if (credentials.email === 'official@demo.com' && credentials.password === 'demo123') {
          const demoOfficial: User = {
            id: 'demo-official-1',
            name: 'Demo Official',
            email: 'official@demo.com',
            role: 'official',
            createdAt: new Date().toISOString(),
            isVerified: true,
            organization: 'INCOIS',
          };
          const demoToken = 'demo-token-official-' + Date.now();
          
          console.log('Demo official login successful:', demoOfficial);
          localStorage.setItem('user', JSON.stringify(demoOfficial));
          localStorage.setItem('authToken', demoToken);
          setUser(demoOfficial);
          return;
        }
      }
      
      // Real API call to backend
      const response = await apiClient.post('/auth/login', credentials);
      
      if (response.success && response.data) {
        const { user: userData, token } = response.data;
        
        console.log('API login successful:', userData);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('authToken', token);
        setUser(userData);
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (data: SignupData) => {
    try {
      console.log('Signup attempt with:', data.email, data.role);
      setIsLoading(true);
      
      // For development, create a demo user immediately
      if (process.env.NODE_ENV === 'development') {
        const demoUser: User = {
          id: 'demo-signup-' + Date.now(),
          name: data.name,
          email: data.email,
          role: data.role || 'user',
          createdAt: new Date().toISOString(),
          isVerified: true,
          phone: data.phone,
          organization: data.organization,
        };
        const demoToken = 'demo-token-signup-' + Date.now();
        
        console.log('Demo signup successful:', demoUser);
        localStorage.setItem('user', JSON.stringify(demoUser));
        localStorage.setItem('authToken', demoToken);
        setUser(demoUser);
        return;
      }
      
      // Real API call to backend with role selection
      const signupPayload = {
        name: data.name,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
        role: data.role || 'user',
        phone: data.phone,
        organization: data.organization,
      };
      
      const response = await apiClient.post('/auth/signup', signupPayload);
      
      if (response.success && response.data) {
        const { user: userData, token } = response.data;
        
        console.log('API signup successful:', userData);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('authToken', token);
        setUser(userData);
      } else {
        throw new Error(response.message || 'Signup failed');
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    console.log('Logout called');
    try {
      // Call logout endpoint to invalidate token on server
      await apiClient.post('/auth/logout');
    } catch (error) {
      console.warn('Logout endpoint error:', error);
    } finally {
      // Always clear local storage and state
      localStorage.removeItem('user');
      localStorage.removeItem('authToken');
      setUser(null);
      console.log('Logout completed');
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    signup,
    logout,
  };

  console.log('AuthContext value:', { user: user?.name, isLoading, isAuthenticated: !!user });

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};

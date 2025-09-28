// src/contexts/AuthContext.tsx (Multi-user localStorage + Debugging)
import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { type User, type AuthContextType, type LoginCredentials, type SignupData } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Helper: load all users
  const getStoredUsers = (): User[] => {
    const usersStr = localStorage.getItem('users');
    return usersStr ? JSON.parse(usersStr) : [];
  };

  // Check if user is logged in on app start
  useEffect(() => {
    console.log('🔍 Checking authentication...');
    try {
      const storedUser = localStorage.getItem('user');
      const token = localStorage.getItem('authToken');

      console.log('📦 Stored user:', storedUser);
      console.log('🔑 Stored token:', token);

      if (storedUser && token) {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        console.log('✅ Restored user:', userData);
      }
    } catch (error) {
      console.error('❌ Error checking auth:', error);
      localStorage.removeItem('user');
      localStorage.removeItem('authToken');
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      console.log('➡ Login attempt with:', credentials.email);
      setIsLoading(true);

      // Check against all stored users
      const users = getStoredUsers();
      console.log('👥 Available users:', users);

      const foundUser = users.find(
        (u) => u.email === credentials.email && u.password === credentials.password
      );

      if (foundUser) {
        localStorage.setItem('user', JSON.stringify(foundUser));
        localStorage.setItem('authToken', 'token-' + Date.now());
        setUser(foundUser);
        console.log('✅ Login successful:', foundUser);
        return;
      }

      // Fallback to demo accounts
      if (credentials.email === 'user@demo.com' && credentials.password === 'demo123') {
        const demoUser: User = {
          id: 'demo-user-1',
          name: 'Demo User',
          email: 'user@demo.com',
          role: 'user',
          createdAt: new Date().toISOString(),
          isVerified: true,
          password: 'demo123',
        };
        localStorage.setItem('user', JSON.stringify(demoUser));
        localStorage.setItem('authToken', 'demo-token-user-' + Date.now());
        setUser(demoUser);
        console.log('✅ Demo user login successful');
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
          password: 'demo123',
        };
        localStorage.setItem('user', JSON.stringify(demoOfficial));
        localStorage.setItem('authToken', 'demo-token-official-' + Date.now());
        setUser(demoOfficial);
        console.log('✅ Demo official login successful');
        return;
      }

      throw new Error('Invalid email or password');
    } catch (error) {
      console.error('❌ Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (data: SignupData) => {
    try {
      console.log('➡ Signup attempt with:', data.email);
      setIsLoading(true);

      const users = getStoredUsers();

      // Prevent duplicate email
      if (users.some((u) => u.email === data.email)) {
        throw new Error('User already exists with this email');
      }

      const newUser: User = {
        id: 'signup-' + Date.now(),
        name: data.name,
        email: data.email,
        role: data.role || 'user',
        createdAt: new Date().toISOString(),
        isVerified: true,
        phone: data.phone,
        organization: data.organization,
        password: data.password,
      };

      const updatedUsers = [...users, newUser];
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      localStorage.setItem('user', JSON.stringify(newUser));
      localStorage.setItem('authToken', 'signup-token-' + Date.now());

      setUser(newUser);
      console.log('✅ Signup successful:', newUser);
    } catch (error) {
      console.error('❌ Signup error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    console.log('➡ Logout called');
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    setUser(null);
    console.log('✅ Logout completed');
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    signup,
    logout,
  };

  console.log('🔔 AuthContext value:', { user: user?.name, isLoading, isAuthenticated: !!user });

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
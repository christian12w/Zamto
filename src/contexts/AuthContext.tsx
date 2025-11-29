'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '../services/authService';

interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'user';
  createdAt: string;
  lastLogin?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (username: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  register: (username: string, email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; message?: string }>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is already logged in on app start
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('authToken');
      const storedUser = localStorage.getItem('authUser');
      
      if (storedToken && storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          // Validate the token
          const validation = await authService.validateToken(storedToken);
          if (validation.valid && validation.user) {
            setUser(validation.user);
            setToken(storedToken);
          } else {
            // Clear invalid data
            localStorage.removeItem('authToken');
            localStorage.removeItem('authUser');
          }
        } catch (e) {
          // If parsing fails, clear the stored data
          localStorage.removeItem('authToken');
          localStorage.removeItem('authUser');
        }
      }
      
      setIsLoading(false);
    };
    
    initializeAuth();
  }, []);

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await authService.login({ username, password });
      
      if (response.success && response.user && response.token) {
        setUser(response.user);
        setToken(response.token);
        
        // Store in localStorage for persistence with security considerations
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('authUser', JSON.stringify(response.user));
        
        return { success: true, message: response.message };
      } else {
        // Clear any existing auth data on failed login
        localStorage.removeItem('authToken');
        localStorage.removeItem('authUser');
        setUser(null);
        setToken(null);
        
        return { success: false, message: response.message };
      }
    } catch (error) {
      // Clear auth data on error
      localStorage.removeItem('authToken');
      localStorage.removeItem('authUser');
      setUser(null);
      setToken(null);
      
      return { success: false, message: 'An error occurred during login' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    if (token) {
      await authService.logout(token);
    }
    
    setUser(null);
    setToken(null);
    
    // Clear localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
  };

  const register = async (username: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await authService.register({ username, email, password });
      
      if (response.success && response.user && response.token) {
        setUser(response.user);
        setToken(response.token);
        
        // Store in localStorage for persistence
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('authUser', JSON.stringify(response.user));
        
        return { success: true, message: response.message };
      } else {
        return { success: false, message: response.message };
      }
    } catch (error) {
      return { success: false, message: 'An error occurred during registration' };
    } finally {
      setIsLoading(false);
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    if (!token) {
      return { success: false, message: 'Authentication required' };
    }
    
    setIsLoading(true);
    try {
      const response = await authService.changePassword(token, currentPassword, newPassword);
      return response;
    } catch (error) {
      return { success: false, message: 'An error occurred while changing password' };
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    token,
    login,
    logout,
    register,
    changePassword,
    isLoading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
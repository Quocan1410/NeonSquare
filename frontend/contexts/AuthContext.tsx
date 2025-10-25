// frontend/contexts/AuthContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiService, User, AuthResponse, LoginRequest, RegisterRequest } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<AuthResponse>;
  register: (userData: RegisterRequest) => Promise<AuthResponse>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  useEffect(() => {
    // Check if user is already authenticated on mount
    const checkAuth = async () => {
      if (apiService.isAuthenticated()) {
        try {
          // Try to get user info from token
          const token = apiService.getToken();
          if (token) {
            // For now, we'll create a dummy user from token
            // In a real app, you'd validate the token with the backend
            console.log('Token found, setting user as authenticated');
            setUser({
              id: 'temp-user-id',
              firstName: 'User',
              lastName: 'Name',
              email: 'user@example.com',
              isOnline: true,
              lastSeen: 'Online now'
            });
          }
        } catch (error) {
          console.error('Auth check failed:', error);
          apiService.logout();
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (credentials: LoginRequest): Promise<AuthResponse> => {
    try {
      const response = await apiService.login(credentials);
      if (response.success) {
        // Set token in apiService
        apiService.setToken(response.token);
        
        setUser({
          id: response.userId,
          firstName: response.firstName,
          lastName: response.lastName,
          email: response.email,
          isOnline: true,
          lastSeen: 'Online now'
        });
      }
      return response;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const register = async (userData: RegisterRequest): Promise<AuthResponse> => {
    try {
      const response = await apiService.register(userData);
      if (response.success) {
        // Set token in apiService
        apiService.setToken(response.token);
        
        setUser({
          id: response.userId,
          firstName: response.firstName,
          lastName: response.lastName,
          email: response.email,
          isOnline: true,
          lastSeen: 'Online now'
        });
      }
      return response;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  const logout = () => {
    apiService.logout();
    setUser(null);
    // Redirect to login page
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  };

  const refreshUser = async () => {
    if (apiService.isAuthenticated()) {
      try {
        // In a real app, you'd call an endpoint to get current user
        // For now, we'll just keep the current user
      } catch (error) {
        console.error('Failed to refresh user:', error);
        logout();
      }
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};


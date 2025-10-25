// NeonSquare/frontend/contexts/AuthContext.tsx
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
    const checkAuth = async () => {
      if (apiService.isAuthenticated()) {
        try {
          const userData = await apiService.getCurrentUser();
          setUser({
            id: userData.id,                                    // already string in api types
            firstName: userData.firstName ?? '',               // defensive fallback
            lastName: userData.lastName ?? '',
            email: userData.email ?? '',
            profilePicUrl: userData.profilePicUrl,
            status: userData.status,
            isOnline: true,
            lastSeen: 'Online now',
          });
        } catch {
          apiService.logout();
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await apiService.login(credentials); // soft: never throws
    if (response.success && response.token && response.userId) {
      // Persist ONLY when we have both values
      apiService.setSession(response.token, response.userId);

      setUser({
        id: response.userId,                                  // safe: non-null under guard
        firstName: response.firstName ?? '',
        lastName: response.lastName ?? '',
        email: response.email ?? '',
        isOnline: true,
        lastSeen: 'Online now',
      });
    }
    return response;
  };

  const register = async (userData: RegisterRequest): Promise<AuthResponse> => {
    const response = await apiService.register(userData); // soft: never throws
    if (response.success && response.token && response.userId) {
      apiService.setSession(response.token, response.userId);

      setUser({
        id: response.userId,
        firstName: response.firstName ?? '',
        lastName: response.lastName ?? '',
        email: response.email ?? '',
        isOnline: true,
        lastSeen: 'Online now',
      });
    }
    return response;
  };

  const logout = () => {
    apiService.logout();
    setUser(null);
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  };

  const refreshUser = async () => {
    if (apiService.isAuthenticated()) {
      try {
        const userData = await apiService.getCurrentUser();
        setUser({
          id: userData.id,
          firstName: userData.firstName ?? '',
          lastName: userData.lastName ?? '',
          email: userData.email ?? '',
          profilePicUrl: userData.profilePicUrl,
          status: userData.status,
          isOnline: true,
          lastSeen: 'Online now',
        });
      } catch {
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

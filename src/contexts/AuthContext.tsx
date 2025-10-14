import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '@/lib/api-client';

interface User {
  id: number;
  email: string;
  full_name: string;
  role: 'senior' | 'caregiver' | 'provider';
  created_at: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName: string, role: 'senior' | 'caregiver' | 'provider') => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Session token storage key - using a unique key per session
const SESSION_TOKEN_KEY = 'peace_watch_session_token';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user has a valid session token
    const validateSession = async () => {
      const sessionToken = sessionStorage.getItem(SESSION_TOKEN_KEY);
      if (sessionToken) {
        try {
          const userData = await authApi.validateSession(sessionToken);
          setUser(userData);
        } catch (error) {
          console.error('Session validation failed:', error);
          sessionStorage.removeItem(SESSION_TOKEN_KEY);
        }
      }
      setIsLoading(false);
    };

    validateSession();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authApi.login(email, password);
      const { sessionToken, ...userData } = response;

      // Store session token in sessionStorage (separate per tab/window)
      sessionStorage.setItem(SESSION_TOKEN_KEY, sessionToken);
      setUser(userData as User);
    } catch (error) {
      throw error;
    }
  };

  const register = async (email: string, password: string, fullName: string, role: 'senior' | 'caregiver' | 'provider') => {
    try {
      const response = await authApi.register(email, password, fullName, role);
      const { sessionToken, ...userData } = response;

      // Store session token in sessionStorage
      sessionStorage.setItem(SESSION_TOKEN_KEY, sessionToken);
      setUser(userData as User);
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      const sessionToken = sessionStorage.getItem(SESSION_TOKEN_KEY);
      if (sessionToken) {
        await authApi.logout(sessionToken);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      sessionStorage.removeItem(SESSION_TOKEN_KEY);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Export function to get session token for API calls
export const getSessionToken = () => {
  return sessionStorage.getItem(SESSION_TOKEN_KEY);
};

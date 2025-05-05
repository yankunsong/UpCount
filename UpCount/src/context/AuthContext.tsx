import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { User } from '../types';
import { userApi } from '../services/api/endpoints';

// Types
type AuthState = {
  user: User | null;
  isLoading: boolean;
  error: string | null;
};

type AuthAction =
  | { type: 'LOGIN_START' | 'LOGOUT' | 'CLEAR_ERROR' }
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGIN_ERROR'; payload: string }
  | { type: 'UPDATE_USER'; payload: User };

type AuthContextType = {
  state: AuthState;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => Promise<void>;
  clearError: () => void;
};

// Initial state
const initialState: AuthState = {
  user: null,
  isLoading: false,
  error: null,
};

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Reducer
function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, isLoading: true, error: null };
    case 'LOGIN_SUCCESS':
      return { ...state, isLoading: false, user: action.payload };
    case 'LOGIN_ERROR':
      return { ...state, isLoading: false, error: action.payload };
    case 'LOGOUT':
      return { ...initialState };
    case 'UPDATE_USER':
      return { ...state, user: action.payload };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
}

// Provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const login = useCallback(async (email: string, password: string) => {
    try {
      dispatch({ type: 'LOGIN_START' });
      // TODO: Implement actual login API call
      const user = await userApi.getCurrentUser();
      dispatch({ type: 'LOGIN_SUCCESS', payload: user.data });
    } catch (error) {
      dispatch({ type: 'LOGIN_ERROR', payload: 'Login failed. Please try again.' });
    }
  }, []);

  const logout = useCallback(() => {
    // TODO: Implement logout API call if needed
    dispatch({ type: 'LOGOUT' });
  }, []);

  const updateUser = useCallback(async (userData: Partial<User>) => {
    try {
      const response = await userApi.updateUser(userData);
      dispatch({ type: 'UPDATE_USER', payload: response.data });
    } catch (error) {
      dispatch({ type: 'LOGIN_ERROR', payload: 'Failed to update user profile.' });
    }
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  const value = {
    state,
    login,
    logout,
    updateUser,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

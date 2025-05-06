import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import { Auth } from 'aws-amplify';
import { User } from '../types';

// Types
type AuthState = {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
};

type AuthAction =
  | { type: 'AUTH_START' | 'LOGOUT' | 'CLEAR_ERROR' }
  | { type: 'AUTH_SUCCESS'; payload: User }
  | { type: 'AUTH_ERROR'; payload: string }
  | { type: 'UPDATE_USER'; payload: User }
  | { type: 'SET_AUTHENTICATED'; payload: boolean };

type AuthContextType = {
  state: AuthState;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signUp: (username: string, password: string, email: string, name: string) => Promise<void>;
  confirmSignUp: (username: string, code: string) => Promise<void>;
  resendConfirmationCode: (username: string) => Promise<void>;
  forgotPassword: (username: string) => Promise<void>;
  forgotPasswordSubmit: (username: string, code: string, newPassword: string) => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
  clearError: () => void;
  checkAuth: () => Promise<void>;
};

// Initial state
const initialState: AuthState = {
  user: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
};

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Reducer
function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'AUTH_START':
      return { ...state, isLoading: true, error: null };
    case 'AUTH_SUCCESS':
      return { 
        ...state, 
        isLoading: false, 
        user: action.payload, 
        isAuthenticated: true 
      };
    case 'AUTH_ERROR':
      return { ...state, isLoading: false, error: action.payload };
    case 'LOGOUT':
      return { ...initialState };
    case 'UPDATE_USER':
      return { ...state, user: action.payload };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    case 'SET_AUTHENTICATED':
      return { ...state, isAuthenticated: action.payload };
    default:
      return state;
  }
}

// Helper function to map Cognito user to our User type
const mapCognitoUserToUser = (cognitoUser: any): User => {
  const attributes = cognitoUser.attributes || {};
  
  return {
    userId: cognitoUser.username || attributes.sub,
    email: attributes.email || '',
    name: attributes.name || '',
    profileImage: attributes.picture || '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

// Provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check if user is authenticated on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = useCallback(async () => {
    try {
      dispatch({ type: 'AUTH_START' });
      
      const currentUser = await Auth.currentAuthenticatedUser();
      if (currentUser) {
        const user = mapCognitoUserToUser(currentUser);
        dispatch({ type: 'AUTH_SUCCESS', payload: user });
      } else {
        dispatch({ type: 'SET_AUTHENTICATED', payload: false });
      }
    } catch (error) {
      // Not authenticated, but not an error
      dispatch({ type: 'SET_AUTHENTICATED', payload: false });
    }
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    try {
      dispatch({ type: 'AUTH_START' });
      
      const cognitoUser = await Auth.signIn(username, password);
      const user = mapCognitoUserToUser(cognitoUser);
      
      dispatch({ type: 'AUTH_SUCCESS', payload: user });
    } catch (error) {
      let errorMessage = 'Login failed. Please try again.';
      
      if (error instanceof Error) {
        if (error.name === 'UserNotConfirmedException') {
          errorMessage = 'Please confirm your account through the email sent to you.';
        } else if (error.message) {
          errorMessage = error.message;
        }
      }
      
      dispatch({ type: 'AUTH_ERROR', payload: errorMessage });
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await Auth.signOut();
      dispatch({ type: 'LOGOUT' });
    } catch (error) {
      console.error('Error signing out:', error);
      // Still logout from the app even if there was an API error
      dispatch({ type: 'LOGOUT' });
    }
  }, []);

  const signUp = useCallback(async (username: string, password: string, email: string, name: string) => {
    try {
      dispatch({ type: 'AUTH_START' });
      
      await Auth.signUp({
        username,
        password,
        attributes: {
          email,
          name,
        },
      });
      
      dispatch({ type: 'SET_AUTHENTICATED', payload: false });
    } catch (error) {
      let errorMessage = 'Sign up failed. Please try again.';
      
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      dispatch({ type: 'AUTH_ERROR', payload: errorMessage });
      throw error;
    }
  }, []);

  const confirmSignUp = useCallback(async (username: string, code: string) => {
    try {
      dispatch({ type: 'AUTH_START' });
      
      await Auth.confirmSignUp(username, code);
      
      dispatch({ type: 'SET_AUTHENTICATED', payload: false });
    } catch (error) {
      let errorMessage = 'Confirmation failed. Please try again.';
      
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      dispatch({ type: 'AUTH_ERROR', payload: errorMessage });
      throw error;
    }
  }, []);

  const resendConfirmationCode = useCallback(async (username: string) => {
    try {
      dispatch({ type: 'AUTH_START' });
      
      await Auth.resendSignUp(username);
      
      dispatch({ type: 'SET_AUTHENTICATED', payload: false });
    } catch (error) {
      let errorMessage = 'Failed to resend code. Please try again.';
      
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      dispatch({ type: 'AUTH_ERROR', payload: errorMessage });
      throw error;
    }
  }, []);

  const forgotPassword = useCallback(async (username: string) => {
    try {
      dispatch({ type: 'AUTH_START' });
      
      await Auth.forgotPassword(username);
      
      dispatch({ type: 'SET_AUTHENTICATED', payload: false });
    } catch (error) {
      let errorMessage = 'Failed to request password reset. Please try again.';
      
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      dispatch({ type: 'AUTH_ERROR', payload: errorMessage });
      throw error;
    }
  }, []);

  const forgotPasswordSubmit = useCallback(
    async (username: string, code: string, newPassword: string) => {
      try {
        dispatch({ type: 'AUTH_START' });
        
        await Auth.forgotPasswordSubmit(username, code, newPassword);
        
        dispatch({ type: 'SET_AUTHENTICATED', payload: false });
      } catch (error) {
        let errorMessage = 'Failed to reset password. Please try again.';
        
        if (error instanceof Error) {
          errorMessage = error.message;
        }
        
        dispatch({ type: 'AUTH_ERROR', payload: errorMessage });
        throw error;
      }
    },
    []
  );

  const updateUser = useCallback(async (userData: Partial<User>) => {
    try {
      dispatch({ type: 'AUTH_START' });
      
      // Only allow updating name or profile picture for now
      const currentUser = await Auth.currentAuthenticatedUser();
      const attributes: Record<string, string> = {};
      
      if (userData.name) {
        attributes.name = userData.name;
      }
      if (userData.profileImage) {
        attributes.picture = userData.profileImage;
      }
      
      if (Object.keys(attributes).length > 0) {
        await Auth.updateUserAttributes(currentUser, attributes);
        
        // Get updated user
        const updatedUser = await Auth.currentAuthenticatedUser({ bypassCache: true });
        const user = mapCognitoUserToUser(updatedUser);
        
        dispatch({ type: 'UPDATE_USER', payload: user });
      }
    } catch (error) {
      let errorMessage = 'Failed to update user profile. Please try again.';
      
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      dispatch({ type: 'AUTH_ERROR', payload: errorMessage });
      throw error;
    }
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  const value = {
    state,
    login,
    logout,
    signUp,
    confirmSignUp,
    resendConfirmationCode,
    forgotPassword,
    forgotPasswordSubmit,
    updateUser,
    clearError,
    checkAuth,
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
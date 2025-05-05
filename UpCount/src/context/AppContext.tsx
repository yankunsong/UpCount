import React, { createContext, useContext, useReducer, useCallback } from 'react';

// Types
type Theme = 'light' | 'dark';

type AppState = {
  theme: Theme;
  isOfflineMode: boolean;
  pushNotificationsEnabled: boolean;
  isLoading: boolean;
  error: string | null;
};

type AppAction =
  | { type: 'SET_THEME'; payload: Theme }
  | { type: 'TOGGLE_OFFLINE_MODE' }
  | { type: 'TOGGLE_PUSH_NOTIFICATIONS' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

type AppContextType = {
  state: AppState;
  setTheme: (theme: Theme) => void;
  toggleOfflineMode: () => void;
  togglePushNotifications: () => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
};

// Initial state
const initialState: AppState = {
  theme: 'light',
  isOfflineMode: false,
  pushNotificationsEnabled: false,
  isLoading: false,
  error: null,
};

// Create context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Reducer
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_THEME':
      return { ...state, theme: action.payload };
    case 'TOGGLE_OFFLINE_MODE':
      return { ...state, isOfflineMode: !state.isOfflineMode };
    case 'TOGGLE_PUSH_NOTIFICATIONS':
      return {
        ...state,
        pushNotificationsEnabled: !state.pushNotificationsEnabled,
      };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
}

// Provider component
export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const setTheme = useCallback((theme: Theme) => {
    dispatch({ type: 'SET_THEME', payload: theme });
  }, []);

  const toggleOfflineMode = useCallback(() => {
    dispatch({ type: 'TOGGLE_OFFLINE_MODE' });
  }, []);

  const togglePushNotifications = useCallback(() => {
    dispatch({ type: 'TOGGLE_PUSH_NOTIFICATIONS' });
  }, []);

  const setLoading = useCallback((isLoading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: isLoading });
  }, []);

  const setError = useCallback((error: string | null) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  }, []);

  const value = {
    state,
    setTheme,
    toggleOfflineMode,
    togglePushNotifications,
    setLoading,
    setError,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// Custom hook to use app context
export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

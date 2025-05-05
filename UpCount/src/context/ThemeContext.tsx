import React, { createContext, useState, useContext, ReactNode } from 'react';

// Define theme colors
interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  text: string;
  textSecondary: string;
  border: string;
  error: string;
  success: string;
}

// Theme definitions
const lightTheme: ThemeColors = {
  primary: '#007AFF',
  secondary: '#5AC8FA',
  background: '#FFFFFF',
  text: '#000000',
  textSecondary: '#666666',
  border: '#EEEEEE',
  error: '#FF3B30',
  success: '#34C759',
};

const darkTheme: ThemeColors = {
  primary: '#0A84FF',
  secondary: '#64D2FF',
  background: '#121212',
  text: '#FFFFFF',
  textSecondary: '#ADADAD',
  border: '#333333',
  error: '#FF453A',
  success: '#30D158',
};

// Context type
interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
  colors: ThemeColors;
}

// Create context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Provider component
interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  const colors = isDarkMode ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook for using the theme context
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

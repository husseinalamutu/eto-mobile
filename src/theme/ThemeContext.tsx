import React, { createContext, useContext, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import {
  ThemeTokens,
  getTheme,
  getRiskConfig,
  getStatusConfig,
  DARK_TOKENS,
  DARK_RISK_CONFIG,
  DARK_STATUS_CONFIG,
} from './tokens';

interface ThemeContextValue {
  theme: ThemeTokens;
  isDark: boolean;
  colorScheme: 'light' | 'dark';
  riskConfig: ReturnType<typeof getRiskConfig>;
  statusConfig: ReturnType<typeof getStatusConfig>;
}

const defaultContextValue: ThemeContextValue = {
  theme: DARK_TOKENS,
  isDark: true,
  colorScheme: 'dark',
  riskConfig: DARK_RISK_CONFIG,
  statusConfig: DARK_STATUS_CONFIG,
};

const ThemeContext = createContext<ThemeContextValue>(defaultContextValue);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemScheme = useColorScheme();
  const isDark = systemScheme !== 'light'; // Default to dark grey if undefined or 'dark'
  const colorScheme = isDark ? 'dark' : 'light';

  const value = useMemo<ThemeContextValue>(() => {
    return {
      theme: getTheme(colorScheme),
      isDark,
      colorScheme,
      riskConfig: getRiskConfig(colorScheme),
      statusConfig: getStatusConfig(colorScheme),
    };
  }, [colorScheme, isDark]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  return context || defaultContextValue;
}

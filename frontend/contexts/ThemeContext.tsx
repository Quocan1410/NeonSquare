'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { usePathname } from 'next/navigation';

export type ThemeType = 'dashboard' | 'friends' | 'explore';

interface ThemeColors {
  primary: string;
  primaryForeground: string;
  primary50: string;
  primary100: string;
  primary200: string;
  primary500: string;
  primary600: string;
  primary700: string;
  accent: string;
  accentForeground: string;
  accent50: string;
  accent100: string;
  accent500: string;
  accent600: string;
  accent700: string;
  gradient: string;
  heroGradient: string;
  cardGradient: string;
  name: string;
  description: string;
}

const themes: Record<ThemeType, ThemeColors> = {
  dashboard: {
    primary: '#2563EB',
    primaryForeground: '#FFFFFF',
    primary50: '#EFF6FF',
    primary100: '#DBEAFE',
    primary200: '#BFDBFE',
    primary500: '#3B82F6',
    primary600: '#2563EB',
    primary700: '#1D4ED8',
    accent: '#3B82F6',
    accentForeground: '#FFFFFF',
    accent50: '#EFF6FF',
    accent100: '#DBEAFE',
    accent500: '#3B82F6',
    accent600: '#2563EB',
    accent700: '#1D4ED8',
    gradient: 'from-blue-600 via-blue-700 to-indigo-800',
    heroGradient: 'from-blue-600 via-blue-700 to-indigo-800',
    cardGradient: 'from-blue-50 to-indigo-50',
    name: 'Community',
    description: 'Share & Connect'
  },
  friends: {
    primary: '#059669',
    primaryForeground: '#FFFFFF',
    primary50: '#ECFDF5',
    primary100: '#D1FAE5',
    primary200: '#A7F3D0',
    primary500: '#10B981',
    primary600: '#059669',
    primary700: '#047857',
    accent: '#10B981',
    accentForeground: '#FFFFFF',
    accent50: '#ECFDF5',
    accent100: '#D1FAE5',
    accent500: '#10B981',
    accent600: '#059669',
    accent700: '#047857',
    gradient: 'from-emerald-600 via-teal-700 to-cyan-800',
    heroGradient: 'from-emerald-600 via-teal-700 to-cyan-800',
    cardGradient: 'from-emerald-50 to-teal-50',
    name: 'Networking',
    description: 'Expand Your Circle'
  },
  explore: {
    primary: '#9333EA',
    primaryForeground: '#FFFFFF',
    primary50: '#FAF5FF',
    primary100: '#F3E8FF',
    primary200: '#E9D5FF',
    primary500: '#A855F7',
    primary600: '#9333EA',
    primary700: '#7C3AED',
    accent: '#A855F7',
    accentForeground: '#FFFFFF',
    accent50: '#FAF5FF',
    accent100: '#F3E8FF',
    accent500: '#A855F7',
    accent600: '#9333EA',
    accent700: '#7C3AED',
    gradient: 'from-purple-600 via-violet-700 to-fuchsia-800',
    heroGradient: 'from-purple-600 via-violet-700 to-fuchsia-800',
    cardGradient: 'from-purple-50 to-violet-50',
    name: 'Discovery',
    description: 'Explore & Discover'
  }
};

interface ThemeContextType {
  currentTheme: ThemeType;
  themeColors: ThemeColors;
  setTheme: (theme: ThemeType) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const pathname = usePathname();
  const [currentTheme, setCurrentTheme] = useState<ThemeType>('dashboard');

  // Auto-detect theme based on pathname
  useEffect(() => {
    console.log('🔍 Current pathname:', pathname);
    
    if (pathname === '/dashboard' || pathname === '/') {
      setCurrentTheme('dashboard');
      console.log('🎨 Theme switched to Dashboard (Blue)');
    } else if (pathname === '/friends') {
      setCurrentTheme('friends');
      console.log('🎨 Theme switched to Friends (Emerald)');
    } else if (pathname === '/explore') {
      setCurrentTheme('explore');
      console.log('🎨 Theme switched to Explore (Purple)');
    } else {
      // Default to dashboard for other pages
      setCurrentTheme('dashboard');
      console.log('🎨 Theme defaulted to Dashboard (Blue)');
    }
  }, [pathname]);

  const themeColors = themes[currentTheme];

  const setTheme = (theme: ThemeType) => {
    setCurrentTheme(theme);
  };

  // Apply theme colors to CSS variables
  useEffect(() => {
    const root = document.documentElement;
    
    // Force update CSS variables with !important
    root.style.setProperty('--primary', themeColors.primary, 'important');
    root.style.setProperty('--primary-foreground', themeColors.primaryForeground, 'important');
    root.style.setProperty('--primary-50', themeColors.primary50, 'important');
    root.style.setProperty('--primary-100', themeColors.primary100, 'important');
    root.style.setProperty('--primary-200', themeColors.primary200, 'important');
    root.style.setProperty('--primary-500', themeColors.primary500, 'important');
    root.style.setProperty('--primary-600', themeColors.primary600, 'important');
    root.style.setProperty('--primary-700', themeColors.primary700, 'important');
    root.style.setProperty('--accent', themeColors.accent, 'important');
    root.style.setProperty('--accent-foreground', themeColors.accentForeground, 'important');
    root.style.setProperty('--accent-50', themeColors.accent50, 'important');
    root.style.setProperty('--accent-100', themeColors.accent100, 'important');
    root.style.setProperty('--accent-500', themeColors.accent500, 'important');
    root.style.setProperty('--accent-600', themeColors.accent600, 'important');
    root.style.setProperty('--accent-700', themeColors.accent700, 'important');
    
    // Also update secondary colors to match theme
    root.style.setProperty('--secondary', themeColors.primary50, 'important');
    root.style.setProperty('--secondary-foreground', themeColors.primary700, 'important');
    
    // Also set theme variables
    root.style.setProperty('--theme-primary', themeColors.primary);
    root.style.setProperty('--theme-primary-foreground', themeColors.primaryForeground);
    root.style.setProperty('--theme-primary-50', themeColors.primary50);
    root.style.setProperty('--theme-primary-100', themeColors.primary100);
    root.style.setProperty('--theme-primary-200', themeColors.primary200);
    root.style.setProperty('--theme-primary-500', themeColors.primary500);
    root.style.setProperty('--theme-primary-600', themeColors.primary600);
    root.style.setProperty('--theme-primary-700', themeColors.primary700);
    
    console.log('🎨 CSS Variables updated:', {
      primary: themeColors.primary,
      theme: currentTheme,
      pathname: pathname
    });
  }, [themeColors, currentTheme, pathname]);

  const value: ThemeContextType = {
    currentTheme,
    themeColors,
    setTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      <div key={currentTheme} className="theme-wrapper">
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

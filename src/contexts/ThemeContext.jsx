import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function useTheme() {
  return useContext(ThemeContext);
}

const themes = {
  default: {
    name: 'Default',
    primary: 'blue',
    colors: {
      primary: '#3B82F6',
      primaryHover: '#2563EB',
      secondary: '#6B7280',
      accent: '#10B981',
      background: '#F9FAFB',
      surface: '#FFFFFF',
      text: '#111827',
      textSecondary: '#6B7280',
      border: '#E5E7EB',
      error: '#EF4444',
      success: '#10B981',
      warning: '#F59E0B'
    },
    gradients: {
      primary: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
      secondary: 'linear-gradient(135deg, #6B7280 0%, #4B5563 100%)'
    }
  },
  ocean: {
    name: 'Ocean Breeze',
    primary: 'teal',
    colors: {
      primary: '#0F766E',
      primaryHover: '#115E59',
      secondary: '#64748B',
      accent: '#0891B2',
      background: '#F0FDFA',
      surface: '#FFFFFF',
      text: '#0F172A',
      textSecondary: '#64748B',
      border: '#CCFBF1',
      error: '#EF4444',
      success: '#10B981',
      warning: '#F59E0B'
    },
    gradients: {
      primary: 'linear-gradient(135deg, #0F766E 0%, #115E59 100%)',
      secondary: 'linear-gradient(135deg, #64748B 0%, #475569 100%)'
    }
  }
};

export function ThemeProvider({ children }) {
  const [currentTheme, setCurrentTheme] = useState('default');
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'ocean';
    setCurrentTheme(savedTheme);
  }, []);

  const changeTheme = (themeName) => {
    if (themes[themeName]) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentTheme(themeName);
        localStorage.setItem('theme', themeName);
        setIsAnimating(false);
      }, 150);
    }
  };

  const theme = themes[currentTheme] || themes.default;

  const value = {
    theme,
    currentTheme,
    themes: Object.keys(themes),
    changeTheme,
    isAnimating,
    themeConfig: theme
  };

  return (
    <ThemeContext.Provider value={value}>
      <div
        className={`min-h-screen transition-all duration-300 ease-in-out theme-${currentTheme} ${isAnimating ? 'opacity-80 scale-95' : 'opacity-100 scale-100'}`}
        style={{
          '--color-primary': theme.colors.primary,
          '--color-primary-hover': theme.colors.primaryHover,
          '--color-secondary': theme.colors.secondary,
          '--color-accent': theme.colors.accent,
          '--color-background': theme.colors.background,
          '--color-surface': theme.colors.surface,
          '--color-text': theme.colors.text,
          '--color-text-secondary': theme.colors.textSecondary,
          '--color-border': theme.colors.border,
          '--color-error': theme.colors.error,
          '--color-success': theme.colors.success,
          '--color-warning': theme.colors.warning,
          '--gradient-primary': theme.gradients.primary,
          '--gradient-secondary': theme.gradients.secondary,
          backgroundColor: 'var(--color-background)',
          color: 'var(--color-text)'
        }}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

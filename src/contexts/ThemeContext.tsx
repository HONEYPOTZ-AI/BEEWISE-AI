import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';
type ResolvedTheme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  isSystemTheme: boolean;
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
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>('system');
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>('light');

  // Get system theme preference
  const getSystemTheme = (): ResolvedTheme => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  };

  // Resolve theme based on current setting
  const resolveTheme = (currentTheme: Theme): ResolvedTheme => {
    if (currentTheme === 'system') {
      return getSystemTheme();
    }
    return currentTheme;
  };

  // Initialize theme from localStorage or system
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    const initialTheme = savedTheme || 'system';
    setThemeState(initialTheme);

    const resolved = resolveTheme(initialTheme);
    setResolvedTheme(resolved);

    // Apply theme immediately
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(resolved);
    root.setAttribute('data-theme', resolved);
  }, []);

  // Apply theme to document with smooth transition
  useEffect(() => {
    const root = document.documentElement;

    // Add transition class temporarily for smooth transition
    root.classList.add('theme-transition');

    // Remove old theme classes and add new one
    root.classList.remove('light', 'dark');
    root.classList.add(resolvedTheme);
    root.setAttribute('data-theme', resolvedTheme);

    // Update meta theme-color for browser UI
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    const themeColor = resolvedTheme === 'dark' ? '#0f172a' : '#ffffff';

    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', themeColor);
    } else {
      const newMetaThemeColor = document.createElement('meta');
      newMetaThemeColor.setAttribute('name', 'theme-color');
      newMetaThemeColor.setAttribute('content', themeColor);
      document.head.appendChild(newMetaThemeColor);
    }

    // Remove transition class after animation
    setTimeout(() => {
      root.classList.remove('theme-transition');
    }, 300);
  }, [resolvedTheme]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      if (theme === 'system') {
        setResolvedTheme(e.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    const resolved = resolveTheme(newTheme);
    setResolvedTheme(resolved);

    // Persist theme preference
    localStorage.setItem('theme', newTheme);

    // Dispatch custom event for components that need to react to theme changes
    window.dispatchEvent(new CustomEvent('theme-change', {
      detail: { theme: newTheme, resolvedTheme: resolved }
    }));
  };

  const toggleTheme = () => {
    const newTheme = resolvedTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  const value: ThemeContextType = {
    theme,
    resolvedTheme,
    setTheme,
    toggleTheme,
    isSystemTheme: theme === 'system'
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>);

};
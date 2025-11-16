import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

export type AppTheme = 'purple' | 'green' | 'blue' | 'red' | 'teal' | 'amber';

type ThemeCtx = {
  theme: AppTheme;
  setTheme: (t: AppTheme) => void;
};

const STORAGE_KEY = 'quiz-theme';
const ThemeCtxInternal = createContext<ThemeCtx | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<AppTheme>('purple');

  // első betöltés: localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as AppTheme | null;
      if (saved) setThemeState(saved);
    } catch {
      /* no-op */
    }
  }, []);

  // DOM + mentés
  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      /* no-op */
    }
  }, [theme]);

  const value = useMemo<ThemeCtx>(
    () => ({
      theme,
      setTheme: (t: AppTheme) => setThemeState(t),
    }),
    [theme]
  );

  return (
    <ThemeCtxInternal.Provider value={value}>
      {children}
    </ThemeCtxInternal.Provider>
  );
}

export function useAppTheme(): ThemeCtx {
  const ctx = useContext(ThemeCtxInternal);
  if (!ctx) throw new Error('useAppTheme must be used within ThemeProvider');
  return ctx;
}
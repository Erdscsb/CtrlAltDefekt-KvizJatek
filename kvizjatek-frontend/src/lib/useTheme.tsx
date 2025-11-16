import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

export type AppTheme = 'purple' | 'green' | 'blue' | 'red';

type ThemeCtx = {
  theme: AppTheme;
  setTheme: (t: AppTheme) => void;
};

const STORAGE_KEY = 'quiz-theme';

const ThemeCtxInternal = createContext<ThemeCtx | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<AppTheme>('purple');

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as AppTheme | null;
    if (saved) setTheme(saved);
  }, []);

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const value = useMemo<ThemeCtx>(() => ({ theme, setTheme }), [theme]);

  // NINCS JSX itt? Dehogynem, ez JSX. Ha így hagyod, fájl legyen .tsx!
  return (
    <ThemeCtxInternal.Provider value={value}>
      {children}
    </ThemeCtxInternal.Provider>
  );
}

export function useAppTheme(): ThemeCtx {
  const ctx = useContext(ThemeCtxInternal);
  if (!ctx) {
    throw new Error('useAppTheme must be used within ThemeProvider');
  }
  return ctx;
}
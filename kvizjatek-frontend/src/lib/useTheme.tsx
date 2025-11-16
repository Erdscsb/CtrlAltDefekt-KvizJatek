import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

export type AppTheme = 'purple' | 'green' | 'blue' | 'red' | 'teal' | 'amber';
type ThemeCtx = { theme: AppTheme; setTheme: (t: AppTheme) => void };

const STORAGE_KEY = 'quiz-theme';
const Ctx = createContext<ThemeCtx | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  // 1) Kezdő értéket próbáljuk szinkronban beolvasni (ha a boot script nem futna)
  const getInitial = (): AppTheme => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as AppTheme | null;
      return saved || 'purple';
    } catch {
      return 'purple';
    }
  };

  const [theme, setThemeState] = useState<AppTheme>(getInitial);

  // 2) Alkalmazzuk a body-n és mentsük
  useEffect(() => {
    try {
      document.body.setAttribute('data-theme', theme);
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      /* no-op */
    }
  }, [theme]);

  const value = useMemo<ThemeCtx>(
    () => ({ theme, setTheme: (t) => setThemeState(t) }),
    [theme]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAppTheme(): ThemeCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useAppTheme must be used within ThemeProvider');
  return ctx;
}
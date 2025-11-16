import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

/**
 * Defines the user object structure, matching the backend API response.
 *
 */
export type User = {
  id: number;
  username: string;
  email: string;
  is_admin: boolean;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (user: User, accessToken: string, refreshToken: string) => void;
  logout: () => void;
};

// Storage keys for session persistence
const USER_STORAGE_KEY = 'quiz-user';
const TOKEN_STORAGE_KEY = 'quiz-token';
const REFRESH_TOKEN_STORAGE_KEY = 'quiz-refresh-token';

const AuthContext = createContext<AuthContextType | null>(null);

/**
 * Provides authentication state to its children components.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); // True on initial load

  // On component mount, try to load auth state from localStorage
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem(USER_STORAGE_KEY);
      const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY);

      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      }
    } catch (e) {
      console.error('Failed to load auth state from storage', e);
      // Clear storage if data is corrupted
      localStorage.removeItem(USER_STORAGE_KEY);
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
    } finally {
      setIsLoading(false); // Finished loading auth state
    }
  }, []);

  /**
   * Sets the user and tokens in state and localStorage.
   */
  const login = (
    userData: User,
    accessToken: string,
    refreshToken: string,
  ) => {
    try {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
      localStorage.setItem(TOKEN_STORAGE_KEY, accessToken);
      localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, refreshToken);
      setUser(userData);
      setToken(accessToken);
    } catch (e) {
      console.error('Failed to save auth state to storage', e);
    }
  };

  /**
   * Clears the user and tokens from state and localStorage.
   */
  const logout = () => {
    try {
      localStorage.removeItem(USER_STORAGE_KEY);
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
    } catch (e) {
      console.error('Failed to clear auth state from storage', e);
    }
    setUser(null);
    setToken(null);
  };

  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo<AuthContextType>(
    () => ({
      user,
      token,
      isLoading,
      // Derived boolean flags for convenience
      isAuthenticated: !!user && !!token,
      isAdmin: user?.is_admin || false,
      login,
      logout,
    }),
    [user, token, isLoading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Custom hook to access the authentication context.
 */
export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";

import {
  applyResolvedTheme,
  getStoredTheme,
  getSystemPrefersDark,
  resolveTheme,
  storeTheme,
  subscribeToStoredTheme,
  subscribeToSystemTheme,
  type ResolvedTheme,
  type Theme,
} from "@/lib/theme";

interface ThemeContextValue {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const getServerTheme = (): Theme => "system";
const getServerPrefersDark = () => false;

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Server snapshots keep SSR and hydration markup identical; React re-renders with the
  // real client values right after hydrating. The init script has already set the class.
  const theme = useSyncExternalStore(subscribeToStoredTheme, getStoredTheme, getServerTheme);
  const systemPrefersDark = useSyncExternalStore(
    subscribeToSystemTheme,
    getSystemPrefersDark,
    getServerPrefersDark,
  );
  const resolvedTheme = resolveTheme(theme, systemPrefersDark);

  useEffect(() => {
    // Read live values: during the hydration commit the rendered values are still the
    // server snapshot, and applying those would flash the wrong theme.
    applyResolvedTheme(resolveTheme(getStoredTheme(), getSystemPrefersDark()));
  }, [theme, systemPrefersDark]);

  const setTheme = useCallback((next: Theme) => {
    applyResolvedTheme(resolveTheme(next, getSystemPrefersDark()), { disableTransitions: true });
    storeTheme(next);
  }, []);

  const value = useMemo(
    () => ({ theme, resolvedTheme, setTheme }),
    [theme, resolvedTheme, setTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within a ThemeProvider");
  return context;
}

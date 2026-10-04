export const THEMES = ["light", "dark", "system"] as const;

export type Theme = (typeof THEMES)[number];
export type ResolvedTheme = "light" | "dark";

export const THEME_STORAGE_KEY = "ai-ops-theme";
const THEME_CHANGE_EVENT = "ai-ops-theme-change";
const DARK_QUERY = "(prefers-color-scheme: dark)";

export function isTheme(value: unknown): value is Theme {
  return THEMES.some((theme) => theme === value);
}

export function getStoredTheme(): Theme {
  try {
    const value = window.localStorage.getItem(THEME_STORAGE_KEY);
    return isTheme(value) ? value : "system";
  } catch {
    return "system";
  }
}

export function storeTheme(theme: Theme) {
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Storage can be unavailable (private mode, quota); the in-memory event still updates the UI.
  }
  window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
}

export function subscribeToStoredTheme(onChange: () => void) {
  const handleStorage = (event: StorageEvent) => {
    if (event.key === THEME_STORAGE_KEY) onChange();
  };
  window.addEventListener("storage", handleStorage);
  window.addEventListener(THEME_CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(THEME_CHANGE_EVENT, onChange);
  };
}

export function getSystemPrefersDark(): boolean {
  return window.matchMedia(DARK_QUERY).matches;
}

export function subscribeToSystemTheme(onChange: () => void) {
  const query = window.matchMedia(DARK_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

export function resolveTheme(theme: Theme, systemPrefersDark: boolean): ResolvedTheme {
  if (theme === "system") return systemPrefersDark ? "dark" : "light";
  return theme;
}

export function applyResolvedTheme(
  resolved: ResolvedTheme,
  { disableTransitions = false }: { disableTransitions?: boolean } = {},
) {
  const root = document.documentElement;
  // Suppress transitions for one frame so every surface switches at once instead of
  // animating colors at different speeds.
  const style = disableTransitions ? document.createElement("style") : null;
  if (style) {
    style.textContent = "*,*::before,*::after{transition:none!important}";
    document.head.appendChild(style);
  }

  root.classList.toggle("dark", resolved === "dark");
  root.style.colorScheme = resolved;

  if (style) {
    void window.getComputedStyle(document.body).opacity;
    window.setTimeout(() => style.remove(), 1);
  }
}

/**
 * Runs before React hydrates so the first paint already uses the stored theme.
 * Must stay dependency-free and in sync with getStoredTheme/resolveTheme above.
 */
export const themeInitScript = `(function(){try{var t=localStorage.getItem(${JSON.stringify(
  THEME_STORAGE_KEY,
)});var d=t==="dark"||(t!=="light"&&window.matchMedia(${JSON.stringify(
  DARK_QUERY,
)}).matches);var r=document.documentElement;r.classList.toggle("dark",d);r.style.colorScheme=d?"dark":"light"}catch(e){}})();`;

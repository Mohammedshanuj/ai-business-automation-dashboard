import { afterEach, describe, expect, it } from "vitest";

import { THEME_STORAGE_KEY, getStoredTheme, resolveTheme, storeTheme } from "@/lib/theme";

describe("resolveTheme", () => {
  it("returns explicit themes unchanged", () => {
    expect(resolveTheme("light", true)).toBe("light");
    expect(resolveTheme("dark", false)).toBe("dark");
  });

  it("follows the OS preference for system", () => {
    expect(resolveTheme("system", true)).toBe("dark");
    expect(resolveTheme("system", false)).toBe("light");
  });
});

describe("stored theme", () => {
  afterEach(() => window.localStorage.clear());

  it("defaults to system when nothing or an invalid value is stored", () => {
    expect(getStoredTheme()).toBe("system");
    window.localStorage.setItem(THEME_STORAGE_KEY, "sepia");
    expect(getStoredTheme()).toBe("system");
  });

  it("persists the selected theme", () => {
    storeTheme("dark");
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe("dark");
    expect(getStoredTheme()).toBe("dark");
  });
});

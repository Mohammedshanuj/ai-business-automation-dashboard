import type { User } from "@supabase/supabase-js";
import { describe, expect, it } from "vitest";

import { getDisplayName, getInitials } from "@/lib/userDisplay";

function makeUser(email: string | undefined, metadata: Record<string, unknown> = {}): User {
  return {
    id: "user-1",
    aud: "authenticated",
    app_metadata: {},
    user_metadata: metadata,
    created_at: "2026-01-01T00:00:00Z",
    ...(email === undefined ? {} : { email }),
  };
}

describe("getDisplayName", () => {
  it("prefers full_name, then name from user metadata", () => {
    expect(getDisplayName(makeUser("a@b.com", { full_name: "Jane Doe", name: "JD" }))).toBe(
      "Jane Doe",
    );
    expect(getDisplayName(makeUser("a@b.com", { name: "Jane" }))).toBe("Jane");
  });

  it("derives a readable name from the email local part", () => {
    expect(getDisplayName(makeUser("mohammed.shanuj@gmail.com"))).toBe("Mohammed Shanuj");
    expect(getDisplayName(makeUser("ops_team-42@acme.io"))).toBe("Ops Team");
  });

  it("falls back to User", () => {
    expect(getDisplayName(null)).toBe("User");
    expect(getDisplayName(makeUser(undefined, { full_name: "  " }))).toBe("User");
    expect(getDisplayName(makeUser("123@acme.io"))).toBe("User");
  });
});

describe("getInitials", () => {
  it("uses the first letters of the first and last words", () => {
    expect(getInitials("Mohammed Shanuj")).toBe("MS");
    expect(getInitials("mary jane watson")).toBe("MW");
    expect(getInitials("User")).toBe("U");
  });
});

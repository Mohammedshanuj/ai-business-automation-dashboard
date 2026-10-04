import type { User } from "@supabase/supabase-js";

const FALLBACK_NAME = "User";

export function getDisplayName(user: User | null | undefined): string {
  if (!user) return FALLBACK_NAME;

  const metadata: Record<string, unknown> = user.user_metadata ?? {};
  const fromMetadata =
    readNonEmptyString(metadata["full_name"]) ?? readNonEmptyString(metadata["name"]);
  if (fromMetadata) return fromMetadata;

  return nameFromEmail(user.email) ?? FALLBACK_NAME;
}

export function getInitials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  const first = words[0];
  if (!first) return "?";

  const last = words.length > 1 ? (words.at(-1) ?? "") : "";
  return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();
}

export function nameFromEmail(email: string | null | undefined): string | null {
  const localPart = email?.split("@")[0];
  if (!localPart) return null;

  const words = localPart
    .split(/[._\-+\d]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());

  return words.length > 0 ? words.join(" ") : null;
}

function readNonEmptyString(value: unknown): string | null {
  return typeof value === "string" && value.trim() !== "" ? value.trim() : null;
}

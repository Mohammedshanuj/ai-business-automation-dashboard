import { Monitor, Moon, Sun, type LucideIcon } from "lucide-react";

import type { Theme } from "@/lib/theme";

export const THEME_OPTIONS: ReadonlyArray<{ value: Theme; label: string; icon: LucideIcon }> = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
];

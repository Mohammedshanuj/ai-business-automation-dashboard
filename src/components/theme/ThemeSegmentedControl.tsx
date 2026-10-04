import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";

import { useTheme } from "@/context/ThemeContext";
import { isTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";
import { THEME_OPTIONS } from "./themeOptions";

export function ThemeSegmentedControl({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();

  return (
    <RadioGroupPrimitive.Root
      value={theme}
      onValueChange={(value) => {
        if (isTheme(value)) setTheme(value);
      }}
      aria-label="Theme"
      orientation="horizontal"
      className={cn(
        "inline-grid grid-cols-3 gap-1 rounded-lg border border-border bg-surface-muted p-1",
        className,
      )}
    >
      {THEME_OPTIONS.map((option) => (
        <RadioGroupPrimitive.Item
          key={option.value}
          value={option.value}
          className={cn(
            "inline-flex h-8 cursor-pointer items-center justify-center gap-2 rounded-md px-3 text-sm font-medium text-muted-foreground transition-[color,background-color,box-shadow] duration-150",
            "hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            "data-[state=checked]:bg-card data-[state=checked]:text-foreground data-[state=checked]:shadow-sm",
          )}
        >
          <option.icon className="h-4 w-4" aria-hidden="true" />
          {option.label}
        </RadioGroupPrimitive.Item>
      ))}
    </RadioGroupPrimitive.Root>
  );
}

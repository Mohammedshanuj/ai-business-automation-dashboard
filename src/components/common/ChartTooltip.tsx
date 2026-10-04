interface ChartTooltipEntry {
  name?: string | number;
  value?: unknown;
  color?: string;
  payload?: { fill?: string };
}

interface ChartTooltipProps {
  active?: boolean;
  payload?: ReadonlyArray<ChartTooltipEntry>;
  label?: string | number;
  /** Label shown next to the value when a series has no name of its own. */
  valueLabel?: string;
}

/** Theme-aware replacement for the default Recharts tooltip. */
export function ChartTooltip({ active, payload, label, valueLabel }: ChartTooltipProps) {
  if (!active || !payload?.length) return null;

  return (
    <div className="min-w-32 rounded-lg border border-border bg-popover px-3 py-2 text-xs text-popover-foreground shadow-lg">
      {label !== undefined && label !== "" && (
        <p className="mb-1.5 font-semibold text-foreground">{label}</p>
      )}
      <ul className="space-y-1">
        {payload.map((entry, index) => (
          <li key={index} className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <span
                aria-hidden="true"
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: entry.color ?? entry.payload?.fill }}
              />
              {valueLabel ?? entry.name}
            </span>
            <span className="font-semibold tabular-nums text-foreground">
              {String(entry.value)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

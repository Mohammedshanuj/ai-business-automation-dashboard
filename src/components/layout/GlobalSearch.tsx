import { useNavigate } from "@tanstack/react-router";
import { LifeBuoy, Loader2, Search, Users } from "lucide-react";
import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";

import { Input } from "@/components/ui/input";
import { useGlobalSearch, type SearchResult } from "@/hooks/useGlobalSearch";
import { cn } from "@/lib/utils";

export function GlobalSearch() {
  const navigate = useNavigate();
  const listboxId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const { isActive, isLoading, isError, leads, tickets } = useGlobalSearch(query);
  const results = [...leads, ...tickets];
  const showDropdown = open && isActive;

  useEffect(() => {
    setActiveIndex(-1);
  }, [query]);

  useEffect(() => {
    if (!showDropdown) return;
    const handlePointerDown = (event: PointerEvent) => {
      if (event.target instanceof Node && !containerRef.current?.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [showDropdown]);

  function selectResult(result: SearchResult) {
    setOpen(false);
    setQuery("");
    if (result.kind === "lead") {
      void navigate({ to: "/leads/$leadId", params: { leadId: result.id } });
    } else {
      void navigate({ to: "/support/$ticketId", params: { ticketId: result.id } });
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape") {
      setOpen(false);
      return;
    }
    if (!showDropdown || results.length === 0) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) => (index + 1) % results.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => (index <= 0 ? results.length - 1 : index - 1));
    } else if (event.key === "Enter") {
      const result = results[activeIndex];
      if (!result) return;
      event.preventDefault();
      selectResult(result);
    }
  }

  const optionId = (index: number) => `${listboxId}-option-${index}`;

  const renderGroup = (label: string, items: SearchResult[], offset: number) =>
    items.length > 0 && (
      <div role="group" aria-label={label} className="py-1">
        <p className="px-2.5 pb-1 pt-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        {items.map((item, i) => {
          const index = offset + i;
          const Icon = item.kind === "lead" ? Users : LifeBuoy;
          return (
            <button
              key={`${item.kind}-${item.id}`}
              id={optionId(index)}
              type="button"
              role="option"
              aria-selected={index === activeIndex}
              onMouseDown={(event) => event.preventDefault()}
              onMouseEnter={() => setActiveIndex(index)}
              onClick={() => selectResult(item)}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left transition-colors",
                index === activeIndex ? "bg-accent" : "hover:bg-accent",
              )}
            >
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md border border-border bg-surface-muted">
                <Icon className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-medium text-foreground">
                  {item.title}
                </span>
                <span className="block truncate text-xs text-muted-foreground">
                  {item.subtitle}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    );

  return (
    <div ref={containerRef} className="relative hidden w-56 shrink-0 sm:block lg:w-72">
      <Search
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden="true"
      />
      <Input
        type="search"
        placeholder="Search leads & tickets…"
        className="border-transparent bg-muted/70 pl-9 shadow-none hover:border-border focus-visible:bg-card dark:bg-muted/50 [&::-webkit-search-cancel-button]:hidden"
        aria-label="Global search"
        role="combobox"
        aria-expanded={showDropdown}
        aria-controls={listboxId}
        aria-autocomplete="list"
        aria-activedescendant={activeIndex >= 0 ? optionId(activeIndex) : undefined}
        value={query}
        onChange={(event) => {
          setQuery(event.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKeyDown}
      />

      {showDropdown && (
        <div
          id={listboxId}
          role="listbox"
          aria-label="Search results"
          className="absolute right-0 top-full z-50 mt-2 max-h-96 w-80 overflow-y-auto rounded-xl border bg-popover p-1 text-popover-foreground shadow-lg animate-in fade-in-0 zoom-in-95"
        >
          {results.length > 0 ? (
            <>
              {renderGroup("Leads", leads, 0)}
              {renderGroup("Support Tickets", tickets, leads.length)}
            </>
          ) : isLoading ? (
            <p className="flex items-center gap-2 px-3 py-6 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Searching…
            </p>
          ) : isError ? (
            <p className="px-3 py-6 text-center text-sm text-muted-foreground">
              Search is unavailable right now.
            </p>
          ) : (
            <p className="px-3 py-6 text-center text-sm text-muted-foreground">No results found</p>
          )}
        </div>
      )}
    </div>
  );
}

import type { ComponentType } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as Icons from "lucide-react";
import { CheckCircle2, ChevronDown, Search } from "lucide-react";

type IconComp = ComponentType<{ className?: string }>;

function resolveIcon(name: string): IconComp | null {
  const key = (name || "").trim();
  if (!key) return null;
  const C = (Icons as Record<string, unknown>)[key];
  return C != null ? (C as IconComp) : null;
}

function IconRow({ name, size = "md" }: { name: string; size?: "sm" | "md" }) {
  const Icon = resolveIcon(name);
  const cls = size === "sm" ? "w-5 h-5" : "w-6 h-6";
  return (
    <>
      {Icon ? (
        <Icon className={`${cls} text-primary shrink-0`} aria-hidden />
      ) : (
        <CheckCircle2 className={`${cls} text-amber-600 shrink-0`} aria-hidden />
      )}
      <span className="truncate font-medium text-on-surface">{name || "—"}</span>
    </>
  );
}

type Props = {
  value: string;
  onChange: (next: string) => void;
  /** Curated icon names (e.g. `LUCIDE_SERVICE_ICON_OPTIONS_SORTED`). */
  options: readonly string[];
  id?: string;
};

/**
 * Single control: trigger shows icon + name; panel lists the same with search + custom name.
 */
export function LucideIconSelect({ value, onChange, options, id }: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [customDraft, setCustomDraft] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);

  const optionSet = useMemo(() => new Set(options), [options]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [...options];
    return options.filter((n) => n.toLowerCase().includes(q));
  }, [options, query]);

  const displayValue = (value || "").trim();

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const pick = useCallback(
    (name: string) => {
      onChange(name);
      setOpen(false);
      setQuery("");
    },
    [onChange]
  );

  const applyCustom = useCallback(() => {
    const next = customDraft.trim();
    if (next) {
      onChange(next);
      setOpen(false);
      setCustomDraft("");
      setQuery("");
    }
  }, [customDraft, onChange]);

  useEffect(() => {
    if (open) {
      setCustomDraft(!optionSet.has(displayValue) && displayValue ? displayValue : "");
    }
  }, [open, displayValue, optionSet]);

  return (
    <div ref={rootRef} className="relative w-full">
      <button
        type="button"
        id={id}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-3 rounded-lg border border-outline-variant bg-surface-container px-3 py-2.5 text-left text-sm outline-none transition hover:border-primary/40 focus:border-primary focus:ring-1 focus:ring-primary"
      >
        <span className="flex min-w-0 flex-1 items-center gap-3">
          {displayValue ? (
            <IconRow name={displayValue} />
          ) : (
            <span className="text-on-surface-variant">Choose an icon…</span>
          )}
        </span>
        <ChevronDown className={`h-5 w-5 shrink-0 text-on-surface-variant transition ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute left-0 right-0 top-full z-[200] mt-1 flex max-h-[min(22rem,calc(100vh-12rem))] flex-col overflow-hidden rounded-xl border border-outline-variant bg-surface-container-lowest shadow-lg"
        >
          <div className="flex items-center gap-2 border-b border-outline-variant/50 px-2 py-2">
            <Search className="h-4 w-4 shrink-0 text-on-surface-variant" aria-hidden />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name…"
              className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-on-surface-variant/70"
              autoComplete="off"
            />
          </div>

          <ul className="min-h-0 flex-1 overflow-y-auto overscroll-contain py-1">
            {filtered.length === 0 ? (
              <li className="px-3 py-4 text-center text-sm text-on-surface-variant">No matches</li>
            ) : (
              filtered.map((name) => (
                <li key={name} role="option" aria-selected={value === name}>
                  <button
                    type="button"
                    onClick={() => pick(name)}
                    className={`flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm transition hover:bg-primary/10 ${
                      value === name ? "bg-primary/15" : ""
                    }`}
                  >
                    <IconRow name={name} size="sm" />
                  </button>
                </li>
              ))
            )}
          </ul>

          <div className="border-t border-outline-variant/50 bg-surface-container/80 p-2">
            <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wide text-on-surface-variant">
              Custom (any Lucide name)
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                value={customDraft}
                onChange={(e) => setCustomDraft(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), applyCustom())}
                placeholder="e.g. Landmark"
                className="min-w-0 flex-1 rounded-lg border border-outline-variant bg-surface px-2 py-1.5 text-sm outline-none focus:border-primary"
                autoComplete="off"
              />
              <button
                type="button"
                onClick={applyCustom}
                className="shrink-0 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-on-primary"
              >
                Apply
              </button>
            </div>
            <p className="mt-1.5 text-[10px] text-on-surface-variant">
              <a href="https://lucide.dev/icons/" target="_blank" rel="noopener noreferrer" className="text-primary underline">
                lucide.dev/icons
              </a>{" "}
              — use PascalCase names
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

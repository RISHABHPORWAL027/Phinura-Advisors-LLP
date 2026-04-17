import { lazy, Suspense } from "react";
import { CheckCircle2, ChevronDown } from "lucide-react";
import type { LucideIconSelectProps } from "./LucideIconSelectInner";

const LucideIconSelectInner = lazy(async () => {
  const m = await import("./LucideIconSelectInner");
  return { default: m.LucideIconSelectInner };
});

function LucideIconSelectFallback({ value, id }: Pick<LucideIconSelectProps, "value" | "id">) {
  const displayValue = (value || "").trim();
  return (
    <div className="relative w-full">
      <button
        type="button"
        id={id}
        disabled
        aria-busy="true"
        aria-haspopup="listbox"
        aria-expanded={false}
        className="flex w-full cursor-wait items-center justify-between gap-3 rounded-lg border border-outline-variant bg-surface-container px-3 py-2.5 text-left text-sm outline-none opacity-90"
      >
        <span className="flex min-w-0 flex-1 items-center gap-3">
          {displayValue ? (
            <>
              <CheckCircle2 className="h-6 w-6 shrink-0 text-primary" aria-hidden />
              <span className="truncate font-medium text-on-surface">{displayValue}</span>
            </>
          ) : (
            <span className="text-on-surface-variant">Choose an icon…</span>
          )}
        </span>
        <ChevronDown className="h-5 w-5 shrink-0 text-on-surface-variant" />
      </button>
    </div>
  );
}

/**
 * Same behavior as before: full Lucide resolution for custom names, loaded in a separate chunk (admin only).
 */
export function LucideIconSelect(props: LucideIconSelectProps) {
  return (
    <Suspense fallback={<LucideIconSelectFallback value={props.value} id={props.id} />}>
      <LucideIconSelectInner {...props} />
    </Suspense>
  );
}

export type { LucideIconSelectProps };

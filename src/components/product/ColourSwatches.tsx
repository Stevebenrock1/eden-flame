"use client";

import type { Colour } from "@/lib/commerce";
import { cn } from "@/lib/cn";

/**
 * Colour choice: small circles, the chosen one ringed in gold. A real radio group underneath,
 * so arrow keys and screen readers work as expected.
 */
export function ColourSwatches({
  colors,
  value,
  onChange,
  name,
  className,
}: {
  colors: Colour[];
  value: string;
  onChange: (name: string) => void;
  name: string;
  className?: string;
}) {
  return (
    <fieldset className={className}>
      <legend className="mb-3 text-xs text-ivory/55">
        <span className="uppercase tracking-[0.22em] text-ivory/45">Colour</span>
        <span className="ml-3 text-ivory/85">{value}</span>
      </legend>
      <div className="flex flex-wrap gap-3">
        {colors.map((c) => {
          const checked = c.name === value;
          return (
            <label key={c.name} title={c.name} className="group relative cursor-pointer">
              <input type="radio" name={name} value={c.name} checked={checked} onChange={() => onChange(c.name)} className="peer sr-only" />
              <span
                aria-hidden
                className={cn(
                  "block h-8 w-8 rounded-full p-[3px] ring-1 transition-all duration-300 peer-focus-visible:ring-champagne",
                  checked ? "ring-champagne" : "ring-ivory/20 group-hover:ring-ivory/50",
                )}
              >
                <span className="block h-full w-full rounded-full shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12)]" style={{ background: c.hex }} />
              </span>
              <span className="sr-only">{c.name}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

/** Tiny read-only dots for product cards. */
export function ColourDots({ colors }: { colors: Colour[] }) {
  return (
    <span className="flex items-center gap-1.5" aria-label={`${colors.length} colours`}>
      {colors.map((c) => (
        <span key={c.name} title={c.name} className="block h-2.5 w-2.5 rounded-full ring-1 ring-ivory/20" style={{ background: c.hex }} />
      ))}
    </span>
  );
}

"use client";

import { useId } from "react";
import { cn } from "@/lib/cn";

/**
 * Selection controls in the Eden Flame style (see the "Selection controls" block in globals.css).
 * Each keeps a real <input> underneath, so keyboard use, screen readers, forms and
 * autofill behave exactly like the browser defaults; only the visuals are replaced.
 */

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: React.ReactNode;
  /** Small text shown at the end of the row (e.g. a count). */
  aside?: React.ReactNode;
  labelClassName?: string;
}

export function Checkbox({ label, aside, className, labelClassName, id, ...input }: CheckboxProps) {
  const auto = useId();
  const inputId = id ?? auto;
  return (
    <label htmlFor={inputId} className={cn("ef-choice", className)}>
      <input id={inputId} type="checkbox" className="ef-input" {...input} />
      <span aria-hidden className="ef-mark" />
      <span className={cn("ef-label flex-1", labelClassName)}>{label}</span>
      {aside != null && <span className="text-xs text-ivory/35">{aside}</span>}
    </label>
  );
}

interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: React.ReactNode;
  hint?: React.ReactNode;
}

export function Radio({ label, hint, className, id, ...input }: RadioProps) {
  const auto = useId();
  const inputId = id ?? auto;
  return (
    <label htmlFor={inputId} className={cn("ef-choice", hint && "items-start", className)}>
      <input id={inputId} type="radio" className="ef-input" {...input} />
      <span aria-hidden className={cn("ef-mark ef-mark--round", hint && "mt-0.5")} />
      <span className="ef-label flex-1">
        <span className="block">{label}</span>
        {hint && <span className="mt-0.5 block text-xs text-ivory/45">{hint}</span>}
      </span>
    </label>
  );
}

interface RadioGroupProps<T extends string> {
  legend: string;
  name: string;
  value: T;
  onChange: (value: T) => void;
  options: { value: T; label: React.ReactNode; hint?: React.ReactNode }[];
  className?: string;
  /** Show the legend visually (it is always available to screen readers). */
  showLegend?: boolean;
}

/** A native radio group: arrow keys move between options, Tab leaves the group. */
export function RadioGroup<T extends string>({ legend, name, value, onChange, options, className, showLegend = true }: RadioGroupProps<T>) {
  return (
    <fieldset className={className}>
      <legend className={showLegend ? "eyebrow mb-4" : "sr-only"}>{legend}</legend>
      <div className="space-y-3">
        {options.map((o) => (
          <Radio key={o.value} name={name} value={o.value} checked={value === o.value} onChange={() => onChange(o.value)} label={o.label} hint={o.hint} className="text-sm" />
        ))}
      </div>
    </fieldset>
  );
}

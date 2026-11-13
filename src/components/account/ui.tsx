"use client";

import { cn } from "@/lib/cn";

export const fieldClass =
  "ef-field w-full border-b border-ivory/20 bg-transparent py-3 text-sm text-ivory placeholder:text-ivory/35 focus:border-champagne focus:outline-none";

export function Field({ label, className, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className={cn("block", className)}>
      <span className="sr-only">{label}</span>
      <input {...props} placeholder={props.placeholder ?? label} className={fieldClass} />
    </label>
  );
}

export function SubmitButton({ busy, children, className }: { busy?: boolean; children: React.ReactNode; className?: string }) {
  return (
    <button
      type="submit"
      disabled={busy}
      className={cn(
        "flex h-14 w-full items-center justify-center gold-foil text-[0.75rem] uppercase tracking-luxe text-obsidian transition-all duration-500 disabled:cursor-wait disabled:opacity-70",
        className,
      )}
    >
      {children}
    </button>
  );
}

export function Notice({ tone = "info", children }: { tone?: "info" | "error"; children: React.ReactNode }) {
  return (
    <p role={tone === "error" ? "alert" : "status"} className={cn("border-l pl-4 text-sm", tone === "error" ? "border-rosegold text-rosegold" : "border-champagne/60 text-ivory/75")}>
      {children}
    </p>
  );
}

export const errorText = (err: unknown) => (err instanceof Error ? err.message : "Something went wrong. Please try again.");

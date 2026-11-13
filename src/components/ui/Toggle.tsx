"use client";

/** Quiet on/off switch used for discretion and privacy preferences. Shares the gold hover of all selection controls. */
export function Toggle({ checked, onChange, label, hint, disabled }: { checked: boolean; onChange: (v: boolean) => void; label: string; hint: string; disabled?: boolean }) {
  return (
    <label className="ef-choice items-start gap-4">
      <input type="checkbox" role="switch" className="ef-input" disabled={disabled} checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span aria-hidden className="ef-switch" />
      <span className="ef-label">
        <span className="block text-sm text-ivory/85">{label}</span>
        <span className="mt-0.5 block text-xs text-ivory/45">{hint}</span>
      </span>
    </label>
  );
}

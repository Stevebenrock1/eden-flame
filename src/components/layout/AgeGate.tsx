"use client";

import { useEffect, useRef, useState } from "react";

export const AGE_KEY = "ef-age-confirmed";
const LEAVE_URL = "https://www.google.com";

/**
 * Runs before first paint (inlined in <head>): if this device has already confirmed,
 * mark <html> so the gate is hidden by CSS and never flashes on screen.
 */
export const ageGateBootScript = `try{if(localStorage.getItem("${AGE_KEY}"))document.documentElement.dataset.ageOk="1"}catch(e){}`;

/**
 * Adults-only welcome screen. Server-rendered on every page and hidden by CSS once the
 * visitor has confirmed, so there is no flash for returning visitors and the page content
 * underneath stays visible to search engines.
 */
export function AgeGate() {
  const [open, setOpen] = useState(true);
  const enterRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (document.documentElement.dataset.ageOk === "1") {
      setOpen(false);
      return;
    }
    enterRef.current?.focus();
  }, []);

  if (!open) return null;

  const confirm = () => {
    try {
      localStorage.setItem(AGE_KEY, new Date().toISOString());
    } catch {
      /* storage blocked: they'll be asked again next visit */
    }
    document.documentElement.dataset.ageOk = "1";
    setOpen(false);
  };

  return (
    <div
      id="age-gate"
      role="dialog"
      aria-modal="true"
      aria-labelledby="age-gate-title"
      aria-describedby="age-gate-desc"
      className="fixed inset-0 z-[200] flex items-center justify-center overflow-y-auto bg-obsidian px-6 py-12"
    >
      {/* Soft ember glow behind the type */}
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_38%,rgba(221,187,120,0.18),transparent_60%)]" />

      <div className="age-gate-in relative mx-auto flex max-w-xl flex-col items-center text-center">
        <svg viewBox="0 0 24 32" aria-hidden className="mb-10 h-12 w-9 text-champagne drop-shadow-[0_0_18px_rgba(221,187,120,0.35)]">
          <path
            d="M12 1c1.6 5.2 7.5 8.6 7.5 16.2A7.5 7.5 0 0 1 12 31a7.5 7.5 0 0 1-7.5-7.8C4.5 18 8 15.6 9 11.5c1.6 2.3 2.2 4.3 2.1 6.5C14 15 13.8 8 12 1Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.75"
          />
        </svg>
        <p className="eyebrow mb-6">An adults-only boutique</p>
        <h2 id="age-gate-title" className="font-serif text-[2.6rem] font-light leading-[1.05] sm:text-6xl">
          Welcome to <span className="text-gold italic">Eden Flame</span>
        </h2>
        <p id="age-gate-desc" className="mt-6 max-w-md text-[0.95rem] leading-relaxed text-ivory/65">
          Our collection is intended for adults. Please confirm you are 18 or over, or the age of majority where you live, to enter.
        </p>

        <div className="mt-12 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:gap-4">
          <button
            ref={enterRef}
            type="button"
            onClick={confirm}
            className="flex h-14 items-center justify-center gold-foil px-10 text-[0.75rem] uppercase tracking-luxe text-obsidian transition-all duration-500 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-champagne"
          >
            I am 18 or over
          </button>
          <a
            href={LEAVE_URL}
            rel="noreferrer"
            className="flex h-14 items-center justify-center border border-ivory/20 px-10 text-[0.75rem] uppercase tracking-luxe text-ivory/70 transition-colors duration-500 hover:border-ivory/50 hover:text-ivory"
          >
            Leave
          </a>
        </div>

        <p className="mt-10 max-w-sm text-xs leading-relaxed text-ivory/35">
          Your choice is remembered on this device only. Like everything at Eden Flame, it stays private.
        </p>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { siteConfig } from "@/config/site";
import { luxeEase } from "@/lib/motion";

const messages = siteConfig.constructionNotice ? [siteConfig.constructionNotice, ...siteConfig.announcements] : siteConfig.announcements;

export function AnnouncementBar() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (paused || reduce) return;
    const id = setInterval(() => setI((n) => (n + 1) % messages.length), 6000);
    return () => clearInterval(id);
  }, [paused, reduce]);

  const go = (d: number) => setI((n) => (n + d + messages.length) % messages.length);
  const btn = "grid h-8 w-8 place-items-center text-ivory/60 transition-colors hover:text-champagne";

  return (
    <div
      className="bg-obsidian text-ivory"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="container flex h-10 items-center justify-center gap-4">
        <button type="button" className={btn} aria-label="Previous message" onClick={() => go(-1)}>
          <ChevronLeft strokeWidth={1.25} className="h-4 w-4" />
        </button>
        <div className="relative h-full w-full max-w-xl overflow-hidden" aria-live="polite">
          <AnimatePresence mode="wait" initial={false}>
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.6, ease: luxeEase }}
              className="absolute inset-0 flex items-center justify-center text-center leading-tight text-[0.62rem] uppercase tracking-[0.22em] text-ivory/80 sm:text-[0.68rem]"
            >
              {messages[i]}
            </motion.p>
          </AnimatePresence>
        </div>
        <button type="button" className={btn} aria-label="Next message" onClick={() => go(1)}>
          <ChevronRight strokeWidth={1.25} className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

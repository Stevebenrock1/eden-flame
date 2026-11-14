"use client";

import { useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { cn } from "@/lib/cn";
import { luxeEase } from "@/lib/motion";

/** One question and answer that opens with the site's slow, refined motion. */
export function AccordionItem({ q, children, defaultOpen }: { q: string; children: ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(!!defaultOpen);
  return (
    <div>
      <button type="button" aria-expanded={open} onClick={() => setOpen((o) => !o)} className="flex w-full items-center gap-4 py-6 text-left font-serif text-xl text-ivory hover:text-champagne">
        <span className="flex-1">{q}</span>
        <Plus strokeWidth={1.25} className={cn("h-4 w-4 shrink-0 transition-transform duration-500 ease-luxe", open && "rotate-45")} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.45, ease: luxeEase }} className="overflow-hidden">
            <div className="max-w-xl pb-6 text-sm leading-relaxed text-ivory/60">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

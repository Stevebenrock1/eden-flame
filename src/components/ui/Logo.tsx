import Link from "next/link";
import { cn } from "@/lib/cn";

/** Placeholder wordmark: a fine-line gold flame beside a spaced serif name in gold foil. Swap for final logo art later. */
export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" aria-label="Eden Flame home" className={cn("group inline-flex items-center gap-3", className)}>
      <svg
        viewBox="0 0 24 32"
        aria-hidden
        className="h-7 w-5 transition-opacity duration-500 group-hover:opacity-80"
      >
        <defs>
          <linearGradient id="ef-flame-gold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#F6E7BE" />
            <stop offset="0.45" stopColor="#DDBB78" />
            <stop offset="1" stopColor="#A67C35" />
          </linearGradient>
        </defs>
        <path
          d="M12 1c1.6 5.2 7.5 8.6 7.5 16.2A7.5 7.5 0 0 1 12 31a7.5 7.5 0 0 1-7.5-7.8C4.5 18 8 15.6 9 11.5c1.6 2.3 2.2 4.3 2.1 6.5C14 15 13.8 8 12 1Z"
          fill="none"
          stroke="url(#ef-flame-gold)"
          strokeWidth="1.1"
        />
      </svg>
      <span className="text-gold font-serif text-[1.35rem] font-normal uppercase tracking-[0.28em]">
        Eden Flame
      </span>
    </Link>
  );
}

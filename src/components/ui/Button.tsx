import Link from "next/link";
import { cn } from "@/lib/cn";

type Variant = "primary" | "ghost";

const base =
  "group relative inline-flex items-center justify-center gap-3 overflow-hidden px-8 py-4 text-[0.78rem] uppercase tracking-luxe transition-all duration-500 ease-luxe";

const variants: Record<Variant, string> = {
  primary:
    "gold-foil text-obsidian",
  ghost:
    "border border-champagne/45 text-champagne-light hover:border-champagne hover:text-champagne hover:shadow-gold",
};

interface ButtonLinkProps {
  href: string;
  variant?: Variant;
  className?: string;
  children: React.ReactNode;
}

export function ButtonLink({ href, variant = "primary", className, children }: ButtonLinkProps) {
  return (
    <Link href={href} className={cn(base, variants[variant], className)}>
      {/* Soft light sweep on hover */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-y-0 -left-full w-1/2 skew-x-[-20deg] bg-white/25 transition-all duration-700 ease-luxe group-hover:left-[130%]"
      />
      <span className="relative">{children}</span>
    </Link>
  );
}

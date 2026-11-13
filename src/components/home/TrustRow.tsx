import { Leaf, Lock, Package, RotateCcw, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/cn";

/** The promises customers look for before they buy, stated plainly in one row. */
export const trustPoints = [
  { icon: Package, title: "Discreet delivery", body: "Plain box, neutral sender" },
  { icon: ShieldCheck, title: "Private billing", body: "Shown only as “EF Studio”" },
  { icon: Leaf, title: "Body-safe materials", body: "Medical-grade, non-porous" },
  { icon: RotateCcw, title: "100-day promise", body: "Returns and hygienic exchange" },
  { icon: Lock, title: "Secure checkout", body: "Encrypted payment by Stripe" },
];

export function TrustRow({ className, compact }: { className?: string; compact?: boolean }) {
  const points = compact ? trustPoints.slice(0, 4) : trustPoints;
  return (
    <ul
      aria-label="Our promises"
      className={cn(
        "grid gap-y-6",
        compact ? "grid-cols-2 gap-x-4" : "grid-cols-2 gap-x-6 sm:grid-cols-3 lg:grid-cols-5",
        className,
      )}
    >
      {points.map(({ icon: Icon, title, body }, i) => (
        // On phones the full row keeps four short promises so it stays compact
        <li key={title} className={cn("flex items-start gap-3", !compact && i === 4 && "max-sm:hidden")}>
          <Icon aria-hidden strokeWidth={1.1} className="mt-0.5 h-5 w-5 shrink-0 text-champagne" />
          <span>
            <span className="block text-[0.68rem] uppercase tracking-[0.18em] text-ivory/85">{title}</span>
            <span className={cn("mt-1 block text-xs text-ivory/45", !compact && "max-sm:hidden")}>{body}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}

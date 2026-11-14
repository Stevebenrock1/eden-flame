import { Globe2, Lock, Package } from "lucide-react";

const items = [
  { icon: Package, title: "Plain packaging", body: "Unbranded outer box, neutral return address." },
  { icon: Lock, title: "Discreet billing", body: "Appears on statements as “EF Studio.”" },
  { icon: Globe2, title: "Australia-wide delivery", body: "Tracked, usually 2 to 6 business days." },
];

export function DiscretionPromise({ compact = false }: { compact?: boolean }) {
  return (
    <ul className={compact ? "space-y-4" : "grid gap-6 sm:grid-cols-3"}>
      {items.map(({ icon: Icon, title, body }) => (
        <li key={title} className="flex gap-3">
          <Icon strokeWidth={1.1} className="mt-0.5 h-4 w-4 shrink-0 text-champagne" />
          <div>
            <p className="text-sm text-ivory/85">{title}</p>
            <p className="mt-0.5 text-xs leading-relaxed text-ivory/50">{body}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

"use client";

import { useId, useState } from "react";
import { Minus, Plus } from "lucide-react";
import { siteConfig } from "@/config/site";
import { AUDIENCES, FEATURES, MATERIALS, PRICE_RANGES, SORTS, type PriceRangeId, type ProductFilters, type SortId } from "@/lib/commerce";
import { Checkbox, Radio } from "@/components/ui/Choice";
import { cn } from "@/lib/cn";

type ListKey = "categories" | "materials" | "brands" | "audience" | "features";

interface Props {
  filters: ProductFilters;
  /** Makers in the catalogue, from the products themselves. */
  brands: string[];
  counts: { categories: Record<string, number>; materials: Record<string, number>; brands: Record<string, number>; audience: Record<string, number>; features: Record<string, number>; prices: Record<string, number>; anyPrice: number };
  onToggle: (key: ListKey, value: string) => void;
  /** Price is a single choice; null means any price. */
  onPrice: (id: PriceRangeId | null) => void;
  onSort: (id: SortId) => void;
}

const groupsFor = (brands: string[]): { key: ListKey; title: string; options: { value: string; label: string }[] }[] => [
  { key: "audience", title: "Shop for", options: AUDIENCES.map((a) => ({ value: a, label: siteConfig.audiences.find((x) => x.id === a)!.title })) },
  { key: "categories", title: "Collection", options: siteConfig.categories.map((c) => ({ value: c.slug, label: c.title })) },
  { key: "features", title: "Features", options: FEATURES.map((f) => ({ value: f, label: f })) },
  { key: "brands", title: "Maker", options: brands.map((b) => ({ value: b, label: b })) },
  { key: "materials", title: "Material", options: MATERIALS.map((m) => ({ value: m, label: m })) },
];

/**
 * The filter panel, used in the desktop sidebar and the mobile drawer.
 * Sort and Price are single choices (radios); Collection and Material can combine (checkboxes).
 */
export function Filters({ filters, brands, counts, onToggle, onPrice, onSort }: Props) {
  // Unique per instance: the sidebar and the drawer can both be in the page at once.
  const uid = useId().replace(/\W+/g, "");
  const key = (...parts: string[]) => `${uid}-${parts.join("-")}`.replace(/\W+/g, "-");
  const price = filters.prices[0] ?? null;

  return (
    <div className="divide-y divide-ivory/[0.08] border-y border-ivory/[0.08]">
      <FilterGroup title="Sort by">
        <fieldset className="space-y-3 pb-6">
          <legend className="sr-only">Sort by</legend>
          {SORTS.map((s) => (
            <Radio key={s.id} id={key("sort", s.id)} name={key("sort")} value={s.id} checked={filters.sort === s.id} onChange={() => onSort(s.id)} label={s.label} className="text-sm" />
          ))}
        </fieldset>
      </FilterGroup>

      {groupsFor(brands).map((g) => (
        <FilterGroup key={g.key} title={g.title}>
          <ul className="space-y-3 pb-6">
            {g.options.map((o) => {
              const checked = ((filters[g.key] ?? []) as string[]).includes(o.value);
              const n = counts[g.key][o.value] ?? 0;
              return (
                <li key={o.value}>
                  <Checkbox
                    id={key(g.key, o.value)}
                    checked={checked}
                    onChange={() => onToggle(g.key, o.value)}
                    label={o.label}
                    aside={n}
                    className={cn("text-sm", n === 0 && !checked && "opacity-40")}
                  />
                </li>
              );
            })}
          </ul>
        </FilterGroup>
      ))}

      <FilterGroup title="Price">
        <fieldset className="space-y-3 pb-6">
          <legend className="sr-only">Price</legend>
          <Radio id={key("price", "any")} name={key("price")} value="" checked={price === null} onChange={() => onPrice(null)} label={<Row label="Any price" n={counts.anyPrice} />} className="text-sm" />
          {PRICE_RANGES.map((r) => {
            const n = counts.prices[r.id] ?? 0;
            return (
              <Radio
                key={r.id}
                id={key("price", r.id)}
                name={key("price")}
                value={r.id}
                checked={price === r.id}
                onChange={() => onPrice(r.id)}
                label={<Row label={r.label} n={n} />}
                className={cn("text-sm", n === 0 && price !== r.id && "opacity-40")}
              />
            );
          })}
        </fieldset>
      </FilterGroup>
    </div>
  );
}

function Row({ label, n }: { label: string; n: number }) {
  return (
    <span className="flex items-center justify-between gap-3">
      {label}
      <span className="text-xs text-ivory/35">{n}</span>
    </span>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <div>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between py-5 text-[0.7rem] uppercase tracking-luxe text-ivory/80 hover:text-champagne"
      >
        {title}
        {open ? <Minus strokeWidth={1.25} className="h-3.5 w-3.5" /> : <Plus strokeWidth={1.25} className="h-3.5 w-3.5" />}
      </button>
      {open && children}
    </div>
  );
}

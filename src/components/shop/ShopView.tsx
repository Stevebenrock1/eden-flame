"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { SlidersHorizontal, X } from "lucide-react";
import { Filters } from "@/components/shop/Filters";
import { ProductCard } from "@/components/product/ProductCard";
import { QuickView } from "@/components/product/QuickView";
import { siteConfig } from "@/config/site";
import {
  AUDIENCES,
  brandsOf,
  FEATURES,
  filterProducts,
  MATERIALS,
  PRICE_RANGES,
  SORTS,
  type Audience,
  type CategorySlug,
  type Feature,
  type Material,
  type PriceRangeId,
  type Product,
  type ProductFilters,
  type SortId,
} from "@/lib/commerce";
import { luxeEase } from "@/lib/motion";

const list = (v: string | null) => (v ? v.split(",").filter(Boolean) : []);

function readFilters(sp: URLSearchParams, brands: string[]): ProductFilters {
  const cats = siteConfig.categories.map((c) => c.slug) as string[];
  const sort = sp.get("sort");
  return {
    categories: list(sp.get("category")).filter((c) => cats.includes(c)) as CategorySlug[],
    materials: list(sp.get("material")).filter((m) => (MATERIALS as string[]).includes(m)) as Material[],
    brands: list(sp.get("brand")).filter((b) => brands.includes(b)),
    audience: list(sp.get("for")).filter((a) => (AUDIENCES as string[]).includes(a)) as Audience[],
    features: list(sp.get("feature")).filter((x) => (FEATURES as string[]).includes(x)) as Feature[],
    // Price is a single choice; an old link with several ranges keeps the first.
    prices: list(sp.get("price")).filter((p) => PRICE_RANGES.some((r) => r.id === p)).slice(0, 1) as PriceRangeId[],
    sort: (SORTS.some((s) => s.id === sort) ? sort : "featured") as SortId,
    q: (sp.get("q") ?? "").trim().slice(0, 80),
  };
}

export function ShopView({ products }: { products: Product[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const brands = useMemo(() => brandsOf(products), [products]);

  const [filters, setFilters] = useState<ProductFilters>(() => readFilters(new URLSearchParams(searchParams.toString()), brands));
  const [quick, setQuick] = useState<Product | null>(null);
  const [drawer, setDrawer] = useState(false);

  // Follow the URL when the visitor uses nav links (e.g. "Aromatics") or the back button
  useEffect(() => {
    setFilters(readFilters(new URLSearchParams(searchParams.toString()), brands));
  }, [searchParams, brands]);

  // Keep the URL in sync so filtered views can be shared and bookmarked
  const commit = useCallback(
    (next: ProductFilters) => {
      setFilters(next);
      const sp = new URLSearchParams();
      if (next.categories.length) sp.set("category", next.categories.join(","));
      if (next.materials.length) sp.set("material", next.materials.join(","));
      if (next.audience?.length) sp.set("for", next.audience.join(","));
      if (next.brands?.length) sp.set("brand", next.brands.join(","));
      if (next.features?.length) sp.set("feature", next.features.join(","));
      if (next.prices.length) sp.set("price", next.prices.join(","));
      if (next.sort !== "featured") sp.set("sort", next.sort);
      if (next.q) sp.set("q", next.q);
      const qs = sp.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [pathname, router],
  );

  const toggle = (key: "categories" | "materials" | "brands" | "audience" | "features" | "prices", value: string) => {
    if (key === "prices") return commit({ ...filters, prices: filters.prices[0] === value ? [] : [value as PriceRangeId] });
    const cur = (filters[key] ?? []) as string[];
    commit({ ...filters, [key]: cur.includes(value) ? cur.filter((v) => v !== value) : [...cur, value] });
  };
  const setPrice = (id: PriceRangeId | null) => commit({ ...filters, prices: id ? [id] : [] });
  const setSort = (sort: SortId) => commit({ ...filters, sort });
  const clearAll = () => commit({ categories: [], materials: [], brands: [], audience: [], features: [], prices: [], sort: filters.sort, q: "" });

  const closeQuick = useCallback(() => setQuick(null), []);

  const results = useMemo(() => filterProducts(products, filters), [products, filters]);

  // Counts show how many pieces each option would return alongside the other active filters
  const counts = useMemo(() => {
    const countFor = (key: "categories" | "materials" | "brands" | "audience" | "features" | "prices", value: string) =>
      filterProducts(products, { ...filters, [key]: [value] }).length;
    return {
      categories: Object.fromEntries(siteConfig.categories.map((c) => [c.slug, countFor("categories", c.slug)])),
      materials: Object.fromEntries(MATERIALS.map((m) => [m, countFor("materials", m)])),
      brands: Object.fromEntries(brands.map((b) => [b, countFor("brands", b)])),
      audience: Object.fromEntries(AUDIENCES.map((a) => [a, countFor("audience", a)])),
      // Features combine (a piece must have all of them), so count with this one added
      features: Object.fromEntries(FEATURES.map((x) => [x, filterProducts(products, { ...filters, features: [...new Set([...(filters.features ?? []), x])] }).length])),
      prices: Object.fromEntries(PRICE_RANGES.map((r) => [r.id, countFor("prices", r.id)])),
      anyPrice: filterProducts(products, { ...filters, prices: [] }).length,
    };
  }, [products, filters, brands]);

  const chips = [
    ...(filters.audience ?? []).map((v) => ({ key: "audience" as const, value: v, label: siteConfig.audiences.find((a) => a.id === v)?.title ?? v })),
    ...filters.categories.map((v) => ({ key: "categories" as const, value: v, label: siteConfig.categories.find((c) => c.slug === v)?.title ?? v })),
    ...filters.materials.map((v) => ({ key: "materials" as const, value: v, label: v })),
    ...(filters.brands ?? []).map((v) => ({ key: "brands" as const, value: v, label: v })),
    ...(filters.features ?? []).map((v) => ({ key: "features" as const, value: v, label: v })),
    ...filters.prices.map((v) => ({ key: "prices" as const, value: v, label: PRICE_RANGES.find((r) => r.id === v)?.label ?? v })),
  ];

  const activeAudience = filters.audience?.length === 1 && filters.categories.length === 0 ? siteConfig.audiences.find((a) => a.id === filters.audience![0]) : undefined;
  const activeCategory =
    activeAudience ?? (filters.categories.length === 1 && !filters.audience?.length ? siteConfig.categories.find((c) => c.slug === filters.categories[0]) : undefined);

  return (
    <div className="container pb-32 pt-40 md:pt-48">
      {/* Heading */}
      <header className="mb-14 max-w-2xl">
        <p className="eyebrow mb-5">{activeCategory ? "Collection" : "The Collection"}</p>
        <h1 className="font-serif text-display-lg font-light">
          {filters.q ? <>Results for &ldquo;{filters.q}&rdquo;</> : activeCategory ? activeCategory.title : "All pieces"}
        </h1>
        <p className="mt-5 text-ivory/60">
          {filters.q ? (
            <button type="button" onClick={() => commit({ ...filters, q: "" })} className="underline-offset-4 hover:text-champagne hover:underline">
              Clear search and show every piece
            </button>
          ) : activeCategory ? (
            activeCategory.blurb
          ) : (
            <>
              Our own pieces alongside the finest makers in the world, chosen with care and shipped with absolute discretion.{" "}
              <Link href="/find" className="whitespace-nowrap text-champagne underline-offset-4 hover:underline">
                Not sure? Find your piece
              </Link>
            </>
          )}
        </p>
      </header>

      {/* Toolbar */}
      <div className="sticky top-[60px] z-30 -mx-5 mb-10 flex items-center justify-between gap-4 border-b border-ivory/[0.08] bg-obsidian/85 px-5 py-4 backdrop-blur-xl md:-mx-8 md:px-8 lg:static lg:mx-0 lg:border-0 lg:bg-transparent lg:px-0 lg:py-0 lg:backdrop-blur-0">
        <button
          type="button"
          onClick={() => setDrawer(true)}
          className="flex items-center gap-2 text-[0.7rem] uppercase tracking-luxe text-ivory/80 hover:text-champagne lg:hidden"
        >
          <SlidersHorizontal strokeWidth={1.25} className="h-4 w-4" />
          Filter &amp; sort {chips.length > 0 && `(${chips.length})`}
        </button>
        <p className="hidden text-xs uppercase tracking-[0.2em] text-ivory/45 lg:block" aria-live="polite">
          {results.length} {results.length === 1 ? "piece" : "pieces"}
        </p>
        <p className="text-xs uppercase tracking-[0.2em] text-ivory/45 lg:hidden">
          {results.length} {results.length === 1 ? "piece" : "pieces"}
        </p>
      </div>

      <div className="grid gap-12 lg:grid-cols-[240px_1fr] xl:gap-16">
        {/* Desktop filters */}
        <aside aria-label="Filters" className="hidden lg:block">
          <div className="sticky top-28">
            <Filters filters={filters} brands={brands} counts={counts} onToggle={toggle} onPrice={setPrice} onSort={setSort} />
            {chips.length > 0 && (
              <button type="button" onClick={clearAll} className="mt-6 text-[0.7rem] uppercase tracking-luxe text-ivory/50 underline-offset-4 hover:text-champagne hover:underline">
                Clear all filters
              </button>
            )}
          </div>
        </aside>

        <div>
          {/* Active filter chips */}
          {chips.length > 0 && (
            <ul className="mb-8 flex flex-wrap gap-2">
              {chips.map((c) => (
                <li key={`${c.key}-${c.value}`}>
                  <button
                    type="button"
                    onClick={() => toggle(c.key, c.value)}
                    className="flex items-center gap-2 border border-ivory/15 px-3 py-1.5 text-xs text-ivory/80 transition-colors hover:border-champagne hover:text-champagne"
                  >
                    {c.label}
                    <X strokeWidth={1.25} className="h-3 w-3" />
                    <span className="sr-only">Remove filter</span>
                  </button>
                </li>
              ))}
            </ul>
          )}

          {results.length === 0 ? (
            <div className="border border-ivory/[0.08] px-6 py-24 text-center">
              <p className="font-serif text-3xl font-light">Nothing quite matches</p>
              <p className="mt-3 text-sm text-ivory/55">Try removing a filter to see more of the collection.</p>
              <button type="button" onClick={clearAll} className="mt-8 border border-ivory/25 px-6 py-3 text-[0.7rem] uppercase tracking-luxe hover:border-champagne hover:text-champagne">
                Clear filters
              </button>
            </div>
          ) : (
            <motion.ul layout className="grid grid-cols-2 gap-x-4 gap-y-12 md:gap-x-6 xl:grid-cols-3">
              <AnimatePresence mode="popLayout">
                {results.map((p, i) => (
                  <motion.li
                    key={p.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ duration: 0.6, ease: luxeEase, delay: Math.min(i, 6) * 0.05 }}
                  >
                    <ProductCard product={p} onQuickView={setQuick} priority={i < 3} />
                  </motion.li>
                ))}
              </AnimatePresence>
            </motion.ul>
          )}
        </div>
      </div>

      {/* Mobile filter drawer */}
      <AnimatePresence>
        {drawer && (
          <motion.div
            className="fixed inset-0 z-[70] bg-obsidian/70 backdrop-blur-sm lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setDrawer(false)}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Filter and sort"
              className="absolute inset-y-0 left-0 flex w-[88%] max-w-sm flex-col bg-obsidian-800 px-6"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.5, ease: luxeEase }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between py-6">
                <p className="font-serif text-2xl">Filter &amp; sort</p>
                <button type="button" aria-label="Close filters" onClick={() => setDrawer(false)} className="grid h-10 w-10 place-items-center text-ivory/70 hover:text-champagne">
                  <X strokeWidth={1.25} className="h-5 w-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                <Filters filters={filters} brands={brands} counts={counts} onToggle={toggle} onPrice={setPrice} onSort={setSort} />
              </div>
              <div className="flex gap-3 py-6">
                <button type="button" onClick={clearAll} className="flex-1 border border-ivory/25 py-3.5 text-[0.7rem] uppercase tracking-luxe">
                  Clear
                </button>
                <button type="button" onClick={() => setDrawer(false)} className="flex-[2] gold-foil py-3.5 text-[0.7rem] uppercase tracking-luxe text-obsidian">
                  Show {results.length} {results.length === 1 ? "piece" : "pieces"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <QuickView product={quick} onClose={closeQuick} />
    </div>
  );
}

import { PRICE_RANGES, type Audience, type Feature, type PriceRangeId, type Product } from "@/lib/commerce";

/**
 * "Find your piece": a short quiz that ranks the catalogue for one shopper.
 * Pure functions, so the same scoring can run anywhere and is easy to test.
 */

export type Sensation = "focused" | "deep" | "connected" | "sensory";
export type Budget = PriceRangeId | "any";

export interface FinderAnswers {
  audience: Audience | null;
  sensation: Sensation | null;
  musts: Feature[];
  budget: Budget | null;
}

export const SENSATIONS: { id: Sensation; title: string; hint: string }[] = [
  { id: "focused", title: "Precise and focused", hint: "Pinpoint, external, quietly intense" },
  { id: "deep", title: "Deep and resonant", hint: "Rumbling power, internal movement" },
  { id: "connected", title: "Hands-free and connected", hint: "App, remote or automatic, near or far" },
  { id: "sensory", title: "Slow and sensory", hint: "Silk, scent, warmth and touch" },
];

export const MUSTS: { id: Feature; title: string }[] = [
  { id: "App controlled", title: "App control or long distance" },
  { id: "Remote controlled", title: "A separate remote" },
  { id: "Hands-free", title: "Hands-free" },
  { id: "Waterproof", title: "Bath and shower safe" },
  { id: "Warming", title: "Warming" },
];

export const BUDGETS: { id: Budget; title: string }[] = [
  ...PRICE_RANGES.map((r) => ({ id: r.id as Budget, title: r.label })),
  { id: "any", title: "Whatever feels right" },
];

/** Which sensations each piece answers to. Pieces not listed are judged by their features and collection. */
const SENSATION_OF: Record<string, Sensation[]> = {
  "lelo-dot": ["focused"],
  "bellesa-airvibe": ["focused"],
  vesper: ["focused"],
  "arcwave-ion-2": ["focused", "connected"],
  aurelia: ["deep"],
  seraphine: ["deep"],
  rosalind: ["focused"],
  "clitoral-air-stimulator": ["focused"],
  carmine: ["focused"],
  lumen: ["deep"],
  "le-wand-rechargeable": ["deep"],
  "lovense-osci-3": ["deep", "connected"],
  "b-vibe-rimming-plug-2": ["deep", "connected"],
  "tenga-vacuum-gyro-roller": ["deep", "connected"],
  "the-handy": ["connected"],
  "lovense-solace-pro": ["connected"],
  "we-vibe-chorus": ["connected"],
  orbis: ["connected"],
  solenne: ["sensory"],
  halo: ["sensory"],
  "magic-wand-rechargeable": ["deep"],
  "womanizer-premium-2": ["focused"],
  "womanizer-next": ["focused"],
  "lelo-gigi-3": ["deep", "connected"],
  "lelo-sona-3-cruise": ["focused"],
  "lelo-enigma-double-sonic": ["deep", "focused"],
  "lelo-smart-wand-2": ["deep"],
  "lovense-lush-4": ["connected"],
  "we-vibe-sync-o": ["connected"],
  "we-vibe-touch-x": ["focused"],
  "arcwave-voy": ["deep"],
  "arcwave-perk": ["deep"],
  "lelo-f1s-v3-xl": ["connected", "deep"],
  "lelo-tor-3": ["connected"],
  "lelo-hugo-2": ["deep", "connected"],
  "lovense-edge-2": ["deep", "connected"],
  "lovense-max-2": ["connected"],
  "we-vibe-vector-plus": ["deep", "connected"],
  "tenga-flip-zero": ["deep"],
  "kiiroo-keon": ["connected"],
};

export function sensationsOf(p: Product): Sensation[] {
  const known = SENSATION_OF[p.handle];
  if (known) return known;
  const out: Sensation[] = [];
  if (p.category !== "sculptural-essentials") out.push("sensory");
  if (p.features.some((f) => f === "App controlled" || f === "Remote controlled" || f === "Hands-free")) out.push("connected");
  if (!out.length) out.push("deep");
  return out;
}

export interface Match {
  product: Product;
  score: number;
  /** Short reasons shown under the recommendation. */
  reasons: string[];
}

const AUDIENCE_LABEL: Record<Audience, string> = { her: "Chosen for her", him: "Chosen for him", two: "Made to share" };

export function rankProducts(products: Product[], a: FinderAnswers, limit = 3): Match[] {
  const range = a.budget && a.budget !== "any" ? PRICE_RANGES.find((r) => r.id === a.budget) : undefined;

  const scored = products
    .filter((p) => p.availability !== "sold_out")
    .map((p) => {
      let score = 0;
      const reasons: string[] = [];
      if (a.audience) {
        if (p.audience.includes(a.audience)) {
          score += 6;
          reasons.push(AUDIENCE_LABEL[a.audience]);
        } else score -= 8;
      }
      if (a.sensation && sensationsOf(p).includes(a.sensation)) {
        score += 4;
        reasons.push(SENSATIONS.find((s) => s.id === a.sensation)!.title);
      }
      for (const m of a.musts) {
        if (p.features.includes(m)) {
          score += 2;
          reasons.push(MUSTS.find((x) => x.id === m)!.title);
        } else score -= 1.5;
      }
      if (range) {
        if (p.price.amount >= range.min && p.price.amount <= range.max) {
          score += 2;
          reasons.push(`Within ${range.label.toLowerCase()}`);
        } else score -= 3;
      }
      // Gentle tie-break toward the house's favourites
      score += p.featured / 100 + (p.badge === "Bestseller" ? 0.5 : 0);
      return { product: p, score, reasons };
    });

  return scored.sort((x, y) => y.score - x.score).slice(0, limit);
}

/** The same answers as shop filters, for "See every match". */
export function shopLinkFor(a: FinderAnswers): string {
  const sp = new URLSearchParams();
  if (a.audience) sp.set("for", a.audience);
  if (a.musts.length) sp.set("feature", a.musts.join(","));
  if (a.budget && a.budget !== "any") sp.set("price", a.budget);
  const qs = sp.toString();
  return qs ? `/shop?${qs}` : "/shop";
}

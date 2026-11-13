import { Hero } from "@/components/home/Hero";
import { AudiencePicker } from "@/components/home/AudiencePicker";
import { MostLoved } from "@/components/home/MostLoved";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { Manifesto } from "@/components/home/Manifesto";
import { DiscretionFilm } from "@/components/home/DiscretionFilm";
import { TrustRow } from "@/components/home/TrustRow";
import { getProducts } from "@/lib/commerce";

export const revalidate = 60;

/**
 * Homepage order follows what the leading stores do: hero, promises, shop by who it's for,
 * bestsellers, collections, then the brand story.
 */
export default async function HomePage() {
  let loved: Awaited<ReturnType<typeof getProducts>> = [];
  try {
    const all = await getProducts();
    loved = [...all]
      .filter((p) => p.availability !== "sold_out")
      .sort((a, b) => Number(b.badge === "Bestseller") - Number(a.badge === "Bestseller") || b.featured - a.featured)
      .slice(0, 4);
  } catch {
    /* API unreachable at build time: the row simply doesn't show */
  }

  return (
    <>
      <Hero />
      <section aria-label="Our promises" className="border-y border-ivory/[0.08] bg-obsidian py-8 md:py-10">
        <div className="container">
          <TrustRow />
        </div>
      </section>
      <AudiencePicker />
      <MostLoved products={loved} />
      <CategoryGrid />
      <DiscretionFilm />
      <Manifesto />
    </>
  );
}

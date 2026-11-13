import type { Metadata } from "next";
import { DiscretionPage } from "@/components/discretion/DiscretionPage";

export const metadata: Metadata = {
  title: "The Discreet Promise",
  description: "Plain packaging, private billing and quiet emails. How Eden Flame protects your privacy at every step.",
};

export default function Page() {
  return <DiscretionPage />;
}

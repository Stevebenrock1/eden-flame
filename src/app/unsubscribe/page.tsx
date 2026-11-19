import type { Metadata } from "next";
import { Suspense } from "react";
import { Unsubscribe } from "@/components/layout/Unsubscribe";

export const metadata: Metadata = { title: "Unsubscribe", robots: { index: false } };

export default function UnsubscribePage() {
  return (
    <Suspense fallback={<div className="min-h-[80svh]" aria-busy="true" />}>
      <Unsubscribe />
    </Suspense>
  );
}

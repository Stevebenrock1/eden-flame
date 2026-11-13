import type { Metadata } from "next";
import { VerifyEmail } from "@/components/account/TokenActions";

export const metadata: Metadata = { title: "Confirm your account", robots: { index: false }, referrer: "no-referrer" };

export default async function VerifyPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token } = await searchParams;
  return <VerifyEmail token={token && token.length <= 200 ? token : null} />;
}

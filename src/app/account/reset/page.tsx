import type { Metadata } from "next";
import { ResetPassword } from "@/components/account/TokenActions";

export const metadata: Metadata = { title: "Reset your password", robots: { index: false }, referrer: "no-referrer" };

export default async function ResetPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token } = await searchParams;
  return <ResetPassword token={token && token.length <= 200 ? token : null} />;
}

import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AgeGate, ageGateBootScript } from "@/components/layout/AgeGate";
import { siteConfig } from "@/config/site";
import { AuthProvider } from "@/lib/auth";
import { BagProvider } from "@/lib/bag";
import "./globals.css";

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

const sans = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: `${siteConfig.name} | ${siteConfig.tagline}`, template: `%s | ${siteConfig.name}` },
  description: siteConfig.description,
};

export const viewport: Viewport = {
  themeColor: "#0B0A09",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`} suppressHydrationWarning>
      <head>
        {/* Must run before paint so returning visitors never see the age gate flash */}
        <script dangerouslySetInnerHTML={{ __html: ageGateBootScript }} />
      </head>
      <body>
        <AgeGate />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-ivory focus:px-4 focus:py-2 focus:text-obsidian"
        >
          Skip to content
        </a>
        <BagProvider>
          <AuthProvider>
            <Navbar />
            <main id="main">{children}</main>
            <Footer />
          </AuthProvider>
        </BagProvider>
      </body>
    </html>
  );
}

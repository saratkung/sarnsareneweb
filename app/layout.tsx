import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { brand } from "@/lib/content";
import { theme, hexToRgbTriplet } from "@/lib/theme";
import { LanguageProvider } from "@/components/LanguageContext";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-inter",
  display: "swap",
});

const sukhumvitSet = localFont({
  src: [
    { path: "./fonts/SukhumvitSet-Text.ttf", weight: "400", style: "normal" },
    { path: "./fonts/SukhumvitSet-Medium.ttf", weight: "500", style: "normal" },
  ],
  variable: "--font-thai",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const description =
  "SARNSARENE is a contemporary Thai design brand elevating traditional weaving materials and craftsmanship into everyday, quietly luxurious accessories.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: `${brand.name} — หรูอย่างสงบ`,
  description,
  applicationName: brand.name,
  openGraph: {
    type: "website",
    siteName: brand.name,
    title: `${brand.name} — Woven Serenity`,
    description,
    images: ["/images/hero.jpg"],
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cssVars = {
    "--color-bg": hexToRgbTriplet(theme.colors.bg),
    "--color-bg-secondary": hexToRgbTriplet(theme.colors.bgSecondary),
    "--color-beige": hexToRgbTriplet(theme.colors.beige),
    "--color-gold": hexToRgbTriplet(theme.colors.gold),
    "--color-text-light": hexToRgbTriplet(theme.colors.textLight),
    "--hero-overlay-opacity": theme.heroOverlayOpacity,
    "--journey-overlay-opacity": theme.journeyOverlayOpacity,
    "--image-brightness": theme.imageBrightness,
  } as React.CSSProperties;

  return (
    <html
      lang="th"
      className={`${cormorant.variable} ${inter.variable} ${sukhumvitSet.variable}`}
    >
      <body
        className="font-sans bg-bg text-text-light antialiased"
        style={cssVars}
        suppressHydrationWarning
      >
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}

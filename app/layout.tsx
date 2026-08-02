import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { brand } from "@/lib/content";

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

export const metadata: Metadata = {
  title: `${brand.name} — หรูอย่างสงบ`,
  description:
    "SARNSARENE is a contemporary Thai design brand elevating traditional weaving materials and craftsmanship into everyday, quietly luxurious accessories.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="th"
      className={`${cormorant.variable} ${inter.variable} ${sukhumvitSet.variable}`}
    >
      <body className="font-sans bg-bg text-text-light antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}

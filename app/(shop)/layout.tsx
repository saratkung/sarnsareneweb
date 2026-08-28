import type { Metadata } from "next";
import { ShopProviders } from "@/components/shop/ShopProviders";
import { ShopHeader } from "@/components/shop/ShopHeader";
import { ShopFooter } from "@/components/shop/ShopFooter";
import { CartDrawer } from "@/components/cart/CartDrawer";

export const metadata: Metadata = {
  title: "SARNSARENE — Shop",
  description:
    "Hand-woven Thai totes and small goods, built to be lived with. Quiet luxury from Bangkok.",
};

// The storefront runs on a warm-ivory palette — the inverse of the dark
// landing page — via the `.palette-shop` class (app/globals.css), which
// re-skins the shared CSS-variable token system. The landing page at "/"
// is left completely untouched.
export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="palette-shop flex min-h-screen flex-col bg-bg text-text-light font-sans antialiased">
      <ShopProviders>
        <ShopHeader />
        <main className="flex-1">{children}</main>
        <ShopFooter />
        <CartDrawer />
      </ShopProviders>
    </div>
  );
}

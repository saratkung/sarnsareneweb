import { Suspense } from "react";
import {
  allProducts,
  categories,
  collections,
  allColors,
  allSizes,
} from "@/lib/commerce/catalog";
import { ShopBrowser } from "@/components/shop/ShopBrowser";
import { ProductGridSkeleton } from "@/components/ui/Skeleton";

export const metadata = {
  title: "Shop — SARNSARENE",
  description: "The full collection of hand-woven totes and small goods.",
};

// Cached listing — refreshed every 60s, and immediately on any admin
// product change via revalidatePath("/shop").
export const revalidate = 60;

export default async function ShopPage() {
  // Tolerate a not-yet-reachable DB during the first deploy / prerender —
  // the page revalidates once the catalog is seeded.
  const [products, colors, sizes] = await Promise.all([
    allProducts().catch(() => []),
    allColors().catch(() => []),
    allSizes().catch(() => []),
  ]);

  return (
    <div>
      <header className="max-w-content mx-auto px-6 md:px-10 pt-16 pb-10 text-center">
        <p className="eyebrow mb-4">The Collection</p>
        <h1 className="font-serif font-light text-[clamp(2rem,4vw,3rem)] tracking-[0.04em] text-text-light">
          Shop
        </h1>
        <p className="mx-auto mt-5 max-w-md text-[13px] leading-relaxed font-light text-text-muted">
          Every piece is woven by hand in small batches. What is here is what exists.
        </p>
      </header>

      <Suspense
        fallback={
          <div className="max-w-content mx-auto px-6 md:px-10 pb-24 pt-24">
            <ProductGridSkeleton count={6} />
          </div>
        }
      >
        <ShopBrowser
          products={products}
          categories={categories}
          collections={collections}
          colors={colors}
          sizes={sizes}
        />
      </Suspense>
    </div>
  );
}

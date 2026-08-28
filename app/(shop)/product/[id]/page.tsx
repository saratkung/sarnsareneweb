import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProduct, getRelatedProducts } from "@/lib/commerce/catalog";
import { ProductDetail } from "@/components/shop/ProductDetail";
import { ProductCard } from "@/components/shop/ProductCard";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) return { title: "Not found — SARNSARENE" };
  const image = product.colors[0]?.images[0];
  return {
    title: `${product.name} — SARNSARENE`,
    description: product.shortDescription,
    alternates: { canonical: `/product/${product.slug}` },
    openGraph: {
      type: "website",
      title: product.name,
      description: product.shortDescription,
      images: image ? [image] : undefined,
    },
  };
}

export default async function ProductPage({ params }: Params) {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) notFound();

  const related = await getRelatedProducts(product, 3);

  return (
    <div className="pt-6">
      <nav className="max-w-content mx-auto px-6 md:px-10 pb-8 text-[10px] tracking-widest2 uppercase text-text-muted">
        <Link href="/shop" className="hover:text-text-light transition-colors">
          Shop
        </Link>
        <span className="mx-2">/</span>
        <span className="text-text-light">{product.name}</span>
      </nav>

      <ProductDetail product={product} />

      {related.length > 0 && (
        <section className="max-w-content mx-auto px-6 md:px-10 py-20 border-t border-text-light/10">
          <h2 className="mb-10 text-center font-serif text-[22px] text-text-light">
            You may also like
          </h2>
          <div className="grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-3">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

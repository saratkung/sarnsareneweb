import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { adminGetProduct } from "@/lib/commerce/catalog";
import { ProductEditForm } from "@/components/admin/ProductEditForm";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  const product = await adminGetProduct(id);
  return { title: `${product?.name ?? "Product"} — SARNSARENE Admin` };
}

export default async function AdminProductEdit({ params }: Params) {
  const { id } = await params;
  const product = await adminGetProduct(id);
  if (!product) notFound();

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        href="/admin/products"
        className="text-[10px] tracking-widest2 uppercase text-text-muted hover:text-text-light"
      >
        ← Products
      </Link>
      <h1 className="mb-1 mt-4 font-serif text-2xl text-text-light">{product.name}</h1>
      <p className="mb-8 text-[11px] tracking-widest2 uppercase text-text-muted">
        {product.id} · /product/{product.slug}
      </p>
      <ProductEditForm product={product} />
    </div>
  );
}

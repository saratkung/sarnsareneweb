import Link from "next/link";
import Image from "next/image";
import { adminListProducts, categories, collections } from "@/lib/commerce/catalog";
import { formatTHB } from "@/lib/commerce/format";
import { PageHeader, Card, EmptyRow } from "@/components/admin/ui";
import { cn } from "@/lib/cn";

export const dynamic = "force-dynamic";

const STATUS_TONE: Record<string, string> = {
  ACTIVE: "text-[#6f8f6a]",
  DRAFT: "text-text-muted",
  SOLD_OUT: "text-[#b98a3e]",
  ARCHIVED: "text-text-muted line-through",
};

export default async function AdminProductsPage() {
  const products = await adminListProducts();
  const catName = (slug: string) => categories.find((c) => c.slug === slug)?.name ?? slug;
  const colName = (slug: string) => collections.find((c) => c.slug === slug)?.name ?? slug;

  return (
    <div>
      <PageHeader
        title="Products"
        description={`${products.length} products`}
        action={
          <Link
            href="/admin/products/new"
            className="inline-flex h-10 items-center px-5 text-[10px] tracking-widest2 uppercase bg-text-light text-bg"
          >
            Create Product
          </Link>
        }
      />

      <Card className="overflow-x-auto">
        {products.length === 0 ? (
          <EmptyRow>No products</EmptyRow>
        ) : (
          <table className="w-full min-w-[680px] text-left text-[12px]">
            <thead>
              <tr className="border-b border-text-light/15 text-[9px] tracking-widest2 uppercase text-text-muted">
                <th className="py-2 pr-4 font-normal">Product</th>
                <th className="py-2 pr-4 font-normal">Category</th>
                <th className="py-2 pr-4 font-normal">Collection</th>
                <th className="py-2 pr-4 font-normal text-right">Price</th>
                <th className="py-2 pr-4 font-normal text-right">Stock</th>
                <th className="py-2 font-normal">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-text-light/10">
              {products.map((p) => {
                const stock = p.variants.reduce((s, v) => s + v.stock, 0);
                return (
                  <tr key={p.id} className="group">
                    <td className="py-3 pr-4">
                      <Link href={`/admin/products/${p.id}`} className="flex items-center gap-3">
                        <span className="relative h-10 w-8 shrink-0 overflow-hidden bg-bg-secondary">
                          <Image
                            src={p.colors[0]?.images[0] ?? "/images/product-1.jpg"}
                            alt=""
                            fill
                            sizes="32px"
                            className="object-cover"
                          />
                        </span>
                        <span className="font-serif text-[13px] text-text-light group-hover:text-gold">
                          {p.name}
                        </span>
                      </Link>
                    </td>
                    <td className="py-3 pr-4 text-text-muted">{catName(p.categorySlug)}</td>
                    <td className="py-3 pr-4 text-text-muted">{colName(p.collectionSlug)}</td>
                    <td className="py-3 pr-4 text-right tabular-nums text-text-light">
                      {formatTHB(p.price)}
                    </td>
                    <td
                      className={cn(
                        "py-3 pr-4 text-right tabular-nums",
                        stock === 0 ? "text-[#9d5c4d]" : "text-text-light",
                      )}
                    >
                      {stock}
                    </td>
                    <td className={cn("py-3 text-[10px] tracking-widest2 uppercase", STATUS_TONE[p.status])}>
                      {p.status.replace("_", " ")}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
}

import type { MetadataRoute } from "next";
import { allProducts } from "@/lib/commerce/catalog";

const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let products: Awaited<ReturnType<typeof allProducts>> = [];
  try {
    products = await allProducts();
  } catch {
    products = [];
  }

  return [
    { url: `${base}/`, changeFrequency: "monthly", priority: 1 },
    { url: `${base}/shop`, changeFrequency: "daily", priority: 0.9 },
    ...products.map((p) => ({
      url: `${base}/product/${p.slug}`,
      lastModified: new Date(p.createdAt),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}

import { adminListProducts } from "@/lib/commerce/catalog";
import { PageHeader } from "@/components/admin/ui";
import { InventoryTable } from "@/components/admin/InventoryTable";

export const dynamic = "force-dynamic";
export const metadata = { title: "Inventory — SARNSARENE Admin" };

export default async function AdminInventoryPage() {
  const products = await adminListProducts();
  const totalUnits = products.reduce(
    (s, p) => s + p.variants.reduce((v, x) => v + x.stock, 0),
    0,
  );

  return (
    <div>
      <PageHeader
        title="Inventory"
        description={`${products.reduce((s, p) => s + p.variants.length, 0)} variants · ${totalUnits} units on hand`}
      />
      <InventoryTable products={products} />
    </div>
  );
}

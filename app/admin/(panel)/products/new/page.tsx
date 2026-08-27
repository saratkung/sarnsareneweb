import Link from "next/link";
import { ProductCreateForm } from "@/components/admin/ProductCreateForm";

export const metadata = { title: "New Product — SARNSARENE Admin" };

export default function NewProductPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <Link
        href="/admin/products"
        className="text-[10px] tracking-widest2 uppercase text-text-muted hover:text-text-light"
      >
        ← Products
      </Link>
      <h1 className="mb-8 mt-4 font-serif text-2xl text-text-light">Create Product</h1>
      <ProductCreateForm />
    </div>
  );
}

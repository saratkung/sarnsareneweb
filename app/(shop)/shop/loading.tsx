import { ProductGridSkeleton } from "@/components/ui/Skeleton";

export default function ShopLoading() {
  return (
    <div>
      <div className="max-w-content mx-auto px-6 md:px-10 pt-16 pb-10 text-center">
        <div className="mx-auto h-2 w-24 animate-pulse bg-text-light/10" />
        <div className="mx-auto mt-5 h-9 w-40 animate-pulse bg-text-light/10" />
      </div>
      <div className="max-w-content mx-auto px-6 md:px-10 pb-24 pt-10">
        <ProductGridSkeleton count={6} />
      </div>
    </div>
  );
}

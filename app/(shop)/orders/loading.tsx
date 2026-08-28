import { Skeleton } from "@/components/ui/Skeleton";

export default function OrdersLoading() {
  return (
    <div className="max-w-3xl mx-auto px-6 md:px-10 py-16">
      <Skeleton className="h-2 w-16" />
      <Skeleton className="mt-3 h-9 w-48" />
      <div className="mt-12 space-y-4 border-y border-text-light/10 py-2">
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex items-center gap-5 py-4">
            <Skeleton className="h-16 w-12" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-3 w-40" />
              <Skeleton className="h-2.5 w-24" />
            </div>
            <Skeleton className="h-3 w-16" />
          </div>
        ))}
      </div>
    </div>
  );
}

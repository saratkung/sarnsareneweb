import { Skeleton } from "@/components/ui/Skeleton";

export default function OrderDetailLoading() {
  return (
    <div className="max-w-3xl mx-auto px-6 md:px-10 py-14">
      <Skeleton className="h-2 w-24" />
      <div className="mt-6 flex items-start justify-between gap-4 border-b border-text-light/10 pb-8">
        <div className="space-y-2">
          <Skeleton className="h-2 w-14" />
          <Skeleton className="h-7 w-40" />
          <Skeleton className="h-2 w-28" />
        </div>
        <Skeleton className="h-6 w-24" />
      </div>
      <Skeleton className="mt-10 h-[420px] w-full" />
      <div className="mt-12 grid gap-12 md:grid-cols-[1fr_1.3fr]">
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    </div>
  );
}

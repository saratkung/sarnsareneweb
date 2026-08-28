import { Skeleton } from "@/components/ui/Skeleton";

export default function ProductLoading() {
  return (
    <div className="max-w-content mx-auto px-6 md:px-10 pt-14 pb-24">
      <Skeleton className="h-2 w-32" />
      <div className="mt-10 grid gap-10 md:grid-cols-[1.15fr_1fr] md:gap-16 lg:gap-24">
        <Skeleton className="aspect-[4/5] w-full" />
        <div className="space-y-4 pt-2">
          <Skeleton className="h-2 w-24" />
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-px w-full" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-5/6" />
          <div className="flex gap-3 pt-4">
            <Skeleton className="h-9 w-9 rounded-full" />
            <Skeleton className="h-9 w-9 rounded-full" />
            <Skeleton className="h-9 w-9 rounded-full" />
          </div>
          <Skeleton className="h-14 w-full" />
        </div>
      </div>
    </div>
  );
}

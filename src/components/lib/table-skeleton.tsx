import { Skeleton } from "@/components/ui/skeleton";

interface TableSkeletonRowsProps {
  rows?: number;
  columns?: number;
}

export function TableSkeleton({ rows = 5 }: TableSkeletonRowsProps) {
  const rowArray = Array.from({ length: rows });

  return (
    <>
      {rowArray.map((_, i) => (
        <div key={i} className="space-y-1 mb-4">
          <Skeleton className="h-8 w-full" />
        </div>
      ))}
    </>
  );
}

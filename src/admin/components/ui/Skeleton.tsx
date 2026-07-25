interface SkeletonProps {
  className?: string;
}

export const Skeleton = ({ className = "" }: SkeletonProps) => (
  <div
    className={`admin-skeleton animate-shimmer rounded-lg ${className}`}
    aria-hidden="true"
  />
);

export const SkeletonCircle = ({ className = "" }: SkeletonProps) => (
  <div
    className={`admin-skeleton animate-shimmer rounded-full ${className}`}
    aria-hidden="true"
  />
);

export const SkeletonText = ({ className = "" }: SkeletonProps) => (
  <Skeleton className={`h-3.5 ${className}`} />
);

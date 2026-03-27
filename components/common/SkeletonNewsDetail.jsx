import React from "react";
import Skeleton from "./Skeleton";

const SkeletonNewsDetail = () => {
  return (
    <div className="space-y-8">
      {/* Featured image skeleton */}
      <Skeleton className="w-full h-96 rounded-xl" variant="rect" />

      {/* Meta info skeleton */}
      <div className="flex gap-4 items-center">
        <Skeleton className="h-5 w-24" variant="text" />
        <Skeleton className="h-4 w-32" variant="text" />
      </div>

      {/* Headline skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-8 w-full" variant="text" />
        <Skeleton className="h-8 w-4/5" variant="text" />
      </div>

      {/* Reporter info skeleton */}
      <Skeleton className="h-5 w-2/3" variant="text" />

      {/* Buttons skeleton */}
      <div className="flex gap-4">
        <Skeleton className="h-10 w-32" variant="rect" />
        <Skeleton className="h-10 w-32" variant="rect" />
      </div>

      {/* Content paragraphs skeleton */}
      <div className="space-y-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-full" variant="text" />
            <Skeleton className="h-4 w-full" variant="text" />
            <Skeleton className="h-4 w-5/6" variant="text" />
          </div>
        ))}
      </div>

      {/* Related news section skeleton */}
      <div className="space-y-4 mt-12">
        <Skeleton className="h-6 w-48" variant="text" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="w-full h-40 rounded-lg" variant="rect" />
              <Skeleton className="h-4 w-full" variant="text" />
              <Skeleton className="h-4 w-5/6" variant="text" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkeletonNewsDetail;

import React from "react";
import Skeleton from "./Skeleton";

const SkeletonNewsList = ({ count = 3 }) => {
  return (
    <div className="space-y-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex gap-4 p-4 bg-white rounded-lg shadow-sm">
          {/* Image skeleton */}
          <Skeleton className="w-32 h-24 flex-shrink-0" variant="rect" />

          {/* Content skeleton */}
          <div className="flex-1 space-y-3">
            <Skeleton className="h-4 w-24" variant="text" />
            <Skeleton className="h-5 w-full" variant="text" />
            <Skeleton className="h-4 w-3/4" variant="text" />
            <div className="flex gap-4 mt-2">
              <Skeleton className="h-3 w-20" variant="text" />
              <Skeleton className="h-3 w-20" variant="text" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SkeletonNewsList;

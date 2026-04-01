import React from "react";
import Skeleton from "@/components/common/Skeleton";
import Container from "@/components/common/Container";

const HomeSkeleton = () => {
  return (
    <div className="min-h-screen bg-[#eff3f6] dark:bg-[#121212] transition-colors">
      {/* Ad Skeleton */}
      <Container>
        <Skeleton className="h-32 w-full my-4" />
      </Container>

      {/* Trending Bar Skeleton */}
      <div className="bg-white dark:bg-[#1e1e1e]  dark:border-gray-700bg-[#1e1e1e] border-y border-gray-200 dark:border-gray-700 py-2">
        <Container>
          <div className="flex gap-4">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 flex-1" />
          </div>
        </Container>
      </div>

      <main className="pb-12 space-y-8 mt-4">
        {/* Hero Section Skeleton */}
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1e1e1e] p-4">
            <div className="md:col-span-5 space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-32 w-full" />
              <div className="flex gap-2">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-20" />
              </div>
            </div>
            <div className="md:col-span-5">
              <Skeleton className="h-100 w-full" />
            </div>
            <div className="md:col-span-2">
              <Skeleton className="h-full w-full" />
            </div>
          </div>
        </Container>

        {/* Trending Section Skeleton */}
        <Container>
          <div className="flex gap-4 overflow-x-auto pb-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="min-w-[300px] flex gap-3">
                <Skeleton className="h-20 w-24 flex-shrink-0" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            ))}
          </div>
        </Container>

        {/* Category Blocks Skeleton */}
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {[1, 2].map((i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-8 w-40" />
                <div className="flex gap-4">
                  <Skeleton className="h-40 w-48 flex-shrink-0" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-20 w-full" />
                  </div>
                </div>
                {[1, 2, 3].map((j) => (
                  <div key={j} className="flex gap-3 items-center">
                    <Skeleton className="h-12 w-16" />
                    <Skeleton className="h-4 flex-1" />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </Container>
      </main>
    </div>
  );
};

export default function Loading() {
  return <HomeSkeleton />;
}

import React from "react";
import Skeleton from "@/components/common/Skeleton";
import Container from "@/components/common/Container";

const CategorySkeleton = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[#eff3f6]">
      <main className="py-6 px-2">
        <Container>
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="lg:w-3/4">
              {/* Category Title Skeleton */}
              <div className="mb-6 flex items-center gap-4">
                <Skeleton className="h-10 w-48" />
                <div className="flex-1 border-t border-gray-300"></div>
              </div>

              {/* Sub-categories Skeleton */}
              <div className="flex gap-2 mb-8 overflow-hidden">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-8 w-24 flex-shrink-0" />
                ))}
              </div>

              {/* Featured News Skeleton */}
              <div className="mb-8 border-b border-gray-300 pb-8">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-1/2 space-y-4">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-32 w-full" />
                  </div>
                  <div className="md:w-1/2">
                    <Skeleton className="h-[300px] w-full" />
                  </div>
                </div>
              </div>

              {/* News Grid Skeleton */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="border border-gray-200 p-3 rounded-lg bg-white flex gap-3">
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-12 w-full" />
                    </div>
                    <Skeleton className="h-20 w-20 flex-shrink-0 rounded-md" />
                  </div>
                ))}
              </div>
            </div>

            {/* Sidebar Skeleton */}
            <div className="lg:w-1/4">
              <Skeleton className="h-8 w-full mb-4" />
              <div className="space-y-6">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex gap-3">
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-5/6" />
                    </div>
                    <Skeleton className="h-16 w-16 flex-shrink-0 rounded" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </main>
    </div>
  );
};

export default function Loading() {
  return <CategorySkeleton />;
}

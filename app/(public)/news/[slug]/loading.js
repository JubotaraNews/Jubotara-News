import React from "react";
import Skeleton from "@/components/common/Skeleton";
import Container from "@/components/common/Container";

const NewsDetailSkeleton = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[#eff3f6]">
      <main className="py-2">
        <Container className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Main Content Skeleton */}
          <article className="lg:col-span-8 p-3 md:p-6 border border-slate-300 bg-white">
            <div className="space-y-6">
              {/* Category Skeleton */}
              <Skeleton className="h-8 w-24" />

              {/* Title Skeleton */}
              <div className="space-y-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-3/4" />
              </div>

              {/* Author & Meta Skeleton */}
              <div className="flex justify-between items-center border-y border-gray-100 py-4">
                <div className="flex items-center gap-3">
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-10 w-10 circle" />
                  <Skeleton className="h-10 w-10 circle" />
                </div>
              </div>

              {/* Main Image Skeleton */}
              <Skeleton className="h-[400px] w-full" />

              {/* Body Text Skeleton */}
              <div className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
              </div>
            </div>
          </article>

          {/* Sidebar Skeleton */}
          <aside className="lg:col-span-4 space-y-6">
            <div className="bg-white p-4 border border-slate-300">
              <Skeleton className="h-8 w-32 mb-4" />
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex gap-3">
                    <Skeleton className="h-16 w-20 flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-3 w-2/3" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </Container>
      </main>
    </div>
  );
};

export default function Loading() {
  return <NewsDetailSkeleton />;
}

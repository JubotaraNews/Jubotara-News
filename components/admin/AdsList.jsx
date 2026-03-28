"use client";
import React from "react";
import {
  useGetAdsQuery,
  useDeleteAdMutation,
} from "@/app/redux/features/ads/adsApi";

export default function AdsList({ setSelectedAd }) {
  const { data, isLoading, isError } = useGetAdsQuery();
  const [deleteAd] = useDeleteAdMutation();

  // Extract the array safely
  const adsArray = data?.ads || [];

  if (isLoading) return <p className="dark:text-gray-400">Loading...</p>;
  if (isError || adsArray.length === 0) return <p className="dark:text-gray-400">No ads found.</p>;

  return (
    <div className="p-6 space-y-4">
      {adsArray.map((ad) => (
        <div
          key={ad._id}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-white dark:bg-[#1e1e1e] shadow rounded border dark:border-gray-800 space-y-3 sm:space-y-0 sm:space-x-4 transition-colors"
        >
          {/* Image */}
          <div className="shrink-0 w-full sm:w-32 h-24 sm:h-24 overflow-hidden rounded border dark:border-gray-700">
            <img
              src={ad.image}
              alt={ad.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Details */}
          <div className="flex-1">
            <h3 className="font-bold text-lg dark:text-gray-100">{ad.title}</h3>
            <p className="text-blue-600 dark:text-blue-400 underline break-all text-sm">{ad.link}</p>
            <p className="text-gray-500 dark:text-gray-400">{ad.position}</p>
            <p className="text-gray-400 dark:text-gray-500 text-sm">
              Active: {new Date(ad.startDate).toLocaleDateString()} -{" "}
              {new Date(ad.endDate).toLocaleDateString()}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2">
            <button
              onClick={() => setSelectedAd(ad)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition shadow-sm text-sm font-medium"
            >
              Edit
            </button>

            <button
              onClick={() => deleteAd(ad._id)}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition shadow-sm text-sm font-medium"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
"use client";

import { useState } from "react";
import {
  useGetVideosQuery,
  useDeleteVideoMutation,
} from "@/app/redux/features/youtubeVideo/videoApi";

export default function VideoList() {
  const { data, isLoading } = useGetVideosQuery([]);
  const videos = data?.data ?? []; // <-- default to []
  const [deleteVideo] = useDeleteVideoMutation();
  const [deletingId, setDeletingId] = useState("");

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this video?")) return;

    setDeletingId(id);
    try {
      await deleteVideo(id).unwrap();
    } catch (err) {
      console.error("Delete Error:", err);
      alert("Failed to delete video.");
    } finally {
      setDeletingId("");
    }
  };

  if (isLoading) return <p className="text-center py-4 dark:text-gray-400">Loading videos...</p>;

  if (videos.length === 0)
    return <p className="text-center text-gray-500 dark:text-gray-400 mt-4">No videos found.</p>;

  return (
    <div className="max-w-3xl mx-auto mt-6 px-4">
      <h2 className="text-xl font-bold mb-4 dark:text-gray-100">Video List</h2>

      <div className="space-y-4">
        {videos?.map((video) => (
          <div
            key={video._id}
            className="flex items-center justify-between p-3 bg-white dark:bg-[#1e1e1e] border dark:border-gray-800 rounded-lg shadow-sm transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="relative w-20 h-14 overflow-hidden rounded border dark:border-gray-700 shrink-0">
                <img
                  src={`https://img.youtube.com/vi/${video.videoId}/mqdefault.jpg`}
                  alt={video.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="font-semibold dark:text-gray-200 line-clamp-1">{video.title}</p>
            </div>

            <button
              onClick={() => handleDelete(video._id)}
              disabled={deletingId === video._id}
              className="px-4 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition disabled:bg-gray-400 dark:disabled:bg-gray-800 text-sm font-medium shrink-0"
            >
              {deletingId === video._id ? "Deleting..." : "Delete"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
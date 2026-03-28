"use client";

import { useState } from "react";
import { useAddVideoMutation } from "@/app/redux/features/youtubeVideo/videoApi";

export default function AddVideoForm() {
  const [title, setTitle] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [message, setMessage] = useState("");

  const [addVideo, { isLoading }] = useAddVideoMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const videoData = { title, youtubeUrl };

    try {
      // unwrap returns the actual response or throws an error
      await addVideo(videoData).unwrap();

      setMessage("Video added successfully!");
      setTitle("");
      setYoutubeUrl("");
    } catch (err) {
      // Proper type-safe error handling
      const apiError = err;
      setMessage(apiError?.data?.error || "Something went wrong!");
      console.error(err);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white dark:bg-[#1e1e1e] border dark:border-gray-800 rounded-lg shadow-sm transition-colors">
      <h2 className="text-xl font-bold mb-4 dark:text-gray-100">Add YouTube Video</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Video Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="p-2.5 border dark:border-gray-700 rounded dark:bg-[#121212] dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
          required
        />
        <input
          type="text"
          placeholder="YouTube URL"
          value={youtubeUrl}
          onChange={(e) => setYoutubeUrl(e.target.value)}
          className="p-2.5 border dark:border-gray-700 rounded dark:bg-[#121212] dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
          required
        />
        <button
          type="submit"
          disabled={isLoading}
          className="bg-blue-600 text-white px-4 py-2.5 rounded hover:bg-blue-700 transition disabled:bg-gray-400 dark:disabled:bg-gray-700 font-medium shadow-sm"
        >
          {isLoading ? "Adding..." : "Add Video"}
        </button>
      </form>
      {message && (
        <p className={`mt-3 text-sm font-medium ${message.includes("successfully") ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
          {message}
        </p>
      )}
    </div>
  );
}
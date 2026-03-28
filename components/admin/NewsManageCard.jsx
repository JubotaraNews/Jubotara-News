"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import PhotoCardModal from "./PhotoCardModal";
import CopyButton from "../news/CopyButton";
import { formatBengaliDate } from "@/utils/formatDate";

const NewsManageCard = ({
  item,
  onEdit,
  onDelete,
  onStatusUpdate,
  logoUrl,
}) => {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "admin";
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleApprove = async () => {
    try {
      const res = await fetch(`/api/news/${item._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "published" }),
      });
      if (res.ok) {
        toast.success("সংবাদটি অনুমোদিত হয়েছে!");
        if (onStatusUpdate) onStatusUpdate();
      } else {
        toast.error("অনুমোদন ব্যর্থ হয়েছে।");
      }
    } catch (error) {
      toast.error("সার্ভার ত্রুটি।");
    }
  };

  const statusColors = {
    published: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    draft: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
  };

  const statusLabels = {
    published: "প্রকাশিত",
    pending: "অপেক্ষমান",
    draft: "ড্রাফট",
  };

  return (
    <div className="p-4 bg-white dark:bg-[#1e1e1e] border-b border-gray-300 dark:border-gray-800 rounded-md shadow-sm mb-4 transition-colors">
      <div className="flex justify-between items-start">
        <h2 className="text-sm text-red-500 dark:text-red-400 font-medium">
          ক্যাটেগরি: {item.category}
        </h2>
        <span
          className={`px-2 py-1 rounded text-xs font-semibold ${statusColors[item.status] || "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"}`}
        >
          {statusLabels[item.status] || item.status}
        </span>
      </div>

      <h3 className="text-lg sm:text-xl font-semibold mt-1 wrap-break-word dark:text-gray-100">
        {item.headline}
      </h3>

      <div className="flex flex-wrap gap-2 text-xs text-gray-500 dark:text-gray-400 mt-1">
        {isAdmin && <span>লেখক: {item.authorName || "অজানা"} • </span>}
        <span>তারিখ: {formatBengaliDate(item.publishedAt || item.createdAt) || "অজানা"}</span>
        <span>•</span>
        <span>লাইক: {item.likesCount || 0}</span>
        <span>•</span>
        <span>কমেন্ট: {item.comments?.length || 0}</span>
      </div>

      <p className="text-gray-600 dark:text-gray-400 mt-2">
        <span className="font-semibold text-black dark:text-white">রিপোর্টার :</span>{" "}
        {item.reporterInfo}
      </p>

      {item.content && (
        <p className="mt-2 text-gray-700 dark:text-gray-300 wrap-break-word line-clamp-2">
          <span className="font-semibold text-black dark:text-white">বিস্তারিত সংবাদ :</span>{" "}
          {item.content}
        </p>
      )}

      {item.imageSrc && (
        <div className="mt-3 w-full h-48 sm:h-60 relative">
          <Image
            src={item.imageSrc}
            alt={item.headline}
            fill
            className="object-cover rounded"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
          />
        </div>
      )}

      {/* Edit / Delete Buttons */}
      <div className="flex flex-wrap gap-2 mt-4">
        {isAdmin && item.status === "pending" && (
          <button
            onClick={handleApprove}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition text-sm font-medium"
          >
            Approve
          </button>
        )}

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm font-medium"
        >
          Create Card
        </button>

        {(isAdmin || item.status !== "published") && (
          <button
            onClick={() => onEdit(item?._id)}
            className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition text-sm font-medium"
          >
            Edit
          </button>
        )}

        <button
          onClick={() => onDelete(item?._id)}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition text-sm font-medium"
        >
          Delete
        </button>
        <CopyButton url={`/news/${item._id}`} />
      </div>

      {/* Modal for Customization and Download */}
      {isModalOpen && (
        <PhotoCardModal
          news={item}
          logoUrl={logoUrl}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default NewsManageCard;
"use client";

import Image from "next/image";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";

const NewsManageCard = ({ item, onEdit, onDelete, onStatusUpdate }) => {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "admin";

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
    published: "bg-green-100 text-green-800",
    pending: "bg-yellow-100 text-yellow-800",
    draft: "bg-gray-100 text-gray-800",
  };

  const statusLabels = {
    published: "প্রকাশিত",
    pending: "অপেক্ষমান",
    draft: "ড্রাফট",
  };

  return (
    <div className="p-4 bg-white border-b border-gray-300 rounded-md shadow-sm mb-4">
      <div className="flex justify-between items-start">
        <h2 className="text-sm text-red-500 font-medium">
          ক্যাটেগরি: {item.category}
        </h2>
        <span className={`px-2 py-1 rounded text-xs font-semibold ${statusColors[item.status] || "bg-blue-100 text-blue-800"}`}>
          {statusLabels[item.status] || item.status}
        </span>
      </div>
      
      <h3 className="text-lg sm:text-xl font-semibold mt-1 break-words">
        {item.headline}
      </h3>

      <div className="flex flex-wrap gap-2 text-xs text-gray-500 mt-1">
        {isAdmin && <span>লেখক: {item.authorName || "অজানা"} • </span>}
        <span>তারিখ: {new Date(item.createdAt).toLocaleDateString("bn-BD")}</span>
        <span>•</span>
        <span>লাইক: {item.likesCount || 0}</span>
        <span>•</span>
        <span>কমেন্ট: {item.comments?.length || 0}</span>
      </div>

      <p className="text-gray-600 mt-2">
        <span className="font-semibold text-black">সংক্ষিপ্ত বিবরণ :</span>{" "}
        {item.reporterInfo}
      </p>

      {item.content && (
        <p className="mt-2 text-gray-700 break-words line-clamp-2">
          <span className="font-semibold text-black">বিস্তারিত সংবাদ :</span>{" "}
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
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-4">
        {isAdmin && item.status === "pending" && (
          <button
            onClick={handleApprove}
            className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
          >
            Approve
          </button>
        )}

        {(isAdmin || item.status !== "published") && (
          <button
            onClick={() => onEdit(item?._id)}
            className="w-full sm:w-auto px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
          >
            Edit
          </button>
        )}

        <button
          onClick={() => onDelete(item?._id)}
          className="w-full sm:w-auto px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default NewsManageCard;

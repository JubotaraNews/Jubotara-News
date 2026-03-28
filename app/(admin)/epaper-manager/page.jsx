"use client";
import React, { useState, useEffect } from "react";
import {
  MdDelete,
  MdAdd,
  MdCalendarToday,
  MdCloudUpload,
} from "react-icons/md";
import { toast } from "react-toastify";
import Image from "next/image";
import { formatBengaliDate } from "@/utils/formatDate";
import HotspotEditor from "@/components/admin/HotspotEditor";

export default function EPaperManager() {
  const [editions, setEditions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Hotspot Editor state
  const [editingHotspots, setEditingHotspots] = useState(null); // { edition, pageNumber }

  // Form state
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);

  useEffect(() => {
    fetchEditions();
  }, []);

  const fetchEditions = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/epaper?limit=50");
      const json = await res.json();
      if (json.success) {
        setEditions(json.data);
      }
    } catch (error) {
      toast.error("Failed to fetch editions");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);

    // Create preview URLs
    const urls = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls(urls);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedFiles.length === 0) {
      toast.error("Please select at least one page");
      return;
    }

    setUploading(true);
    try {
      const uploadedPages = [];

      // Upload each file to Cloudinary
      for (let i = 0; i < selectedFiles.length; i++) {
        const formData = new FormData();
        formData.append("file", selectedFiles[i]);

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const uploadJson = await uploadRes.json();
        if (uploadJson.success) {
          uploadedPages.push({
            pageNumber: i + 1,
            imageUrl: uploadJson.secure_url,
            publicId: uploadJson.public_id,
          });
        } else {
          throw new Error(`Failed to upload page ${i + 1}`);
        }
      }

      // Save to EPaper database
      const res = await fetch("/api/epaper", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date,
          pages: uploadedPages,
          status: "published",
        }),
      });

      const json = await res.json();
      if (json.success) {
        toast.success("EPaper edition uploaded successfully");
        setShowForm(false);
        setSelectedFiles([]);
        setPreviewUrls([]);
        fetchEditions();
      } else {
        toast.error(json.error || "Failed to save edition");
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this edition?")) return;

    try {
      const res = await fetch(`/api/epaper/delete/${id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (json.success) {
        toast.success("Edition deleted successfully");
        fetchEditions();
      } else {
        toast.error(json.error || "Delete failed");
      }
    } catch (error) {
      toast.error("Error deleting edition");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 mt-5">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">ই-পেপার ম্যানেজমেন্ট</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition"
        >
          {showForm ? <MdAdd className="rotate-45" /> : <MdAdd />}
          {showForm ? "বন্ধ করুন" : "নতুন ই-পেপার যোগ করুন"}
        </button>
      </div>

      {showForm && (
        <div className="bg-white dark:bg-[#1e1e1e] p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 mb-8">
          <h2 className="text-lg font-semibold mb-4">নতুন এডিশন আপলোড</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  তারিখ নির্বাচন করুন
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  পাতাগুলো নির্বাচন করুন (একাধিক)
                </label>
                <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-500 transition cursor-pointer">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center justify-center text-gray-500">
                    <MdCloudUpload size={32} />
                    <span>ক্লিক করুন অথবা ছবিগুলো টেনে আনুন</span>
                  </div>
                </div>
              </div>
            </div>

            {previewUrls.length > 0 && (
              <div className="space-y-2">
                <p className="font-medium text-sm text-gray-700">
                  প্রিভিউ ({previewUrls.length} পাতা):
                </p>
                <div className="flex gap-4 overflow-x-auto pb-4">
                  {previewUrls.map((url, index) => (
                    <div
                      key={index}
                      className="relative w-32 h-44 shrink-0 border rounded-lg overflow-hidden"
                    >
                      <Image
                        src={url}
                        alt={`Preview ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute bottom-0 left-0 w-full bg-black/50 text-white text-[10px] text-center py-1">
                        পাতা {index + 1}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={uploading}
              className={`w-full py-3 rounded-lg font-bold text-white transition ${
                uploading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {uploading ? "আপলোড হচ্ছে..." : "এডিশনটি সেভ করুন"}
            </button>
          </form>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">লোড হচ্ছে...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {editions.map((edition) => (
            <div
              key={edition._id}
              className="bg-white dark:bg-[#1e1e1e] rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden group"
            >
              <div className="relative aspect-3/4 w-full bg-gray-100">
                <Image
                  src={edition.thumbnail}
                  alt={`EPaper ${edition.date}`}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-4">
                  <button
                    onClick={() => handleDelete(edition._id)}
                    className="p-3 bg-white dark:bg-gray-800 text-red-600 dark:text-red-400 rounded-full hover:bg-red-50 transition shadow-lg"
                    title="Delete"
                  >
                    <MdDelete size={20} />
                  </button>
                </div>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-gray-900 dark:text-gray-300">
                    {new Date(edition.date).toLocaleDateString("bn-BD", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </h3>
                  <div className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded uppercase">
                    {edition.status}
                  </div>
                </div>
                <p className="text-sm text-gray-500">
                  {edition.pages?.length || 0} পাতা
                </p>

                <div className="pt-2 border-t">
                  <p className="text-xs font-bold text-gray-400 mb-2 uppercase">
                    হটস্পট ম্যানেজ করুন:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {edition.pages.map((p) => (
                      <button
                        key={p.pageNumber}
                        onClick={() =>
                          setEditingHotspots({
                            edition,
                            pageNumber: p.pageNumber,
                          })
                        }
                        className="w-8 h-8 flex items-center justify-center bg-gray-100 dark:bg-gray-700 hover:bg-blue-600 hover:text-white rounded text-xs font-bold transition"
                      >
                        {p.pageNumber}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {editingHotspots && (
        <HotspotEditor
          edition={editingHotspots.edition}
          pageNumber={editingHotspots.pageNumber}
          onClose={() => setEditingHotspots(null)}
          onSave={() => {
            setEditingHotspots(null);
            fetchEditions();
          }}
        />
      )}

      {!loading && editions.length === 0 && (
        <div className="text-center py-24 bg-white rounded-xl border-2 border-dashed border-gray-200">
          <p className="text-gray-500">কোনো ই-পেপার এডিশন পাওয়া যায়নি।</p>
        </div>
      )}
    </div>
  );
}

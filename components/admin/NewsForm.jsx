"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { uploadToCloudinary } from "@/utils/utils";
import { toast } from "react-toastify";
import {
  useAddNewsMutation,
  useUpdateNewsMutation,
} from "@/app/redux/features/news/newsApi";

export default function NewsForm({ initialData, onSuccess }) {
  const isEditMode = !!initialData?._id;

  const [formData, setFormData] = useState(
    initialData || {
      title: "",
      reporterInfo: "",
      category: "",
      content: "",
      imageSrc: "",
      isFeatured: false,
    }
  );

  const [categories, setCategories] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(initialData?.imageSrc || "");
  const [loading, setLoading] = useState(false);

  const [addNews] = useAddNewsMutation();
  const [updateNews] = useUpdateNewsMutation();

  // 🔹 Fetch categories from backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/category");
        const data = await res.json();
        setCategories(data.categories || []);
      } catch (err) {
        console.error("Category fetch error:", err);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, type, value } = e.target;
    let newValue = value;
    if (type === "checkbox" && e.target instanceof HTMLInputElement)
      newValue = e.target.checked;
    setFormData((prev) => ({ ...prev, [name]: newValue }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.title ||
      !formData.reporterInfo ||
      !formData.category ||
      !formData.content
    ) {
      toast.warn("সব ফিল্ড পূরণ করুন।");
      return;
    }
    if (!imageFile && !formData.imageSrc) {
      toast.warn("একটি ছবি আপলোড করুন।");
      return;
    }
    try {
      setLoading(true);
      let uploadedImageUrl = formData.imageSrc;

      if (imageFile) {
        uploadedImageUrl = await uploadToCloudinary(imageFile);
        if (!uploadedImageUrl) throw new Error("ছবি আপলোড ব্যর্থ হয়েছে।");
      }

      const submitData = {
        title: formData.title,
        reporterInfo: formData.reporterInfo,
        category: formData.category,
        content: formData.content,
        imageSrc: uploadedImageUrl,
        isFeatured: formData.isFeatured,
      };

      if (isEditMode && formData._id) {
        await updateNews({ id: formData._id, data: submitData }).unwrap();
        toast.success("সংবাদ সফলভাবে আপডেট হয়েছে!");
      } else {
        await addNews(submitData).unwrap();
        toast.success("সংবাদ সফলভাবে যুক্ত হয়েছে!");
        setFormData({
          title: "",
          reporterInfo: "",
          category: "",
          content: "",
          imageSrc: "",
          isFeatured: false,
        });
        setPreviewUrl("");
        setImageFile(null);
      }

      onSuccess();
    } catch (err) {
      console.error(err);
      toast.error(`সংবাদ সংরক্ষণ ব্যর্থ। ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="container mx-auto">
      <div className=" p-5 bg-white shadow">
        <h2 className="text-2xl font-semibold mb-6">
          {isEditMode ? "সংবাদ সম্পাদনা করুন" : "সংবাদ যুক্ত করুন"}
        </h2>
        <form onSubmit={handleSubmit}>
          <ul className="space-y-4 list-none p-0">
            <li>
              <input
                type="text"
                name="title"
                placeholder="শিরোনাম"
                value={formData.title}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
                required
              />
            </li>
            <li>
              <textarea
                name="reporterInfo"
                placeholder="রিপোর্টার ইনফো"
                value={formData.reporterInfo}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
                required
              />
            </li>
            <li>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
                required
              >
                <option value="">বিভাগ নির্বাচন করুন</option>
                {categories.map((c) => (
                  <option key={c._id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </li>
            <li>
              <textarea
                name="content"
                placeholder="বিস্তারিত সংবাদ"
                value={formData.content}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded h-96"
              />
            </li>
            <li>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="isFeatured"
                  checked={formData.isFeatured}
                  onChange={handleChange}
                  className="accent-blue-600"
                />
                ফিচার্ড সংবাদ
              </label>
            </li>
            <li>
              <label className="block mb-1">ছবি আপলোড করুন</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full"
              />
            </li>
            {previewUrl && (
              <li className="relative">
                <Image
                  src={previewUrl}
                  alt="ছবি"
                  width={300}
                  height={200}
                  className="rounded border object-cover"
                  unoptimized={previewUrl.startsWith("blob:")}
                />
                {imageFile && (
                  <button
                    type="button"
                    onClick={() => {
                      setPreviewUrl(formData.imageSrc);
                      setImageFile(null);
                    }}
                    className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded-full text-sm"
                  >
                    ✕
                  </button>
                )}
              </li>
            )}
            <li>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
              >
                {loading
                  ? "আপলোড হচ্ছে..."
                  : isEditMode
                    ? "সংবাদ আপডেট করুন"
                    : "সংবাদ যুক্ত করুন"}
              </button>
            </li>
          </ul>
        </form>
      </div>
    </section>
  );
}

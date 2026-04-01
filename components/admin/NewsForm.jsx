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

  const [formData, setFormData] = useState({
    headline: initialData?.headline || initialData?.title || "",
    reporterInfo: initialData?.reporterInfo || "",
    category: initialData?.category || "",
    content: initialData?.content || "",
    imageSrc: initialData?.imageSrc || "",
    imageCaption: initialData?.imageCaption || "",
    isFeatured: initialData?.isFeatured || false,
    metaTitle: initialData?.metaTitle || "",
    metaDescription: initialData?.metaDescription || "",
    _id: initialData?._id,
  });

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
      !formData.headline ||
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
        headline: formData.headline,
        reporterInfo: formData.reporterInfo,
        category: formData.category,
        content: formData.content,
        imageSrc: uploadedImageUrl,
        imageCaption: formData.imageCaption,
        isFeatured: formData.isFeatured,
        metaTitle: formData.metaTitle,
        metaDescription: formData.metaDescription,
      };

      if (e.nativeEvent.submitter?.name === "draft") {
        submitData.status = "draft";
      }

      if (isEditMode && formData._id) {
        await updateNews({ id: formData._id, data: submitData }).unwrap();
        toast.success("সংবাদ সফলভাবে আপডেট হয়েছে!");
      } else {
        await addNews(submitData).unwrap();
        toast.success("সংবাদ সফলভাবে যুক্ত হয়েছে!");
        setFormData({
          headline: "",
          reporterInfo: "",
          category: "",
          content: "",
          imageSrc: "",
          imageCaption: "",
          isFeatured: false,
          metaTitle: "",
          metaDescription: "",
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
      <div className=" p-5 bg-white dark:bg-[#1e1e1e] shadow rounded-lg border dark:border-gray-800 transition-colors">
        <h2 className="text-2xl font-semibold mb-6 dark:text-gray-100">
          {isEditMode ? "সংবাদ সম্পাদনা করুন" : "সংবাদ যুক্ত করুন"}
        </h2>
        <form onSubmit={handleSubmit}>
          <ul className="space-y-4 list-none p-0">
            <li>
              <input
                type="text"
                name="headline"
                placeholder="শিরোনাম (Headline)"
                value={formData.headline}
                onChange={handleChange}
                className="w-full border dark:border-gray-700 px-3 py-2 rounded dark:bg-[#121212] dark:text-white"
                required
              />
            </li>
            <li>
              <input
                type="text"
                name="reporterInfo"
                placeholder="রিপোর্টার ইনফো"
                value={formData.reporterInfo}
                onChange={handleChange}
                className="w-full border dark:border-gray-700 px-3 py-2 rounded dark:bg-[#121212] dark:text-white"
              />
            </li>
            <li>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full border dark:border-gray-700 px-3 py-2 rounded dark:bg-[#121212] dark:text-white"
                required
              >
                <option value="">বিভাগ নির্বাচন করুন</option>
                {categories.map((c) => (
                  <option key={c._id} value={c.name} className="dark:bg-[#1e1e1e]">
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
                className="w-full border dark:border-gray-700 px-3 py-2 rounded h-96 dark:bg-[#121212] dark:text-white"
              />
            </li>
            <li>
              <label className="flex items-center gap-2 dark:text-gray-300">
                <input
                  type="checkbox"
                  name="isFeatured"
                  checked={formData.isFeatured}
                  onChange={handleChange}
                  className="accent-blue-600 h-4 w-4"
                />
                ফিচার্ড সংবাদ
              </label>
            </li>
            <li>
              <div className="space-y-2">
                <label className="block mb-1 font-medium dark:text-gray-300">ছবি আপলোড করুন</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 dark:file:bg-blue-900/20 file:text-blue-700 dark:file:text-blue-400 hover:file:bg-blue-100"
                />
                <input
                  type="text"
                  name="imageCaption"
                  placeholder="ছবির ক্যাপশন (ঐচ্ছিক)"
                  value={formData.imageCaption}
                  onChange={handleChange}
                  className="w-full border dark:border-gray-700 px-3 py-2 rounded text-sm dark:bg-[#121212] dark:text-white"
                />
              </div>
            </li>
            {previewUrl && (
              <li className="relative inline-block">
                <Image
                  src={previewUrl}
                  alt="ছবি"
                  width={300}
                  height={200}
                  className="rounded border dark:border-gray-700 object-cover"
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

            {/* SEO Settings */}
            <li className="pt-6 border-t dark:border-gray-800 mt-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300">SEO সেটিংস (ঐচ্ছিক)</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">মেটা শিরোনাম (Meta Title)</label>
                  <input
                    type="text"
                    name="metaTitle"
                    placeholder="মেটা শিরোনাম দিন"
                    value={formData.metaTitle}
                    onChange={handleChange}
                    className="w-full border dark:border-gray-700 px-3 py-2 rounded dark:bg-[#121212] dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">মেটা বর্ণনা (Meta Description)</label>
                  <textarea
                    name="metaDescription"
                    placeholder="মেটা বর্ণনা দিন (সংক্ষিপ্ত বিবরণ)"
                    value={formData.metaDescription}
                    onChange={handleChange}
                    className="w-full border dark:border-gray-700 px-3 py-2 rounded h-24 dark:bg-[#121212] dark:text-white"
                  />
                </div>
              </div>
            </li>

            <li className="flex gap-4 pt-6">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-400 dark:disabled:bg-gray-700 transition"
              >
                {loading
                  ? "আপলোড হচ্ছে..."
                  : isEditMode
                    ? "সংবাদ আপডেট করুন"
                    : "সংবাদ যুক্ত করুন"}
              </button>
              {!isEditMode && (
                <button
                  type="submit"
                  name="draft"
                  disabled={loading}
                  className="flex-1 bg-gray-500 text-white py-2 rounded hover:bg-gray-600 disabled:bg-gray-400 dark:disabled:bg-gray-700 transition"
                >
                  ড্রাফট হিসেবে সেভ করুন
                </button>
              )}
            </li>
          </ul>
        </form>
      </div>
    </section>
  );
}
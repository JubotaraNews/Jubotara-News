"use client";

import { useEffect, useState } from "react";
import NewsManageCard from "@/components/admin/NewsManageCard";
import Skeleton from "@/components/common/Skeleton";

const NewsListSkeleton = () => (
  <div className="space-y-4">
    {[1, 2, 3, 4, 5].map((i) => (
      <div key={i} className="p-4 bg-white dark:bg-[#1e1e1e] border-b border-gray-300 dark:border-gray-800 rounded-md shadow-sm">
        <div className="flex justify-between mb-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-6 w-16" />
        </div>
        <Skeleton className="h-8 w-3/4 mb-4" />
        <div className="flex gap-2 mb-4">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-32" />
        </div>
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-5/6 mb-4" />
        <div className="flex gap-2 mt-4">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>
    ))}
  </div>
);

const NewsList = ({ onEditClick }) => {
  const [news, setNews] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [logoUrl, setLogoUrl] = useState("");

  // =========================
  // 🔹 Fetch categories and settings
  // =========================
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/category");
        const data = await res.json();
        setCategories([
          { _id: "all", name: "সব", slug: "all" },
          ...(data.categories || []),
        ]);
      } catch (err) {
        console.error("Category fetch error:", err);
        setCategories([{ _id: "all", name: "সব", slug: "all" }]);
      }
    };

    const fetchLogo = async () => {
      try {
        const res = await fetch("/api/settings/logo");
        const data = await res.json();
        if (data.success && data.logos && data.logos.length > 0) {
          setLogoUrl(data.logos[0].logoUrl);
        }
      } catch (err) {
        console.error("Logo fetch error:", err);
      }
    };

    fetchCategories();
    fetchLogo();
  }, []);

  // =========================
  // 🔹 Fetch news by category and status
  // =========================
  const fetchNews = async (category, status) => {
    setIsLoading(true);
    try {
      const url = new URL("/api/news", window.location.origin);
      if (category && category !== "all") {
        url.searchParams.append("category", category);
      }
      if (status) {
        url.searchParams.append("status", status);
      }
      const res = await fetch(url.toString());
      const data = await res.json();
      if (res.ok && data.data) setNews(data.data);
      else setNews([]);
    } catch (error) {
      console.error("Failed to fetch news:", error);
      setNews([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNews(selectedCategory, selectedStatus);
  }, [selectedCategory, selectedStatus]);

  // =========================
  // 🔹 Edit & Delete handlers
  // =========================
  const handleEdit = async (id) => {
    try {
      const res = await fetch(`/api/news/${id}`);
      const data = await res.json();
      if (res.ok) {
        onEditClick(data);
      } else {
        console.error("Failed to fetch news details for editing");
        // Fallback to what we have in the list if fetch fails
        const itemToEdit = news.find((item) => item._id === id);
        if (itemToEdit) onEditClick(itemToEdit);
      }
    } catch (err) {
      console.error("Error fetching news details:", err);
      const itemToEdit = news.find((item) => item._id === id);
      if (itemToEdit) onEditClick(itemToEdit);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/news/${id}`, { method: "DELETE" });
      if (res.ok) {
        setNews((prev) => prev.filter((n) => n._id !== id));
        return true;
      } else return false;
    } catch {
      return false;
    }
  };

  const STATUS_TABS = [
    { label: "সকল সংবাদ", value: "all" },
    { label: "প্রকাশিত", value: "published" },
    { label: "অপেক্ষমান", value: "pending" },
    { label: "ড্রাফট", value: "draft" },
  ];

  return (
    <div className="max-w-7xl mx-auto lg:w-full">
      <h2 className="text-2xl font-bold mb-4 dark:text-gray-100">সংবাদ ব্যবস্থাপনা</h2>

      {/* Status Tabs */}
      <div className="flex border-b dark:border-gray-800 mb-6 overflow-x-auto">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setSelectedStatus(tab.value)}
            className={`px-6 py-3 text-sm font-medium transition whitespace-nowrap ${
              selectedStatus === tab.value
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((cat) => (
          <button
            key={cat._id}
            onClick={() => setSelectedCategory(cat.name)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${
              selectedCategory === cat.name
                ? "bg-blue-600 text-white border-blue-700"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {isLoading ? (
        <NewsListSkeleton />
      ) : news.length === 0 ? (
        <p className="dark:text-gray-400">কোনো সংবাদ পাওয়া যায়নি।</p>
      ) : (
        <div className="space-y-4">
          {news.map((item) => (
            <NewsManageCard
              key={item._id}
              item={item}
              onEdit={() => handleEdit(item._id)}
              onDelete={handleDelete}
              onStatusUpdate={() => fetchNews(selectedCategory, selectedStatus)}
              logoUrl={logoUrl}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default NewsList;
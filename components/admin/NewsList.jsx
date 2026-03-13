"use client";

import { useEffect, useState } from "react";
import NewsManageCard from "@/components/admin/NewsManageCard";

const NewsList = ({ onEditClick }) => {
  const [news, setNews] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  // =========================
  // 🔹 Fetch categories from backend
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

    fetchCategories();
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
  const handleEdit = (id) => {
    const itemToEdit = news.find((item) => item._id === id);
    if (itemToEdit) onEditClick(itemToEdit);
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
      <h2 className="text-2xl font-bold mb-4">সংবাদ ব্যবস্থাপনা</h2>

      {/* Status Tabs */}
      <div className="flex border-b mb-6 overflow-x-auto">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setSelectedStatus(tab.value)}
            className={`px-6 py-3 text-sm font-medium transition whitespace-nowrap ${
              selectedStatus === tab.value
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
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
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {isLoading ? (
        <p>সংবাদ লোড হচ্ছে...</p>
      ) : news.length === 0 ? (
        <p>কোনো সংবাদ পাওয়া যায়নি।</p>
      ) : (
        <div className="space-y-4">
          {news.map((item) => (
            <NewsManageCard
              key={item._id}
              item={item}
              onEdit={() => handleEdit(item._id)}
              onDelete={handleDelete}
              onStatusUpdate={() => fetchNews(selectedCategory, selectedStatus)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default NewsList;

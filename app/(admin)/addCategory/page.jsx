"use client";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function CategoryPage() {
  const [name, setName] = useState("");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/category");
      const data = await res.json();
      if (res.ok) {
        setCategories(data.categories || []);
      }
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/category", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      const data = await res.json();
      if (res.ok) {
        setName("");
        fetchCategories();
        toast.success("Category added successfully!");
      } else {
        toast.error(data.message || "Failed to add category");
      }
    } catch (err) {
      console.error("Failed to add category:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (slug) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    try {
      const res = await fetch(`/api/category/${slug}`, { method: "DELETE" });
      const data = await res.json();

      if (res.ok) {
        fetchCategories();
        toast.success("Category deleted successfully!");
      } else {
        toast.error(data.message || "Failed to delete category");
      }
    } catch (err) {
      console.error("Failed to delete category:", err);
      toast.error("Failed to delete category. Please try again.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Manage Categories</h1>

      <div className="bg-white dark:bg-[#1e1e1e] p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-800 mb-8">
        <h2 className="text-lg font-semibold mb-4">Add New Category</h2>
        <form onSubmit={handleSubmit} className="flex gap-4">
          <input
            type="text"
            placeholder="Category Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="flex-1 border rounded-lg px-4 py-2"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Adding..." : "Add Category"}
          </button>
        </form>
      </div>

      <div className="bg-white dark:bg-[#1e1e1e] p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-800">
        <h2 className="text-lg font-semibold mb-4">Existing Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <div
              key={cat._id}
              className="flex items-center justify-between p-3 border rounded-lg bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
            >
              <span className="font-medium">{cat.name}</span>
              <button
                onClick={() => handleDelete(cat.slug)}
                className="text-red-500 hover:text-red-700 text-sm font-semibold"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

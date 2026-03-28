"use client";
import React, { useEffect, useState } from "react";
import { MdEdit, MdDelete, MdDragHandle, MdAdd } from "react-icons/md";
import { toast } from "react-toastify";

export default function NavManager() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ label: "", href: "", order: 0 });
  const [editingId, setEditingId] = useState(null);
  const [categories, setCategories] = useState([]);

  const fetchItems = async () => {
    try {
      const res = await fetch("/api/admin/navbar");
      const json = await res.json();
      if (json.success) setItems(json.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/category");
      const json = await res.json();
      if (res.ok) setCategories(json.categories || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchItems();
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editingId ? "PATCH" : "POST";
    const url = editingId
      ? `/api/admin/navbar/${editingId}`
      : "/api/admin/navbar";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setFormData({ label: "", href: "", order: 0 });
        setEditingId(null);
        fetchItems();
        toast.success(
          editingId ? "Navbar item updated!" : "Navbar item added!",
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure?")) return;
    try {
      const res = await fetch(`/api/admin/navbar/${id}`, { method: "DELETE" });
      if (res.ok) fetchItems();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (item) => {
    setEditingId(item._id);
    setFormData({ label: item.label, href: item.href, order: item.order });
  };

  const selectCategory = (cat) => {
    setFormData({
      ...formData,
      label: cat.name,
      href: `/category/${cat.slug}`,
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 mt-5">
      <h1 className="text-2xl font-bold mb-6">Navbar Manager</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Section */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-[#1e1e1e] p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700">
            <h2 className="text-lg font-semibold mb-4">
              {editingId ? "Edit Link" : "Add New Link"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Label
                </label>
                <input
                  type="text"
                  value={formData.label}
                  onChange={(e) =>
                    setFormData({ ...formData, label: e.target.value })
                  }
                  className="w-full border rounded-lg px-4 py-2"
                  placeholder="e.g. Home, Sports"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Link (URL)
                </label>
                <input
                  type="text"
                  value={formData.href}
                  onChange={(e) =>
                    setFormData({ ...formData, href: e.target.value })
                  }
                  className="w-full border rounded-lg px-4 py-2"
                  placeholder="e.g. /, /category/sports"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Order
                </label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      order: parseInt(e.target.value),
                    })
                  }
                  className="w-full border rounded-lg px-4 py-2"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  {editingId ? "Update Link" : "Add Link"}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(null);
                      setFormData({ label: "", href: "", order: 0 });
                    }}
                    className="bg-gray-200 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>

            <div className="mt-8">
              <h3 className="text-sm font-bold text-gray-500 dark:text-gray-200 uppercase mb-3">
                Quick Add Categories
              </h3>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat._id}
                    onClick={() => selectCategory(cat)}
                    className="text-xs bg-gray-100 dark:bg-gray-800 hover:bg-blue-100 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-1 rounded-full transition"
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* List Section */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-[#1e1e1e] rounded-xl shadow-md border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-semibold">Active Navbar Items</h2>
              <p className="text-sm text-gray-500 dark:text-gray-300">
                Items will appear in the public header in this order.
              </p>
            </div>
            <div className="divide-y divide-gray-100">
              {loading ? (
                <div className="p-6 text-center text-gray-500 dark:text-gray-300">
                  Loading...
                </div>
              ) : items.length === 0 ? (
                <div className="p-6 text-center text-gray-500 dark:text-gray-300">
                  No items found. Add some links to get started!
                </div>
              ) : (
                items.map((item) => (
                  <div
                    key={item._id}
                    className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-gray-400">
                        <MdDragHandle size={20} />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800 dark:text-gray-200">
                          {item.label}
                        </p>
                        <p className="text-xs text-blue-600">{item.href}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-500 mr-4">
                        Order: {item.order}
                      </span>
                      <button
                        onClick={() => handleEdit(item)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        title="Edit"
                      >
                        <MdEdit size={20} />
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="Delete"
                      >
                        <MdDelete size={20} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

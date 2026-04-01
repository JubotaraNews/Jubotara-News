"use client";
import React, { useState } from "react";
import NewsList from "@/components/admin/NewsList";
import NewsForm from "@/components/admin/NewsForm";
import { MdClose } from "react-icons/md";

export default function NewsListPage() {
  const [editingNews, setEditingNews] = useState(null);

  const handleEditClick = (news) => {
    setEditingNews(news);
  };

  const handleSuccess = () => {
    setEditingNews(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {editingNews ? (
        <div className="relative">
          <button
            onClick={() => setEditingNews(null)}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10"
          >
            <MdClose size={24} />
          </button>
          <NewsForm initialData={editingNews} onSuccess={handleSuccess} />
        </div>
      ) : (
        <NewsList onEditClick={handleEditClick} />
      )}
    </div>
  );
}

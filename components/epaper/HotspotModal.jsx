"use client";
import React from "react";
import { MdClose } from "react-icons/md";

export default function HotspotModal({ hotspot, onClose }) {
  if (!hotspot) return null;

  return (
    <div className="fixed inset-0 z-[2000] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-[#1e1e1e] w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b dark:border-gray-800 bg-gray-50 dark:bg-gray-900 flex justify-between items-center">
          <h2 className="font-bold text-lg text-gray-900 dark:text-white line-clamp-1">
            {hotspot.title || "খবরের বিস্তারিত"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full transition-colors text-gray-500 dark:text-gray-400"
          >
            <MdClose size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          <div
            className="prose prose-lg max-w-none text-gray-800 dark:text-gray-200 leading-relaxed font-medium"
            dangerouslySetInnerHTML={{ __html: hotspot.content }}
          />
        </div>

        {/* Footer */}
        <div className="p-4 border-t dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-center">
          <button
            onClick={onClose}
            className="px-8 py-2 bg-red-600 text-white rounded-full font-bold hover:bg-red-700 transition shadow-lg"
          >
            বন্ধ করুন
          </button>
        </div>
      </div>
    </div>
  );
}

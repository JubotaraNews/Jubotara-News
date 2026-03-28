"use client";
import React, { useState } from "react";
import { toast } from "react-toastify";

export default function ChangeLogo() {
  const [preview, setPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (file) => {
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setLoading(true);

    try {
      // API UPLOAD HERE
      const formData = new FormData();
      formData.append("logo", selectedFile);

      const res = await fetch("/api/settings/logo", {
        method: "POST",
        body: formData,
      });
      console.log(res);

      if (!res.ok) throw new Error("Upload failed");

      toast.success("Logo updated successfully!");
    } catch (error) {
      toast.error("Failed to upload logo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white dark:bg-[#1e1e1e] p-6 rounded-xl shadow-sm border dark:border-gray-800 transition-colors">
      <h2 className="text-2xl font-semibold mb-4 dark:text-gray-100">Change Logo</h2>

      {/* Upload Box */}
      <label
        className="
          flex flex-col items-center justify-center 
          w-full h-40 cursor-pointer
          bg-gray-50 dark:bg-gray-900 border border-dashed border-gray-300 dark:border-gray-700
          rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition
        "
      >
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) =>
            e.target.files && handleFileChange(e.target.files[0])
          }
        />

        {!preview ? (
          <div className="text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">Click to upload your logo</p>
            <p className="text-xs text-gray-400 dark:text-gray-500">PNG, JPG allowed</p>
          </div>
        ) : (
          <img src={preview} alt="Preview" className="h-32 object-contain" />
        )}
      </label>

      {/* Remove Button */}
      {preview && (
        <button
          onClick={() => {
            setPreview(null);
            setSelectedFile(null);
          }}
          className="text-red-500 dark:text-red-400 text-sm mt-3 hover:underline"
        >
          Remove Logo
        </button>
      )}

      {/* Save Button */}
      <button
        onClick={handleUpload}
        disabled={!selectedFile || loading}
        className="
          w-full mt-5 py-3 rounded-xl 
          bg-gray-600 dark:bg-gray-700 text-white font-semibold 
          hover:bg-gray-700 dark:hover:bg-gray-600
          disabled:bg-gray-300 dark:disabled:bg-gray-800
          transition
        "
      >
        {loading ? "Uploading..." : "Save Logo"}
      </button>
    </div>
  );
}
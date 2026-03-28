"use client";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { MdSave, MdInfo, MdContactPhone, MdShare } from "react-icons/md";

export default function FooterManager() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [footerData, setFooterData] = useState({
    about_text: "",
    address: "",
    phone: "",
    email: "",
    facebook_url: "",
    twitter_url: "",
    youtube_url: "",
    instagram_url: "",
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/admin/settings");
        const json = await res.json();
        if (json.success) {
          const data = json.data;
          setFooterData({
            about_text: data.about_text || "",
            address: data.address || "",
            phone: data.phone || "",
            email: data.email || "",
            facebook_url: data.facebook_url || "",
            twitter_url: data.twitter_url || "",
            youtube_url: data.youtube_url || "",
            instagram_url: data.instagram_url || "",
          });
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load footer settings");
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFooterData((prev) => ({ ...prev, [name]: value }));
  };

  const saveSetting = async (key, value) => {
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, value }),
      });
      return res.ok;
    } catch (err) {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Save each field as a separate setting for maximum flexibility
      const promises = Object.entries(footerData).map(([key, value]) =>
        saveSetting(key, value),
      );

      const results = await Promise.all(promises);

      if (results.every((res) => res)) {
        toast.success("Footer settings updated successfully!");
      } else {
        toast.warn("Some settings might not have saved correctly.");
      }
    } catch (err) {
      toast.error("Error saving settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return <div className="p-8 text-center">Loading footer settings...</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 mt-5">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Footer Content Manager</h1>
        <button
          onClick={handleSubmit}
          disabled={saving}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition shadow-md"
        >
          <MdSave size={20} />
          {saving ? "Saving..." : "Save All Changes"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* About Section */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-[#1e1e1e] p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-4 text-blue-600">
              <MdInfo size={24} />
              <h2 className="text-lg font-semibold">About Content</h2>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                About Text (Bengali)
              </label>
              <textarea
                name="about_text"
                value={footerData.about_text}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2 h-32"
                placeholder="আমাদের সম্পর্কে কিছু লিখুন..."
              />
            </div>
          </div>

          {/* Contact Section */}
          <div className="bg-white dark:bg-[#1e1e1e] p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-4 text-green-600">
              <MdContactPhone size={24} />
              <h2 className="text-lg font-semibold">Contact Information</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={footerData.address}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-4 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Phone
                </label>
                <input
                  type="text"
                  name="phone"
                  value={footerData.phone}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-4 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={footerData.email}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-4 py-2"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Social Links Section */}
        <div className="bg-white dark:bg-[#1e1e1e] p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-4 text-red-600">
            <MdShare size={24} />
            <h2 className="text-lg font-semibold">Social Media Links</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Facebook URL
              </label>
              <input
                type="url"
                name="facebook_url"
                value={footerData.facebook_url}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2"
                placeholder="https://facebook.com/..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Twitter URL
              </label>
              <input
                type="url"
                name="twitter_url"
                value={footerData.twitter_url}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2"
                placeholder="https://twitter.com/..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                YouTube URL
              </label>
              <input
                type="url"
                name="youtube_url"
                value={footerData.youtube_url}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2"
                placeholder="https://youtube.com/..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Instagram URL
              </label>
              <input
                type="url"
                name="instagram_url"
                value={footerData.instagram_url}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2"
                placeholder="https://instagram.com/..."
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";

export default function ChangePasswordForm() {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (formData.newPassword !== formData.confirmPassword) {
      return setError("নতুন পাসওয়ার্ড এবং কনফার্ম পাসওয়ার্ড মিলছে না!");
    }

    const res = await fetch("/api/auth/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.message || "পাসওয়ার্ড পরিবর্তন ব্যর্থ হয়েছে।");
    } else {
      setSuccess("পাসওয়ার্ড সফলভাবে পরিবর্তন হয়েছে!");
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
  };

  return (
    <div className="max-w-md mx-auto p-8 bg-white dark:bg-[#1e1e1e] rounded-xl shadow-lg border dark:border-gray-800 transition-colors">
      <h2 className="text-2xl font-bold mb-6 dark:text-gray-100">Change Password</h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Current Password */}
        <div>
          <label className="block mb-1.5 font-medium text-gray-700 dark:text-gray-300">বর্তমান পাসওয়ার্ড</label>
          <input
            type="password"
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleChange}
            className="w-full p-2.5 border dark:border-gray-700 rounded-lg dark:bg-[#121212] dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
        </div>

        {/* New Password */}
        <div>
          <label className="block mb-1.5 font-medium text-gray-700 dark:text-gray-300">নতুন পাসওয়ার্ড</label>
          <input
            type="password"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            className="w-full p-2.5 border dark:border-gray-700 rounded-lg dark:bg-[#121212] dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block mb-1.5 font-medium text-gray-700 dark:text-gray-300">কনফার্ম পাসওয়ার্ড</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full p-2.5 border dark:border-gray-700 rounded-lg dark:bg-[#121212] dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
        </div>

        {/* Error & Success Message */}
        {error && <p className="text-red-500 dark:text-red-400 text-sm font-medium">{error}</p>}
        {success && <p className="text-green-600 dark:text-green-400 text-sm font-medium">{success}</p>}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold shadow-sm"
        >
          Update Password
        </button>
      </form>
    </div>
  );
}
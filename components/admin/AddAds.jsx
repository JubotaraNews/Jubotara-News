"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { uploadToCloudinary } from "@/utils/utils";
import { toast } from "react-toastify";

import {
  useAddAdMutation,
  useUpdateAdMutation,
} from "@/app/redux/features/ads/adsApi";

export default function AddAds({ selectedAd, setSelectedAd }) {
  const [file, setFile] = useState(null);
  // If editing → use selectedAd data
  const initialForm = selectedAd || {
    title: "",
    image: "",
    link: "",
    position: "",
    startDate: "",
    endDate: "",
  };

  const [form, setForm] = useState(initialForm);

  const [addAd, { isLoading: isAdding }] = useAddAdMutation();
  const [updateAd, { isLoading: isUpdating }] = useUpdateAdMutation();

  // When switching between Add <-> Edit, reset form
  const resetForm = (ad) => {
    setForm(
      ad || {
        title: "",
        image: "",
        link: "",
        position: "",
        startDate: "",
        endDate: "",
      },
    );
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let imageUrl = form.image;

      // Upload file if a new one is selected
      if (file) {
        imageUrl = await uploadToCloudinary(file);
      }

      const adData = { ...form, image: imageUrl };

      if (selectedAd) {
        // UPDATE MODE
        await updateAd({ id: selectedAd._id, data: adData }).unwrap();
        toast.success("Ad updated successfully!");
      } else {
        // ADD MODE
        await addAd(adData).unwrap();
        toast.success("Ad added successfully!");
      }

      // Reset form
      resetForm(null);
      setSelectedAd(null);
      setFile(null);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong!");
    }
  };

  // When selectedAd changes from parent
  if (selectedAd && form._id !== selectedAd._id) {
    resetForm(selectedAd);
  }

  return (
    <div className="w-full max-w-2xl bg-white dark:bg-[#1e1e1e] shadow-lg rounded-xl p-8 border dark:border-gray-800 transition-colors">
      <h2 className="text-3xl font-bold text-center mb-6 text-gray-800 dark:text-gray-100">
        {selectedAd ? "Edit Advertisement" : "Add New Advertisement"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="text-gray-700 dark:text-gray-300 font-semibold mb-2 block">
            Ad Title
          </label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            className="border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 w-full dark:bg-[#121212] dark:text-white"
            required
          />
        </div>

        {/* Image */}
        <div>
          <label className="text-gray-700 dark:text-gray-300 font-semibold mb-2 block">
            Upload Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setFile(e.target.files[0]);
              }
            }}
            className="border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 dark:file:bg-blue-900/20 file:text-blue-700 dark:file:text-blue-400"
          />
          {form.image && !file && (
            <div className="mt-4">
              <Image
                src={form.image}
                alt="Ad"
                width={228}
                height={196}
                className="object-cover rounded border dark:border-gray-700"
              />
            </div>
          )}
        </div>

        {/* Link */}
        <div>
          <label className="text-gray-700 dark:text-gray-300 font-semibold mb-2 block">
            Redirect Link
          </label>
          <input
            type="text"
            name="link"
            value={form.link}
            onChange={handleChange}
            className="border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 w-full dark:bg-[#121212] dark:text-white"
            required
          />
        </div>

        {/* Position */}
        <div>
          <label className="text-gray-700 dark:text-gray-300 font-semibold mb-2 block">
            Ad Position
          </label>
          <select
            name="position"
            value={form.position}
            onChange={handleChange}
            className="border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 w-full dark:bg-[#121212] dark:text-white"
            required
          >
            <option value="" className="dark:bg-[#1e1e1e]">Select Position</option>
            <option value="sidebar" className="dark:bg-[#1e1e1e]">Sidebar</option>
            <option value="top-banner" className="dark:bg-[#1e1e1e]">Top Banner</option>
            <option value="bottom-banner" className="dark:bg-[#1e1e1e]">Bottom Banner</option>
          </select>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-gray-700 dark:text-gray-300 font-semibold mb-2 block">
              Start Date
            </label>
            <input
              type="date"
              name="startDate"
              value={form.startDate}
              onChange={handleChange}
              className="border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 w-full dark:bg-[#121212] dark:text-white"
              required
            />
          </div>

          <div>
            <label className="text-gray-700 dark:text-gray-300 font-semibold mb-2 block">
              End Date
            </label>
            <input
              type="date"
              name="endDate"
              value={form.endDate}
              onChange={handleChange}
              className="border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 w-full dark:bg-[#121212] dark:text-white"
              required
            />
          </div>
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            disabled={isAdding || isUpdating}
            className="bg-blue-600 text-white font-semibold px-8 py-3 rounded-lg shadow hover:bg-blue-700 transition disabled:opacity-50 dark:disabled:bg-gray-700"
          >
            {selectedAd
              ? isUpdating
                ? "Updating..."
                : "Update Advertisement"
              : isAdding
                ? "Adding..."
                : "Add Advertisement"}
          </button>
        </div>
      </form>
    </div>
  );
}
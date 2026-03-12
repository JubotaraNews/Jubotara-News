"use client";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Image from "next/image";
import { MdEdit, MdDelete, MdAdd, MdDragIndicator } from "react-icons/md";

const SECTIONS = [
  'উপদেষ্টা পরিষদ', 
  'পৃষ্ঠপোষক',
  'সম্পাদনা বিভাগ', 
  'রিপোর্টিং বিভাগ', 
  'ফটো ও ভিডিও বিভাগ', 
  'অনলাইন বিভাগ', 
  'জেলা প্রতিনিধি', 
  'উপজেলা প্রতিনিধি'
];

export default function TeamManagerPage() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentMemberId, setCurrentMemberId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    designation: "",
    image: "",
    section: SECTIONS[0],
    isHead: false,
    order: 0,
  });

  const fetchMembers = async () => {
    try {
      const res = await fetch("/api/team");
      const data = await res.json();
      if (res.ok) {
        setMembers(data.members || []);
      }
    } catch (err) {
      console.error("Failed to fetch members:", err);
      toast.error("Failed to load members");
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = isEditing ? `/api/team/${currentMemberId}` : "/api/team";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(isEditing ? "Member updated!" : "Member added!");
        resetForm();
        fetchMembers();
      } else {
        toast.error(data.message || "Something went wrong");
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (member) => {
    setIsEditing(true);
    setCurrentMemberId(member._id);
    setFormData({
      name: member.name,
      designation: member.designation,
      image: member.image,
      section: member.section,
      isHead: member.isHead,
      order: member.order,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this member?")) return;

    try {
      const res = await fetch(`/api/team/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Member deleted");
        fetchMembers();
      } else {
        toast.error("Failed to delete member");
      }
    } catch (err) {
      console.error("Error deleting member:", err);
      toast.error("An error occurred");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      designation: "",
      image: "",
      section: SECTIONS[0],
      isHead: false,
      order: 0,
    });
    setIsEditing(false);
    setCurrentMemberId(null);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Team Management</h1>
        {isEditing && (
          <button 
            onClick={resetForm}
            className="text-blue-600 hover:underline font-medium"
          >
            Cancel Editing & Add New
          </button>
        )}
      </div>

      {/* Form Section */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 mb-10">
        <h2 className="text-lg font-semibold mb-6 flex items-center">
          {isEditing ? <MdEdit className="mr-2" /> : <MdAdd className="mr-2" />}
          {isEditing ? "Edit Member" : "Add New Team Member"}
        </h2>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. তানভীর আহমেদ"
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none transition"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Designation</label>
              <input
                type="text"
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                placeholder="e.g. সম্পাদক ও প্রকাশক"
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none transition"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Section</label>
              <select
                name="section"
                value={formData.section}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none transition"
                required
              >
                {SECTIONS.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
              <input
                type="text"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none transition"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
                <input
                  type="number"
                  name="order"
                  value={formData.order}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none transition"
                />
              </div>
              <div className="flex items-end pb-2">
                <label className="flex items-center cursor-pointer select-none">
                  <input
                    type="checkbox"
                    name="isHead"
                    checked={formData.isHead}
                    onChange={handleChange}
                    className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
                  />
                  <span className="text-sm font-medium text-gray-700">Set as Head/Chief</span>
                </label>
              </div>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50 transition shadow-sm"
            >
              {loading ? "Processing..." : isEditing ? "Update Member" : "Add Member"}
            </button>
          </div>
        </form>
      </div>

      {/* List Section */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-lg font-semibold">Existing Members ({members.length})</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-600 text-xs uppercase font-bold">
              <tr>
                <th className="px-6 py-4">Member</th>
                <th className="px-6 py-4">Section</th>
                <th className="px-6 py-4">Order</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {members.length > 0 ? (
                members.map((member) => (
                  <tr key={member._id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-12 w-12 relative rounded-md overflow-hidden bg-gray-100 mr-4 border">
                          <Image
                            src={member.image}
                            alt={member.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-bold text-gray-900 flex items-center">
                            {member.name}
                            {member.isHead && (
                              <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] rounded-full">HEAD</span>
                            )}
                          </div>
                          <div className="text-sm text-gray-500">{member.designation}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {member.section}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {member.order}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(member)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="Edit"
                        >
                          <MdEdit size={20} />
                        </button>
                        <button
                          onClick={() => handleDelete(member._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Delete"
                        >
                          <MdDelete size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-10 text-center text-gray-500">
                    No team members found. Add one above!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

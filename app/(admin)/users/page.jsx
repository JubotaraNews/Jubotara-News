"use client";
import React from "react";
import { toast } from "react-toastify";
import Skeleton from "@/components/common/Skeleton";
import {
  useGetUsersQuery,
  useUpdateRoleMutation,
  useDeleteUserMutation,
} from "@/app/redux/features/user/userApi";

const UsersTableSkeleton = () => (
  <div className="bg-white shadow-md rounded-lg overflow-hidden animate-pulse">
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {[1, 2, 3, 4].map((i) => (
              <th key={i} className="px-6 py-3"><Skeleton className="h-4 w-20" /></th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {[1, 2, 3, 4, 5].map((i) => (
            <tr key={i}>
              <td className="px-6 py-4"><Skeleton className="h-4 w-32" /></td>
              <td className="px-6 py-4"><Skeleton className="h-4 w-48" /></td>
              <td className="px-6 py-4"><Skeleton className="h-8 w-24" /></td>
              <td className="px-6 py-4"><Skeleton className="h-4 w-16" /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default function UsersPage() {
  const { data, isLoading, isError } = useGetUsersQuery();
  const [updateRole] = useUpdateRoleMutation();
  const [deleteUser] = useDeleteUserMutation();

  const users = data?.users || [];

  const handleRoleChange = async (userId, newRole) => {
    try {
      await updateRole({ id: userId, role: newRole }).unwrap();
      toast.success("Role updated successfully!");
    } catch (err) {
      console.error("Failed to update role:", err);
      toast.error("Failed to update role");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      await deleteUser(userId).unwrap();
      toast.success("User deleted successfully!");
    } catch (err) {
      console.error("Failed to delete user:", err);
      toast.error("Failed to delete user");
    }
  };

  if (isLoading) return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Skeleton className="h-8 w-48 mb-6" />
      <UsersTableSkeleton />
    </div>
  );
  if (isError) return <div className="p-8 text-center text-red-500 font-bold">সার্ভার থেকে ব্যবহারকারী তথ্য আনতে ব্যর্থ হয়েছে।</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">User Management</h1>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.length === 0 ? (
                <tr><td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">No users found.</td></tr>
              ) : (
                users.map((user) => (
                  <tr key={user._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user._id, e.target.value)}
                        className="border rounded px-2 py-1"
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        onClick={() => handleDeleteUser(user._id)}
                        className="text-red-600 hover:text-red-900 font-semibold"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

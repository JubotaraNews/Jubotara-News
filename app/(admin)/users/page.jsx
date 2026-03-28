"use client";
import React from "react";
import { toast } from "react-toastify";
import Skeleton from "@/components/common/Skeleton";
import {
  useGetUsersQuery,
  useRegisterUserMutation,
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
              <th key={i} className="px-6 py-3">
                <Skeleton className="h-4 w-20" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {[1, 2, 3, 4, 5].map((i) => (
            <tr key={i}>
              <td className="px-6 py-4">
                <Skeleton className="h-4 w-32" />
              </td>
              <td className="px-6 py-4">
                <Skeleton className="h-4 w-48" />
              </td>
              <td className="px-6 py-4">
                <Skeleton className="h-8 w-24" />
              </td>
              <td className="px-6 py-4">
                <Skeleton className="h-4 w-16" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default function UsersPage() {
  const { data, isLoading, isError } = useGetUsersQuery();
  const [registerUser, { isLoading: isRegistering }] =
    useRegisterUserMutation();
  const [updateRole] = useUpdateRoleMutation();
  const [deleteUser] = useDeleteUserMutation();

  const [showAddForm, setShowAddForm] = React.useState(false);
  const [formData, setFormData] = React.useState({
    fullName: "",
    email: "",
    password: "",
    role: "user",
  });

  const users = data?.users || [];

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const response = await registerUser(formData).unwrap();
      const token = response?.user?.activationToken;
      if (token) {
        toast.success(`User created! Token: ${token}`);
        // Optionally copy it right away
        const link = `${window.location.origin}/activate?email=${formData.email}&token=${token}`;
        navigator.clipboard.writeText(link);
        toast.info("Activation link copied to clipboard!");
      } else {
        toast.success("User created successfully!");
      }
      setShowAddForm(false);
      setFormData({ fullName: "", email: "", password: "", role: "user" });
    } catch (err) {
      console.error("Failed to add user:", err);
      toast.error(err?.data?.message || "Failed to add user");
    }
  };

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

  const handleCopyToken = (token, email) => {
    const activationLink = `${window.location.origin}/activate?email=${email}&token=${token}`;
    navigator.clipboard.writeText(activationLink);
    toast.info("Activation link copied to clipboard!");
  };

  if (isLoading)
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Skeleton className="h-8 w-48 mb-6" />
        <UsersTableSkeleton />
      </div>
    );
  if (isError)
    return (
      <div className="p-8 text-center text-red-500 font-bold">
        সার্ভার থেকে ব্যবহারকারী তথ্য আনতে ব্যর্থ হয়েছে।
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 mt-5">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">User Management</h1>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-primary text-white px-4 py-2 rounded font-semibold hover:bg-primary/90 transition"
        >
          {showAddForm ? "Cancel" : "Add New User"}
        </button>
      </div>

      {showAddForm && (
        <div className="bg-white dark:bg-[#1e1e1e] border-gray-200 dark:border-gray-800 p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">
            Create New User (Reporter)
          </h2>
          <form
            onSubmit={handleAddUser}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Role
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              >
                <option value="user">User (Reporter)</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={isRegistering}
                className="w-full bg-green-600 text-white px-4 py-2 rounded font-semibold hover:bg-green-700 transition disabled:bg-green-400"
              >
                {isRegistering ? "Creating..." : "Create User"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-gray-800 shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Status/Token
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-[#1e1e1e] divide-y divide-gray-200 dark:divide-gray-800">
              {users.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400"
                  >
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                      {user.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      <select
                        value={user.role}
                        onChange={(e) =>
                          handleRoleChange(user._id, e.target.value)
                        }
                        className="border rounded px-2 py-1"
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.isActivated ? (
                        <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full font-semibold">
                          Active
                        </span>
                      ) : (
                        <div className="flex flex-col gap-1">
                          <span className="w-fit px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full font-semibold">
                            Pending
                          </span>
                          {user.activationToken && (
                            <button
                              onClick={() =>
                                handleCopyToken(
                                  user.activationToken,
                                  user.email,
                                )
                              }
                              className="text-[10px] text-blue-600 hover:underline text-left"
                            >
                              Copy Activation Link
                            </button>
                          )}
                        </div>
                      )}
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

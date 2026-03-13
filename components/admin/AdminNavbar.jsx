"use client";
import React, { useState } from "react";
import { signOut } from "next-auth/react";
import {
  MdLogout,
  MdMenu,
  MdKeyboardArrowDown,
} from "react-icons/md";
import Logo from "@/components/common/Header/Logo";

const AdminNavbar = ({ onMenuClick }) => {
  const [adminMenu, setAdminMenu] = useState(false);

  return (
    <header className="w-full bg-white shadow-sm border-b fixed top-0 left-0 z-50 lg:pl-64 h-16 transition-all duration-300">
      <div className="flex justify-between items-center h-full px-4 sm:px-6">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg lg:hidden"
          >
            <MdMenu size={24} />
          </button>
          <div className="lg:hidden">
             <Logo />
          </div>
          <h1 className="hidden sm:block text-lg font-semibold text-gray-800">
            Admin Dashboard
          </h1>
        </div>

        <div className="relative">
          <button
            onClick={() => setAdminMenu(!adminMenu)}
            className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
              A
            </div>
            <span className="hidden md:block font-medium text-gray-700">Admin</span>
            <MdKeyboardArrowDown className={`transition-transform duration-200 ${adminMenu ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown */}
          {adminMenu && (
            <>
              <div className="fixed inset-0 z-0" onClick={() => setAdminMenu(false)}></div>
              <div className="absolute right-0 mt-2 w-48 bg-white shadow-xl rounded-lg border py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="flex items-center space-x-2 w-full px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition"
                >
                  <MdLogout className="w-5 h-5" />
                  <span>লগ আউট</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default AdminNavbar;

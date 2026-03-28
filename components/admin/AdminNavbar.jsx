"use client";
import React, { useState, useEffect } from "react";
import { signOut } from "next-auth/react";
import { MdLogout, MdMenu, MdKeyboardArrowDown } from "react-icons/md";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import Logo from "@/components/common/Header/Logo";

const AdminNavbar = ({ onMenuClick }) => {
  const [adminMenu, setAdminMenu] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="w-full bg-white dark:bg-[#1e1e1e] shadow-sm border-b dark:border-gray-800 fixed top-0 left-0 z-50 lg:pl-64 h-16 transition-all duration-300">
      <div className="flex justify-between items-center h-full px-4 sm:px-6">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg lg:hidden transition-colors"
          >
            <MdMenu size={24} />
          </button>
          <div className="lg:hidden">
            <Logo />
          </div>
          <h1 className="hidden sm:block text-lg font-semibold text-gray-800 dark:text-gray-100">
            Admin Dashboard
          </h1>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          )}

          <div className="relative">
            <button
              onClick={() => setAdminMenu(!adminMenu)}
              className="flex items-center space-x-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <div className="w-8 h-8 bg-blue-600 dark:bg-blue-700 rounded-full flex items-center justify-center text-white font-bold">
                A
              </div>
              <span className="hidden md:block font-medium text-gray-700 dark:text-gray-300">
                Admin
              </span>
              <MdKeyboardArrowDown
                className={`transition-transform duration-200 ${adminMenu ? "rotate-180" : ""}`}
              />
            </button>

            {/* Dropdown */}
            {adminMenu && (
              <>
                <div
                  className="fixed inset-0 z-0"
                  onClick={() => setAdminMenu(false)}
                ></div>
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#1e1e1e] shadow-xl rounded-lg border dark:border-gray-800 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="flex items-center space-x-2 w-full px-4 py-3 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
                  >
                    <MdLogout className="w-5 h-5" />
                    <span>লগ আউট</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminNavbar;

"use client";
import React from "react";
import Link from "next/link";

const SettingSidebar = ({ activeTab, tabs }) => {
  return (
    <aside className="w-64 p-4 h-auto hidden md:block">
      <h2 className="text-2xl font-bold mb-6 dark:text-gray-100">Settings</h2>
      <nav className="flex flex-col gap-2">
        {tabs.map((tab) => (
          <Link
            key={tab.id}
            href={tab.href}
            className={`text-left px-4 py-2 rounded transition-colors ${
              activeTab === tab.id 
                ? "bg-blue-200 dark:bg-blue-800 text-blue-900 dark:text-blue-100 font-semibold shadow-sm" 
                : "text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-800"
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default SettingSidebar;
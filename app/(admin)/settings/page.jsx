"use client";
import React, { useState } from "react";
import SettingSidebar from "@/components/admin/settings/SettingSidebar";
import ChangeLogo from "@/components/admin/settings/logo/ChangeLogo";
import LogoList from "@/components/admin/settings/logo/LogoList";
import ChangePasswordForm from "@/components/admin/ChangePasswordForm";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("logo");

  const tabs = [
    { id: "logo", label: "Logo Settings", href: "#logo" },
    { id: "password", label: "Change Password", href: "#password" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row gap-8 mt-5">
      <aside className="w-full md:w-64">
        <h2 className="text-2xl font-bold mb-6">Settings</h2>
        <nav className="flex flex-col gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`text-left px-4 py-2 rounded hover:bg-blue-100 dark:hover:bg-gray-800 transition-colors ${activeTab === tab.id ? "bg-blue-200 dark:bg-blue-700 font-semibold" : ""}`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </aside>

      <main className="flex-1 bg-white dark:bg-[#1e1e1e] p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700">
        {activeTab === "logo" && (
          <div className="space-y-8">
            <ChangeLogo />
            <hr />
            <h3 className="text-xl font-semibold">Available Logos</h3>
            <LogoList />
          </div>
        )}
        {activeTab === "password" && <ChangePasswordForm />}
      </main>
    </div>
  );
}

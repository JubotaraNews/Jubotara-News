"use client";
import React, { useState } from "react";
import AdminNavbar from "./AdminNavbar";
import AdminSidebar from "./AdminSidebar";
import AdminFooter from "./AdminFooter";
import { Providers } from "@/provider/provider";

export default function AdminLayoutClient({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <Providers>
      <div className="flex min-h-screen">
        <AdminSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        
        <div className="flex-1 flex flex-col min-h-screen lg:pl-64 transition-all duration-300">
          <AdminNavbar onMenuClick={() => setIsSidebarOpen(true)} />
          <main className="flex-1 pt-20 p-4 md:p-6 lg:p-8">
            {children}
          </main>
          <AdminFooter />
        </div>
      </div>
    </Providers>
  );
}

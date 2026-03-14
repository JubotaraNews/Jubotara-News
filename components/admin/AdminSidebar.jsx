"use client";
import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  MdDashboard,
  MdArticle,
  MdCategory,
  MdPeople,
  MdLogout,
  MdMenu,
  MdClose,
  MdSettings,
  MdAdsClick,
  MdVideoLibrary,
} from "react-icons/md";
import { signOut, useSession } from "next-auth/react";
import Logo from "@/components/common/Header/Logo";

const NAV_LINKS = [
  {
    id: 1,
    label: "Dashboard",
    icon: MdDashboard,
    href: "/dashboard",
    roles: ["admin", "user"],
  },
  {
    id: 2,
    label: "Add News",
    icon: MdArticle,
    href: "/addnews",
    roles: ["admin", "user"],
  },
  {
    id: 3,
    label: "News List",
    icon: MdCategory,
    href: "/newslist",
    roles: ["admin", "user"],
  },
  {
    id: 4,
    label: "Videos",
    icon: MdVideoLibrary,
    href: "/videos",
    roles: ["admin", "user"],
  },
  {
    id: 12,
    label: "EPaper",
    icon: MdArticle,
    href: "/epaper-manager",
    roles: ["admin"],
  },
  { id: 5, label: "ADS", icon: MdAdsClick, href: "/ads", roles: ["admin"] },
  { id: 6, label: "Users", icon: MdPeople, href: "/users", roles: ["admin"] },
  {
    id: 11,
    label: "Team Manager",
    icon: MdPeople,
    href: "/teammanager",
    roles: ["admin"],
  },
  {
    id: 7,
    label: "Add Category",
    icon: MdSettings,
    href: "/addCategory",
    roles: ["admin"],
  },
  {
    id: 8,
    label: "Nav Manager",
    icon: MdMenu,
    href: "/navmanager",
    roles: ["admin"],
  },
  {
    id: 9,
    label: "Footer Manager",
    icon: MdSettings,
    href: "/footermanager",
    roles: ["admin"],
  },
  {
    id: 10,
    label: "Settings",
    icon: MdSettings,
    href: "/settings",
    roles: ["admin"],
  },
];

const AdminSidebar = ({ isOpen, setIsOpen }) => {
  const pathname = usePathname();
  const { data: session } = useSession();
  const userRole = session?.user?.role || "user";

  const filteredLinks = NAV_LINKS.filter((link) =>
    link.roles.includes(userRole),
  );

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 z-500 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <Logo />
          <button
            className="p-1 lg:hidden text-gray-500 hover:text-blue-600"
            onClick={() => setIsOpen(false)}
          >
            <MdClose size={24} />
          </button>
        </div>

        <nav className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-120px)]">
          {filteredLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.id}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition duration-200 ${
                  isActive
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-gray-600 hover:bg-gray-100 hover:text-blue-600"
                }`}
              >
                <Icon size={20} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 w-full p-4 border-t bg-white">
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex items-center space-x-3 px-4 py-3 w-full text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition"
          >
            <MdLogout size={20} />
            <span>লগ আউট</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;

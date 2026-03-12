"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getCategories } from "@/lib/api-client";
import { useSession } from "next-auth/react";
import {
  Home,
  Globe,
  Newspaper,
  Menu,
  X,
  Facebook,
  Twitter,
  Youtube,
  ChevronRight,
  YoutubeIcon,
  User,
} from "lucide-react";

export default function MobileBottomNav({ news_categories }) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const data = await getCategories();
      setCategories(data);
    };
    fetchCategories();
  }, []);

  const navItems = [
    { name: "হোম", icon: <Home size={22} />, path: "/" },
    { name: "সারাদেশ", icon: <Globe size={22} />, path: "/category/সারাদেশ" },
    {
      name: "রাজনীতি",
      icon: <Newspaper size={22} />,
      path: "/category/রাজনীতি",
    },
    { name: "ভিডিও", icon: <YoutubeIcon size={25} />, path: "/video" },
    // { name: 'অনুসন্ধান', icon: <Search size={22} />, path: '/search' },
  ];

  // Close menu when path changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Drawer Overlay */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-60 transition-opacity duration-300 md:hidden ${
          isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsMenuOpen(false)}
      />

      {/* Category Drawer */}
      <div
        className={`fixed inset-y-0 left-0 w-[85%] max-w-sm bg-white z-70 shadow-2xl transition-transform duration-500 ease-out md:hidden flex flex-col ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Drawer Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white text-black">
          <div>
            <h2 className="text-lg font-black">যুবতারা নিউজ</h2>
            <p className="text-base opacity-80">সর্বশেষ সংবাদ ও বিনোদন</p>
          </div>
          <button
            onClick={() => setIsMenuOpen(false)}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-black/10 hover:bg-black/20 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Categories Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          <p className="text-lg font-bold text-gray-700 uppercase tracking-widest mb-2 ">
            বিভাগসমূহ
          </p>
          {news_categories?.map((cat) => (
            <Link
              key={cat?.id}
              href={`/category/${cat?.slug}`}
              className="flex items-center justify-between gap-4 p-1 rounded-xl hover:bg-[#eff3f6] transition-all group"
            >
              <span className="font-bold text-gray-500 group-hover:text-primary transition-colors">
                {cat?.name}
              </span>
              <span className="w-8 h-8  flex items-center justify-center text-gray-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                <ChevronRight size={16} />
              </span>
            </Link>
          ))}

          <div className="pt-6 border-t border-gray-100 mt-2 space-y-2">
            {session ? (
              <Link
                href="/dashboard"
                className="flex items-center gap-2 text-gray-600 font-bold hover:text-primary transition-colors group"
              >
                <User
                  size={20}
                  className="text-gray-400 group-hover:text-primary"
                />{" "}
                ড্যাশবোর্ড
              </Link>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-2 text-gray-600 font-bold hover:text-primary transition-colors group"
              >
                <User
                  size={20}
                  className="text-gray-400 group-hover:text-primary"
                />{" "}
                লগইন
              </Link>
            )}
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="p-6 bg-[#eff3f6] border-t border-gray-100">
          <div className="flex gap-4 justify-center">
            <a
              href="#"
              className="w-10 h-10 rounded-full bg-[#1877F2] text-white flex items-center justify-center transition-transform hover:scale-110"
            >
              <Facebook size={20} />
            </a>
            <a
              href="#"
              className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center transition-transform hover:scale-110"
            >
              <Twitter size={20} />
            </a>
            <a
              href="#"
              className="w-10 h-10 rounded-full bg-[#FF0000] text-white flex items-center justify-center transition-transform hover:scale-110"
            >
              <Youtube size={20} />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white backdrop-blur-xl border-t border-gray-100 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] pb-safe">
        <div className="flex items-center justify-between h-16 px-2 max-w-lg mx-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-all duration-300 ${
                  isActive ? "text-primary" : "text-black hover:text-primary"
                }`}
              >
                <div
                  className={`${isActive ? "scale-110 drop-shadow-[0_0_8px_rgba(238,29,35,0.4)]" : ""}`}
                >
                  {item.icon}
                </div>
                <span
                  className={`text-[10px] font-black tracking-tight ${isActive ? "opacity-100" : "opacity-80"}`}
                >
                  {item.name}
                </span>
              </Link>
            );
          })}

          {/* Menu Trigger */}
          <button
            onClick={() => setIsMenuOpen(true)}
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-all duration-300 ${
              isMenuOpen ? "text-primary" : "text-black hover:text-primary"
            }`}
          >
            <div
              className={`${isMenuOpen ? "scale-110 rotate-90" : ""} transition-transform`}
            >
              <Menu size={22} />
            </div>
            <span className="text-[10px] font-black tracking-tight opacity-80">
              মেনু
            </span>
          </button>
        </div>
      </nav>
    </>
  );
}

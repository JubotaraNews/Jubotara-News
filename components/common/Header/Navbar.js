"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const Navbar = ({ news_categories }) => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="relative">
      {/* Desktop Navbar */}
      <div className="hidden lg:flex items-center ">
        <ul className="flex items-start">
          {news_categories?.map((item) => (
            <li key={item?.id} className="relative group">
              <Link
                href={item.href}
                className={`px-3 py-4 text-[13px] sm:text-sm md:text-xl font-semibold tracking-wide transition-colors duration-200 flex items-center gap-1 ${
                  pathname === item.href
                    ? "text-black underline decoration-2 underline-offset-8"
                    : "text-black hover:text-black/80"
                }`}
              >
                {item?.name}
              </Link>
            </li>
          ))}
          <li className="relative group">
            <Link
              href={`/video`}
              className={`px-3 py-4 text-[13px] sm:text-sm md:text-xl font-semibold tracking-wide transition-colors duration-200 flex items-center gap-1 ${
                pathname === "/video"
                  ? "text-white underline decoration-2 underline-offset-8"
                  : "text-white/90 hover:text-white"
              }`}
            >
              ভিডিও
            </Link>
          </li>
        </ul>
      </div>

      {/* Mobile Navbar Toggle */}
      <div className="lg:hidden flex items-center py-3">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-white focus:outline-none p-2"
          aria-label="Toggle menu"
        >
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
            ></path>
          </svg>
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 top-15 bg-secondary z-100 p-6 lg:hidden overflow-y-auto">
          <ul className="flex flex-col gap-5">
            {news_categories?.map((item) => (
              <li key={item?.id} className="flex flex-col gap-3 group">
                <Link
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`text-2xl font-black flex items-center justify-between ${
                    pathname === item.href
                      ? "text-white"
                      : "text-white/70 hover:text-white"
                  }`}
                >
                  {item?.name}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/video"
                onClick={() => setIsOpen(false)}
                className={`text-2xl font-black ${
                  pathname === "/video" ? "text-white" : "text-white/70"
                }`}
              >
                ভিডিও
              </Link>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

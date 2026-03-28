"use client";

import { useEffect, useState } from "react";
import Search from "../Search";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

export default function HeaderActions() {
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [language, setLanguage] = useState("bn");

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "bn" ? "en" : "bn"));
  };

  return (
    <div className="flex items-center gap-4">
      <Search />

      <div className="flex items-center gap-2 md:gap-4">
        {mounted && (
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-200 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        )}

        <div className="flex items-center gap-4">
          {session ? (
            <Link
              href="/dashboard"
              className="text-black dark:text-white font-bold text-xs sm:text-sm md:text-lg hover:underline whitespace-nowrap"
            >
              {language === "bn" ? "ড্যাশবোর্ড" : "Dashboard"}
            </Link>
          ) : (
            <Link
              href="/login"
              className="text-black dark:text-white font-bold text-xs sm:text-sm md:text-lg hover:underline whitespace-nowrap"
            >
              {language === "bn" ? "লগইন" : "Log In"}
            </Link>
          )}
        </div>

        {/* <button
          onClick={toggleLanguage}
          className="bg-[#EE1D23] text-white px-3 sm:px-4 py-1 sm:py-1.5 font-bold text-xs sm:text-sm hover:bg-red-700 transition-colors uppercase hidden sm:block"
        >
          {language === "bn" ? "English" : "বাংলা"}
        </button> */}
      </div>
    </div>
  );
}

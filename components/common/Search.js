"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

const Search = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  const fetchResults = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(
        `/api/news/search?q=${encodeURIComponent(query)}`,
      );
      const data = await res.json();
      if (data.success) {
        setResults(data.data);
        setIsOpen(data.data.length > 0);
      }
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsLoading(false);
    }
  }, [query]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim()) {
        fetchResults();
      } else {
        setResults([]);
        setIsOpen(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, fetchResults]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
      setIsOpen(false);
    } else {
      inputRef.current?.focus();
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <form onSubmit={handleSearch} className="flex items-center">
        <div className="relative group">
          <input
            type="search"
            placeholder="খুঁজুন..."
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() =>
              query.trim() && results.length > 0 && setIsOpen(true)
            }
            className="w-0 group-hover:w-20 sm:group-hover:w-42 focus:w-24 sm:focus:w-44 transition-all duration-300 bg-transparent border-b border-black dark:border-white text-black dark:text-white text-sm focus:outline-none placeholder-black/50 dark:placeholder-white/50 py-1"
          />
          <button
            type="submit"
            className="p-2 text-black dark:text-white hover:text-black/80 dark:hover:text-white/80 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </div>
      </form>

      {/* Results Dropdown */}
      {isOpen && (
        <div className="fixed sm:absolute top-16 sm:top-full left-1/2 -translate-x-1/2 sm:left-auto sm:right-0 sm:translate-x-0 mt-2 w-[90vw] sm:w-96 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 shadow-xl rounded-lg overflow-hidden z-[100]">
          <div className="max-h-96 overflow-y-auto">
            {results.map((item) => (
              <Link
                key={item.id}
                href={`/news/${item.slug}`}
                onClick={() => setIsOpen(false)}
                className="flex gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 border-b border-gray-100 dark:border-gray-800 last:border-0 transition-colors group"
              >
                <div className="relative w-16 h-12 shrink-0">
                  <Image
                    src={item.featured_image || "/placeholder.png"}
                    alt={item.name}
                    fill
                    className="object-cover rounded"
                  />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200 line-clamp-2 group-hover:text-red-600 transition-colors">
                    {item.name}
                  </h4>
                  <span className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {item.category}
                  </span>
                </div>
              </Link>
            ))}
          </div>
          <button
            onClick={handleSearch}
            className="w-full py-2 bg-gray-50 dark:bg-gray-800 text-[#003366] dark:text-blue-400 text-xs font-bold hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border-t border-gray-200 dark:border-gray-700"
          >
            সব ফলাফল দেখুন ({query})
          </button>
        </div>
      )}

      {isLoading && query.trim() && !isOpen && (
        <div className="fixed sm:absolute top-16 sm:top-full left-1/2 -translate-x-1/2 sm:left-auto sm:right-0 sm:translate-x-0 mt-2 w-10 h-10 flex items-center justify-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#003366] dark:border-blue-400"></div>
        </div>
      )}
    </div>
  );
};

export default Search;

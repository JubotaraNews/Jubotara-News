"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Navbar = ({ news_categories }) => {
  const pathname = usePathname();

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
                    ? "text-black dark:text-white underline decoration-2 underline-offset-8"
                    : "text-black dark:text-white hover:text-black/80 dark:hover:text-white/80"
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
                  ? "text-black dark:text-white underline decoration-2 underline-offset-8"
                  : "text-black/90 dark:text-white/90 hover:text-black dark:hover:text-white"
              }`}
            >
              ভিডিও
            </Link>
          </li>
          <li className="relative group">
            <Link
              href={`/epaper`}
              className={`px-3 py-4 text-[13px] sm:text-sm md:text-xl font-semibold tracking-wide transition-colors duration-200 flex items-center gap-1 ${
                pathname === "/epaper"
                  ? "text-black dark:text-white underline decoration-2 underline-offset-8"
                  : "text-black/90 dark:text-white/90 hover:text-black dark:hover:text-white"
              }`}
            >
              ই-পেপার
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;

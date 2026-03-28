export default function AdminFooter() {
  return (
    <footer className="w-full py-6 bg-white dark:bg-[#1e1e1e] text-center text-sm text-gray-600 dark:text-gray-400 border-t dark:border-gray-800 transition-colors mt-auto">
      <p className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2">
        <span>
          © {new Date().getFullYear()} Jubotara News. All rights reserved.
        </span>
        <span className="hidden sm:inline text-gray-300 dark:text-gray-700">|</span>
        <span className="flex items-center gap-1">
          Built with <span className="text-red-500">♥</span> by{" "}
          <a
            href="https://github.com/ShahriarX2"
            className="text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 font-semibold transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            ShahriarX2
          </a>
        </span>
      </p>
    </footer>
  );
}
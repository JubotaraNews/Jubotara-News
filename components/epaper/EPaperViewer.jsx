"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  MdZoomIn,
  MdZoomOut,
  MdNavigateNext,
  MdNavigateBefore,
} from "react-icons/md";
import HotspotModal from "./HotspotModal";
import { useRouter } from "next/navigation";

export default function EPaperViewer({ edition }) {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [isZoomed, setIsZoomed] = useState(false);
  const [selectedHotspot, setSelectedHotspot] = useState(null);

  const pages = edition.pages || [];
  const currentPageData =
    pages.find((p) => p.pageNumber === currentPage) || pages[0];

  const handleNext = () => {
    if (currentPage < pages.length) {
      setCurrentPage(currentPage + 1);
      resetView();
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      resetView();
    }
  };

  const resetView = () => {
    setZoom(1);
    setIsZoomed(false);
  };

  const toggleZoom = (e) => {
    // Prevent zoom toggle if a hotspot was clicked
    if (e && e.target.closest(".hotspot-area")) return;

    if (zoom === 1) {
      setZoom(2.5);
      setIsZoomed(true);
    } else {
      resetView();
    }
  };

  const handleHotspotClick = (hs, e) => {
    e.stopPropagation();
    if (hs.type === "link" && hs.linkUrl) {
      router.push(hs.linkUrl);
    } else {
      setSelectedHotspot(hs);
    }
  };

  useEffect(() => {
    resetView();
  }, [currentPage]);

  return (
    <div className="flex flex-col lg:flex-row gap-8 min-h-[80vh]">
      {/* Sidebar: Thumbnail Strip */}
      <div className="lg:w-1/4 xl:w-1/5 order-2 lg:order-1">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 sticky top-24">
          <h3 className="font-bold text-gray-900 mb-4 border-b pb-2 text-lg">
            পাতাগুলো
          </h3>
          <div className="grid grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
            {pages.map((page) => (
              <button
                key={page.pageNumber}
                onClick={() => setCurrentPage(page.pageNumber)}
                className={`relative aspect-[3/4] rounded-lg overflow-hidden border-2 transition-all ${
                  currentPage === page.pageNumber
                    ? "border-red-600 shadow-lg scale-95"
                    : "border-transparent hover:border-gray-300"
                }`}
              >
                <Image
                  src={page.imageUrl}
                  alt={`Page ${page.pageNumber}`}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/10 hover:bg-transparent transition-colors" />
                <div className="absolute bottom-0 left-0 w-full bg-red-600/90 text-white text-[10px] font-bold text-center py-1">
                  পাতা {page.pageNumber}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content: Viewer */}
      <div className="lg:w-3/4 xl:w-4/5 order-1 lg:order-2 space-y-4">
        {/* Controls */}
        <div className="bg-white dark:bg-[#1e1e1e] p-3 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-4">
            <button
              onClick={handlePrev}
              disabled={currentPage === 1}
              className={`p-2 rounded-full transition-colors dark:text-gray-300 dark:hover:bg-gray-800 ${
                currentPage === 1
                  ? "text-gray-300 dark:text-gray-600 cursor-not-allowed"
                  : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              <MdNavigateBefore size={32} />
            </button>
            <span className="font-bold text-gray-900 dark:text-gray-100 text-lg">
              {currentPage} / {pages.length}
            </span>
            <button
              onClick={handleNext}
              disabled={currentPage === pages.length}
              className={`p-2 rounded-full transition-colors dark:text-gray-300 dark:hover:bg-gray-800 ${
                currentPage === pages.length
                  ? "text-gray-300 dark:text-gray-600 cursor-not-allowed"
                  : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              <MdNavigateNext size={32} />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleZoom}
              className="p-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors hidden md:block"
              title={isZoomed ? "Zoom Out" : "Zoom In"}
            >
              {isZoomed ? <MdZoomOut size={28} /> : <MdZoomIn size={28} />}
            </button>
            <div className="h-8 w-[1px] bg-gray-200 mx-2 hidden md:block" />
            <div className="text-xs font-bold text-gray-400 uppercase hidden md:block">
              সংবাদ পড়তে ছবির ওপর ক্লিক করুন
            </div>
          </div>
        </div>

        {/* Image Display Container */}
        <div
          className={`relative bg-gray-200 rounded-2xl overflow-auto border shadow-inner transition-all duration-300 ${
            isZoomed
              ? "cursor-zoom-out h-[85vh]"
              : "cursor-zoom-in h-auto max-h-[85vh]"
          }`}
          onClick={toggleZoom}
        >
          <div
            className="relative transition-transform duration-300 origin-top"
            style={{
              transform: `scale(${zoom})`,
              width: "100%",
              minHeight: isZoomed ? "100%" : "auto",
            }}
          >
            {/* The actual page image */}
            <img
              src={currentPageData.imageUrl}
              alt={`Page ${currentPage}`}
              className={`w-full h-auto mx-auto shadow-2xl ${isZoomed ? "" : "object-contain"}`}
            />

            {/* Hotspot Overlays */}
            <div className="absolute inset-0 pointer-events-none">
              {currentPageData.hotspots?.map((hs, i) => (
                <div
                  key={i}
                  className="hotspot-area absolute border-2 border-transparent hover:border-red-500/50 hover:bg-red-500/10 transition-all cursor-pointer pointer-events-auto group"
                  style={{
                    left: `${hs.coords.x}%`,
                    top: `${hs.coords.y}%`,
                    width: `${hs.coords.width}%`,
                    height: `${hs.coords.height}%`,
                  }}
                  onClick={(e) => handleHotspotClick(hs, e)}
                  title={hs.title || "বিস্তারিত পড়ুন"}
                >
                  {/* Hover Indicator */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-red-600 text-white p-1 rounded-full shadow-lg">
                      {hs.type === "link" ? (
                        <MdNavigateNext size={16} />
                      ) : (
                        <MdZoomIn size={16} />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-blue-50 text-blue-700 p-4 rounded-xl text-center font-bold text-sm md:hidden">
          যেকোনো সংবাদের ওপর ক্লিক করে বিস্তারিত পড়ুন।
        </div>
      </div>

      {/* Detail View Modal */}
      {selectedHotspot && (
        <HotspotModal
          hotspot={selectedHotspot}
          onClose={() => setSelectedHotspot(null)}
        />
      )}
    </div>
  );
}

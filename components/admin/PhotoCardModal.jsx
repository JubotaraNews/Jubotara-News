"use client";

import React, { useState, useRef } from "react";
import NewsPhotoCard from "./NewsPhotoCard";
import { domToPng } from "modern-screenshot";
import { MdClose, MdDownload } from "react-icons/md";

const PhotoCardModal = ({ news, logoUrl, onClose }) => {
  const [headline, setHeadline] = useState(news.headline);
  const [category, setCategory] = useState(news.category);
  const [commentText, setCommentText] = useState("বিস্তারিত কমেন্টে");
  const [accentColor, setAccentColor] = useState("#D9232D");
  const [imageScale, setImageScale] = useState(1);
  const [isDownloading, setIsDownloading] = useState(false);
  const cardRef = useRef(null);

  const date = new Date(news.createdAt).toLocaleDateString("bn-BD", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setIsDownloading(true);
    try {
      const dataUrl = await domToPng(cardRef.current, {
        quality: 1,
        scale: 2,
      });
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `news-card-${news._id}.png`;
      link.click();
    } catch (error) {
      console.error("Download error:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row">
        {/* Left: Preview */}
        <div className="flex-1 bg-gray-100 p-6 flex items-center justify-center border-b md:border-b-0 md:border-r">
          <div className="w-full max-w-[400px]">
            <h3 className="text-sm font-bold text-gray-500 mb-4 uppercase tracking-wider text-center">Live Preview</h3>
            <NewsPhotoCard 
              headline={headline}
              category={category}
              imageSrc={news.imageSrc}
              logoUrl={logoUrl}
              date={date}
              commentText={commentText}
              accentColor={accentColor}
              imageScale={imageScale}
              isPreview={true}
            />
          </div>
        </div>

        {/* Right: Customization Controls */}
        <div className="w-full md:w-[400px] p-8 flex flex-col h-full overflow-y-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800">Customize Card</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition text-gray-500">
              <MdClose size={24} />
            </button>
          </div>

          <div className="space-y-6 flex-1">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 uppercase">Headline</label>
              <textarea 
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-blue-500 focus:ring-0 transition h-32 text-lg font-medium"
                placeholder="Enter headline..."
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 uppercase">Category</label>
              <input 
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-blue-500 focus:ring-0 transition font-medium"
                placeholder="Enter category..."
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 uppercase">Center Text (Bottom Bar)</label>
              <input 
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-blue-500 focus:ring-0 transition font-medium"
                placeholder="e.g. বিস্তারিত কমেন্টে"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 uppercase">Theme Color</label>
              <div className="flex gap-4 items-center">
                <input 
                  type="color"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="w-16 h-16 rounded-xl cursor-pointer border-2 border-gray-200"
                />
                <input 
                  type="text"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="flex-1 border-2 border-gray-200 p-3 rounded-xl focus:border-blue-500 focus:ring-0 transition font-mono"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-bold text-gray-700 uppercase">Image Zoom</label>
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">{(imageScale * 100).toFixed(0)}%</span>
              </div>
              <div className="flex gap-4 items-center">
                <input 
                  type="range"
                  min="1"
                  max="3"
                  step="0.01"
                  value={imageScale}
                  onChange={(e) => setImageScale(parseFloat(e.target.value))}
                  className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <button 
                  onClick={() => setImageScale(1)}
                  className="text-xs font-bold text-gray-400 hover:text-red-500 transition"
                >
                  RESET
                </button>
              </div>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t">
            <button 
              onClick={handleDownload}
              disabled={isDownloading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition shadow-lg shadow-blue-200 disabled:bg-blue-400"
            >
              {isDownloading ? (
                <span className="animate-pulse">Generating...</span>
              ) : (
                <>
                  <MdDownload size={24} />
                  Download PNG
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Hidden high-res card for capture */}
      <NewsPhotoCard 
        cardRef={cardRef}
        headline={headline}
        category={category}
        imageSrc={news.imageSrc}
        logoUrl={logoUrl}
        date={date}
        commentText={commentText}
        accentColor={accentColor}
        imageScale={imageScale}
        isPreview={false}
      />
    </div>
  );
};

export default PhotoCardModal;

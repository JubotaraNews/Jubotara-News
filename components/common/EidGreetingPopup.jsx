'use client';

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const EidGreetingPopup = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Show popup after a short delay
    const hasSeenPopup = sessionStorage.getItem('eid_greeting_seen');
    if (!hasSeenPopup) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const closePopup = () => {
    setIsOpen(false);
    sessionStorage.setItem('eid_greeting_seen', 'true');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative w-full max-w-lg bg-white overflow-hidden rounded-3xl shadow-2xl animate-in zoom-in-95 duration-300">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-500 via-orange-500 to-red-500"></div>
        
        {/* Close Button */}
        <button 
          onClick={closePopup}
          className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors z-10"
        >
          <X size={20} />
        </button>

        <div className="p-8 text-center">
          {/* Icon/Image Placeholder - Festive Look */}
          <div className="mb-6 inline-flex items-center justify-center w-28 h-28 rounded-full bg-red-50 text-red-600 relative">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-16 h-16">
              <path d="M12 3c.132 0 .263 0 .393.007a9 9 0 0 0 7.515 13.524A9.001 9.001 0 1 1 12 3z" />
            </svg>
            <div className="absolute -top-1 -right-1">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-yellow-500 animate-pulse">
                <path d="M12 2L14.4 9.6H22L15.8 14.2L18.2 21.8L12 17.2L5.8 21.8L8.2 14.2L2 9.6H9.6L12 2Z" />
              </svg>
            </div>
          </div>

          <h2 className="text-4xl font-bold text-red-700 mb-4">
            ঈদ মোবারক!
          </h2>
          
          <div className="space-y-4 text-gray-700 text-lg leading-relaxed">
            <p>
              পবিত্র ঈদুল ফিতর উপলক্ষ্যে <span className="font-bold text-red-600">যুবতারা নিউজের</span> সকল পাঠক, বিজ্ঞাপনদাতা ও শুভানুধ্যায়ীদের জানাই আন্তরিক শুভেচ্ছা ও ঈদ মোবারক।
            </p>
            <p className="text-base text-gray-500 italic">
              আপনার ঈদ হোক আনন্দময় ও উৎসবমুখর।
            </p>
          </div>

          <button
            onClick={closePopup}
            className="mt-8 w-full py-3.5 px-6 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-red-200 active:scale-95"
          >
            ধন্যবাদ
          </button>
        </div>

        {/* Bottom Decorative Pattern */}
        <div className="h-12 bg-red-50 flex items-center justify-center overflow-hidden">
          <div className="flex space-x-4 opacity-20">
            {[...Array(6)].map((_, i) => (
              <svg key={i} width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-red-600">
                <path d="M12 2L14.4 9.6H22L15.8 14.2L18.2 21.8L12 17.2L5.8 21.8L8.2 14.2L2 9.6H9.6L12 2Z" />
              </svg>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EidGreetingPopup;

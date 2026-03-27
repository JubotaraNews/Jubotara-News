"use client";

import React, { useState, useEffect } from "react";

const ReadingProgressBar = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      // Calculate scroll percentage
      const docElement = document.documentElement;
      const bodyElement = document.body;
      const docHeight = docElement.scrollHeight - docElement.clientHeight;
      const scrolled = (window.scrollY / docHeight) * 100;
      setProgress(Math.min(scrolled, 100));
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className="fixed top-0 left-0 h-1 bg-gradient-to-r from-primary via-secondary to-primary z-50 transition-all duration-300"
      style={{ width: `${progress}%` }}
    />
  );
};

export default ReadingProgressBar;

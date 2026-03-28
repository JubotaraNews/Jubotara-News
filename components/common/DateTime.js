"use client";
import { useState, useEffect } from "react";

const DateTime = () => {
  const [dateTime, setDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setDateTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const formatBengaliDate = (date) => {
    return date.toLocaleDateString("bn-BD", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatBengaliTime = (date) => {
    return date.toLocaleTimeString("bn-BD", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-3">
      <span>{formatBengaliDate(dateTime)}</span>
      <span className="hidden sm:inline border-l border-gray-300 dark:border-gray-700 h-4 mx-1"></span>
      <span className="hidden sm:inline">{formatBengaliTime(dateTime)}</span>
    </div>
  );
};

export default DateTime;

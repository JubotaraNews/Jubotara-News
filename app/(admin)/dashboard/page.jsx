"use client";
import React, { useEffect, useState } from "react";
import {
  MdArticle,
  MdPeople,
  MdAdsClick,
  MdVideoLibrary,
} from "react-icons/md";
import MetricCard from "@/components/admin/MetricCard";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    news: 0,
    users: 0,
    ads: 0,
    videos: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const res = await fetch("/api/admin/metrics");
        const json = await res.json();
        if (json.success) {
          setStats(json.data);
        }
      } catch (error) {
        console.error("Failed to fetch metrics:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMetrics();
  }, []);

  const metricCards = [
    {
      title: "Total News",
      value: stats.news,
      icon: MdArticle,
      color: "blue-500",
      trend: 0,
    },
    {
      title: "Total Users",
      value: stats.users,
      icon: MdPeople,
      color: "green-500",
      trend: 0,
    },
    {
      title: "Active Ads",
      value: stats.ads,
      icon: MdAdsClick,
      color: "purple-500",
      trend: 0,
    },
    {
      title: "Videos",
      value: stats.videos,
      icon: MdVideoLibrary,
      color: "red-500",
      trend: 0,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 mt-5">
      <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metricCards.map((stat, index) => (
          <MetricCard
            key={index}
            title={stat.title}
            value={loading ? "..." : stat.value}
            icon={stat.icon}
            color={stat.color}
            trend={stat.trend}
          />
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-[#1e1e1e] p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700">
          <h2 className="text-lg font-semibold mb-4">Recent News Activity</h2>
          <p className="text-gray-500">Activity graph or list will go here.</p>
        </div>
        <div className="bg-white dark:bg-[#1e1e1e] p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700">
          <h2 className="text-lg font-semibold mb-4">User Activity</h2>
          <p className="text-gray-500">User engagement metrics will go here.</p>
        </div>
      </div>
    </div>
  );
}

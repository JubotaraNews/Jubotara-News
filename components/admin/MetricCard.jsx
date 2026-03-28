import React, { FC } from "react";

const MetricCard = ({
  title,
  value,
  icon: IconComponent,
  color,
  trend,
  footer,
}) => {
  const textColor = `text-${color}`;
  const bgSoft = `bg-${color.replace("500", "100")}`;
  const bgIcon = `bg-${color}/10`;
  const ringIcon = `ring-${color}/30`;

  const trendColor =
    trend && trend > 0
      ? "text-green-600"
      : trend && trend < 0
        ? "text-red-600"
        : "text-gray-500";

  return (
    <div className="p-6 bg-white dark:bg-[#1e1e1e] rounded-xl shadow-md border border-gray-100 dark:border-gray-800 hover:shadow-xl transition duration-300 group">
      <div className="flex items-center justify-between">
        {/* Icon Wrapper */}
        <div
          className={`flex items-center justify-center w-12 h-12 rounded-xl ${bgIcon} ${textColor} ring-4 ${ringIcon} group-hover:scale-105 transition`}
        >
          <IconComponent className="w-6 h-6" />
        </div>

        {/* Numeric Value */}
        <div className="text-right">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{title}</p>
          <p className={`mt-1 text-3xl font-bold tracking-tight ${textColor} dark:brightness-125`}>
            {value}
          </p>
        </div>
      </div>

      {/* Trend Section */}
      {trend !== undefined && (
        <div className="mt-4 flex items-center space-x-2">
          <span className={`text-sm font-semibold ${trendColor} dark:brightness-125`}>
            {trend > 0
              ? `▲ ${trend}%`
              : trend < 0
                ? `▼ ${Math.abs(trend)}%`
                : "0%"}
          </span>
          <span className="text-xs text-gray-400 dark:text-gray-500">vs last month</span>
        </div>
      )}

      {/* Optional Footer */}
      {footer && (
        <div
          className={`mt-4 p-2 rounded-lg text-xs font-medium ${bgSoft} ${textColor} dark:bg-opacity-20`}
        >
          {footer}
        </div>
      )}
    </div>
  );
};

export default MetricCard;

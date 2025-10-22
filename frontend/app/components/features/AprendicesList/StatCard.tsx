"use client";

import React from "react";

interface StatCardProps {
  icon: React.ElementType;
  color?: "blue" | "green" | "red" | "yellow";
  value: number | string;
  label: string;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  icon: Icon,
  color = "blue",
  value,
  label,
  className = "",
}) => {
  const colorVariants = {
    blue: {
      bg: "bg-blue-100 dark:bg-blue-900/30",
      text: "text-blue-600 dark:text-blue-400",
    },
    green: {
      bg: "bg-green-100 dark:bg-green-900/30",
      text: "text-green-600 dark:text-green-400",
    },
    red: {
      bg: "bg-red-100 dark:bg-red-900/30",
      text: "text-red-600 dark:text-red-400",
    },
    yellow: {
      bg: "bg-yellow-100 dark:bg-yellow-900/30",
      text: "text-yellow-600 dark:text-yellow-400",
    },
  };

  const colors = colorVariants[color] || colorVariants.blue;

  return (
    <div
      className={`p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md ${className}`}
    >
      <div className="flex items-center space-x-4">
        <div
          className={`w-12 h-12 ${colors.bg} rounded-lg flex items-center justify-center`}
        >
          <Icon className={`w-6 h-6 ${colors.text}`} />
        </div>
        <div className="flex-1">
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {value}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">{label}</p>
        </div>
      </div>
    </div>
  );
};

export default StatCard;

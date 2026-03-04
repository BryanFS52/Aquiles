"use client";

import React from "react";
import { IconType } from "react-icons";
import { HiSparkles } from "react-icons/hi";

interface StatCardProps {
  icon: IconType;
  title: string;
  value: string | number;
  gradientFrom: string;
  gradientTo: string;
  iconColor: string;
  sparkleColor: string;
}

const StatCard: React.FC<StatCardProps> = ({
  icon: Icon,
  title,
  value,
  gradientFrom,
  gradientTo,
  iconColor,
  sparkleColor,
}) => {
  return (
    <div className="group relative">
      <div className={`absolute inset-0 bg-gradient-to-r ${gradientFrom} ${gradientTo} rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-300`}></div>
      <div className="relative bg-white dark:bg-shadowBlue p-6 rounded-2xl shadow-lg border border-lightGray dark:border-darkGray hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 ${iconColor}/10 dark:${iconColor}/20 rounded-xl`}>
            <Icon className={`w-6 h-6 ${iconColor}`} />
          </div>
          <HiSparkles className={`w-5 h-5 ${sparkleColor} opacity-60`} />
        </div>
        <h3 className="text-sm font-medium text-darkGray dark:text-grayText uppercase tracking-wide">
          {title}
        </h3>
        <p className="text-2xl font-bold text-black dark:text-white mt-1 line-clamp-2">
          {value}
        </p>
      </div>
    </div>
  );
};

export default StatCard;

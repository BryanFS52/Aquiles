"use client";

import React from "react";

interface StatCardProps {
    title: string;
    value: number;
    icon: React.ReactNode;
    borderColor: string;
    bgColor: string;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon, borderColor, bgColor }) => {
    return (
        <div className={`bg-white p-6 rounded-2xl shadow-lg border-l-4 ${borderColor} hover:shadow-xl transition-shadow`}>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-darkGray mb-1">{title}</p>
                    <p className="text-3xl font-bold text-secondary">{value}</p>
                </div>
                <div className={`${bgColor} p-3 rounded-xl`}>
                    {icon}
                </div>
            </div>
        </div>
    );
};
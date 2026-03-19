"use client";

import React from "react";

interface StatCardProps {
    title: string;
    value: number;
    icon?: React.ReactNode; // Hacemos el icono opcional
    borderColor: string;
    bgColor?: string; // Hacemos bgColor opcional ya que no lo usaremos
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, borderColor }) => {
    // Función para obtener el color de borde correcto para modo oscuro (exactamente igual que StatsCards)
    const getDarkBorderColor = (borderColor: string) => {
        if (borderColor.includes('border-primary')) return 'dark:border-primary';
        if (borderColor.includes('border-lightGreen')) return 'dark:border-lightGreen';
        if (borderColor.includes('border-green')) return 'dark:border-green-500';
        if (borderColor.includes('border-yellow')) return 'dark:border-yellow-500';
        return 'dark:border-gray-500';
    };

    return (
        <div className={`bg-white dark:bg-shadowBlue p-4 sm:p-5 rounded-xl shadow-md border-l-4 ${borderColor} ${getDarkBorderColor(borderColor)}`}>
            <p className="text-xs sm:text-sm text-darkGray dark:text-gray-300">{title}</p>
            <p className="text-xl sm:text-2xl font-bold text-secondary dark:text-white">{value}</p>
        </div>
    );
};
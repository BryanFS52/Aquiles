"use client";

import React from "react";
import { IconType } from "react-icons";

interface StatCardProps {
  icon: IconType;
  label: string;
  value: number;
  bgColor: string;
  iconColor: string;
  textColor: string;
}

const StatCard: React.FC<StatCardProps> = ({
  icon: Icon,
  label,
  value,
  bgColor,
  iconColor,
  textColor,
}) => {
  return (
    <div className="group relative overflow-hidden">
      {/* Card principal con gradiente */}
      <div className={`${bgColor} rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 relative z-10`}>
        {/* Efecto de brillo superior */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
        
        {/* Efecto de brillo en hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="relative flex flex-col space-y-3">
          
          {/* Icono con efecto glassmorphism */}
          <div className="flex items-center justify-between">
            <div className={`${iconColor} p-2.5 rounded-xl bg-white/25 backdrop-blur-sm shadow-md transform group-hover:scale-105 group-hover:rotate-3 transition-all duration-300`}>
              <Icon className="text-2xl" />
            </div>
            
            {/* Badge decorativo */}
            <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <div className="w-4 h-4 rounded-full bg-white/30"></div>
            </div>
          </div>
          
          {/* Contenido */}
          <div className="space-y-1">
            <p className={`text-xs font-semibold ${textColor} opacity-90 uppercase tracking-wide`}>
              {label}
            </p>
            <div className="flex items-baseline space-x-2">
              <p className={`text-3xl font-black ${textColor} tracking-tight`}>
                {value}
              </p>
              <div className="flex flex-col">
                <div className="h-0.5 w-6 bg-white/40 rounded-full"></div>
                <div className="h-0.5 w-4 bg-white/30 rounded-full mt-0.5"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Patrón decorativo de fondo */}
        <div className="absolute bottom-0 right-0 w-20 h-20 opacity-10">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="2" className={`${textColor}`} />
            <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="2" className={`${textColor}`} />
            <circle cx="50" cy="50" r="20" fill="none" stroke="currentColor" strokeWidth="2" className={`${textColor}`} />
          </svg>
        </div>
      </div>

      {/* Sombra de color debajo de la card */}
      <div className={`absolute inset-0 ${bgColor} rounded-xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300 -z-10 scale-95`}></div>
    </div>
  );
};

export default StatCard;

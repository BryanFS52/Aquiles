"use client";

import React from "react";
import { FaUsers, FaCheckCircle, FaTimesCircle, FaClock } from "react-icons/fa";

interface FichaData {
  id: string;
  numeroFicha: string;
  totalAprendices: number;
  justificacionesPendientes: number;
  justificacionesAprobadas: number;
  justificacionesRechazadas: number;
}

interface InfoCardProps {
  ficha: FichaData;
  onClick: () => void;
}

const InfoCard: React.FC<InfoCardProps> = ({ ficha, onClick }) => {
  const totalJustificaciones = ficha.justificacionesPendientes + ficha.justificacionesAprobadas + ficha.justificacionesRechazadas;

  return (
    <div
      onClick={onClick}
      className="min-h-[580px] min-w-[420px] pr-5 group cursor-pointer"
    >
      <div className="w-full h-full rounded-xl sm:rounded-2xl overflow-hidden bg-white dark:bg-dark-card hover:shadow-lg dark:hover:bg-dark-cardHover transition-all duration-300 border border-lightGray dark:border-dark-border flex flex-col transform hover:-translate-y-1 hover:scale-[1.02] relative">
        {/* Overlay con gradiente en hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-lightGreen/5 dark:from-shadowBlue/10 dark:to-darkBlue/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        {/* Header con número de ficha */}
        <div className="relative p-6 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="bg-gradient-to-r from-primary to-lightGreen dark:from-shadowBlue dark:to-darkBlue text-white px-5 py-2.5 rounded-full text-sm font-bold text-center sm:text-left shadow-md">
              Ficha N° {ficha.numeroFicha}
            </div>
            <div className="flex items-center justify-center sm:justify-end space-x-2">
              <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
              <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-blue-100 text-blue-700 border border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800">
                {totalJustificaciones} Total
              </span>
            </div>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="relative px-6 pb-6 flex-1 flex flex-col">
          <div className="space-y-5 flex-1">
            {/* Total Aprendices - Destacado */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-shadowBlue/50 dark:to-shadowBlue/30 rounded-xl p-5 shadow-sm">
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-2.5 h-2.5 bg-primary dark:bg-lightGreen rounded-full"></div>
                <span className="text-sm font-semibold text-grayText dark:text-dark-textSecondary uppercase tracking-wide">Total Aprendices</span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-white dark:bg-dark-card rounded-lg shadow-sm">
                  <FaUsers className="text-primary dark:text-lightGreen text-3xl" />
                </div>
                <p className="font-extrabold text-black dark:text-dark-text text-4xl">
                  {ficha.totalAprendices}
                </p>
              </div>
            </div>

            {/* Grid de estadísticas - Más espaciado */}
            <div className="grid grid-cols-1 gap-4">
              {/* Pendientes */}
              <div className="flex items-center justify-between py-4 px-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border-l-4 border-yellow-500 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                    <FaClock className="text-yellow-600 dark:text-yellow-400 text-xl" />
                  </div>
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Pendientes
                  </span>
                </div>
                <span className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                  {ficha.justificacionesPendientes}
                </span>
              </div>

              {/* Aprobadas */}
              <div className="flex items-center justify-between py-4 px-4 bg-green-50 dark:bg-green-900/20 rounded-xl border-l-4 border-green-500 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <FaCheckCircle className="text-green-600 dark:text-green-400 text-xl" />
                  </div>
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Aprobadas
                  </span>
                </div>
                <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {ficha.justificacionesAprobadas}
                </span>
              </div>

              {/* Rechazadas */}
              <div className="flex items-center justify-between py-4 px-4 bg-red-50 dark:bg-red-900/20 rounded-xl border-l-4 border-red-500 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                    <FaTimesCircle className="text-red-600 dark:text-red-400 text-xl" />
                  </div>
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Rechazadas
                  </span>
                </div>
                <span className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {ficha.justificacionesRechazadas}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer - Más prominente */}
        <div className="relative px-6 py-5 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-shadowBlue/30 dark:to-shadowBlue/20 border-t border-gray-200 dark:border-dark-border mt-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-primary to-lightGreen dark:from-shadowBlue dark:to-darkBlue rounded-full flex items-center justify-center shadow-md">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <span className="text-sm font-bold text-gray-700 dark:text-dark-textSecondary">
                Justificaciones
              </span>
            </div>
            <div className="flex items-center space-x-2 text-primary dark:text-lightGreen group-hover:translate-x-1 transition-transform">
              <span className="text-sm font-semibold">Ver detalles</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoCard;

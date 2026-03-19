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
  onClick: (statusFilter?: "all" | "Aprobada" | "Pendiente" | "Rechazada") => void;
  viewMode?: "grid" | "list";
}

const InfoCard: React.FC<InfoCardProps> = ({ ficha, onClick, viewMode = "grid" }) => {
  const totalJustificaciones = ficha.justificacionesPendientes + ficha.justificacionesAprobadas + ficha.justificacionesRechazadas;

  // Vista de lista compacta
  if (viewMode === "list") {
    return (
      <div className="group bg-white dark:bg-shadowBlue rounded-lg p-4 hover:shadow-md transition-all duration-200 border border-gray-200 dark:border-white hover:border-blue-300 dark:hover:border-blue-500">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 flex-1">
            <div 
              onClick={() => onClick()}
              className="cursor-pointer bg-gradient-to-r from-primary to-lightGreen dark:from-shadowBlue dark:to-darkBlue text-white px-4 py-2 rounded-lg text-sm font-bold hover:shadow-lg transition-all"
            >
              Ficha N° {ficha.numeroFicha}
            </div>
            <div className="flex items-center space-x-2">
              <FaUsers className="text-primary dark:text-lightGreen text-lg" />
              <span className="font-semibold text-gray-800 dark:text-white">{ficha.totalAprendices} aprendices</span>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            {/* Estadísticas compactas */}
            <div className="flex items-center space-x-4 text-sm">
              <button
                onClick={() => onClick("Aprobada")}
                className="flex items-center space-x-1 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg px-2 py-1 transition-colors cursor-pointer"
                title="Ver solo aprobadas"
              >
                <FaCheckCircle className="text-green-500" />
                <span className="text-green-600 dark:text-green-400 font-semibold">{ficha.justificacionesAprobadas}</span>
              </button>
              <button
                onClick={() => onClick("Pendiente")}
                className="flex items-center space-x-1 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 rounded-lg px-2 py-1 transition-colors cursor-pointer"
                title="Ver solo pendientes"
              >
                <FaClock className="text-yellow-500" />
                <span className="text-yellow-600 dark:text-yellow-400 font-semibold">{ficha.justificacionesPendientes}</span>
              </button>
              <button
                onClick={() => onClick("Rechazada")}
                className="flex items-center space-x-1 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg px-2 py-1 transition-colors cursor-pointer"
                title="Ver solo rechazadas"
              >
                <FaTimesCircle className="text-red-500" />
                <span className="text-red-600 dark:text-red-400 font-semibold">{ficha.justificacionesRechazadas}</span>
              </button>
            </div>

            <button
              onClick={() => onClick()}
              className="text-primary dark:text-lightGreen group-hover:translate-x-1 transition-transform">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Vista de grid compacta
  return (
    <div className="group cursor-pointer h-full">
      <div className="h-full rounded-xl overflow-hidden bg-white dark:bg-shadowBlue hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-white flex flex-col transform hover:-translate-y-1 hover:scale-[1.02] relative min-h-[320px]">
        {/* Header con número de ficha */}
        <div className="relative p-4 pb-3">
          <div className="flex flex-col gap-3">
            <button
              onClick={() => onClick()}
              className="bg-gradient-to-r from-primary to-lightGreen dark:from-shadowBlue dark:to-darkBlue text-white px-3 py-2 rounded-full text-xs font-bold text-center shadow-md hover:shadow-lg transition-all"
            >
              Ficha N° {ficha.numeroFicha}
            </button>
            <div className="flex items-center justify-center">
              <span className="text-xs font-semibold px-2 py-1 rounded-full bg-blue-100 text-blue-700 border border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800">
                {totalJustificaciones} Total
              </span>
            </div>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="relative px-4 pb-4 flex-1 flex flex-col">
          <div className="space-y-3 flex-1">
            {/* Total Aprendices - Compacto */}
            <div className="bg-white dark:bg-shadowBlue rounded-lg p-3 shadow-sm">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-1.5 h-1.5 bg-primary dark:bg-lightGreen rounded-full"></div>
                <span className="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">Total aprendices</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white dark:bg-shadowBlue rounded-lg shadow-sm">
                  <FaUsers className="text-primary dark:text-lightGreen text-xl" />
                </div>
                <p className="font-extrabold text-black dark:text-white text-2xl">
                  {ficha.totalAprendices}
                </p>
              </div>
            </div>

            {/* Grid de estadísticas compactas */}
            {/* Aprobadas */}
            <button
              onClick={() => onClick("Aprobada")}
              className="w-full flex items-center justify-between py-2 px-3 bg-green-50 dark:bg-green-900/20 rounded-lg border-l-2 border-green-500 shadow-sm transition-all hover:shadow-md hover:bg-green-100 dark:hover:bg-green-900/30"
              title="Ver solo aprobadas"
            >
              <div className="flex items-center space-x-2">
                <FaCheckCircle className="text-green-600 dark:text-green-400 text-sm" />
                <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                  Aprobadas
                </span>
              </div>
              <span className="text-lg font-bold text-green-600 dark:text-green-400">
                {ficha.justificacionesAprobadas}
              </span>
            </button>
            <div className="grid grid-cols-1 gap-2">
              {/* Pendientes */}
              <button
                onClick={() => onClick("Pendiente")}
                className="w-full flex items-center justify-between py-2 px-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border-l-2 border-yellow-500 shadow-sm transition-all hover:shadow-md hover:bg-yellow-100 dark:hover:bg-yellow-900/30"
                title="Ver solo pendientes"
              >
                <div className="flex items-center space-x-2">
                  <FaClock className="text-yellow-600 dark:text-yellow-400 text-sm" />
                  <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                    Pendientes
                  </span>
                </div>
                <span className="text-lg font-bold text-yellow-600 dark:text-yellow-400">
                  {ficha.justificacionesPendientes}
                </span>
              </button>
              {/* Rechazadas */}
              <button
                onClick={() => onClick("Rechazada")}
                className="w-full flex items-center justify-between py-2 px-3 bg-red-50 dark:bg-red-900/20 rounded-lg border-l-2 border-red-500 shadow-sm transition-all hover:shadow-md hover:bg-red-100 dark:hover:bg-red-900/30"
                title="Ver solo rechazadas"
              >
                <div className="flex items-center space-x-2">
                  <FaTimesCircle className="text-red-600 dark:text-red-400 text-sm" />
                  <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                    Rechazadas
                  </span>
                </div>
                <span className="text-lg font-bold text-red-600 dark:text-red-400">
                  {ficha.justificacionesRechazadas}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer compacto */}
        <div className="relative px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-shadowBlue/30 dark:to-shadowBlue/20 border-t border-gray-200 dark:border-white mt-auto">
          <button
            onClick={() => onClick()}
            className="w-full flex items-center justify-between hover:bg-white dark:hover:bg-shadowBlue rounded-lg p-2 transition-all"
          >
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gradient-to-r from-primary to-lightGreen dark:from-shadowBlue dark:to-darkBlue rounded-full flex items-center justify-center shadow-md">
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
                Justificaciones
              </span>
            </div>
            <div className="flex items-center space-x-1 text-primary dark:text-lightGreen group-hover:translate-x-1 transition-transform">
              <span className="text-xs font-semibold">Ver</span>
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default InfoCard;

"use client";

import React, { useEffect } from "react";
import { AlertTriangle, X } from "lucide-react";

interface ModalEliminarTeamProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ModalEliminarTeam: React.FC<ModalEliminarTeamProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md px-4 sm:px-6 transition-all duration-300"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md sm:max-w-lg bg-white rounded-3xl shadow-2xl border border-gray-100 transform transition-all duration-300 scale-100 hover:scale-[1.02] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header con gradiente sutil */}
        <div className="bg-gradient-to-r from-red-50 to-orange-50 p-6 sm:p-8 border-b border-gray-100">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/80 transition-colors duration-200 group"
          >
            <X className="w-5 h-5 text-gray-500 group-hover:text-gray-700" />
          </button>

          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
              <AlertTriangle className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800 text-center leading-tight">
              ¿Eliminar este team?
            </h1>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="p-6 sm:p-8">
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6">
            <p className="text-sm sm:text-base text-amber-800 text-center leading-relaxed">
              Esta acción es <span className="font-semibold">irreversible</span>. Toda la información y el progreso relacionados con el team se perderán permanentemente.
            </p>
          </div>

          {/* Botones con diseño mejorado */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 sm:py-3.5 text-base font-medium text-gray-700 bg-white border-2 border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-6 py-3 sm:py-3.5 text-base font-medium text-white bg-gradient-to-r from-red-600 to-red-700 rounded-xl hover:from-red-700 hover:to-red-800 transform hover:scale-[1.02] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 shadow-lg hover:shadow-xl"
            >
              Eliminar Team
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalEliminarTeam;

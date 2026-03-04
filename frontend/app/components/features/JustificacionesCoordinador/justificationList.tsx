"use client";

import React from "react";
import { FaCheckCircle, FaTimesCircle, FaClock, FaFileAlt } from "react-icons/fa";

interface Justification {
  id: string;
  aprendiz: string;
  documento: string;
  fechaAusencia: string;
  fechaJustificacion: string;
  tipo: string;
  estado: "Pendiente" | "Aprobada" | "Rechazada";
  motivo: string;
}

interface JustificationListProps {
  justifications: Justification[];
}

const JustificationList: React.FC<JustificationListProps> = ({ justifications }) => {
  const getStatusIcon = (estado: string) => {
    switch (estado) {
      case "Aprobada":
        return <FaCheckCircle className="text-green-500 text-xl" />;
      case "Rechazada":
        return <FaTimesCircle className="text-red-500 text-xl" />;
      case "Pendiente":
        return <FaClock className="text-yellow-500/90 text-xl" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (estado: string) => {
    switch (estado) {
      case "Aprobada":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "Rechazada":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      case "Pendiente":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  if (justifications.length === 0) {
    return (
      <div className="text-center py-12">
        <FaFileAlt className="mx-auto text-gray-400 text-6xl mb-4" />
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          No hay justificaciones registradas para esta ficha
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {justifications.map((justification) => (
        <div
          key={justification.id}
          className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-5 hover:shadow-lg transition-shadow duration-200 border border-gray-200 dark:border-gray-600"
        >
          <div className="flex items-start justify-between">
            {/* Información del aprendiz */}
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-3">
                <div className="bg-blue-100 dark:bg-blue-900/30 rounded-full p-2">
                  {getStatusIcon(justification.estado)}
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 dark:text-white">
                    {justification.aprendiz}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Doc: {justification.documento}
                  </p>
                </div>
              </div>

              {/* Detalles */}
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    Fecha de Ausencia
                  </p>
                  <p className="text-sm font-medium text-gray-800 dark:text-white">
                    {formatDate(justification.fechaAusencia)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    Fecha de Justificación
                  </p>
                  <p className="text-sm font-medium text-gray-800 dark:text-white">
                    {formatDate(justification.fechaJustificacion)}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="mb-3">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    Tipo de Justificación
                    </p>
                    <p className="text-sm font-medium text-gray-800 dark:text-white">
                    {justification.tipo}
                    </p>
                </div>

                <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    Motivo
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                    {justification.motivo}
                    </p>
                </div>
              </div>
            </div>

            {/* Estado */}
            <div className="ml-4">
              <span
                className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${getStatusBadge(
                  justification.estado
                )}`}
              >
                {justification.estado}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default JustificationList;

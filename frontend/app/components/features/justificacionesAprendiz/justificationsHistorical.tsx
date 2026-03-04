"use client"

import { useState } from "react";
import { motion } from "framer-motion";
import { FaCheckCircle, FaClock, FaFileAlt, FaRegFileAlt, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { MdHistory } from "react-icons/md";
import { Justification } from "@graphql/generated";
import DownloadButton from "@components/UI/DownloadButton";

interface JustificationsHistoricalProps {
  data: Justification[];
  loading: boolean;
}

const JustificationsHistorical: React.FC<
  JustificationsHistoricalProps
> = ({data, loading}) => {
  // Estado para la paginación
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 6;

  // Ordenar justificaciones por fecha de ausencia (más reciente primero)
  const sortedData = [...data].sort((a, b) => {
    // Función para convertir DD/MM/YYYY a Date
    const parseDate = (dateString?: string | null) => {
      if (!dateString) return new Date(0);
      
      const parts = dateString.split('/');
      if (parts.length === 3) {
        const day = parseInt(parts[0]);
        const month = parseInt(parts[1]) - 1; // Los meses van de 0-11
        const year = parseInt(parts[2]);
        return new Date(year, month, day);
      }
      
      // Fallback si no es formato DD/MM/YYYY
      return new Date(dateString);
    };

    const dateA = parseDate(a.absenceDate || undefined);
    const dateB = parseDate(b.absenceDate || undefined);
    
    return dateB.getTime() - dateA.getTime(); // Descendente (más reciente primero)
  });

  // Calcular datos de paginación
  const totalItems = sortedData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = sortedData.slice(startIndex, endIndex);

  // Funciones de navegación
  const goToNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToPage = (page: number) => {
    if (page >= 0 && page < totalPages) {
      setCurrentPage(page);
    }
  };

  const getStatusColor = (estado: string) => {
    const estadoLower = estado.toLowerCase();
    if (estadoLower.includes("aprobad") || estadoLower.includes("aceptad") || estadoLower.includes("activ")) {
      return "text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30";
    } else if (estadoLower.includes("rechazad") || estadoLower.includes("denegad") || estadoLower.includes("inactiv")) {
      return "text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30";
    } else {
      return "text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30";
    }
  };

  const getStatusIcon = (estado: string) => {
    const estadoLower = estado.toLowerCase();
    if (estadoLower.includes("aprobad") || estadoLower.includes("aceptad") || estadoLower.includes("activ")) {
      return <FaCheckCircle className="w-4 h-4" />;
    } else {
      return <FaClock className="w-4 h-4" />;
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-5xl bg-white dark:bg-[#002033]"
    >
      <div className="bg-white dark:bg-[#002033] p-0">
        <div className="flex items-center mb-4 sm:mb-6">
          <div className="bg-gradient-to-r dark:from-secondary dark:to-blue-900 from-primary to-lime-500 p-2 sm:p-3 rounded-full shadow-lg flex-shrink-0">
            <MdHistory className="text-xl sm:text-2xl text-white" />
          </div>
          <div className="ml-3 sm:ml-4 min-w-0">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-200 truncate">
              Historial de Justificaciones
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm truncate">
              Historico de tus justificaciones
            </p>
          </div>
        </div>
        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 -mx-3 sm:mx-0">
          <table className="w-full text-xs sm:text-sm text-left text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 min-h-[300px] sm:min-h-[350px] md:min-h-[400px] max-h-[400px]">
            <thead className="text-xs uppercase bg-gray-50 dark:bg-gray-700 text-black dark:text-white">
              <tr>
                <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 font-medium">Tipo de Novedad</th>
                <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 font-medium hidden sm:table-cell">Fecha de Ausencia</th>
                <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 font-medium hidden md:table-cell">Fecha de Justificación</th>
                <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 font-medium">Archivo</th>
                <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 font-medium">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {loading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-3 sm:px-6 py-6 sm:py-8 text-center text-darkGray dark:text-lightGray"
                  >
                    <div className="flex flex-col items-center">
                      <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-black dark:border-white"></div>
                      <p className="text-sm sm:text-base md:text-lg font-medium mt-3 sm:mt-4">
                        Cargando justificaciones...
                      </p>
                    </div>
                  </td>
                </tr>
              ) : !sortedData || sortedData.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-3 sm:px-6 py-6 sm:py-8 text-center text-darkGray dark:text-lightGray"
                  >
                    <div className="flex flex-col items-center">
                      <FaRegFileAlt className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 mb-3 sm:mb-4 opacity-50" />
                      <p className="text-sm sm:text-base md:text-lg font-medium mb-1 sm:mb-2">
                        No hay justificaciones
                      </p>
                      <p className="text-xs sm:text-sm">
                        Aún no has enviado ninguna justificación.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                currentData.map(
                  (
                    justification: Justification,
                    index: number
                  ) => (
                    <motion.tr
                      key={justification.id ?? `just-${index}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4">
                        <div className="flex items-center line-clamp-2">
                          {justification.justificationType?.name || 'N/A'}
                        </div>
                      </td>
                      <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 hidden sm:table-cell">
                        <div className="flex items-center whitespace-nowrap">
                          {justification.absenceDate || 'N/A'}
                        </div>
                      </td>
                      <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 hidden md:table-cell">
                        <div className="flex items-center whitespace-nowrap">
                          {justification.justificationDate || 'N/A'}
                        </div>
                      </td>
                      <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4">
                        <div className="flex items-center space-x-2">
                          <DownloadButton
                            fileBase64={justification.justificationFile || undefined}
                            mimeType="application/pdf"
                            fileName={`justificacion_${justification.absenceDate?.replace(/\//g, '-')}_${justification.justificationType?.name || 'novedad'}.pdf`}
                            variant="icon"
                            iconSize="md"
                          />
                        </div>
                      </td>
                      <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4">
                        <div className="flex flex-col space-y-1 items-start">
                          <span
                            className={`inline-flex items-center px-2 sm:px-2.5 py-1 sm:py-1.5 text-xs font-semibold rounded-full whitespace-nowrap ${getStatusColor(
                              justification.justificationStatus?.name || "En Proceso"
                            )}`}
                          >
                            {getStatusIcon(
                              justification.justificationStatus?.name || "En Proceso"
                            )}
                            <span className="ml-1">
                              {justification.justificationStatus?.name || "En Proceso"}
                            </span>
                          </span>
                        </div>
                      </td>
                    </motion.tr>
                  )
                )
              )}
            </tbody>
          </table>
        </div>

        {/* Controles de Paginación */}
        {totalPages > 1 && (
          <div className="mt-1 flex flex-col sm:flex-row items-center justify-between gap-3 px-2 sm:px-4 py-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center text-xs sm:text-sm text-gray-700 dark:text-gray-300 text-center sm:text-left">
              <span>
                Mostrando {startIndex + 1} a {Math.min(endIndex, totalItems)} de {totalItems}
              </span>
            </div>
            
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Botón Anterior */}
              <button
                onClick={goToPreviousPage}
                disabled={currentPage === 0}
                className={`flex items-center px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-md transition-colors duration-200 ${
                  currentPage === 0
                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <FaChevronLeft className="w-2.5 h-2.5 sm:w-3 sm:h-3 sm:mr-1" />
                <span className="hidden sm:inline">Anterior</span>
              </button>

              {/* Números de página */}
              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, index) => (
                  <button
                    key={index}
                    onClick={() => goToPage(index)}
                    className={`px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-md transition-colors duration-200 ${
                      currentPage === index
                        ? 'bg-primary text-white dark:bg-secondary'
                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>

              {/* Botón Siguiente */}
              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages - 1}
                className={`flex items-center px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-md transition-colors duration-200 ${
                  currentPage === totalPages - 1
                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <span className="hidden sm:inline">Siguiente</span>
                <FaChevronRight className="w-2.5 h-2.5 sm:w-3 sm:h-3 sm:ml-1" />
              </button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default JustificationsHistorical;
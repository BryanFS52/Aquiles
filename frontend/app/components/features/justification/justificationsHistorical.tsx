"use client"

import { motion } from "framer-motion";
import { FaCheckCircle, FaClock, FaFileAlt, FaRegFileAlt } from "react-icons/fa";
import { GrAttachment } from "react-icons/gr";
import { MdHistory } from "react-icons/md";
import { TransformedJustificationItem } from "@slice/justificationSlice";
interface JustificationsHistoricalProps {
  data: TransformedJustificationItem[];
  loading: boolean;
  handleDownloadFile: (justificacion: TransformedJustificationItem) => void;
}

export default function JustificationsHistorical({
  data,
  loading,
  handleDownloadFile,
}: JustificationsHistoricalProps) {
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
      className="w-auto max-w-4xl bg-white dark:bg-[#002033] rounded-xl shadow-sm border border-white dark:border-[#002033] h-auto"
    >
      <div className="h-auto">
        <div className="flex items-center mb-6">
          <div className="p-3 bg-gradient-to-r dark:from-secondary dark:to-blue-900 from-primary to-lime-500 rounded-full shadow-lg">
            <MdHistory className="text-2xl text-white" />
          </div>
          <div className="ml-4">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
              Historial de Justificaciones
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Historico de tus justificaciones
            </p>
          </div>
        </div>
        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
          <table className="w-full text-sm text-left text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800">
            <thead className="text-xs uppercase bg-gray-50 dark:bg-gray-700 text-black dark:text-white">
              <tr>
                <th className="px-6 py-4 font-medium">Tipo de Novedad</th>
                <th className="px-6 py-4 font-medium">Fecha de Ausencia</th>
                <th className="px-6 py-4 font-medium">Fecha de Justificación</th>
                <th className="px-6 py-4 font-medium">Archivo</th>
                <th className="px-6 py-4 font-medium">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {loading ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-8 text-center text-darkGray dark:text-lightGray"
                  >
                    <div className="flex flex-col items-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black dark:border-white"></div>
                      <p className="text-lg font-medium mt-4">
                        Cargando justificaciones...
                      </p>
                    </div>
                  </td>
                </tr>
              ) : !data || data.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-8 text-center text-darkGray dark:text-lightGray"
                  >
                    <div className="flex flex-col items-center">
                      <FaRegFileAlt className="w-12 h-12 mb-4 opacity-50" />
                      <p className="text-lg font-medium mb-2">
                        No hay justificaciones
                      </p>
                      <p className="text-sm">
                        Aún no has enviado ninguna justificación.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                data.map(
                  (
                    justification: TransformedJustificationItem,
                    index: number
                  ) => (
                    <motion.tr
                      key={justification.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          {justification.justificationType}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          {justification.absenceDate}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          {justification.justificationDate}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          {justification.archivoAdjunto ? (
                            <GrAttachment
                              title={`Descargar archivo (${
                                justification.archivoMime || "desconocido"
                              })`}
                              className="w-5 h-5 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 cursor-pointer transition-colors duration-200"
                              onClick={() => handleDownloadFile(justification)}
                            />
                          ) : (
                            <span className="text-gray-400 dark:text-gray-500">
                              No hay archivo
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <span
                            className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                              justification.estado
                            )}`}
                          >
                            {getStatusIcon(justification.estado)}
                            <span className="ml-1">{justification.estado}</span>
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
      </div>
    </motion.div>
  );
}

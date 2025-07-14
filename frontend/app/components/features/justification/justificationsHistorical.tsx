"use client";

import { motion } from "framer-motion";
import { FaCheckCircle, FaClock, FaFileAlt, FaRegFileAlt } from "react-icons/fa";
import { TransformedJustificationItem } from "@slice/justificationSlice";
import { GrAttachment } from "react-icons/gr";

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
    return estado === "Aprobada"
      ? "text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30"
      : "text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30";
  };

  const getStatusIcon = (estado: string) => {
    return estado === "Aprobada" ? (
      <FaCheckCircle className="w-4 h-4" />
    ) : (
      <FaClock className="w-4 h-4" />
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ duration: 0.5 }}
      className="w-auto max-w-4xl bg-white dark:bg-shadowBlue p-6 lg:p-8 rounded-xl shadow-sm border border-lightGray dark:border-darkGray h-auto"
    >
      <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 h-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-black dark:text-white mb-2">
            Historial de Justificaciones
          </h2>
        </div>

        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
          <table className="w-full text-sm text-left text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800">
            <thead className="text-xs uppercase bg-gray-50 dark:bg-gray-700 text-black dark:text-white">
              <tr>
                <th className="px-6 py-4 font-medium">Tipo de Novedad</th>
                <th className="px-6 py-4 font-medium">
                  Fecha de Justificacion
                </th>
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
              ) : data.length === 0 ? (
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
                  (justification: TransformedJustificationItem, index: number) => (
                    <motion.tr
                      key={justification.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          {justification.tipoNovedad}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">{justification.fecha}</div>
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
                            <span className="ml-1">
                              {justification.estado}
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
      </div>
    </motion.div>
  );
}

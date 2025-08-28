"use client"

import { motion } from "framer-motion";
import { FaRegFileAlt } from "react-icons/fa";

interface AttendanceTableProps {
  data: any[];
  loading: boolean;
  onReportNovelty?: (studentId?: number) => void;
}

export default function AttendanceTable({
  data,
  loading,
  onReportNovelty
}: AttendanceTableProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ duration: 0.5 }}
      className="w-auto max-w-4xl bg-white dark:bg-[#002033] rounded-xl shadow-sm border border-white dark:border-[#002033] h-auto"
    >
      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
        <table className="w-full text-sm text-left text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800">
          <thead className="text-xs uppercase bg-gray-50 dark:bg-gray-700 text-black dark:text-white">
            <tr>
              <th className="px-6 py-4 font-medium">Documento</th>
              <th className="px-6 py-4 font-medium">Aprendiz</th>
              <th className="px-6 py-4 font-medium">Ausencias e Injustificadas</th>
              <th className="px-6 py-4 font-medium">Ausencias e Injustificadas consecutivas</th>
              <th className="px-6 py-4 font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-darkGray dark:text-lightGray">
                  <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black dark:border-white"></div>
                    <p className="text-lg font-medium mt-4">Cargando Asistencias...</p>
                  </div>
                </td>
              </tr>
            ) : !data || data.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-darkGray dark:text-lightGray">
                  <div className="flex flex-col items-center">
                    <FaRegFileAlt className="w-12 h-12 mb-4 opacity-50" />
                    <p className="text-lg font-medium mb-2">No hay ausencias</p>
                    <p className="text-sm">No se encontraron aprendices con ausencias.</p>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((summary: any, index: number) => (
                <motion.tr
                  key={summary.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center">{summary.documento}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">{summary.aprendiz}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center font-semibold">
                      {summary.cantidad}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center font-semibold">
                      {summary.consecutivas ?? 0}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => onReportNovelty?.(summary.id)}
                      className={`px-3 py-1 text-sm rounded transition-colors ${
                        summary.cantidad >= 5 || summary.consecutivas >= 3
                        ? 'bg-red-600 text-white hover:bg-red-700'
                        : 'bg-gray-300 text-gray-600 cursor-not-allowed'}`}
                      disabled={!(summary.cantidad >= 5 || summary.consecutivas >= 3)}
                      title={!(summary.cantidad >= 5 || summary.consecutivas >= 3)
                        ? 'Solo puedes reportar si tiene al menos 5 ausencias o 3 consecutivas.'
                        : 'Reportar deserción'}
                    >
                      {summary.cantidad >= 5 || summary.consecutivas >= 3 ? 'Reportar' : 'Reportar'}
                    </button>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

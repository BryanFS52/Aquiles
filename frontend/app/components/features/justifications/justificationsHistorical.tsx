"use client"

import { motion } from "framer-motion";
import { FaCheckCircle, FaClock, FaRegFileAlt } from "react-icons/fa";
import { GrAttachment } from "react-icons/gr";
import { MdHistory } from "react-icons/md";
import { TransformedJustificationItem } from "@slice/justificationSlice";
import DataTable from "@components/UI/DataTable/index";
import type { DataTableColumn } from "@components/UI/DataTable/types";
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

  const columns: DataTableColumn<TransformedJustificationItem>[] = [
    {
      key: 'justificationType',
      header: 'Tipo de Novedad',
      render: (row) => (
        <div className="flex items-center">
          {row.justificationType}
        </div>
      )
    },
    {
      key: 'fecha',
      header: 'Fecha de Justificación',
      render: (row) => (
        <div className="flex items-center">{row.fecha}</div>
      )
    },
    {
      key: 'archivoAdjunto',
      header: 'Archivo',
      render: (row) => (
        <div className="flex items-center space-x-2">
          {row.archivoAdjunto ? (
            <GrAttachment
              title={`Descargar archivo (${row.archivoMime || "desconocido"})`}
              className="w-5 h-5 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 cursor-pointer transition-colors duration-200"
              onClick={() => handleDownloadFile(row)}
            />
          ) : (
            <span className="text-gray-400 dark:text-gray-500">
              No hay archivo
            </span>
          )}
        </div>
      )
    },
    {
      key: 'estado',
      header: 'Estado',
      render: (row) => (
        <div className="flex items-center space-x-2">
          <span
            className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(row.estado)}`}
          >
            {getStatusIcon(row.estado)}
            <span className="ml-1">
              {row.estado}
            </span>
          </span>
        </div>
      )
    }
  ];
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

        {loading ? (
          <div className="flex flex-col items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black dark:border-white"></div>
            <p className="text-lg font-medium mt-4 text-darkGray dark:text-lightGray">
              Cargando justificaciones...
            </p>
          </div>
        ) : !data || data.length === 0 ? (
          <div className="flex flex-col items-center py-8">
            <FaRegFileAlt className="w-12 h-12 mb-4 opacity-50 text-darkGray dark:text-lightGray" />
            <p className="text-lg font-medium mb-2 text-darkGray dark:text-lightGray">
              No hay justificaciones
            </p>
            <p className="text-sm text-darkGray dark:text-lightGray">
              Aún no has enviado ninguna justificación.
            </p>
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={data}
            filterPlaceholder="Buscar justificaciones..."
            pageSize={5}
            className="rounded-lg"
          />
        )}
      </div>
    </motion.div>
  );
}

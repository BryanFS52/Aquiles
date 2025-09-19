"use client"

import { motion } from "framer-motion";
import { FaRegFileAlt } from "react-icons/fa";
import { useState, useEffect } from "react";
import DataTable from "@components/UI/DataTable";

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
  // Auto-detect dark mode
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const checkDarkMode = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    };

    // Check initial state
    checkDarkMode();

    // Listen for changes
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);
  // Definir columnas para DataTable
  const columns = [
    {
      key: 'documento',
      header: 'Documento',
      className: 'min-w-[120px] text-center',
      render: (row: any) => <span>{row.documento}</span>,
    },
    {
      key: 'aprendiz',
      header: 'Aprendiz',
      className: 'min-w-[160px] text-center',
      render: (row: any) => <span>{row.aprendiz}</span>,
    },
    {
      key: 'cantidad',
      header: 'Ausencias e Injustificadas',
      className: 'min-w-[80px] text-center',
      render: (row: any) => <span className="font-semibold">{row.cantidad}</span>,
    },
    {
      key: 'consecutivas',
      header: 'Ausencias e Injustificadas consecutivas',
      className: 'min-w-[80px] text-center',
      render: (row: any) => <span className="font-semibold">{row.consecutivas ?? 0}</span>,
    },
    {
      key: 'acciones',
      header: 'Acciones',
      className: 'min-w-[120px] text-center',
      render: (row: any) => (
        <button
          onClick={() => onReportNovelty?.(row.id)}
          className={`px-3 py-1 text-sm rounded transition-colors ${row.cantidad >= 5 || row.consecutivas >= 3
            ? 'bg-red-600 text-white hover:bg-red-700'
            : 'bg-gray-300 text-gray-600 cursor-not-allowed'}`}
          disabled={!(row.cantidad >= 5 || row.consecutivas >= 3)}
          title={!(row.cantidad >= 5 || row.consecutivas >= 3)
            ? 'Solo puedes reportar si tiene al menos 5 ausencias o 3 consecutivas.'
            : 'Reportar deserción'}
        >
          Reportar
        </button>
      ),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ duration: 0.5 }}
      className="w-full px-1 sm:px-2 md:px-4 lg:px-6 xl:px-8"
    >
      <div className="overflow-x-auto w-full">
        <DataTable
          columns={columns}
          data={data}
          isDarkMode={isDarkMode}
          pageSize={8}
          filterPlaceholder="Buscar aprendiz o documento..."
          className="w-full min-w-[340px] sm:min-w-[600px] max-w-none"
        />
        {loading && (
          <div className="flex flex-col items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black dark:border-white"></div>
            <p className="text-lg font-medium mt-4">Cargando Asistencias...</p>
          </div>
        )}
        {!loading && (!data || data.length === 0) && (
          <div className="flex flex-col items-center py-8">
            <FaRegFileAlt className="w-12 h-12 mb-4 opacity-50" />
            <p className="text-lg font-medium mb-2">No hay ausencias</p>
            <p className="text-sm">No se encontraron aprendices con ausencias.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
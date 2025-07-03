"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaDownload,
  FaEye,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaFileAlt,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { JustificationItem } from "@type/slices/justification";

interface Justification {
    id: number;
    description: string;
    justificationFile: string;
    justificationDate: string;
    state: boolean;
    justificationType: {
        id: string;
        name: string;
    };
}

export default function JustificationsHistorical() {
  const [selectedJustification, setSelectedJustification] = useState<Justification | null>(null);
  const [showModal, setShowModal] = useState(false);

  const justifications = useSelector((state: RootState) => state.justification.data);
  const loading = useSelector((state: RootState) => state.justification.loading);

  const getStatusColor = (estado: boolean) => {
    return estado
      ? 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30'
      : 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30';
  };

  const getStatusIcon = (estado: boolean) => {
    return estado ? <FaCheckCircle className="w-4 h-4" /> : <FaClock className="w-4 h-4" />;
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

  const handleDownloadFile = (justification: Justification) => {
    toast.info(`Descargando archivo...`);
    const linkSource = `data:application/octet-stream;base64,${justification.justificationFile}`;
    const downloadLink = document.createElement("a");
    downloadLink.href = linkSource;
    downloadLink.download = `justificacion_${justification.id}.pdf`; // Asumiendo PDF por defecto
    downloadLink.click();
  };

  const handleViewDetails = (justification: Justification) => {
    setSelectedJustification(justification);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedJustification(null);
  };

  return (
    <div className="w-full max-w-4xl bg-white dark:bg-shadowBlue p-6 lg:p-8 rounded-xl shadow-sm border border-lightGray dark:border-darkGray">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-black dark:text-white mb-2">
          Historial de Justificaciones
        </h2>
        <p className="text-darkGray dark:text-lightGray">
          Aquí puedes ver todas tus justificaciones enviadas y su estado actual.
        </p>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
        <table className="w-full text-sm text-left text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800">
          <thead className="text-xs uppercase bg-gray-50 dark:bg-gray-700 text-black dark:text-white">
            <tr>
              <th className="px-6 py-4 font-medium">Tipo de Novedad</th>
              <th className="px-6 py-4 font-medium">Fecha de Justificación</th>
              <th className="px-6 py-4 font-medium">Archivo</th>
              <th className="px-6 py-4 font-medium">Estado</th>
              {/* <th className="px-6 py-4 font-medium">Acciones</th> */}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {justifications.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-darkGray dark:text-lightGray">
                  <div className="flex flex-col items-center">
                    <FaFileAlt className="w-12 h-12 mb-4 opacity-50" />
                    <p className="text-lg font-medium mb-2">No hay justificaciones</p>
                    <p className="text-sm">Aún no has enviado ninguna justificación.</p>
                  </div>
                </td>
              </tr>
            ) : (
              justifications.map((justification: JustificationItem, index: number) => (
                <motion.tr
                  key={justification.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <td className="px-6 py-4 text-black dark:text-white font-medium">
                    {justification.justificationType?.name}
                  </td>
                  <td className="px-6 py-4">{formatDate(justification.justificationDate)}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <FaFileAlt className="w-4 h-4 mr-2 text-darkGray dark:text-lightGray" />
                      <span className="truncate max-w-32">{`justificacion_${justification.id}.pdf`}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(justification.state)}`}
                    >
                      {getStatusIcon(justification.state)}
                      <span className="ml-1">{justification.state ? "Aprobada" : "Pendiente"}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button onClick={() => handleViewDetails(justification as any)} title="Ver detalles">
                        <FaEye className="w-4 h-4 text-black dark:text-white hover:text-blue-600" />
                      </button>
                      <button onClick={() => handleDownloadFile(justification as any)} title="Descargar archivo">
                        <FaDownload className="w-4 h-4 text-black dark:text-white hover:text-green-600" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal con AnimatePresence */}
      <AnimatePresence>
        {showModal && selectedJustification && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white dark:bg-shadowBlue rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()} // Evita cerrar al hacer clic dentro
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-black dark:text-white">
                    Detalles de la Justificación
                  </h3>
                  <button
                    onClick={closeModal}
                    className="text-darkGray dark:text-lightGray hover:text-black dark:hover:text-white"
                    title="Cerrar modal"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-4">
                  <p><strong>Tipo:</strong> {selectedJustification.justificationType?.name}</p>
                  <p><strong>Fecha:</strong> {formatDate(selectedJustification.justificationDate)}</p>
                  <p><strong>Descripción:</strong> {selectedJustification.description}</p>
                  <p>
                    <strong>Estado:</strong>{' '}
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedJustification.state)}`}>
                      {getStatusIcon(selectedJustification.state)}
                      <span className="ml-1">{selectedJustification.state ? "Aprobada" : "Pendiente"}</span>
                    </span>
                  </p>
                  <div className="flex justify-between items-center mt-4 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                    <span>{`justificacion_${selectedJustification.id}.pdf`}</span>
                    <button onClick={() => handleDownloadFile(selectedJustification)} title="Descargar archivo">
                      <FaDownload className="w-4 h-4 text-black dark:text-white" />
                    </button>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={closeModal}
                    className="px-4 py-2 bg-black dark:bg-lightGreen text-white rounded-lg hover:bg-lightGreen dark:hover:bg-darkGreen"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

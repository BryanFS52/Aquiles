"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '@/redux/store';
import { motion } from "framer-motion";
import { 
  FaDownload, 
  FaEye, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaClock,
  FaCalendarAlt,
  FaFileAlt 
} from "react-icons/fa";
import { toast } from "react-toastify";

interface Justification {
  id: string;
  tipoNovedad: string;
  fechaJustificacion: string;
  descripcion: string;
  nombreArchivo: string;
  archivoUrl: string;
  estado: 'APROBADA' | 'RECHAZADA' | 'PENDIENTE';
  fechaRespuesta?: string;
  observaciones?: string;
  numeroDocumento: string;
  nombreAprendiz: string;
}

// Datos de ejemplo - esto normalmente vendría de Redux/API
const mockJustifications: Justification[] = [
//   {
//     id: "1",
//     tipoNovedad: "Incapacidad médica",
//     fechaJustificacion: "2024-01-15",
//     descripcion: "Incapacidad por gripe común",
//     nombreArchivo: "incapacidad_medica.pdf",
//     archivoUrl: "/documents/incapacidad_medica.pdf",
//     estado: "APROBADA",
//     fechaRespuesta: "2024-01-16",
//     numeroDocumento: "1234567890",
//     nombreAprendiz: "Juan Pérez"
//   },
//   {
//     id: "2",
//     tipoNovedad: "Calamidad doméstica",
//     fechaJustificacion: "2024-01-20",
//     descripcion: "Emergencia familiar",
//     nombreArchivo: "calamidad_domestica.jpg",
//     archivoUrl: "/documents/calamidad_domestica.jpg",
//     estado: "PENDIENTE",
//     numeroDocumento: "1234567890",
//     nombreAprendiz: "Juan Pérez"
//   },
//   {
//     id: "3",
//     tipoNovedad: "Cita médica",
//     fechaJustificacion: "2024-01-25",
//     descripcion: "Cita médica especializada",
//     nombreArchivo: "cita_medica.pdf",
//     archivoUrl: "/documents/cita_medica.pdf",
//     estado: "RECHAZADA",
//     fechaRespuesta: "2024-01-26",
//     observaciones: "Documento no legible",
//     numeroDocumento: "1234567890",
//     nombreAprendiz: "Juan Pérez"
//   }
];

export default function JustificationsHistorical() {
  const dispatch = useDispatch<AppDispatch>();
  const [justifications, setJustifications] = useState<Justification[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJustification, setSelectedJustification] = useState<Justification | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Aquí normalmente obtendrías los datos del store de Redux
  // const { data: justificationsData, loading, error } = useSelector((state: RootState) => state.justifications);

  useEffect(() => {
    // Simular carga de datos
    setTimeout(() => {
      setJustifications(mockJustifications);
      setLoading(false);
    }, 1000);

    // Aquí normalmente harías el dispatch para obtener las justificaciones
    // dispatch(fetchJustificationsByStudent(studentId));
  }, [dispatch]);

  const getStatusColor = (estado: string) => {
    switch (estado) {
      case 'APROBADA':
        return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30';
      case 'RECHAZADA':
        return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30';
      case 'PENDIENTE':
        return 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30';
      default:
        return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-900/30';
    }
  };

  const getStatusIcon = (estado: string) => {
    switch (estado) {
      case 'APROBADA':
        return <FaCheckCircle className="w-4 h-4" />;
      case 'RECHAZADA':
        return <FaTimesCircle className="w-4 h-4" />;
      case 'PENDIENTE':
        return <FaClock className="w-4 h-4" />;
      default:
        return <FaClock className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleDownloadFile = (justification: Justification) => {
    // Aquí implementarías la lógica para descargar el archivo
    toast.info(`Descargando ${justification.nombreArchivo}...`);
    // window.open(justification.archivoUrl, '_blank');
  };

  const handleViewDetails = (justification: Justification) => {
    setSelectedJustification(justification);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedJustification(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black dark:border-white"></div>
        <span className="ml-3 text-black dark:text-white">Cargando justificaciones...</span>
      </div>
    );
  }

  return (
    <div className="w-fulljustify-end gap-4 pt-6 border-t border-lightGray dark:border-darkGray">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-black dark:text-white mb-2">
          Historial de Justificaciones
        </h2>
        <p className="text-darkGray dark:text-lightGray">
          Aquí puedes ver todas tus justificaciones enviadas y su estado actual.
        </p>
      </div>

      <div className="overflow-x-auto rounded-lg border border-lightGray dark:border-darkGray shadow-sm">
        <table className="w-full text-sm text-left text-black dark:text-white bg-white dark:bg-shadowBlue">
          <thead className="text-xs uppercase bg-gray-50 dark:bg-gray-700 text-black dark:text-white">
            <tr>
              <th className="px-6 py-4 font-medium">Tipo de Novedad</th>
              <th className="px-6 py-4 font-medium">Fecha de Justificación</th>
              <th className="px-6 py-4 font-medium">Archivo</th>
              <th className="px-6 py-4 font-medium">Estado</th>
              <th className="px-6 py-4 font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody>
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
              justifications.map((justification, index) => (
                <motion.tr
                  key={justification.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="border-b border-lightGray dark:border-darkGray hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="font-medium text-black dark:text-white">
                      {justification.tipoNovedad}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-darkGray dark:text-lightGray">
                      <FaCalendarAlt className="w-4 h-4 mr-2" />
                      {formatDate(justification.fechaJustificacion)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <FaFileAlt className="w-4 h-4 mr-2 text-darkGray dark:text-lightGray" />
                      <span className="text-darkGray dark:text-lightGray truncate max-w-32">
                        {justification.nombreArchivo}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(justification.estado)}`}>
                      {getStatusIcon(justification.estado)}
                      <span className="ml-1">{justification.estado}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleViewDetails(justification)}
                        className="p-2 text-black dark:text-white hover:bg-lightGray dark:hover:bg-darkGray rounded-lg transition-colors"
                        title="Ver detalles"
                      >
                        <FaEye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDownloadFile(justification)}
                        className="p-2 text-black dark:text-white hover:bg-lightGray dark:hover:bg-darkGray rounded-lg transition-colors"
                        title="Descargar archivo"
                      >
                        <FaDownload className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal de detalles */}
      {showModal && selectedJustification && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white dark:bg-shadowBlue rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-black dark:text-white">
                  Detalles de la Justificación
                </h3>
                <button
                  onClick={closeModal}
                  className="text-darkGray dark:text-lightGray hover:text-black dark:hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-darkGray dark:text-lightGray">
                    Tipo de Novedad
                  </label>
                  <p className="text-black dark:text-white">{selectedJustification.tipoNovedad}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-darkGray dark:text-lightGray">
                    Fecha de Justificación
                  </label>
                  <p className="text-black dark:text-white">
                    {formatDate(selectedJustification.fechaJustificacion)}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-darkGray dark:text-lightGray">
                    Descripción
                  </label>
                  <p className="text-black dark:text-white">{selectedJustification.descripcion}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-darkGray dark:text-lightGray">
                    Estado
                  </label>
                  <div className="mt-1">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedJustification.estado)}`}>
                      {getStatusIcon(selectedJustification.estado)}
                      <span className="ml-1">{selectedJustification.estado}</span>
                    </span>
                  </div>
                </div>

                {selectedJustification.fechaRespuesta && (
                  <div>
                    <label className="text-sm font-medium text-darkGray dark:text-lightGray">
                      Fecha de Respuesta
                    </label>
                    <p className="text-black dark:text-white">
                      {formatDate(selectedJustification.fechaRespuesta)}
                    </p>
                  </div>
                )}

                {selectedJustification.observaciones && (
                  <div>
                    <label className="text-sm font-medium text-darkGray dark:text-lightGray">
                      Observaciones
                    </label>
                    <p className="text-black dark:text-white">{selectedJustification.observaciones}</p>
                  </div>
                )}

                <div>
                  <label className="text-sm font-medium text-darkGray dark:text-lightGray">
                    Archivo Adjunto
                  </label>
                  <div className="flex items-center justify-between mt-1 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <span className="text-black dark:text-white text-sm">
                      {selectedJustification.nombreArchivo}
                    </span>
                    <button
                      onClick={() => handleDownloadFile(selectedJustification)}
                      className="text-black dark:text-white hover:text-lightGreen dark:hover:text-lightGreen"
                    >
                      <FaDownload className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 bg-black dark:bg-lightGreen text-white rounded-lg hover:bg-lightGreen dark:hover:bg-darkGreen transition-colors"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
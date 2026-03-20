"use client"

import { useState } from "react";
import Image from "next/image";
import { useSelector } from "react-redux";
import { FaChevronLeft, FaChevronRight, FaEye } from "react-icons/fa";
import persona from "@public/img/persona.jpg";
import { RootState } from "@/redux/store";
import { getStatusNameById, getActiveStatuses } from "@/redux/slices/justificationStatusSlice";
import { JustificationStatus } from "@graphql/generated";
import EmptyState from "@components/UI/emptyState";
import ModalJustificationDetails from "@components/Modals/modalJustificationDetails";
import DownloadButton from "@components/UI/DownloadButton";

interface JustificationTableProps {
  filteredData: any[];
  handleStatusChange: (justificacionId: string, newStatus: string) => void;
  hasAnyData?: boolean;
  isLoading?: boolean;
  hasError?: boolean;
  hasFiltersApplied?: boolean;
  isInstructorView?: boolean;
  justificationStatuses: JustificationStatus[];
}

const JustificationTable: React.FC<JustificationTableProps> = ({
  filteredData,
  handleStatusChange,
  hasAnyData = false,
  isLoading = false,
  hasError = false,
  hasFiltersApplied = false,
  isInstructorView = false,
}) => {
  
  // Estado para la paginación
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;

  // Estado para el modal de detalles
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJustification, setSelectedJustification] = useState<any>(null);

  const { data: justificationStatuses, loading: loadingStatuses } = useSelector(
    (state: RootState) => state.justificationStatus
  );

  // Calcular datos de paginación
  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const dataToRender = filteredData.slice(startIndex, endIndex);

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

  const handleSelectChange = (justificacionId: string, event: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatusId = event.target.value;

    if (newStatusId) {
      handleStatusChange(justificacionId, newStatusId);
    }
  };

  const getCurrentStatusName = (justificacion: any) => {
    // Si justificationStatus es un objeto, extraer el nombre
    if (justificacion.justificationStatus) {
      if (typeof justificacion.justificationStatus === 'object' && justificacion.justificationStatus.name) {
        return justificacion.justificationStatus.name;
      }
      if (typeof justificacion.justificationStatus === 'string' && justificacion.justificationStatus !== "Sin status") {
        return justificacion.justificationStatus;
      }
    }
    return justificacion.estado || "En proceso";
  };

  const getCurrentSelectValue = (justificacion: any) => {
    // Si justificationStatus es un objeto, extraer el id
    if (justificacion.justificationStatusId) {
      return justificacion.justificationStatusId.toString();
    }
    if (justificacion.justificationStatus && typeof justificacion.justificationStatus === 'object') {
      return justificacion.justificationStatus.id?.toString() || "";
    }
    return "";
  };

  // Función para abrir el modal de detalles
  const handleViewDetails = (justificacion: any) => {
    setSelectedJustification(justificacion);
    setIsModalOpen(true);
  };

  // Función para cerrar el modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedJustification(null);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // if (hasError) {
  //   return (
  //     <EmptyState message="Ocurrió un error al cargar las justificaciones. Intenta recargar la página." />
  //   );
  // }

  if (!hasAnyData) {
    const message = isInstructorView
      ? "No se encontraron justificaciones para esta ficha. Selecciona una ficha desde el panel del instructor."
      : "No hay justificaciones disponibles en este momento.";
    return <EmptyState message={message} />;
  }

  if (hasAnyData && dataToRender.length === 0 && hasFiltersApplied) {
    return (
      <EmptyState message="No se encontraron justificaciones que coincidan con los filtros aplicados. Prueba con otros criterios de búsqueda." />
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
      <table className="w-full text-sm text-left text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800">
        <thead className="text-xs uppercase bg-gray-50 dark:bg-gray-700 text-black dark:text-white">
          <tr>
            <th className="px-6 py-4 font-medium">Foto</th>
            <th className="px-6 py-4 font-medium">Documento</th>
            <th className="px-6 py-4 font-medium">Aprendiz</th>
            <th className="px-6 py-4 font-medium">Fecha de ausencia</th>
            <th className="px-6 py-4 font-medium">Fecha de justificacion</th>
            <th className="px-6 py-4 font-medium">Archivo adjunto</th>
            <th className="px-6 py-4 font-medium">Estado del proceso</th>
            <th className="px-6 py-4 font-medium">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {dataToRender.map((justificacion: any) => (
            <tr
              key={justificacion.id}
              className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <td className="px-6 py-4">
                <Image
                  src={persona}
                  alt="Persona"
                  className="w-10 h-10 rounded-full object-cover"
                />
              </td>
              <td className="px-6 py-4">{justificacion.documento}</td>
              <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                {justificacion.aprendiz}
              </td>
              <td className="px-6 py-4">{justificacion.absenceDate}</td>
              <td className="px-6 py-4">{justificacion.justificationDate}</td>
              <td className="px-6 py-4">
                <DownloadButton
                  fileBase64={justificacion.archivoAdjunto}
                  mimeType={justificacion.archivoMime}
                  fileName={`justificacion_${justificacion.documento}_${justificacion.absenceDate?.replace(/\//g, '-')}.${justificacion.archivoMime?.includes('pdf') ? 'pdf' : 'jpg'}`}
                  variant="icon"
                  iconSize="md"
                />
              </td>
              <td className="px-6 py-4">
                <span
                  className={`inline-flex items-center px-1.5 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${getCurrentStatusName(justificacion) === "Aceptado"
                      ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                      : getCurrentStatusName(justificacion) === "Denegado"
                        ? "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                        : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
                    }`}
                >
                  {getCurrentStatusName(justificacion)}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex space-x-2">
                  <select
                    value={getCurrentSelectValue(justificacion)}
                    onChange={(e) => handleSelectChange(justificacion.id, e)}
                    disabled={loadingStatuses}
                    title="Cambiar estado de la justificación"
                    className="px-3 py-2 text-xs font-medium bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors duration-200 min-w-[120px]"
                  >
                    <option value="">Seleccionar estado</option>
                    {getActiveStatuses(justificationStatuses)
                      .filter(status => status.name !== "En proceso")
                      .map((status) => (
                        <option key={status.id} value={status.id?.toString()}>
                          {status.name}
                        </option>
                      ))}
                  </select>
                  {loadingStatuses && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Cargando
                    </span>
                  )}
                <button
                  onClick={() => handleViewDetails(justificacion)}
                  title="Ver detalles de la justificación"
                  className="flex items-center justify-center p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <FaEye className="w-4 h-4" />
                </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Controles de Paginación */}
      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
            <span>
              Mostrando {startIndex + 1} a {Math.min(endIndex, totalItems)} de {totalItems} justificaciones
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Botón Anterior */}
            <button
              onClick={goToPreviousPage}
              disabled={currentPage === 0}
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                currentPage === 0
                  ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <FaChevronLeft className="w-3 h-3 mr-1" />
              Anterior
            </button>

            {/* Números de página */}
            <div className="flex space-x-1">
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index}
                  onClick={() => goToPage(index)}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                    currentPage === index
                      ? 'bg-blue-600 text-white dark:bg-blue-500'
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
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                currentPage === totalPages - 1
                  ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              Siguiente
              <FaChevronRight className="w-3 h-3 ml-1" />
            </button>
          </div>
        </div>
      )}

      {/* Modal de detalles de justificación */}
      <ModalJustificationDetails
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        justificationData={selectedJustification}
      />
    </div>
  );
}

export default JustificationTable;
"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GrAttachment } from "react-icons/gr";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import { AppDispatch, RootState } from "@/redux/store";
import PageTitle from "@components/UI/pageTitle";
import JustificationFilters from "@components/features/justification/justificationsFilter";
import JustificationTable from "@components/features/justification/justificationsTable";
import EmptyState from "@components/UI/emptyState";
import {
  fetchJustifications,
  setFilterOptions,
  goToPreviousPage,
  goToNextPage,
  formatErrorMessage,
  generateFileName,
  setLocalCurrentPage,
  downloadBase64File,
  updateJustificationStatus
} from '@slice/justificationSlice';
import { fetchAllJustificationStatuses } from '@/redux/slices/justificationStatusSlice';

export default function JustificacionesInstructor() {
  const dispatch = useDispatch<AppDispatch>();
  const {
    filteredData,
    loading,
    error,
    totalItems,
    totalPages,
    localCurrentPage,
    filterOptions,
    itemsPerPage
  } = useSelector((state: RootState) => state.justification);

  // Obtener los estados de justificación para mapear IDs a nombres
  const { justificationStatuses } = useSelector(
    (state: RootState) => state.justificationStatus
  );

  useEffect(() => {
    dispatch(fetchJustifications({ page: 0, size: itemsPerPage }));
    // Cargar los estados de justificación
    dispatch(fetchAllJustificationStatuses({ page: 0, size: 3 }));
  }, [dispatch, localCurrentPage, itemsPerPage]);

  const handleFilterChange = (filterType: string, value: string) => {
    dispatch(setFilterOptions({ [filterType]: value }));
    dispatch(setLocalCurrentPage(1));
  };

  const handleRefresh = () => {
    dispatch(fetchJustifications({ page: 0, size: itemsPerPage }));
  };

  const handlePreviousPage = () => {
    dispatch(goToPreviousPage());
  };

  const handleNextPage = () => {
    dispatch(goToNextPage());
  };

  const handleDownloadFile = (justificacion: any) => {
    if (justificacion.archivoAdjunto) {
      const mimeType = justificacion.archivoMime || "application/octet-stream";
      const fileName = generateFileName(justificacion.id, mimeType);
      downloadBase64File(justificacion.archivoAdjunto, fileName, mimeType);
    }
  };

  const handleStatusChange = (justificacionId: string, newStatusId: string) => {
    // Encontrar el nombre del estado basado en el ID
    const status = justificationStatuses.find(s => s.id === newStatusId);
    const statusName = status ? status.name : newStatusId;
    
    // Para mantener compatibilidad con el backend actual, mapear a estados específicos
    // que el backend espera basado en el campo boolean 'state'
    let mappedStatus = statusName;
    
    // Si el estado contiene palabras que indican aprobación, mapear a "Activo" (state = true)
    if (statusName.toLowerCase().includes('aprobad') || 
        statusName.toLowerCase().includes('aceptad') || 
        statusName.toLowerCase().includes('activ')) {
      mappedStatus = "Activo";
    } 
    // Si el estado contiene palabras que indican rechazo, mapear a "Inactivo" (state = false)
    else if (statusName.toLowerCase().includes('rechazad') || 
             statusName.toLowerCase().includes('denegad') || 
             statusName.toLowerCase().includes('inactiv')) {
      mappedStatus = "Inactivo";
    }
    
    // El backend usa un campo boolean 'state', por lo que convertimos:
    // "Activo" -> state = true, "Inactivo" -> state = false
    const booleanState = mappedStatus === "Activo";
    
    console.log("🔄 Cambiando estado de justificación:", {
      id: justificacionId,
      statusName,
      mappedStatus,
      booleanState
    });
    
    // Ahora el estado se actualiza inmediatamente en el slice, no necesitamos refresh
    dispatch(updateJustificationStatus({ id: justificacionId, status: booleanState.toString() }))
      .then((result) => {
        if (updateJustificationStatus.fulfilled.match(result)) {
          console.log("✅ Estado actualizado exitosamente");
        } else {
          console.error("❌ Error al actualizar el estado:", result.payload);
        }
      })
      .catch((error) => {
        console.error("❌ Error inesperado al actualizar el estado:", error);
      });
  };

  const errorMessage = formatErrorMessage(error);
  const canGoNext = localCurrentPage < totalPages;
  const canGoPrevious = localCurrentPage > 1;

  if (!loading && !errorMessage && (!filteredData || filteredData.length === 0)) {
    return <EmptyState message="No se encontraron justificaciones disponibles." />;
  }

  return (
    <div className="space-y-6">
      <PageTitle>Justificaciones de aprendices</PageTitle>

      {/* Filters */}
      <JustificationFilters
        filterOptions={filterOptions}
        loading={loading}
        onFilterChange={handleFilterChange}
        onRefresh={handleRefresh}
      />

      {/* Error Message */}
      {errorMessage && (
        <EmptyState message={errorMessage} />
      )}

      {/* Table */}
      {!loading && !errorMessage && (
        <>
          <JustificationTable
            filteredData={filteredData}
            handleDownloadFile={handleDownloadFile}
            handleStatusChange={handleStatusChange}
          />

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6">
            <button
              className="flex items-center px-4 py-2 text-sm font-medium text-black dark:text-white bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
              onClick={handlePreviousPage}
              disabled={!canGoPrevious}
            >
              <IoIosArrowBack className="mr-2" />
              Anterior
            </button>

            <span className="text-sm text-gray-700 dark:text-gray-300">
              Página {localCurrentPage} de {totalPages} ({totalItems} registros)
            </span>

            <button
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
              onClick={handleNextPage}
              disabled={!canGoNext}
            >
              Siguiente
              <IoIosArrowForward className="ml-2" />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
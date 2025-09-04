"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import { toast } from "react-toastify";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchAllJustificationStatuses } from '@/redux/slices/justificationStatusSlice';
import PageTitle from "@components/UI/pageTitle";
import JustificationFilters from "@components/features/justifications/justificationsFilter";
import JustificationTable from "@components/features/justifications/justificationsTable";
import {
  fetchJustifications,
  setFilterOptions,
  goToPreviousPage,
  goToNextPage,
  formatErrorMessage,
  setLocalCurrentPage,
  downloadBase64File,
  generateFileName,
  updateJustificationStatus,
  toggleMultiFilter,
  setMultiFilter,
  clearMultiFilters,
  MultiFilterState,
} from '@slice/justificationSlice';


export default function JustificacionesCoordinator() {
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
    dispatch(fetchJustifications({ page: localCurrentPage, size: itemsPerPage }));
  };

  const handleMultiFilterChange = (field: keyof MultiFilterState, value: string) => {
    dispatch(setMultiFilter({ field, value }));
    dispatch(setLocalCurrentPage(1));
  };

  const handleToggleMultiFilter = () => {
    dispatch(toggleMultiFilter());
    dispatch(setLocalCurrentPage(1));
  };

  const handleClearMultiFilters = () => {
    dispatch(clearMultiFilters());
    dispatch(setLocalCurrentPage(1));
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
    console.log("🔄 Cambiando estado de justificación (Coordinador):", {
      id: justificacionId,
      newStatusId
    });

    // Encontrar el nombre del estado basado en el ID
    const status = justificationStatuses.find(s => s.id === newStatusId);
    const statusName = status?.name || 'Estado desconocido';

    // Enviar directamente el statusId para usar la relación real
    dispatch(updateJustificationStatus({ 
      id: justificacionId, 
      statusId: newStatusId,
      statusName: statusName
    }))
      .then((result) => {
        if (updateJustificationStatus.fulfilled.match(result)) {
          // Mostrar mensaje personalizado según el estado
          showJustificationStatusMessage(statusName);
          
          // Ya no necesitamos recargar ya que el estado se actualiza localmente
        } else {
          const error = result.payload as any;
          if (error?.code !== "500" || !error?.message?.includes("already has the specified status")) {
            // Solo mostrar error si no es el caso de estado duplicado (para debugging)
            // console.error("❌ Error al actualizar el estado:", error);
          }
        }
      })
      .catch((error) => {
        // Error inesperado (para debugging)
        // console.error("❌ Error inesperado al actualizar el estado:", error);
      });
  };

  // Función para mostrar mensajes de estado de justificación
  const showJustificationStatusMessage = (statusName: string) => {
    const statusNameLower = statusName.toLowerCase();
    
    if (statusNameLower.includes('aprobad') || statusNameLower.includes('acepta')) {
      toast.success(`Justificación aprobada`, {
        position: "top-right",
        autoClose: 5000,
      });
    } else if (statusNameLower.includes('denegad') || statusNameLower.includes('rechaza') || statusNameLower.includes('no acepta')) {
      toast.error(`Justificación denegada`, {
        position: "top-right",
        autoClose: 5000,
      });
    } else if (statusNameLower.includes('proceso') || statusNameLower.includes('pendiente') || statusNameLower.includes('revision')) {
      toast.info(`Justificación está en proceso`, {
        position: "top-right",
        autoClose: 4000,
      });
    } else {
      toast.info(`Estado actualizado: ${statusName}`, {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const errorMessage = formatErrorMessage(error);
  const canGoNext = localCurrentPage < totalPages;
  const canGoPrevious = localCurrentPage > 1;

  // Determinar si hay filtros aplicados
  const { selectedFiltro, searchTerm, enableMultiFilter, multiFilters } = filterOptions;
  const hasFiltersApplied = Boolean(
    selectedFiltro ||
    searchTerm ||
    (enableMultiFilter && Object.values(multiFilters).some(value => value))
  );

  return (
    <div className="space-y-6">
      <PageTitle>Justificaciones de aprendices</PageTitle>

      {/* Filters */}
      <JustificationFilters
        filterOptions={filterOptions}
        loading={loading}
        onFilterChange={handleFilterChange}
        onMultiFilterChange={handleMultiFilterChange}
        onToggleMultiFilter={handleToggleMultiFilter}
        onClearMultiFilters={handleClearMultiFilters}
        onRefresh={handleRefresh}
      />

      {/* Error Message */}
      {errorMessage && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-600 dark:text-red-400">{errorMessage}</p>
        </div>
      )}

      {/* Table with built-in empty states */}
      {!errorMessage && (
        <>
          <JustificationTable
            filteredData={filteredData}
            handleDownloadFile={handleDownloadFile}
            handleStatusChange={handleStatusChange}
            hasAnyData={totalItems > 0}
            isLoading={loading}
            hasError={Boolean(error)}
            hasFiltersApplied={hasFiltersApplied}
            isInstructorView={false}
          />

          {/* Pagination - solo mostrar si hay datos */}
          {!loading && filteredData.length > 0 && (
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
          )}
        </>
      )}
    </div>
  );
}

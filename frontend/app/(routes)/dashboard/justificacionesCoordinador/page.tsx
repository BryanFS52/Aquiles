"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import { AppDispatch } from "@redux/store";
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
} from '@slice/justificationSlice';
import { fetchAllJustificationStatuses } from '@/redux/slices/justificationStatusSlice';
import JustificationTable from "@/components/features/justification/justificationsTable";
import { AppDispatch, RootState } from "@/redux/store";


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
    
    // Enviar directamente el statusId para usar la relación real
    dispatch(updateJustificationStatus({ id: justificacionId, statusId: newStatusId }))
      .then((result) => {
        if (updateJustificationStatus.fulfilled.match(result)) {
          console.log("✅ Estado actualizado exitosamente");
          // ✅ Recargar los datos para obtener la relación actualizada desde el backend
          dispatch(fetchJustifications({ page: localCurrentPage - 1, size: itemsPerPage }));
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
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-600 dark:text-red-400">{errorMessage}</p>
        </div>
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

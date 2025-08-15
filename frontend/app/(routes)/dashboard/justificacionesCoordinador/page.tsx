"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import PageTitle from "@components/UI/pageTitle";
import JustificationFilters from "@/components/features/justifications/justificationsFilter";
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
import JustificationTable from "@/components/features/justifications/justificationsTable";
import { AppDispatch } from "@/redux/store";


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
  } = useSelector((state: any) => state.justification);


  useEffect(() => {
    dispatch(fetchJustifications({ page: 0, size: itemsPerPage }));
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

  const handleStatusChange = (justificacionId: string, newStatus: string) => {
    dispatch(updateJustificationStatus({ id: justificacionId, status: newStatus }))
      .then(() => {
        // Refrescar los datos después de actualizar el estado
        dispatch(fetchJustifications({ page: localCurrentPage - 1, size: itemsPerPage }));
      })
      .catch((error) => {
        console.error("Error al actualizar el estado:", error);
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

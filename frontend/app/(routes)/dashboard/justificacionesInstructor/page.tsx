"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import type { AppDispatch, RootState } from "@/redux/store";
import PageTitle from "@components/UI/pageTitle";
import JustificationFilters from "@components/features/justifications/justificationsFilter";
import JustificationTable from "@components/features/justifications/justificationsTable";
import EmptyState from "@components/UI/emptyState";
import {
  setFilterOptions,
  goToPreviousPage,
  goToNextPage,
  formatErrorMessage,
  generateFileName,
  setLocalCurrentPage,
  downloadBase64File,
  updateJustificationStatus,
} from "@slice/justificationSlice";
import { fetchAllJustificationStatuses } from "@/redux/slices/justificationStatusSlice";
import { useLoader } from "@/context/LoaderContext";

export default function JustificacionesInstructor() {
  const dispatch = useDispatch<AppDispatch>();
  const { showLoader, hideLoader } = useLoader();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const {
    filteredData,
    loading,
    error,
    totalItems,
    totalPages,
    localCurrentPage,
    filterOptions,
    itemsPerPage,
    data: justificationsData
  } = useSelector((state: RootState) => state.justification);

  const { justificationStatuses } = useSelector(
    (state: RootState) => state.justificationStatus
  );
  
  useEffect(() => {
    dispatch(fetchAllJustificationStatuses({ page: 0, size: 3 }));
  }, [dispatch]);

  const handleFilterChange = (filterType: string, value: string) => {
    dispatch(setFilterOptions({ [filterType]: value }));
    dispatch(setLocalCurrentPage(1));
  };
  
  const handleRefresh = () => {
    console.log("🔄 Refresh solicitado");
    // Aquí podrías agregar lógica para recargar datos específicos si es necesario
  };
  
  const handlePreviousPage = () => {
    dispatch(goToPreviousPage());
  };

  const handleNextPage = () => {
    dispatch(goToNextPage());
  };

  useEffect(() => {
    if (loading || isTransitioning) {
      showLoader();
    } else {
      hideLoader();
    }
  }, [loading, isTransitioning, showLoader, hideLoader]);

  const handleStatusUpdateError = (error: any, justificacionId: string) => {
    console.error("Error al actualizar estado:", {
      justificacionId,
      error: error?.message || 'Error desconocido'
    });
  };

  const handleDownloadFile = (justificacion: any) => {
    if (justificacion.archivoAdjunto) {
      const mimeType = justificacion.archivoMime || "application/octet-stream";
      const fileName = generateFileName(justificacion.id, mimeType);
      downloadBase64File(justificacion.archivoAdjunto, fileName, mimeType);
    }
  };

  const handleStatusChange = (justificacionId: string, newStatusId: string) => {
    dispatch(updateJustificationStatus({ id: justificacionId, statusId: newStatusId }))
      .then((result) => {
        if (updateJustificationStatus.fulfilled.match(result)) {
          console.log("Estado actualizado exitosamente");
        } else if (updateJustificationStatus.rejected.match(result)) {
          handleStatusUpdateError(result.payload, justificacionId);
        }
      })
      .catch((error) => {
        handleStatusUpdateError(error, justificacionId);
      });
  };

  // Log para debugging del estado de justificaciones
  useEffect(() => {
    console.log("📊 Estado actual:", {
      loading,
      dataLength: justificationsData?.length,
      filteredDataLength: filteredData?.length,
      totalItems,
      currentPage: localCurrentPage
    });
  }, [loading, justificationsData, filteredData, totalItems, localCurrentPage]);

  const errorMessage = formatErrorMessage(error);
  const canGoNext = localCurrentPage < totalPages;
  const canGoPrevious = localCurrentPage > 1;


  // Verificar si hay datos de justificaciones en el state
  if (!loading && !error && (!justificationsData || justificationsData.length === 0)) {
    return <EmptyState message="No se encontraron justificaciones para esta ficha. Selecciona una ficha desde el panel del instructor." />;
  }

  if (!loading && !errorMessage && (!filteredData || filteredData.length === 0)) {
    return <EmptyState message="No se encontraron justificaciones que coincidan con los filtros aplicados." />;
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
              onClick={handlePreviousPage}
              disabled={!canGoPrevious}
              className="flex items-center px-4 py-2 text-sm font-medium text-black dark:text-white 
              bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg 
              hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed 
              transition-colors duration-300"
            >
              <IoIosArrowBack className="mr-2" />
              Anterior
            </button>

            <span className="text-sm text-gray-700 dark:text-gray-300">
              Página {localCurrentPage} de {totalPages} ({totalItems} registros)
            </span>

            <button
              onClick={handleNextPage}
              disabled={!canGoNext}
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 
              bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg 
              hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed 
              transition-colors duration-300"
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
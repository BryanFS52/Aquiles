"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import { toast } from "react-toastify";
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
import {
  selectJustifications,
  selectJustificationsLoading,
  selectJustificationsError,
  selectHasJustifications
} from "@slice/competenceQuarterJustificationsSlice";
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

  // Usar selectores del slice de competenceQuarterJustifications
  const competenceQuarterJustifications = useSelector(selectJustifications);
  const competenceQuarterLoading = useSelector(selectJustificationsLoading);
  const competenceQuarterError = useSelector(selectJustificationsError);
  const hasCompetenceQuarterData = useSelector(selectHasJustifications);

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

  const handleDownloadFile = (justificacion: any) => {
    if (justificacion.archivoAdjunto) {
      const mimeType = justificacion.archivoMime || "application/octet-stream";
      const fileName = generateFileName(justificacion.id, mimeType);
      downloadBase64File(justificacion.archivoAdjunto, fileName, mimeType);
    }
  };

  const handleStatusChange = (justificacionId: string, newStatusId: string) => {
    // Buscar el nombre del estado en la lista de estados disponibles
    const selectedStatus = justificationStatuses.find(status => status.id?.toString() === newStatusId);
    const statusName = selectedStatus?.name || "Estado actualizado";

    // Buscar la justificación actual para verificar si ya tiene el mismo estado
    let currentJustification: any = null;
    if (hasCompetenceQuarterData) {
      currentJustification = competenceQuarterJustifications.find((j: any) => j.id.toString() === justificacionId);
    } else {
      currentJustification = filteredData.find((j: any) => j.id.toString() === justificacionId);
    }

    // Verificar si el estado ya es el mismo
    const currentStatusId = currentJustification?.justificationStatus?.id?.toString() ||
      currentJustification?.justificationStatusId?.toString();

    if (currentStatusId === newStatusId) {
      return; // No hacer nada si el estado es el mismo
    }

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
      toast.success(`🎉 Justificación aprobada: ${statusName}`, {
        position: "top-right",
        autoClose: 5000,
      });
    } else if (statusNameLower.includes('denegad') || statusNameLower.includes('rechaza') || statusNameLower.includes('no acepta')) {
      toast.error(`❌ Justificación denegada: ${statusName}`, {
        position: "top-right",
        autoClose: 5000,
      });
    } else if (statusNameLower.includes('proceso') || statusNameLower.includes('pendiente') || statusNameLower.includes('revision')) {
      toast.info(`📝 Justificación en proceso: ${statusName}`, {
        position: "top-right",
        autoClose: 4000,
      });
    } else {
      toast.info(`📋 Estado actualizado: ${statusName}`, {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  // Función para transformar datos de competence quarter al formato de justificaciones
  // Esta función ya no es necesaria, la lógica está en el slice

  // Log para debugging del estado de justificaciones
  useEffect(() => {
    // Debug logs removidos para producción
  }, [loading, justificationsData, filteredData, totalItems, localCurrentPage, competenceQuarterJustifications, competenceQuarterLoading, competenceQuarterError, hasCompetenceQuarterData]);

  const errorMessage = formatErrorMessage(error);

  // Determinar qué datos usar - simplificado usando selectores
  const hasJustificationData = justificationsData && justificationsData.length > 0;
  const isLoadingAny = loading || competenceQuarterLoading;

  const canGoNext = hasCompetenceQuarterData ? false : localCurrentPage < totalPages;
  const canGoPrevious = hasCompetenceQuarterData ? false : localCurrentPage > 1;

  // Preparar datos para mostrar
  let dataToShow = filteredData;
  let totalItemsToShow = totalItems;
  let hasDataToShow = hasJustificationData;

  // Si tenemos datos de competence quarter, usarlos en su lugar
  if (hasCompetenceQuarterData) {
    dataToShow = competenceQuarterJustifications;
    totalItemsToShow = competenceQuarterJustifications.length;
    hasDataToShow = competenceQuarterJustifications.length > 0;
  }

  // Verificar si hay datos de justificaciones en el state
  if (!isLoadingAny && !error && !competenceQuarterError && !hasDataToShow) {
    return <EmptyState message="No se encontraron justificaciones para esta ficha. Selecciona una ficha desde el panel del instructor." />;
  }

  if (!isLoadingAny && !errorMessage && hasDataToShow && dataToShow.length === 0) {
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
      {!isLoadingAny && !errorMessage && (
        <>
          <JustificationTable
            filteredData={dataToShow}
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
              Página {localCurrentPage} de {hasCompetenceQuarterData ? 1 : totalPages} ({totalItemsToShow} registros)
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
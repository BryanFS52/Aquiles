"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import type { AppDispatch, RootState } from "@/redux/store";
import PageTitle from "@components/UI/pageTitle";
import { useLoader } from "@context/LoaderContext";
import JustificationFilters from "@components/features/justifications/justificationsFilter";
import JustificationTable from "@components/features/justifications/justificationsTable";
import EmptyState from "@components/UI/emptyState";
import { fetchAllJustificationStatuses } from "@redux/slices/justificationStatusSlice";
import {
  setCompetenceQuarterFilterOptions,
  setCompetenceQuarterMultiFilter,
  toggleCompetenceQuarterMultiFilter,
  clearCompetenceQuarterMultiFilters,
  updateJustificationStatus,
  formatErrorMessage,
  generateFileName,
  downloadBase64File,
  fetchJustificationsByCompetenceQuarter,
  setCompetenceQuarterMode,
  MultiFilterState,
} from "@slice/justificationSlice";

export default function JustificacionesInstructor() {
  const dispatch = useDispatch<AppDispatch>();
  const { showLoader, hideLoader } = useLoader();

  // Acceso directo al estado de Redux - usando los nuevos campos para competence quarter
  const justificationState = useSelector((state: RootState) => state.justification);

  // Extraer propiedades del estado
  const {
    competenceQuarterData: justifications,
    competenceQuarterFilteredData: filteredData,
    competenceQuarterFilterOptions: filterOptions,
    loading,
    error,
    isCompetenceQuarterMode,
  } = justificationState;

  const { justificationStatuses } = useSelector(
    (state: RootState) => state.justificationStatus
  );

  useEffect(() => {
    // Cargar todos los estados de justificación disponibles
    dispatch(fetchAllJustificationStatuses({ page: 0, size: 3 })); // Aumentar a 50 para obtener todos los estados
    // Activar el modo competence quarter
    dispatch(setCompetenceQuarterMode(true));
  }, [dispatch]);

  const handleFilterChange = (filterType: string, value: string) => {
    dispatch(setCompetenceQuarterFilterOptions({ [filterType]: value }));
  };

  const handleRefresh = () => {
    // Aquí podrías agregar lógica para recargar datos específicos si es necesario
  };

  const handleMultiFilterChange = (field: keyof MultiFilterState, value: string) => {
    dispatch(setCompetenceQuarterMultiFilter({ field, value }));
  };

  const handleToggleMultiFilter = () => {
    dispatch(toggleCompetenceQuarterMultiFilter());
  };

  const handleClearMultiFilters = () => {
    dispatch(clearCompetenceQuarterMultiFilters());
  };

  useEffect(() => {
    if (loading) {
      showLoader();
    } else {
      hideLoader();
    }
  }, [loading, showLoader, hideLoader]);

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
    const currentJustification = filteredData.find((j: any) => j.id.toString() === justificacionId);

    // Verificar si el estado ya es el mismo
    const currentStatusId = currentJustification?.justificationStatusId?.toString() || currentJustification?.estado;

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
      toast.info(`Justificación en proceso`, {
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

  // Obtener el número de ficha de los datos disponibles
  const studySheetNumber = filteredData?.[0]?.ficha || justifications?.[0]?.ficha || "Sin ficha";

  // Verificar si hay datos de justificaciones
  const hasJustificationData = justifications && justifications.length > 0;

  // Determinar si hay filtros aplicados
  const { selectedFiltro, searchTerm, enableMultiFilter, multiFilters } = filterOptions;
  const hasFiltersApplied = Boolean(
    selectedFiltro ||
    searchTerm ||
    (enableMultiFilter && Object.values(multiFilters).some(value => value))
  );

  return (
    <div className="space-y-6">
      <PageTitle>Justificaciones de la Ficha: {studySheetNumber}</PageTitle>

      {/* Filters */}
      <JustificationFilters
        filterOptions={filterOptions}
        loading={loading}
        showMultiFilterToggle={false}
        onFilterChange={handleFilterChange}
        onMultiFilterChange={handleMultiFilterChange}
        onToggleMultiFilter={handleToggleMultiFilter}
        onClearMultiFilters={handleClearMultiFilters}
        onRefresh={handleRefresh}
      />

      {/* Error Message */}
      {errorMessage && (
        <EmptyState message={errorMessage} />
      )}

      {/* Table with built-in empty states */}
      {!errorMessage && (
        <JustificationTable
          filteredData={filteredData}
          handleDownloadFile={handleDownloadFile}
          handleStatusChange={handleStatusChange}
          hasAnyData={hasJustificationData}
          isLoading={loading}
          hasError={Boolean(error)}
          hasFiltersApplied={hasFiltersApplied}
          isInstructorView={true}
        />
      )}
    </div>
  );
}
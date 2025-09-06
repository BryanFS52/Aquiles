"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import type { AppDispatch, RootState } from "@/redux/store";
import { useLoader } from "@context/LoaderContext";
import PageTitle from "@components/UI/pageTitle";
import JustificationFilters from "@components/features/justifications/justificationsFilter";
import JustificationTable from "@components/features/justifications/justificationsTable";
import EmptyState from "@components/UI/emptyState";
import { fetchAllJustificationStatuses } from "@redux/slices/justificationStatusSlice";
import { fetchStudySheetByTeacher } from "@slice/olympo/studySheetSlice";
import { TEMPORAL_INSTRUCTOR_ID } from "@/temporaryCredential";
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

  // Estados locales para gestión de competencias
  const [availableCompetences, setAvailableCompetences] = useState<Array<{id: string, name: string}>>([]);
  const [selectedCompetenceId, setSelectedCompetenceId] = useState<string>('');

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

    // Cargar las fichas del instructor para obtener las competencias disponibles
    const loadCompetences = async () => {
      try {
        const result = await dispatch(fetchStudySheetByTeacher({ 
          idTeacher: TEMPORAL_INSTRUCTOR_ID, 
          page: 0, 
          size: 10 
        }));
        
        if (fetchStudySheetByTeacher.fulfilled.match(result)) {
          const studySheets = result.payload?.data || [];
          
          // Extraer competencias únicas de todas las fichas
          const competencesSet = new Set<string>();
          const competencesArray: Array<{id: string, name: string}> = [];
          
          studySheets.forEach((sheet: any) => {
            if (sheet.teacherStudySheets) {
              sheet.teacherStudySheets.forEach((tss: any) => {
                if (tss.competence && tss.competence.id && tss.competence.name && !competencesSet.has(tss.competence.id)) {
                  competencesSet.add(tss.competence.id);
                  competencesArray.push({
                    id: tss.competence.id,
                    name: tss.competence.name
                  });
                }
              });
            }
          });
          
          setAvailableCompetences(competencesArray);
        }
      } catch (error) {
        console.error('Error loading competences:', error);
      }
    };

    loadCompetences();
  }, [dispatch]);

  const handleFilterChange = (filterType: string, value: string) => {
    dispatch(setCompetenceQuarterFilterOptions({ [filterType]: value }));
  };

  const handleCompetenceChange = (competenceId: string) => {
    setSelectedCompetenceId(competenceId);
    if (competenceId) {
      // Cargar justificaciones para la competencia seleccionada
      dispatch(fetchJustificationsByCompetenceQuarter({ 
        competenceQuarterId: parseInt(competenceId) 
      }));
    }
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

      {/* Filters - solo mostrar si hay competencia seleccionada */}
      {selectedCompetenceId && (
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
      )}
      
      {/* Competence Selector */}
      < >
        {/* <label htmlFor="competence-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Seleccionar Competencia:
        </label> */}
        <select
          id="competence-select"
          value={selectedCompetenceId}
          onChange={(e) => handleCompetenceChange(e.target.value)}
          className="w-full md:w-auto px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value=""> Seleccione una competencia </option>
          {availableCompetences.map((competence) => (
            <option key={competence.id} value={competence.id}>
              {competence.name}
            </option>
          ))}
        </select>
      </>

      {/* Error Message */}
      {errorMessage && selectedCompetenceId && (
        <EmptyState message={errorMessage} />
      )}

      {/* Empty state when no competence is selected */}
      {!selectedCompetenceId && (
        <EmptyState message="Seleccione una competencia para ver las justificaciones." />
      )}

      {/* Table with built-in empty states - solo mostrar si hay competencia seleccionada */}
      {!errorMessage && selectedCompetenceId && (
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
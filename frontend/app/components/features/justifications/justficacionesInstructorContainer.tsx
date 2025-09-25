"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import type { AppDispatch, RootState } from "@/redux/store";
import PageTitle from "@components/UI/pageTitle";
import JustificationFilters from "@components/features/justifications/justificationsFilter";
import JustificationTable from "@components/features/justifications/justificationsTable";
import EmptyState from "@components/UI/emptyState";
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
import { fetchAllJustificationStatuses } from "@/redux/slices/justificationStatusSlice";
import { fetchStudySheetByTeacher } from "@slice/olympo/studySheetSlice";
import { useLoader } from "@/context/LoaderContext";
import { TEMPORAL_INSTRUCTOR_ID } from "@/temporaryCredential";
import { JustificacionesInstructorContainerProps } from "./types";

interface CompetenceOption {
  id: string;
  name: string;
  studySheetNumber?: number;
}

export const JustificacionesInstructorContainer: React.FC<
  JustificacionesInstructorContainerProps
> = ({ competenceQuarterId, fichaNumber }) => {
  const [availableCompetences, setAvailableCompetences] = useState<CompetenceOption[]>([]);
  const [selectedCompetenceId, setSelectedCompetenceId] = useState<string>(
    competenceQuarterId?.toString() || ""
  );
  const [isLoadingCompetences, setIsLoadingCompetences] = useState(true);
  const [fichaFilteredData, setFichaFilteredData] = useState<any[]>([]);

  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { showLoader, hideLoader } = useLoader();

  const { competenceQuarterData: justifications, competenceQuarterFilteredData: filteredData, competenceQuarterFilterOptions: filterOptions, loading, error } =
    useSelector((state: RootState) => state.justification);

  const { justificationStatuses } = useSelector((state: RootState) => state.justificationStatus);

  // Cargar estados y activar modo "competenceQuarter"
  useEffect(() => {
    dispatch(fetchAllJustificationStatuses({ page: 0, size: 3 }));
    dispatch(setCompetenceQuarterMode(true));
  }, [dispatch]);

  // Cargar justificaciones según competencia seleccionada
  useEffect(() => {
    if (selectedCompetenceId && !isLoadingCompetences) {
      const competenceId = Number(selectedCompetenceId);
      if (!isNaN(competenceId)) {
        dispatch(fetchJustificationsByCompetenceQuarter({ competenceQuarterId: competenceId }));
      }
    }
  }, [selectedCompetenceId, isLoadingCompetences, dispatch, fichaNumber]);

  // Filtrar por ficha
  useEffect(() => {
    if (fichaNumber) {
      setFichaFilteredData(
        filteredData.filter((item: any) =>
          [
            item.ficha,
            item.fichaNumero,
            item.studySheetNumber,
            item.numeroFicha,
            item.studySheet?.number,
            item.attendance?.studySheet?.number,
          ]
            .filter(Boolean)
            .some(num => num?.toString() === fichaNumber)
        )
      );
    } else {
      setFichaFilteredData(filteredData || []);
    }
  }, [filteredData, fichaNumber]);

  // Mostrar loader global
  useEffect(() => {
    loading || isLoadingCompetences ? showLoader() : hideLoader();
  }, [loading, isLoadingCompetences, showLoader, hideLoader]);

  // 🔹 Handlers
  const handleFilterChange = (filterType: string, value: string) =>
    dispatch(setCompetenceQuarterFilterOptions({ [filterType]: value }));

  const handleMultiFilterChange = (field: keyof MultiFilterState, value: string) =>
    dispatch(setCompetenceQuarterMultiFilter({ field, value }));

  const handleCompetenceChange = (competenceId: string) => {
    setSelectedCompetenceId(competenceId);
    if (competenceId) {
      router.push(
        `/dashboard/justificacionesInstructor/${competenceId}${fichaNumber ? `?ficha=${fichaNumber}` : ""}`
      );
    }
  };

  const handleRefresh = async () => {
    if (!selectedCompetenceId) return;
    try {
      await dispatch(
        fetchJustificationsByCompetenceQuarter({ competenceQuarterId: Number(selectedCompetenceId) })
      ).unwrap();
      toast.success("Datos actualizados correctamente");
    } catch {
      toast.error("Error al actualizar los datos");
    }
  };

  const handleDownloadFile = (justificacion: any) => {
    if (!justificacion.archivoAdjunto) return;
    const mimeType = justificacion.archivoMime || "application/octet-stream";
    downloadBase64File(justificacion.archivoAdjunto, generateFileName(justificacion.id, mimeType), mimeType);
  };

  const handleStatusChange = (justificacionId: string, newStatusId: string) => {
    const current = filteredData.find((j: any) => j.id.toString() === justificacionId);
    const currentStatusId = current?.justificationStatusId?.toString() || current?.estado;
    if (currentStatusId === newStatusId) return;

    const statusName = justificationStatuses.find(s => s.id?.toString() === newStatusId)?.name || "Estado actualizado";
    dispatch(updateJustificationStatus({ id: justificacionId, statusId: newStatusId, statusName }))
      .unwrap()
      .then(() => {
        const lower = statusName.toLowerCase();
        if (lower.includes("aprobad") || lower.includes("acepta")) toast.success("Justificación aprobada");
        else if (lower.includes("denegad") || lower.includes("rechaza") || lower.includes("no acepta"))
          toast.error("Justificación denegada");
        else if (lower.includes("proceso") || lower.includes("pendiente") || lower.includes("revision"))
          toast.info("Justificación en proceso");
        else toast.info(`Estado actualizado: ${statusName}`);
      })
      .catch(err => console.error("Error al actualizar estado:", err));
  };

  // Render
  const errorMessage = formatErrorMessage(error);
  const selectedCompetence = availableCompetences.find(c => c.id === selectedCompetenceId);
  const competenceName = selectedCompetence?.name || "Ninguna seleccionada";
  const { selectedFiltro, searchTerm, enableMultiFilter, multiFilters } = filterOptions;
  const hasFiltersApplied = Boolean(
    selectedFiltro ||
    searchTerm ||
    (enableMultiFilter && Object.values(multiFilters).some(value => value))
  );
  const renderContent = () => {
    if (isLoadingCompetences)
      return <EmptyState message="Cargando competencias disponibles..." />;
    if (!availableCompetences.length)
      return <EmptyState message="No se encontraron competencias disponibles para este instructor." />;
    if (!selectedCompetenceId)
      return <EmptyState message="Selecciona una competencia para ver las justificaciones correspondientes." />;
    if (errorMessage) return <EmptyState message={errorMessage} />;
    if (loading && !(justifications?.length > 0))
      return <EmptyState message={`Cargando justificaciones para ${competenceName}...`} />;

    return (
      <JustificationTable
        filteredData={fichaFilteredData}
        handleDownloadFile={handleDownloadFile}
        handleStatusChange={handleStatusChange}
        hasAnyData={fichaFilteredData.length > 0}
        isLoading={loading}
        hasError={Boolean(error)}
        hasFiltersApplied={hasFiltersApplied}
        isInstructorView
      />
    );
  };

  return (
    <div className="space-y-6">
      <PageTitle onBack={() => router.back()}>
        Justificaciones de la Ficha: {fichaNumber || selectedCompetence?.studySheetNumber || "N/A"} por la{" "}
        {competenceName}
      </PageTitle>

      {selectedCompetenceId && !isLoadingCompetences && (
        <JustificationFilters
          filterOptions={filterOptions}
          loading={loading}
          showMultiFilterToggle={false}
          onFilterChange={handleFilterChange}
          onMultiFilterChange={handleMultiFilterChange}
          onToggleMultiFilter={() => dispatch(toggleCompetenceQuarterMultiFilter())}
          onClearMultiFilters={() => dispatch(clearCompetenceQuarterMultiFilters())}
          onRefresh={handleRefresh}
        />
      )}

      {renderContent()}
    </div>
  );
};

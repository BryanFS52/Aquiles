"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import PageTitle from "@components/UI/pageTitle";
import JustificationFilters from "@components/features/JustificacionesInstructor/justificationsFilter";
import JustificationTable from "@components/features/JustificacionesInstructor/justificationsTable";
import {
  toggleCompetenceQuarterMultiFilter,
  clearCompetenceQuarterMultiFilters,
  setCompetenceQuarterMode,
  fetchJustificationsByCompetenceQuarter,
  setCompetenceQuarterFilterOptions,
  setCompetenceQuarterMultiFilter,
  MultiFilterState,
  updateJustificationStatus, // thunk para cambio de estado
  clearCompetenceQuarterJustifications,
} from "@slice/justificationSlice";
import { fetchAllJustificationStatuses } from "@/redux/slices/justificationStatusSlice";
import type { AppDispatch, RootState } from "@/redux/store";
import { JustificacionesInstructorContainerProps } from "./types";

const JustificacionesInstructorContainer: React.FC<
  JustificacionesInstructorContainerProps
> = ({ competenceQuarterId, fichaNumber }) => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const {
    competenceQuarterFilteredData: filteredData,
    competenceQuarterFilterOptions: filterOptions,
    loading,
    error,
  } = useSelector((state: RootState) => state.justification);

  const { data: justificationStatuses } = useSelector(
    (state: RootState) => state.justificationStatus
  );

  const { selectedForAttendance } = useSelector(
    (state: RootState) => state.studySheet
  );

  // 🔹 Inicializar modo y cargar estados
  useEffect(() => {
    dispatch(fetchAllJustificationStatuses({ page: 0, size: 5 }));
    dispatch(setCompetenceQuarterMode(true));

    if (competenceQuarterId) {
      // 🔹 Limpiar datos anteriores antes de cargar nuevos
      dispatch(clearCompetenceQuarterJustifications());
      
      dispatch(
        fetchJustificationsByCompetenceQuarter({
          competenceQuarterId: Number(competenceQuarterId),
        })
      );
    }
  }, [dispatch, competenceQuarterId]);

  const getCompetenceName = () => {
    if (selectedForAttendance?.teacherStudySheets) {
      const targetTss = selectedForAttendance.teacherStudySheets.find(
        (tss: any) => tss.id.toString() === competenceQuarterId.toString()
      );
      return targetTss?.competence?.name || `Competencia ${competenceQuarterId}`;
    }
    return `Competencia ${competenceQuarterId}`;
  };

  const competenceName = getCompetenceName();

  const handleFilterChange = (filterType: string, value: string) =>
    dispatch(setCompetenceQuarterFilterOptions({ [filterType]: value }));

  const handleMultiFilterChange = (field: keyof MultiFilterState, value: string) =>
    dispatch(setCompetenceQuarterMultiFilter({ field, value }));

  const handleRefresh = () => {
    if (competenceQuarterId) {
      // 🔹 Limpiar datos anteriores antes de refrescar
      dispatch(clearCompetenceQuarterJustifications());
      
      dispatch(
        fetchJustificationsByCompetenceQuarter({
          competenceQuarterId: Number(competenceQuarterId), 
          page: 0,
          size: 5,
        })
      );
    }
  };

  const handleStatusChange = async (justificationId: string, newStatusId: string) => {
    try {
      await dispatch(
        updateJustificationStatus({
          id: justificationId,
          statusId: newStatusId,
        })
      ).unwrap();

      // refrescar lista
      handleRefresh();
    } catch (error) {
      console.error("❌ Error al actualizar justificationStatus:", error);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 p-2 sm:p-4 md:p-6 lg:p-8">
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="text-lg">
            Cargando justificaciones para {competenceName}...
          </div>
        </div>
      ) : (
        <>
          <PageTitle onBack={() => router.back()}>
            Justificaciones de la Ficha - {competenceName}
            {fichaNumber && ` - Ficha ${fichaNumber}`}
          </PageTitle>

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

          <JustificationTable
            filteredData={filteredData}
            handleStatusChange={handleStatusChange}
            hasAnyData={filteredData.length > 0}
            isLoading={loading}
            hasError={Boolean(error)}
            hasFiltersApplied={true}
            isInstructorView
            justificationStatuses={justificationStatuses}
          />
        </>
      )}
    </div>
  );
};

export default JustificacionesInstructorContainer;
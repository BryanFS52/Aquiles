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
  learningOutcomes?: LearningOutcome[];
}

interface LearningOutcome {
  id: string;
  name: string;
  description?: string;
  code?: number;
}

export const JustificacionesInstructorContainer: React.FC<JustificacionesInstructorContainerProps> = ({ 
  competenceQuarterId,
  fichaNumber,
  learningOutcomeId
}) => {
  const [availableCompetences, setAvailableCompetences] = useState<CompetenceOption[]>([]);
  const [selectedCompetenceId, setSelectedCompetenceId] = useState<string>(competenceQuarterId?.toString() || '');
  const [isLoadingCompetences, setIsLoadingCompetences] = useState(true);
  const [fichaFilteredData, setFichaFilteredData] = useState<any[]>([]);

  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { showLoader, hideLoader } = useLoader();

  const justificationState = useSelector((state: RootState) => state.justification);
  
  const {
    competenceQuarterData: justifications,
    competenceQuarterFilteredData: filteredData,
    competenceQuarterFilterOptions: filterOptions,
    loading,
    error,
  } = justificationState;

  const { justificationStatuses } = useSelector(
    (state: RootState) => state.justificationStatus
  );

  useEffect(() => {
    dispatch(fetchAllJustificationStatuses({ page: 0, size: 3 }));
    dispatch(setCompetenceQuarterMode(true));
  }, [dispatch]);

  useEffect(() => {
    const loadCompetences = async () => {
      try {
        setIsLoadingCompetences(true);
        
        const result = await dispatch(fetchStudySheetByTeacher({ 
          idTeacher: TEMPORAL_INSTRUCTOR_ID, 
          page: 0, 
          size: 20 
        }));
        
        if (fetchStudySheetByTeacher.fulfilled.match(result)) {
          const studySheets = result.payload?.data || [];
          
          const competencesMap = new Map<string, CompetenceOption>();
          
          studySheets.forEach((sheet: any) => {
            if (sheet.teacherStudySheets) {
              sheet.teacherStudySheets.forEach((tss: any) => {
                if (tss.competence && tss.competence.id && tss.competence.name) {
                  const competenceId = tss.competence.id;
                  
                  // Mapear los learning outcomes
                  const learningOutcomes = tss.competence.learningOutcome?.map((lo: any) => ({
                    id: lo.id || '',
                    name: lo.name || '',
                    description: lo.description || '',
                    code: lo.code
                  })) || [];

                  if (!competencesMap.has(competenceId)) {
                    competencesMap.set(competenceId, {
                      id: competenceId,
                      name: tss.competence.name,
                      studySheetNumber: sheet.number,
                      learningOutcomes: learningOutcomes
                    });
                  }
                }
              });
            }
          });
          
          const competencesArray = Array.from(competencesMap.values())
            .sort((a, b) => a.name.localeCompare(b.name));
          
          setAvailableCompetences(competencesArray);
          
          if (competenceQuarterId) {
            const exists = competencesArray.find(c => c.id === competenceQuarterId.toString());
            if (exists) {
              setSelectedCompetenceId(competenceQuarterId.toString());
            }
          }
        }
      } catch (error) {
        // Error handled silently
      } finally {
        setIsLoadingCompetences(false);
      }
    };

    loadCompetences();
  }, [dispatch, competenceQuarterId]);

  useEffect(() => {
    if (selectedCompetenceId && !isLoadingCompetences) {
      const competenceId = parseInt(selectedCompetenceId);
      if (!isNaN(competenceId)) {
        dispatch(fetchJustificationsByCompetenceQuarter({ competenceQuarterId: competenceId }))
          .unwrap()
          .then((data) => {
            // Data loaded successfully
          })
          .catch((error) => {
            // Error handled silently
          });
      }
    }
  }, [selectedCompetenceId, isLoadingCompetences, dispatch, fichaNumber]);

  useEffect(() => {
    if ((fichaNumber || learningOutcomeId) && filteredData) {
      
      const filtered = filteredData.filter((item: any) => {
        let matches = true;

        // Filtro por ficha si está presente
        if (fichaNumber) {
          const itemFichaNumber = item.ficha || 
                                 item.fichaNumero || 
                                 item.studySheetNumber || 
                                 item.numeroFicha || 
                                 item.studySheet?.number ||
                                 item.attendance?.studySheet?.number;
          
          matches = matches && itemFichaNumber?.toString() === fichaNumber;
        }

        // Filtro por learning outcome si está presente
        if (learningOutcomeId && matches) {
          // Buscar en las diferentes estructuras posibles donde puede estar el learning outcome
          const learningOutcomeMatch = 
            item.learningOutcomeId?.toString() === learningOutcomeId ||
            item.attendance?.learningOutcome?.id?.toString() === learningOutcomeId ||
            item.student?.studentStudySheets?.some((sss: any) => 
              sss.studySheet?.teacherStudySheets?.some((tss: any) =>
                tss.competence?.learningOutcome?.some((lo: any) => 
                  lo.id?.toString() === learningOutcomeId
                )
              )
            );

          matches = matches && learningOutcomeMatch;
        }
        
        return matches;
      });
      
      setFichaFilteredData(filtered);
    } else {
      setFichaFilteredData(filteredData || []);
    }
  }, [filteredData, fichaNumber, learningOutcomeId]);

  useEffect(() => {
    if (loading || isLoadingCompetences) {
      showLoader();
    } else {
      hideLoader();
    }
  }, [loading, isLoadingCompetences, showLoader, hideLoader]);

  const handleFilterChange = (filterType: string, value: string) => {
    dispatch(setCompetenceQuarterFilterOptions({ [filterType]: value }));
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

  const handleCompetenceChange = (competenceId: string) => {
    setSelectedCompetenceId(competenceId);
    
    if (competenceId) {
      const baseUrl = `/dashboard/justificacionesInstructor/${competenceId}`;
      const urlWithFicha = fichaNumber ? `${baseUrl}?ficha=${fichaNumber}` : baseUrl;
      router.push(urlWithFicha);
    }
  };

  const handleRefresh = async () => {
    if (!selectedCompetenceId) return;
    
    const competenceIdNum = parseInt(selectedCompetenceId);
    if (isNaN(competenceIdNum)) return;

    try {
      const data = await dispatch(fetchJustificationsByCompetenceQuarter({ 
        competenceQuarterId: competenceIdNum 
      })).unwrap();
      
      toast.success("Datos actualizados correctamente", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error) {
      toast.error("Error al actualizar los datos", {
        position: "top-right",
        autoClose: 5000,
      });
    }
  };

  const handleDownloadFile = (justificacion: any) => {
    if (justificacion.archivoAdjunto) {
      const mimeType = justificacion.archivoMime || "application/octet-stream";
      const fileName = generateFileName(justificacion.id, mimeType);
      downloadBase64File(justificacion.archivoAdjunto, fileName, mimeType);
    }
  };

  const handleStatusChange = (justificacionId: string, newStatusId: string) => {
    const selectedStatus = justificationStatuses.find(status => status.id?.toString() === newStatusId);
    const statusName = selectedStatus?.name || "Estado actualizado";

    const currentJustification = filteredData.find((j: any) => j.id.toString() === justificacionId);
    const currentStatusId = currentJustification?.justificationStatusId?.toString() || currentJustification?.estado;
    
    if (currentStatusId === newStatusId) {
      return;
    }

    dispatch(updateJustificationStatus({ 
      id: justificacionId, 
      statusId: newStatusId,
      statusName: statusName
    }))
      .then((result) => {
        if (updateJustificationStatus.fulfilled.match(result)) {
          showJustificationStatusMessage(statusName);
        }
      })
      .catch((error) => {
        console.error("Error inesperado al actualizar el estado:", error);
      });
  };

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

  const getPageTitle = () => {
    const competenceName = selectedCompetence?.name || 'Competencia';
    const fichaText = fichaNumber || selectedCompetence?.studySheetNumber || 'N/A';
    
    let title = `Justificaciones de la Ficha: ${fichaText} por la ${competenceName}`;
    
    if (learningOutcomeId && selectedCompetence?.learningOutcomes) {
      const learningOutcome = selectedCompetence.learningOutcomes.find(
        lo => lo.id === learningOutcomeId
      );
      if (learningOutcome) {
        title += ` - ${learningOutcome.name}`;
      }
    }
    
    return title;
  };

  const errorMessage = formatErrorMessage(error);
  const selectedCompetence = availableCompetences.find(c => c.id === selectedCompetenceId);
  const competenceName = selectedCompetence?.name || "Ninguna seleccionada";
  const hasJustificationData = justifications && justifications.length > 0;

  const { selectedFiltro, searchTerm, enableMultiFilter, multiFilters } = filterOptions;
  const hasFiltersApplied = Boolean(
    selectedFiltro ||
    searchTerm ||
    (enableMultiFilter && Object.values(multiFilters).some(value => value))
  );
  const handleBackToCompetences = () => {
    router.push('/dashboard/justificacionesInstructor');
  };
  
  const renderContent = () => {
    if (isLoadingCompetences) {
      return (
        <div className="flex justify-center items-center py-8">
          <div className="text-gray-600">Cargando competencias disponibles...</div>
        </div>
      );
    }

    if (availableCompetences.length === 0) {
      return (
        <EmptyState message="No se encontraron competencias disponibles para este instructor." />
      );
    }

    if (!selectedCompetenceId) {
      return (
        <EmptyState message="Selecciona una competencia para ver las justificaciones correspondientes." />
      );
    }

    if (errorMessage) {
      return <EmptyState message={errorMessage} />;
    }

    if (loading && !hasJustificationData) {
      return (
        <div className="flex justify-center items-center py-8">
          <div className="text-gray-600">
            Cargando justificaciones para {competenceName}...
          </div>
        </div>
      );
    }

    return (
      <JustificationTable
        filteredData={fichaFilteredData}
        handleDownloadFile={handleDownloadFile}
        handleStatusChange={handleStatusChange}
        hasAnyData={fichaFilteredData.length > 0}
        isLoading={loading}
        hasError={Boolean(error)}
        hasFiltersApplied={hasFiltersApplied}
        isInstructorView={true}
      />
    );
  };

  return (
    <div className="space-y-6">
        <PageTitle onBack={() => router.back()}>
          {getPageTitle()}
        </PageTitle>

      {/* Filtros */}
      {selectedCompetenceId && !isLoadingCompetences && (
        <>          
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
        </>
      )}

      {/* Contenido principal */}
      {renderContent()}
    </div>
  );
};
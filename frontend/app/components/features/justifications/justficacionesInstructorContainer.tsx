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
// import { CompetenceSelector } from "./components/CompetenceSelector";
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
  debugCompareJustifications,
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

export const JustificacionesInstructorContainer: React.FC<JustificacionesInstructorContainerProps> = ({ 
  competenceQuarterId,
  fichaNumber 
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { showLoader, hideLoader } = useLoader();

  console.log("🔄 JustificacionesInstructorContainer iniciado con:", {
    competenceQuarterId,
    fichaNumber
  });

  // Estados locales para gestión de competencias
  const [availableCompetences, setAvailableCompetences] = useState<CompetenceOption[]>([]);
  const [selectedCompetenceId, setSelectedCompetenceId] = useState<string>(competenceQuarterId?.toString() || '');
  const [isLoadingCompetences, setIsLoadingCompetences] = useState(true);
  const [fichaFilteredData, setFichaFilteredData] = useState<any[]>([]);

  // Acceso directo al estado de Redux - usando los nuevos campos para competence quarter
  const justificationState = useSelector((state: RootState) => state.justification);
  
  // Extraer propiedades del estado
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

  // Efecto inicial para cargar estados y activar modo competence quarter
  useEffect(() => {
    dispatch(fetchAllJustificationStatuses({ page: 0, size: 3 }));
    dispatch(setCompetenceQuarterMode(true));
  }, [dispatch]);

  // Efecto para cargar las competencias disponibles
  useEffect(() => {
    const loadCompetences = async () => {
      try {
        setIsLoadingCompetences(true);
        console.log("🔄 Cargando competencias disponibles para justificaciones...");
        
        const result = await dispatch(fetchStudySheetByTeacher({ 
          idTeacher: TEMPORAL_INSTRUCTOR_ID, 
          page: 0, 
          size: 20 
        }));
        
        if (fetchStudySheetByTeacher.fulfilled.match(result)) {
          const studySheets = result.payload?.data || [];
          
          // Extraer competencias únicas de todas las fichas
          const competencesMap = new Map<string, CompetenceOption>();
          
          studySheets.forEach((sheet: any) => {
            if (sheet.teacherStudySheets) {
              sheet.teacherStudySheets.forEach((tss: any) => {
                if (tss.competence && tss.competence.id && tss.competence.name) {
                  const competenceId = tss.competence.id;
                  if (!competencesMap.has(competenceId)) {
                    competencesMap.set(competenceId, {
                      id: competenceId,
                      name: tss.competence.name,
                      studySheetNumber: sheet.number
                    });
                  }
                }
              });
            }
          });
          
          const competencesArray = Array.from(competencesMap.values())
            .sort((a, b) => a.name.localeCompare(b.name));
          
          console.log("✅ Competencias cargadas:", competencesArray.length);
          setAvailableCompetences(competencesArray);
          
          // Si hay un competenceQuarterId de prop, verificar que exista en la lista
          if (competenceQuarterId) {
            const exists = competencesArray.find(c => c.id === competenceQuarterId.toString());
            if (exists) {
              setSelectedCompetenceId(competenceQuarterId.toString());
            } else {
              console.warn("⚠️ La competencia especificada no se encuentra en las disponibles");
            }
          }
          
        } else {
          console.error("❌ Error al cargar las competencias");
        }
      } catch (error) {
        console.error('❌ Error loading competences:', error);
      } finally {
        setIsLoadingCompetences(false);
      }
    };

    loadCompetences();
  }, [dispatch, competenceQuarterId]);

  // Efecto para cargar justificaciones cuando cambia la competencia seleccionada
  useEffect(() => {
    if (selectedCompetenceId && !isLoadingCompetences) {
      const competenceId = parseInt(selectedCompetenceId);
      if (!isNaN(competenceId)) {
        console.log("📋 Cargando justificaciones para competencia:", competenceId, "ficha:", fichaNumber);
        dispatch(fetchJustificationsByCompetenceQuarter({ competenceQuarterId: competenceId }))
          .unwrap()
          .then((data) => {
            console.log("✅ Justificaciones cargadas:", data.length, "items");
            console.log("📊 Muestra de datos recibidos:", data.slice(0, 2));
          })
          .catch((error) => {
            console.error("❌ Error al cargar justificaciones:", error);
          });
      }
    }
  }, [selectedCompetenceId, isLoadingCompetences, dispatch, fichaNumber]);

  // Efecto para filtrar por ficha cuando sea necesario
  useEffect(() => {
    if (fichaNumber && filteredData) {
      console.log("🔍 Filtrando justificaciones por ficha:", fichaNumber);
      console.log("📊 Datos originales:", filteredData.length);
      
      // Inspeccionar la estructura del primer elemento para debugging
      if (filteredData.length > 0) {
        console.log("🔍 Estructura del primer elemento:", Object.keys(filteredData[0]));
        console.log("🔍 Primer elemento completo:", filteredData[0]);
      }
      
      const filtered = filteredData.filter((item: any) => {
        // Buscar el número de ficha - ahora debería estar en el campo 'ficha'
        const itemFichaNumber = item.ficha || 
                               item.fichaNumero || 
                               item.studySheetNumber || 
                               item.numeroFicha || 
                               item.studySheet?.number ||
                               item.attendance?.studySheet?.number;
        
        const matches = itemFichaNumber?.toString() === fichaNumber;
        
        console.log("🔍 Item:", item.id, {
          ficha: item.ficha,
          fichaNumero: item.fichaNumero,
          studySheetNumber: item.studySheetNumber,
          numeroFicha: item.numeroFicha,
          studySheetNested: item.studySheet?.number,
          attendanceStudySheet: item.attendance?.studySheet?.number,
          itemFichaNumber,
          fichaTarget: fichaNumber,
          matches
        });
        
        return matches;
      });
      
      console.log("📊 Datos filtrados por ficha:", filtered.length, "de", filteredData.length, "total");
      setFichaFilteredData(filtered);
    } else {
      console.log("🔍 No hay filtro de ficha o no hay datos - usando todos los datos");
      setFichaFilteredData(filteredData || []);
    }
  }, [filteredData, fichaNumber]);

  // Gestión del loader
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
    console.log("🔄 Cambiando competencia seleccionada a:", competenceId);
    setSelectedCompetenceId(competenceId);
    
    // Actualizar la URL para reflejar la nueva competencia, manteniendo el parámetro de ficha
    if (competenceId) {
      const baseUrl = `/dashboard/justificacionesInstructor/${competenceId}`;
      const urlWithFicha = fichaNumber ? `${baseUrl}?ficha=${fichaNumber}` : baseUrl;
      router.push(urlWithFicha);
    }
  };

  const handleDebugCompare = async () => {
    if (!selectedCompetenceId) return;
    
    const competenceIdNum = parseInt(selectedCompetenceId);
    if (isNaN(competenceIdNum)) return;
    
    console.log("🐛 Iniciando comparación de debugging...");
    try {
      const result = await dispatch(debugCompareJustifications({ competenceQuarterId: competenceIdNum }));
      console.log("🐛 Resultado de debugging:", result);
    } catch (error) {
      console.error("🐛 Error en debugging:", error);
    }
  };

  const handleRefresh = async () => {
    if (!selectedCompetenceId) return;
    
    const competenceIdNum = parseInt(selectedCompetenceId);
    if (isNaN(competenceIdNum)) return;

    console.log("🔄 Refrescando justificaciones para competencia:", selectedCompetenceId);
    
    try {
      const data = await dispatch(fetchJustificationsByCompetenceQuarter({ 
        competenceQuarterId: competenceIdNum 
      })).unwrap();
      
      console.log("✅ Justificaciones refrescadas:", data.length, "items");
      toast.success("Datos actualizados correctamente", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error) {
      console.error("❌ Error al refrescar justificaciones:", error);
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
      return; // No hacer nada si el estado es el mismo
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
        console.error("❌ Error inesperado al actualizar el estado:", error);
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

  const errorMessage = formatErrorMessage(error);
  const selectedCompetence = availableCompetences.find(c => c.id === selectedCompetenceId);
  const competenceName = selectedCompetence?.name || "Ninguna seleccionada";
  const hasJustificationData = justifications && justifications.length > 0;

  // Determinar si hay filtros aplicados
  const { selectedFiltro, searchTerm, enableMultiFilter, multiFilters } = filterOptions;
  const hasFiltersApplied = Boolean(
    selectedFiltro ||
    searchTerm ||
    (enableMultiFilter && Object.values(multiFilters).some(value => value))
  );
  const handleBackToCompetences = () => {
    router.push('/dashboard/justificacionesInstructor');
  };
  // Función para renderizar el contenido principal
  const renderContent = () => {
    // Si está cargando competencias
    if (isLoadingCompetences) {
      return (
        <div className="flex justify-center items-center py-8">
          <div className="text-gray-600">Cargando competencias disponibles...</div>
        </div>
      );
    }

    // Si no hay competencias disponibles
    if (availableCompetences.length === 0) {
      return (
        <EmptyState message="No se encontraron competencias disponibles para este instructor." />
      );
    }

    // Si no hay competencia seleccionada
    if (!selectedCompetenceId) {
      return (
        <EmptyState message="Selecciona una competencia para ver las justificaciones correspondientes." />
      );
    }

    // Si hay error
    if (errorMessage) {
      return <EmptyState message={errorMessage} />;
    }

    // Si está cargando justificaciones
    if (loading && !hasJustificationData) {
      return (
        <div className="flex justify-center items-center py-8">
          <div className="text-gray-600">
            Cargando justificaciones para {competenceName}...
          </div>
        </div>
      );
    }

    // Mostrar tabla con datos
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
          Justificaciones de la Ficha: {fichaNumber || selectedCompetence?.studySheetNumber || 'N/A'} por la {competenceName || 'Competencia'}
        </PageTitle>

      {/* Selector de Competencias */}
      {/* <CompetenceSelector
        competences={availableCompetences}
        selectedCompetenceId={selectedCompetenceId}
        isLoading={isLoadingCompetences}
        onCompetenceChange={handleCompetenceChange}
        onRefresh={handleRefresh}
        isRefreshing={loading}
      /> */}

      {/* Filtros - Solo mostrar si hay competencia seleccionada */}
      {selectedCompetenceId && !isLoadingCompetences && (
        <>
          {/* Botón temporal de debug */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-yellow-800 mb-2">🐛 Debug Tool (Temporal)</h3>
            <p className="text-xs text-yellow-700 mb-3">
              Este botón compara las dos consultas para identificar por qué faltan justificaciones. 
              Revisa la consola del navegador después de hacer click.
            </p>
            <button
              onClick={handleDebugCompare}
              className="bg-yellow-600 text-white px-4 py-2 rounded text-sm hover:bg-yellow-700"
            >
              🔍 Comparar Consultas (Ver Consola)
            </button>
          </div>
          
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
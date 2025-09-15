"use client";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useRouter, useSearchParams } from "next/navigation";
import type { AppDispatch } from "@/redux/store";
import PageTitle from "@components/UI/pageTitle";
import EmptyState from "@components/UI/emptyState";
import { useLoader } from "@context/LoaderContext";
import { Card, CardGrid } from "@components/UI/Card";
import { fetchStudySheetByTeacher } from "@slice/olympo/studySheetSlice";
import { TEMPORAL_INSTRUCTOR_ID } from "@/temporaryCredential";
import { BookOpen, ArrowRight } from "lucide-react";

interface CompetenceOption {
  id: string;
  name: string;
  studySheetNumber?: number;
  originalCompetenceId?: string; // ID original de la competencia
}

export default function JustificacionesInstructorSelector() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showLoader, hideLoader } = useLoader();
  
  // Obtener el número de ficha desde los parámetros de búsqueda
  const fichaNumber = searchParams.get('ficha');
  
  const [availableCompetences, setAvailableCompetences] = useState<CompetenceOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleBackToFichas = () => {
    router.push('/dashboard/FichasInstructor');
  };

  useEffect(() => {
    const loadCompetences = async () => {
      try {
        setLoading(true);
        console.log("🔄 Cargando competencias disponibles para justificaciones...");
        console.log("📋 Filtrando por ficha específica:", fichaNumber);
        
        const result = await dispatch(fetchStudySheetByTeacher({ 
          idTeacher: TEMPORAL_INSTRUCTOR_ID, 
          page: 0, 
          size: 20 
        }));
        
        if (fetchStudySheetByTeacher.fulfilled.match(result)) {
          const studySheets = result.payload?.data || [];
          
          // Filtrar por ficha específica
          const filteredSheets = studySheets.filter((sheet: any) => sheet.number.toString() === fichaNumber);
          
          console.log("📊 Fichas después del filtro:", filteredSheets.length);
          
          // Extraer todas las competencias de la ficha específica
          const allCompetences: CompetenceOption[] = [];
          
          filteredSheets.forEach((sheet: any) => {
            if (sheet.teacherStudySheets) {
              sheet.teacherStudySheets.forEach((tss: any) => {
                if (tss.competence && tss.competence.id && tss.competence.name) {
                  allCompetences.push({
                    id: tss.competence.id, // Usar ID original
                    name: tss.competence.name,
                    studySheetNumber: sheet.number,
                    originalCompetenceId: tss.competence.id
                  });
                }
              });
            }
          });
          
          const competencesArray = allCompetences
            .sort((a, b) => a.name.localeCompare(b.name));
          
          console.log("✅ Competencias cargadas:", competencesArray.length);
          setAvailableCompetences(competencesArray);
          setError(null);
        } else {
          setError("Error al cargar las competencias disponibles");
        }
      } catch (error) {
        console.error('❌ Error loading competences:', error);
        setError("Error al cargar las competencias disponibles");
      } finally {
        setLoading(false);
      }
    };

    loadCompetences();
  }, [dispatch, fichaNumber]);

  const handleCompetenceSelect = (competence: CompetenceOption) => {
    console.log("🎯 Navegando a justificaciones para competencia:", competence.originalCompetenceId || competence.id, "en ficha:", competence.studySheetNumber);
    const competenceId = competence.originalCompetenceId || competence.id;
    router.push(`/dashboard/justificacionesInstructor/${competenceId}?ficha=${competence.studySheetNumber}`);
  };

  const getPageTitle = () => {
    if (fichaNumber) {
      return `Competencias de la Ficha ${fichaNumber}`;
    }
    return "Seleccionar Competencia para Justificaciones";
  };

  useEffect(() => {
    if (loading) {
      showLoader();
    } else {
      hideLoader();
    }
  }, [loading, showLoader, hideLoader]);

  // Función para renderizar cada card de competencia
  const renderCompetenceCard = (competence: CompetenceOption) => (
    <Card
      className="hover:shadow-xl hover:scale-105 cursor-pointer transition-all duration-300 group"
      header={
        <div className="flex items-center justify-between">
          <BookOpen className="h-6 w-6 text-primary dark:text-secondary group-hover:scale-110 transition-transform duration-200" />
          {competence.studySheetNumber && (
            <span className="text-xs bg-primary/10 dark:bg-secondary/10 text-primary dark:text-secondary px-2 py-1 rounded-full">
              Ficha: {competence.studySheetNumber}
            </span>
          )}
        </div>
      }
      body={
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 group-hover:text-primary dark:group-hover:text-secondary transition-colors duration-200">
            {competence.name}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Ver y gestionar justificaciones para esta competencia
          </p>
        </div>
      }
      footer={
        <button
          onClick={() => handleCompetenceSelect(competence)}
          className="w-full flex items-center justify-center gap-2 bg-primary dark:bg-secondary text-white px-4 py-2 rounded-lg hover:bg-primary/90 dark:hover:bg-secondary/90 transition-colors duration-200 group-hover:scale-105"
        >
          Ver Justificaciones
          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
        </button>
      }
    />
  );

  // Función de filtro personalizada para las competencias
  const filterCompetences = (competence: CompetenceOption, filter: string): boolean => {
    return (
      competence.name.toLowerCase().includes(filter.toLowerCase()) ||
      (competence.studySheetNumber ? competence.studySheetNumber.toString().includes(filter) : false)
    );
  };

  // Si no hay ficha especificada, mostrar mensaje de error
  if (!fichaNumber) {
    return (
      <div className="space-y-6">
        <PageTitle onBack={handleBackToFichas}>
          Seleccionar Competencia para Justificaciones
        </PageTitle>
        {/* <div className="flex justify-center">
          <button
            onClick={handleBackToFichas}
            className="px-4 py-2 bg-primary dark:bg-secondary text-white rounded-md hover:bg-primary/90 dark:hover:bg-secondary/90 transition-colors duration-200"
          >
            Volver a Fichas Instructor
          </button>
        </div> */}
        <EmptyState message="No se encontró ficha" />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-6">
          <PageTitle onBack={handleBackToFichas}>
          {getPageTitle()}
        </PageTitle>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
          <PageTitle onBack={handleBackToFichas}>
          {getPageTitle()}
        </PageTitle>
        <EmptyState message={error} />
        <div className="flex justify-center">
          <button
            onClick={handleBackToFichas}
            className="px-4 py-2 bg-primary dark:bg-secondary text-white rounded-md hover:bg-primary/90 dark:hover:bg-secondary/90 transition-colors duration-200"
          >
            Volver a Fichas Instructor
          </button>
        </div>
      </div>
    );
  }

  if (availableCompetences.length === 0) {
    return (
      <div className="space-y-6">
          <PageTitle onBack={handleBackToFichas}>
          {getPageTitle()}
        </PageTitle>
        <EmptyState message={`No se encontraron competencias disponibles para la ficha ${fichaNumber}.`} />
        <div className="flex justify-center">
          <button
            onClick={handleBackToFichas}
            className="px-4 py-2 bg-primary dark:bg-secondary text-white rounded-md hover:bg-primary/90 dark:hover:bg-secondary/90 transition-colors duration-200"
          >
            Volver a Fichas Instructor
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
        <PageTitle onBack={handleBackToFichas}>
        {getPageTitle()}
      </PageTitle>
      
      <CardGrid
        items={availableCompetences}
        renderCard={renderCompetenceCard}
        pageSize={9}
        columns={3}
        filterPlaceholder="Buscar por nombre de competencia..."
        filterFunction={filterCompetences}
        className="mt-6"
      />
    </div>
  );
}
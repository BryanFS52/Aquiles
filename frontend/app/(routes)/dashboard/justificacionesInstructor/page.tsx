"use client";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardGrid } from "@components/UI/Card";
import { fetchStudySheetByTeacher } from "@slice/olympo/studySheetSlice";
import { AppDispatch } from "@/redux/store";
import { useLoader } from "@context/LoaderContext";
import { TEMPORAL_INSTRUCTOR_ID } from "@/temporaryCredential";
import { BookOpen, ArrowRight } from "lucide-react";
import PageTitle from "@components/UI/pageTitle";
import EmptyState from "@components/UI/emptyState";

interface CompetenceOption {
  id: string;
  name: string;
  studySheetNumber?: number;
  originalCompetenceId?: string;
  teacherStudySheetId?: string; // 🆕 Agregar para almacenar tss.id
}

export default function JustificacionesInstructorSelector() {
  const [availableCompetences, setAvailableCompetences] = useState<CompetenceOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showLoader, hideLoader } = useLoader();
  const fichaNumber = searchParams.get('ficha');

  const handleBackToFichas = () => {
    router.push('/dashboard/FichasInstructor');
  };

  const handleCompetenceSelect = (competence: CompetenceOption) => {
    // 🆕 Usar teacherStudySheetId como competenceQuarterId
    const competenceQuarterId = competence.teacherStudySheetId || competence.id;
    console.log('🔍 [Selector] Selected competence:', competence);
    console.log('✅ [Selector] Using competenceQuarterId (tss.id):', competenceQuarterId);
    
    router.push(`/dashboard/justificacionesInstructor/${competenceQuarterId}?ficha=${competence.studySheetNumber}`);
  };

  const getPageTitle = () => {
    if (fichaNumber) {
      return `Competencias de la Ficha ${fichaNumber}`;
    }
    return "Seleccionar Competencia para Justificaciones";
  };

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

  const filterCompetences = (competence: CompetenceOption, filter: string): boolean => {
    return (
      competence.name.toLowerCase().includes(filter.toLowerCase()) ||
      (competence.studySheetNumber ? competence.studySheetNumber.toString().includes(filter) : false)
    );
  };

  useEffect(() => {
    const loadCompetences = async () => {
      try {
        setLoading(true);
        
        console.log('🔍 [Selector] Loading competences for ficha:', fichaNumber);
        console.log('🔍 [Selector] TEMPORAL_INSTRUCTOR_ID:', TEMPORAL_INSTRUCTOR_ID);
        
        const result = await dispatch(fetchStudySheetByTeacher({ 
          idTeacher: TEMPORAL_INSTRUCTOR_ID, 
          page: 0, 
          size: 20 
        }));
        
        console.log('🔍 [Selector] Dispatch result:', result);
        
        if (fetchStudySheetByTeacher.fulfilled.match(result)) {
          const studySheets = result.payload?.data || [];
          console.log('🔍 [Selector] All study sheets:', studySheets);
          console.log('🔍 [Selector] Looking for ficha:', fichaNumber);
          
          // 🔍 Ver todos los números de ficha disponibles
          const availableFichas = studySheets.map((sheet: any) => sheet.number);
          console.log('🔍 [Selector] Available fichas:', availableFichas);
          
          const filteredSheets = studySheets.filter((sheet: any) => {
            const sheetNumber = sheet.number.toString();
            const targetFicha = fichaNumber;
            console.log(`🔍 [Selector] Comparing: sheet.number="${sheetNumber}" with fichaNumber="${targetFicha}"`);
            return sheetNumber === targetFicha;
          });
          
          console.log('🔍 [Selector] Filtered sheets for ficha', fichaNumber, ':', filteredSheets);
          
          const allCompetences: CompetenceOption[] = [];
          
          filteredSheets.forEach((sheet: any, sheetIndex) => {
            console.log(`🔍 [Selector] Processing sheet ${sheetIndex}:`, sheet);
            
            if (sheet.teacherStudySheets && sheet.teacherStudySheets.length > 0) {
              console.log(`🔍 [Selector] teacherStudySheets for sheet ${sheetIndex}:`, sheet.teacherStudySheets);
              
              interface TeacherStudySheetCompetence {
                id: string;
                name: string;
              }

              interface TeacherStudySheet {
                id: string;
                competence: TeacherStudySheetCompetence;
              }

              interface StudySheet {
                id: string;
                number: number;
                teacherStudySheets: TeacherStudySheet[];
              }

                            sheet.teacherStudySheets.forEach((tss: TeacherStudySheet, tssIndex: number) => {
                              console.log(`🔍 [Selector] Processing tss ${tssIndex}:`, tss);
                              
                              if (tss.competence && tss.competence.id && tss.competence.name && tss.id) {
                                const competenceOption: CompetenceOption = {
                                  id: tss.competence.id,
                                  name: tss.competence.name,
                                  studySheetNumber: sheet.number,
                                  originalCompetenceId: tss.competence.id,
                                  teacherStudySheetId: tss.id // 🆕 Usar tss.id como competenceQuarterId
                                };
                                
                                console.log('✅ [Selector] Adding competence with tss.id:', competenceOption);
                                allCompetences.push(competenceOption);
                              } else {
                                console.log('⚠️ [Selector] Skipping tss due to missing data:', {
                                  hasCompetence: !!tss.competence,
                                  competenceId: tss.competence?.id,
                                  competenceName: tss.competence?.name,
                                  tssId: tss.id
                                });
                              }
                            });
            } else {
              console.log('⚠️ [Selector] No teacherStudySheets found for sheet:', sheet.id);
            }
          });
          
          console.log('🔍 [Selector] All competences found:', allCompetences);
          
          const competencesArray = allCompetences
            .sort((a, b) => a.name.localeCompare(b.name));
          
          console.log('🔍 [Selector] Final sorted competences:', competencesArray);
          
          setAvailableCompetences(competencesArray);
          setError(null);
        } else {
          console.error('❌ [Selector] Failed to fetch study sheets:', result);
          setError("Error al cargar las competencias disponibles");
        }
      } catch (error) {
        console.error('❌ [Selector] Error loading competences:', error);
        setError("Error al cargar las competencias disponibles");
      } finally {
        setLoading(false);
      }
    };

    if (fichaNumber) {
      loadCompetences();
    } else {
      console.warn('⚠️ [Selector] No fichaNumber provided');
      setLoading(false);
    }
  }, [dispatch, fichaNumber]);

  useEffect(() => {
    if (loading) {
      showLoader();
    } else {
      hideLoader();
    }
  }, [loading, showLoader, hideLoader]);

  if (!fichaNumber) {
    return (
      <div className="space-y-6">
        <PageTitle onBack={handleBackToFichas}>
          Seleccionar Competencia para Justificaciones
        </PageTitle>
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
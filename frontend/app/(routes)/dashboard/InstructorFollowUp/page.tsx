"use client";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardGrid } from "@/components/UI/Card";
import PageTitle from "@components/UI/pageTitle";
import { AppDispatch } from "@redux/store";
import { fetchStudySheetByTeacher } from "@/redux/slices/olympo/studySheetSlice";
import { useLoader } from "@context/LoaderContext";
import { BookOpen, ArrowRight } from "lucide-react";
import { TEMPORAL_INSTRUCTOR_ID } from "@/temporaryCredential";
import EmptyState from "@/components/UI/emptyState";
import { CompetenceOption } from "@/components/features/InstructorFollowUp/types";

export default function CompetenceSelectionPage() {
  const [availableCompetences, setAvailableCompetences] = useState<CompetenceOption[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCompetence, setSelectedCompetence] = useState<CompetenceOption | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showLoader, hideLoader } = useLoader();
  const fichaNumber = searchParams.get('ficha');


  const handleCompetenceSelect = (competence: CompetenceOption) => {
    const competenceQuarterId = competence.teacherStudySheetId || competence.id;
    router.push(`/dashboard/InstructorFollowUp/${competenceQuarterId}?ficha=${competence.studySheetNumber}`);
  };

  const getPageTitle = () => {
    if (fichaNumber) {
      return `Competencias de la Ficha ${fichaNumber}`;
    }
    return "Seleccionar Competencia para ver asistencias";
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
            Ver y gestionar asistencias para esta competencia
          </p>
        </div>
      }
      footer={
        <button
          onClick={() => handleCompetenceSelect(competence)}
          className="w-full flex items-center justify-center gap-2 bg-primary dark:bg-secondary text-white px-4 py-2 rounded-lg hover:bg-primary/90 dark:hover:bg-secondary/90 transition-colors duration-200 group-hover:scale-105"
        >
          Seguimiento
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
      showLoader();
      try {
        const result = await dispatch(fetchStudySheetByTeacher({ 
          idTeacher: TEMPORAL_INSTRUCTOR_ID, 
          page: 0, 
          size: 20 
        }));
        
        if (fetchStudySheetByTeacher.fulfilled.match(result)) {
          const studySheets = result.payload?.data || [];
          const filteredSheets = studySheets.filter((sheet: any) => sheet.number.toString() === fichaNumber);
          const allCompetences: CompetenceOption[] = [];
          
          filteredSheets.forEach((sheet: any) => {
            if (sheet.teacherStudySheets) {
              sheet.teacherStudySheets.forEach((tss: any) => {
                if (tss.competence && tss.competence.id && tss.competence.name) {
                  const competenceOption = {
                    id: tss.competence.id,
                    name: tss.competence.name,
                    studySheetNumber: sheet.number,
                    originalCompetenceId: tss.competence.id,
                    teacherStudySheetId: tss.id
                  };
                  
                  allCompetences.push(competenceOption);
                }
              });
            }
          });
        
          const competencesArray = allCompetences
            .sort((a, b) => a.name.localeCompare(b.name));
        
          setAvailableCompetences(competencesArray);
          setError(null);
        } else {
          setError("Error al cargar las competencias disponibles");
        }
      } catch (error) {
        console.error('Error loading competences:', error);
        setError("Error al cargar las competencias disponibles");
      } finally {
        hideLoader();
      }
    };

    loadCompetences();
  }, [dispatch, fichaNumber]);

  if (!fichaNumber) {
    return (
      <div className="space-y-6">
        <PageTitle onBack={() => router.back()}>
          Seleccionar Competencia para el seguimiento
        </PageTitle>
        <EmptyState message="No se encontró ficha" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <PageTitle onBack={() => router.back()}>
          {getPageTitle()}
        </PageTitle>
        <EmptyState message={error} />
        <div className="flex justify-center">
          <button
            onClick={() => router.back()}
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
        <PageTitle onBack={() => router.back()}>
          {getPageTitle()}
        </PageTitle>
        <EmptyState message={`No se encontraron competencias disponibles para la ficha ${fichaNumber}.`} />
        <div className="flex justify-center">
          <button
            onClick={() => router.back()}
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
      <PageTitle onBack={() => router.back()}>
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
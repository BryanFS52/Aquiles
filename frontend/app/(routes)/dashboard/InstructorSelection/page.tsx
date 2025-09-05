"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@context/UserContext";
import { toast } from "react-toastify";
import PageTitle from "@components/UI/pageTitle";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faUserGroup, 
  faArrowRight, 
  faBook, 
  faUsers,
  faCheckCircle,
  faSpinner
} from "@fortawesome/free-solid-svg-icons";
import { clientLAN } from "@lib/apollo-client";
import { GET_STUDY_SHEET_BY_TEACHER_ID_WITH_TEAM_SCRUM } from "@graphql/olympo/studySheetGraph";

interface StudySheet {
  id: string;
  number: number;
  quarter?: {
    id: string;
    name?: {
      extension: string;
      number: number;
    };
  };
  trainingProject?: {
    name: string;
    program?: {
      name: string;
    };
  };
  teamsScrum?: TeamScrum[];
}

interface TeamScrum {
  id: string;
  teamName: string;
  students: Student[];
}

interface Student {
  id: string;
  person: {
    name: string;
    lastname: string;
    document: string;
  };
}

export default function InstructorSelection() {
  const router = useRouter();
  const { user } = useUser();
  const [selectedStudySheet, setSelectedStudySheet] = useState<StudySheet | null>(null);
  const [selectedTeamScrum, setSelectedTeamScrum] = useState<TeamScrum | null>(null);
  const [step, setStep] = useState(1); // 1: Seleccionar ficha, 2: Seleccionar team scrum
  const [studySheets, setStudySheets] = useState<StudySheet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Limpiar localStorage al cargar el componente
  useEffect(() => {
    // Limpiar datos de team scrum seleccionado anteriormente
    localStorage.removeItem('selectedStudySheetId');
    localStorage.removeItem('selectedTeamScrumId');
    localStorage.removeItem('selectedStudySheetNumber');
    localStorage.removeItem('selectedTeamScrumName');
    
    // Limpiar datos específicos de evaluaciones
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('itemStates_') || key.startsWith('evaluationData_')) {
        localStorage.removeItem(key);
      }
    });
  }, []);

  // Cargar fichas asignadas al instructor
  useEffect(() => {
    const loadStudySheets = async () => {
      if (!user?.id) return;

      try {
        setLoading(true);
        setError(null);

        const { data } = await clientLAN.query({
          query: GET_STUDY_SHEET_BY_TEACHER_ID_WITH_TEAM_SCRUM,
          variables: { 
            idTeacher: user.id,
            page: 0, 
            size: 50 
          },
          fetchPolicy: 'no-cache'
        });

        const loadedStudySheets = data?.allStudySheets?.data || [];
        setStudySheets(loadedStudySheets);
      } catch (err: any) {
        console.error("Error loading study sheets:", err);
        setError("Error al cargar las fichas asignadas");
        toast.error("Error al cargar las fichas asignadas");
      } finally {
        setLoading(false);
      }
    };

    loadStudySheets();
  }, [user?.id]);

  const handleStudySheetSelection = (studySheet: StudySheet) => {
    setSelectedStudySheet(studySheet);
    setSelectedTeamScrum(null); // Resetear selección de team scrum
    setStep(2);
  };

  const handleTeamScrumSelection = (teamScrum: TeamScrum) => {
    setSelectedTeamScrum(teamScrum);
  };

  const handleBackToStudySheets = () => {
    setStep(1);
    setSelectedStudySheet(null);
    setSelectedTeamScrum(null);
  };

  const handleProceedToChecklist = () => {
    if (!selectedStudySheet || !selectedTeamScrum) {
      toast.error("Debe seleccionar una ficha y un team scrum");
      return;
    }

    // Guardar la selección en localStorage para persistencia
    localStorage.setItem('selectedStudySheetId', selectedStudySheet.id);
    localStorage.setItem('selectedTeamScrumId', selectedTeamScrum.id);
    localStorage.setItem('selectedStudySheetNumber', selectedStudySheet.number.toString());
    localStorage.setItem('selectedTeamScrumName', selectedTeamScrum.teamName);

    // Navegar a la vista de lista de chequeo del instructor
    router.push('/dashboard/ListaChequeoInstructor');
  };

  if (loading) {
    return (
      <div className="w-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 min-h-screen">
        <div className="p-6 space-y-8">
          <PageTitle>Selección de Ficha y Team Scrum</PageTitle>
          <div className="flex justify-center items-center py-16">
            <div className="text-center">
              <FontAwesomeIcon 
                icon={faSpinner} 
                className="text-4xl text-lime-600 dark:text-shadowBlue animate-spin mb-4" 
              />
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                Cargando fichas asignadas...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!studySheets.length) {
    return (
      <div className="w-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 min-h-screen">
        <div className="p-6 space-y-8">
          <PageTitle>Selección de Ficha y Team Scrum</PageTitle>
          <div className="flex justify-center items-center py-16">
            <div className="text-center">
              <FontAwesomeIcon 
                icon={faBook} 
                className="text-6xl text-gray-400 mb-6" 
              />
              <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-2">
                No hay fichas asignadas
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                No tienes fichas asignadas para realizar evaluaciones.
              </p>
              <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
                Contacta al coordinador para que te asigne fichas.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 min-h-screen">
      <div className="p-6 space-y-8">
        <PageTitle>Selección de Ficha y Team Scrum</PageTitle>

        {/* Indicador de pasos */}
        <div className="flex items-center justify-center space-x-4 mb-8">
          <div className={`flex items-center space-x-2 ${step >= 1 ? 'text-lime-600 dark:text-shadowBlue' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
              step >= 1 
                ? 'bg-lime-600 dark:bg-shadowBlue border-lime-600 dark:border-shadowBlue text-white' 
                : 'border-gray-300 text-gray-400'
            }`}>
              {step > 1 ? <FontAwesomeIcon icon={faCheckCircle} /> : '1'}
            </div>
            <span className="font-medium">Seleccionar Ficha</span>
          </div>
          
          <div className={`h-1 w-12 ${step >= 2 ? 'bg-lime-600 dark:bg-shadowBlue' : 'bg-gray-300'}`}></div>
          
          <div className={`flex items-center space-x-2 ${step >= 2 ? 'text-lime-600 dark:text-shadowBlue' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
              step >= 2 
                ? 'bg-lime-600 dark:bg-shadowBlue border-lime-600 dark:border-shadowBlue text-white' 
                : 'border-gray-300 text-gray-400'
            }`}>
              2
            </div>
            <span className="font-medium">Seleccionar Team Scrum</span>
          </div>
        </div>

        {/* Paso 1: Selección de ficha */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-darkBlue dark:text-white mb-2">
                Selecciona la ficha a evaluar
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Estas son las fichas que tienes asignadas como instructor
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {studySheets.map((studySheet) => (
                <div 
                  key={studySheet.id}
                  onClick={() => handleStudySheetSelection(studySheet)}
                  className="bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-lime-500 dark:hover:border-shadowBlue shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group p-6"
                >
                  <div className="text-center">
                    <div className="mb-4">
                      <FontAwesomeIcon 
                        icon={faBook} 
                        className="text-4xl text-lime-600 dark:text-shadowBlue group-hover:scale-110 transition-transform duration-300" 
                      />
                    </div>
                    
                    <h3 className="text-xl font-bold text-darkBlue dark:text-white mb-2">
                      Ficha N° {studySheet.number}
                    </h3>
                    
                    <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                      <p>
                        <strong>Programa:</strong> {studySheet.trainingProject?.program?.name || 'N/A'}
                      </p>
                      <p>
                        <strong>Proyecto:</strong> {studySheet.trainingProject?.name || 'N/A'}
                      </p>
                      <p>
                        <strong>Trimestre:</strong> {studySheet.quarter?.name?.number || 'N/A'} - {studySheet.quarter?.name?.extension || 'N/A'}
                      </p>
                      <p className="flex items-center justify-center space-x-1">
                        <FontAwesomeIcon icon={faUsers} />
                        <span>{studySheet.teamsScrum?.length || 0} Teams Scrum</span>
                      </p>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                      <div className="flex items-center justify-center space-x-2 text-lime-600 dark:text-shadowBlue group-hover:text-lime-700 dark:group-hover:text-blue-400">
                        <span className="font-medium">Seleccionar</span>
                        <FontAwesomeIcon icon={faArrowRight} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Paso 2: Selección de Team Scrum */}
        {step === 2 && selectedStudySheet && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-darkBlue dark:text-white mb-2">
                Selecciona el Team Scrum a evaluar
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Ficha N° {selectedStudySheet.number} - {selectedStudySheet.trainingProject?.name || 'Proyecto no especificado'}
              </p>
            </div>

            {!selectedStudySheet.teamsScrum || selectedStudySheet.teamsScrum.length === 0 ? (
              <div className="text-center py-16">
                <FontAwesomeIcon 
                  icon={faUserGroup} 
                  className="text-6xl text-gray-400 mb-6" 
                />
                <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-2">
                  No hay Teams Scrum
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  Esta ficha no tiene Teams Scrum creados.
                </p>
                <button
                  onClick={handleBackToStudySheets}
                  className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Volver a Fichas
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {selectedStudySheet.teamsScrum?.map((teamScrum) => (
                    <div 
                      key={teamScrum.id}
                      onClick={() => handleTeamScrumSelection(teamScrum)}
                      className={`bg-white dark:bg-gray-800 rounded-xl border-2 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group p-6 ${
                        selectedTeamScrum?.id === teamScrum.id
                          ? 'border-lime-500 dark:border-shadowBlue bg-lime-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-lime-500 dark:hover:border-shadowBlue'
                      }`}
                    >
                      <div className="text-center">
                        <div className="mb-4">
                          <FontAwesomeIcon 
                            icon={faUserGroup} 
                            className={`text-4xl group-hover:scale-110 transition-transform duration-300 ${
                              selectedTeamScrum?.id === teamScrum.id
                                ? 'text-lime-600 dark:text-shadowBlue'
                                : 'text-gray-500 group-hover:text-lime-600 dark:group-hover:text-shadowBlue'
                            }`} 
                          />
                        </div>
                        
                        <h3 className="text-xl font-bold text-darkBlue dark:text-white mb-3">
                          {teamScrum.teamName}
                        </h3>
                        
                        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                          <p className="flex items-center justify-center space-x-1">
                            <FontAwesomeIcon icon={faUsers} />
                            <span>{teamScrum.students.length} Integrantes</span>
                          </p>
                          
                          {teamScrum.students.length > 0 && (
                            <div className="mt-3">
                              <p className="font-medium mb-1">Integrantes:</p>
                              <div className="text-xs space-y-1">
                                {teamScrum.students.map((student) => (
                                  <div key={student.id}>
                                    {student.person.name} {student.person.lastname}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {selectedTeamScrum?.id === teamScrum.id && (
                          <div className="mt-4 pt-4 border-t border-lime-200 dark:border-blue-600">
                            <div className="flex items-center justify-center space-x-2 text-lime-600 dark:text-shadowBlue">
                              <FontAwesomeIcon icon={faCheckCircle} />
                              <span className="font-medium">Seleccionado</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Botones de navegación */}
                <div className="flex justify-between items-center mt-8">
                  <button
                    onClick={handleBackToStudySheets}
                    className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
                  >
                    Volver a Fichas
                  </button>

                  <button
                    onClick={handleProceedToChecklist}
                    disabled={!selectedTeamScrum}
                    className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                      selectedTeamScrum
                        ? 'bg-lime-600 dark:bg-shadowBlue text-white hover:bg-lime-700 dark:hover:bg-blue-600'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    Continuar a Lista de Chequeo
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

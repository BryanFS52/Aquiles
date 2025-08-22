"use client";

import React, { useState } from "react";
import { CSSTransition, SwitchTransition } from "react-transition-group";
import { useUser } from "@context/UserContext";
import { useQuery, useMutation } from "@apollo/client";
import PageTitle from "@components/UI/pageTitle";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserGroup, faArrowLeft, faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { GET_STUDY_SHEET_BY_TEACHER_ID_WITH_TEAM_SCRUM } from "@graphql/olympo/studySheetGraph";
import { GET_ALL_CHECKLISTS } from "@graphql/checklistGraph";
import { ADD_EVALUATION } from "@graphql/evaluationsGraph";

interface Ficha {
  id: string;
  number: number;
}
interface TeamScrum {
  id: string;
  teamName: string;
}
interface ChecklistItem {
  id: string;
  indicator: string;
  active: boolean;
}

export default function ListaChequeoInstructorPasoAPaso() {
  const [step, setStep] = useState(1);
  const [selectedFicha, setSelectedFicha] = useState<string | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [checklist, setChecklist] = useState<{ [key: string]: boolean }>({});
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Obtener el id del instructor real desde el contexto
  const { user } = useUser();
  const idTeacher = user?.id;
  const { data: studySheetsData } = useQuery(GET_STUDY_SHEET_BY_TEACHER_ID_WITH_TEAM_SCRUM, {
    skip: !idTeacher,
    variables: { idTeacher, page: 1, size: 10 }
  });
  const fichas: Ficha[] = studySheetsData?.allStudySheets?.data?.map((f: any) => ({ id: f.id, number: f.number })) || [];
  const teams: TeamScrum[] = selectedFicha
    ? (studySheetsData?.allStudySheets?.data?.find((f: any) => f.id === selectedFicha)?.teamsScrum || [])
    : [];

  // Obtener checklist del team scrum seleccionado
  const { data: checklistData } = useQuery(GET_ALL_CHECKLISTS, {
    skip: !selectedTeam,
    variables: { page: 1, size: 10 }
  });
  const checklistObj = checklistData?.allChecklists?.data?.find((c: any) => c.studySheets === selectedFicha && c.teamScrum?.id === selectedTeam);
  const checklistItems: ChecklistItem[] = checklistObj?.items || [];

  // Mutación para guardar evaluación
  const [addEvaluation] = useMutation(ADD_EVALUATION);

  // Validaciones y animaciones
  const canGoToTeams = fichas.length > 0 && selectedFicha;
  const canGoToChecklist = teams.length > 0 && selectedTeam;
  const canSubmit = checklistItems.length > 0;

  // Mensajes de error
  React.useEffect(() => {
    if (step === 1 && fichas.length === 0) setError("No tienes fichas asignadas.");
    else if (step === 2 && teams.length === 0) setError("No hay equipos scrum para la ficha seleccionada.");
    else if (step === 3 && checklistItems.length === 0) setError("No hay checklist disponible para este team scrum.");
    else setError(null);
  }, [step, fichas.length, teams.length, checklistItems.length]);

  // Animaciones de transición entre cards
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-[#071426]">
      <SwitchTransition mode="out-in">
        <CSSTransition key={step} timeout={350} classNames="fade">
          <div className="w-full flex flex-col items-center">
            {error && (
              <div className="mb-4 text-red-600 dark:text-red-400 font-semibold text-center animate-pulse">{error}</div>
            )}
            {step === 1 && (
              <div className="max-w-xl w-full bg-white dark:bg-[#0b1f33] rounded-lg shadow-md p-6 fade-in">
                <PageTitle>Selecciona la ficha</PageTitle>
                <ul className="pl-5 list-disc">
                  {fichas.map((f: Ficha) => (
                    <li key={f.id} className="mb-4">
                      <button
                        className={`w-full text-left py-2 px-4 rounded-lg border border-[#00324d] dark:border-[#40b003] bg-gray-100 dark:bg-gray-700 hover:bg-green-200 transition-colors ${selectedFicha === f.id ? 'bg-green-300 dark:bg-green-800 font-bold' : ''}`}
                        onClick={() => canGoToTeams && setStep(2) && setSelectedFicha(f.id)}
                        disabled={!canGoToTeams}
                      >
                        <FontAwesomeIcon icon={faUserGroup} className="mr-2" /> Ficha {f.number}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {step === 2 && (
              <div className="max-w-xl w-full bg-white dark:bg-[#0b1f33] rounded-lg shadow-md p-6 fade-in">
                <button onClick={() => setStep(1)} className="mb-4 text-[#00324d] dark:text-[#40b003] hover:underline flex items-center"><FontAwesomeIcon icon={faArrowLeft} className="mr-2" /> Volver a fichas</button>
                <PageTitle>Selecciona el Team Scrum</PageTitle>
                <ul className="pl-5 list-disc">
                  {teams.map((team: TeamScrum) => (
                    <li key={team.id} className="mb-4">
                      <button
                        className={`w-full text-left py-2 px-4 rounded-lg border border-[#00324d] dark:border-[#40b003] bg-gray-100 dark:bg-gray-700 hover:bg-green-200 transition-colors ${selectedTeam === team.id ? 'bg-green-300 dark:bg-green-800 font-bold' : ''}`}
                        onClick={() => canGoToChecklist && setStep(3) && setSelectedTeam(team.id)}
                        disabled={!canGoToChecklist}
                      >
                        <FontAwesomeIcon icon={faUserGroup} className="mr-2" /> {team.teamName}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {step === 3 && (
              <div className="max-w-xl w-full bg-white dark:bg-[#0b1f33] rounded-lg shadow-md p-6 fade-in">
                <button onClick={() => setStep(2)} className="mb-4 text-[#00324d] dark:text-[#40b003] hover:underline flex items-center"><FontAwesomeIcon icon={faArrowLeft} className="mr-2" /> Volver a teams</button>
                <PageTitle>Lista de Chequeo</PageTitle>
                <form onSubmit={async e => {
                  e.preventDefault();
                  if (!canSubmit) return;
                  await addEvaluation({ variables: { input: { checklistId: checklistObj?.id, valueJudgment: 'Aprobado', observations: '', recommendations: '' } } });
                  setSubmitted(true);
                }}>
                  <ul className="mb-6">
                    {checklistItems.map(item => (
                      <li key={item.id} className="flex items-center mb-4">
                        <label className="flex-1 text-gray-700 dark:text-gray-300">
                          {item.indicator}
                        </label>
                        <input
                          type="checkbox"
                          checked={!!checklist[item.id]}
                          onChange={e => setChecklist({ ...checklist, [item.id]: e.target.checked })}
                          className="ml-4 w-5 h-5 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500"
                        />
                      </li>
                    ))}
                  </ul>
                  <button
                    type="submit"
                    className={`w-full py-2 px-4 bg-[#00324d] text-white rounded transition-colors ${canSubmit ? 'hover:bg-[#40b003]' : 'opacity-50 cursor-not-allowed'}`}
                    disabled={!canSubmit}
                  >
                    Guardar evaluación
                  </button>
                </form>
                {submitted && (
                  <div className="mt-6 text-green-700 dark:text-green-400 flex items-center animate-bounce">
                    <FontAwesomeIcon icon={faCheckCircle} className="mr-2" /> Evaluación guardada correctamente.
                  </div>
                )}
              </div>
            )}
          </div>
        </CSSTransition>
      </SwitchTransition>
      <style jsx global>{`
        .fade-enter {
          opacity: 0;
          transform: scale(0.98);
        }
        .fade-enter-active {
          opacity: 1;
          transform: scale(1);
          transition: opacity 350ms, transform 350ms;
        }
        .fade-exit {
          opacity: 1;
        }
        .fade-exit-active {
          opacity: 0;
          transform: scale(0.98);
          transition: opacity 350ms, transform 350ms;
        }
        .fade-in {
          animation: fadeIn 0.5s;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

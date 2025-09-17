import { useQuery } from '@apollo/client';
import { GET_EVALUATED_CHECKLISTS_BY_STUDENT } from '../graphql/evaluationsGraph';
import { GET_TEAMS_SCRUM_BY_STUDY_SHEET } from '../graphql/teamsScrumGraph';

// Tipos para la respuesta del estudiante con listas de chequeo evaluadas
export interface StudentEvaluatedChecklist {
  evaluationId: string;
  observations: string;
  recommendations: string;
  valueJudgment: string;
  checklistId: string;
  trimester: string;
  component: string;
  state: string;
  dateAssigned: string;
  studySheets: string;
  trainingProjectName: string;
  teamScrumName: string;
  teamScrumProject: string;
  evaluatedBy: string;
  evaluatedAt: string;
  items: ChecklistItem[];
  completedItems: number;
  totalItems: number;
  completionPercentage: number;
}

interface ChecklistItem {
  id: string;
  code: string;
  indicator: string;
  active: boolean;
}

interface StudySheetData {
  id: string;
  number: string;
  teamsScrum: TeamScrum[];
}

interface TeamScrum {
  id: string;
  teamName: string;
  projectName: string;
  students: Student[];
}

interface Student {
  id: string;
  person: {
    name: string;
    lastname: string;
  };
}

// Hook para obtener las listas de chequeo evaluadas del estudiante
export const useStudentEvaluatedChecklists = (
  studentId: string,
  teamScrumName: string,
  page: number = 0,
  size: number = 10
) => {
  const { data, loading, error, refetch } = useQuery(GET_EVALUATED_CHECKLISTS_BY_STUDENT, {
    variables: { 
      studentId, 
      teamScrumName,
      page, 
      size 
    },
    skip: !studentId || !teamScrumName,
    fetchPolicy: 'cache-and-network',
  });

  return {
    checklistsData: data?.evaluatedChecklistsByStudent,
    loading,
    error,
    refetch,
  };
};

// Hook para obtener información de la ficha con teams scrum
export const useStudySheetWithTeamScrum = (studySheetId: string) => {
  const { data, loading, error } = useQuery(GET_TEAMS_SCRUM_BY_STUDY_SHEET, {
    variables: { studySheetId },
    skip: !studySheetId,
    fetchPolicy: 'cache-and-network',
  });

  // Transformar los datos para que coincidan con la estructura esperada
  const studySheetData = data?.teamsScrumByStudySheet?.data ? {
    id: studySheetId,
    number: data.teamsScrumByStudySheet.data[0]?.studySheet?.number || studySheetId,
    teamsScrum: data.teamsScrumByStudySheet.data
  } : null;

  return {
    studySheetData,
    loading,
    error,
  };
};

// Función para filtrar listas de chequeo por team scrum
export const filterChecklistsByTeamScrum = (
  checklists: StudentEvaluatedChecklist[],
  userTeamScrum: string
): StudentEvaluatedChecklist[] => {
  if (!checklists || !userTeamScrum) return [];
  
  return checklists.filter(checklist => 
    checklist.teamScrumName === userTeamScrum
  );
};

// Función para obtener el team scrum del estudiante
export const getStudentTeamScrum = (
  studySheetData: StudySheetData | null,
  studentId: string
): string | null => {
  if (!studySheetData?.teamsScrum || !studentId) return null;

  for (const team of studySheetData.teamsScrum) {
    const isStudentInTeam = team.students?.some(student => student.id === studentId);
    if (isStudentInTeam) {
      return team.teamName;
    }
  }

  return null;
};

// Función para obtener estadísticas de evaluación
export const getEvaluationStats = (checklists: StudentEvaluatedChecklist[]) => {
  if (!checklists || checklists.length === 0) {
    return {
      totalEvaluations: 0,
      averageCompletion: 0,
      passedEvaluations: 0,
      pendingEvaluations: 0,
    };
  }

  const totalEvaluations = checklists.length;
  const totalCompletion = checklists.reduce((sum, checklist) => sum + checklist.completionPercentage, 0);
  const averageCompletion = totalCompletion / totalEvaluations;
  
  const passedEvaluations = checklists.filter(checklist => 
    ['EXCELENTE', 'BUENO', 'ACEPTABLE'].includes(checklist.valueJudgment?.toUpperCase())
  ).length;
  
  const pendingEvaluations = totalEvaluations - passedEvaluations;

  return {
    totalEvaluations,
    averageCompletion: Math.round(averageCompletion),
    passedEvaluations,
    pendingEvaluations,
  };
};

import { Attendance } from '@graphql/generated';

export interface InstructorFollowUpContainerProps {
  competenceQuarterId: number;
  fichaNumber?: string | null;
  learningOutcomeId?: string | null;
}

interface LearningOutcome {
  id: string;
  name: string;
  description?: string;
  code?: number;
}

export interface CompetenceOption {
  id: string;
  name: string;
  studySheetNumber?: number;
  originalCompetenceId?: string;
  learningOutcomes?: LearningOutcome[];
  teacherStudySheetId?: string;
}

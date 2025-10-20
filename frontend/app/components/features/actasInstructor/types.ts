import { type FinalReport } from '@graphql/generated';

export type StudySheetItem = {
  id: number;
  number: string;
  journey?: { name?: string } | null;
  trainingProject?: { program?: { name?: string } | null } | null;
  teacherStudySheets?: TeacherStudySheetItem[];
};

export type TeacherStudySheetItem = {
  id: number;
  competence?: { name?: string | null } | null;
};

export type FinalReportForm = {
  fileNumber: string;
  objectives: string;
  disciplinaryOffenses: string;
  conclusions: string;
  annexesFiles: File[];
  signatureFile: File | null;
  state: boolean;
  competenceQuarterId: number | null;
};

export type Step = { key: number; label: string; icon: any };

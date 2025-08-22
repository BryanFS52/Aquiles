// Importar tipos generados por GraphQL CodeGen
import type {
    StudySheet,
    Student,
    StudentStudySheet,
    Person
} from '@/graphql/generated';

// Tipos específicos para el módulo de Fichas
export interface FichasState {
    data: StudySheet[];
    loading: boolean;
    error: string | null;
}

export interface FichaInfoProps {
    label: string;
    value?: string | number | null;
}

export interface StudySheetCardProps {
    studySheet: StudySheet;
    onViewApprentices: (studySheet: StudySheet) => void;
    onTakeAttendance: (studySheet: StudySheet) => void;
    loading?: boolean;
}

// Re-exportar tipos para facilitar el uso
export type { StudySheet, Student, StudentStudySheet, Person };

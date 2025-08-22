export interface Person {
    name?: string;
    lastname?: string;
    document?: string;
    email?: string;
    phone?: string;
}

export interface Student {
    id: string | number;
    person?: Person;
}

export interface StudySheet {
    id?: string | number;
    name?: string;
    program?: string;
    number?: string;
    description?: string;
    schedule?: string;
    shift?: string;
}

export interface AttendanceStats {
    presente: number;
    ausente: number;
    justificado: number;
    retardo: number;
}

export interface AttendanceHistory {
    date: string;
    presente: number;
    ausente: number;
    justificado: number;
    retardo: number;
}

export interface AttendanceData {
    date: string;
    attendance: Record<string | number, string>;
    studySheetId?: string | number;
    competenceQuarter?: string | number;
}

export interface Competence {
    id: string | number;
    name: string;
}

export interface AttendanceManualPageProps {
    students: Student[];
    studySheet?: StudySheet | null;
    loading?: boolean;
}

export type AttendanceStatus = 'presente' | 'ausente' | 'justificado' | 'retardo';
export type FilterOption = 'todos' | AttendanceStatus;
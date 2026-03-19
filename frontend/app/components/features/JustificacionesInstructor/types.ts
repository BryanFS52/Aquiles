// Types for Justifications module - Using GraphQL CodeGen types
import { Attendance, JustificationType, JustificationStatus } from '@graphql/generated';
import { FormDataState } from '@slice/justificationSlice';

// Component props interfaces using GraphQL types
export interface AbsenceCardProps {
    attendance: Attendance;
    index: number;
    onJustify: (attendanceId: string) => void;
}

export interface JustificationFormProps {
    form: any; // Using the form from Redux slice
    justificationTypesData: JustificationType[];
    loadingJustificationTypes: boolean;
    loadingJustification: boolean;
    onSave: (e: React.FormEvent) => void;
    onCancel: () => void;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onTextInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onNumericInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onUpdateJustificationTypeId: (value: any) => void;
    fileRef: React.RefObject<File | null>;
    fileInputRefPrev: React.RefObject<HTMLInputElement>;
}

export interface AbsencesListProps {
    absences: Attendance[];
    onShowForm: (attendanceId?: string) => void;
}

export interface JustificationsHistoricalProps {
    data: any[];
    loading: boolean;
    onDownloadFile: (justification: any) => void;
}

// justifications instructor container props
export interface JustificacionesInstructorContainerProps {
competenceQuarterId: number;
fichaNumber?: string | null;
learningOutcomeId?: string | null;
}

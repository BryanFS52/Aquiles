export interface AsistenciaManualContainerProps {
    isDarkMode?: boolean;
    competenceId?: string | null;
    studySheetId?: string | null;
}

// Re-exportar tipos existentes para centralizar
export type {
    AttendanceHistory,
    AttendanceStats,
    AttendanceStatus,
    FilterOption,
    Competence,
} from "@type/pages/attendanceManual";

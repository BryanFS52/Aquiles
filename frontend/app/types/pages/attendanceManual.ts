// Types for attendance manual feature

export type FilterOption = string | 'todos';

export interface Competence {
  id: string | number;
  name: string;
}

export interface AttendanceStats {
  totalStudents?: number;
  presente: number;
  ausente: number;
  justificado: number;
  retardo: number;
}

export type AttendanceStatus = 'presente' | 'ausente' | 'justificado' | 'retardo' | 'Asistió' | 'No asistió' | 'Justificó' | 'Llegó tarde';

// Historial de asistencia por día (con estadísticas)
export interface AttendanceHistory {
  date: string;
  presente: number;
  ausente: number;
  justificado?: number;
  retardo?: number;
}

// Registro individual de asistencia
export interface AttendanceRecord {
  id: string;
  studentName: string;
  studentDocument: string;
  competenceName: string;
  date: string;
  status: AttendanceStatus;
  observations?: string;
}

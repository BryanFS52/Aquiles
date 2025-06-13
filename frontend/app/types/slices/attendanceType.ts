// Tipo para un elemento de asistencia individual
export interface AttendanceItem {
    id: string;
    userId?: string;
    date?: string;
    status?: 'present' | 'absent' | 'late';
    checkInTime?: string;
    checkOutTime?: string;
    notes?: string;
    [key: string]: any;
}

// Estado del slice de asistencias
export interface AttendanceState {
    data: AttendanceItem[];
    loading: boolean;
    error: string | { code?: string; message?: string } | null;
    currentPage: number;
    totalItems: number;
    totalPages: number;
}

// Estado inicial
export const initialAttendanceState: AttendanceState = {
    data: [],
    loading: false,
    error: null,
    currentPage: 0,
    totalItems: 0,
    totalPages: 0,
};
import {
    GetAttendancesQuery,
    GetAttendanceByIdQuery,
    AddAttendanceMutation,
    UpdateAttendanceMutation,
    DeleteAttendanceMutation
} from '@graphql/generated';

// Tipos extraídos de las queries/mutations de GraphQL
export type AttendanceItem = GetAttendancesQuery['allAttendances']['data'][0];
export type AttendancesResponse = GetAttendancesQuery['allAttendances'];
export type SingleAttendance = GetAttendanceByIdQuery['attendanceById'];
export type AddAttendanceResponse = AddAttendanceMutation['addAttendance'];
export type UpdateAttendanceResponse = UpdateAttendanceMutation['updateAttendance'];
export type DeleteAttendanceResponse = DeleteAttendanceMutation['deleteAttendance'];

// Tipo para errores personalizados
export interface AttendanceError {
    code?: string | null;
    message?: string | null;
}

// Tipo para la respuesta de update que incluye id e input
export interface UpdatePayload {
    id: any;
    input: Partial<AttendanceItem>;
    code?: string | null;
    message?: string | null;
}

// Tipo para el payload de rejected actions
export interface RejectedPayload {
    code?: string | null;
    message?: string | null;
}

// Estado del slice de attendance
export interface AttendanceState {
    data: AttendanceItem[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
    loading: boolean;
    error: AttendanceError | string | null;
}

// Estado inicial
export const initialAttendanceState: AttendanceState = {
    data: [],
    totalItems: 0,
    totalPages: 0,
    currentPage: 0,
    loading: false,
    error: null,
};
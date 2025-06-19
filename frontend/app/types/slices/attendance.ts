export interface AttendanceItem {
    id: string;
    attendanceDate: string;
    attendanceState: {
        id: string;
        status: string; // o tiparlo como enum si tienes certeza
    };
    student?: {
        id: string;
    };
}

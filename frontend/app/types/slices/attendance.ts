export interface AttendanceItem {
    id: string;
    attendanceDate: string;
    attendanceState: {
        id: string;
        status: string;
    };
    student: {
        id: string;
        person: {
            name: string;
            lastname: string;
            document: string;
        };
    };
}

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
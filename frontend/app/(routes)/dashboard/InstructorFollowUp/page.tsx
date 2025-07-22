"use client"

import AttendanceTable from "@/components/features/attendance/attendanceTable";
import PageTitle from "@/components/UI/pageTitle";
import { fetchAttendances, formatErrorMessage } from "@/redux/slices/attendanceSlice";
import { AppDispatch, RootState } from "@/redux/store";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AttendanceItem } from "@/types/slices/attendance";

const processAndSummarizeAttendances = (attendances: AttendanceItem[]) => {
    if (!attendances) return [];

    const absences = attendances.filter(
        a => a.attendanceState?.status?.toLowerCase() === 'ausente'
    );

    const summary = absences.reduce((acc, absence) => {
        const studentId = absence.student?.id;
        if (!studentId) return acc;

        if (!acc[studentId]) {
            const person = absence.student.person;
            acc[studentId] = {
                id: studentId,
                documento: person?.document || '',
                aprendiz: `${person?.name || ''} ${person?.lastname || ''}`.trim(),
                cantidad: 0,
            };
        }
        acc[studentId].cantidad += 1;
        return acc;
    }, {} as any);

    return Object.values(summary);
};

export default function InstructorFollowUp() {
    const dispatch = useDispatch<AppDispatch>();
    const {
        data: allAttendances,
        loading,
        error,
    } = useSelector((state: RootState) => state.attendances);

    useEffect(() => {
        dispatch(fetchAttendances({ page: 0, size: 100 })); // Fetch a larger size to get more data
    }, [dispatch]);

    const attendanceSummary = processAndSummarizeAttendances(allAttendances);
    const errorMessage = formatErrorMessage(error);

    return (
        <div>
            <PageTitle>Seguimiento de Ausencias</PageTitle>
            <>
                {errorMessage && (
                    <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                        <p className="text-red-600 dark:text-red-400">{errorMessage}</p>
                    </div>
                )}
                <AttendanceTable
                    data={attendanceSummary}
                    loading={loading}
                />
            </>
        </div>
    );
}

"use client"

import AttendanceTable from "@/components/features/asistencia/attendanceTable";
import PageTitle from "@/components/UI/pageTitle";
import { fetchAttendances } from "@/redux/slices/attendanceSlice";
import { AppDispatch, RootState } from "@/redux/store";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Attendance } from "@graphql/generated";

const processAndSummarizeAttendances = (attendances: Attendance[]) => {
    if (!attendances) return [];

    const absences = attendances.filter(
        a => a.attendanceState?.status?.toLowerCase() === 'ausente'
    );

    const summary = absences.reduce((acc, absence) => {
        const studentId = absence.student?.id;
        if (!studentId) return acc;

        if (!acc[studentId]) {
            const person = absence?.student?.person;
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

    return (
        <div>
            <PageTitle>Seguimiento de Ausencias</PageTitle>
            <>
                <AttendanceTable
                    data={attendanceSummary}
                    loading={loading}
                />
            </>
        </div>
    );
}

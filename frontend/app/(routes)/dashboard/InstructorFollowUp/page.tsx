"use client"

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import AttendanceTable from "@components/features/asistencia/attendanceTable";
import PageTitle from "@components/UI/pageTitle";
import NoveltyModal from "@components/Modals/noveltyModal";
import { fetchAttendances } from "@redux/slices/attendanceSlice";
import { openNoveltyModal } from "@redux/slices/themis/noveltySlice";
import { AppDispatch, RootState } from "@redux/store";
import { Attendance } from "@graphql/generated";

interface StudentSummary {
    id: number;
    documento: string;
    aprendiz: string;
    cantidad: number;
}

const processAndSummarizeAttendances = (attendances: Attendance[]): StudentSummary[] => {
    if (!attendances) return [];

    const absences = attendances.filter(
        a => a.attendanceState?.status?.toLowerCase() === 'ausente'
    );

    const summary = absences.reduce((acc, absence) => {
        const studentId = absence.student?.id;
        if (!studentId) return acc;

        // Convertir el ID de string a number
        const numericStudentId = parseInt(studentId);
        if (isNaN(numericStudentId)) return acc;

        if (!acc[numericStudentId]) {
            const person = absence?.student?.person;
            acc[numericStudentId] = {
                id: numericStudentId,
                documento: person?.document || '',
                aprendiz: `${person?.name || ''} ${person?.lastname || ''}`.trim(),
                cantidad: 0,
            };
        }
        acc[numericStudentId].cantidad += 1;
        return acc;
    }, {} as Record<number, StudentSummary>);

    return Object.values(summary);
};

export default function InstructorFollowUp() {
    const dispatch = useDispatch<AppDispatch>();
    
    const {
        data: allAttendances,
        loading,
        error,
    } = useSelector((state: RootState) => state.attendances);

    const {
        modalOpen: isNoveltyModalOpen,
        loading: noveltyLoading,
        error: noveltyError,
    } = useSelector((state: RootState) => state.novelty);

    useEffect(() => {
        dispatch(fetchAttendances({ page: 0, size: 100 })); // Fetch a larger size to get more data
    }, [dispatch]);

    const attendanceSummary = processAndSummarizeAttendances(allAttendances);

    const handleReportNovelty = async (studentId?: number) => {
        if (!studentId) {
            toast.error("ID de estudiante no válido");
            return;
        }

        // Buscar las ausencias del estudiante en attendanceSummary
        const studentData = attendanceSummary.find((student: StudentSummary) => student.id === studentId);
        const absenceCount = studentData?.cantidad || 0;
        
        // TODO: Obtener el ID del instructor del contexto del usuario logueado
        const teacherId = 1; // Temporal hasta implementar contexto de usuario
        
        try {
            await dispatch(openNoveltyModal({ 
                studentId, 
                teacherId, 
                absenceCount,
                studentName: studentData?.aprendiz || 'Estudiante desconocido',
                studentDocument: studentData?.documento || 'N/A'
            })).unwrap();
        } catch (error: any) {
            console.error('Error opening novelty modal:', error);
            if (error.code === 'INSUFFICIENT_ABSENCES') {
                toast.warn(error.message || 'El estudiante no tiene suficientes ausencias para reportar deserción');
            } else {
                toast.error(error.message || 'Error al abrir modal de novedad');
            }
        }
    };

    const handleCloseNoveltyModal = () => {
        // No necesitamos hacer nada aquí, el modal maneja su propio cierre via Redux
    };

    return (
        <div>
            <PageTitle>Seguimiento de Ausencias</PageTitle>
            
            <AttendanceTable
                data={attendanceSummary}
                loading={loading}
                onReportNovelty={handleReportNovelty}
            />

            {/* Modal de Novedad */}
            <NoveltyModal
                isOpen={isNoveltyModalOpen}
                onClose={handleCloseNoveltyModal}
            />
        </div>
    );
}

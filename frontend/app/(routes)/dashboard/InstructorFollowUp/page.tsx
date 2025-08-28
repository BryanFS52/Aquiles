"use client"

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import AttendanceTable from "@components/features/asistencia/attendanceTable";
import PageTitle from "@components/UI/pageTitle";
import NoveltyModal from "@components/Modals/noveltyModal";
import { fetchAttendances, StudentSummary } from "@redux/slices/attendanceSlice";
import { openNoveltyModal } from "@redux/slices/themis/noveltySlice";
import { AppDispatch, RootState } from "@redux/store";
import { TEMPORAL_APRENDIZ_ID, TEMPORAL_INSTRUCTOR_ID } from "@/temporaryCredential";

// Función temporal para obtener el ID del instructor
// TODO: Reemplazar con autenticación real cuando esté implementada
TEMPORAL_INSTRUCTOR_ID; // Cambiar por el ID real del instructor
const getAuthenticatedInstructorId = (): number => {
    // Opción 1: Desde localStorage (si se almacena ahí)
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
        try {
            const user = JSON.parse(storedUser);
            if (user.id && user.role === 'Instructor') {
                return parseInt(user.id);
            }
        } catch (error) {
            console.warn('Error parsing stored user:', error);
        }
    }

    // Opción 2: Desde una variable de entorno para desarrollo
    const devInstructorId = process.env.NEXT_PUBLIC_DEV_INSTRUCTOR_ID;
    if (devInstructorId && !isNaN(parseInt(devInstructorId))) {
        console.warn('Using development instructor ID:', devInstructorId);
        return parseInt(devInstructorId);
    }

    // Opción 3: Valor por defecto (NO recomendado para producción)
    console.error('No se pudo obtener el ID del instructor autenticado. Usando valor por defecto.');
    return TEMPORAL_INSTRUCTOR_ID; // Cambiar por el ID real del instructor
};

export default function InstructorFollowUp() {
    const dispatch = useDispatch<AppDispatch>();
    
    const {
        data: allAttendances,
        loading,
        error,
        attendanceSummary,
    } = useSelector((state: RootState) => state.attendances);

    const {
        modalOpen: isNoveltyModalOpen,
        loading: noveltyLoading,
        error: noveltyError,
    } = useSelector((state: RootState) => state.novelty);

    useEffect(() => {
        dispatch(fetchAttendances({ page: 0, size: 10 }));
    }, [dispatch]);

    const handleReportNovelty = async (studentId?: number) => {
        if (!studentId) {
            toast.error("ID de estudiante no válido");
            return;
        }

        // Buscar las ausencias del estudiante en attendanceSummary
        const studentData = attendanceSummary.find((student: StudentSummary) => student.id === studentId);
        const absenceCount = studentData?.cantidad || 0;
        
        // Obtener el ID del instructor autenticado
        const TEMPORAL_INSTRUCTOR_ID = getAuthenticatedInstructorId();
        
        console.log('Opening novelty modal with:', { studentId, TEMPORAL_INSTRUCTOR_ID, absenceCount });
        
        try {
            await dispatch(openNoveltyModal({
                studentId,
                teacherId: TEMPORAL_INSTRUCTOR_ID,
                absenceCount,
                studentName: studentData?.aprendiz || 'Estudiante desconocido',
                studentDocument: studentData?.documento || 'N/A'
            })).unwrap();
        } catch (error: any) {
            console.error('Error opening novelty modal:', error);
            if (error.code === 'INSUFFICIENT_ABSENCES') {
                toast.warn(error.message || 'El estudiante no tiene suficientes ausencias e injustificadas para reportar deserción');
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

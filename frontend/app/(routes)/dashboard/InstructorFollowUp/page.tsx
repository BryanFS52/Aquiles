"use client"
// Mal
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
    //: Valor por defecto (NO recomendado para producción)
    // console.error('No se pudo obtener el ID del instructor autenticado. Usando valor por defecto.');
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

        // console.log('Opening novelty modal with:', { studentId, TEMPORAL_INSTRUCTOR_ID, absenceCount });

        try {
            await dispatch(openNoveltyModal({
                studentId,
                teacherId: TEMPORAL_INSTRUCTOR_ID,
                absenceCount,
                studentName: studentData?.aprendiz || 'Estudiante desconocido',
                studentDocument: studentData?.documento || 'N/A'
            })).unwrap();
        } catch (error: any) {
            // console.error('Error opening novelty modal:', error);
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
        <div className="space-y-4 sm:space-y-6 p-2 sm:p-4 md:p-6 lg:p-8">
            <PageTitle>Seguimiento de Ausencias</PageTitle>

            <div className="overflow-x-auto">
                <AttendanceTable
                    data={attendanceSummary}
                    loading={loading}
                    onReportNovelty={handleReportNovelty}
                />
            </div>

            {/* Modal de Novedad */}
            <NoveltyModal
                isOpen={isNoveltyModalOpen}
                onClose={handleCloseNoveltyModal}
            />
        </div>
    );
}

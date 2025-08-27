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
    consecutivas: number;
    limiteSuperado: boolean;
}

const processAndSummarizeAttendances = (attendances: Attendance[]): StudentSummary[] => {
    if (!attendances) return [];

    // Agrupar asistencias por estudiante
    const grouped: Record<string, Attendance[]> = {};
    attendances.forEach(a => {
        const studentId = a.student?.id;
        if (!studentId) return;
        if (!grouped[studentId]) grouped[studentId] = [];
        grouped[studentId].push(a);
    });

    const result: StudentSummary[] = [];
    Object.entries(grouped).forEach(([studentId, attendances]) => {
        const person = attendances[0]?.student?.person;
        // Filtrar ausencias
        const absences = attendances.filter(a => a.attendanceState?.status?.toLowerCase() === 'ausente' && !!a.attendanceDate);
        // Ordenar por fecha (solo si la fecha existe)
        absences.sort((a, b) => {
            const dateA = a.attendanceDate ? new Date(a.attendanceDate).getTime() : 0;
            const dateB = b.attendanceDate ? new Date(b.attendanceDate).getTime() : 0;
            return dateA - dateB;
        });

        // Detectar 3 ausencias seguidas
        let maxConsecutive = 0;
        let currentConsecutive = 1;
        for (let i = 1; i < absences.length; i++) {
            const prevDateStr = absences[i - 1].attendanceDate;
            const currDateStr = absences[i].attendanceDate;
            if (!prevDateStr || !currDateStr) {
                currentConsecutive = 1;
                continue;
            }
            const prevDate = new Date(prevDateStr);
            const currDate = new Date(currDateStr);
            // Si la ausencia es el día siguiente
            if ((currDate.getTime() - prevDate.getTime()) <= 1000 * 60 * 60 * 24 + 1000 * 60 * 60 * 12) { // 1.5 días tolerancia
                currentConsecutive++;
                maxConsecutive = Math.max(maxConsecutive, currentConsecutive);
            } else {
                currentConsecutive = 1;
            }
        }
        if (maxConsecutive === 0 && absences.length > 0) maxConsecutive = 1;

        // Detectar si supera el límite de 5 ausencias
        const totalAbsences = absences.length;
        result.push({
            id: parseInt(studentId),
            documento: person?.document || '',
            aprendiz: `${person?.name || ''} ${person?.lastname || ''}`.trim(),
            cantidad: totalAbsences,
            consecutivas: maxConsecutive,
            limiteSuperado: totalAbsences > 5
        });
    });
    return result;
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

    // Datos quemados para pruebas
    const mockAttendances: Attendance[] = [
        {
            id: '1',
            attendanceDate: '2025-08-01',
            attendanceState: { id: '1', status: 'ausente' },
            student: { id: '101', person: { name: 'Juan', lastname: 'Pérez', document: '12345' } },
        },
        {
            id: '2',
            attendanceDate: '2025-08-02',
            attendanceState: { id: '1', status: 'ausente' },
            student: { id: '101', person: { name: 'Juan', lastname: 'Pérez', document: '12345' } },
        },
        {
            id: '3',
            attendanceDate: '2025-08-03',
            attendanceState: { id: '1', status: 'ausente' },
            student: { id: '101', person: { name: 'Juan', lastname: 'Pérez', document: '12345' } },
        },
        {
            id: '4',
            attendanceDate: '2025-08-05',
            attendanceState: { id: '1', status: 'ausente' },
            student: { id: '102', person: { name: 'Ana', lastname: 'Gómez', document: '67890' } },
        },
        {
            id: '5',
            attendanceDate: '2025-08-10',
            attendanceState: { id: '1', status: 'ausente' },
            student: { id: '102', person: { name: 'Ana', lastname: 'Gómez', document: '67890' } },
        },
        {
            id: '6',
            attendanceDate: '2025-08-19',
            attendanceState: { id: '1', status: 'ausente' },
            student: { id: '102', person: { name: 'Ana', lastname: 'Gómez', document: '67890' } },
        },
        // {
        //     id: '7',
        //     attendanceDate: '2025-08-20',
        //     attendanceState: { id: '1', status: 'ausente' },
        //     student: { id: '102', person: { name: 'Ana', lastname: 'Gómez', document: '67890' } },
        // },
        {
            id: '8',
            attendanceDate: '2025-08-25',
            attendanceState: { id: '1', status: 'ausente' },
            student: { id: '102', person: { name: 'Ana', lastname: 'Gómez', document: '67890' } },
        },
        {
            id: '10',
            attendanceDate: '2025-08-25',
            attendanceState: { id: '1', status: 'ausente' },
            student: { id: '103', person: { name: 'Juan', lastname: 'Lote', document: '26790' } },
        },
        {
            id: '11',
            attendanceDate: '2025-08-27',
            attendanceState: { id: '1', status: 'ausente' },
            student: { id: '103', person: { name: 'Juan', lastname: 'Lote', document: '26790' } },
        },
        {
            id: '12',
            attendanceDate: '2025-08-23',
            attendanceState: { id: '1', status: 'ausente' },
            student: { id: '104', person: { name: 'Luisa', lastname: 'Potes', document: '82460' } },
        },
        {
            id: '12',
            attendanceDate: '2025-08-25',
            attendanceState: { id: '1', status: 'ausente' },
            student: { id: '104', person: { name: 'Luisa', lastname: 'Potes', document: '82460' } },
        },
        {
            id: '12',
            attendanceDate: '2025-08-26',
            attendanceState: { id: '1', status: 'ausente' },
            student: { id: '104', person: { name: 'Luisa', lastname: 'Potes', document: '82460' } },
        },
        {
            id: '12',
            attendanceDate: '2025-08-28',
            attendanceState: { id: '1', status: 'ausente' },
            student: { id: '104', person: { name: 'Luisa', lastname: 'Potes', document: '82460' } },
        },
        {
            id: '12',
            attendanceDate: '2025-08-29',
            attendanceState: { id: '1', status: 'ausente' },
            student: { id: '104', person: { name: 'Luisa', lastname: 'Potes', document: '82460' } },
        },
        {
            id: '12',
            attendanceDate: '2025-09-01',
            attendanceState: { id: '1', status: 'ausente' },
            student: { id: '104', person: { name: 'Luisa', lastname: 'Potes', document: '82460' } },
        },
        {
            id: '12',
            attendanceDate: '2025-08-03',
            attendanceState: { id: '1', status: 'ausente' },
            student: { id: '104', person: { name: 'Luisa', lastname: 'Potes', document: '82460' } },
        },
    ];

    // Usar datos reales si existen, si no usar mock
    const attendanceSummary = processAndSummarizeAttendances(allAttendances && allAttendances.length > 0 ? allAttendances : mockAttendances);

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
            <div style={{marginTop: '2rem'}}>
                {attendanceSummary.map((student) => (
                    <div key={student.id} style={{marginBottom: '1rem', padding: '0.5rem', border: '1px solid #eee', borderRadius: '8px'}}>
                        <strong>{student.aprendiz}</strong> ({student.documento})<br/>
                        Ausencias totales: <b>{student.cantidad}</b> <br/>
                        Máx. ausencias seguidas: <b>{student.consecutivas}</b> <br/>
                        {student.consecutivas >= 3 && (
                            <span style={{color: 'orange'}}>⚠️ El estudiante tiene <b>3 ausencias seguidas</b></span>
                        )}<br/>
                        {student.limiteSuperado ? (
                            <span style={{color: 'red'}}>❗ El estudiante superó el límite de <b>5 ausencias</b>. <br/>Por favor, envíe el reporte manual a Themis.<br/>
                                <button onClick={() => handleReportNovelty(student.id)} style={{marginTop: '0.5rem'}}>Reportar a Themis</button>
                            </span>
                        ) : (
                            <button onClick={() => handleReportNovelty(student.id)} disabled={student.cantidad < 5} style={{marginTop: '0.5rem'}}>
                                Reportar a Themis
                            </button>
                        )}
                    </div>
                ))}
            </div>
            {/* Modal de Novedad */}
            <NoveltyModal
                isOpen={isNoveltyModalOpen}
                onClose={handleCloseNoveltyModal}
            />
        </div>
    );
}

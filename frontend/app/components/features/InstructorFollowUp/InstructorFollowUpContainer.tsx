"use client"

import { StudentSummary } from "@redux/slices/attendanceSlice";
import { InstructorFollowUpContainerProps } from "./types";
import { useDispatch, useSelector } from "react-redux";
import { TEMPORAL_INSTRUCTOR_ID } from "@/temporaryCredential";
import { AppDispatch, RootState } from "@redux/store";
import { useEffect, useState } from "react";
import { openNoveltyModal } from "@redux/slices/themis/noveltySlice";
import { PiStudentFill } from "react-icons/pi";
import { MdWarning } from "react-icons/md";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify"
import PageTitle from "@components/UI/pageTitle";
import NoveltyModal from "@components/Modals/noveltyModal";
import StatCard from "@/components/features/AprendicesList/StatCard";
import AttendanceTable from "@/components/features/InstructorFollowUp/attendanceTable";

const getAuthenticatedInstructorId = (): number => {
    return TEMPORAL_INSTRUCTOR_ID;
};

export const InstructorFollowUpContainer: React.FC<InstructorFollowUpContainerProps> = ({
    competenceQuarterId,
    fichaNumber,
}) => {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const [isTransitioning, setIsTransitioning] = useState(false);

    const {
        data: studySheets,
        selectedForAttendance,
        loading,
        loadingAttendanceSheet,
        error,
    } = useSelector((state: RootState) => state.studySheet);

    const { attendanceSummary } = useSelector((state: RootState) => state.attendances);

    const {
        modalOpen: isNoveltyModalOpen,
        loading: noveltyLoading,
        error: noveltyError,
    } = useSelector((state: RootState) => state.novelty);


    const getCompetenceName = () => {
        if (selectedForAttendance?.teacherStudySheets) {
            const targetTeacherStudySheet = selectedForAttendance.teacherStudySheets.find(
                (tss: any) => parseInt(tss.id) === parseInt(competenceQuarterId.toString())
            );
            return targetTeacherStudySheet?.competence?.name || `Competencia ${competenceQuarterId}`;
        }
    };

    const competenceName = getCompetenceName();
    const shouldShowData = selectedForAttendance && attendanceSummary.length > 0 && !loadingAttendanceSheet;

    // Cálculo de estadísticas
    const totalStudents = attendanceSummary.length;
    const studentsWithAbsences = attendanceSummary.filter((s: StudentSummary) => s.cantidad > 0).length;
    const studentsAtRisk = attendanceSummary.filter(
        (s: StudentSummary) => s.cantidad >= 5 || (s.consecutivas ?? 0) >= 3
    ).length;

    const handleReportNovelty = async (studentId?: number) => {
        if (!studentId) {
            toast.error("ID de estudiante no válido");
            return;
        }

        const studentData = attendanceSummary.find(
            (student: StudentSummary) => student.id === studentId
        );
        const absenceCount = studentData?.cantidad || 0;
        const TEMPORAL_INSTRUCTOR_ID = getAuthenticatedInstructorId();

        try {
            await dispatch(
                openNoveltyModal({
                    studentId,
                    teacherId: TEMPORAL_INSTRUCTOR_ID,
                    absenceCount,
                    studentName: studentData?.aprendiz || "Estudiante desconocido",
                    studentDocument: studentData?.documento || "N/A",
                })
            ).unwrap();
        } catch (error: any) {
            if (error.code === "INSUFFICIENT_ABSENCES") {
                toast.warn(
                    error.message ||
                    "El estudiante no tienen suficientes ausencias e injustificadas para reportar deserción"
                );
            } else {
                toast.error(error.message || "Error al abrir modal de novedad");
            }
        }
    };

    const handleCloseNoveltyModal = () => { };

    return (
        <div className="space-y-4 sm:space-y-6 p-2 sm:p-4 md:p-6 lg:p-8">
            {loadingAttendanceSheet ? (
                <div className="flex justify-center items-center py-8">
                    <div className="text-lg">Cargando asistencias para {competenceName}...</div>
                </div>
            ) : (
                <>
                    <PageTitle onBack={() => router.back()}>
                        Seguimiento de Ausencias - {competenceName}
                        {fichaNumber && ` - Ficha ${fichaNumber}`}
                    </PageTitle>

                    {/* Estadísticas con Cards */}
                    {shouldShowData && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            <StatCard
                                icon={PiStudentFill}
                                color="blue"
                                value={totalStudents}
                                label="Total de aprendices"
                            />

                            <StatCard
                                icon={PiStudentFill}
                                color="yellow"
                                value={studentsWithAbsences}
                                label="Aprendices con ausencias"
                            />

                            <StatCard
                                icon={MdWarning}
                                color="red"
                                value={studentsAtRisk}
                                label="Aprendices en riesgo de deserción"
                                className="sm:col-span-2 lg:col-span-1"
                            />
                        </div>
                    )}

                    <AttendanceTable
                        data={shouldShowData ? attendanceSummary : []}
                        loading={loadingAttendanceSheet}
                        onReportNovelty={handleReportNovelty}
                    />

                    <NoveltyModal isOpen={isNoveltyModalOpen} onClose={handleCloseNoveltyModal} />
                </>
            )}
        </div>
    );
};
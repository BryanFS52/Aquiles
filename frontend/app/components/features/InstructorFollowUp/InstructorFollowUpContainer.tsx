"use client"

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import AttendanceTable from "@/components/features/InstructorFollowUp/attendanceTable";
import PageTitle from "@components/UI/pageTitle";
import NoveltyModal from "@components/Modals/noveltyModal";
import { StudentSummary, setAttendanceSummaryFromStudySheet } from "@redux/slices/attendanceSlice";
import { openNoveltyModal } from "@redux/slices/themis/noveltySlice";
import { AppDispatch, RootState } from "@redux/store";
import { TEMPORAL_INSTRUCTOR_ID } from "@/temporaryCredential";
import { useRouter } from "next/navigation";
import { InstructorFollowUpContainerProps } from "./types";

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

    useEffect(() => {
        dispatch(setAttendanceSummaryFromStudySheet([]));
    }, [competenceQuarterId, fichaNumber, dispatch]);

    useEffect(() => {
        if (selectedForAttendance) {
            dispatch(setAttendanceSummaryFromStudySheet(selectedForAttendance));
        }
    }, [selectedForAttendance, dispatch]);

    const getCompetenceName = () => {
        if (selectedForAttendance?.teacherStudySheets) {
            const targetTeacherStudySheet = selectedForAttendance.teacherStudySheets.find(
                (tss: any) => {
                    const teacherStudySeets = parseInt(tss.id);
                    const targetId = parseInt(competenceQuarterId.toString());
                    return teacherStudySeets === targetId;
                }
            );
            
            if (targetTeacherStudySheet?.competence?.name) {
                return targetTeacherStudySheet.competence.name;
            }
        }
        
        return `Competencia ${competenceQuarterId}`;
    };

    const competenceName = getCompetenceName();
    const shouldShowData = selectedForAttendance && attendanceSummary.length > 0 && !loadingAttendanceSheet;

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

    const handleCloseNoveltyModal = () => {};

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
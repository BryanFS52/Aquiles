'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { AppDispatch } from '@redux/store';
import { fetchStudySheetByTeacher, fetchStudySheetByIdWithAttendances, clearAttendanceSelection } from '@slice/olympo/studySheetSlice';
import { useLoader } from '@context/LoaderContext';
import { StudySheetCard } from './StudySheetCard';
import { ApprenticesModal } from './ApprenticesModal';
import { StudySheetWithCompetence } from './types';
import PageTitle from '@components/UI/pageTitle';
import EmptyState from '@components/UI/emptyState';
import { TEMPORAL_INSTRUCTOR_ID } from '@/temporaryCredential';
import { fetchJustificationsByCompetenceQuarter } from '@/redux/slices/justificationSlice';

export const FichasInstructorContainer: React.FC = () => {
    const [selectedFicha, setSelectedFicha] = useState<StudySheetWithCompetence | null>(null);
    const [isModalOpen, setModalOpen] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [loadingAttendance, setLoadingAttendance] = useState<string | null>(null);

    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const { showLoader, hideLoader } = useLoader();

    const { data, loading, loadingAttendanceSheet } = useSelector((state: any) => state.studySheet);
    const fichas: StudySheetWithCompetence[] = data || [];

    useEffect(() => {
        dispatch(clearAttendanceSelection());
        dispatch(fetchStudySheetByTeacher({ idTeacher: TEMPORAL_INSTRUCTOR_ID, page: 0, size: 5 }));
    }, [dispatch]);

    useEffect(() => {
        if (loading) {
            showLoader();
        } else {
            hideLoader();
        }
    }, [loading, showLoader, hideLoader]);
    
    const handleViewApprentices = (ficha: StudySheetWithCompetence) => {
        setSelectedFicha(ficha);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setSelectedFicha(null);
        setModalOpen(false);
    };

    const handleTakeAttendance = async (studySheet: StudySheetWithCompetence) => {
        if (!studySheet.id) return;

        const competenceId = studySheet.competenceId ?? undefined;

        setLoadingAttendance(studySheet.id);
        
        try {
            const urlParams = new URLSearchParams();
            urlParams.set('studySheetId', studySheet.id);
            if (competenceId) {
                urlParams.set('competenceId', competenceId.toString());
            }
            
            router.push(`/dashboard/asistencia?${urlParams.toString()}`);
            
            dispatch(fetchStudySheetByIdWithAttendances({
                id: parseInt(studySheet.id),
                competenceId
            }));
            
            setTimeout(() => {
                setLoadingAttendance(null);
            }, 200);
            
        } catch (error) {
            console.error('Error al cargar la ficha:', error);
            setLoadingAttendance(null);
        }
    };

    const handleTakeJustification = async (studySheet: StudySheetWithCompetence) => {
        if (!studySheet.id) return;

        setLoadingAttendance(studySheet.id);

        try {
            router.push(`/dashboard/justificacionesInstructor?ficha=${studySheet.number}`);
            setTimeout(() => {
                setLoadingAttendance(null);
            }, 200);
        } catch (error) {
            console.error("Error al preparar justificaciones:", error);
            setLoadingAttendance(null);
        }
    };

    if (!loading && (!fichas || fichas.length === 0)) {
        return <EmptyState message="No se encontraron fichas disponibles." />;
    }

    const handleTakeFollowUp = async (studySheet: StudySheetWithCompetence) => {
        if (!studySheet.id) return;

        setLoadingAttendance(studySheet.id);
        
        try {
            router.push(`/dashboard/InstructorFollowUp?ficha=${studySheet.number}`);
            setTimeout(() => {
                setLoadingAttendance(null);
            }, 200);
        } catch (error) {
            console.error('Error al navegar a seguimiento:', error);
            setLoadingAttendance(null);
        }  
    };

    return (
        <>
            <div className="min-h-screen grid grid-cols-1 xl:grid-cols-6">
                <div className="xl:col-span-5">
                    <div className="container mx-auto p-6">
                        <PageTitle>Fichas del instructor</PageTitle>

                        <div className="space-y-6">
                            {fichas.map((studySheet: StudySheetWithCompetence, index: number) => (
                                <div key={studySheet.id || index} className={index === 0 ? '' : 'mt-6'}>
                                    <StudySheetCard
                                        studySheet={studySheet}
                                        onViewApprentices={handleViewApprentices}
                                        onTakeAttendance={handleTakeAttendance}
                                        loading={loadingAttendance === studySheet.id}
                                        onViewApprenticesJustifications={() => {
                                        }}
                                        onTakeJustification={handleTakeJustification}
                                        onTakeFollowUp={handleTakeFollowUp}
                                        onViewApprenticesFollowUp={handleTakeFollowUp}
                                    />
                                </div>
                            ))}
                        </div>

                        <ApprenticesModal
                            isOpen={isModalOpen}
                            onClose={handleCloseModal}
                            students={
                                selectedFicha?.studentStudySheets?.filter((ss): ss is NonNullable<typeof ss> => Boolean(ss)) || []
                            }
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default FichasInstructorContainer;
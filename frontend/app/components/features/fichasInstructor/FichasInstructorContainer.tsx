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

    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const { showLoader, hideLoader } = useLoader();

    const { data, loading, loadingAttendanceSheet } = useSelector((state: any) => state.studySheet);
    const fichas: StudySheetWithCompetence[] = data || [];

    useEffect(() => {
        const loadData = async () => {
            showLoader();
            try {
                dispatch(clearAttendanceSelection());
                await dispatch(fetchStudySheetByTeacher({ idTeacher: TEMPORAL_INSTRUCTOR_ID, page: 0, size: 5 })).unwrap();
            } catch (error) {
                console.error('Error al cargar fichas:', error);
            } finally {
                hideLoader();
            }
        };
        
        loadData();
    }, [dispatch]);
    
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

        showLoader();
        
        try {
            const urlParams = new URLSearchParams();
            urlParams.set('studySheetId', studySheet.id);
            if (competenceId) {
                urlParams.set('competenceId', competenceId.toString());
            }
            
            // Primero cargar los datos
            await dispatch(fetchStudySheetByIdWithAttendances({
                id: parseInt(studySheet.id),
                competenceId
            })).unwrap();
            
            // Después navegar
            router.push(`/dashboard/asistencia?${urlParams.toString()}`);
            
        } catch (error) {
            console.error('Error al cargar la ficha:', error);
        } finally {
            // Delay mínimo para transición suave
            setTimeout(() => {
                hideLoader();
            }, 300);
        }
    };

    const handleTakeJustification = async (studySheet: StudySheetWithCompetence) => {
        if (!studySheet.id) return;

        showLoader();

        try {
            // Delay mínimo para mostrar el loader
            await new Promise(resolve => setTimeout(resolve, 200));
            
            router.push(`/dashboard/justificacionesInstructor?ficha=${studySheet.number}`);
            
        } catch (error) {
            console.error("Error al preparar justificaciones:", error);
        } finally {
            setTimeout(() => {
                hideLoader();
            }, 300);
        }
    };

    if (!loading && (!fichas || fichas.length === 0)) {
        return <EmptyState message="No se encontraron fichas disponibles." />;
    }

    const handleTakeFollowUp = async (studySheet: StudySheetWithCompetence) => {
        if (!studySheet.id) return;

        showLoader();
        
        try {
            // Delay mínimo para mostrar el loader
            await new Promise(resolve => setTimeout(resolve, 200));
            
            router.push(`/dashboard/InstructorFollowUp?ficha=${studySheet.number}`);
            
        } catch (error) {
            console.error('Error al navegar a seguimiento:', error);
        } finally {
            setTimeout(() => {
                hideLoader();
            }, 300);
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
                                        loading={false}
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
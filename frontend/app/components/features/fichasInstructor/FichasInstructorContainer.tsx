'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { AppDispatch } from '@/redux/store';
import { fetchStudySheetByTeacher, fetchStudySheetById } from '@slice/olympo/studySheetSlice';
import { fetchJustificationsByCompetenceQuarter } from '@slice/justificationSlice';
import { useLoader } from '@context/LoaderContext';
import { StudySheetCard } from './StudySheetCard';
import { ApprenticesModal } from './ApprenticesModal';
import { StudySheet } from './types';
import PageTitle from '@components/UI/pageTitle';
import EmptyState from '@components/UI/emptyState';
import { TEMPORAL_INSTRUCTOR_ID } from '@/temporaryCredential';

export const FichasInstructorContainer: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const { showLoader, hideLoader } = useLoader();

    // Local state
    const [selectedFicha, setSelectedFicha] = useState<StudySheet | null>(null);
    const [isModalOpen, setModalOpen] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(false);

    // Redux state
    const { data, loading } = useSelector((state: any) => state.studySheet);
    const fichas: StudySheet[] = data || [];

    TEMPORAL_INSTRUCTOR_ID
    // Effects
    useEffect(() => {
        dispatch(fetchStudySheetByTeacher({ idTeacher: TEMPORAL_INSTRUCTOR_ID, page: 0, size: 5 }));
    }, [dispatch]);

    useEffect(() => {
        if (loading || isTransitioning) {
            showLoader();
        } else {
            hideLoader();
        }
    }, [loading, isTransitioning, showLoader, hideLoader]);

    // Handlers
    const handleViewApprentices = (ficha: StudySheet) => {
        setSelectedFicha(ficha);
        setModalOpen(true);
    };
    
    const handleViewApprenticesJustifications = (ficha: StudySheet) => {
        setSelectedFicha(ficha);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setSelectedFicha(null);
        setModalOpen(false);
    };

    const handleTakeAttendance = async (studySheet: StudySheet) => {
        if (!studySheet.id) return;

        setIsTransitioning(true);
        try {
            await dispatch(fetchStudySheetById({ id: parseInt(studySheet.id) }));
            router.push('/dashboard/asistencia');
        } catch (error) {
            console.error('Error al cargar la ficha:', error);
        } finally {
            setIsTransitioning(false);
        }
    };

    const handleTakeJustification = async (studySheet: StudySheet) => {
        if (!studySheet.id) return;

        setIsTransitioning(true);
        try {
            await dispatch(fetchJustificationsByCompetenceQuarter({ competenceQuarterId: 7 }));
            router.push('/dashboard/justificacionesInstructor/[competenceQuarterId]');
        } catch (error) {
            console.log("olaa")
            console.error('Error al cargar las justificaciones:', error);
        } finally {
            setIsTransitioning(false);
        }
    };
    // Early returns
    if (!loading && (!fichas || fichas.length === 0)) {
        return <EmptyState message="No se encontraron fichas disponibles." />;
    }

    return (
        <>
            <div className="min-h-screen grid grid-cols-1 xl:grid-cols-6">
                <div className="xl:col-span-5">
                    <div className="container mx-auto p-6">
                        <PageTitle>Fichas del instructor</PageTitle>

                        <div className="space-y-6">
                            {fichas.map((studySheet: StudySheet, index: number) => (
                                <div key={studySheet.id || index} className={index === 0 ? '' : 'mt-6'}>
                                    <StudySheetCard
                                        studySheet={studySheet}
                                        onViewApprentices={handleViewApprentices}
                                        onTakeAttendance={handleTakeAttendance}
                                        onTakeJustification={handleTakeJustification}
                                        onViewApprenticesJustifications={handleViewApprenticesJustifications}
                                        loading={loading}
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
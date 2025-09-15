'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { AppDispatch } from '@redux/store';
import { fetchStudySheetByTeacher, fetchStudySheetByIdWithAttendances } from '@slice/olympo/studySheetSlice';
import { useLoader } from '@context/LoaderContext';
import { StudySheetCard } from './StudySheetCard';
import { ApprenticesModal } from './ApprenticesModal';
import { StudySheetWithCompetence } from './types';
import PageTitle from '@components/UI/pageTitle';
import EmptyState from '@components/UI/emptyState';
import { TEMPORAL_INSTRUCTOR_ID } from '@/temporaryCredential';

export const FichasInstructorContainer: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const { showLoader, hideLoader } = useLoader();

    // Local state
    const [selectedFicha, setSelectedFicha] = useState<StudySheetWithCompetence | null>(null);
    const [isModalOpen, setModalOpen] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(false);

    // Redux state
    const { data, loading } = useSelector((state: any) => state.studySheet);
    const fichas: StudySheetWithCompetence[] = data || [];

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

        setIsTransitioning(true);
        try {
            await dispatch(fetchStudySheetByIdWithAttendances({
                id: parseInt(studySheet.id),
                competenceId
            }));
            router.push('/dashboard/asistencia');
        } catch (error) {
            console.error('Error al cargar la ficha:', error);
        } finally {
            setIsTransitioning(false);
        }
    };

    const handleTakeJustification = (studySheet: StudySheetWithCompetence) => {
        console.log("🔄 FichasInstructorContainer: Navegando a justificaciones");
        console.log("📋 Datos de la ficha seleccionada:", {
            id: studySheet.id,
            competenceId: studySheet.competenceId,
            number: studySheet.number,
            teacherStudySheets: studySheet.teacherStudySheets
        });

        // Si hay competenceId, navegar directamente a esa competencia con la ficha
        if (studySheet.competenceId) {
            const competenceQuarterId = studySheet.competenceId;
            console.log("🎯 Navegando con competenceQuarterId:", competenceQuarterId, "y ficha:", studySheet.number);
            router.push(`/dashboard/justificacionesInstructor/${competenceQuarterId}?ficha=${studySheet.number}`);
        } else {
            // Si no hay competenceId, navegar a la página de selección con el número de ficha
            console.log("🔄 No hay competenceId específico, navegando a selector de competencias de la ficha:", studySheet.number);
            router.push(`/dashboard/justificacionesInstructor?ficha=${studySheet.number}`);
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
                            {fichas.map((studySheet: StudySheetWithCompetence, index: number) => (
                                <div key={studySheet.id || index} className={index === 0 ? '' : 'mt-6'}>
                                    <StudySheetCard
                                        studySheet={studySheet}
                                        onViewApprentices={handleViewApprentices}
                                        onTakeAttendance={handleTakeAttendance}
                                        loading={loading}
                                        onViewApprenticesJustifications={() => {
                                            // TODO: implement handler for viewing apprentices justifications
                                        }}
                                        onTakeJustification={handleTakeJustification}
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
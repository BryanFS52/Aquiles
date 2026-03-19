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

const MOCK_FICHAS: StudySheetWithCompetence[] = [
    {
        id: '101',
        number: 2876543,
        startLective: '2026-01-15',
        endLective: '2026-07-10',
        state: true,
        competenceId: 12,
        journey: { name: 'Mañana' },
        trainingProject: {
            program: { name: 'Análisis y Desarrollo de Software' }
        },
        studentStudySheets: [
            {
                student: {
                    id: 'st-1',
                    person: {
                        name: 'Laura',
                        lastname: 'Gómez',
                        email: 'laura.gomez@sena.edu.co',
                        document: '1000123456'
                    }
                },
                studentStudySheetState: { name: 'En formacion' }
            },
            {
                student: {
                    id: 'st-2',
                    person: {
                        name: 'Carlos',
                        lastname: 'Martínez',
                        email: 'carlos.martinez@sena.edu.co',
                        document: '1000654321'
                    }
                },
                studentStudySheetState: { name: 'En formacion' }
            },
            {
                student: {
                    id: 'st-3',
                    person: {
                        name: 'Andrés',
                        lastname: 'Ruiz',
                        email: 'andres.ruiz@sena.edu.co',
                        document: '1099001122'
                    }
                },
                studentStudySheetState: { name: 'Condicionado' }
            },
            {
                student: {
                    id: 'st-4',
                    person: {
                        name: 'María',
                        lastname: 'López',
                        email: 'maria.lopez@sena.edu.co',
                        document: '1000987654'
                    }
                },
                studentStudySheetState: { name: 'En formacion' }
            }
        ]
    },
    {
        id: '102',
        number: 2876999,
        startLective: '2026-02-01',
        endLective: '2026-08-30',
        state: true,
        competenceId: 18,
        journey: { name: 'Tarde' },
        trainingProject: {
            program: { name: 'Desarrollo Multimedia y Web' }
        },
        studentStudySheets: [
            {
                student: {
                    id: 'st-5',
                    person: {
                        name: 'Andrés',
                        lastname: 'Ruiz',
                        email: 'andres.ruiz@sena.edu.co',
                        document: '1099001122'
                    }
                },
                studentStudySheetState: { name: 'Condicionado' }
            },
            {
                student: {
                    id: 'st-6',
                    person: {
                        name: 'Sofía',
                        lastname: 'García',
                        email: 'sofia.garcia@sena.edu.co',
                        document: '1000876543'
                    }
                },
                studentStudySheetState: { name: 'En formacion' }
            },
            {
                student: {
                    id: 'st-7',
                    person: {
                        name: 'Diego',
                        lastname: 'Fernández',
                        email: 'diego.fernandez@sena.edu.co',
                        document: '1000765432'
                    }
                },
                studentStudySheetState: { name: 'En formacion' }
            }
        ]
    },
    {
        id: '103',
        number: 2876555,
        startLective: '2026-03-01',
        endLective: '2026-09-30',
        state: false,
        competenceId: 20,
        journey: { name: 'Noche' },
        trainingProject: {
            program: { name: 'Redes de Computadores' }
        },
        studentStudySheets: [
            {
                student: {
                    id: 'st-4',
                    person: {
                        name: 'María',
                        lastname: 'López',
                        email: 'maria.lopez@sena.edu.co',
                        document: '1000987654'
                    }
                },
                studentStudySheetState: { name: 'En formacion' }
            },
            {
                student: {
                    id: 'st-8',
                    person: {
                        name: 'Valentina',
                        lastname: 'Sánchez',
                        email: 'valentina.sanchez@sena.edu.co',
                        document: '1000654321'
                    }
                },
                studentStudySheetState: { name: 'En formacion' }
            }
        ]
    },
    {
        id: '104',
        number: 2876566,
        startLective: '2026-04-01',
        endLective: '2026-10-31',
        state: true,
        competenceId: 25,
        journey: { name: 'Mañana' },
        trainingProject: {
            program: { name: 'Seguridad Informática' }
        },
        studentStudySheets: [
            {
                student: {
                    id: 'st-5',
                    person: {
                        name: 'Sofía',
                        lastname: 'García',
                        email: 'sofia.garcia@sena.edu.co',
                        document: '1000876543'
                    }
                },
                studentStudySheetState: { name: 'En formacion' }
            },
            {
                student: {
                    id: 'st-9',
                    person: {
                        name: 'Miguel',
                        lastname: 'Torres',
                        email: 'miguel.torres@sena.edu.co',
                        document: '1000543210'
                    }
                },
                studentStudySheetState: { name: 'En formacion' }
            }
        ]
    },
    {
        id: '105',
        number: 2876577,
        startLective: '2026-05-01',
        endLective: '2026-11-30',
        state: false,
        competenceId: 30,
        journey: { name: 'Tarde' },
        trainingProject: {
            program: { name: 'Inteligencia Artificial' }
        },
        studentStudySheets: [
            {
                student: {
                    id: 'st-6',
                    person: {
                        name: 'Diego',
                        lastname: 'Fernández',
                        email: 'diego.fernandez@sena.edu.co',
                        document: '1000765432'
                    }
                },
                studentStudySheetState: { name: 'En formacion' }
            }
        ]
    }
];

export const FichasInstructorContainer: React.FC = () => {
    const [selectedFicha, setSelectedFicha] = useState<StudySheetWithCompetence | null>(null);
    const [isModalOpen, setModalOpen] = useState(false);

    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const { showLoader, hideLoader } = useLoader();

    const { data, loading } = useSelector((state: any) => state.studySheet);

    // =====================
    // MODO MOCK (ACTIVO)
    // =====================
    const fichas: StudySheetWithCompetence[] = MOCK_FICHAS;

    // =====================
    // MODO BACKEND (DESCOMENTAR CUANDO LO NECESITES)
    // =====================
    // const fichas: StudySheetWithCompetence[] = data || [];

    useEffect(() => {
        // MODO MOCK (ACTIVO)
        dispatch(clearAttendanceSelection());

        // MODO BACKEND (DESCOMENTAR CUANDO LO NECESITES)
        // const loadData = async () => {
        //     showLoader();
        //     try {
        //         dispatch(clearAttendanceSelection());
        //         await dispatch(fetchStudySheetByTeacher({ idTeacher: TEMPORAL_INSTRUCTOR_ID, page: 0, size: 5 })).unwrap();
        //     } catch (error) {
        //         console.error('Error al cargar fichas:', error);
        //     } finally {
        //         hideLoader();
        //     }
        // };
        // loadData();
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
            
            // MODO MOCK (ACTIVO)
            await new Promise(resolve => setTimeout(resolve, 200));

            // MODO BACKEND (DESCOMENTAR CUANDO LO NECESITES)
            // await dispatch(fetchStudySheetByIdWithAttendances({
            //     id: parseInt(studySheet.id),
            //     competenceId
            // })).unwrap();
            
            router.push(`/dashboard/asistencia?${urlParams.toString()}`);
            
        } catch (error) {
            console.error('Error al cargar la ficha:', error);
        } finally {
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
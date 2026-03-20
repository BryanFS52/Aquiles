"use client";

import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@redux/store'
import { useRouter, useSearchParams } from 'next/navigation';
import { BsPersonCircle } from "react-icons/bs";
import { useLoader } from '@context/LoaderContext';
import { fetchStudySheetByIdWithAttendances } from '@slice/olympo/studySheetSlice';
import TableAttendance from "@components/features/asistencia/tableAttendance";
import PageTitle from "@components/UI/pageTitle";
import AttendanceFooter from "@components/features/asistencia/attendanceFooter";
import Loader from "@components/UI/Loader";
import EmptyState from "@components/UI/emptyState";
import AttendanceSheet from './AttendanceSheet';
import AttendanceStats from './AttendanceStats';

const MOCK_ATTENDANCE_STUDY_SHEET: any = {
    id: '101',
    number: 2876543,
    numberStudents: 2,
    trainingProject: {
        program: {
            name: 'Análisis y desarrollo de software'
        }
    },
    teacherStudySheets: [
        {
            id: 'tss-101',
            competence: {
                id: '12',
                name: 'Desarrollo web'
            }
        },
        {
            id: 'tss-102',
            competence: {
                id: '13',
                name: 'PHP'
            }
        },
        {
            id: 'tss-103',
            competence: {
                id: '14',
                name: 'Industrias 4.0'
            }
        },
        {
            id: 'tss-104',
            competence: {
                id: '15',
                name: 'Testing'
            }
        },
        {
            id: 'tss-105',
            competence: {
                id: '16',
                name: 'Desarrollo móvil'
            }
        },
        {
            id: 'tss-106',
            competence: {
                id: '17',
                name: 'Tics'
            }
        }
    ],
    studentStudySheets: [
        {
            id: 'sss-1',
            state: 'Activo',
            studentStudySheetState: { name: 'En formacion' },
            student: {
                person: {
                    document: '1000123456',
                    name: 'Laura',
                    lastname: 'Gómez'
                },
                attendances: [
                    { attendanceDate: '2026-03-02', attendanceState: { status: 'Presente' } },
                    { attendanceDate: '2026-03-03', attendanceState: { status: 'Ausente' } },
                    { attendanceDate: '2026-03-04', attendanceState: { status: 'Retardo' } },
                    { attendanceDate: '2026-03-05', attendanceState: { status: 'Justificado' } }
                ]
            }
        },
        {
            id: 'sss-2',
            state: 'Activo',
            studentStudySheetState: { name: 'En formacion' },
            student: {
                person: {
                    document: '1000654321',
                    name: 'Carlos',
                    lastname: 'Martínez'
                },
                attendances: [
                    { attendanceDate: '2026-03-02', attendanceState: { status: 'Presente' } },
                    { attendanceDate: '2026-03-03', attendanceState: { status: 'Presente' } },
                    { attendanceDate: '2026-03-04', attendanceState: { status: 'Presente' } },
                    { attendanceDate: '2026-03-05', attendanceState: { status: 'Retardo' } }
                ]
            }
        },
        {
            id: 'sss-3',
            state: 'Inactivo',
            studentStudySheetState: { name: 'Retirado' },
            student: {
                person: {
                    document: '1000987654',
                    name: 'Ana',
                    lastname: 'López'
                },
                attendances: [
                    { attendanceDate: '2026-03-02', attendanceState: { status: 'Ausente' } },
                    { attendanceDate: '2026-03-03', attendanceState: { status: 'Ausente' } },
                    { attendanceDate: '2026-03-04', attendanceState: { status: 'Ausente' } },
                    { attendanceDate: '2026-03-05', attendanceState: { status: 'Ausente' } }
                ]
            }
        },
        {
            id: 'sss-4',
            state: 'Activo',
            studentStudySheetState: { name: 'En formacion' },
            student: {
                person: {
                    document: '1000234567',
                    name: 'Miguel',
                    lastname: 'Sánchez'
                },
                attendances: [
                    { attendanceDate: '2026-03-02', attendanceState: { status: 'Justificado' } },
                    { attendanceDate: '2026-03-03', attendanceState: { status: 'Justificado' } },
                    { attendanceDate: '2026-03-04', attendanceState: { status: 'Justificado' } },
                    { attendanceDate: '2026-03-05', attendanceState: { status: 'Justificado' } }
                ]
            }
        },
        {
            id: 'sss-5',
            state: 'Activo',
            studentStudySheetState: { name: 'En formacion' },
            student: {
                person: {
                    document: '1000543210',
                    name: 'Sofía',
                    lastname: 'Díaz'
                },
                attendances: [
                    { attendanceDate: '2026-03-02', attendanceState: { status: 'Presente' } },
                    { attendanceDate: '2026-03-03', attendanceState: { status: 'Presente' } },
                    { attendanceDate: '2026-03-04', attendanceState: { status: 'Justificado' } },
                    { attendanceDate: '2026-03-05', attendanceState: { status: 'Ausente' } }
                ]
            }
        },
        {
            id: 'sss-6',
            state: 'Inactivo',
            studentStudySheetState: { name: 'Retirado' },
            student: {
                person: {
                    document: '1000765432',
                    name: 'Laura',
                    lastname: 'García'
                },
                attendances: [
                    { attendanceDate: '2026-03-02', attendanceState: { status: 'Ausente' } },
                    { attendanceDate: '2026-03-03', attendanceState: { status: 'Ausente' } },
                    { attendanceDate: '2026-03-04', attendanceState: { status: 'Ausente' } },
                    { attendanceDate: '2026-03-05', attendanceState: { status: 'Ausente' } }
                ]
            }
        },
        {
            id: 'sss-7',
            state: 'Activo',
            studentStudySheetState: { name: 'En formacion' },
            student: {
                person: {
                    document: '1000876543',
                    name: 'David',
                    lastname: 'Fernández'
                },
                attendances: [
                    { attendanceDate: '2026-03-02', attendanceState: { status: 'Presente' } },
                    { attendanceDate: '2026-03-03', attendanceState: { status: 'Presente' } },
                    { attendanceDate: '2026-03-04', attendanceState: { status: 'Presente' } },
                    { attendanceDate: '2026-03-05', attendanceState: { status: 'Presente' } }
                ]
            }
        }
    ]
};

const AttendanceContainer: React.FC = () => {
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const searchParams = useSearchParams();
    const { showLoader, hideLoader } = useLoader();
    const [isTransitioning, setIsTransitioning] = useState(false);

    // Obtener parámetros de la URL
    const studySheetIdFromUrl = searchParams.get('studySheetId');
    const competenceIdFromUrl = searchParams.get('competenceId');

    const { data: studySheets, selectedForAttendance, loading, loadingAttendanceSheet, error } = useSelector(
        (state: RootState) => state.studySheet
    );

    // =====================
    // MODO MOCK (ACTIVO)
    // =====================
    const studySheet = MOCK_ATTENDANCE_STUDY_SHEET;

    // =====================
    // MODO BACKEND (DESCOMENTAR CUANDO LO NECESITES)
    // =====================
    // const studySheet = selectedForAttendance || (studySheets.length > 0 ? studySheets[0] : undefined);

    const handleNavigate = (competenceId: string) => {
        setIsTransitioning(true);
        const urlParams = new URLSearchParams();
        urlParams.set('competenceId', competenceId);
        if (studySheetIdFromUrl) {
            urlParams.set('studySheetId', studySheetIdFromUrl);
        }
        router.push(`/dashboard/asistenciaManual?${urlParams.toString()}`);
    };

    useEffect(() => {
        // MODO MOCK (ACTIVO)
        // No carga backend.

        // MODO BACKEND (DESCOMENTAR CUANDO LO NECESITES)
        // if (studySheetIdFromUrl && !selectedForAttendance) {
        //     const studySheetId = parseInt(studySheetIdFromUrl);
        //     const competenceId = competenceIdFromUrl ? parseInt(competenceIdFromUrl) : undefined;
        //
        //     dispatch(fetchStudySheetByIdWithAttendances({
        //         id: studySheetId,
        //         competenceId
        //     }));
        // }
    }, [studySheetIdFromUrl, competenceIdFromUrl, selectedForAttendance, dispatch]);

    useEffect(() => {
        // MODO MOCK (ACTIVO)
        hideLoader();

        // MODO BACKEND (DESCOMENTAR CUANDO LO NECESITES)
        // if (loadingAttendanceSheet) {
        //     showLoader();
        // } else if (studySheet || error) {
        //     hideLoader();
        // }
    }, [loadingAttendanceSheet, studySheet, error, showLoader, hideLoader]);

    if (error) {
        return (
            <EmptyState message={typeof error === 'string' ? error : error?.message ?? "Error desconocido"} />
        );
    }

    // MODO MOCK (ACTIVO)
    // Mantener vista cargada con datos de prueba.

    // MODO BACKEND (DESCOMENTAR CUANDO LO NECESITES)
    // if (loadingAttendanceSheet || loading) {
    //     return <Loader />;
    // }

    // Estado vacío si no hay datos
    if (!studySheet) {
        return <EmptyState message="No se encontraron datos de asistencia." />;
    }

    return (
        <div className="space-y-3 sm:space-y-4 md:space-y-6 p-2 sm:p-4 md:p-6">
            {/* Título */}
            <PageTitle>Lista de asistencia</PageTitle>
            {/* Sección de información del curso y estadísticas */}
            <div className="flex flex-col space-y-3 sm:space-y-4 xl:flex-row xl:space-y-0 xl:space-x-4 lg:space-x-6">
                {/* Nombre del curso */}
                <AttendanceSheet
                    studySheetData={studySheet}
                    onNavigate={handleNavigate}
                />
                {/* Estadísticas de estudiantes */}
                <AttendanceStats
                    studySheetData={studySheet}
                    onNavigate={handleNavigate}
                />
            </div>
            {/* Tabla de asistencia */}
            <TableAttendance
                studySheetData={studySheet}
                onNavigate={handleNavigate}
            />
            {/* Sección inferior con número de ficha y leyenda */}
            <AttendanceFooter
                studySheet={studySheet}
            />
        </div>
    );
}

export default AttendanceContainer;
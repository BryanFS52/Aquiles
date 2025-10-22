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

    // Usar la ficha seleccionada para asistencia si está disponible, de lo contrario usar la primera del array
    const studySheet = selectedForAttendance || (studySheets.length > 0 ? studySheets[0] : undefined);

    const handleNavigate = (competenceId: string) => {
        setIsTransitioning(true);
        const urlParams = new URLSearchParams();
        urlParams.set('competenceId', competenceId);
        if (studySheetIdFromUrl) {
            urlParams.set('studySheetId', studySheetIdFromUrl);
        }
        router.push(`/dashboard/asistenciaManual?${urlParams.toString()}`);
    };

    // Efecto para cargar la ficha desde la URL si no está disponible en Redux (State)
    useEffect(() => {
        if (studySheetIdFromUrl && !selectedForAttendance) {
            const studySheetId = parseInt(studySheetIdFromUrl);
            const competenceId = competenceIdFromUrl ? parseInt(competenceIdFromUrl) : undefined;

            dispatch(fetchStudySheetByIdWithAttendances({
                id: studySheetId,
                competenceId
            }));
        }
    }, [studySheetIdFromUrl, competenceIdFromUrl, selectedForAttendance, dispatch]);

    useEffect(() => {
        if (loadingAttendanceSheet) {
            showLoader();
        } else if (studySheet || error) {
            hideLoader();
        }
    }, [loadingAttendanceSheet, studySheet, error, showLoader, hideLoader]);

    if (error) {
        return (
            <EmptyState message={typeof error === 'string' ? error : error?.message ?? "Error desconocido"} />
        );
    }

    // Loader de carga
    if (loadingAttendanceSheet || loading) {
        return <Loader />;
    }

    // Estado vacío si no hay datos
    if (!studySheet) {
        return <EmptyState message="No se encontraron datos de asistencia." />;
    }

    return (
        <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
            {/* Título */}
            <PageTitle>Lista de asistencia</PageTitle>
            {/* Sección de información del curso y estadísticas */}
            <div className="flex flex-col space-y-4 xl:flex-row xl:space-y-0 xl:space-x-6">
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
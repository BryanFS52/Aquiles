"use client";

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store'
import { useRouter } from 'next/navigation';
import { BsPersonCircle } from "react-icons/bs";
import TableAttendance from "@components/features/attendance/tableAttendance";
import PageTitle from "@components/UI/pageTitle";
import AttendanceFooter from "@components/features/attendance/attendanceFooter";
import { useLoader } from '@/context/LoaderContext';

export default function Attendance() {
    const router = useRouter();
    const { showLoader, hideLoader } = useLoader();
    const [isTransitioning, setIsTransitioning] = useState(false);
    const { data: studySheets, loading, error } = useSelector(
        (state: RootState) => state.studySheet
    );

    const studySheet = studySheets.length > 0 ? studySheets[0] : undefined;
    const students = (studySheet?.studentStudySheets as any[])?.filter(
        (s: any) => s?.state === "Activo"
    ) || [];

    const activeStudents = students.length;
    const withdrawnStudents = (studySheet?.studentStudySheets as any[])?.filter(
        (s: any) => s?.state !== "Activo"
    )?.length || 0;

    const handleNavigate = () => {
        setIsTransitioning(true);
        router.push('/dashboard/asistenciaManual');
    };

    useEffect(() => {
        if (loading || isTransitioning) {
            showLoader();
        } else {
            hideLoader();
        }
    }, [loading, isTransitioning, showLoader, hideLoader]);

    if (error) {
        return (
            <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
                <PageTitle>Lista de asistencia</PageTitle>
                <div className="flex items-center justify-center h-32 sm:h-64">
                    <p className="text-red-500 dark:text-red-400 text-sm sm:text-base text-center px-4">
                        Error al cargar la ficha: {typeof error === 'string' ? error : error?.message ?? "Error desconocido"}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
            {/* Título */}
            <PageTitle>Lista de asistencia</PageTitle>

            {/* Sección de información del curso y estadísticas */}
            <div className="flex flex-col space-y-4 xl:flex-row xl:space-y-0 xl:space-x-6">
                {/* Nombre del curso */}
                <div className="w-full xl:w-auto xl:flex-shrink-0">
                    <div className="min-h-[4rem] sm:h-16 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 p-3 sm:p-4 flex items-center justify-center">
                        <span className="font-inter font-medium text-base sm:text-lg text-black dark:text-white text-center leading-tight">
                            {studySheet?.trainingProject?.program?.name ?? "Sin programa"}
                        </span>
                    </div>
                </div>

                {/* Estadísticas de estudiantes */}
                <div className="flex-1">
                    <div className="min-h-[4rem] sm:h-16 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 p-3 sm:p-4">
                        {/* Mobile: Stack vertically */}
                        <div className="flex flex-col space-y-3 sm:hidden">
                            {/* Numero de estudiantes */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <BsPersonCircle className="w-5 h-5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                                    <span className="text-sm text-gray-600 dark:text-gray-300">Número de Estudiantes</span>
                                </div>
                                <span className="text-base font-semibold text-black dark:text-white">
                                    {studySheet?.numberStudents || 0}
                                </span>
                            </div>

                            {/* Aprendices Activos */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <BsPersonCircle className="w-5 h-5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                                    <span className="text-sm text-gray-600 dark:text-gray-300">Aprendices Activos</span>
                                </div>
                                <span className="text-base font-semibold text-black dark:text-white">
                                    {activeStudents || 0}
                                </span>
                            </div>

                            {/* Aprendices Retirados */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <BsPersonCircle className="w-5 h-5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                                    <span className="text-sm text-gray-600 dark:text-gray-300">Aprendices Retirados</span>
                                </div>
                                <span className="text-base font-semibold text-black dark:text-white">
                                    {withdrawnStudents}
                                </span>
                            </div>
                        </div>

                        {/* Tablet and Desktop: Horizontal layout */}
                        <div className="hidden sm:flex flex-col md:flex-row items-center justify-center md:justify-around h-full space-y-2 md:space-y-0">
                            {/* Numero de estudiantes */}
                            <div className="flex items-center space-x-2 lg:space-x-3">
                                <BsPersonCircle className="w-5 h-5 lg:w-6 lg:h-6 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                                <span className="text-base lg:text-lg font-semibold text-black dark:text-white">
                                    {studySheet?.numberStudents || 0}
                                </span>
                                <span className="text-xs lg:text-sm text-gray-600 dark:text-gray-300 hidden lg:block">
                                    Número de Estudiantes
                                </span>
                                <span className="text-xs text-gray-600 dark:text-gray-300 lg:hidden">
                                    Total
                                </span>
                            </div>

                            {/* Separador vertical */}
                            <div className="hidden md:block w-px h-6 lg:h-8 bg-gray-300 dark:bg-gray-600"></div>

                            {/* Aprendices Activos */}
                            <div className="flex items-center space-x-2 lg:space-x-3">
                                <BsPersonCircle className="w-5 h-5 lg:w-6 lg:h-6 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                                <span className="text-base lg:text-lg font-semibold text-black dark:text-white">
                                    {activeStudents || 0}
                                </span>
                                <span className="text-xs lg:text-sm text-gray-600 dark:text-gray-300 hidden lg:block">
                                    Aprendices Activos
                                </span>
                                <span className="text-xs text-gray-600 dark:text-gray-300 lg:hidden">
                                    Activos
                                </span>
                            </div>

                            {/* Separador vertical */}
                            <div className="hidden md:block w-px h-6 lg:h-8 bg-gray-300 dark:bg-gray-600"></div>

                            {/* Aprendices Retirados */}
                            <div className="flex items-center space-x-2 lg:space-x-3">
                                <BsPersonCircle className="w-5 h-5 lg:w-6 lg:h-6 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                                <span className="text-base lg:text-lg font-semibold text-black dark:text-white">
                                    {withdrawnStudents}
                                </span>
                                <span className="text-xs lg:text-sm text-gray-600 dark:text-gray-300 hidden lg:block">
                                    Aprendices Retirados
                                </span>
                                <span className="text-xs text-gray-600 dark:text-gray-300 lg:hidden">
                                    Retirados
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabla de asistencia */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 overflow-hidden">
                <div className="overflow-x-auto">
                    <TableAttendance studySheetData={studySheet} onNavigate={handleNavigate} />
                </div>
            </div>

            {/* Sección inferior con número de ficha y leyenda */}
            <AttendanceFooter studySheet={studySheet} />
        </div>
    );
}

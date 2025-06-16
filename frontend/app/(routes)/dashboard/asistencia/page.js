"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { BsPersonCircle } from "react-icons/bs";
import { fetchStudySheetById } from '@slice/olympo/studySheetSlice';
import TableAttendance from "@components/features/attendance/tableAttendance";
import PageTitle from "@components/UI/pageTitle";
import AttendanceFooter from "@components/features/attendance/attendanceFooter";

export default function Attendance() {
    const dispatch = useDispatch();
    const { data: studySheets, loading, error } = useSelector((state) => state.studySheet);

    // Get the first study sheet from the data array (since fetchById returns array with single item)
    const studySheet = studySheets.length > 0 ? studySheets[0] : null;
    const students = studySheet?.students || [];

    useEffect(() => {
        const fetchStudySheet = async () => {
            try {
                await dispatch(fetchStudySheetById({ id: "1" })).unwrap();
            } catch (error) {
                console.error("Error al obtener ficha:", error);
            }
        };

        fetchStudySheet();
    }, [dispatch]);

    const activeStudents = students.filter((s) => s.status === "active").length;
    const withdrawnStudents = students.filter((s) => s.status === "withdrawn").length;

    if (loading) {
        return (
            <div className="space-y-6">
                <PageTitle>Lista de asistencia</PageTitle>
                <div className="flex items-center justify-center h-64">
                    <p className="text-gray-500 dark:text-gray-400">Cargando Lista de asistencia...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="space-y-6">
                <PageTitle>Lista de asistencia</PageTitle>
                <div className="flex items-center justify-center h-64">
                    <p className="text-red-500 dark:text-red-400">Error al cargar la ficha: {error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Título */}
            <PageTitle>Lista de asistencia</PageTitle>

            {/* Sección de información del curso y estadísticas */}
            <div className="flex flex-col space-y-4 lg:flex-row lg:space-x-6 lg:space-y-0">
                {/* Nombre del curso */}
                <div className="flex-1 lg:max-w-md">
                    <div className="h-16 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 p-4 flex items-center">
                        <span className="font-inter font-medium text-lg text-black dark:text-white text-center w-full">
                            {studySheet?.offer?.name || "Desarrollo de Aplicaciones Web II"}
                        </span>
                    </div>
                </div>

                {/* Estadísticas de estudiantes */}
                <div className="flex-1">
                    <div className="h-16 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 p-4">
                        <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-around h-full space-y-2 sm:space-y-0">
                            {/* Aprendices Activos */}
                            <div className="flex items-center space-x-3">
                                <BsPersonCircle className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                                <span className="text-lg font-semibold text-black dark:text-white">{activeStudents}</span>
                                <span className="text-sm text-gray-600 dark:text-gray-300">Aprendices Activos</span>
                            </div>

                            {/* Separador vertical */}
                            <div className="hidden sm:block w-px h-8 bg-gray-300 dark:bg-gray-600"></div>

                            {/* Aprendices Retirados */}
                            <div className="flex items-center space-x-3">
                                <BsPersonCircle className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                                <span className="text-lg font-semibold text-black dark:text-white">{withdrawnStudents}</span>
                                <span className="text-sm text-gray-600 dark:text-gray-300">Aprendices Retirados</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabla de asistencia */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 overflow-hidden">
                <TableAttendance studySheetData={studySheet} />
            </div>

            {/* Sección inferior con número de ficha y leyenda */}
            <AttendanceFooter studySheet={studySheet} />
        </div>
    );
}
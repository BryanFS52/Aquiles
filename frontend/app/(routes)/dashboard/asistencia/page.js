"use client";

import { useEffect, useState } from "react";
import { BsPersonCircle } from "react-icons/bs";
import TableAttendance from "@components/tableAttendance";
import { FaCheck } from "react-icons/fa";
import { TbLetterR, TbLetterX, TbLetterJ } from "react-icons/tb";
import studySheetService from '@services/olympo/studySheetService';

export default function Attendance() {
    const [studySheet, setStudySheet] = useState(null);
    const [students, setStudents] = useState([]);

    useEffect(() => {
        const fetchStudySheet = async () => {
            try {
                const response = await studySheetService.getStudySheetById("1");
                if (response?.data) {
                    setStudySheet(response.data);
                    setStudents(response.data.students || []);
                } else {
                    setStudySheet(null);
                    setStudents([]);
                }
            } catch (error) {
                console.error("Error al obtener la hoja de estudio:", error);
                setStudySheet(null);
                setStudents([]);
            }
        };

        fetchStudySheet();
    }, []);

    const activeStudents = students.filter((s) => s.status === "active").length;
    const withdrawnStudents = students.filter((s) => s.status === "withdrawn").length;

    return (
        <div className="space-y-6">
            {/* Título */}
            <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                <h1 className="text-[#01b001] dark:text-blue-400 text-3xl lg:text-4xl pb-3 border-b-2 border-gray-300 dark:border-gray-600 w-full sm:w-3/4 lg:w-1/2 font-inter font-semibold transition-colors duration-300">
                    Lista de Asistencia
                </h1>
            </div>

            {/* Sección de información del curso y estadísticas */}
            <div className="flex flex-col space-y-4 lg:flex-row lg:space-x-6 lg:space-y-0">
                {/* Nombre del curso */}
                <div className="flex-1 lg:max-w-md">
                    <div className="h-16 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 p-4 flex items-center">
                        <span className="font-inter font-medium text-lg text-green-600 dark:text-green-400 text-center w-full">
                            Desarrollo de Aplicaciones Web II
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
                                <span className="text-lg font-semibold text-blue-600 dark:text-blue-400">{activeStudents}</span>
                                <span className="text-sm text-gray-600 dark:text-gray-300">Aprendices Activos</span>
                            </div>

                            {/* Separador vertical */}
                            <div className="hidden sm:block w-px h-8 bg-gray-300 dark:bg-gray-600"></div>

                            {/* Aprendices Retirados */}
                            <div className="flex items-center space-x-3">
                                <BsPersonCircle className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                                <span className="text-lg font-semibold text-blue-600 dark:text-blue-400">{withdrawnStudents}</span>
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
            <div className="flex flex-col lg:flex-row lg:space-x-6 space-y-4 lg:space-y-0">
                {/* Número de ficha */}
                <div className="lg:w-32">
                    <div className="h-14 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 flex items-center justify-center">
                        <span className="text-2xl font-semibold text-blue-600 dark:text-blue-400 font-inter">
                            {studySheet?.number || '--'}
                        </span>
                    </div>
                </div>

                {/* Leyenda de símbolos */}
                <div className="flex-1">
                    <div className="rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 p-4">
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            {/* Asistencia */}
                            <div className="flex items-center space-x-3">
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Asistencia</span>
                                <div className="relative">
                                    <div className="w-6 h-6 rounded border-2 border-gray-300 dark:border-gray-500 bg-white dark:bg-gray-700"></div>
                                    <FaCheck className="absolute inset-0 w-4 h-4 text-green-500 m-auto" />
                                </div>
                            </div>

                            {/* Retardo */}
                            <div className="flex items-center space-x-3">
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Retardo</span>
                                <div className="relative">
                                    <div className="w-6 h-6 rounded border-2 border-gray-300 dark:border-gray-500 bg-white dark:bg-gray-700"></div>
                                    <TbLetterR className="absolute inset-0 w-4 h-4 text-yellow-500 m-auto" />
                                </div>
                            </div>

                            {/* Inasistencia */}
                            <div className="flex items-center space-x-3">
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Inasistencia</span>
                                <div className="relative">
                                    <div className="w-6 h-6 rounded border-2 border-gray-300 dark:border-gray-500 bg-white dark:bg-gray-700"></div>
                                    <TbLetterX className="absolute inset-0 w-4 h-4 text-red-500 m-auto" />
                                </div>
                            </div>

                            {/* Justificación */}
                            <div className="flex items-center space-x-3">
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Justificación</span>
                                <div className="relative">
                                    <div className="w-6 h-6 rounded border-2 border-gray-300 dark:border-gray-500 bg-white dark:bg-gray-700"></div>
                                    <TbLetterJ className="absolute inset-0 w-4 h-4 text-blue-500 m-auto" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
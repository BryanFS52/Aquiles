"use client"

import { BookOpen, GraduationCap, Users, Clock, Download, FileText } from "lucide-react"

interface CourseInfoSectionProps {
    studySheet: any
}

export function CourseInfoSection({ studySheet, }: CourseInfoSectionProps) {
    return (
        <>
            {/* Course info */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Información del Curso</h3>
                    <BookOpen className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                </div>
                <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                        <GraduationCap className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                        <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                {studySheet?.trainingProject.program.name || "ADSO"} - Ficha {studySheet?.number || "2758438"}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                {studySheet?.description || "Análisis y Desarrollo de Software"}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        <Users className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                        <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{studySheet.numberStudents} Estudiantes</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Matriculados</p>
                        </div>
                    </div>

                    {/* keiros */}
                    <div className="flex items-center space-x-3">
                        <Clock className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                        <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                {studySheet?.schedule || "7:00 AM - 12:00 PM"}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{studySheet?.shift || "Horario Matutino"}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick actions */}
            {/*}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Acciones</h3>
                <div className="space-y-3">
                    <button
                        onClick={onExportAttendance}
                        className="w-full flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                    >
                        <Download className="w-4 h-4" />
                        <span>Exportar CSV</span>
                    </button>
                    <button className="w-full flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors">
                        <FileText className="w-4 h-4" />
                        <span>Generar Reporte</span>
                    </button>
                </div>
            </div>
            */}
        </>
    )
}

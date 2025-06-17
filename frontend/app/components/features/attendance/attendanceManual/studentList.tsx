"use client"

import { Users, ChevronDown, Mail, Phone, CheckCircle, XCircle, Clock } from "lucide-react"
import type { AttendanceStatus } from "@type/pages/attendanceManual"
import type { JSX } from "react"

interface StudentListProps {
    students: any[]
    attendance: Record<string | number, AttendanceStatus>
    selectedStudent: string | number | null
    onAttendanceChange: (studentId: string | number, status: AttendanceStatus) => void
    onStudentSelect: (studentId: string | number | null) => void
}

export function StudentList({
    students,
    attendance,
    selectedStudent,
    onAttendanceChange,
    onStudentSelect,
}: StudentListProps) {
    const getStatusIcon = (status: AttendanceStatus): JSX.Element => {
        switch (status) {
            case "presente":
                return <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 dark:text-green-400" />
            case "ausente":
                return <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 dark:text-red-400" />
            case "justificado":
                return <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400" />
            case "retardo":
                return <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600 dark:text-orange-400" />
            default:
                return <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
        }
    }

    const getStatusColor = (status: AttendanceStatus): string => {
        switch (status) {
            case "presente":
                return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-200 dark:border-green-700"
            case "ausente":
                return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-200 dark:border-red-700"
            case "justificado":
                return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:border-blue-700"
            case "retardo":
                return "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900 dark:text-orange-200 dark:border-orange-700"
            default:
                return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600"
        }
    }

    if (students.length === 0) {
        return (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <Users className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                <p className="text-lg">No se encontraron estudiantes</p>
                <p className="text-sm">Intenta con otro término de búsqueda</p>
            </div>
        )
    }

    return (
        <div className="space-y-3 max-h-96 overflow-y-auto">
            {students.map((student, index) => (

                <div
                    key={student.id}
                    className="bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors rounded-lg p-4 border border-gray-200 dark:border-gray-600"
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 min-w-0 flex-1">
                            <div className="bg-lightGreen dark:bg-darkBlue text-white w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm flex-shrink-0">
                                {index + 1}
                            </div>
                            <div className="min-w-0 flex-1">
                                <div className="flex items-center space-x-2">
                                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                                        {student.person?.name || "N/A"} {student.person?.lastname || ""}
                                    </h3>
                                    <button
                                        onClick={() => onStudentSelect(selectedStudent === student.id ? null : student.id)}
                                        className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400"
                                    >
                                        <ChevronDown
                                            className={`w-4 h-4 transition-transform ${selectedStudent === student.id ? "rotate-180" : ""}`}
                                        />
                                    </button>
                                </div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Doc: {student.person?.document || "N/A"}</p>

                                {selectedStudent === student.id && (
                                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                                        <div className="flex items-center space-x-2">
                                            <Mail className="w-3 h-3 text-gray-400 dark:text-gray-500" />
                                            <span className="text-gray-600 dark:text-gray-300">
                                                {student.person?.email || "No disponible"}
                                            </span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Phone className="w-3 h-3 text-gray-400 dark:text-gray-500" />
                                            <span className="text-gray-600 dark:text-gray-300">
                                                {student.person?.phone || "No disponible"}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center space-x-3 flex-shrink-0">
                            <div className="hidden sm:block">{getStatusIcon(attendance[student.id])}</div>
                            <select
                                value={attendance[student.id] || "presente"}
                                onChange={(e) => onAttendanceChange(student.id, e.target.value as AttendanceStatus)}
                                className={`px-3 py-2 border rounded-lg font-medium text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${getStatusColor(attendance[student.id])}`}
                            >
                                <option value="presente">✓ Presente</option>
                                <option value="ausente">✗ Ausente</option>
                                <option value="justificado">J Justificado</option>
                                <option value="retardo">R Retardo</option>
                            </select>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

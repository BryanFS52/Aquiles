"use client"

import { Users, ChevronDown, Mail, Phone, CheckCircle, XCircle, Clock } from "lucide-react"
import type { AttendanceStatus } from "@type/pages/attendanceManual"
import type { JSX } from "react"
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { fetchAttendanceState } from '@slice/attendanceStateSlice';
import { RootState } from '@redux/store';
import type { AppDispatch } from '@redux/store';

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
    const dispatch = useDispatch<AppDispatch>();
    const { data: attendanceStates, } = useSelector(
        (state: RootState) => state.attendanceState
    ) as {
        data: { id: string; status: AttendanceStatus }[];
        loading: boolean;
        error: any;
    };

    const statusColorMap: Record<string, string> = {
        presente: "bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-200 dark:border-green-700",
        ausente: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-200 dark:border-red-700",
        justificado: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:border-blue-700",
        retardo: "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-200 dark:border-yellow-700",
        default: "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600",
    };


    useEffect(() => {
        dispatch(fetchAttendanceState({ page: 0, size: 100 }));
    }, [dispatch]);

    const getStatusIcon = (status: AttendanceStatus): JSX.Element => {
        switch (status) {
            case "presente":
                return <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
            case "ausente":
                return <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
            case "justificado":
                return <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            case "retardo":
                return <Clock className="w-4 h-4 text-orange-600 dark:text-orange-400" />
            default:
                return <CheckCircle className="w-4 h-4 text-gray-400" />
        }
    }

    console.log(selectedStudent)
    console.log(students)

    const getStatusColor = (status: string | undefined | null): string => {
        if (!status) return statusColorMap.default;
        return statusColorMap[status.toLowerCase()] ?? statusColorMap.default;
    };


    if (students.length === 0) {
        return (
            <div className="text-center py-8 sm:py-12 text-gray-500 dark:text-gray-400">
                <Users className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                <p className="text-base sm:text-lg">No se encontraron estudiantes</p>
                <p className="text-xs sm:text-sm">Intenta con otro término de búsqueda</p>
            </div>
        )
    }

    return (
        <div className="space-y-2 sm:space-y-3 max-h-96 overflow-y-auto">
            {students.map((student, index) => (

                <div
                    key={student.student.id}
                    className="bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors rounded-lg p-3 sm:p-4 border border-gray-200 dark:border-gray-600"
                >
                    <div className="flex items-center justify-between gap-2 sm:gap-4">
                        <div className="flex items-center space-x-2 sm:space-x-4 min-w-0 flex-1">
                            <div className="bg-lightGreen dark:bg-darkBlue text-white w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-semibold text-xs sm:text-sm flex-shrink-0">
                                {index + 1}
                            </div>
                            <div className="min-w-0 flex-1">
                                <div className="flex items-center space-x-1 sm:space-x-2">
                                    <h3 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-gray-100 truncate">
                                        {student.student?.person?.name || "N/A"} {student.student?.person?.lastname || ""}
                                    </h3>
                                    <button
                                        onClick={() => onStudentSelect(selectedStudent === student.student.id ? null : student.student.id)}
                                        className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400 flex-shrink-0"
                                    >
                                        <ChevronDown
                                            className={`w-3 h-3 sm:w-4 sm:h-4 transition-transform ${selectedStudent === student.id ? "rotate-180" : ""}`}
                                        />
                                    </button>
                                </div>
                                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Doc: {student.student?.person?.document || "N/A"}</p>

                                {selectedStudent === student.student.id && (
                                    <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-gray-200 dark:border-gray-600 space-y-1 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-2 text-xs sm:text-sm">
                                        <div className="flex items-center space-x-2">
                                            <Mail className="w-3 h-3 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                                            <span className="text-gray-600 dark:text-gray-300 truncate">
                                                {student.student?.person?.email || "No disponible"}
                                            </span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Phone className="w-3 h-3 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                                            <span className="text-gray-600 dark:text-gray-300 truncate">
                                                {student.student?.person?.phone || "No disponible"}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center space-x-1 sm:space-x-3 flex-shrink-0">
                            <div className="hidden sm:block">{getStatusIcon(attendance[student.student.id])}</div>
                            <select
                                value={attendance[student.student.id] || ""}
                                onChange={(e) => onAttendanceChange(student.student.id, e.target.value as AttendanceStatus)}
                                className={`px-2 py-1 sm:px-3 sm:py-2 border rounded-lg font-medium text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-0 w-20 sm:w-auto ${getStatusColor(attendance[student.student.id])}`}
                            >
                                <option value="" disabled hidden>
                                    Seleccionar
                                </option>
                                {attendanceStates?.map((state: any) => (
                                    <option key={state.id} value={state.id}>
                                        {state.status}
                                    </option>
                                ))}
                            </select>
                        </div>

                    </div>
                </div>
            ))}
        </div>
    )
}
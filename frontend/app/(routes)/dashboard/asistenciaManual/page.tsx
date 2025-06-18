"use client"

import { useState, useEffect, useMemo } from "react"
import { useSelector } from "react-redux"
import { toast } from "react-toastify"
import { Save } from "lucide-react"
import type {
    AttendanceData,
    AttendanceHistory as AttendanceHistoryType,
    AttendanceStats,
    AttendanceStatus,
    FilterOption,
} from "@type/pages/attendanceManual"

import { AttendanceHeader } from "@/components/features/attendance/attendanceManual/attendanceManualHeader"
import { AttendanceStatsSection } from "@/components/features/attendance/attendanceManual/attendanceStatsCard"
import { CourseInfoSection } from "@/components/features/attendance/attendanceManual/courseInfo"
import { AttendanceControls } from "@/components/features/attendance/attendanceManual/attendanceControls"
import { StudentList } from "@/components/features/attendance/attendanceManual/studentList"
import { AttendanceHistory } from "@/components/features/attendance/attendanceManual/attendanceHistory"
import { LoadingState, ErrorState, EmptyStudentsState } from "@/components/features/attendance/attendanceManual/state"

const AttendanceManualPage: React.FC = () => {
    const { data: studySheet, loading, error } = useSelector((state: any) => state.studySheet)
    const studySheetObj = Array.isArray(studySheet) ? studySheet[0] : studySheet
    const students = studySheetObj?.students || []

    const [attendance, setAttendance] = useState<Record<string | number, AttendanceStatus>>({})
    const [searchTerm, setSearchTerm] = useState<string>("")
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split("T")[0])
    const [selectedFilter, setSelectedFilter] = useState<FilterOption>("todos")
    const [selectedStudent, setSelectedStudent] = useState<string | number | null>(null)
    const [attendanceHistory, setAttendanceHistory] = useState<AttendanceHistoryType[]>([])

    useEffect(() => {
        if (students.length > 0) {
            // No inicialices con valores por defecto, deja que las stats empiecen en 0
            const initialAttendance: Record<string | number, AttendanceStatus> = {}
            // No asignes ningún valor inicial para que las estadísticas estén en 0
            setAttendance(initialAttendance)

            const mockHistory: AttendanceHistoryType[] = [
                { date: "2024-12-01", presente: 6, ausente: 1, justificado: 1, retardo: 0 },
                { date: "2024-12-02", presente: 7, ausente: 0, justificado: 0, retardo: 1 },
                { date: "2024-12-03", presente: 5, ausente: 2, justificado: 1, retardo: 0 },
                { date: "2024-12-04", presente: 8, ausente: 0, justificado: 0, retardo: 0 },
                { date: "2024-12-05", presente: 6, ausente: 1, justificado: 0, retardo: 1 },
            ]
            setAttendanceHistory(mockHistory)
        }
    }, [students])

    const filteredStudents = useMemo(() => {
        if (!students.length) return []

        let filtered = students.filter((student: any) => {
            const person = student.person || {}
            const name = person.name || ""
            const lastname = person.lastname || ""
            const document = person.document || ""

            return (
                name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                lastname.toLowerCase().includes(searchTerm.toLowerCase()) ||
                document.toLowerCase().includes(searchTerm.toLowerCase())
            )
        })

        if (selectedFilter !== "todos") {
            filtered = filtered.filter((student: any) => attendance[student.id] === selectedFilter)
        }

        return filtered
    }, [searchTerm, students, selectedFilter, attendance])

    const handleAttendanceChange = (studentId: string | number, value: AttendanceStatus): void => {
        setAttendance((prev) => ({ ...prev, [studentId]: value }))
    }

    const handleSave = (): void => {
        const attendanceData: AttendanceData = {
            date: selectedDate,
            attendance,
            studySheetId: studySheet?.id,
        }
        console.log("Guardando asistencia:", attendanceData)
        toast.success("Asistencia guardada exitosamente")
    }

    const handleExportAttendance = (): void => {
        const csvContent =
            "data:text/csv;charset=utf-8," +
            "Nombre,Apellido,Documento,Estado\n" +
            filteredStudents
                .map(
                    (student: any) =>
                        `${student.person?.name || ""},${student.person?.lastname || ""},${student.person?.document || ""},${attendance[student.id] || "sin marcar"}`,
                )
                .join("\n")

        const encodedUri = encodeURI(csvContent)
        const link = document.createElement("a")
        link.setAttribute("href", encodedUri)
        link.setAttribute("download", `asistencia_${selectedDate}.csv`)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    const getAttendanceStats = (): AttendanceStats => {
        const stats: AttendanceStats = { presente: 0, ausente: 0, justificado: 0, retardo: 0 }

        Object.values(attendance).forEach((status) => {
            if (status) { // Solo cuenta si el estudiante tiene un estado asignado
                const key = status.toLowerCase() as keyof AttendanceStats
                if (key in stats) {
                    stats[key] += 1
                }
            }
        })

        return stats
    }

    const stats = getAttendanceStats()
    const attendancePercentage = students.length > 0 ? Math.round((stats.presente / students.length) * 100) : 0

    if (loading) return <LoadingState />
    if (error) return <ErrorState error={error} />
    if (!students.length) return <EmptyStudentsState />

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
            <AttendanceHeader studySheet={studySheet} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    <div className="lg:col-span-1 space-y-6">
                        <CourseInfoSection
                            studySheet={studySheetObj}
                            onExportAttendance={handleExportAttendance}
                        />
                        <AttendanceStatsSection stats={stats} attendancePercentage={attendancePercentage} />

                    </div>

                    <div className="lg:col-span-3 space-y-6">
                        <AttendanceControls
                            selectedDate={selectedDate}
                            searchTerm={searchTerm}
                            selectedFilter={selectedFilter}
                            onDateChange={setSelectedDate}
                            onSearchChange={setSearchTerm}
                            onFilterChange={setSelectedFilter}
                        />

                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                            <div className="p-6">
                                <StudentList
                                    students={filteredStudents}
                                    attendance={attendance}
                                    selectedStudent={selectedStudent}
                                    onAttendanceChange={handleAttendanceChange}
                                    onStudentSelect={setSelectedStudent}
                                />
                            </div>
                        </div>

                        <AttendanceHistory attendanceHistory={attendanceHistory} />

                        <div className="flex justify-end">
                            <button
                                onClick={handleSave}
                                className="px-8 py-3 bg-lightGreen dark:bg-darkBlue text-black dark:text-white rounded-2xl transition-colors font-medium flex items-center space-x-2 shadow-sm"
                            >
                                <Save className="w-5 h-5" />
                                <span>Guardar Asistencia</span>
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default AttendanceManualPage
"use client"

import { useState, useEffect, useMemo } from "react"
import type { AppDispatch } from "@/redux/store"
import { useDispatch, useSelector } from "react-redux"
import { toast } from "react-toastify"
import { Save } from "lucide-react"
import { fetchStudySheetById } from "@slice/olympo/studySheetSlice"
import { addAttendance } from "@slice/attendanceSlice"
import { AttendanceHeader } from "@/components/features/asistencia/attendanceManual/attendanceManualHeader"
import { AttendanceStatsSection } from "@/components/features/asistencia/attendanceManual/attendanceStatsCard"
import { CourseInfoSection } from "@/components/features/asistencia/attendanceManual/courseInfo"
import { AttendanceControls } from "@/components/features/asistencia/attendanceManual/attendanceControls"
import { StudentList } from "@/components/features/asistencia/attendanceManual/studentList"
import { AttendanceHistory } from "@/components/features/asistencia/attendanceManual/attendanceHistory"
import { ErrorState, EmptyStudentsState } from "@/components/features/asistencia/attendanceManual/state"
import { useLoader } from "@context/LoaderContext"
import type {
    AttendanceHistory as AttendanceHistoryType,
    AttendanceStats,
    AttendanceStatus,
    FilterOption,
} from "@type/pages/attendanceManual"

const AttendanceManualPage: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>()
    const { data: studySheet, loading, error } = useSelector((state: any) => state.studySheet)
    const { showLoader, hideLoader } = useLoader()

    const studySheetObj = Array.isArray(studySheet) ? studySheet[0] : studySheet
    const students = studySheetObj?.studentStudySheets || []

    console.log(students)

    const [attendance, setAttendance] = useState<Record<string | number, AttendanceStatus>>({})
    const [searchTerm, setSearchTerm] = useState<string>("")
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toLocaleDateString('en-CA'))
    const [selectedFilter, setSelectedFilter] = useState<FilterOption>("todos")
    const [selectedStudent, setSelectedStudent] = useState<string | number | null>(null)
    const [attendanceHistory, setAttendanceHistory] = useState<AttendanceHistoryType[]>([])

    useEffect(() => {
        if (loading) {
            showLoader()
        } else {
            hideLoader()
        }
    }, [loading, showLoader, hideLoader])

    useEffect(() => {
        if (students.length > 0) {
            const initialAttendance: Record<string | number, AttendanceStatus> = {}
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

        let filtered = students.filter((studentStudySheet: any) => {
            const person = studentStudySheet?.student?.person || {}
            const name = person?.name || ""
            const lastname = person?.lastname || ""
            const document = person?.document || ""

            return (
                name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                lastname.toLowerCase().includes(searchTerm.toLowerCase()) ||
                document.toLowerCase().includes(searchTerm.toLowerCase())
            )
        })

        if (selectedFilter !== "todos") {
            filtered = filtered.filter((studentStudySheet: any) => attendance[studentStudySheet.id] === selectedFilter)
        }

        return filtered
    }, [searchTerm, students, selectedFilter, attendance])

    const handleAttendanceChange = (studentId: string | number, value: AttendanceStatus): void => {
        console.log(`Attendance changed for student ${studentId}: ${value}`)
        setAttendance((prev) => ({ ...prev, [studentId]: value }))
    }

    const handleSave = async (): Promise<void> => {
        if (!studySheetObj?.id) {
            toast.error("No se encontró la ficha de estudio.")
            return
        }

        const entries = Object.entries(attendance)
        console.log("Entries to save:", entries)
        if (!entries.length) {
            toast.warning("No hay asistencia marcada para guardar.")
            return
        }

        try {
            await Promise.all(
                entries.map(([studentId, statusId]) => {
                    if (!statusId) return Promise.resolve()

                    const attendanceState = {
                        id: statusId,
                        status: undefined,
                    }
                    return dispatch(
                        addAttendance({
                            attendanceDate: selectedDate,
                            studentId: Number(studentId),
                            attendanceState,
                        })
                    ).unwrap()
                })
            )
            toast.success("Asistencia guardada exitosamente")
        } catch (error: any) {
            toast.error(`Error al guardar asistencia: ${error.message ?? "Error desconocido"}`)
        }
    }

    const getAttendanceStats = (): AttendanceStats => {
        const stats: AttendanceStats = { presente: 0, ausente: 0, justificado: 0, retardo: 0 }

        // MAPEO CORRECTO: Los valores son strings numéricos ("1", "2", etc.)
        const statusMap: Record<string, keyof AttendanceStats> = {
            '1': 'presente',
            '2': 'ausente',
            '4': 'justificado',
            '3': 'retardo'
        };

        Object.values(attendance).forEach((status) => {
            if (status) {
                const statusString = status.toString();
                const statusKey = statusMap[statusString];

                if (statusKey && statusKey in stats) {
                    stats[statusKey] += 1;
                }
            }
        })
        return stats
    }

    const getAttendancePercentage = (stats: AttendanceStats): number => {
        const totalStudents = students.length;
        if (totalStudents === 0) return 0;

        const effectiveAttendance = stats.presente + stats.retardo;
        return Math.round((effectiveAttendance / totalStudents) * 100);
    }

    const stats = getAttendanceStats()
    const attendancePercentage = getAttendancePercentage(stats)

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

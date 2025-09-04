"use client"

import { useState, useEffect, useMemo } from "react"
import type { AppDispatch } from "@redux/store"
import { useDispatch, useSelector } from "react-redux"
import { toast } from "react-toastify"
import { Save } from "lucide-react"
import { addAttendance } from "@slice/attendanceSlice"
import { AttendanceHeader } from "./attendanceManualHeader"
import { AttendanceStatsSection } from "./attendanceStatsCard"
import { CourseInfoSection } from "./courseInfo"
import { AttendanceControls } from "./attendanceControls"
import { StudentList } from "./studentList"
import { AttendanceHistory } from "./attendanceHistory"
import { ErrorState, EmptyStudentsState } from "./state"
import { useLoader } from "@context/LoaderContext"
import type {
    AttendanceHistory as AttendanceHistoryType,
    AttendanceStats,
    AttendanceStatus,
    FilterOption,
    AsistenciaManualContainerProps,
    Competence,
} from "./types"

export const AsistenciaManualContainer: React.FC<AsistenciaManualContainerProps> = ({
    isDarkMode = false,
    competenceId = null
}) => {
    const dispatch = useDispatch<AppDispatch>()
    const { data: studySheet, loading, error } = useSelector((state: any) => state.studySheet)
    const { showLoader, hideLoader } = useLoader()

    const studySheetObj = Array.isArray(studySheet) ? studySheet[0] : studySheet
    const students = useMemo(() => {
        return studySheetObj?.studentStudySheets ?? [];
    }, [studySheetObj?.studentStudySheets]);

    // Estados del componente
    const [attendance, setAttendance] = useState<Record<string | number, AttendanceStatus>>({})
    const [searchTerm, setSearchTerm] = useState<string>("")
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toLocaleDateString('en-CA'))
    const [selectedFilter, setSelectedFilter] = useState<FilterOption>("todos")
    const [selectedStudent, setSelectedStudent] = useState<string | number | null>(null)
    const [selectedCompetence, setSelectedCompetence] = useState<string | number | null>(null)
    const [attendanceHistory, setAttendanceHistory] = useState<AttendanceHistoryType[]>([])

    // Configuración de competencia
    const isCompetenceFixed = Boolean(competenceId)

    // Extraer competencias disponibles del studySheet
    const competences: Competence[] = useMemo(() => {
        if (!studySheetObj?.teacherStudySheets) return []

        return studySheetObj.teacherStudySheets
            .filter((ts: any) => ts.competence?.name)
            .map((ts: any) => ({
                id: ts.id,
                name: ts.competence.name
            }))
    }, [studySheetObj?.teacherStudySheets])

    // Establecer la competencia inicial si viene por parámetro
    useEffect(() => {
        if (competenceId && competences.length > 0) {
            const competenceExists = competences.find(c => c.id.toString() === competenceId)
            if (competenceExists) {
                setSelectedCompetence(competenceId)
            }
        }
    }, [competenceId, competences])

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
            setAttendanceHistory([])
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
        setAttendance((prev) => ({ ...prev, [studentId]: value }))
    }

    const handleSave = async (): Promise<void> => {
        // Validaciones previas
        if (!studySheetObj?.id) {
            toast.error("No se encontró la ficha de estudio.")
            return
        }

        if (!selectedCompetence) {
            toast.error("Debe seleccionar una competencia antes de guardar.")
            return
        }

        const entries = Object.entries(attendance)
        if (!entries.length) {
            toast.warning("No hay asistencia marcada para guardar.")
            return
        }

        try {
            // Guardar cada registro de asistencia
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
                            competenceQuarter: selectedCompetence.toString(),
                        })
                    ).unwrap()
                })
            )

            toast.success("Asistencia guardada exitosamente")
            // Limpiar el formulario después de guardar exitosamente
            setAttendance({})
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
        <div className={`min-h-screen transition-colors ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
            }`}>
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
                            selectedCompetence={selectedCompetence}
                            competences={competences}
                            onDateChange={setSelectedDate}
                            onSearchChange={setSearchTerm}
                            onFilterChange={setSelectedFilter}
                            onCompetenceChange={setSelectedCompetence}
                            isCompetenceFixed={!!competenceId}
                        />

                        <div className={`rounded-xl shadow-sm border transition-colors ${isDarkMode
                            ? 'bg-gray-800 border-gray-700'
                            : 'bg-white border-gray-200'
                            }`}>
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
                                disabled={!selectedCompetence || Object.keys(attendance).length === 0}
                                className={`px-8 py-3 rounded-2xl transition-colors font-medium flex items-center space-x-2 shadow-sm ${!selectedCompetence || Object.keys(attendance).length === 0
                                    ? 'bg-gray-400 cursor-not-allowed text-gray-200'
                                    : isDarkMode
                                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                        : 'bg-green-500 hover:bg-green-600 text-white'
                                    }`}
                                title={!selectedCompetence ? 'Debe seleccionar una competencia' : Object.keys(attendance).length === 0 ? 'No hay asistencia marcada' : ''}
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
};

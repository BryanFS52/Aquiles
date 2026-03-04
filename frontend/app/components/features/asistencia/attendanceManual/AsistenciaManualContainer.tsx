"use client"

import { useState, useEffect, useMemo } from "react"
import { AppDispatch } from "@redux/store"
import { useDispatch, useSelector } from "react-redux"
import { toast } from "react-toastify"
import { Save } from "lucide-react"
import { addAttendance } from "@slice/attendanceSlice"
import { fetchStudySheetByIdWithAttendances } from "@slice/olympo/studySheetSlice"
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
    competenceId = null,
    studySheetId = null
}) => {
    const dispatch = useDispatch<AppDispatch>()
    const { 
        data: studySheet, 
        selectedForAttendance, 
        loading, 
        loadingAttendanceSheet, 
        error 
    } = useSelector((state: any) => state.studySheet)
    const { showLoader, hideLoader } = useLoader()

    // Usar la ficha seleccionada para asistencia si está disponible, de lo contrario usar la primera del array
    const studySheetObj = selectedForAttendance || (Array.isArray(studySheet) ? studySheet[0] : studySheet)
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
        // Mostrar loader cuando está cargando la ficha de asistencia o la carga general
        if (loading || loadingAttendanceSheet) {
            showLoader()
        } else {
            // Solo ocultar el loader si tenemos datos o hay un error
            if (studySheetObj || error) {
                hideLoader()
            }
        }
    }, [loading, loadingAttendanceSheet, studySheetObj, error, showLoader, hideLoader])

    // Efecto para cargar la ficha desde la URL si no está disponible en Redux
    useEffect(() => {
        if (studySheetId && !selectedForAttendance && !loadingAttendanceSheet) {
            const id = parseInt(studySheetId);
            const competenceIdNum = competenceId ? parseInt(competenceId) : undefined;
            
            dispatch(fetchStudySheetByIdWithAttendances({
                id,
                competenceId: competenceIdNum
            }));
        }
    }, [studySheetId, competenceId, selectedForAttendance, loadingAttendanceSheet, dispatch]);

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
    
    // Si estamos cargando y no hay datos, mantener el loader
    if ((loading || loadingAttendanceSheet) && !studySheetObj) {
        return null; // El loader global se encarga de mostrar la pantalla de carga
    }
    
    // Mostrar estado de carga específico solo si hay studySheetId en URL pero no hay ficha disponible
    if (studySheetId && !studySheetObj && !error && !(loading || loadingAttendanceSheet)) {
        return (
            <div className={`min-h-screen flex items-center justify-center transition-colors bg-transparent`}>
                <div className="text-center">
                    <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        No se pudo cargar la información de la ficha.
                    </p>
                    <button 
                        onClick={() => window.location.href = '/dashboard/FichasInstructor'}
                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        Volver a Fichas del Instructor
                    </button>
                </div>
            </div>
        )
    }
    
    // Mostrar mensaje si no hay ficha disponible y no hay parámetros de URL
    if (!studySheetObj && !error && !studySheetId && !(loading || loadingAttendanceSheet)) {
        return (
            <div className={`min-h-screen flex items-center justify-center transition-colors bg-transparent`}>
                <div className="text-center">
                    <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        No se encontró información de la ficha. Por favor, selecciona una ficha desde la página de Fichas del Instructor.
                    </p>
                    <button 
                        onClick={() => window.location.href = '/dashboard/FichasInstructor'}
                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        Ir a Fichas del Instructor
                    </button>
                </div>
            </div>
        )
    }
    
    if (!students.length && studySheetObj) return <EmptyStudentsState />

    return (
        <div className={`min-h-screen transition-colors ${isDarkMode ? 'bg-transparent' : 'bg-transparent'
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

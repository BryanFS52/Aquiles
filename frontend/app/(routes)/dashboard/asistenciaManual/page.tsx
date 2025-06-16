'use client';

import { useState, useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import {
    CheckCircle, XCircle, Clock, Users, Save, Search, Calendar,
    ArrowLeft, BarChart3, Download, Filter,
    TrendingUp, BookOpen, GraduationCap,
    FileText, ChevronDown, Mail, Phone
} from 'lucide-react';

// Types
interface Person {
    name?: string;
    lastname?: string;
    document?: string;
    email?: string;
    phone?: string;
}

interface Student {
    id: string | number;
    person?: Person;
}

interface StudySheet {
    id?: string | number;
    name?: string;
    program?: string;
    number?: string;
    description?: string;
    schedule?: string;
    shift?: string;
}

interface AttendanceStats {
    presente: number;
    ausente: number;
    justificado: number;
    retardo: number;
}

interface AttendanceHistory {
    date: string;
    presente: number;
    ausente: number;
    justificado: number;
    retardo: number;
}

interface AttendanceData {
    date: string;
    attendance: Record<string | number, string>;
    studySheetId?: string | number;
}

interface AttendanceManualPageProps {
    students: Student[];
    studySheet?: StudySheet | null;
    loading?: boolean;
}

type AttendanceStatus = 'presente' | 'ausente' | 'justificado' | 'retardo';
type FilterOption = 'todos' | AttendanceStatus;

const AttendanceManualPage: React.FC<AttendanceManualPageProps> = ({
    students,
    studySheet = null,
    loading = false
}) => {
    const error = null;
    const [attendance, setAttendance] = useState<Record<string | number, AttendanceStatus>>({});
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [selectedFilter, setSelectedFilter] = useState<FilterOption>('todos');
    const [selectedStudent, setSelectedStudent] = useState<string | number | null>(null);
    const [attendanceHistory, setAttendanceHistory] = useState<AttendanceHistory[]>([]);

    // Inicializar asistencia cuando lleguen los estudiantes
    useEffect(() => {
        if (students && students.length > 0) {
            const initialAttendance: Record<string | number, AttendanceStatus> = {};
            students.forEach(student => {
                initialAttendance[student.id] = 'presente';
            });
            setAttendance(initialAttendance);

            // Mock historial de asistencia
            const mockHistory: AttendanceHistory[] = [
                { date: '2024-12-01', presente: 6, ausente: 1, justificado: 1, retardo: 0 },
                { date: '2024-12-02', presente: 7, ausente: 0, justificado: 0, retardo: 1 },
                { date: '2024-12-03', presente: 5, ausente: 2, justificado: 1, retardo: 0 },
                { date: '2024-12-04', presente: 8, ausente: 0, justificado: 0, retardo: 0 },
                { date: '2024-12-05', presente: 6, ausente: 1, justificado: 0, retardo: 1 },
            ];
            setAttendanceHistory(mockHistory);
        }
    }, [students]);

    // Filtrar estudiantes usando useMemo para optimizar
    const filteredStudents = useMemo(() => {
        if (!students || !students.length) return [];

        let filtered = students.filter(student => {
            const person = student.person || {};
            const name = person.name || '';
            const lastname = person.lastname || '';
            const document = person.document || '';

            return (
                name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                lastname.toLowerCase().includes(searchTerm.toLowerCase()) ||
                document.toLowerCase().includes(searchTerm.toLowerCase())
            );
        });

        if (selectedFilter !== 'todos') {
            filtered = filtered.filter(student => attendance[student.id] === selectedFilter);
        }

        return filtered;
    }, [searchTerm, students, selectedFilter, attendance]);

    const handleAttendanceChange = (studentId: string | number, value: AttendanceStatus): void => {
        setAttendance(prev => ({ ...prev, [studentId]: value }));
    };

    const handleSave = (): void => {
        const attendanceData: AttendanceData = {
            date: selectedDate,
            attendance: attendance,
            studySheetId: studySheet?.id
        };
        console.log('Guardando asistencia:', attendanceData);
        toast.success('Asistencia guardada exitosamente');
    };

    const getAttendanceStats = (): AttendanceStats => {
        const stats: AttendanceStats = { presente: 0, ausente: 0, justificado: 0, retardo: 0 };
        Object.values(attendance).forEach(status => {
            stats[status] = (stats[status] || 0) + 1;
        });
        return stats;
    };

    const getStatusIcon = (status: AttendanceStatus): JSX.Element => {
        switch (status) {
            case 'presente': return <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 dark:text-green-400" />;
            case 'ausente': return <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 dark:text-red-400" />;
            case 'justificado': return <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400" />;
            case 'retardo': return <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600 dark:text-orange-400" />;
            default: return <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />;
        }
    };

    const getStatusColor = (status: AttendanceStatus): string => {
        switch (status) {
            case 'presente': return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-200 dark:border-green-700';
            case 'ausente': return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-200 dark:border-red-700';
            case 'justificado': return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:border-blue-700';
            case 'retardo': return 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900 dark:text-orange-200 dark:border-orange-700';
            default: return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600';
        }
    };

    const exportAttendance = (): void => {
        const csvContent = "data:text/csv;charset=utf-8,"
            + "Nombre,Apellido,Documento,Estado\n"
            + filteredStudents.map(student =>
                `${student.person?.name || ''},${student.person?.lastname || ''},${student.person?.document || ''},${attendance[student.id]}`
            ).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `asistencia_${selectedDate}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Estados de carga y error
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-lightGreen dark:border-darkBlue"></div>
                    <p className="mt-4 text-gray-600 dark:text-gray-400">Cargando estudiantes...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Error al cargar datos</h2>
                    <p className="text-gray-600 dark:text-gray-400">{error}</p>
                </div>
            </div>
        );
    }

    if (!students || !students.length) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">No hay estudiantes</h2>
                    <p className="text-gray-600 dark:text-gray-400">No se encontraron estudiantes en esta ficha de estudio.</p>
                </div>
            </div>
        );
    }

    const stats = getAttendanceStats();
    const attendancePercentage = students.length > 0 ? Math.round((stats.presente / students.length) * 100) : 0;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
            {/* Sub Header */}
            <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between py-4">
                        <div className="flex items-center space-x-4">
                            <button className="lg:hidden p-2 rounded-md text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700">
                                <ArrowLeft className="w-6 h-6" />
                            </button>
                            <div className="flex items-center space-x-3">
                                <div className="bg-lightGreen dark:bg-blue-600 p-2 rounded-lg">
                                    <Users className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Control de Asistencia</h1>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {studySheet?.name || studySheet?.program || 'Ficha de Estudio'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Sidebar - Estadísticas y controles */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Estadísticas principales */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Resumen Hoy</h3>
                                <BarChart3 className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Asistencia</span>
                                    <span className={`text-2xl font-bold ${attendancePercentage >= 80 ? 'text-green-600 dark:text-green-400' : attendancePercentage >= 60 ? 'text-orange-600 dark:text-orange-400' : 'text-red-600 dark:text-red-400'}`}>
                                        {attendancePercentage}%
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                    <div
                                        className={`h-2 rounded-full ${attendancePercentage >= 80 ? 'bg-green-600 dark:bg-green-400' : attendancePercentage >= 60 ? 'bg-orange-600 dark:bg-orange-400' : 'bg-red-600 dark:bg-red-400'}`}
                                        style={{ width: `${attendancePercentage}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>

                        {/* Stats cards pequeñas */}
                        <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
                            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-4 rounded-lg">
                                <div className="flex items-center space-x-2">
                                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                                    <span className="text-sm font-medium text-green-800 dark:text-green-200">Presentes</span>
                                </div>
                                <div className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">{stats.presente}</div>
                            </div>
                            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 rounded-lg">
                                <div className="flex items-center space-x-2">
                                    <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                                    <span className="text-sm font-medium text-red-800 dark:text-red-200">Ausentes</span>
                                </div>
                                <div className="text-2xl font-bold text-red-600 dark:text-red-400 mt-1">{stats.ausente}</div>
                            </div>
                        </div>

                        {/* Información del curso */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Info del Curso</h3>
                                <BookOpen className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-center space-x-3">
                                    <GraduationCap className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                            {studySheet?.program || 'ADSO'} - Ficha {studySheet?.id || studySheet?.number || '2758438'}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            {studySheet?.description || 'Análisis y Desarrollo de Software'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <Users className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                            {students.length} Estudiantes
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Matriculados</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <Clock className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                            {studySheet?.schedule || '7:00 AM - 12:00 PM'}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            {studySheet?.shift || 'Horario Matutino'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Acciones rápidas */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Acciones</h3>
                            <div className="space-y-3">
                                <button
                                    onClick={exportAttendance}
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
                    </div>

                    {/* Contenido principal */}
                    <div className="lg:col-span-3 space-y-6">
                        {/* Controles principales */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between mb-6">
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Registro de Asistencia</h2>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Selecciona el estado de cada estudiante</p>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-lg">
                                        <Calendar className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                                        <input
                                            type="date"
                                            value={selectedDate}
                                            onChange={(e) => setSelectedDate(e.target.value)}
                                            className="border-0 bg-transparent text-gray-700 dark:text-gray-200 font-medium focus:outline-none text-sm"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Barra de búsqueda y filtros */}
                            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400 dark:text-gray-500" />
                                    <input
                                        type="text"
                                        placeholder="Buscar por nombre o documento..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Filter className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                                    <select
                                        value={selectedFilter}
                                        onChange={(e) => setSelectedFilter(e.target.value as FilterOption)}
                                        className="px-3 py-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                    >
                                        <option value="todos">Todos</option>
                                        <option value="presente">Presentes</option>
                                        <option value="ausente">Ausentes</option>
                                        <option value="justificado">Justificados</option>
                                        <option value="retardo">Retardos</option>
                                    </select>
                                </div>
                            </div>

                            {/* Lista de estudiantes */}
                            <div className="space-y-3 max-h-96 overflow-y-auto">
                                {filteredStudents.map((student, index) => (
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
                                                            {student.person?.name || 'N/A'} {student.person?.lastname || ''}
                                                        </h3>
                                                        <button
                                                            onClick={() => setSelectedStudent(selectedStudent === student.id ? null : student.id)}
                                                            className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400"
                                                        >
                                                            <ChevronDown className={`w-4 h-4 transition-transform ${selectedStudent === student.id ? 'rotate-180' : ''}`} />
                                                        </button>
                                                    </div>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                                        Doc: {student.person?.document || 'N/A'}
                                                    </p>

                                                    {/* Información expandida */}
                                                    {selectedStudent === student.id && (
                                                        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                                                            <div className="flex items-center space-x-2">
                                                                <Mail className="w-3 h-3 text-gray-400 dark:text-gray-500" />
                                                                <span className="text-gray-600 dark:text-gray-300">
                                                                    {student.person?.email || 'No disponible'}
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                <Phone className="w-3 h-3 text-gray-400 dark:text-gray-500" />
                                                                <span className="text-gray-600 dark:text-gray-300">
                                                                    {student.person?.phone || 'No disponible'}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-3 flex-shrink-0">
                                                <div className="hidden sm:block">
                                                    {getStatusIcon(attendance[student.id])}
                                                </div>
                                                <select
                                                    value={attendance[student.id] || 'presente'}
                                                    onChange={(e) => handleAttendanceChange(student.id, e.target.value as AttendanceStatus)}
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

                            {filteredStudents.length === 0 && (
                                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                                    <Users className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                                    <p className="text-lg">No se encontraron estudiantes</p>
                                    <p className="text-sm">Intenta con otro término de búsqueda</p>
                                </div>
                            )}
                        </div>

                        {/* Historial de asistencia */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Historial de Asistencia</h3>
                                <TrendingUp className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                                {attendanceHistory.map((day, index) => (
                                    <div key={index} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                                            {new Date(day.date).toLocaleDateString('es-ES', {
                                                month: 'short',
                                                day: 'numeric'
                                            })}
                                        </div>
                                        <div className="space-y-1 text-xs">
                                            <div className="flex justify-between">
                                                <span className="text-green-600 dark:text-green-400">Presentes:</span>
                                                <span className="font-medium text-gray-900 dark:text-gray-100">{day.presente}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-red-600 dark:text-red-400">Ausentes:</span>
                                                <span className="font-medium text-gray-900 dark:text-gray-100">{day.ausente}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Botón de guardar */}
                        <div className="flex justify-end">
                            <button
                                onClick={handleSave}
                                className="px-8 py-3 bg-lightGreen dark:bg-darkBlue text-black dark:text-white rounded-2xl  transition-colors font-medium flex items-center space-x-2 shadow-sm"
                            >
                                <Save className="w-5 h-5" />
                                <span>Guardar Asistencia</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default AttendanceManualPage;

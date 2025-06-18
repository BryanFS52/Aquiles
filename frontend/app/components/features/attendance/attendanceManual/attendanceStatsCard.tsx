import {
    BarChart3,
    CheckCircle,
    XCircle,
    Clock,
    FileText,
} from "lucide-react"
import type { AttendanceStats } from "@type/pages/attendanceManual"

interface AttendanceStatsSectionProps {
    stats: AttendanceStats
    attendancePercentage?: number // Hacemos opcional para calcularlo internamente si no se proporciona
}

const statusConfig = {
    presente: {
        label: "Presentes",
        icon: CheckCircle,
        bg: "bg-green-100/60 dark:bg-green-900/30 backdrop-blur-sm",
        border: "border-green-300/30 dark:border-green-600/40",
        text: "text-green-900 dark:text-green-200",
        value: "text-green-700 dark:text-green-400",
        iconColor: "text-green-600 dark:text-green-400",
        countsAsAttendance: true,
    },
    ausente: {
        label: "Ausentes",
        icon: XCircle,
        bg: "bg-red-100/60 dark:bg-red-900/30 backdrop-blur-sm",
        border: "border-red-300/30 dark:border-red-600/40",
        text: "text-red-900 dark:text-red-200",
        value: "text-red-700 dark:text-red-400",
        iconColor: "text-red-600 dark:text-red-400",
        countsAsAttendance: false,
    },
    justificado: {
        label: "Justificados",
        icon: FileText,
        bg: "bg-blue-100/60 dark:bg-blue-900/30 backdrop-blur-sm",
        border: "border-blue-300/30 dark:border-blue-600/40",
        text: "text-blue-900 dark:text-blue-200",
        value: "text-blue-700 dark:text-blue-400",
        iconColor: "text-blue-600 dark:text-blue-400",
        countsAsAttendance: false, // Los justificados normalmente no cuentan como asistencia efectiva
    },
    retardo: {
        label: "Retardos",
        icon: Clock,
        bg: "bg-orange-100/60 dark:bg-orange-900/30 backdrop-blur-sm",
        border: "border-orange-300/30 dark:border-orange-600/40",
        text: "text-orange-900 dark:text-orange-200",
        value: "text-orange-700 dark:text-orange-400",
        iconColor: "text-orange-600 dark:text-orange-400",
        countsAsAttendance: true, // Los retardos SÍ cuentan como asistencia
    },
} as const

export function AttendanceStatsSection({ stats, attendancePercentage: providedPercentage }: AttendanceStatsSectionProps) {
    // Calcular el porcentaje de asistencia si no se proporciona
    const calculateAttendancePercentage = () => {
        if (providedPercentage !== undefined) {
            return providedPercentage;
        }

        const totalStudents = Object.values(stats).reduce((sum, count) => sum + count, 0);
        if (totalStudents === 0) return 0;

        const attendingStudents = Object.entries(stats).reduce((sum, [key, count]) => {
            const config = statusConfig[key as keyof typeof statusConfig];
            return sum + (config?.countsAsAttendance ? count : 0);
        }, 0);

        return Math.round((attendingStudents / totalStudents) * 100);
    };

    const attendancePercentage = calculateAttendancePercentage();

    // Determinar el color predominante basado en los tipos de asistencia
    const getDominantAttendanceColor = () => {
        const attendingTypes = Object.entries(stats).filter(([key, count]) => {
            const config = statusConfig[key as keyof typeof statusConfig];
            return config?.countsAsAttendance && count > 0;
        });

        if (attendingTypes.length === 0) {
            return {
                bg: "bg-red-500 dark:bg-red-400",
                gradient: "from-red-500 to-red-600 dark:from-red-400 dark:to-red-500"
            };
        }

        // Si hay más presentes que retardos, usar verde
        const presentes = stats.presente || 0;
        const retardos = stats.retardo || 0;

        if (presentes >= retardos) {
            return {
                bg: "bg-green-500 dark:bg-green-400",
                gradient: "from-green-500 to-green-600 dark:from-green-400 dark:to-green-500"
            };
        } else {
            // Si hay más retardos, usar naranja
            return {
                bg: "bg-orange-500 dark:bg-orange-400",
                gradient: "from-orange-500 to-orange-600 dark:from-orange-400 dark:to-orange-500"
            };
        }
    };

    const dominantColor = getDominantAttendanceColor();

    // Determinar el color del texto basado en el porcentaje
    const getPercentageTextColor = () => {
        if (attendancePercentage >= 80) {
            return "text-green-600 dark:text-green-400";
        } else if (attendancePercentage >= 60) {
            return "text-orange-600 dark:text-orange-400";
        } else {
            return "text-red-600 dark:text-red-400";
        }
    };

    return (
        <>
            {/* Main stats card */}
            <div className="rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6 transition-colors">
                <div className="flex items-center justify-between mb-5">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white tracking-tight">
                        Resumen de Hoy
                    </h3>
                    <BarChart3 className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Asistencia</span>
                        <span className={`text-2xl font-extrabold tracking-tight ${getPercentageTextColor()}`}>
                            {attendancePercentage}%
                        </span>
                    </div>

                    <div className="w-full h-2.5 rounded-full bg-gray-300 dark:bg-gray-700 overflow-hidden">
                        <div
                            className={`h-2.5 transition-all duration-700 ease-in-out rounded-full bg-gradient-to-r ${dominantColor.gradient}`}
                            style={{ width: `${attendancePercentage}%` }}
                        >
                            <div className="h-full w-full bg-white/20 animate-pulse"></div>
                        </div>
                    </div>

                    {/* Mostrar desglose de asistencia */}
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        <span>
                            Incluye: {stats.presente || 0} presentes
                            {(stats.retardo || 0) > 0 && ` + ${stats.retardo} retardos`}
                            {` de ${Object.values(stats).reduce((sum, count) => sum + count, 0)} total`}
                        </span>
                    </div>
                </div>
            </div>

            {/* Summary cards */}
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-4 mt-4">
                {Object.entries(stats).map(([key, count]) => {
                    const config = statusConfig[key as keyof typeof statusConfig]
                    if (!config) return null

                    const Icon = config.icon

                    return (
                        <div
                            key={key}
                            className={`rounded-2xl border p-5 shadow-sm transition-all duration-300 hover:shadow-md ${config.bg} ${config.border}`}
                        >
                            <div className="flex items-center gap-2">
                                <Icon className={`w-5 h-5 ${config.iconColor}`} />
                                <span className={`text-sm font-semibold ${config.text}`}>
                                    {config.label}
                                </span>
                                {config.countsAsAttendance && (
                                    <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-0.5 rounded-full">
                                        Cuenta
                                    </span>
                                )}
                            </div>
                            <div className={`text-3xl font-bold mt-2 ${config.value}`}>
                                {count}
                            </div>
                        </div>
                    )
                })}
            </div>
        </>
    )
}

// Función helper para calcular estadísticas desde datos en bruto (opcional)
export function calculateAttendanceStats(attendanceData: Array<{ status: string }>): {
    stats: AttendanceStats,
    attendancePercentage: number
} {
    const stats: AttendanceStats = {
        presente: 0,
        ausente: 0,
        justificado: 0,
        retardo: 0
    };

    // Contar cada tipo de estado
    attendanceData.forEach(record => {
        if (record.status in stats) {
            stats[record.status as keyof AttendanceStats]++;
        }
    });

    // Calcular porcentaje de asistencia (presentes + retardos)
    const totalStudents = attendanceData.length;
    const attendingStudents = stats.presente + stats.retardo;
    const attendancePercentage = totalStudents > 0 ? Math.round((attendingStudents / totalStudents) * 100) : 0;

    return { stats, attendancePercentage };
}
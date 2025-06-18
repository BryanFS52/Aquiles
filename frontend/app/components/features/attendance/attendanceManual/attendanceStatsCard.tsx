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
    attendancePercentage?: number
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
        barColor: "bg-green-500 dark:bg-green-400",
        countsAsAttendance: true,
    },
    retardo: {
        label: "Retardos",
        icon: Clock,
        bg: "bg-orange-100/60 dark:bg-orange-900/30 backdrop-blur-sm",
        border: "border-orange-300/30 dark:border-orange-600/40",
        text: "text-orange-900 dark:text-orange-200",
        value: "text-orange-700 dark:text-orange-400",
        iconColor: "text-orange-600 dark:text-orange-400",
        barColor: "bg-orange-500 dark:bg-orange-400",
        countsAsAttendance: true, // Los retardos SÍ cuentan como asistencia
    },
    justificado: {
        label: "Justificados",
        icon: FileText,
        bg: "bg-blue-100/60 dark:bg-blue-900/30 backdrop-blur-sm",
        border: "border-blue-300/30 dark:border-blue-600/40",
        text: "text-blue-900 dark:text-blue-200",
        value: "text-blue-700 dark:text-blue-400",
        iconColor: "text-blue-600 dark:text-blue-400",
        barColor: "bg-blue-500 dark:bg-blue-400",
        countsAsAttendance: false,
    },
    ausente: {
        label: "Ausentes",
        icon: XCircle,
        bg: "bg-red-100/60 dark:bg-red-900/30 backdrop-blur-sm",
        border: "border-red-300/30 dark:border-red-600/40",
        text: "text-red-900 dark:text-red-200",
        value: "text-red-700 dark:text-red-400",
        iconColor: "text-red-600 dark:text-red-400",
        barColor: "bg-red-500 dark:bg-red-400",
        countsAsAttendance: false,
    },
} as const

export function AttendanceStatsSection({ stats, attendancePercentage: providedPercentage }: AttendanceStatsSectionProps) {
    // Calcular el total de estudiantes
    const totalStudents = Object.values(stats).reduce((sum, count) => sum + count, 0);

    // Calcular el porcentaje de asistencia si no se proporciona
    const calculateAttendancePercentage = () => {
        if (providedPercentage !== undefined) {
            return providedPercentage;
        }

        if (totalStudents === 0) return 0;

        const attendingStudents = Object.entries(stats).reduce((sum, [key, count]) => {
            const config = statusConfig[key as keyof typeof statusConfig];
            return sum + (config?.countsAsAttendance ? count : 0);
        }, 0);

        return Math.round((attendingStudents / totalStudents) * 100);
    };

    const attendancePercentage = calculateAttendancePercentage();

    // Calcular porcentajes individuales para cada estado
    const getStatusPercentages = () => {
        if (totalStudents === 0) return {};

        const percentages: Record<string, number> = {};
        Object.entries(stats).forEach(([key, count]) => {
            percentages[key] = (count / totalStudents) * 100;
        });

        return percentages;
    };

    const statusPercentages = getStatusPercentages();

    // Determinar el color del texto basado en el porcentaje de asistencia
    const getPercentageTextColor = () => {
        if (attendancePercentage >= 80) {
            return "text-green-600 dark:text-green-400";
        } else if (attendancePercentage >= 60) {
            return "text-orange-600 dark:text-orange-400";
        } else {
            return "text-red-600 dark:text-red-400";
        }
    };

    // Orden de renderizado para la barra (primero los que cuentan como asistencia)
    const statusOrder = ['presente', 'retardo', 'justificado', 'ausente'] as const;

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

                    {/* Barra de progreso multi-color */}
                    <div className="w-full h-3 rounded-full bg-gray-300 dark:bg-gray-700 overflow-hidden relative">
                        <div className="h-full flex">
                            {statusOrder.map((status) => {
                                const config = statusConfig[status];
                                const percentage = statusPercentages[status] || 0;

                                if (percentage === 0) return null;

                                return (
                                    <div
                                        key={status}
                                        className={`h-full transition-all duration-700 ease-in-out ${config.barColor} relative overflow-hidden`}
                                        style={{ width: `${percentage}%` }}
                                        title={`${config.label}: ${stats[status]} (${percentage.toFixed(1)}%)`}
                                    >
                                        {/* Efecto de brillo */}
                                        <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                                        {/* Separador sutil entre secciones */}
                                        {percentage > 0 && (
                                            <div className="absolute right-0 top-0 bottom-0 w-px bg-white/30"></div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Leyenda de colores */}
                    <div className="flex flex-wrap gap-3 text-xs">
                        {statusOrder.map((status) => {
                            const config = statusConfig[status];
                            const count = stats[status] || 0;
                            const percentage = statusPercentages[status] || 0;

                            if (count === 0) return null;

                            return (
                                <div key={status} className="flex items-center gap-1.5">
                                    <div className={`w-3 h-3 rounded-sm ${config.barColor}`}></div>
                                    <span className="text-gray-600 dark:text-gray-400">
                                        {config.label}: {count} ({percentage.toFixed(1)}%)
                                    </span>
                                </div>
                            );
                        })}
                    </div>

                    {/* Mostrar desglose de asistencia */}
                    <div className="text-xs text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-200 dark:border-gray-700">
                        <span>
                            <strong className={getPercentageTextColor()}>Asistencia efectiva:</strong> {stats.presente || 0} presentes
                            {(stats.retardo || 0) > 0 && ` + ${stats.retardo} retardos`}
                            {` = ${attendancePercentage}% de ${totalStudents} total`}
                        </span>
                    </div>
                </div>
            </div>

            {/* Summary cards */}
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-4 mt-4">
                {statusOrder.map((status) => {
                    const config = statusConfig[status];
                    const count = stats[status] || 0;
                    const percentage = statusPercentages[status] || 0;

                    const Icon = config.icon

                    return (
                        <div
                            key={status}
                            className={`rounded-2xl border p-5 shadow-sm transition-all duration-300 hover:shadow-md ${config.bg} ${config.border}`}
                        >
                            <div className="flex items-center gap-2 mb-2">
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
                            <div className="flex items-end justify-between">
                                <div className={`text-3xl font-bold ${config.value}`}>
                                    {count}
                                </div>
                                <div className={`text-sm font-medium ${config.text}`}>
                                    {percentage.toFixed(1)}%
                                </div>
                            </div>

                            {/* Mini barra individual */}
                            <div className="w-full h-1.5 rounded-full bg-gray-200 dark:bg-gray-600 mt-3 overflow-hidden">
                                <div
                                    className={`h-full transition-all duration-500 ease-out ${config.barColor}`}
                                    style={{ width: `${percentage}%` }}
                                ></div>
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
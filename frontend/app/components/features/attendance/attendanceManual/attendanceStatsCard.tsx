import { BarChart3, CheckCircle, XCircle } from "lucide-react"
import type { AttendanceStats } from "@type/pages/attendanceManual"

interface AttendanceStatsSectionProps {
    stats: AttendanceStats
    attendancePercentage: number
}

export function AttendanceStatsSection({ stats, attendancePercentage }: AttendanceStatsSectionProps) {
    return (
        <>
            {/* Main stats card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Resumen Hoy</h3>
                    <BarChart3 className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                </div>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Asistencia</span>
                        <span
                            className={`text-2xl font-bold ${attendancePercentage >= 80
                                    ? "text-green-600 dark:text-green-400"
                                    : attendancePercentage >= 60
                                        ? "text-orange-600 dark:text-orange-400"
                                        : "text-red-600 dark:text-red-400"
                                }`}
                        >
                            {attendancePercentage}%
                        </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                            className={`h-2 rounded-full ${attendancePercentage >= 80
                                    ? "bg-green-600 dark:bg-green-400"
                                    : attendancePercentage >= 60
                                        ? "bg-orange-600 dark:bg-orange-400"
                                        : "bg-red-600 dark:bg-red-400"
                                }`}
                            style={{ width: `${attendancePercentage}%` }}
                        ></div>
                    </div>
                </div>
            </div>

            {/* Summary cards */}
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
        </>
    )
}

import { TrendingUp } from "lucide-react"
import type { AttendanceHistory as AttendanceHistoryType } from "@type/pages/attendanceManual"

interface AttendanceHistoryProps {
    attendanceHistory: AttendanceHistoryType[]
}

export function AttendanceHistory({ attendanceHistory }: AttendanceHistoryProps) {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Historial de Asistencia</h3>
                <TrendingUp className="w-5 h-5 text-gray-400 dark:text-gray-500" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {attendanceHistory.map((day, index) => (
                    <div
                        key={index}
                        className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600"
                    >
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                            {new Date(day.date).toLocaleDateString("es-ES", {
                                month: "short",
                                day: "numeric",
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
    )
}

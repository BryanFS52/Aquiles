"use client"

import { Calendar, Search, Filter } from "lucide-react"
import type { FilterOption } from "@type/pages/attendanceManual"

interface AttendanceControlsProps {
    selectedDate: string
    searchTerm: string
    selectedFilter: FilterOption
    onDateChange: (date: string) => void
    onSearchChange: (term: string) => void
    onFilterChange: (filter: FilterOption) => void
}

export function AttendanceControls({
    selectedDate,
    searchTerm,
    selectedFilter,
    onDateChange,
    onSearchChange,
    onFilterChange,
}: AttendanceControlsProps) {
    return (
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
                            onChange={(e) => onDateChange(e.target.value)}
                            className="border-0 bg-transparent text-gray-700 dark:text-gray-200 font-medium focus:outline-none text-sm"
                        />
                    </div>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400 dark:text-gray-500" />
                    <input
                        type="text"
                        placeholder="Buscar por nombre o documento..."
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
                <div className="flex items-center space-x-2">
                    <Filter className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                    <select
                        value={selectedFilter}
                        onChange={(e) => onFilterChange(e.target.value as FilterOption)}
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
        </div>
    )
}

"use client"

import { Calendar, Search, Filter, BookOpen } from "lucide-react"
import type { FilterOption, Competence } from "@type/pages/attendanceManual"
import { useSelector } from "react-redux"
import type { RootState } from "@redux/store"

interface AttendanceControlsProps {
  selectedDate: string
  searchTerm: string
  selectedFilter: FilterOption
  selectedCompetence: string | number | null
  competences: Competence[]
  isCompetenceFixed?: boolean
  onDateChange: (date: string) => void
  onSearchChange: (term: string) => void
  onFilterChange: (filter: FilterOption) => void
  onCompetenceChange: (competenceId: string | number | null) => void
}

export function AttendanceControls({
  selectedDate,
  searchTerm,
  selectedFilter,
  selectedCompetence,
  competences,
  onDateChange,
  onSearchChange,
  onFilterChange,
  onCompetenceChange,
  isCompetenceFixed = false,
}: AttendanceControlsProps) {
  const { data: attendanceStates } = useSelector(
    (state: RootState) => state.attendanceState
  ) as {
    data: { id: string; status: FilterOption }[]
    loading: boolean
    error: any
  }

  // Obtener el nombre de la competencia seleccionada para mostrar cuando está fija
  const selectedCompetenceName = competences.find(c => c.id.toString() === selectedCompetence?.toString())?.name || 'Competencia no encontrada'

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Registro de Asistencia
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Selecciona la competencia, fecha y estado de cada estudiante
          </p>
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
          <BookOpen className="w-4 h-4 text-gray-400 dark:text-gray-500" />
          {isCompetenceFixed ? (
            <div className="px-3 py-2.5 border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm min-w-[200px] flex items-center justify-between">
              <span>{selectedCompetenceName}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400"></span>
            </div>
          ) : (
            <select
              value={selectedCompetence || ""}
              onChange={(e) => onCompetenceChange(e.target.value || null)}
              className="px-3 py-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm min-w-[200px]"
            >
              <option value="">Seleccionar Competencia</option>
              {competences?.map((competence) => (
                <option key={competence.id} value={competence.id}>
                  {competence.name}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-gray-400 dark:text-gray-500" />
          <select
            value={selectedFilter}
            onChange={(e) => onFilterChange(e.target.value as FilterOption)}
            className="px-3 py-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          >
            <option value="todos">Todos</option>
            {attendanceStates?.map((state) => (
              <option key={state.id} value={state.id}>
                {state.status}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}

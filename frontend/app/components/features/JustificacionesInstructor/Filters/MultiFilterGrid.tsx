"use client";

import { MultiFilterState } from "@redux/slices/justificationSlice";
import { FilterInput, FilterSelect, ToggleSwitch } from "./FilterComponents";

// Constants
const FILTER_STATUS: Record<string, string> = {
  "Aceptado": "Aceptado",
  "Denegado": "Denegado",
  "En proceso": "En proceso"
} as const;

interface MultiFilterGridProps {
  multiFilters: MultiFilterState;
  onMultiFilterChange: (field: keyof MultiFilterState, value: string) => void;
  onClearMultiFilters: () => void;
  onToggleMultiFilter: () => void;
  hasActiveFilters: boolean;
  handleNumberValidation: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export const MultiFilterGrid = ({
  multiFilters,
  onMultiFilterChange,
  onClearMultiFilters,
  onToggleMultiFilter,
  hasActiveFilters,
  handleNumberValidation
}: MultiFilterGridProps) => {
  return (
    <>
      {/* Multi-Filter Header */}
      <div className="flex items-center justify-between pl-2">
        
        <button
          onClick={onClearMultiFilters}
          className="px-3 py-2.5 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors disabled:opacity-50"
          disabled={!hasActiveFilters}
        >
          Limpiar Filtros
        </button>
        <div className="flex-shrink-0 ">
          <div className="bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600">
            <ToggleSwitch
              isActive={true}
              onClick={onToggleMultiFilter}
              label="Filtro Múltiple"
              size="small"
            />
          </div>
        </div>
      </div>

      {/* Multi-Filter Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Documento Filter */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Documento</label>
          <FilterInput
            type="number"
            placeholder="Buscar por documento"
            value={multiFilters.documento}
            onChange={(e) => onMultiFilterChange("documento", e.target.value)}
            onKeyDown={handleNumberValidation}
            showSearchIcon={false}
          />
        </div>

        {/* Aprendiz Filter */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Aprendiz</label>
          <FilterInput
            type="text"
            placeholder="Buscar por nombre"
            value={multiFilters.aprendiz}
            onChange={(e) => onMultiFilterChange("aprendiz", e.target.value)}
            showSearchIcon={false}
          />
        </div>

        {/* Fecha de Ausencia Filter */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Fecha de Ausencia</label>
          <FilterInput
            type="text"
            placeholder="DD/MM/YYYY"
            value={multiFilters.absenceDate}
            onChange={(e) => onMultiFilterChange("absenceDate", e.target.value)}
            showSearchIcon={false}
          />
        </div>

        {/* Fecha Filter */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Fecha de Justificación</label>
          <FilterInput
            type="text"
            placeholder="DD/MM/YYYY"
            value={multiFilters.fecha}
            onChange={(e) => onMultiFilterChange("fecha", e.target.value)}
            showSearchIcon={false}
          />
        </div>

        {/* Estado del proceso Filter */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Estado del proceso</label>
          <FilterSelect
            value={multiFilters.justificationStatus}
            onChange={(e) => onMultiFilterChange("justificationStatus", e.target.value)}
            options={FILTER_STATUS}
            placeholder="Todos los estados"
            title="Seleccionar estado del proceso"
          />
        </div>
      </div>
    </>
  );
};

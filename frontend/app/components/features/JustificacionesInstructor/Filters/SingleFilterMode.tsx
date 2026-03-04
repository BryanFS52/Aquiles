"use client";

import { FilterInput, FilterSelect, ToggleSwitch } from "./FilterComponents";

// Constants
const FILTER_LABELS: Record<string, string> = {
  todo: "Todo",
  documento: "Documento",
  aprendiz: "Aprendiz",
  fecha: "Fecha de Justificación",
  justificationStatus: "Estado del proceso",
  absenceDate: "Fecha de Ausencia"
} as const;

const FILTER_STATUS: Record<string, string> = {
  "Aceptado": "Aceptado",
  "Denegado": "Denegado",
  "En proceso": "En proceso"
} as const;

const NUMBER_FILTER_TYPES = ["documento"] as const;

interface SingleFilterModeProps {
  selectedFiltro: string;
  searchTerm: string;
  enableMultiFilter: boolean;
  showMultiFilterToggle?: boolean;
  onFilterChange: (type: string, value: string) => void;
  onToggleMultiFilter: () => void;
  handleMainFilterChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  handleNumberValidation: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  handleNumberPaste: (e: React.ClipboardEvent<HTMLInputElement>) => void;
}

export const SingleFilterMode = ({
  selectedFiltro,
  searchTerm,
  enableMultiFilter,
  showMultiFilterToggle = true,
  onFilterChange,
  onToggleMultiFilter,
  handleMainFilterChange,
  handleNumberValidation,
  handleNumberPaste
}: SingleFilterModeProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 items-center">
      {/* Filter Type Selection */}
      <div className="w-full md:w-1/4">
        <FilterSelect
          id="justification-filter-select"
          value={selectedFiltro}
          onChange={handleMainFilterChange}
          options={FILTER_LABELS}
          placeholder="Selecciona un filtro"
        />
      </div>

      {/* Search Input with Toggle */}
      <div className={`flex items-center gap-3 w-full ${showMultiFilterToggle ? 'md:w-3/4' : 'md:w-3/4'}`}>
        {/* Mostrar input siempre, pero con placeholder diferente */}
        <div className="flex-1">
          {selectedFiltro === "justificationStatus" ? (
            <FilterSelect
              id="justification-filter-option"
              value={searchTerm}
              onChange={(e) => onFilterChange("searchTerm", e.target.value)}
              options={FILTER_STATUS}
              placeholder="Selecciona el estado del proceso"
              title="Seleccionar estado de justificación"
            />
          ) : (
            <FilterInput
              type={NUMBER_FILTER_TYPES.includes(selectedFiltro as any) ? "number" : "text"}
              placeholder={
                !selectedFiltro || selectedFiltro === "todo"
                  ? "Buscar en todos los campos..."
                  : `Buscar por ${FILTER_LABELS[selectedFiltro]}`
              }
              value={searchTerm}
              onChange={(e) => onFilterChange("searchTerm", e.target.value)}
              onKeyDown={NUMBER_FILTER_TYPES.includes(selectedFiltro as any) ? handleNumberValidation : undefined}
              onPaste={NUMBER_FILTER_TYPES.includes(selectedFiltro as any) ? handleNumberPaste : undefined}
            />
          )}
        </div>

        {/* Multi-filter Toggle Button - Compact */}
        {showMultiFilterToggle && (
          <div className="flex-shrink-0">
            <div className="bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600">
              <ToggleSwitch
                isActive={enableMultiFilter}
                onClick={onToggleMultiFilter}
                label="Filtro Múltiple"
                size="small"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

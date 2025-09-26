"use client";

import { toast } from "react-toastify";
import { MultiFilterState } from "@redux/slices/justificationSlice";
import { useCallback, useMemo, useState, useEffect } from "react";

// Components
import { ActiveFiltersDisplay } from "./Filters/FilterComponents";
import { MultiFilterGrid } from "./Filters/MultiFilterGrid";
import { SingleFilterMode } from "./Filters/SingleFilterMode";

// Types
type FilterOptions = {
  selectedFiltro: string;
  searchTerm: string;
  multiFilters: MultiFilterState;
  enableMultiFilter: boolean;
};

type Props = {
  filterOptions: FilterOptions;
  loading: boolean;
  showMultiFilterToggle?: boolean;
  onFilterChange: (type: string, value: string) => void;
  onMultiFilterChange: (field: keyof MultiFilterState, value: string) => void;
  onToggleMultiFilter: () => void;
  onClearMultiFilters: () => void;
  onRefresh: () => void;
};

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

export default function JustificationFilters({
  filterOptions,
  loading,
  showMultiFilterToggle = true,
  onFilterChange,
  onMultiFilterChange,
  onToggleMultiFilter,
  onClearMultiFilters,
  onRefresh,
}: Props) {
  // State for hydration safety
  const [isClient, setIsClient] = useState(false);
  
  // Ensure component is hydration-safe
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Memoized values
  const activeMultiFilters = useMemo(() => 
    Object.entries(filterOptions.multiFilters).filter(([_, value]) => value),
    [filterOptions.multiFilters]
  );

  const hasActiveFilters = useMemo(() => 
    filterOptions.enableMultiFilter 
      ? activeMultiFilters.length > 0
      : Boolean(filterOptions.selectedFiltro || filterOptions.searchTerm),
    [filterOptions.enableMultiFilter, activeMultiFilters.length, filterOptions.selectedFiltro, filterOptions.searchTerm]
  );

  // Event handlers
  const handleMainFilterChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    onFilterChange("selectedFiltro", value);
    
    // Clear search term when changing to/from justificationStatus
    if (value === "justificationStatus" || filterOptions.selectedFiltro === "justificationStatus") {
      onFilterChange("searchTerm", "");
    }
  }, [onFilterChange, filterOptions.selectedFiltro]);

  const handleNumberValidation = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    const allowedKeys = ["Backspace", "Tab", "ArrowLeft", "ArrowRight", "Delete"];
    const isNumberKey = /^[0-9]$/.test(e.key);
    
    if (!isNumberKey && !allowedKeys.includes(e.key)) {
      e.preventDefault();
      toast.error("Solo se permiten números");
    }
  }, []);

  const handleNumberPaste = useCallback((e: React.ClipboardEvent<HTMLInputElement>) => {
    const pastedText = e.clipboardData.getData("text");
    if (!/^\d+$/.test(pastedText)) {
      e.preventDefault();
      toast.error("Solo se permiten números");
    }
  }, []);

  const clearSingleFilter = useCallback(() => {
    onFilterChange("selectedFiltro", "");
    onFilterChange("searchTerm", "");
  }, [onFilterChange]);

  return (
    <div className="space-y-4 mb-6">
      {/* Show loading state or minimal UI during hydration */}
      {!isClient ? (
        <div className="animate-pulse">
          <div className="h-12 bg-gray-200 rounded-lg mb-4"></div>
          <div className="h-10 bg-gray-200 rounded-lg"></div>
        </div>
      ) : (
        <>
          {filterOptions.enableMultiFilter && showMultiFilterToggle ? (
            <MultiFilterGrid
              multiFilters={filterOptions.multiFilters}
              onMultiFilterChange={onMultiFilterChange}
              onClearMultiFilters={onClearMultiFilters}
              onToggleMultiFilter={onToggleMultiFilter}
              hasActiveFilters={hasActiveFilters}
              handleNumberValidation={handleNumberValidation}
            />
          ) : (
            <SingleFilterMode
              selectedFiltro={filterOptions.selectedFiltro}
              searchTerm={filterOptions.searchTerm}
              enableMultiFilter={filterOptions.enableMultiFilter}
              showMultiFilterToggle={showMultiFilterToggle}
              onFilterChange={onFilterChange}
              onToggleMultiFilter={onToggleMultiFilter}
              handleMainFilterChange={handleMainFilterChange}
              handleNumberValidation={handleNumberValidation}
              handleNumberPaste={handleNumberPaste}
            />
          )}

          {/* Active Filters Display */}
          <ActiveFiltersDisplay
            enableMultiFilter={filterOptions.enableMultiFilter}
            activeMultiFilters={activeMultiFilters}
            hasActiveFilters={hasActiveFilters}
            selectedFiltro={filterOptions.selectedFiltro}
            searchTerm={filterOptions.searchTerm}
            filterLabels={FILTER_LABELS}
            onMultiFilterChange={onMultiFilterChange}
            onClearSingleFilter={clearSingleFilter}
          />

          {/* Refresh Button */}
          <button
            onClick={onRefresh}
            className="px-6 py-2 bg-[#01b001] dark:bg-shadowBlue text-white rounded-lg hover:bg-green-600 dark:hover:bg-darkBlue transition-colors duration-300 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Cargando..." : "Recargar Justificaciones"}
          </button>
        </>
      )}
    </div>
  );
}
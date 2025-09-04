"use client";

import { GoSearch } from "react-icons/go";
import { MultiFilterState } from "@redux/slices/justificationSlice";

// Toggle Switch Component
export const ToggleSwitch = ({ 
  isActive, 
  onClick, 
  label, 
  size = "normal" 
}: {
  isActive: boolean;
  onClick: () => void;
  label: string;
  size?: "normal" | "small";
}) => {
  const sizeClasses = size === "small" 
    ? "h-4 w-7" 
    : "h-6 w-11";
  const thumbClasses = size === "small"
    ? "h-3 w-3"
    : "h-4 w-4";
  const translateClasses = size === "small"
    ? isActive ? "translate-x-3" : "translate-x-0"
    : isActive ? "translate-x-6" : "translate-x-1";

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={onClick}
        title={`${isActive ? "Desactivar" : "Activar"} ${label}`}
        className={`relative inline-flex ${sizeClasses} items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#01b001] focus:ring-offset-2 ${
          isActive ? 'bg-[#01b001]' : 'bg-gray-200'
        }`}
        aria-label={`${isActive ? "Desactivar" : "Activar"} ${label}`}
      >
        <span
          className={`inline-block ${thumbClasses} transform rounded-full bg-white transition-transform ${translateClasses}`}
        />
      </button>
      <span className={`${size === "small" ? "text-xs" : "text-sm"} text-gray-600`}>
        {label}
      </span>
    </div>
  );
};

// Filter Input Component
export const FilterInput = ({ 
  type, 
  placeholder, 
  value, 
  onChange,
  onKeyDown,
  onPaste,
  className = "",
  showSearchIcon = true
}: {
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onPaste?: (e: React.ClipboardEvent<HTMLInputElement>) => void;
  className?: string;
  showSearchIcon?: boolean;
}) => (
  <div className="relative">
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
      onPaste={onPaste}
      className={`w-full ${showSearchIcon ? 'pl-10' : 'pl-4'} pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#01b001] ${className}`}
    />
    {showSearchIcon && (
      <GoSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
    )}
  </div>
);

// Filter Select Component
export const FilterSelect = ({ 
  value, 
  onChange, 
  options, 
  placeholder,
  id,
  title,
  className = ""
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: Record<string, string>;
  placeholder: string;
  id?: string;
  title?: string;
  className?: string;
}) => (
  <select
    id={id}
    value={value}
    onChange={onChange}
    title={title}
    className={`w-full py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#01b001] ${className}`}
  >
    <option value="" disabled hidden>
      {placeholder}
    </option>
    {Object.entries(options).map(([value, label]) => (
      <option key={value} value={value}>
        {label}
      </option>
    ))}
  </select>
);

// Active Filters Display Component
export const ActiveFiltersDisplay = ({
  enableMultiFilter,
  activeMultiFilters,
  hasActiveFilters,
  selectedFiltro,
  searchTerm,
  filterLabels,
  onMultiFilterChange,
  onClearSingleFilter
}: {
  enableMultiFilter: boolean;
  activeMultiFilters: [string, string][];
  hasActiveFilters: boolean;
  selectedFiltro: string;
  searchTerm: string;
  filterLabels: Record<string, string>;
  onMultiFilterChange: (field: keyof MultiFilterState, value: string) => void;
  onClearSingleFilter: () => void;
}) => {
  if (enableMultiFilter) {
    return (
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-700">Filtros activos:</h4>
        <div className="flex flex-wrap gap-2">
          {activeMultiFilters.length > 0 ? (
            activeMultiFilters.map(([key, value]) => (
              <span
                key={key}
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#01b001] text-white shadow-sm"
              >
                <span className="capitalize">{filterLabels[key] || key}:</span>
                <span className="ml-1 font-normal">{value}</span>
                <button
                  onClick={() => onMultiFilterChange(key as keyof MultiFilterState, "")}
                  className="ml-2 text-white hover:text-gray-200 transition-colors"
                  title={`Eliminar filtro ${filterLabels[key] || key}`}
                  aria-label={`Eliminar filtro ${filterLabels[key] || key}`}
                >
                  ×
                </button>
              </span>
            ))
          ) : (
            <span className="text-sm text-gray-500 italic">
              No hay filtros aplicados
            </span>
          )}
        </div>
      </div>
    );
  }

  if (hasActiveFilters) {
    return (
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-700">Filtro activo:</h4>
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {selectedFiltro ? filterLabels[selectedFiltro] : 'Búsqueda general'}: {searchTerm}
            <button
              onClick={onClearSingleFilter}
              className="ml-2 text-blue-600 hover:text-blue-800 transition-colors"
              title="Limpiar filtro"
              aria-label="Limpiar filtro"
            >
              ×
            </button>
          </span>
        </div>
      </div>
    );
  }

  return null;
};

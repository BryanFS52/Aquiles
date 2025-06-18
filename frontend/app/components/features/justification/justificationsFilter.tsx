"use client";

import { GoSearch } from "react-icons/go";
import { toast } from "react-toastify";

type FilterOptions = {
  selectedFiltro: string;
  searchTerm: string;
};

type Props = {
  filterOptions: FilterOptions;
  loading: boolean;
  onFilterChange: (type: string, value: string) => void;
  onRefresh: () => void;
};

const filterLabels: { [key: string]: string } = {
  todo: "Todo",
  programa: "Programa",
  ficha: "Ficha",
  documento: "Documento",
  aprendiz: "Aprendiz", 
  fecha: "Fecha de Justificación",
};

export default function JustificationFilters({
  filterOptions,
  loading,
  onFilterChange,
  onRefresh,
}: Props) {
  return (
    <div className="space-y-4 mb-6">
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="w-full md:w-1/3">
          <label htmlFor="justification-filter-select" className="sr-only">
            Filtro de justificación
          </label>
          <select
            id="justification-filter-select"
            value={filterOptions.selectedFiltro}
            onChange={(e) => onFilterChange("selectedFiltro", e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#01b001]"
          >
            {Object.entries(filterLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div className="relative w-full md:w-2/3">
          <input
            type={
              ["ficha", "documento"].includes(filterOptions.selectedFiltro)
                ? "number"
                : "text"
            }
            placeholder={
              filterOptions.selectedFiltro === "todo"
                ? "Buscar en todos los campos"
                : filterOptions.selectedFiltro
                ? `Buscar por ${filterLabels[filterOptions.selectedFiltro]}`
                : "Selecciona un filtro"
            }
            value={filterOptions.searchTerm}
            onKeyDown={(e) => {
              const isNumberFiltro = ["ficha", "documento"].includes(filterOptions.selectedFiltro);

              if (!isNumberFiltro) return;

              const allowedKeys = ["Backspace", "Tab", "ArrowLeft", "ArrowRight", "Delete"];
              const isNumberKey = /^[0-9]$/.test(e.key);
              const isAllowed = allowedKeys.includes(e.key);

              if (!isNumberKey && !isAllowed) {
                e.preventDefault();
                toast.error("Solo se permiten números");
              }
            }}
            onPaste={(e) => {
              const pastedText = e.clipboardData.getData("text");
              if (!/^\d+$/.test(pastedText)) {
                e.preventDefault();
                toast.error("Solo se permiten números");
              }
            }}
            onChange={(e) => onFilterChange("searchTerm", e.target.value)}
            className="w-full pl-10 pr-4 text-sm border-gray-300 rounded-lg focus:outline-none focus:ring-2 p-3 border text-gray-700 focus:ring-[#01b001]"
          />
          <GoSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      <button
        onClick={onRefresh}
        className="px-6 py-2 bg-[#01b001] text-white rounded-lg hover:bg-[#00324d] transition-colors duration-300 disabled:opacity-50"
        disabled={loading}
      >
        {loading ? "Cargando..." : "Recargar Justificaciones"}
      </button>
    </div>
  );
}
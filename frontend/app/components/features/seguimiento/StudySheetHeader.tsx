/**
 * StudySheetHeader Component
 * Header del dashboard con título, descripción y filtros
 */

import React from "react";
import { Search, Filter, SlidersHorizontal } from "lucide-react";

interface StudySheetHeaderProps {
    title: string;
    subtitle?: string;
    searchValue?: string;
    onSearchChange?: (value: string) => void;
    totalItems?: number;
}

const StudySheetHeader: React.FC<StudySheetHeaderProps> = ({
    title,
    subtitle = "Gestiona y realiza seguimiento a tus fichas de formación",
    searchValue = "",
    onSearchChange,
    totalItems = 0
}) => {
    return (
        <div className="mb-8 space-y-6">
            {/* Título y descripción */}
            <div className="space-y-2">
                <h1 className="text-3xl md:text-4xl font-bold text-black dark:text-dark-text bg-gradient-to-r from-primary to-lightGreen dark:from-shadowBlue dark:to-lightGreen bg-clip-text text-transparent animate-fade-in-up">
                    {title}
                </h1>
                <p className="text-base text-grayText dark:text-dark-textSecondary font-medium animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                    {subtitle}
                </p>
            </div>

            {/* Barra de búsqueda y filtros */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                {/* Búsqueda */}
                {onSearchChange && (
                    <div className="relative flex-1 w-full sm:max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-grayText dark:text-dark-textSecondary" />
                        <input
                            type="text"
                            value={searchValue}
                            onChange={(e) => onSearchChange(e.target.value)}
                            placeholder="Buscar por número de ficha o programa..."
                            className="w-full pl-12 pr-4 py-3 rounded-xl border border-lightGray dark:border-dark-border bg-white dark:bg-dark-card text-black dark:text-dark-text placeholder:text-grayText dark:placeholder:text-dark-textSecondary focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-lightGreen focus:border-transparent transition-all duration-300 shadow-sm hover:shadow-md"
                        />
                    </div>
                )}

                {/* Stats y filtros */}
                <div className="flex items-center gap-4 w-full sm:w-auto">
                    {/* Contador de fichas */}
                    <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-primary/10 to-lightGreen/10 dark:from-shadowBlue/20 dark:to-darkBlue/20 border border-primary/20 dark:border-shadowBlue/30">
                        <div className="w-2 h-2 bg-primary dark:bg-lightGreen rounded-full animate-pulse" />
                        <span className="text-sm font-semibold text-black dark:text-dark-text">
                            {totalItems} {totalItems === 1 ? 'Ficha' : 'Fichas'}
                        </span>
                    </div>

                    {/* Botón de filtros (futuro) */}
                    <button
                        className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg bg-white dark:bg-dark-card border border-lightGray dark:border-dark-border text-black dark:text-dark-text hover:bg-gray-50 dark:hover:bg-dark-cardHover transition-all duration-300 shadow-sm hover:shadow-md"
                        aria-label="Filtros avanzados"
                    >
                        <SlidersHorizontal className="w-4 h-4" />
                        <span className="text-sm font-medium">Filtros</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StudySheetHeader;

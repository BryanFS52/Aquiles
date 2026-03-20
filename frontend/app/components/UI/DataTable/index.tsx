import React, { useState, useMemo, useEffect } from "react";
import type { DataTableProps } from "./types";
import { Search, Plus, Frown } from "lucide-react";
import Paginator from "../Paginator/Paginator";
import type { PaginationProps } from "../Paginator/types";

function DataTable<T extends object>({
    columns,
    data,
    isDarkMode = false,
    pageSize = 5,
    filterPlaceholder = "Buscar",
    filterFunction,
    className = "",
    onAddClick,
    addButtonText = "Agregar",
    addButtonClassName = "flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700",
    paginator = Paginator,
    externalPage,
    onExternalPageChange,
    externalTotalPages,
    onSearchChange,
    onRowClick,
}: DataTableProps<T> & {
    onAddClick?: () => void;
    addButtonText?: string;
    addButtonClassName?: string;
    paginator?: React.FC<PaginationProps>;
    onSearchChange?: (search: string) => void;
    onRowClick?: (row: T) => void;
}) {
    const [filter, setFilter] = useState("");
    const [page, setPage] = useState(1);
    const debounceRef = React.useRef<NodeJS.Timeout | null>(null);

    // Si hay búsqueda remota, no filtrar localmente
    const filteredData = useMemo(() => {
        if (onSearchChange) return data;
        if (!filter) return data;
        if (filterFunction)
            return data.filter((row) => filterFunction(row, filter));
        return data.filter((row) =>
            Object.values(row).some((value) =>
                String(value).toLowerCase().includes(filter.toLowerCase()),
            ),
        );
    }, [data, filter, filterFunction, onSearchChange]);

    // Calcular número total de páginas según el conjunto de datos (remoto o filtrado)
    const isServerControlled = typeof externalTotalPages === "number";

    const totalPages = isServerControlled
        ? Math.max(1, externalTotalPages as number)
        : Math.ceil((onSearchChange ? data : filteredData).length / pageSize) || 1;

    const currentPage = externalPage ?? page;

    const paginatedData = useMemo(() => {
        // Si el paginado está controlado por el servidor, `data` ya contiene
        // solo los items de la página actual, así que no hacemos slice.
        if (isServerControlled) return data;

        const source = onSearchChange ? data : filteredData;
        return source.slice((currentPage - 1) * pageSize, currentPage * pageSize);
    }, [filteredData, currentPage, pageSize, data, onSearchChange, isServerControlled]);

    // Si se pasa onSearchChange, hacer debounce y llamar al padre
    useEffect(() => {
        if (!onSearchChange) return;
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            onSearchChange(filter);
        }, 400);
        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, [filter, onSearchChange]);

    useEffect(() => {
        // Si la paginación es controlada, no modificamos el estado interno.
        if (externalPage === undefined) setPage(1);
    }, [filter, data, externalPage]);

    // Clases para el contenedor principal
    const containerClasses = isDarkMode
        ? "bg-shadowBlue border-grayText"
        : "bg-gradient-to-br from-white via-gray-50 to-white border-gray-200";

    // Clases para el campo de búsqueda
    const searchClasses = isDarkMode
        ? "border-grayText bg-shadowBlue text-white placeholder-gray-400 focus:border-lightGreen focus:ring-lightGreen/20"
        : "border-gray-300 bg-white/80 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500/20";

    // Clases para el header de la tabla
    const headerClasses = isDarkMode
        ? "bg-gradient-to-r from-shadowBlue to-darkBlue text-white border-grayText"
        : "bg-gradient-to-r from-gray-100 to-gray-50 text-gray-700 border-gray-200";

    // Clases para el fondo de la tabla (AQUÍ ESTÁ EL FIX PRINCIPAL)
    const tableBackgroundClasses = isDarkMode
        ? "bg-shadowBlue"
        : "bg-white";

    // Clases para las filas del tbody
    const tbodyClasses = isDarkMode
        ? "divide-grayText/20 bg-shadowBlue"
        : "divide-gray-200 bg-white";

    // Clases para las filas individuales
    const getRowClasses = (isDark: boolean) => isDark
        ? "border-grayText/30 hover:bg-darkBlue/30"
        : "border-gray-100 hover:bg-blue-50/50";

    const handlePageChange = (newPage: number) => {
        if (newPage < 1 || newPage > totalPages) return;
        if (typeof onExternalPageChange === "function") {
            onExternalPageChange(newPage);
        } else {
            setPage(newPage);
        }
    };

    return (
        <div
            className={`w-full rounded-2xl sm:rounded-3xl border shadow-lg sm:shadow-xl backdrop-blur-sm transition-all duration-500 hover:shadow-2xl ${containerClasses} ${className}`}
        >
            {/* Filtro y botón de acción */}
            <div className="border-opacity-20 p-3 sm:p-6">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4">
                    <div className="relative flex-1">
                        <Search
                            className={`absolute top-1/2 left-2 sm:left-3 z-20 h-4 w-4 sm:h-5 sm:w-5 -translate-y-1/2 transform transition-colors duration-200 ${isDarkMode ? "text-gray-400 hover:text-gray-300" : "text-gray-400 hover:text-gray-500"}`}
                        />
                        <input
                            type="text"
                            className={`w-full rounded-lg sm:rounded-xl border py-2 sm:py-3 pr-3 sm:pr-4 pl-8 sm:pl-11 text-sm sm:text-base backdrop-blur-sm transition-all duration-300 outline-none focus:ring-2 ${searchClasses}`}
                            placeholder={filterPlaceholder}
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                        />
                    </div>
                    {/* Botón para agregar, visible si se pasa prop onAddClick */}
                    {typeof onAddClick === "function" && (
                        <button
                            className="flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-lightGreen to-primary hover:from-primary hover:to-lightGreen dark:from-blue-600 dark:to-blue-700 dark:hover:from-blue-700 dark:hover:to-blue-800 px-3 sm:px-4 py-2 text-sm sm:text-base text-white transition-all duration-200 shadow-md hover:shadow-lg w-full sm:w-auto font-medium"
                            onClick={onAddClick}
                        >
                            <Plus className="h-5 w-5" />
                            <span className="hidden sm:inline">{addButtonText}</span>
                            <span className="sm:hidden">ASIGNAR</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Tabla */}
            <div className="overflow-hidden rounded-b-2xl sm:rounded-b-3xl">
                <div className="overflow-x-auto overflow-y-auto">
                    <table className={`min-w-full border-separate border-spacing-0 ${tableBackgroundClasses}`}>
                        <thead>
                            <tr className={`border-y ${headerClasses}`}>
                                {columns.map((col) => (
                                    <th
                                        key={String(col.key)}
                                        className={`px-2 sm:px-6 py-2 sm:py-4 text-center text-[10px] sm:text-xs font-bold tracking-wider uppercase transition-colors duration-200 ${col.className || ""}`}
                                    >
                                        {col.header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className={`${tbodyClasses} divide-y`}>
                            {paginatedData.length === 0 ? (
                                <tr className={tableBackgroundClasses}>
                                    <td
                                        colSpan={columns.length}
                                        className={`px-3 sm:px-6 py-8 sm:py-12 text-center ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                                    >
                                        <div className="flex flex-col items-center space-y-2 sm:space-y-3">
                                            <Frown
                                                className={`h-8 w-8 sm:h-12 sm:w-12 ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}
                                            />
                                            <span className="text-xs sm:text-sm font-medium">
                                                No se encontraron resultados
                                            </span>
                                            <span className="text-[10px] sm:text-xs opacity-60">
                                                Intenta con otros términos de búsqueda
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                paginatedData.map((row, idx) => (
                                    <tr
                                        key={idx}
                                        className={`transition-colors duration-200 ${getRowClasses(isDarkMode)} ${typeof onRowClick === "function" ? "cursor-pointer" : ""}`}
                                        onClick={
                                            typeof onRowClick === "function"
                                                ? () => onRowClick(row)
                                                : undefined
                                        }
                                    >
                                        {columns.map((col) => (
                                            <td
                                                key={String(col.key)}
                                                className={`px-2 sm:px-6 py-2 sm:py-4 text-xs sm:text-base ${isDarkMode ? "text-white" : "text-gray-700"} ${col.className || ""}`}
                                            >
                                                {col.render
                                                    ? col.render(row)
                                                    : String(row[col.key as keyof T])}
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Paginación */}
            {totalPages > 0 &&
                paginator &&
                React.createElement(paginator, {
                    page: currentPage,
                    totalPages,
                    onPageChange: handlePageChange,
                    isDarkMode,
                })}
        </div>
    );
}

export default DataTable;
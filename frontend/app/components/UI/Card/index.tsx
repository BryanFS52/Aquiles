// Componente base de tarjeta
import React, { useState, useMemo } from "react";
import Paginator from "../Paginator/Paginator";
import { Search, Frown } from "lucide-react";
import { PaginationProps } from "@components/UI/Paginator/types"

export interface CardProps {
    header?: React.ReactNode;
    body?: React.ReactNode;
    footer?: React.ReactNode;
    className?: string;
    isDarkMode?: boolean;
}

export interface CardGridProps<T> {
    items: T[];
    renderCard: (item: T) => React.ReactNode;
    pageSize?: number;
    columns?: number; // número de columnas en la grilla
    filterPlaceholder?: string;
    filterFunction?: (item: T, filter: string) => boolean;
    isDarkMode?: boolean;
    className?: string;
}

export function Card<T>({
    header,
    body,
    footer,
    className = "",
    isDarkMode = false,
}: CardProps) {
    return (
        <div
            className={`relative rounded-2xl border p-6 shadow-lg transition-all duration-300 ${isDarkMode
                ? "border-gray-700/60 bg-gray-800"
                : "border-gray-200/80 bg-gradient-to-br from-white via-gray-50 to-white"
                } ${className}`}
        >
            {header && <div className="mb-4">{header}</div>}
            {body && <div className="mb-2">{body}</div>}
            {footer && (
                <div
                    className={`mt-4 border-t pt-2 ${isDarkMode ? "border-slate-600" : "border-gray-200"
                        }`}
                >
                    {footer}
                </div>
            )}
        </div>
    );
}

export function CardGrid<T>({
    items,
    renderCard,
    pageSize = 6,
    columns = 3,
    filterPlaceholder = "Buscar...",
    filterFunction,
    isDarkMode = false,
    className = "",
    paginator = Paginator,
}: CardGridProps<T> & { paginator?: React.FC<PaginationProps> }) {
    const [filter, setFilter] = useState("");
    const [page, setPage] = useState(1);

    const filteredItems = useMemo(() => {
        if (!filter) return items;
        if (filterFunction)
            return items.filter((item) => filterFunction(item, filter));
        return items.filter((item) =>
            Object.values(item as any).some((val) =>
                String(val).toLowerCase().includes(filter.toLowerCase()),
            ),
        );
    }, [items, filter, filterFunction]);

    const totalPages = Math.ceil(filteredItems.length / pageSize) || 1;
    const paginatedItems = filteredItems.slice(
        (page - 1) * pageSize,
        page * pageSize,
    );

    // Utilidad para mapear columns a clases Tailwind válidas
    const gridColsClasses: Record<number, string> = {
        1: "md:grid-cols-1",
        2: "md:grid-cols-2",
        3: "md:grid-cols-3",
        4: "md:grid-cols-4",
        5: "md:grid-cols-5",
        6: "md:grid-cols-6",
        7: "md:grid-cols-7",
        8: "md:grid-cols-8",
        9: "md:grid-cols-9",
        10: "md:grid-cols-10",
        11: "md:grid-cols-11",
        12: "md:grid-cols-12",
    };
    const getGridColsClass = (cols: number) =>
        gridColsClasses[cols] || gridColsClasses[3];

    return (
        <div className={`w-full ${className}`}>
            {/* Buscador */}
            <div className="flex items-center justify-between mb-4">
                <div className="relative flex-1">
                    <Search
                        className={`absolute top-1/2 left-3 z-20 h-5 w-5 -translate-y-1/2 transform transition-colors duration-200 ${isDarkMode
                            ? "text-slate-400 hover:text-slate-300"
                            : "text-gray-400 hover:text-gray-500"
                            }`}
                    />
                    <input
                        type="text"
                        className={`w-full rounded-xl border py-3 pr-4 pl-11 backdrop-blur-sm transition-all duration-300 outline-none focus:ring-2 ${isDarkMode
                            ? "border-slate-600 bg-slate-800/50 text-slate-100 placeholder-slate-400 focus:border-blue-400 focus:ring-blue-400/20"
                            : "border-gray-300 bg-white/80 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500/20"
                            }`}
                        placeholder={filterPlaceholder}
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    />
                </div>
                <div className="ml-4 text-sm text-gray-500">
                    {filteredItems.length} resultados
                </div>
            </div>
            {/* Grilla de Cards */}
            <div
                className={`grid grid-cols-1 gap-6 pb-4 sm:grid-cols-2 ${getGridColsClass(
                    columns,
                )} min-h-[220px]`}
            >
                {paginatedItems.length === 0 ? (
                    <div
                        className={`col-span-full row-span-full flex min-h-[200px] w-full flex-col items-center justify-center px-6 py-12 text-center ${isDarkMode ? "text-slate-400" : "text-gray-500"
                            }`}
                    >
                        <Frown
                            className={`h-12 w-12 ${isDarkMode ? "text-slate-500" : "text-gray-400"
                                }`}
                        />
                        <span className="text-sm font-medium">
                            No se encontraron resultados
                        </span>
                        <span className="text-xs opacity-60">
                            Intenta con otros términos de búsqueda
                        </span>
                    </div>
                ) : (
                    paginatedItems.map((item, idx) => (
                        <div key={idx}>{renderCard(item)}</div>
                    ))
                )}
            </div>
            {/* Paginación */}
            {totalPages > 1 &&
                paginator &&
                React.createElement(paginator, {
                    page,
                    totalPages,
                    onPageChange: setPage,
                    isDarkMode,
                })}
        </div>
    );
}
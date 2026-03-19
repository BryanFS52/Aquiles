"use client";

import React, { useState, useMemo } from "react";
import InfoCard from "./InfoCard";
import JustificationCoordinatorModal from "../../Modals/JustificationCoordinatorModal";
import PageTitle from "@/components/UI/pageTitle";
import { FaSearch, FaTh, FaList, FaChevronLeft, FaChevronRight } from "react-icons/fa";

// Datos quemados de fichas
const fichasData = [
  {
    id: "1",
    numeroFicha: "2558104",
    totalAprendices: 32,
    justificacionesPendientes: 8,
    justificacionesAprobadas: 45,
    justificacionesRechazadas: 3,
  },
  {
    id: "2",
    numeroFicha: "2558105",
    totalAprendices: 28,
    justificacionesPendientes: 5,
    justificacionesAprobadas: 38,
    justificacionesRechazadas: 2,
  },
  {
    id: "3",
    numeroFicha: "2558106",
    totalAprendices: 25,
    justificacionesPendientes: 12,
    justificacionesAprobadas: 52,
    justificacionesRechazadas: 7,
  },
  {
    id: "4",
    numeroFicha: "2558107",
    totalAprendices: 30,
    justificacionesPendientes: 3,
    justificacionesAprobadas: 41,
    justificacionesRechazadas: 1,
  },
  {
    id: "5",
    numeroFicha: "2558108",
    totalAprendices: 27,
    justificacionesPendientes: 10,
    justificacionesAprobadas: 47,
    justificacionesRechazadas: 4,
  },
  {
    id: "6",
    numeroFicha: "2558109",
    totalAprendices: 29,
    justificacionesPendientes: 7,
    justificacionesAprobadas: 44,
    justificacionesRechazadas: 5,
  },
  {
    id: "7",
    numeroFicha: "2558110",
    totalAprendices: 31,
    justificacionesPendientes: 9,
    justificacionesAprobadas: 49,
    justificacionesRechazadas: 6,
  },
  {
    id: "8",
    numeroFicha: "2558111",
    totalAprendices: 26,
    justificacionesPendientes: 4,
    justificacionesAprobadas: 42,
    justificacionesRechazadas: 2,
  },
  {
    id: "9",
    numeroFicha: "2558112",
    totalAprendices: 24,
    justificacionesPendientes: 6,
    justificacionesAprobadas: 39,
    justificacionesRechazadas: 3,
  },
  {
    id: "10",
    numeroFicha: "2558113",
    totalAprendices: 28,
    justificacionesPendientes: 11,
    justificacionesAprobadas: 46,
    justificacionesRechazadas: 4,
  },
];

const JustificacionesCoordinadorContainer: React.FC = () => {
  const [selectedFicha, setSelectedFicha] = useState<typeof fichasData[0] | null>(null);
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<"all" | "Aprobada" | "Pendiente" | "Rechazada">("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [filterStatus, setFilterStatus] = useState<"all" | "approved"  | "pending" | "rejected">("all");

  // Filtrar fichas basado en búsqueda y filtros
  const filteredFichas = useMemo(() => {
    return fichasData.filter(ficha => {
      const matchSearch = ficha.numeroFicha.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (!matchSearch) return false;
      
      switch (filterStatus) {
        case "approved":
          return ficha.justificacionesAprobadas > 0;
        case "pending":
          return ficha.justificacionesPendientes > 0;
        case "rejected":
          return ficha.justificacionesRechazadas > 0;
        default:
          return true;
      }
    });
  }, [searchTerm, filterStatus]);

  // Paginación
  const totalPages = Math.ceil(filteredFichas.length / itemsPerPage);
  const paginatedFichas = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredFichas.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredFichas, currentPage, itemsPerPage]);

  const handleFichaClick = (ficha: typeof fichasData[0], statusFilter: "all" | "Aprobada" | "Pendiente" | "Rechazada" = "all") => {
    setSelectedFicha(ficha);
    setSelectedStatusFilter(statusFilter);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedFicha(null);
    setSelectedStatusFilter("all");
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1); // Resetear a primera página
  };

  const handleFilterChange = (filter: "all" | "approved" | "pending"| "rejected") => {
    setFilterStatus(filter);
    setCurrentPage(1); // Resetear a primera página
  };

  return (
    <div className="p-6 space-y-6">
      <div className="mb-6">
          <PageTitle>Gestión de justificaciones por ficha</PageTitle>
      </div>

      {/* Estadísticas generales */}
      <div className="mb-6 sm:mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Fichas */}
        <div className="bg-white dark:bg-shadowBlue p-4 sm:p-5 rounded-xl shadow-md border-l-4 border-primary dark:border-primary">
          <p className="text-xs sm:text-sm text-darkGray dark:text-gray-300">Total fichas</p>
          <p className="text-xl sm:text-2xl font-bold text-secondary dark:text-white">{fichasData.length}</p>
        </div>

        {/* Aprobadas */}
        <div className="bg-white dark:bg-shadowBlue p-4 sm:p-5 rounded-xl shadow-md border-l-4 border-lightGreen dark:border-lightGreen">
          <p className="text-xs sm:text-sm text-darkGray dark:text-gray-300">Aprobadas</p>
          <p className="text-xl sm:text-2xl font-bold text-secondary dark:text-white">{fichasData.reduce((acc, f) => acc + f.justificacionesAprobadas, 0)}</p>
        </div>

        {/* Pendientes */}
        <div className="bg-white dark:bg-shadowBlue p-4 sm:p-5 rounded-xl shadow-md border-l-4 border-yellow-500">
          <p className="text-xs sm:text-sm text-darkGray dark:text-gray-300">Pendientes</p>
          <p className="text-xl sm:text-2xl font-bold text-secondary dark:text-white">{fichasData.reduce((acc, f) => acc + f.justificacionesPendientes, 0)}</p>
        </div>

        {/* Rechazadas */}
        <div className="bg-white dark:bg-shadowBlue p-4 sm:p-5 rounded-xl shadow-md border-l-4 border-red-500">
          <p className="text-xs sm:text-sm text-darkGray dark:text-gray-300">Rechazadas</p>
          <p className="text-xl sm:text-2xl font-bold text-secondary dark:text-white">{fichasData.reduce((acc, f) => acc + f.justificacionesRechazadas, 0)}</p>
        </div>
      </div>

      {/* Controles de filtro y vista */}
      <div className="bg-white dark:bg-shadowBlue rounded-xl p-6 shadow-md border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Búsqueda */}
          <div className="relative flex-1 max-w-md">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por número de ficha..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-shadowBlue dark:text-white"
            />
          </div>

          {/* Filtros y vista */}
          <div className="flex items-center gap-4">
            {/* Filtros por estado */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filtrar:</span>
              <select
                value={filterStatus}
                onChange={(e) => handleFilterChange(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-shadowBlue dark:text-white"
              >
                <option value="all">Todas</option>
                <option value="approved">Aprobadas</option>
                <option value="pending">Pendientes</option>
                <option value="rejected">Rechazadas</option>
              </select>
            </div>

            {/* Toggle vista */}
            <div className="flex items-center bg-gray-100 dark:bg-shadowBlue rounded-lg p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === "grid"
                    ? "bg-white dark:bg-darkBlue text-blue-600 dark:text-blue-400 shadow-sm"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                }`}
              >
                <FaTh />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === "list"
                    ? "bg-white dark:bg-darkBlue text-blue-600 dark:text-blue-400 shadow-sm"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                }`}
              >
                <FaList />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Resultados */}
      <div className="bg-white dark:bg-shadowBlue rounded-xl p-6 shadow-md border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            Fichas ({filteredFichas.length})
          </h3>
          {filteredFichas.length > itemsPerPage && (
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Mostrando {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, filteredFichas.length)} de {filteredFichas.length}
            </span>
          )}
        </div>

        {/* Grid/Lista de fichas */}
        {paginatedFichas.length > 0 ? (
          <div className={
            viewMode === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              : "space-y-4"
          }>
            {paginatedFichas.map((ficha) => (
              <InfoCard
                key={ficha.id}
                ficha={ficha}
                onClick={(statusFilter) => handleFichaClick(ficha, statusFilter)}
                viewMode={viewMode}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 dark:bg-shadowBlue rounded-full flex items-center justify-center">
              <FaSearch className="text-2xl text-gray-400" />
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-lg mb-2">No se encontraron fichas</p>
            <p className="text-gray-500 dark:text-gray-500 text-sm">
              Intenta con un numero de ficha valido
            </p>
          </div>
        )}

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center mt-8">
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-shadowBlue"
              >
                <FaChevronLeft className="text-sm" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-4 py-2 rounded-lg border ${
                    currentPage === page
                      ? "bg-blue-600 text-white border-blue-600"
                      : "border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-shadowBlue"
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-shadowBlue"
              >
                <FaChevronRight className="text-sm" />
              </button>
            </div>
          </div>
        )}
      </div>

      {selectedFicha && (
        <JustificationCoordinatorModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          fichaData={selectedFicha}
          statusFilter={selectedStatusFilter}
        />
      )}
    </div>
  );
};

export default JustificacionesCoordinadorContainer;
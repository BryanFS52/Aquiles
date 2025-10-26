'use client';

import React, { useEffect, useState } from 'react';

import { FaComputer, FaPeopleRoof } from 'react-icons/fa6';
import { FaPeopleCarry } from 'react-icons/fa';
import { AiOutlineStock } from 'react-icons/ai';
import { GiTakeMyMoney } from 'react-icons/gi';
import { BsPersonRolodex } from 'react-icons/bs';
import { SlCalculator } from 'react-icons/sl';
import { GrUserSettings } from 'react-icons/gr';
import { LiaLanguageSolid } from 'react-icons/lia';
import { Program, IconMapType, programsData, ITEMS_PER_PAGE } from '@type/pages/programs';
import { PaginationState } from '@type/global/pagination'
import PageTitle from '@components/UI/pageTitle';

const Programas: React.FC = () => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [pagination, setPagination] = useState<PaginationState>({
    currentPage: 1,
    totalPages: 0,
    itemsPerPage: ITEMS_PER_PAGE,
    totalItems: 0
  });

  useEffect(() => {
    // Simula la obtención de datos locales
    setPrograms(programsData);
  }, []);

  const filteredPrograms: Program[] = programs.filter((program: Program) =>
    program.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Actualizar paginación cuando cambian los programas filtrados
  useEffect(() => {
    const totalPages = Math.ceil(filteredPrograms.length / ITEMS_PER_PAGE);
    setPagination(prev => ({
      ...prev,
      totalPages,
      totalItems: filteredPrograms.length,
      currentPage: prev.currentPage > totalPages ? 1 : prev.currentPage
    }));
  }, [filteredPrograms.length]);

  const handlePageChange = (page: number): void => {
    setPagination(prev => ({
      ...prev,
      currentPage: page
    }));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(e.target.value);
    setPagination(prev => ({
      ...prev,
      currentPage: 1
    }));
  };

  const displayedPrograms: Program[] = filteredPrograms.slice(
    (pagination.currentPage - 1) * pagination.itemsPerPage,
    pagination.currentPage * pagination.itemsPerPage
  );

  const iconMap: IconMapType = {
    FaComputer: FaComputer,
    AiOutlineStock: AiOutlineStock,
    GiTakeMyMoney: GiTakeMyMoney,
    BsPersonRolodex: BsPersonRolodex,
    SlCalculator: SlCalculator,
    FaPeopleRoof: FaPeopleRoof,
    GrUserSettings: GrUserSettings,
    LiaLanguageSolid: LiaLanguageSolid,
    FaPeopleCarry: FaPeopleCarry,
  };

  const renderPaginationButton = (page: number, isActive: boolean): JSX.Element => (
    <button
      key={page}
      onClick={() => handlePageChange(page)}
      className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-300 ${isActive
        ? 'bg-[#01b001] dark:bg-blue-600 text-white shadow-md'
        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-[#01b001] dark:hover:bg-blue-600 hover:text-white'
        }`}
    >
      {page}
    </button>
  );

  const renderProgramCard = (program: Program): JSX.Element => {
    const Icon = iconMap[program.icon];

    if (!Icon) {
      return (
        <div key={program.id} className="p-4 border border-red-300 rounded-lg bg-red-50 dark:bg-red-900/20">
          <span className="text-red-600 dark:text-red-400">
            Icono no disponible para {program.name}
          </span>
        </div>
      );
    }

    return (
      <div
        key={program.id}
        className="flex w-full h-auto min-h-[180px] sm:min-h-[200px] rounded-lg overflow-hidden shadow-lg bg-gray-100 dark:bg-gray-700 relative p-3 sm:p-4 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
      >
        <div className="z-10 flex flex-col justify-between flex-1 pr-20 sm:pr-24">
          <div className="space-y-2 flex flex-col h-full">
            <h3 className="text-black dark:text-white font-inter font-semibold text-base sm:text-lg leading-tight">
              {program.name}
            </h3>
            <div className="flex-1 flex">
              <p className="font-inter font-normal text-gray-700 dark:text-gray-300 text-xs sm:text-sm leading-relaxed line-clamp-4 sm:line-clamp-5">
                {program.description}
              </p>
            </div>
          </div>
        </div>

        {/* Icon Container en la pestañita */}
        <div className="absolute top-0 right-0 w-0 h-0 z-20 flex items-start justify-end pt-5 sm:pt-7 pr-1">
          <div className="absolute top-2 right-2">
            <Icon className="text-2xl sm:text-3xl md:text-4xl drop-shadow-lg text-black/75 dark:text-white transition-colors duration-300" />
          </div>
        </div>

        {/* Decorative Triangle */}
        <div className="absolute top-0 right-0 w-0 h-0 border-l-[90px] sm:border-l-[120px] border-l-transparent border-t-[100px] sm:border-t-[130px] border-t-lime-500/85 dark:border-t-blue-900 opacity-90 transition-colors duration-300"></div>
      </div>
    );
  };

  return (
    <div className="space-y-4 sm:space-y-6 px-2 sm:px-4 lg:px-0">
      {/* Title */}
      <PageTitle>Programas</PageTitle>

      {/* Search Field */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center">
        <input
          type="text"
          placeholder="Buscar programa..."
          className="w-full sm:w-80 md:w-96 lg:w-1/2 p-2.5 sm:p-3 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#01b001] dark:focus:ring-blue-500 focus:border-transparent transition-colors duration-300"
          value={searchTerm}
          onChange={handleSearchChange}
          aria-label="Buscar programa"
        />

        {/* Results counter */}
        {searchTerm && (
          <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 sm:pt-3">
            {filteredPrograms.length} programa{filteredPrograms.length !== 1 ? 's' : ''} encontrado{filteredPrograms.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Programs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-4 sm:gap-5 lg:gap-6 py-2 sm:py-4">
        {displayedPrograms.length > 0 ? (
          displayedPrograms.map(renderProgramCard)
        ) : (
          <div className="col-span-full text-center py-8 sm:py-12">
            <p className="text-gray-500 dark:text-gray-400 text-base sm:text-lg px-4">
              No se encontraron programas que coincidan con "{searchTerm}"
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-2 pt-4 sm:pt-6">
          <button
            onClick={() => handlePageChange(Math.max(1, pagination.currentPage - 1))}
            disabled={pagination.currentPage === 1}
            className="w-full sm:w-auto px-4 py-2 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
            aria-label="Página anterior"
          >
            Anterior
          </button>

          <div className="flex flex-wrap gap-1 justify-center">
            {Array.from({ length: pagination.totalPages }, (_, index) =>
              renderPaginationButton(index + 1, pagination.currentPage === index + 1)
            )}
          </div>

          <button
            onClick={() => handlePageChange(Math.min(pagination.totalPages, pagination.currentPage + 1))}
            disabled={pagination.currentPage === pagination.totalPages}
            className="w-full sm:w-auto px-4 py-2 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
            aria-label="Página siguiente"
          >
            Siguiente
          </button>
        </div>
      )}

      {/* Page info */}
      {pagination.totalPages > 1 && (
        <div className="text-center text-xs sm:text-sm text-gray-600 dark:text-gray-400 px-4">
          Página {pagination.currentPage} de {pagination.totalPages} ({pagination.totalItems} programas en total)
        </div>
      )}
    </div>
  );
};

export default Programas;
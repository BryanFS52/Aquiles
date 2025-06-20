"use client";

import { useEffect, useState } from 'react';
import { FaComputer, FaPeopleRoof } from 'react-icons/fa6';
import { FaPeopleCarry } from 'react-icons/fa';
import { AiOutlineStock } from 'react-icons/ai';
import { GiTakeMyMoney } from 'react-icons/gi';
import { BsPersonRolodex } from 'react-icons/bs';
import { SlCalculator } from 'react-icons/sl';
import { GrUserSettings } from 'react-icons/gr';
import { LiaLanguageSolid } from 'react-icons/lia';
import { toast } from "react-toastify";
import PageTitle from '@components/UI/pageTitle';
import programService from '@services/olympo/programService';

const ITEMS_PER_PAGE = 4;

const iconMap = {
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

export default function Programas() {
  const [programs, setPrograms] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPrograms = async () => {
      setLoading(true);
      try {
        const response = await programService.getPrograms({ size: 100 });
        setPrograms(response.data || []);
      } catch (err) {
        toast.error("No se pudieron cargar los programas.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPrograms();
  }, []);

  const filteredPrograms = programs.filter(program =>
    program.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredPrograms.length / ITEMS_PER_PAGE);
  const displayedPrograms = filteredPrograms.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="space-y-6">
      <PageTitle>Programas Coordinación</PageTitle>

        {/* Campo de búsqueda */}
      <div className="flex flex-col sm:flex-row gap-4 items-start">
        <input
          type="text"
          placeholder="Buscar programa..."
          className="w-full sm:w-80 md:w-96 lg:w-1/2 p-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#01b001] dark:focus:ring-blue-500 focus:border-transparent transition-colors duration-300"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* Results counter */}
        {searchTerm && (
          <span className="text-sm text-gray-600 dark:text-gray-400 pt-3">
            {filteredPrograms.length} programa{filteredPrograms.length !== 1 ? 's' : ''} encontrado{filteredPrograms.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>
        {loading && <p className="text-center text-gray-600">Cargando programas...</p>}

        {displayedPrograms.map((program) => {
          const Icon = iconMap[program.icon] || FaComputer;
          
          return (
            <div
              key={program.id}
              className="fflex w-full max-w-md h-52 rounded-lg overflow-hidden shadow-lg bg-gray-100 dark:bg-gray-700 relative p-4 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="z-10 flex flex-col justify-between p-2 flex-1">
                <div className="space-y-2 flex flex-col h-full">
                  <h3 className="text-black dark:text-white font-inter font-semibold text-lg leading-tight">
                    {program.name}
                  </h3>
                  <div className="flex-1 flex">
                    <p className="font-inter font-normal text-gray-700 dark:text-gray-300 text-sm leading-relaxed pr-2 w-full max-w-[calc(100%-60px)] truncate whitespace-pre-line break-words">
                      {program.description}
                    </p>
                  </div>
                </div>
              </div>
              {/* Icon Container en la pestañita */}
              <div className="absolute top-0 right-0 w-0 h-0 z-20 flex items-start justify-end pt-7 pr-1">
                <div className="absolute top-2 right-2">
                  <Icon className="text-3xl md:text-4xl lg:text-5xl drop-shadow-lg text-black/75 dark:text-white transition-colors duration-300" />
                </div>
              </div>
              {/* Decorative Triangle */}
              <div className="absolute top-0 right-0 w-0 h-0 border-l-[120px] border-l-transparent border-t-[130px] border-t-lime-500/85 dark:border-t-blue-900 opacity-90 transition-colors duration-300"></div>
            </div>
          );
        })}

      {/* Paginación */}
      <div className="flex justify-center mt-4">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => handlePageChange(index + 1)}
            className={`mx-1 px-3 py-1 rounded transition-colors duration-300 ${currentPage === index + 1 ? 'bg-[#0e324b] text-white' : 'bg-gray-300 hover:bg-[#40b003] hover:text-white'}`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
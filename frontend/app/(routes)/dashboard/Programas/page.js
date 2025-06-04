"use client";

import { useEffect, useState } from 'react';

// Importa correctamente los íconos
import { FaComputer, FaPeopleRoof } from 'react-icons/fa6';  // Fa6 (FontAwesome icons)
import { FaPeopleCarry } from 'react-icons/fa'; // Fa (FontAwesome icons)
import { AiOutlineStock } from 'react-icons/ai';  // Ai (Ant Design icons)
import { GiTakeMyMoney } from 'react-icons/gi';  // Gi (Game Icons)
import { BsPersonRolodex } from 'react-icons/bs';  // Bs (Bootstrap Icons)
import { SlCalculator } from 'react-icons/sl';  // Sl (Simple Line Icons)
import { GrUserSettings } from 'react-icons/gr';  // Gr (Grommet Icons)
import { LiaLanguageSolid } from 'react-icons/lia';  // Lia (Line Awesome Icons)

const ITEMS_PER_PAGE = 4; // Número de programas por página

const localPrograms = [
  { id: 1, name: "Análisis y Desarrollo de Software", description: "Programa para el desarrollo de soluciones informáticas.", icon: "FaComputer" },
  { id: 2, name: "Gestión Empresarial", description: "Preparación para la gestión eficiente de empresas.", icon: "AiOutlineStock" },
  { id: 3, name: "Gestión Bancaria y Financiera", description: "Formación en operaciones bancarias y financieras.", icon: "GiTakeMyMoney" },
  { id: 4, name: "Marketing Digital", description: "Estrategias modernas para el marketing en línea.", icon: "BsPersonRolodex" },
  { id: 5, name: "Contabilidad Financiera", description: "Fundamentos de contabilidad y gestión financiera.", icon: "SlCalculator" },
  { id: 6, name: "Gestión de Recursos Humanos", description: "Técnicas para la gestión efectiva del talento humano.", icon: "FaPeopleRoof" },
  { id: 7, name: "Administración Pública", description: "Preparación para roles administrativos en el sector público.", icon: "GrUserSettings" },
  { id: 8, name: "Idiomas Extranjeros", description: "Aprendizaje de lenguas extranjeras y cultura.", icon: "LiaLanguageSolid" },
  { id: 9, name: "Logística Empresarial", description: "Gestión de operaciones logísticas y cadena de suministro.", icon: "FaPeopleCarry" },
];

export default function Programas() {
  const [programs, setPrograms] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState(""); // Estado para el término de búsqueda

  useEffect(() => {
    // Simula la obtención de datos locales
    setPrograms(localPrograms);
  }, []);

  const filteredPrograms = programs.filter(program =>
    program.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredPrograms.length / ITEMS_PER_PAGE);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const displayedPrograms = filteredPrograms.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

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

  return (
    <div className="space-y-6">
      {/* Title */}
      <h1 className="text-[#01b001] dark:text-blue-400 text-3xl lg:text-4xl pb-3 border-b-2 border-gray-300 dark:border-gray-600 w-full sm:w-3/4 lg:w-1/2 font-inter font-semibold transition-colors duration-300">
        Programas
      </h1>

      {/* Search Field */}
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

      {/* Programs Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 py-4">
        {displayedPrograms.length > 0 ? (
          displayedPrograms.map((program) => {
            const Icon = iconMap[program.icon];
            if (!Icon) {
              return (
                <div key={program.id} className="p-4 border border-red-300 rounded-lg bg-red-50 dark:bg-red-900/20">
                  <span className="text-red-600 dark:text-red-400">Icono no disponible para {program.name}</span>
                </div>
              );
            }
            return (
              <div
                key={program.id}
                className="flex w-full max-w-md h-52 rounded-lg overflow-hidden shadow-lg bg-gray-100 dark:bg-gray-700 relative p-4 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="z-10 flex flex-col justify-between p-2 flex-1">
                  <div className="space-y-2">
                    <h3 className="text-[#01b001] dark:text-blue-400 font-inter font-semibold text-lg leading-tight">
                      {program.name}
                    </h3>
                    <p className="font-inter font-normal text-gray-700 dark:text-gray-300 text-sm leading-relaxed pr-2">
                      {program.description}
                    </p>
                  </div>
                </div>

                {/* Icon Container */}
                <div className="z-10 flex items-center justify-center w-20 flex-shrink-0">
                  <Icon className="text-4xl text-white drop-shadow-lg" />
                </div>

                {/* Decorative Triangle */}
                <div className="absolute top-0 right-0 w-0 h-0 border-l-[120px] border-l-transparent border-t-[130px] border-t-[#01b001] dark:border-t-blue-500 opacity-80"></div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              No se encontraron programas que coincidan con {searchTerm}
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 pt-6">
          <button
            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
          >
            Anterior
          </button>

          <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => handlePageChange(index + 1)}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-300 ${currentPage === index + 1
                  ? 'bg-[#01b001] dark:bg-blue-600 text-white shadow-md'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-[#01b001] dark:hover:bg-blue-600 hover:text-white'
                  }`}
              >
                {index + 1}
              </button>
            ))}
          </div>

          <button
            onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
          >
            Siguiente
          </button>
        </div>
      )}

      {/* Page info */}
      {totalPages > 1 && (
        <div className="text-center text-sm text-gray-600 dark:text-gray-400">
          Página {currentPage} de {totalPages} ({filteredPrograms.length} programas en total)
        </div>
      )}
    </div>
  );
}
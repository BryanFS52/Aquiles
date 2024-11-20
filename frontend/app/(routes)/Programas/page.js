"use client"; // Esto hace que el componente sea un Client Component

import React, { useEffect, useState } from 'react';
import { Header } from "../../components/header"; // importaciones del header y del sidebar para hacer el llamado
import { Sidebar } from "../../components/Sidebar";
import ProgramsService from '../../services/ProgramsService'; // Importa el servicio

// Importa correctamente los íconos
import { FaComputer, FaPeopleRoof } from 'react-icons/fa6';  // Fa6 (FontAwesome icons)
import { FaPeopleCarry } from 'react-icons/fa'; // Fa (FontAwesome icons)
import { AiOutlineStock } from 'react-icons/ai';  // Ai (Ant Design icons)
import { GiTakeMyMoney } from 'react-icons/gi';  // Gi (Game Icons)
import { BsPersonRolodex } from 'react-icons/bs';  // Bs (Bootstrap Icons)
import { SlCalculator } from 'react-icons/sl';  // Sl (Simple Line Icons)
import { GrUserSettings } from 'react-icons/gr';  // Gr (Grommet Icons)
import { LiaLanguageSolid } from 'react-icons/lia';  // Lia (Line Awesome Icons)

const ITEMS_PER_PAGE = 6; // Número de programas por página

export default function Programas() {
  const [programs, setPrograms] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState(""); // Estado para el término de búsqueda

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const data = await ProgramsService.getAllPrograms();
        setPrograms(data.programs);
      } catch (error) {
        console.error("Error fetching programs:", error);
      }
    };

    fetchPrograms();
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
    <div className="min-h-screen grid grid-cols-1 xl:grid-cols-6">
      <Sidebar />
      <div className="xl:col-span-5">
        <Header />
        <div className="h-auto p-12 inline-block w-full">
          <h1 className="text-[#0e324d] text-2xl sm:text-3xl lg:text-4xl pb-3 border-b-2 border-gray-400 w-full sm:w-3/4 lg:w-1/2 mb-6 lg:mb-12 font-inter font-semibold">
            Programas
          </h1>

          {/* Campo de búsqueda */}
          <input 
            type="text" 
            placeholder="Buscar programa..." 
            className="mb-4 w-full p-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#40b003] focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
  
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 ml-8 py-7">
            {displayedPrograms.map((program) => {
              const Icon = iconMap[program.icon];
              if (!Icon) {
                return <div key={program.id}>Icono no disponible</div>;
              }
              return (
                <div key={program.id} className="flex w-96 h-52 rounded-lg overflow-hidden shadow-lg bg-zinc-200 relative mb-4 p-4">
                  <div className="z-50 justify-end p-4 space-y-4">
                    <div className="space-y-2">
                      <span className="text-[#40b003] font-inter font-semibold text-xl">{program.name}</span>
                      <p className="font-inter font-normal text-black text-sm sm:text-sm pr-5">{program.description}</p>
                    </div>
                  </div>
                  <Icon className="z-50 text-5xl text-white ml-auto w-40" />
                  <div className="absolute top-0 right-0 w-0 h-0 border-t-[130px] border-[#0e324d] border-l-[190px] border-l-transparent -z-1"></div>
                </div>
              );
            })}
          </div>

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
      </div>
    </div>
  );
}

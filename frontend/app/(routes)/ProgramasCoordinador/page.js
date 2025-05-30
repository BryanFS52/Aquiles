"use client";

import React, { useEffect, useState } from 'react';
import { Header } from "@components/header";
import { Sidebarcoordinador } from "@components/SidebarCoordinador";
import programService from '@services/Olympo/programService';
import { FaComputer, FaPeopleRoof } from 'react-icons/fa6';
import { FaPeopleCarry } from 'react-icons/fa';
import { AiOutlineStock } from 'react-icons/ai';
import { GiTakeMyMoney } from 'react-icons/gi';
import { BsPersonRolodex } from 'react-icons/bs';
import { SlCalculator } from 'react-icons/sl';
import { GrUserSettings } from 'react-icons/gr';
import { LiaLanguageSolid } from 'react-icons/lia';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
    <div className="min-h-screen grid grid-cols-1 xl:grid-cols-6 bg-gray-100">
      <Sidebarcoordinador />
      <div className="xl:col-span-5 w-full">
        <Header role="Coordinador" />

        <div className="h-auto p-4 sm:p-6 md:p-8 lg:p-12 inline-block w-full">
          <h1 className="text-[#0e324d] text-2xl sm:text-3xl lg:text-4xl pb-3 border-b-2 border-gray-400 w-full sm:w-3/4 lg:w-1/2 mb-6 lg:mb-12 font-inter font-semibold">
            Programas
          </h1>

          {/* Campo de búsqueda */}
          <input
            type="text"
            placeholder="Buscar programa..."
            className="mb-4 w-full sm:w-1/2 md:w-2/3 lg:w-1/2 p-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#40b003] focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {loading && <p className="text-center text-gray-600">Cargando programas...</p>}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ml-8 py-7">
            {displayedPrograms.map((program) => {
              const Icon = iconMap[program.icon] || FaComputer;
              return (
                <div key={program.id} className="flex w-full sm:w-96 h-52 rounded-lg overflow-hidden shadow-lg bg-zinc-200 relative mb-4 p-4">
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
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}

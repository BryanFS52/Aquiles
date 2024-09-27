"use client";

import React, { useState, useEffect } from 'react';
import { Header } from "../../components/header";
import { getAllApprentices } from "../../services/apprenticeService";
import { useApprentices } from '../../context/ApprenticeContext'; // Importar el contexto
import { Sidebaraprendiz } from '../../components/SidebarAprendiz';
import { FaUsers, FaRegClock, FaGraduationCap, FaRegListAlt } from "react-icons/fa"; // Iconos

const ListaApprentices = () => {
  const { apprentices, setApprentices } = useApprentices();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const apprenticesPerPage = 5;

  useEffect(() => {
    const fetchApprentices = async () => {
      try {
        const apprenticesData = await getAllApprentices();
        setApprentices(apprenticesData);
      } catch (error) {
        console.error('Error al obtener los aprendices:', error);
      }
    };

    fetchApprentices();
  }, [setApprentices]);

  const filteredApprentices = apprentices.filter(apprentice =>
    apprentice.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    apprentice.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    apprentice.documentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    apprentice.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    apprentice.teamNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Paginación
  const indexOfLastApprentice = currentPage * apprenticesPerPage;
  const indexOfFirstApprentice = indexOfLastApprentice - apprenticesPerPage;
  const currentApprentices = filteredApprentices.slice(indexOfFirstApprentice, indexOfLastApprentice);

  const totalPages = Math.ceil(filteredApprentices.length / apprenticesPerPage);

  return (
    <div className="min-h-screen grid grid-cols-1 xl:grid-cols-6">        
      <Sidebaraprendiz />
      <div className="xl:col-span-5">
        <Header />

        <div className="h-[90vh] p-4 md:p-8 lg:p-4 w-full bg-neutral-100 space-y-4">
        <h1 className="text-[#0e324d] text-2xl sm:text-3xl lg:text-4xl pb-3 border-b-2 border-gray-400 w-full sm:w-3/4 lg:w-1/2 mb-4 font-inter font-semibold">
        Ficha y Aprendices
        </h1>

        <div className="flex flex-col items-center justify-center space-y-4 w-full md:flex-row md:flex-wrap md:justify-center md:space-y-0 md:space-x-8">
          <div className="flex flex-col items-center justify-center w-full"></div>
      {/* Ficha */}
        <div className="flex h-auto md:h-24 w-full md:w-52 rounded-lg shadow-lg border-2 bg-white border-green-500 p-2">
        <div className="flex items-center justify-center md:justify-start w-full">
        <div className="bg-[#0e324d] rounded-2xl p-3">
        <FaRegListAlt className="text-4xl text-white stroke-current stroke-[1px]" />
        </div>
              <div className="flex flex-col justify-center ml-6">
            <h1 className="text-custom-blue font-semibold text-xl font-inter">Ficha</h1>
            <p className="text-black font-inter font-medium text-lg">2683794</p>
          </div>
            </div>
            
          </div>
        {/* Aprendices */}
          <div className="flex h-auto md:h-24 w-full md:w-52 rounded-lg shadow-lg border-2 bg-white border-green-500 p-2">
            <div className="flex items-center justify-center md:justify-start w-full">
            <div className="bg-[#0e324d] rounded-2xl p-3">
              <FaUsers className="text-4xl text-white stroke-current stroke-[1px]" />
              </div>
              <div className="flex flex-col justify-center ml-6">
            <h1 className="text-custom-blue font-semibold text-2xl font-inter">32</h1>
            <p className="text-black font-inter font-medium text-lg">Aprendices</p>
          </div>
            </div>
          </div>
        {/* Jornada */}
           <div className="flex h-auto md:h-24 w-full md:w-52 rounded-lg shadow-lg border-2 bg-white border-green-500 p-2">
            <div className="flex items-center justify-center md:justify-start w-full">
            <div className="bg-[#0e324d] rounded-2xl p-3">
              <FaRegClock className="text-4xl text-white stroke-current stroke-[1px]" />
              </div>
              <div className="flex flex-col justify-center ml-6">
            <h1 className="text-custom-blue font-semibold text-xl font-inter">Jornada</h1>
            <p className="text-black font-inter font-medium text-lg">Diurna</p>
          </div>
            </div>
          </div>
        {/* Programa */}
          <div className="flex h-auto md:h-24 w-full md:w-80 rounded-lg shadow-lg border-2 bg-white border-green-500 p-2">
            <div className="flex items-center justify-center md:justify-start w-full">
            <div className="bg-[#0e324d] rounded-2xl p-3">
              <FaGraduationCap className="text-4xl text-white stroke-current stroke-[1px]" />
              </div>
              <div className="flex flex-col justify-center ml-6">
            <h1 className="text-custom-blue font-semibold text-xl font-inter">Programa</h1>
            <p className="text-black font-inter font-medium text-lg">Análisis y Desarrollo de Software</p>
          </div>
            </div>
          </div>
      </div>
      {/* Buscador */}
        <div className="flex justify-center w-full mb-6">
          <input
            type="text"
            placeholder="Buscar por nombre, apellido o número de identificación..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-2 py-2 border border-gray-300 rounded-lg w-full max-w-xl"
          />
        </div>
      {/* Tabla */}
        <div className="flex justify-center">
          <div className="w-full max-w-7xl">
            <div className="bg-white shadow-md rounded-lg p-6 border-2 border-gray-200 overflow-x-auto max-h-[36rem]">
              <table className="min-w-full divide-y divide-gray-200 border border-gray-200 table-auto">
                <thead className="bg-sky-950">
                  <tr>
                    <th className="px-4 py-3 w-28 border-2 border-gray-300 bg-sky-950 text-sm font-semibold text-white">
                      Foto
                    </th>
                    <th className="px-4 w-48 border-2 border-gray-300 bg-sky-950 text-sm font-semibold text-white">
                      Nombre
                    </th>
                    <th className="px-4 w-48 border-2 border-gray-300 bg-sky-950 text-sm font-semibold text-white">
                      Apellido
                    </th>
                    <th className="px-4 w-48 border-2 border-gray-300 bg-sky-950 text-sm font-semibold text-white">
                      Correo Institucional
                    </th>
                    <th className="px-4 w-48 border-2 border-gray-300 bg-sky-950 text-sm font-semibold text-white">
                      Número del Team
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-300">
                  {currentApprentices.map((apprentice) => (
                    <tr key={apprentice.documentNumber}>
                      <td className="px-4 py-3 border-2 border-gray-300 text-sm text-center">
                        {apprentice.profilePicture ? (
                          <img src={apprentice.profilePicture} alt="Profile" className="w-16 h-16 object-cover" />
                        ) : 'N/A'}
                      </td>
                      <td className="px-2 border-2 border-gray-300 text-sm text-center">
                        {apprentice.name}
                      </td>
                      <td className="px-2 border-2 border-gray-300 text-sm text-center">
                        {apprentice.lastName}
                      </td>
                      <td className="px-2 border-2 border-gray-300 text-sm text-center">
                        {apprentice.email || 'N/A'}
                      </td>
                      <td className="px-2 border-2 border-gray-300 text-sm text-center">
                        {apprentice.teamNumber}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
            {/* Paginación */}
              <div className="flex justify-between items-center mt-4">
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 bg-gray-200 rounded-md"
                >
                  Anterior
                </button>
                <span className="text-gray-600">Página {currentPage} de {totalPages}</span>
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 bg-gray-200 rounded-md"
                >
                  Siguiente
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
    
  );
};

export default ListaApprentices;

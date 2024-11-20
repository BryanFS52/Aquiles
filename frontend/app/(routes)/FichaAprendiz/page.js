"use client";

import React, { useState, useEffect } from 'react';
import { HeaderAprendiz } from "../../components/HeaderAprendiz";
import { Sidebaraprendiz } from '../../components/SidebarAprendiz';
import { FaUsers, FaRegClock, FaGraduationCap, FaRegListAlt } from "react-icons/fa"; // Iconos

const ApprenticeView = () => {
  // Datos simulados
  const [apprenticeData, setApprenticeData] = useState({
    ficha: "123456",
    jornada: "Mañana",
    programa: "Analisís y Desarrollo de Software",
    compañeros: [
      { name: "Juan", lastName: "Pérez", documentNumber: "001", email: "juan.perez@example.com", profilePicture: null },
      { name: "Ana", lastName: "García", documentNumber: "002", email: "ana.garcia@example.com", profilePicture: null },
      { name: "Luis", lastName: "Rodríguez", documentNumber: "003", email: "luis.rodriguez@example.com", profilePicture: null }
    ]
  });

  const { ficha, jornada, programa, compañeros } = apprenticeData;

  return (
    <div className="min-h-screen grid grid-cols-1 xl:grid-cols-6">        
      <Sidebaraprendiz />
      <div className="xl:col-span-5">
        <HeaderAprendiz />

        <div className="container mx-auto p-6 space-y-8">
          <h1 className="text-4xl font-bold text-[#00324d] hover:text-[#01b001] transition-colors duration-300">
          Ficha y Aprendices
          </h1>

        <div className="flex flex-col items-center justify-center space-y-4 w-full md:flex-row md:flex-wrap md:justify-center md:space-y-0 md:space-x-8">
          
        {/* Ficha */}
          <div className="flex h-auto md:h-24 w-full md:w-52 rounded-lg shadow-lg border-2 bg-white border-green-500 p-2">
            <div className="flex items-center justify-center md:justify-start w-full">
              <div className="bg-[#0e324d] rounded-2xl p-3">
                <FaRegListAlt className="text-4xl text-white stroke-current stroke-[1px]" />
              </div>
              <div className="flex flex-col justify-center ml-6">
                <h1 className="text-custom-blue font-semibold text-xl font-inter">Ficha</h1>
                <p className="text-black font-inter font-medium text-lg">{ficha}</p>
              </div>
            </div>
          </div>

        {/* Compañeros */}
          <div className="flex h-auto md:h-24 w-full md:w-52 rounded-lg shadow-lg border-2 bg-white border-green-500 p-2">
            <div className="flex items-center justify-center md:justify-start w-full">
              <div className="bg-[#0e324d] rounded-2xl p-3">
                <FaUsers className="text-4xl text-white stroke-current stroke-[1px]" />
              </div>
              <div className="flex flex-col justify-center ml-6">
                <h1 className="text-custom-blue font-semibold text-2xl font-inter">{compañeros.length}</h1>
                <p className="text-black font-inter font-medium text-lg">Compañeros</p>
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
                <p className="text-black font-inter font-medium text-lg">{jornada}</p>
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
                <p className="text-black font-inter font-medium text-lg">{programa}</p>
              </div>
            </div>
          </div>

        </div>

      {/* Listado de compañeros */}
        <div className="mt-6 w-full">
          <h2 className="text-xl font-semibold mb-4">Compañeros de la ficha:</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {compañeros.map(compañero => (
              <div key={compañero.documentNumber} className="flex flex-col items-center bg-white p-4 shadow-md rounded-lg">
                <img src={compañero.profilePicture || 'default-avatar.png'} alt="Profile" className="w-16 h-16 rounded-full object-cover mb-2" />
                <p className="text-lg font-semibold">{compañero.name} {compañero.lastName}</p>
                <p className="text-sm text-gray-500">{compañero.email}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
      </div>
    </div>
  );
};

export default ApprenticeView;

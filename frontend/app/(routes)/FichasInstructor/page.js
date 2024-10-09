"use client";

import React, { useState, useEffect } from 'react';
import { Header } from "../../components/header";
import { Sidebar } from '../../components/Sidebar';
import { FaUsers } from "react-icons/fa"; // Icono para los aprendices
import { getInstructorFichas } from '../../services/FichasInstructorService'; // Servicio para obtener las fichas del instructor
import { IoPeople } from "react-icons/io5";

const FichasInstructor = () => {
  const [fichas, setFichas] = useState([]); // Estado para las fichas
  const [searchTerm, setSearchTerm] = useState(""); // Estado para el término de búsqueda

  useEffect(() => {
    // Llamada al servicio para obtener las fichas del instructor
    const fetchFichas = async () => {
      try {
        const response = await getInstructorFichas(); // Llama a tu endpoint que trae las fichas del instructor
        setFichas(response.data); // Actualiza el estado con las fichas recibidas
      } catch (error) {
        console.error("Error fetching fichas:", error);
      }
    };

    fetchFichas();
  }, []);

  // Filtrar las fichas según el término de búsqueda
  const filteredFichas = fichas.filter(ficha =>
    ficha.numeroFicha.toString().includes(searchTerm) ||
    ficha.programa.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ficha.jornada.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen grid grid-cols-1 xl:grid-cols-6">
      <Sidebar />
      <div className="xl:col-span-5">
        <Header />

        <div className="h-[90vh] p-4 md:p-8 lg:p-4 w-full bg-neutral-100 space-y-4">
          <h1 className="text-[#0e324d] text-2xl sm:text-3xl lg:text-4xl pb-3 border-b-2 border-gray-400 w-full sm:w-3/4 lg:w-1/2 mb-4 font-inter font-semibold">
            Fichas del Instructor
          </h1>

          {/* Input para buscar fichas */}
          <input
            type="text"
            placeholder="Buscar por número de ficha, programa o jornada..."
            className="p-2 w-full sm:w-1/2 border border-gray-300 rounded-md mb-4"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} // Manejo del cambio en el input
          />

          {/* Grid para mostrar las fichas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredFichas.map((ficha) => (
              <div
                key={ficha.id}
                className="flex items-center border border-gray-300 shadow-md rounded-lg p-4 bg-white"
              >
                <div>
                  <div className="flex-shrink-0 bg-[#0e324d] rounded-2xl h-20 w-20 flex items-center justify-center mx-auto border-[#01b001] border-4">
                    <IoPeople className="text-5xl text-white" />
                  </div>
                  <div className='text-center'>
                    <p className="text-[#0e324d] text-lg font-extrabold mt-2 mx-auto">Aprendices</p>
                    <p className="text-3xl font-bold mt-2 mx-auto">{ficha.numeroAprendices}</p>
                  </div>
                </div>

                <div className="flex flex-col space-y-2 text-center md:text-left mx-auto md:mx-8">
                  <div>
                    <p className="text-[#0e324d] text-lg font-bold md:text-base lg:text-base">Número de la Ficha</p>
                    <p className="text-xl md:text-lg lg:text-sm">{ficha.numeroFicha}</p>
                  </div>

                  <div>
                    <p className="text-[#0e324d] text-sm font-bold md:text-base lg:text-base">Jornada</p>
                    <p className="text-md md:text-lg lg:text-sm">{ficha.jornada}</p>
                  </div>

                  <div>
                    <p className="text-[#0e324d] text-sm font-bold md:text-base lg:text-base">Programa</p>
                    <p className="text-md md:text-lg lg:text-sm">{ficha.programa}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FichasInstructor;

"use client";

import React, { useState, useEffect } from 'react';
import { Header } from "../../components/header";
import { Sidebar } from '../../components/Sidebar';
import { IoPeople } from "react-icons/io5";
import { getFichaFromOlimpo } from '../../services/FichasService'; // Nuevo servicio

const FichasInstructor = () => {
  const [ficha, setFicha] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchFicha = async () => {
      try {
        const data = await getFichaFromOlimpo(); // Obtén la ficha simulada desde Mockoon
        setFicha(data);
      } catch (error) {
        console.error("Error fetching ficha:", error);
      }
    };

    fetchFicha();
  }, []);

  // Si la ficha no ha cargado aún, mostramos un mensaje de carga
  if (!ficha) {
    return <p>Cargando ficha...</p>;
  }

  return (
    <div className="min-h-screen grid grid-cols-1 xl:grid-cols-6">
      <Sidebar />
      <div className="xl:col-span-5">
        <Header />

        <div className="h-[90vh] p-4 md:p-8 lg:p-4 w-full bg-neutral-100 space-y-4">
          <h1 className="text-[#0e324d] text-2xl sm:text-3xl lg:text-4xl pb-3 border-b-2 border-gray-400 w-full sm:w-3/4 lg:w-1/2 mb-4 font-inter font-semibold">
            Ficha desde Olimpo
          </h1>

          <div className="flex items-center border border-gray-300 shadow-md rounded-lg p-4 bg-white">
            <div>
              <div className="flex-shrink-0 bg-[#0e324d] rounded-2xl h-20 w-20 flex items-center justify-center mx-auto border-[#01b001] border-4">
                <IoPeople className="text-5xl text-white" />
              </div>
              <div className='text-center'>
                <p className="text-[#0e324d] text-lg font-extrabold mt-2 mx-auto">Aprendices</p>
                <p className="text-3xl font-bold mt-2 mx-auto">{ficha.numberStudents}</p>
              </div>
            </div>

            <div className="flex flex-col space-y-2 text-center md:text-left mx-auto md:mx-8">
              <div>
                <p className="text-[#0e324d] text-lg font-bold md:text-base lg:text-base">Número de la Ficha</p>
                <p className="text-lg text-gray-700">{ficha.number}</p>
              </div>
              <div>
                <p className="text-[#0e324d] text-lg font-bold md:text-base lg:text-base">Jornada</p>
                <p className="text-lg text-gray-700">{ficha.quarter.name}</p>
              </div>
              <div>
                <p className="text-[#0e324d] text-lg font-bold md:text-base lg:text-base">Programa</p>
                <p className="text-lg text-gray-700">{ficha.program.name}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FichasInstructor;

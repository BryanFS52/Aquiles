"use client";

import React, { useState, useEffect } from 'react';
import { Header } from "../../components/header";
import { Sidebar } from '../../components/Sidebar';
import { IoPeople } from "react-icons/io5";
import { getFichaFromOlimpo } from '../../services/FichasService'; // Nuevo servicio
import ApprenticeModal from '../../components/Modals/ApprenticeModal'; // Importa el modal

const FichasInstructor = () => {
  const [ficha, setFicha] = useState(null);
  const [selectedApprentice, setSelectedApprentice] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);

  const fetchFicha = async () => {
    try {
      const data = await getFichaFromOlimpo(); // Obtén la ficha simulada desde Mockoon
      setFicha({
        ...data,
        numberStudents: data.students.length // Actualiza el número de estudiantes con la longitud del array
      });
    } catch (error) {
      console.error("Error fetching ficha:", error);
    }
  };

  useEffect(() => {
    fetchFicha(); // Llama la función al iniciar

    const intervalId = setInterval(() => {
      fetchFicha(); // Actualiza la ficha cada 10 segundos (10000 ms)
    }, 10000);

    return () => clearInterval(intervalId); // Limpia el intervalo al desmontar el componente
  }, []);

  const openModal = (apprentice) => {
    setSelectedApprentice(apprentice);
    setModalOpen(true);
  };

  const closeModal = () => {
    setSelectedApprentice(null);
    setModalOpen(false);
  };

  // Si la ficha no ha cargado aún, mostramos un mensaje de carga
  if (!ficha) {
    return <p>Cargando ficha...</p>;
  }

  return (
    <div className="min-h-screen grid grid-cols-1 xl:grid-cols-6">
      <Sidebar />
      <div className="xl:col-span-5">
        <Header />

        <div className="container mx-auto p-6 space-y-8">
          <h1 className="text-4xl font-bold text-[#00324d] hover:text-[#01b001] transition-colors duration-300">
            Fichas del Instructor
          </h1>

          <div className="flex items-center border border-gray-300 shadow-md rounded-lg p-4 bg-white">
            <div>
              <div 
                className="flex-shrink-0 bg-[#0e324d] rounded-2xl h-20 w-20 flex items-center justify-center mx-auto border-[#01b001] border-4 cursor-pointer"
                onClick={() => openModal(null)} // Abre el modal al hacer clic en el ícono
              >
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

          {/* Modal para mostrar información del aprendiz */}
          <ApprenticeModal
            isOpen={isModalOpen}
            onClose={closeModal}
            apprentice={selectedApprentice}
            students={ficha.students} // Asegúrate de que esto esté definido
          />

        </div>
      </div>
    </div>
  );
};

export default FichasInstructor;
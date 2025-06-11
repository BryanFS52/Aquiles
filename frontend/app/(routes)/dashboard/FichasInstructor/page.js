'use client';

import { useState, useEffect } from 'react';
import { IoPeople } from "react-icons/io5";
import { toast } from 'react-toastify';
import ApprenticeModal from '@components/Modals/apprenticeModal';
import PageTitle from '@components/UI/pageTitle';

// Datos locales simulados
const fichaMock = {
  number: "123456",
  quarter: { name: "Mañana" },
  program: { name: "Análisis y Desarrollo de Software" },
  students: [
    { id: 1, name: "Juan Pérez", attendance: "Presente" },
    { id: 2, name: "María López", attendance: "Ausente" },
    { id: 3, name: "Carlos Sánchez", attendance: "Presente" }
  ]
};
const FichasInstructor = () => {
  const [ficha, setFicha] = useState(null);
  const [selectedApprentice, setSelectedApprentice] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchFicha = () => {
      try {
        const data = {
          ...fichaMock,
          numberStudents: fichaMock.students.length,
        };
        setFicha(data);
      } catch (error) {
        toast.error("Error fetching ficha:", error);
      }
    };

    fetchFicha();
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
      <div className="xl:col-span-5">
        <div className="container mx-auto p-6 space-y-8">
          <PageTitle>Fichas del instructor</PageTitle>

          <div className="flex items-center shadow-xl dark:shadow-[0_4px_32px_0_rgba(22,23,39,0.7)] rounded-2xl p-6 bg-white dark:bg-gradient-to-br dark:from-shadowBlue dark:to-darkBlue ring-2 ring-white/10 dark:ring-shadowBlue/40 transition-all duration-300">
            <div>
              <div
                className="flex-shrink-0 bg-gradient-to-r from-lime-300 to-lime-400 dark:bg-darkBlue rounded-2xl h-20 w-20 flex items-center justify-center mx-auto border-black dark:border-white border-4 cursor-pointer transition-colors duration-300 shadow-lg dark:shadow-md"
                onClick={() => openModal(null)} // Abre el modal al hacer clic en el ícono
              >
                <IoPeople className="text-5xl text-white" />
              </div>
              <div className='text-center'>
                <p className="text-black dark:text-white text-lg font-extrabold mt-2 mx-auto">Aprendices</p>
                <p className="text-3xl font-bold mt-2 mx-auto text-black dark:text-white">{ficha.numberStudents}</p>
              </div>
            </div>

            <div className="flex flex-col space-y-2 text-center md:text-left mx-auto md:mx-8">
              <div>
                <p className="text-black dark:text-white text-lg font-bold md:text-base lg:text-base">Número de la Ficha</p>
                <p className="text-lg text-gray-700 dark:text-white">{ficha.number}</p>
              </div>
              <div>
                <p className="text-black dark:text-white text-lg font-bold md:text-base lg:text-base">Jornada</p>
                <p className="text-lg text-gray-700 dark:text-white">{ficha.quarter.name}</p>
              </div>
              <div>
                <p className="text-black dark:text-white text-lg font-bold md:text-base lg:text-base">Programa</p>
                <p className="text-lg text-gray-700 dark:text-white">{ficha.program.name}</p>
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
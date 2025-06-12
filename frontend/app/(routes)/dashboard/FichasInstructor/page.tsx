'use client';

import { useState, useEffect } from 'react';
import { IoPeople } from "react-icons/io5";
import { toast } from 'react-toastify';
import { Student, FichaData, fichaMock } from '@/types/instructorSheets';
import ApprenticeModal from '@components/Modals/apprenticeModal';
import PageTitle from '@components/UI/pageTitle';

const FichasInstructor: React.FC = () => {
  const [ficha, setFicha] = useState<FichaData | null>(null);
  const [selectedApprentice, setSelectedApprentice] = useState<Student | null>(null);
  const [isModalOpen, setModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetchFicha = (): void => {
      try {
        const data: FichaData = {
          ...fichaMock,
          numberStudents: fichaMock.students.length,
        };
        setFicha(data);
      } catch (error) {
        toast.error(`Error fetching ficha: ${error}`);
      }
    };

    fetchFicha();
  }, []);

  const openModal = (apprentice: Student | null): void => {
    setSelectedApprentice(apprentice);
    setModalOpen(true);
  };

  const closeModal = (): void => {
    setSelectedApprentice(null);
    setModalOpen(false);
  };

  // Si la ficha no ha cargado aún, mostramos un mensaje de carga
  if (!ficha) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-gray-600 dark:text-gray-300">Cargando ficha...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen grid grid-cols-1 xl:grid-cols-6">
      <div className="xl:col-span-5">
        <div className="container mx-auto p-6 space-y-8">
          <PageTitle>Fichas del instructor</PageTitle>

          <div className="flex items-center shadow-xl dark:shadow-[0_4px_32px_0_rgba(22,23,39,0.7)] rounded-2xl p-6 bg-white dark:bg-gradient-to-br dark:from-shadowBlue dark:to-darkBlue ring-2 ring-white/10 dark:ring-shadowBlue/40 transition-all duration-300">
            <div>
              <div
                className="flex-shrink-0 bg-gradient-to-r from-lime-300 to-lime-400 dark:bg-darkBlue rounded-2xl h-20 w-20 flex items-center justify-center mx-auto border-black/50 dark:border-white border-4 cursor-pointer transition-colors duration-300 shadow-lg dark:shadow-md hover:scale-105 transform"
                onClick={() => openModal(null)} // Abre el modal al hacer clic en el ícono
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    openModal(null);
                  }
                }}
                aria-label="Ver lista de aprendices"
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
            students={ficha.students}
          />
        </div>
      </div>
    </div>
  );
};

export default FichasInstructor;
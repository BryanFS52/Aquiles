'use client';

import React, { useEffect, useState } from 'react';
import { IoPeople } from "react-icons/io5";
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { fetchStudySheetByTeacher, fetchStudySheetById } from '@slice/olympo/studySheetSlice';
import ApprenticeModal from '@components/Modals/apprenticeModal';
import PageTitle from '@components/UI/pageTitle';
import { useRouter } from 'next/navigation';
import { useLoader } from '@/context/LoaderContext';

const FichasInstructor: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [selectedFicha, setSelectedFicha] = useState<any | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const router = useRouter();
  const { showLoader, hideLoader } = useLoader();

  const { data: fichasData, loading } = useSelector((state: any) => state.studySheet);
  const fichas = fichasData?.allStudySheets?.data || fichasData?.data || fichasData || [];

  useEffect(() => {
    dispatch(fetchStudySheetByTeacher({ IdTeacher: 1, page: 0, size: 5 }));
  }, [dispatch]);

  useEffect(() => {
    if (loading || isTransitioning) {
      showLoader();
    } else {
      hideLoader();
    }
  }, [loading, isTransitioning, showLoader, hideLoader]);

  const openModal = (ficha: any) => {
    setSelectedFicha(ficha);
    setModalOpen(true);
  };

  const closeModal = () => {
    setSelectedFicha(null);
    setModalOpen(false);
  };

  const handleAttendance = async (studySheet: any) => {
    setIsTransitioning(true);
    await dispatch(fetchStudySheetById({ id: studySheet.id }));
    router.push('/dashboard/asistencia');
  };

  if (!loading && (!fichas || fichas.length === 0)) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center">
        <div>
          <p className="text-lg text-gray-600 dark:text-gray-300">No se encontraron fichas...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen grid grid-cols-1 xl:grid-cols-6">
        <div className="xl:col-span-5">
          <div className="container mx-auto p-6">
            <PageTitle>Fichas del instructor</PageTitle>

            {fichas.map((studySheet: any, i: number) => (
              <div
                key={studySheet.id}
                className={`mt-6 ${i === 0 ? 'mt-0' : ''}`}
              >
                <div className="flex flex-col md:flex-row items-center gap-6 shadow-xl rounded-2xl p-6 bg-white dark:bg-gradient-to-br dark:from-shadowBlue dark:to-darkBlue ring-2 ring-white/10 dark:ring-shadowBlue/40 transition-all">
                  <div className="flex flex-col items-center">
                    <div
                      className="bg-gradient-to-r from-primary to-lime-500 rounded-2xl h-20 w-20 flex items-center justify-center border-4 border-black/50 dark:border-white shadow-lg hover:scale-105 cursor-pointer transition"
                      onClick={() => openModal(studySheet)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => (['Enter', ' '].includes(e.key) ? openModal(studySheet) : null)}
                      aria-label="Ver aprendices"
                    >
                      <IoPeople className="text-white text-4xl" />
                    </div>
                    <p className="text-black dark:text-white text-lg font-bold mt-2">Aprendices</p>
                    <p className="text-2xl font-semibold text-black dark:text-white">
                      {studySheet.students?.length || 0}
                    </p>
                  </div>

                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 text-center md:text-left">
                    <FichaInfo label="Número de Ficha" value={studySheet.number} />
                    <FichaInfo label="Jornada" value={studySheet.journey?.name} />
                    <FichaInfo label="Programa" value={studySheet.program?.name} />
                    <FichaInfo label="Inicio Etapa Lectiva" value={studySheet.startLective} />
                    <FichaInfo label="Fin Etapa Lectiva" value={studySheet.endLective} />
                    <FichaInfo label="Estado" value={studySheet.state ? 'Activo' : 'Inactivo'} />
                  </div>

                  <div className="w-full md:w-auto mt-4 md:mt-0 md:ml-auto text-center">
                    <button
                      onClick={() => handleAttendance(studySheet)}
                      className="bg-lime-600 hover:bg-lime-700 text-white px-5 py-2 rounded-lg transition duration-200"
                      disabled={loading}
                    >
                      Tomar asistencia
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <ApprenticeModal
              isOpen={isModalOpen}
              onClose={closeModal}
              students={selectedFicha?.students || []}
            />
          </div>
        </div>
      </div>
    </>
  );
};

const FichaInfo = ({ label, value }: { label: string; value?: string }) =>
  value ? (
    <div>
      <p className="text-black dark:text-white font-semibold">{label}</p>
      <p className="text-gray-700 dark:text-gray-300">{value}</p>
    </div>
  ) : null;

export default FichasInstructor;

'use client';

import { useEffect, useState } from 'react';
import { IoPeople } from "react-icons/io5";
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { fetchStudySheetByTeacher, fetchStudySheetById } from '@slice/olympo/studySheetSlice';
import { useRouter } from 'next/navigation';
import { useLoader } from '@/context/LoaderContext';
import ApprenticeModal from '@components/Modals/apprenticeModal';
import PageTitle from '@components/UI/pageTitle';
import EmptyState from "@components/UI/emptyState";


const FichasInstructor: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [selectedFicha, setSelectedFicha] = useState<any | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const router = useRouter();
  const { showLoader, hideLoader } = useLoader();

  const { data, loading, error } = useSelector((state: any) => state.studySheet);
  const fichas = data || [];

  useEffect(() => {
    dispatch(fetchStudySheetByTeacher({ idTeacher: 1, page: 0, size: 5 }));
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
    return <EmptyState message="No se encontraron fichas disponibles." />;
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
                      {studySheet.studentStudySheets?.length || 0}
                    </p>
                  </div>

                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 text-center md:text-left">
                    <FichaInfo label="Número de Ficha" value={studySheet.number} />
                    <FichaInfo label="Jornada" value={studySheet.journey?.name} />
                    <FichaInfo label="Programa" value={studySheet.trainingProject?.program?.name} />
                    <FichaInfo label="Inicio Etapa Lectiva" value={studySheet.startLective} />
                    <FichaInfo label="Fin Etapa Lectiva" value={studySheet.endLective} />
                    <FichaInfo label="Estado" value={studySheet.state ? 'Activo' : 'Inactivo'} />
                  </div>

                  <div className="w-full md:w-auto mt-4 md:mt-0 md:ml-auto text-center">
                    <button
                      onClick={() => handleAttendance(studySheet)}
                      className="group relative bg-gradient-to-r from-lime-600 to-green-600 hover:from-lime-700 hover:to-green-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-lg focus:outline-none focus:ring-4 focus:ring-lime-500/50 active:scale-95 flex items-center justify-center gap-2 min-w-[180px]"
                      disabled={loading}
                    >
                      <svg
                        className={`w-5 h-5 transition-transform duration-300 ${loading ? 'animate-spin' : 'group-hover:scale-110'}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        {loading ? (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        ) : (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        )}
                      </svg>
                      <span className="relative">
                        {loading ? 'Procesando...' : 'Tomar asistencia'}
                      </span>
                      <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <ApprenticeModal
              isOpen={isModalOpen}
              onClose={closeModal}
              students={selectedFicha?.studentStudySheets?.map((ss: any) => ss.student) || []}
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
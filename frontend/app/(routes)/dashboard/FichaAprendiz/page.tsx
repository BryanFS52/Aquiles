"use client";

import { useEffect } from "react";
import { FaUsers, FaRegClock, FaGraduationCap, FaRegListAlt, FaEnvelope, FaUserGraduate } from "react-icons/fa";
import { HiSparkles, HiAcademicCap } from "react-icons/hi";
import { useLoader } from "@context/LoaderContext";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@redux/store";
import { fetchStudySheetWithStudents, clearStudySheetState } from "@slice/olympo/studySheetSlice";
import Image from "next/image";
import PageTitle from "@components/UI/pageTitle";
import EmptyState from "@components/UI/emptyState";

const ApprenticeView = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { showLoader, hideLoader } = useLoader();
  const { data: studySheetData, dataForStudents, loading } = useSelector((state: RootState) => state.studySheet);

  const studySheet = studySheetData.length > 0 ? studySheetData[0] : null;
  const students = studySheet?.id ? dataForStudents[studySheet.id] || [] : [];

  useEffect(() => {
    // Limpiar estado anterior antes de cargar nueva ficha
    dispatch(clearStudySheetState());
    dispatch(fetchStudySheetWithStudents({ id: 5 }));
  }, [dispatch]);

  useEffect(() => {
    if (loading) {
      showLoader();
    } else {
      hideLoader();
    }
  }, [loading, showLoader, hideLoader]);

  if (!loading && !studySheet) {
    return <EmptyState message="No se encontró la ficha." />;
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <PageTitle>Ficha y Aprendices</PageTitle>
          </div>
        </div>
        {/* Info Cards con paleta personalizada */}
        {studySheet && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {/* Card Ficha */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-lightGreen rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-300"></div>
              <div className="relative bg-white dark:bg-shadowBlue p-6 rounded-2xl shadow-lg border border-lightGray dark:border-darkGray hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-primary/10 dark:bg-primary/20 rounded-xl">
                    <FaRegListAlt className="w-6 h-6 text-primary" />
                  </div>
                  <HiSparkles className="w-5 h-5 text-lightGreen opacity-60" />
                </div>
                <h3 className="text-sm font-medium text-darkGray dark:text-grayText uppercase tracking-wide">Ficha</h3>
                <p className="text-2xl font-bold text-black dark:text-white mt-1">{studySheet.number?.toString() || 'N/A'}</p>
              </div>
            </div>

            {/* Card Compañeros */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-lightGreen to-darkGreen rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-300"></div>
              <div className="relative bg-white dark:bg-shadowBlue p-6 rounded-2xl shadow-lg border border-lightGray dark:border-darkGray hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-lightGreen/10 dark:bg-lightGreen/20 rounded-xl">
                    <FaUsers className="w-6 h-6 text-lightGreen" />
                  </div>
                  <HiSparkles className="w-5 h-5 text-darkGreen opacity-60" />
                </div>
                <h3 className="text-sm font-medium text-darkGray dark:text-grayText uppercase tracking-wide">Compañeros</h3>
                <p className="text-2xl font-bold text-black dark:text-white mt-1">{students.length}</p>
              </div>
            </div>

            {/* Card Jornada */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-darkBlue to-secondary rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-300"></div>
              <div className="relative bg-white dark:bg-shadowBlue p-6 rounded-2xl shadow-lg border border-lightGray dark:border-darkGray hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-darkBlue/10 dark:bg-darkBlue/20 rounded-xl">
                    <FaRegClock className="w-6 h-6 text-darkBlue" />
                  </div>
                  <HiSparkles className="w-5 h-5 text-secondary opacity-60" />
                </div>
                <h3 className="text-sm font-medium text-darkGray dark:text-grayText uppercase tracking-wide">Jornada</h3>
                <p className="text-xl font-bold text-black dark:text-white mt-1">{studySheet.journey?.name || 'N/A'}</p>
              </div>
            </div>

            {/* Card Programa */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-secondary to-shadowBlue rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-300"></div>
              <div className="relative bg-white dark:bg-shadowBlue p-6 rounded-2xl shadow-lg border border-lightGray dark:border-darkGray hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-secondary/10 dark:bg-secondary/20 rounded-xl">
                    <FaGraduationCap className="w-6 h-6 text-secondary" />
                  </div>
                  <HiSparkles className="w-5 h-5 text-shadowBlue opacity-60" />
                </div>
                <h3 className="text-sm font-medium text-darkGray dark:text-grayText uppercase tracking-wide">Programa</h3>
                <p className="text-lg font-bold text-black dark:text-white mt-1 leading-tight">
                  {studySheet.trainingProject?.program?.name || 'N/A'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Sección de estudiantes con diseño mejorado */}
        <div className="bg-white dark:bg-shadowBlue rounded-3xl shadow-xl border border-lightGray dark:border-darkGray overflow-hidden">
          {/* Header con gradiente de la paleta */}
          <div className="bg-gradient-to-r from-primary via-lightGreen to-darkGreen px-8 py-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
                <FaUserGraduate className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Compañeros de la Ficha</h2>
                <p className="text-white/80 mt-1">Conoce a tu comunidad de aprendizaje</p>
              </div>
            </div>
          </div>

          <div className="p-8">
            {students.length === 0 ? (
              <div className="text-center py-16">
                <div className="p-4 bg-lightGray dark:bg-darkGray/30 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                  <FaUsers className="w-8 h-8 text-darkGray dark:text-grayText" />
                </div>
                <p className="text-darkGray dark:text-grayText text-lg">No hay compañeros registrados</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {students.map((studentStudySheet: any, index: number) => (
                  <div
                    key={studentStudySheet.student.id}
                    className="group relative bg-gradient-to-br from-white to-lightGray/50 dark:from-darkBlue dark:to-shadowBlue rounded-2xl p-6 shadow-lg border border-lightGray dark:border-darkGray hover:shadow-xl transition-all duration-500 hover:-translate-y-2 hover:scale-105"
                    style={{
                      animationDelay: `${index * 100}ms`,
                      animation: 'fadeInUp 0.6s ease-out forwards'
                    }}
                  >
                    {/* Gradiente de hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-lightGreen/5 to-darkGreen/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    {/* Contenido */}
                    <div className="relative z-10 text-center">
                      {/* Avatar con estilo personalizado */}
                      <div className="relative mb-4">
                        <div className="absolute inset-0 bg-gradient-to-r from-primary to-lightGreen rounded-full blur-md opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                        <div className="relative">
                          <Image
                            src={
                              studentStudySheet.student?.person?.photo ||
                              `https://ui-avatars.com/api/?name=${encodeURIComponent(`${studentStudySheet.student?.person?.name} ${studentStudySheet.student?.person?.lastname}`)}&background=398F0F&color=fff&size=128`
                            }
                            alt={`${studentStudySheet.student?.person?.name} ${studentStudySheet.student?.person?.lastname}`}
                            width={80}
                            height={80}
                            className="w-20 h-20 rounded-full object-cover mx-auto ring-4 ring-white dark:ring-shadowBlue shadow-lg group-hover:ring-primary/50 transition-all duration-300"
                          />
                          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-lightGreen rounded-full border-2 border-white dark:border-shadowBlue flex items-center justify-center">
                            <div className="w-3 h-3 bg-darkGreen rounded-full animate-pulse"></div>
                          </div>
                        </div>
                      </div>

                      {/* Información del estudiante */}
                      <div className="space-y-2">
                        <h3 className="text-lg font-bold text-black dark:text-white group-hover:text-primary dark:group-hover:text-lightGreen transition-colors duration-300">
                          {studentStudySheet.student?.person?.name} {studentStudySheet.student?.person?.lastname}
                        </h3>

                        <div className="flex items-center justify-center gap-2 text-sm text-darkGray dark:text-grayText">
                          <FaEnvelope className="w-3 h-3 text-primary" />
                          <span className="truncate max-w-full">{studentStudySheet.student?.person?.email}</span>
                        </div>
                      </div>

                      {/* Badge de estudiante con colores personalizados */}
                      <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-primary/10 to-lightGreen/10 dark:from-primary/20 dark:to-lightGreen/20 rounded-full text-xs font-medium text-primary dark:text-lightGreen border border-primary/20">
                        <HiAcademicCap className="w-3 h-3" />
                        Aprendiz SENA
                      </div>
                    </div>

                    {/* Efecto decorativo */}
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <HiSparkles className="w-5 h-5 text-lightGreen animate-pulse" />
                    </div>

                    {/* Borde decorativo */}
                    <div className="absolute inset-0 rounded-2xl border border-transparent bg-gradient-to-r from-primary/20 via-lightGreen/20 to-darkGreen/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CSS para animaciones personalizadas */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default ApprenticeView;

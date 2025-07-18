"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchStudySheets } from "@slice/olympo/studySheetSlice";
import { StudySheet } from "@graphql/generated";
import PageTitle from "@/components/UI/pageTitle";
import Link from "next/link";
import { useLoader } from "@/context/LoaderContext";

export default function StudySheetsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const {
    data: studySheets,
    loading: studySheetLoading,
    error,
  } = useSelector((state: RootState) => state.studySheet);
  const { showLoader, hideLoader } = useLoader();

  useEffect(() => {
    dispatch(fetchStudySheets({ page: 0, size: 5 }));
  }, [dispatch]);

  useEffect(() => {
    if (studySheetLoading) {
      showLoader();
    } else {
      hideLoader();
    }
  }, [studySheetLoading, showLoader, hideLoader]);

  // Función para formatear fechas
  const formatDate = (dateString?: string): string => {
    if (!dateString) return "Fecha no disponible";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Fecha inválida";

    return date.toLocaleDateString('es-CO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };


  return (
    <div>
      <PageTitle>Teams Scrum</PageTitle>

      <div className="mt-8">
        {error ? (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">Error al cargar las fichas</h3>
            <p className="text-red-600 dark:text-red-400">
              {typeof error === "string" ? error : JSON.stringify(error)}
            </p>
          </div>
        ) : studySheets.length === 0 ? (
          <div className="bg-white dark:bg-shadowBlue rounded-xl p-12 text-center border border-lightGray dark:border-darkGreen">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-grayText" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-darkGray dark:text-lightGray mb-2">No hay fichas disponibles</h3>
            <p className="text-grayText">Aún no se han creado fichas de estudio.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-2 2xl:grid-cols-3 gap-8">
            {(studySheets as StudySheet[]).map((sheet) => (
              <Link
                key={sheet.id}
                href={`/dashboard/teamScrum/${sheet.id}`}
                className="h-full group"
              >
                <div className="w-full h-full rounded-2xl overflow-hidden bg-white dark:bg-shadowBlue hover:shadow-lg transition-all duration-300 border border-lightGray dark:border-darkGreen flex flex-col cursor-pointer transform hover:-translate-y-1 hover:scale-[1.02] relative">
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-lightGreen/5 dark:from-lightGreen/10 dark:to-darkGreen/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  {/* Header with number badge */}
                  <div className="relative p-6 pb-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="bg-gradient-to-r from-primary to-lightGreen text-white px-4 py-2 rounded-full text-sm font-bold">
                        Ficha N° {sheet.number}
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
                        <span
                          className={`text-xs font-semibold px-3 py-1 rounded-full transition-colors ${sheet.state
                            ? "bg-green-100 text-darkGreen border border-green-200"
                            : "bg-red-100 text-red-700 border border-red-200"
                            }`}
                        >
                          {sheet.state ? "Activa" : "Inactiva"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="relative px-6 pb-6 flex-1">
                    <div className="space-y-4">
                      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                          <span className="text-sm font-medium text-grayText">Proyecto</span>
                        </div>
                        <p className="font-semibold text-primary dark:text-lightGreen text-lg">
                          {sheet.trainingProject?.name ?? "No especificado"}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 gap-3">
                        <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                          <span className="text-sm text-grayText font-medium">Jornada</span>
                          <span className="text-sm text-darkGray dark:text-lightGray font-semibold">
                            {sheet.journey?.name ?? "Sin jornada"}
                          </span>
                        </div>

                        <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                          <span className="text-sm text-grayText font-medium">Oferta</span>
                          <span className="text-sm text-darkGray dark:text-lightGray font-semibold">
                            {sheet.offer?.name ?? "Sin oferta"}
                          </span>
                        </div>

                        <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                          <span className="text-sm text-grayText font-medium">Trimestre</span>
                          <span className="text-sm text-darkGray dark:text-lightGray font-semibold">
                            {sheet.quarter?.length ?? 0}
                          </span>
                        </div>

                        {/* Fechas lectivas */}
                        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 space-y-2">
                          <div className="flex items-center space-x-2 mb-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">Período Lectivo</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span className="text-xs text-gray-600 dark:text-gray-400">Inicio:</span>
                              <span className="text-xs font-semibold text-green-700 dark:text-green-400">
                                {formatDate(sheet.startLective ?? 'N/A')}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span className="text-xs text-gray-600 dark:text-gray-400">Fin:</span>
                              <span className="text-xs font-semibold text-red-700 dark:text-red-400">
                                {formatDate(sheet.endLective ?? 'N/A')}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="relative px-6 py-4 bg-gray-50 dark:bg-gray-800/30 border-t border-gray-200 dark:border-gray-600">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-r from-primary to-lightGreen rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                          </svg>
                        </div>
                        <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                          {sheet.numberStudents} Aprendices
                        </span>
                      </div>

                      <div className="flex items-center space-x-2 text-primary dark:text-lightGreen group-hover:translate-x-1 transition-transform">
                        <span className="text-sm font-medium">Ver detalles</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

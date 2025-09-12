"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@redux/store";
import { fetchStudySheetByTeacherIdWithTeamScrum } from "@slice/olympo/studySheetSlice";
import { StudySheet } from "@graphql/generated";
import { useLoader } from "@context/LoaderContext";
import PageTitle from "@components/UI/pageTitle";
import EmptyState from "@components/UI/emptyState";
import Link from "next/link";

export default function StudySheetsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const {
    data: studySheets,
    loading: studySheetLoading,
    error,
  } = useSelector((state: RootState) => state.studySheet);
  const { showLoader, hideLoader } = useLoader();

  useEffect(() => {
    dispatch(fetchStudySheetByTeacherIdWithTeamScrum({ idTeacher: 1, page: 0, size: 5 }));
  }, [dispatch]);

  useEffect(() => {
    if (studySheetLoading) {
      showLoader();
    } else {
      hideLoader();
    }
  }, [studySheetLoading, showLoader, hideLoader]);

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

  if (error) {
    return (
      <EmptyState
        message={
          typeof error === "string"
            ? `Error al cargar las fichas: ${error}`
            : "Error desconocido al cargar las fichas."
        }
      />

    );
  }

  if (!studySheetLoading && (!studySheets || studySheets.length === 0)) {
    return (
      <EmptyState message="No se encontraron fichas disponibles." />
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <PageTitle>Teams Scrum</PageTitle>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        {(studySheets as StudySheet[]).map((sheet) => (
          <Link
            key={sheet.id}
            href={`/dashboard/teamScrum/${sheet.id}`}
            className="h-full group"
          >
            <div className="w-full h-full rounded-xl sm:rounded-2xl overflow-hidden bg-white dark:bg-dark-card hover:shadow-lg dark:hover:bg-dark-cardHover transition-all duration-300 border border-lightGray dark:border-dark-border flex flex-col cursor-pointer transform hover:-translate-y-1 hover:scale-[1.02] relative min-h-[400px] sm:min-h-[450px]">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-lightGreen/5 dark:from-shadowBlue/10 dark:to-darkBlue/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              <div className="relative p-4 sm:p-6 pb-3 sm:pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4">
                  <div className="bg-gradient-to-r from-primary to-lightGreen dark:from-shadowBlue dark:to-darkBlue text-white px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-bold text-center sm:text-left">
                    Ficha N° {sheet.number}
                  </div>
                  <div className="flex items-center justify-center sm:justify-end space-x-2">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-primary rounded-full animate-pulse"></div>
                    <span className={`text-xs font-semibold px-2 sm:px-3 py-1 rounded-full transition-colors ${sheet.state ? "bg-green-100 text-darkGreen border border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800" : "bg-red-100 text-red-700 border border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800"}`}>
                      {sheet.state ? "Activa" : "Inactiva"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="relative px-4 sm:px-6 pb-4 sm:pb-6 flex-1">
                <div className="space-y-3 sm:space-y-4">
                  <div className="bg-gray-50 dark:bg-shadowBlue/50 rounded-lg p-3 sm:p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-2 h-2 bg-primary dark:bg-lightGreen rounded-full"></div>
                      <span className="text-xs sm:text-sm font-medium text-grayText dark:text-dark-textSecondary">Programa</span>
                    </div>
                    <p className="font-semibold text-black dark:text-dark-text text-sm sm:text-base lg:text-lg leading-tight">
                      {sheet.trainingProject?.program?.name ?? "No especificado"}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-2 sm:gap-3">
                    <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-dark-border">
                      <span className="text-xs sm:text-sm text-grayText dark:text-dark-textSecondary font-medium">Jornada</span>
                      <span className="text-xs sm:text-sm text-black dark:text-dark-text font-semibold text-right">
                        {sheet.journey?.name ?? "Sin jornada"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-dark-border">
                      <span className="text-xs sm:text-sm text-grayText dark:text-dark-textSecondary font-medium">Oferta</span>
                      <span className="text-xs sm:text-sm text-black dark:text-dark-text font-semibold text-right">
                        {sheet.offer?.name ?? "Sin oferta"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-dark-border">
                      <span className="text-xs sm:text-sm text-grayText dark:text-dark-textSecondary font-medium">Trimestre</span>
                      <span className="text-xs sm:text-sm text-black dark:text-dark-text font-semibold text-right">
                        {(() => {
                          if (!sheet.quarter || sheet.quarter.length === 0) {
                            return "Sin trimestre";
                          }

                          const lastQuarter = [...sheet.quarter]
                            .filter(q => q?.name?.number !== undefined)
                            .sort((a, b) => (b?.name?.number ?? 0) - (a?.name?.number ?? 0))[0];

                          return `${lastQuarter?.name?.extension} ${lastQuarter?.name?.number}`;
                        })()}
                      </span>
                    </div>


                    <div className="bg-blue-50 dark:bg-shadowBlue/20 rounded-lg p-3 space-y-2">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-2 h-2 bg-blue-500 dark:bg-lightGreen rounded-full"></div>
                        <span className="text-xs sm:text-sm font-medium text-blue-600 dark:text-lightGreen">Período Lectivo</span>
                      </div>
                      <div className="space-y-1 sm:space-y-2">
                        <div className="flex items-center space-x-2">
                          <svg className="w-3 h-3 sm:w-4 sm:h-4 text-green-600 dark:text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-xs text-gray-600 dark:text-dark-textSecondary">Inicio:</span>
                          <span className="text-xs font-semibold text-green-700 dark:text-green-400">
                            {formatDate(sheet.startLective ?? 'N/A')}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <svg className="w-3 h-3 sm:w-4 sm:h-4 text-red-600 dark:text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-xs text-gray-600 dark:text-dark-textSecondary">Fin:</span>
                          <span className="text-xs font-semibold text-red-700 dark:text-red-400">
                            {formatDate(sheet.endLective ?? 'N/A')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative px-4 sm:px-6 py-3 sm:py-4 bg-gray-50 dark:bg-shadowBlue/30 border-t border-gray-200 dark:border-dark-border mt-auto">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-primary to-lightGreen dark:from-shadowBlue dark:to-darkBlue rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                      </svg>
                    </div>
                    <span className="text-xs sm:text-sm font-semibold text-gray-600 dark:text-dark-textSecondary">
                      {sheet.numberStudents} Aprendices
                    </span>
                  </div>
                  <div className="flex items-center space-x-1 sm:space-x-2 text-black dark:text-dark-text group-hover:translate-x-1 transition-transform">
                    <span className="text-xs sm:text-sm font-medium hidden sm:inline">Ver detalles</span>
                    <span className="text-xs font-medium sm:hidden">Detalles</span>
                    <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

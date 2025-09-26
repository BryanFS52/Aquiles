'use client';

import React from 'react';
import { IoPeople } from "react-icons/io5";
import { StudySheetCardProps } from './types';
import { FichaInfo } from './FichaInfo';

export const StudySheetCard: React.FC<StudySheetCardProps> = ({
    studySheet,
    onViewApprentices,
    onTakeAttendance,
    onTakeJustification,
    onTakeFollowUp,
    loading = false
}) => {
    return (
        <div className="flex flex-col md:flex-row items-center gap-6 shadow-xl rounded-2xl p-6 bg-white dark:bg-gradient-to-br dark:from-shadowBlue dark:to-darkBlue border border-gray-300/80 dark:border-gray-600/70 ring-2 ring-white/10 dark:ring-shadowBlue/40 transition-all">
            {/* Sección de Aprendices */}
            <div className="flex flex-col items-center">
                <div
                    className="bg-gradient-to-r from-primary to-lime-500 dark:from-shadowBlue dark:to-darkBlue rounded-2xl h-20 w-20 flex items-center justify-center border-4 border-black/50 dark:border-white shadow-lg hover:scale-105 cursor-pointer transition"
                    onClick={() => onViewApprentices(studySheet)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => (['Enter', ' '].includes(e.key) ? onViewApprentices(studySheet) : null)}
                    aria-label="Ver aprendices"
                >
                    <IoPeople className="text-white text-4xl" />
                </div>
                <p className="text-black dark:text-white text-lg font-bold mt-2">Aprendices</p>
                <p className="text-2xl font-semibold text-black dark:text-white">
                    {studySheet.studentStudySheets?.length || 0}
                </p>
            </div>

            {/* Información de la Ficha */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 text-center md:text-left">
                <FichaInfo label="Número de Ficha" value={studySheet.number?.toString()} />
                <FichaInfo label="Jornada" value={studySheet.journey?.name} />
                <FichaInfo label="Programa" value={studySheet.trainingProject?.program?.name} />
                <FichaInfo label="Inicio Etapa Lectiva" value={studySheet.startLective} />
                <FichaInfo label="Fin Etapa Lectiva" value={studySheet.endLective} />
                <FichaInfo label="Estado" value={studySheet.state ? 'Activo' : 'Inactivo'} />
            </div>

            {/* Botones alineados y del mismo tamaño */}
            <div className="flex flex-col w-full gap-3 items-center justify-center md:justify-start md:items-start max-w-xs">
                <button
                    onClick={() => onTakeAttendance(studySheet)}
                    className="group relative w-full min-w-[180px] bg-gradient-to-r from-lime-600 to-green-600 hover:from-lime-700 hover:to-green-700 dark:from-shadowBlue dark:to-darkBlue dark:hover:from-darkBlue dark:hover:to-shadowBlue text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-lg focus:outline-none focus:ring-4 focus:ring-lime-500/50 dark:focus:ring-shadowBlue/50 active:scale-95 flex items-center justify-center gap-2"
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
                <button
                    onClick={() => onTakeJustification(studySheet)}
                    className="group relative w-full min-w-[180px] bg-gradient-to-r from-lime-600 to-green-600 hover:from-lime-700 hover:to-green-700 dark:from-shadowBlue dark:to-darkBlue dark:hover:from-darkBlue dark:hover:to-shadowBlue text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-lg focus:outline-none focus:ring-4 focus:ring-lime-500/50 dark:focus:ring-shadowBlue/50 active:scale-95 flex items-center justify-center gap-2"
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
                        {loading ? 'Procesando...' : 'Ver Justificaciones'}
                    </span>
                    <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
                <button
                    onClick={() => onTakeFollowUp(studySheet)}
                    className="group relative w-full min-w-[180px] bg-gradient-to-r from-lime-600 to-green-600 hover:from-lime-700 hover:to-green-700 dark:from-shadowBlue dark:to-darkBlue dark:hover:from-darkBlue dark:hover:to-shadowBlue text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-lg focus:outline-none focus:ring-4 focus:ring-lime-500/50 dark:focus:ring-shadowBlue/50 active:scale-95 flex items-center justify-center gap-2"
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
                        {loading ? 'Procesando...' : 'Seguimiento'}
                    </span>
                    <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
            </div>
        </div>
    );
};

export default StudySheetCard;

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { IoPeople } from 'react-icons/io5';
import { FaCalendarDay, FaRegListAlt, FaCheckCircle, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { AbsencesListProps } from './types';
import { Attendance } from '@graphql/generated';

const formatDate = (dateString: string) => {
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('es-CO', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};

export const AbsencesList: React.FC<AbsencesListProps> = ({
    absences,
    onShowForm,
}) => {
    const [currentPage, setCurrentPage] = useState(0);
    const ITEMS_PER_PAGE = 3;

    // Filtrar ausencias que no estén justificadas ni injustificadas
    const filteredAbsences = absences.filter(absence => {
        const justificationStatus = absence.justification?.justificationStatus?.name;
        const attendanceState = absence.attendanceState?.status;
        return justificationStatus !== "Justificado" && 
               justificationStatus !== "Injustificado" && 
               justificationStatus !== "Denegado" &&
               justificationStatus !== "Aceptado" &&
               attendanceState !== "Retardo";
    });

    const sortedAbsences = [...filteredAbsences].sort((a, b) => {
        const dateA = new Date(a.attendanceDate ?? '');
        const dateB = new Date(b.attendanceDate ?? '');
        return dateB.getTime() - dateA.getTime();
    });

    // Calcular paginación
    const totalItems = sortedAbsences.length;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    const startIndex = currentPage * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const displayedAbsences = sortedAbsences.slice(startIndex, endIndex);

    // Funciones de navegación
    const goToNextPage = () => {
        if (currentPage < totalPages - 1) {
            setCurrentPage(currentPage + 1);
        }
    };

    const goToPreviousPage = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
        }
    };

    const goToPage = (page: number) => {
        if (page >= 0 && page < totalPages) {
            setCurrentPage(page);
        }
    };

    return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-5xl bg-white dark:bg-[#002033] rounded-xl shadow-sm border border-white dark:border-[#002033] h-auto"
    >
        <div className="bg-white dark:bg-[#002033] rounded-xl shadow-lg p-3 sm:p-4 md:p-6 lg:p-8 border border-gray-100 dark:border-gray-800">
            <div className="flex items-center mb-4 sm:mb-6">
                <div className="bg-gradient-to-r dark:from-secondary dark:to-blue-900 from-primary to-lime-500 p-2 sm:p-3 rounded-full shadow-lg flex-shrink-0">
                    <IoPeople className="text-xl sm:text-2xl text-white" />
                </div>
                <div className="ml-3 sm:ml-4 min-w-0">
                    <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 dark:text-white truncate">
                        Ausencias Registradas
                    </h2>
                    <p className="text-gray-600 text-xs sm:text-sm dark:text-gray-400 truncate">
                        Gestiona tus justificaciones de ausencias
                    </p>
                </div>
            </div>

            {sortedAbsences.length > 0 && (
                <div className="mb-4 sm:mb-6">
                    <div className="pr-0 sm:pr-2 space-y-3 sm:space-y-4 min-h-[300px] sm:min-h-[350px] md:min-h-[400px] max-h-[400px] overflow-y-auto">
                        {displayedAbsences.map((attendance: Attendance, index) => {
                            const isProcessing = attendance.justification?.justificationStatus?.name === "En proceso";
                            return (
                                <motion.div
                                    key={attendance.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className={`group hover:shadow-md transition-all duration-300 p-3 sm:p-4 rounded-lg sm:rounded-xl relative overflow-hidden ${
                                        isProcessing
                                            ? 'bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 dark:bg-gradient-to-r dark:from-orange-300 dark:to-amber-100 dark:border-amber-800'
                                            : 'bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 dark:bg-gradient-to-r dark:from-red-300 dark:to-orange-100 dark:border-red-800'
                                    }`}
                                >
                                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                                    isProcessing 
                                        ? 'bg-gradient-to-r from-yellow-500/5 to-amber-500/5' 
                                        : 'bg-gradient-to-r from-red-500/5 to-orange-500/5'
                                }`} />
                                <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                                    <div className="flex items-start sm:items-center flex-1 min-w-0">
                                        <div className={`p-1.5 sm:p-2 rounded-lg shadow-md flex-shrink-0 ${
                                            isProcessing ? 'bg-amber-600 dark:bg-yellow-700' : 'bg-red-500'
                                        }`}>
                                            <FaCalendarDay className="text-white text-base sm:text-lg" />
                                        </div>
                                        <div className="ml-3 sm:ml-4 min-w-0 flex-1">
                                            <div className="font-semibold text-gray-800 text-sm sm:text-base md:text-lg">
                                                {formatDate(attendance.attendanceDate ?? '')}
                                            </div>
                                            <div className={`text-xs sm:text-sm font-medium ${
                                                isProcessing ? 'text-yellow-600' : 'text-red-600'
                                            }`}>
                                                {attendance.competenceQuarter?.competence?.name && (
                                                    <span className="block text-xs text-gray-900 dark:text-gray-900 mt-1 line-clamp-2">
                                                        {attendance.competenceQuarter.competence.name}
                                                    </span>
                                                )}
                                                {attendance.justification?.justificationStatus?.name === "En proceso" 
                                                    ? "Justificacion por evaluar" 
                                                    : `${attendance.attendanceState?.status === 'Ausente' ? 'Ausencia' : attendance.attendanceState?.status || 'Ausencia'} por justificar`
                                                }
                                            </div>
                                        </div>
                                    </div>
                                    {/* Verificar si la justificación ya está en proceso para deshabilitar el botón */}
                                    {(() => {
                                        const isProcessing = attendance.justification?.justificationStatus?.name === "En proceso";
                                        return (
                                            <button
                                                onClick={() => !isProcessing && onShowForm(attendance.id)}
                                                disabled={isProcessing}
                                                className={`w-full sm:w-auto font-semibold py-2 sm:py-3 px-4 sm:px-6 rounded-lg sm:rounded-xl transition-all duration-200 flex items-center justify-center text-xs sm:text-sm shadow-lg transform flex-shrink-0 ${
                                                    isProcessing
                                                        ? 'bg-gradient-to-r from-amber-600 to-amber-400 dark:from-yellow-700 dark:to-yellow-600 text-white cursor-not-allowed border border-yellow-400'
                                                        : 'bg-gradient-to-r dark:from-secondary dark:to-blue-900 from-primary to-lime-500 text-white hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0'
                                                }`}
                                            >
                                                <FaRegListAlt className="mr-2" />
                                                {isProcessing ? 'En proceso' : 'Justificar'}
                                            </button>
                                        );
                                    })()}
                                </div>
                            </motion.div>
                            );
                        })}
                    </div>

                    {/* Controles de Paginación */}
                    {totalPages > 1 && (
                    <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 px-2 sm:px-4 py-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center text-xs sm:text-sm text-gray-700 dark:text-gray-300 text-center sm:text-left">
                            <span>
                                Mostrando {startIndex + 1} a {Math.min(endIndex, totalItems)} de {totalItems}
                            </span>
                        </div>
                            
                            <div className="flex items-center gap-1 sm:gap-2">
                            {/* Botón Anterior */}
                            <button
                                onClick={goToPreviousPage}
                                disabled={currentPage === 0}
                                className={`flex items-center px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-md transition-colors duration-200 ${
                                currentPage === 0
                                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                                }`}
                            >
                                <FaChevronLeft className="w-2.5 h-2.5 sm:w-3 sm:h-3 sm:mr-1" />
                                <span className="hidden sm:inline">Anterior</span>
                            </button>

                            {/* Números de página */}
                            <div className="flex gap-1">
                                {Array.from({ length: totalPages }, (_, index) => (
                                <button
                                    key={index}
                                    onClick={() => goToPage(index)}
                                    className={`px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-md transition-colors duration-200 ${
                                    currentPage === index
                                        ? 'bg-primary text-white dark:bg-secondary'
                                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                                    }`}
                                >
                                    {index + 1}
                                </button>
                                ))}
                            </div>

                            {/* Botón Siguiente */}
                            <button
                                onClick={goToNextPage}
                                disabled={currentPage === totalPages - 1}
                                className={`flex items-center px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-md transition-colors duration-200 ${
                                currentPage === totalPages - 1
                                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                                }`}
                            >
                                <span className="hidden sm:inline">Siguiente</span>
                                <FaChevronRight className="w-2.5 h-2.5 sm:w-3 sm:h-3 sm:ml-1" />
                            </button>
                        </div>
                    </div>
                    )}
                </div>
            )}

            {sortedAbsences.length === 0 && (
                <div className="text-center py-8 sm:py-12">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', duration: 0.6 }}
                        className="mb-4 sm:mb-6"
                    >
                        <div className="bg-gradient-to-r from-green-400 to-emerald-500 p-4 sm:p-5 md:p-6 rounded-full inline-block shadow-lg">
                            <FaCheckCircle className="text-4xl sm:text-5xl md:text-6xl text-white" />
                        </div>
                    </motion.div>
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2 sm:mb-3 px-4">
                        ¡Excelente asistencia!
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg px-4">
                        No tienes ausencias pendientes por justificar.
                    </p>
                    <p className="text-gray-500 dark:text-gray-300 text-xs sm:text-sm mt-2 px-4">
                        Continúa manteniendo tu buen récord de asistencia.
                    </p>
                </div>
            )}
        </div>
    </motion.div>
    );
};

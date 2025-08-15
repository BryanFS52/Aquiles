import React from 'react';
import { motion } from 'framer-motion';
import { IoPeople } from 'react-icons/io5';
import { FaCalendarDay, FaRegListAlt, FaCheckCircle } from 'react-icons/fa';
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
    return (
        <div className="bg-white dark:bg-[#002033] rounded-xl shadow-lg p-8 border border-gray-100 dark:border-gray-800">
            <div className="flex items-center mb-6">
                <div className="bg-gradient-to-r dark:from-secondary dark:to-blue-900 from-primary to-lime-500 p-3 rounded-full shadow-lg">
                    <IoPeople className="text-2xl text-white" />
                </div>
                <div className="ml-4">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                        Ausencias Registradas
                    </h2>
                    <p className="text-gray-600 text-sm dark:text-gray-400">
                        Gestiona tus justificaciones de ausencias
                    </p>
                </div>
            </div>

            {absences.length > 0 && (
                <div className="mb-6">
                    <div className="max-h-80 overflow-y-auto pr-2 space-y-4">
                        {absences.map((attendance: Attendance, index) => (
                            <motion.div
                                key={attendance.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="group hover:shadow-md transition-all duration-300 p-4 bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 dark:bg-gradient-to-r dark:from-red-300 dark:to-orange-100 dark:border-red-800 rounded-xl relative overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                <div className="relative flex items-center justify-between">
                                    <div className="flex items-center">
                                        <div className="bg-red-500 p-2 rounded-lg shadow-md">
                                            <FaCalendarDay className="text-white text-lg" />
                                        </div>
                                        <div className="ml-4">
                                            <div className="font-semibold text-gray-800 text-lg">
                                                {formatDate(attendance.attendanceDate ?? '')}
                                            </div>
                                            <div className="text-sm text-red-600 font-medium">
                                                Estado:{' '}
                                                {attendance.attendanceState?.status || 'Ausente'}
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => onShowForm(attendance.id)}
                                        className="bg-gradient-to-r dark:from-secondary dark:to-blue-900 from-primary to-lime-500 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center text-sm shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0"
                                    >
                                        <FaRegListAlt className="mr-2" />
                                        Justificar
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}

            {absences.length === 0 && (
                <div className="text-center py-12">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', duration: 0.6 }}
                        className="mb-6"
                    >
                        <div className="bg-gradient-to-r from-green-400 to-emerald-500 p-6 rounded-full inline-block shadow-lg">
                            <FaCheckCircle className="text-6xl text-white" />
                        </div>
                    </motion.div>
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-3">
                        ¡Excelente asistencia!
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-lg">
                        No tienes ausencias pendientes por justificar.
                    </p>
                    <p className="text-gray-500 dark:text-gray-300 text-sm mt-2">
                        Continúa manteniendo tu buen récord de asistencia.
                    </p>
                </div>
            )}
        </div>
    );
};

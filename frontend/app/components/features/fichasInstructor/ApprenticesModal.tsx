'use client';

import React from 'react';
import Modal from '@/components/UI/Modal';
import { StudentStudySheet } from './types';

interface ApprenticesModalProps {
    isOpen: boolean;
    onClose: () => void;
    students: StudentStudySheet[];
}

export const ApprenticesModal: React.FC<ApprenticesModalProps> = ({
    isOpen,
    onClose,
    students
}) => {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Lista de aprendices"
            size="xl"
        >
            {students && students.length > 0 ? (
                <div className="space-y-4">
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        Total de aprendices: <span className="font-semibold">{students.length}</span>
                    </div>

                    <div className="flex flex-col gap-2 sm:grid sm:grid-cols-1 sm:gap-3">
                        {students.map((student, index) => {
                            const person = student?.student?.person;
                            const displayName = person?.name && person?.lastname
                                ? `${person.name} ${person.lastname}`
                                : person?.name || 'Nombre no disponible';
                            const studentState = student?.studentStudySheetState?.name || 'Estado no disponible';

                            return (
                                <div
                                    key={student?.student?.id || index}
                                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600"
                                >
                                    <div className="flex items-center gap-2 sm:gap-3 w-full">
                                        <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-r from-primary to-lime-500 dark:from-shadowBlue dark:to-darkBlue rounded-full flex items-center justify-center text-white font-semibold border border-lime-500 dark:border-shadowBlue shadow text-base sm:text-lg">
                                            {displayName.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-medium text-gray-800 dark:text-white text-sm sm:text-base truncate">
                                                {displayName}
                                            </p>
                                            {person?.email && (
                                                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">
                                                    {person.email}
                                                </p>
                                            )}
                                            {person?.document && (
                                                <p className="text-[10px] sm:text-xs text-gray-400 dark:text-gray-500 truncate">
                                                    Doc: {person.document}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center mt-2 sm:mt-0 sm:ml-2 sm:flex-row">
                                        <span className={`px-2 py-1 text-[10px] sm:text-xs font-medium rounded-full whitespace-nowrap ${studentState === 'En formacion'
                                            ? 'bg-green-600 text-white dark:bg-green-600 dark:text-white'
                                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                                            }`}>
                                            {studentState}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ) : (
                <div className="text-center py-12">
                    <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                        </svg>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400">
                        No hay aprendices registrados en esta ficha
                    </p>
                </div>
            )}
        </Modal>
    );
};

export default ApprenticesModal;

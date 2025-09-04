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
            title="Lista de Aprendices"
            size="xl"
        >
            {students && students.length > 0 ? (
                <div className="space-y-4">
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        Total de aprendices: <span className="font-semibold">{students.length}</span>
                    </div>

                    <div className="grid gap-3">
                        {students.map((student, index) => {
                            const person = student?.student?.person;
                            const displayName = person?.name && person?.lastname
                                ? `${person.name} ${person.lastname}`
                                : person?.name || 'Nombre no disponible';
                            const studentState = student?.studentStudySheetState?.name || 'Estado no disponible';

                            return (
                                <div
                                    key={student?.student?.id || index}
                                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600"
                                >
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                                            {/* Bolita con el gradiente del header: from-primary to-lime-500 */}
                                            <div className="w-10 h-10 bg-gradient-to-r from-primary to-lime-500 rounded-full flex items-center justify-center text-white font-semibold border border-lime-500 shadow">
                                                {displayName.charAt(0).toUpperCase()}
                                            </div>
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900 dark:text-white">
                                                {displayName}
                                            </p>
                                            {person?.email && (
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    {person.email}
                                                </p>
                                            )}
                                            {person?.document && (
                                                <p className="text-xs text-gray-400 dark:text-gray-500">
                                                    Doc: {person.document}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${studentState === 'En formacion'
                                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
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

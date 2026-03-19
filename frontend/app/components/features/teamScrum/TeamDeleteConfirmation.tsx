'use client';

import React from 'react';
import Modal from '@components/UI/Modal';
import { FaTrashAlt, FaExclamationTriangle } from 'react-icons/fa';
import { TeamsScrum } from './types';

interface TeamDeleteConfirmationProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    team: TeamsScrum | null;
}

export const TeamDeleteConfirmation: React.FC<TeamDeleteConfirmationProps> = ({
    isOpen,
    onClose,
    onConfirm,
    team
}) => {
    if (!isOpen || !team) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={<span className="text-white">Confirmar eliminación</span>}
            size="md"
            showHeaderAccent={false}
            showCloseButton={false}
            headerClassName="bg-gradient-to-r from-[#5cb800] to-[#8fd400] dark:from-secondary dark:to-darkBlue rounded-t-3xl border-b-0 relative overflow-hidden"
        >
            <div className="text-center py-6">
                {/* Icono de advertencia */}
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FaExclamationTriangle className="w-8 h-8 text-red-500 dark:text-red-400" />
                </div>

                {/* Mensaje principal */}
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    ¿Estás seguro de eliminar este equipo?
                </h3>

                {/* Información del equipo */}
                <div className="bg-gray-50 dark:bg-darkBackground/50 rounded-lg p-4 mb-6 border border-gray-100 dark:border-dark-border/60">
                    <div className="flex items-center justify-center space-x-3 mb-2">
                        <FaTrashAlt className="text-red-500 dark:text-red-400" />
                        <span className="font-semibold text-gray-900 dark:text-white">
                            {team.teamName || 'Sin nombre'}
                        </span>
                    </div>
                    {team.students && team.students.length > 0 && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            {team.students.length} miembro{team.students.length !== 1 ? 's' : ''} en el equipo
                        </p>
                    )}
                </div>

                {/* Advertencia */}
                <p className="text-gray-600 dark:text-gray-400 mb-8 text-sm leading-relaxed">
                    Esta acción no se puede deshacer. Se eliminará toda la información
                    del equipo y las asignaciones de perfiles de los miembros.
                </p>

                {/* Botones de acción */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                        onClick={onClose}
                        className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 dark:text-white dark:bg-darkBackground/60 dark:hover:bg-darkBackground/80 dark:border dark:border-dark-border/60 rounded-lg font-medium transition-all duration-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-dark-border"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className="px-6 py-3 text-white bg-red-600 dark:bg-red-600 dark:border dark:border-red-500/30 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500/50 dark:focus:ring-red-400/50"
                    >
                        Eliminar equipo
                    </button>
                </div>
            </div>
        </Modal>
    );
};

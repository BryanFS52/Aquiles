'use client';

import React from 'react';
import Modal from '@components/UI/Modal';
import { MdGroup } from 'react-icons/md';

interface TeamScrumEmptyStateProps {
    isOpen: boolean;
    onClose: () => void;
    onCreateTeam: () => void;
}

export const TeamScrumEmptyState: React.FC<TeamScrumEmptyStateProps> = ({
    isOpen,
    onClose,
    onCreateTeam
}) => {
    if (!isOpen) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="No hay equipos disponibles"
            size="lg"
        >
            <div className="text-center py-8">
                <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                    <MdGroup className="w-10 h-10 text-grayText dark:text-lightGray" />
                </div>

                <h3 className="text-xl font-semibold text-darkGray dark:text-white mb-3">
                    No hay equipos de Scrum disponibles
                </h3>

                <p className="text-grayText dark:text-white mb-8 leading-relaxed">
                    Aún no se han creado equipos para esta ficha.
                    ¿Te gustaría crear el primer equipo ahora?
                </p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                        onClick={onClose}
                        className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-all duration-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-gray-300"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={() => {
                            onClose();
                            onCreateTeam();
                        }}
                        className="px-6 py-3 text-white bg-gradient-to-r from-primary to-lightGreen hover:from-primary/90 hover:to-lightGreen/90 dark:from-secondary dark:to-darkBlue dark:hover:from-secondary/90 dark:hover:to-darkBlue/90 rounded-lg font-medium transition-all duration-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                    >
                        Crear Primer Equipo
                    </button>
                </div>
            </div>
        </Modal>
    );
};

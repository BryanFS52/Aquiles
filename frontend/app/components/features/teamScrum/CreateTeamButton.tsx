'use client';

import React from 'react';
import { MdAddCircle } from 'react-icons/md';

interface CreateTeamButtonProps {
    onClick: () => void;
    disabled?: boolean;
    className?: string;
}

export const CreateTeamButton: React.FC<CreateTeamButtonProps> = ({
    onClick,
    disabled = false,
    className = ""
}) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`flex items-center gap-3 text-white bg-gradient-to-r from-primary to-lightGreen hover:from-primary/90 hover:to-lightGreen/90 dark:from-secondary dark:to-darkBlue dark:hover:from-secondary/90 dark:hover:to-darkBlue/90 px-6 py-3 rounded-xl hover:-translate-y-1 mb-8 font-semibold transition-all duration-300 transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 ${className}`}
        >
            <MdAddCircle className="text-2xl" />
            <span>Crear nuevo equipo</span>
        </button>
    );
};

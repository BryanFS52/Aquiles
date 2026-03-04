import React from 'react';
import { FaComputer } from 'react-icons/fa6';
import { Program } from '@graphql/generated';

interface ProgramCardProps {
  program: Program;
}

export const ProgramCard: React.FC<ProgramCardProps> = ({ program }) => {
  const Icon = FaComputer;
  
  return (
    <div className="group relative bg-white dark:bg-shadowBlue rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-lightGray dark:border-grayText w-full">
      {/* Degradado decorativo */}
      <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-primary/10 to-lightGreen/10 dark:from-secondary/10 dark:to-darkBlue/10 rounded-bl-full -z-0"></div>

      {/* Contenido */}
      <div className="relative p-4 sm:p-6 z-10 flex flex-col h-full min-h-[180px] sm:min-h-[200px]">
        {/* Icono */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20">
          <Icon 
            className="text-2xl sm:text-3xl text-primary/80 dark:text-secondary/80 transition-colors duration-300" 
            aria-hidden="true"
          />
        </div>

        {/* Info del programa */}
        <div className="space-y-2 sm:space-y-3 flex-1">
          <div>
            <span className="text-xs sm:text-sm text-grayText dark:text-white">
                Programa
            </span>
            <h3 className="text-base sm:text-lg lg:text-xl font-bold text-primary dark:text-secondary mb-1 sm:mb-2 pr-10 sm:pr-12 line-clamp-2">
              {program.name || 'Programa sin nombre'}
            </h3>
            <span className="text-xs sm:text-sm text-grayText dark:text-white">
                Descripción
            </span>
            <p className="text-xs sm:text-sm text-grayText dark:text-white leading-relaxed line-clamp-3 sm:line-clamp-4">
              {program.description || 'Sin descripción disponible'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

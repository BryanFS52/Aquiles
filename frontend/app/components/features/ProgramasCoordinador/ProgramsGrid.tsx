import React from 'react';
import { Program } from '@graphql/generated';
import { ProgramCard } from './ProgramCard';

interface ProgramsGridProps {
  programs: Program[];
  loading: boolean;
  searchTerm: string;
}

export const ProgramsGrid: React.FC<ProgramsGridProps> = ({ 
  programs, 
  loading, 
  searchTerm 
}) => {
  if (loading) {
    return (
      <p className="text-center text-gray-600 dark:text-gray-400">Cargando programas...</p>
    );
  }

  if (programs.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 dark:text-gray-400">
          {searchTerm ? 'No se encontraron programas que coincidan con la búsqueda.' : 'No hay programas disponibles.'}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
      {programs.map((program) => (
        <ProgramCard key={program.id} program={program} />
      ))}
    </div>
  );
};

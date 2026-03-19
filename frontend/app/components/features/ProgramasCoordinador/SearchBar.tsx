import React from 'react';

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  resultsCount?: number;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchTerm,
  onSearchChange,
  resultsCount
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start">
      <input
        type="text"
        placeholder="Buscar programa"
        className="w-full sm:w-80 md:w-96 lg:w-1/2 p-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#01b001] dark:focus:ring-blue-500 focus:border-transparent transition-colors duration-300"
        value={searchTerm}
        onChange={onSearchChange}
      />

      {/* Results counter */}
      {searchTerm && resultsCount !== undefined && (
        <span className="text-sm text-gray-600 dark:text-gray-400 pt-3">
          {resultsCount} programa{resultsCount !== 1 ? 's' : ''} encontrado{resultsCount !== 1 ? 's' : ''}
        </span>
      )}
    </div>
  );
};

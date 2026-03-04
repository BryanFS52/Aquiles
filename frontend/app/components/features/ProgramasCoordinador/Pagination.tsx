import React from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({ 
  currentPage, 
  totalPages, 
  onPageChange 
}) => {
  if (totalPages <= 1) return null;

  const goToNextPage = () => {
    if (currentPage < totalPages - 1) {
      onPageChange(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 0) {
      onPageChange(currentPage - 1);
    }
  };

  const goToPage = (page: number) => {
    if (page >= 0 && page < totalPages) {
      onPageChange(page);
    }
  };

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 rounded-b-lg">
      <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
        <span>
          Página {currentPage + 1} de {totalPages}
        </span>
      </div>
      
      <div className="flex items-center space-x-2">
        {/* Botón Anterior */}
        <button
          onClick={goToPreviousPage}
          disabled={currentPage === 0}
          className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
            currentPage === 0
              ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
          }`}
        >
          <FaChevronLeft className="w-3 h-3 mr-1" />
          Anterior
        </button>

        {/* Números de página */}
        <div className="flex space-x-1">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              onClick={() => goToPage(index)}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                currentPage === index
                  ? 'bg-gradient-to-r from-primary to-lightGreen dark:from-secondary dark:to-blue-900 text-white'
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
          className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
            currentPage === totalPages - 1
              ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
          }`}
        >
          Siguiente
          <FaChevronRight className="w-3 h-3 ml-1" />
        </button>
      </div>
    </div>
  );
};

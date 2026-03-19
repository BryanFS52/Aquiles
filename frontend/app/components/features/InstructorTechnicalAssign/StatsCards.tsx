import React from 'react';

interface StatsCardsProps {
  totalSheets: number;
  sheetsWithInstructor: number;
  sheetsWithoutInstructor: number;
}

const StatsCards: React.FC<StatsCardsProps> = ({
  totalSheets,
  sheetsWithInstructor,
  sheetsWithoutInstructor
}) => {
  return (
    <div className="mb-6 sm:mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
      <div className="bg-white dark:bg-shadowBlue p-4 sm:p-5 rounded-xl shadow-md border-l-4 border-primary dark:border-primary">
        <p className="text-xs sm:text-sm text-darkGray dark:text-gray-300">Total fichas</p>
        <p className="text-xl sm:text-2xl font-bold text-secondary dark:text-white">{totalSheets}</p>
      </div>
      <div className="bg-white dark:bg-shadowBlue p-4 sm:p-5 rounded-xl shadow-md border-l-4 border-lightGreen dark:border-lightGreen">
        <p className="text-xs sm:text-sm text-darkGray dark:text-gray-300">Con instructor</p>
        <p className="text-xl sm:text-2xl font-bold text-secondary dark:text-white">{sheetsWithInstructor}</p>
      </div>
      <div className="bg-white dark:bg-shadowBlue p-4 sm:p-5 rounded-xl shadow-md border-l-4 border-yellow-500">
        <p className="text-xs sm:text-sm text-darkGray dark:text-gray-300">Sin asignar</p>
        <p className="text-xl sm:text-2xl font-bold text-secondary dark:text-white">{sheetsWithoutInstructor}</p>
      </div>
    </div>
  );
};

export default StatsCards;
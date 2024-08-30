// components/TableAttendance.js
"use client";

import React from 'react';

const TableAttendance = ({ apprentices, onToggleAttendance }) => {
  // Verifica si `apprentices` es un array y tiene elementos
  if (!Array.isArray(apprentices)) {
    console.error('Expected `apprentices` to be an array');
    return null;
  }

  return (
    <div className="w-11/12 h-auto rounded-lg overflow-hidden shadow-lg bg-white border-2 border-gray-300 relative mb-4 p-4 ml-10 mt-10">
      <div className="container mx-auto">
        <div className="overflow-x-auto mt-4 bg-gray-100 mb-5">
          <table className="min-w-full divide-y divide-gray-200 border border-gray-200 table-auto">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-10 py-3 text-left text-xs font-medium text-black uppercase tracking-wider border-2 border-gray-300"></th>
                <th className="px-28 py-3 text-left text-xs font-medium text-black uppercase tracking-wider border-2 border-gray-300"></th>
                {[...Array(4)].map((_, weekIndex) => (
                  <th key={weekIndex} colSpan={7} className="px-2 py-3 text-center text-xs font-semibold font-inter text-black uppercase tracking-wider border-2 border-gray-300">Semana {weekIndex + 1}</th>
                ))}
              </tr>
              <tr>
                <th className="px-10 py-3 text-left text-xs text-gray-700 uppercase tracking-wider border-2 border-gray-300 font-inter font-semibold">Número de Documento</th>
                <th className="px-6 py-3 text-xs text-center text-gray-700 uppercase tracking-wider border-2 border-gray-300 font-inter font-semibold">Nombre y Apellido</th>
                {[...Array(28)].map((_, dayIndex) => (
                  <th key={dayIndex} className="px-4 py-3 border-2 border-gray-300 bg-gray-100 text-sm font-inter font-semibold text-gray-700">
                    {dayIndex % 7 === 0 ? 'L' :
                      dayIndex % 7 === 1 ? 'M' :
                      dayIndex % 7 === 2 ? 'M' :
                      dayIndex % 7 === 3 ? 'J' :
                      dayIndex % 7 === 4 ? 'V' :
                      dayIndex % 7 === 5 ? 'S' :
                      'D'}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-300">
              {apprentices.map((apprentice, index) => (
                <tr key={index}>
                  <td className="px-10 py-3 text-sm text-gray-700 border-2 border-gray-300">{apprentice.documentNumber}</td>
                  <td className="px-6 py-3 text-sm text-center text-gray-700 border-2 border-gray-300">{apprentice.name} {apprentice.lastName}</td>
                  {[...Array(28)].map((_, dayIndex) => (
                    <td key={dayIndex} className="px-4 py-3 border-2 border-gray-300 text-center">
                      <input
                        type="checkbox"
                        checked={apprentice.weeks[Math.floor(dayIndex / 7)][dayIndex % 7] || false}
                        onChange={() => onToggleAttendance(index, dayIndex % 7, Math.floor(dayIndex / 7))}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TableAttendance;

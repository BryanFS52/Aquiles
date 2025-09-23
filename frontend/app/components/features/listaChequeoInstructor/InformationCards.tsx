'use client';

import React from 'react';
import { Card } from "@components/UI/Card";
import { InformationCardsProps } from './types';

export const InformationCards: React.FC<InformationCardsProps> = ({
  selectedTeamScrumName,
  selectedStudySheetNumber,
  selectedChecklist
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <Card 
        header={
          <div className="w-16 h-16 bg-[#5cb800]/10 dark:bg-[#5cb800]/20 rounded-full flex items-center justify-center mx-auto mb-3">
            <div className="w-8 h-8 bg-[#5cb800] dark:bg-[#5cb800] rounded-full flex items-center justify-center">
              <span className="text-white dark:text-white text-sm font-bold"></span>
            </div>
          </div>
        }
        body={
          <div className="text-center">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Centro de Formación</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-tight">Centro de Servicios Financieros</p>
            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
              <p className="text-xs font-semibold text-[#5cb800] dark:text-[#5cb800]">Fecha</p>
              <p className="text-xs text-gray-600 dark:text-gray-300">05/02/2024 - 05/05/2024</p>
            </div>
          </div>
        }
      />
      
      <Card 
        header={
          <div className="w-16 h-16 bg-[#5cb800]/10 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
            <div className="w-8 h-8 bg-[#538dda] dark:bg-blue-400 rounded-full flex items-center justify-center">
              <span className="text-white dark:text-gray-900 text-sm font-bold"></span>
            </div>
          </div>
        }
        body={
          <div className="text-center">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Datos de Formación</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              <span className="font-semibold text-gray-900 dark:text-white">Jornada:</span> Diurna
            </p>
            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
              <p className="text-xs font-semibold text-[#538dda] dark:text-blue-400">Ficha N°</p>
              <p className="text-xs text-gray-600 dark:text-gray-300">{selectedStudySheetNumber || "No disponible"}</p>
            </div>
          </div>
        }
      />
      
      <Card 
        header={
          <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
            <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm"></span>
            </div>
          </div>
        }
        body={
          <div className="text-center">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Team Scrum</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{selectedTeamScrumName || "No seleccionado"}</p>
            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
              <p className="text-xs font-semibold text-purple-600 dark:text-purple-400">Evaluando</p>
              <p className="text-xs text-gray-600 dark:text-gray-300">Equipo de desarrollo</p>
            </div>
          </div>
        }
      />
      
      <Card 
        header={
          <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm"></span>
            </div>
          </div>
        }
        body={
          <div className="text-center">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Instructor Calificador</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Juan Pérez</p>
            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
              <p className="text-xs font-semibold text-orange-600 dark:text-orange-400">Lista Seleccionada</p>
              {selectedChecklist ? (
                <p className="text-xs text-gray-600 dark:text-gray-300 leading-tight">
                  ID: {selectedChecklist.id} - {selectedChecklist.component || 'N/A'}
                </p>
              ) : (
                <p className="text-xs text-gray-500 dark:text-gray-400">Ninguna lista seleccionada</p>
              )}
            </div>
          </div>
        }
      />
    </div>
  );
};
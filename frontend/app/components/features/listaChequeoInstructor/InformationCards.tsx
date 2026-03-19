'use client';

import React from 'react';
import { Card } from "@components/UI/Card";
import { InformationCardsProps } from './types';

interface StudySheetInfo {
  fichaNumber: string;
  jornada: string;
  fechas: string;
  programa: string;
}

interface TeamScrumInfo {
  teamName: string;
  projectName: string;
}

interface InformationCardsPropsExtended extends InformationCardsProps {
  studySheetInfo?: StudySheetInfo;
  teamScrumInfo?: TeamScrumInfo;
}

export const InformationCards: React.FC<InformationCardsPropsExtended> = ({
  selectedTeamScrumName,
  selectedStudySheetNumber,
  selectedChecklist,
  studySheetInfo,
  teamScrumInfo
}) => {
  // Calcular conteo de indicadores
  const technicalCount = selectedChecklist?.items?.filter((item: any) => item.code?.startsWith('TEC')).length ?? 0;
  const attitudinalCount = selectedChecklist?.items?.filter((item: any) => item.code?.startsWith('ACT')).length ?? 0;
  const totalIndicators = technicalCount + attitudinalCount;

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
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Programa de formación</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-tight">
              {studySheetInfo?.programa || selectedChecklist?.trainingProjectId || "No disponible"}
            </p>
            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
              <p className="text-xs font-semibold text-[#5cb800] dark:text-[#5cb800]">Trimestre</p>
              <p className="text-xs text-gray-600 dark:text-gray-300">
                {selectedChecklist?.trimester || "Sin trimestre asignado"}
              </p>
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
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Datos de formación</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              <span className="font-semibold text-gray-900 dark:text-white">Jornada:</span> {studySheetInfo?.jornada || "No disponible"}
            </p>
            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
              <p className="text-xs font-semibold text-[#538dda] dark:text-blue-400">Ficha N°</p>
              <p className="text-xs text-gray-600 dark:text-gray-300">
                {studySheetInfo?.fichaNumber || selectedStudySheetNumber || "No disponible"}
              </p>
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
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Team scrum</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
              {teamScrumInfo?.teamName || selectedTeamScrumName || "No seleccionado"}
            </p>
            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
              <p className="text-xs font-semibold text-purple-600 dark:text-purple-400">Proyecto</p>
              <p className="text-xs text-gray-600 dark:text-gray-300">
                {teamScrumInfo?.projectName || "No disponible"}
              </p>
            </div>
          </div>
        }
      />

      <Card
        header={
          <div className="w-16 h-16 bg-lime-100 dark:bg-lime-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
            <div className="w-8 h-8 bg-lime-500 dark:bg-lime-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm"></span>
            </div>
          </div>
        }
        body={
          <div className="text-center">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Indicadores</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between bg-lime-50 dark:bg-lime-900/20 rounded-lg px-3 py-2 border border-lime-200 dark:border-lime-700">
                <span className="text-xs font-medium text-lime-700 dark:text-lime-300">
                  Técnicos
                </span>
                <span className="text-sm font-bold text-lime-800 dark:text-lime-200">
                  {technicalCount}
                </span>
              </div>
              <div className="flex items-center justify-between bg-lime-50 dark:bg-lime-900/20 rounded-lg px-3 py-2 border border-lime-200 dark:border-lime-700">
                <span className="text-xs font-medium text-lime-700 dark:text-lime-300">
                  Actitudinales
                </span>
                <span className="text-sm font-bold text-lime-800 dark:text-lime-200">
                  {attitudinalCount}
                </span>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
              <p className="text-xs font-semibold text-gray-600 dark:text-gray-400">Total</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                {totalIndicators}
              </p>
            </div>
          </div>
        }
      />
    </div>
  );
};
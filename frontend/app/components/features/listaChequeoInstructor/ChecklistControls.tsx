import React from 'react';
import { ChecklistControlsProps } from './types';
import { Card } from "@components/UI/Card";
import { FileText, Download, Edit3, Filter } from 'lucide-react';

interface ChecklistControlsPropsExtended extends ChecklistControlsProps {
  availableTrimester: string[];
}

export const ChecklistControls: React.FC<ChecklistControlsPropsExtended> = ({
  selectedTrimester,
  filteredChecklists,
  selectedChecklist,
  activeChecklists,
  availableTrimester,
  isFinalSaved,
  onTrimesterChange,
  onChecklistChange,
  onSaveChecklist,
  onEnableModification,
  onExportPDF,
  onExportExcel
}) => {
  return (
    <Card
      header={
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-[#5cb800] to-[#8fd400] dark:from-shadowBlue dark:to-darkBlue rounded-xl flex items-center justify-center">
            <Filter className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Controles de lista de chequeo</h3>
        </div>
      }
      body={
        <div className="space-y-6">
          {/* Selectores */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Selector de Trimestre - Ahora dinámico */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <span className="w-2 h-2 bg-[#5cb800] dark:bg-shadowBlue rounded-full"></span>
                Trimestre (del coordinador)
              </label>
              <select
                value={selectedTrimester}
                onChange={(e) => onTrimesterChange(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200 focus:ring-2 focus:ring-[#5cb800] dark:focus:ring-shadowBlue focus:border-[#5cb800] dark:focus:border-shadowBlue hover:border-[#5cb800] dark:hover:border-shadowBlue"
              >
                <option value="">Todos los trimestres</option>
                {availableTrimester.map((trimester) => (
                  <option key={trimester} value={trimester}>
                    {trimester}
                  </option>
                ))}
              </select>
              {availableTrimester.length === 0 && (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  No hay trimestres creados por el coordinador
                </p>
              )}
            </div>

            {/* Selector de Lista de Chequeo */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <span className="w-2 h-2 bg-[#538dda] dark:bg-blue-400 rounded-full"></span>
                Lista de chequeo
              </label>
              <select
                value={selectedChecklist?.id || ''}
                onChange={(e) => onChecklistChange(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200 focus:ring-2 focus:ring-[#538dda] dark:focus:ring-blue-400 focus:border-[#538dda] dark:focus:border-blue-400 hover:border-[#538dda] dark:hover:border-blue-400"
              >
                <option value="">Seleccionar lista de chequeo</option>
                {filteredChecklists.map((checklist) => {
                  const displayText = checklist.component || checklist.remarks || `Lista de chequeo ${checklist.id}`;
                  // Limitar a 100 caracteres con puntos suspensivos si es más largo
                  const truncatedText = displayText.length > 100
                    ? displayText.substring(0, 100) + '...'
                    : displayText;
                  return (
                    <option key={checklist.id} value={checklist.id}>
                      {truncatedText}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex flex-wrap gap-3 justify-center md:justify-end">
            <button
              onClick={onSaveChecklist}
              disabled={!selectedChecklist || isFinalSaved}
              className="flex items-center gap-2 bg-gradient-to-r from-[#5cb800] to-[#6bc500] hover:from-[#4da600] hover:to-[#5cb800] disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
            >
              <FileText className="w-4 h-4" />
              Vista previa y guardar
            </button>
            
            <button
              onClick={onExportPDF}
              disabled={!selectedChecklist}
              className="flex items-center gap-2 bg-gradient-to-r from-[#5cb800] to-[#6bc500] hover:from-[#4da600] hover:to-[#5cb800] disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
            >
              <Download className="w-4 h-4" />
              PDF
            </button>

            <button
              onClick={onExportExcel}
              disabled={!selectedChecklist}
              className="flex items-center gap-2 bg-gradient-to-r from-[#5cb800] to-[#6bc500] hover:from-[#4da600] hover:to-[#5cb800] disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
            >
              <Download className="w-4 h-4" />
              Excel
            </button>

            {isFinalSaved && (
              <button
                onClick={onEnableModification}
                className="flex items-center gap-2 bg-gradient-to-r from-[#5cb800] to-[#6bc500] hover:from-[#4da600] hover:to-[#5cb800] text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Edit3 className="w-4 h-4" />
                Habilitar modificación
              </button>
            )}
          </div>
        </div>
      }
      footer={
        <div className="space-y-3">
          {/* Estadísticas */}
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300 font-medium">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Activas: <b className="text-gray-900 dark:text-white">{activeChecklists.length}</b></span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span>Filtradas: <b className="text-gray-900 dark:text-white">{filteredChecklists.length}</b></span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span>Trimestres: <b className="text-gray-900 dark:text-white">{availableTrimester.length}</b></span>
              </div>
            </div>
          </div>
          
          {/* Criterios de Evaluación */}
          {selectedChecklist && (selectedChecklist.component || selectedChecklist.remarks) && (
            <div className="bg-gradient-to-r from-green-50 to-lime-50 dark:from-gray-800 dark:to-gray-750 rounded-lg p-3 border border-green-200 dark:border-gray-600">
              <div className="flex items-start gap-2">
                <div className="flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-[#5cb800] dark:text-[#6bc500]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-[#5cb800] dark:text-[#6bc500] uppercase tracking-wide mb-1">
                    Criterios de evaluación
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed break-words overflow-wrap-anywhere whitespace-pre-wrap">
                    {selectedChecklist.component || selectedChecklist.remarks}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      }
      className="mb-6"
    />
  );
};

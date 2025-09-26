import React from 'react';
import { Save, FileDown, Edit } from "lucide-react";
import { ChecklistControlsProps } from './types';

export const ChecklistControls: React.FC<ChecklistControlsProps> = ({
  selectedTrimester,
  filteredChecklists,
  selectedChecklist,
  activeChecklists,
  isFinalSaved,
  onTrimesterChange,
  onChecklistChange,
  onSaveChecklist,
  onEnableModification,
  onExportPDF,
  onExportExcel
}) => {
  return (
    <div className="relative">
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl border border-gray-200 dark:border-gray-700 shadow-xl p-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            <div className="relative group">
              <select
                onChange={(e) => onTrimesterChange(e.target.value)}
                value={selectedTrimester}
                className="hexagon-input appearance-none p-4 pl-12 pr-10 border-2 border-darkBlue dark:border-shadowBlue bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 text-darkBlue dark:text-white rounded-full focus:ring-4 focus:ring-[#5cb800]/30 dark:focus:ring-shadowBlue/30 focus:border-[#5cb800] dark:focus:border-shadowBlue transition-all duration-300 shadow-lg hover:shadow-xl font-semibold cursor-pointer"
              >
                <option value="todos">Todos los Trimestres</option>
                {[...Array(7)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>Trimestre {i + 1}</option>
                ))}
              </select>

              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-darkBlue dark:text-shadowBlue pointer-events-none">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>

            <div className="relative group">
              <select
                onChange={(e) => onChecklistChange(e.target.value)}
                value={selectedChecklist?.id || ""}
                className="hexagon-input appearance-none p-4 pl-12 pr-10 border-2 border-darkBlue dark:border-shadowBlue bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 text-darkBlue dark:text-white rounded-full focus:ring-4 focus:ring-[#5cb800]/30 dark:focus:ring-shadowBlue/30 focus:border-[#5cb800] dark:focus:border-shadowBlue transition-all duration-300 shadow-lg hover:shadow-xl font-semibold cursor-pointer"
                disabled={filteredChecklists.length === 0}
              >
                <option value="">Seleccionar Lista de Chequeo</option>
                {filteredChecklists.map((checklist) => (
                  <option key={checklist.id} value={checklist.id}>
                    ID: {checklist.id} - {checklist.component || 'Lista de Chequeo'} (T{checklist.trimester || 'N/A'})
                  </option>
                ))}
              </select>

              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-darkBlue dark:text-shadowBlue pointer-events-none">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>

            <button
              onClick={onSaveChecklist}
              disabled={!selectedChecklist || isFinalSaved}
              className={`hexagon-button flex items-center gap-3 px-6 py-4 rounded-full border-2 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 ${selectedChecklist && !isFinalSaved
                  ? 'border-[#5cb800] dark:border-shadowBlue bg-gradient-to-r from-[#5cb800] to-[#8fd400] dark:from-shadowBlue dark:to-darkBlue text-white hover:from-[#4a9600] hover:to-[#7bc300] dark:hover:from-darkBlue dark:hover:to-shadowBlue'
                  : 'border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
            >
              <Save className="w-5 h-5" />
              <span>{isFinalSaved ? 'Lista Guardada' : 'Vista Previa y Guardar'}</span>
            </button>

            {/* Botón de modificar lista (aparece después del guardado final) */}
            {isFinalSaved && (
              <button
                onClick={onEnableModification}
                className="hexagon-button flex items-center gap-3 px-6 py-4 rounded-full border-2 border-[#5cb800] dark:border-blue-400 bg-gradient-to-r from-[#5cb800] to-[#8fd400] dark:from-blue-500 dark:to-blue-600 text-white hover:from-[#4a9600] hover:to-[#7bc300] dark:hover:from-blue-400 dark:hover:to-blue-500 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Edit className="w-5 h-5" />
                <span>Modificar Lista</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-r from-[#5cb800] to-[#8fd400] dark:from-shadowBlue dark:to-darkBlue text-white px-4 py-2 rounded-full shadow-md">
              <span className="text-sm font-semibold">
                Activas: {activeChecklists.length} | Filtradas: {filteredChecklists.length}
              </span>
            </div>

            <button
              onClick={onExportPDF}
              disabled={!selectedChecklist}
              className={`hexagon-export flex items-center gap-2 px-5 py-3 rounded-full transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 ${selectedChecklist
                  ? 'bg-gradient-to-r from-[#5cb800] to-[#8fd400] dark:from-shadowBlue dark:to-darkBlue text-white hover:from-[#4a9600] hover:to-[#7bc300] dark:hover:from-darkBlue dark:hover:to-shadowBlue'
                  : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                }`}
            >
              <FileDown className="w-5 h-5" />
              <span>PDF</span>
            </button>

            <button
              onClick={onExportExcel}
              disabled={!selectedChecklist}
              className={`hexagon-export flex items-center gap-2 px-5 py-3 rounded-full transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 ${selectedChecklist
                  ? 'bg-gradient-to-r from-[#5cb800] to-[#8fd400] dark:from-shadowBlue dark:to-darkBlue text-white hover:from-[#4a9600] hover:to-[#7bc300] dark:hover:from-darkBlue dark:hover:to-shadowBlue'
                  : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                }`}
            >
              <FileDown className="w-5 h-5" />
              <span>Excel</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

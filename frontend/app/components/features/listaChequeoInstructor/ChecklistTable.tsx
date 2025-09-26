import React from 'react';
import { ChecklistTableProps } from './types';

export const ChecklistTable: React.FC<ChecklistTableProps> = ({
  items,
  currentItems,
  itemStates,
  currentPage,
  totalPages,
  isFinalSaved,
  onItemChange,
  onPageChange
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="bg-gradient-to-r from-[#5cb800] to-[#8fd400] dark:from-shadowBlue dark:to-darkBlue px-6 py-4">
        <h2 className="text-2xl font-bold text-white text-center">
          Lista de Chequeo
        </h2>
      </div>
      
      <div className="overflow-x-auto">
        <div className="min-w-full">
          {/* Headers personalizados con el diseño de la imagen */}
          <div className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
            <div className="grid grid-cols-12 gap-4 px-6 py-5 text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              <div className="col-span-1 text-center">ITEM</div>
              <div className="col-span-5 text-left">DESCRIPCIÓN DEL INDICADOR</div>
              <div className="col-span-2 text-center">CUMPLE</div>
              <div className="col-span-4 text-left">OBSERVACIONES</div>
            </div>
          </div>
          
          {/* Contenido de la tabla */}
          <div className="divide-y divide-gray-200 dark:divide-gray-600">
            {currentItems.map((item, index) => {
              const itemState = itemStates[item.id] || { completed: item.completed, observations: item.observations };
              return (
                <div key={item.id} className="grid grid-cols-12 gap-4 px-6 py-5 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200">
                  {/* ITEM */}
                  <div className="col-span-1 flex items-center justify-center">
                    <div className="w-8 h-8 bg-gradient-to-r from-[#5cb800] to-[#8fd400] dark:from-shadowBlue dark:to-darkBlue rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">{item.id}</span>
                    </div>
                  </div>
                  
                  {/* DESCRIPCIÓN DEL INDICADOR */}
                  <div className="col-span-5 flex items-start">
                    <p className="text-gray-900 dark:text-white font-medium leading-relaxed evaluation-text text-base">
                      {item.indicator}
                    </p>
                  </div>
                  
                  {/* CUMPLE */}
                  <div className="col-span-2 flex items-center justify-center">
                    <div className="flex space-x-6">
                      <label className={`flex items-center space-x-2 cursor-pointer transition-colors duration-200 ${
                        isFinalSaved ? 'opacity-50 cursor-not-allowed' : ''
                      }`}>
                        <input
                          type="radio"
                          name={`item-${item.id}`}
                          checked={itemState.completed === true}
                          onChange={() => onItemChange(item.id, "completed", true)}
                          disabled={isFinalSaved}
                          className={`w-5 h-5 text-blue-600 focus:ring-blue-500 focus:ring-2 border-gray-300 dark:border-gray-600 ${
                            isFinalSaved ? 'cursor-not-allowed' : ''
                          }`}
                        />
                        <span className={`text-base font-medium ${
                          itemState.completed === true 
                            ? 'text-blue-700 dark:text-blue-400' 
                            : 'text-gray-600 dark:text-gray-400'
                        }`}>
                          Sí
                        </span>
                      </label>
                      
                      <label className={`flex items-center space-x-2 cursor-pointer transition-colors duration-200 ${
                        isFinalSaved ? 'opacity-50 cursor-not-allowed' : ''
                      }`}>
                        <input
                          type="radio"
                          name={`item-${item.id}`}
                          checked={itemState.completed === false}
                          onChange={() => onItemChange(item.id, "completed", false)}
                          disabled={isFinalSaved}
                          className={`w-5 h-5 text-red-600 focus:ring-red-500 focus:ring-2 border-gray-300 dark:border-gray-600 ${
                            isFinalSaved ? 'cursor-not-allowed' : ''
                          }`}
                        />
                        <span className={`text-base font-medium ${
                          itemState.completed === false 
                            ? 'text-red-700 dark:text-red-400' 
                            : 'text-gray-600 dark:text-gray-400'
                        }`}>
                          No
                        </span>
                      </label>
                    </div>
                  </div>
                  
                  {/* OBSERVACIONES */}
                  <div className="col-span-4 flex items-start">
                    <textarea
                      value={itemState.observations || ''}
                      onChange={(e) => onItemChange(item.id, "observations", e.target.value)}
                      disabled={isFinalSaved}
                      className={`w-full px-4 py-3 text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none break-words whitespace-pre-wrap ${
                        isFinalSaved ? 'opacity-50 cursor-not-allowed' : 'focus:ring-2 focus:ring-[#5cb800] dark:focus:ring-shadowBlue focus:border-[#5cb800] dark:focus:border-shadowBlue'
                      }`}
                      style={{ overflowWrap: 'anywhere' }}
                      rows={4}
                      placeholder={isFinalSaved ? "Evaluación guardada" : "Escriba sus observaciones..."}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Paginación integrada */}
          {totalPages > 1 && (
            <div className="bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600 px-6 py-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Página <span className="font-medium text-gray-900 dark:text-white">{currentPage}</span> de <span className="font-medium text-gray-900 dark:text-white">{totalPages}</span>
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    Anterior
                  </button>
                  <div className="px-4 py-2 text-sm font-medium text-[#5cb800] dark:text-shadowBlue bg-[#5cb800]/10 dark:bg-shadowBlue/20 border border-[#5cb800]/30 dark:border-shadowBlue/30 rounded-lg">
                    {currentPage} / {totalPages}
                  </div>
                  <button
                    onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    Siguiente
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

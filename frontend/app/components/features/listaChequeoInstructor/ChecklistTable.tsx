import React from 'react';
import { ChecklistTableProps } from './types';
import DataTable from '@components/UI/DataTable';
import { DataTableColumn } from '@components/UI/DataTable/types';
import { Badge } from 'lucide-react';

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
  const columns: DataTableColumn<any>[] = [
    {
      key: 'type',
      header: 'TIPO',
      className: 'text-center w-32',
      render: (item) => {
        const isTechnical = item.code?.startsWith('TEC');
        return (
          <div className="flex justify-center">
            <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold border ${
              isTechnical
                ? 'bg-lime-50 dark:bg-lime-900/20 text-lime-700 dark:text-lime-300 border-lime-200 dark:border-lime-700'
                : 'bg-lime-50 dark:bg-lime-900/20 text-lime-700 dark:text-lime-300 border-lime-200 dark:border-lime-700'
            }`}>
              {isTechnical ? 'Técnico' : 'Actitudinal'}
            </span>
          </div>
        );
      }
    },
    {
      key: 'indicator',
      header: 'DESCRIPCIÓN DEL INDICADOR',
      className: 'text-left px-4',
      render: (item) => (
        <p className="text-gray-900 dark:text-white font-medium leading-relaxed evaluation-text text-base">
          {item.indicator}
        </p>
      )
    },
    {
      key: 'completed',
      header: 'CUMPLE',
      className: 'text-center w-32',
      render: (item) => {
        const itemState = itemStates[item.id] || { completed: item.completed, observations: item.observations };
        return (
          <div className="flex space-x-6 justify-center">
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
        );
      }
    },
    {
      key: 'observations',
      header: 'OBSERVACIONES',
      className: 'text-left px-4 w-96',
      render: (item) => {
        const itemState = itemStates[item.id] || { completed: item.completed, observations: item.observations };
        return (
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
        );
      }
    }
  ];

  return (
    <div className="mb-6">
      <DataTable
        columns={columns}
        data={currentItems}
        pageSize={currentItems.length} // Mostrar todos los items de la página actual
        filterPlaceholder="Buscar en lista de chequeo..."
        className="border-0 shadow-xl"
        paginator={() => null} // Deshabilitar paginación interna del DataTable
        filterFunction={(item, filter) =>
          item.indicator?.toLowerCase().includes(filter.toLowerCase()) ||
          (itemStates[item.id]?.observations || '').toLowerCase().includes(filter.toLowerCase())
        }
      />
      
      {/* Paginación personalizada */}
      {totalPages > 1 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 mt-4 px-6 py-4">
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
  );
};

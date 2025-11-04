import React from 'react';
import { Edit, Save } from "lucide-react";
import { PreviewModalProps } from './types';
import Modal from '@components/UI/Modal';

export const PreviewModal: React.FC<PreviewModalProps> = ({
  showPreview,
  selectedChecklist,
  generatePreviewData,
  onBackToEdit,
  onFinalSave
}) => {
  if (!showPreview) return null;

  const previewData = generatePreviewData();
  if (!previewData) return null;

  return (
    <Modal
      isOpen={showPreview}
      onClose={onBackToEdit}
      title="Vista Previa - Lista de Chequeo"
      size="xxxl"
      className="h-[95vh]"
    >
      <div className="h-[80vh] overflow-y-auto overflow-x-hidden">
        <div className="space-y-8">
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
            Revise la información antes de guardar definitivamente
          </p>
          
          {/* Información del checklist */}
          <div className="bg-gradient-to-br from-[#5cb800]/10 via-[#6bc500]/5 to-[#8fd400]/10 dark:from-[#5cb800]/20 dark:via-[#6bc500]/10 dark:to-[#8fd400]/20 p-6 rounded-2xl border border-[#5cb800]/40 dark:border-[#5cb800]/30 shadow-lg">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
              Información de la Lista
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white/70 dark:bg-[#5cb800]/10 p-4 rounded-xl border border-[#5cb800]/30 dark:border-[#5cb800]/20">
                <span className="font-bold text-gray-700 dark:text-[#8fd400] text-sm uppercase tracking-wide">ID:</span>
                <div className="text-lg font-bold text-[#5cb800] dark:text-[#8fd400] mt-1">{previewData.checklist.id}</div>
              </div>
              <div className="bg-white/70 dark:bg-[#5cb800]/10 p-4 rounded-xl border border-[#5cb800]/30 dark:border-[#5cb800]/20">
                <span className="font-bold text-gray-700 dark:text-[#8fd400] text-sm uppercase tracking-wide">Trimestre:</span>
                <div className="text-lg font-bold text-[#5cb800] dark:text-[#8fd400] mt-1">{previewData.checklist.trimester || 'N/A'}</div>
              </div>
              <div className="bg-white/70 dark:bg-[#5cb800]/10 p-4 rounded-xl border border-[#5cb800]/30 dark:border-[#5cb800]/20">
                <span className="font-bold text-gray-700 dark:text-[#8fd400] text-sm uppercase tracking-wide">Componente:</span>
                <div className="text-lg font-bold text-[#5cb800] dark:text-[#8fd400] mt-1">{previewData.checklist.component || 'N/A'}</div>
              </div>
            </div>
          </div>

          {/* Items del checklist */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden shadow-lg">
            <div className="bg-gradient-to-r from-[#5cb800] via-[#6bc500] to-[#8fd400] dark:from-shadowBlue dark:via-darkBlue dark:to-shadowBlue p-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-3">
                Items Evaluados ({previewData.items.length})
              </h3>
            </div>
            <div className="p-4 max-h-96 overflow-y-auto">
              <div className="space-y-4">
                {previewData.items.map((item: any, index: number) => (
                  <div key={item.id} className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                    item.completed === true 
                      ? 'border-green-500/60 bg-green-50/50 dark:border-green-500/40 dark:bg-green-900/20' 
                      : item.completed === false 
                        ? 'border-red-500/60 bg-red-50/50 dark:border-red-500/40 dark:bg-red-900/20'
                        : 'border-gray-300/60 bg-gray-50 dark:border-gray-600/40 dark:bg-gray-800/40'
                  }`}>
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold shadow-lg ${
                          item.completed === true 
                            ? 'bg-gradient-to-br from-green-500 to-green-600' 
                            : item.completed === false 
                              ? 'bg-gradient-to-br from-red-500 to-red-600'
                              : 'bg-gradient-to-br from-gray-400 to-slate-500'
                        }`}>
                          {item.completed === true ? '✓' : item.completed === false ? '✗' : '?'}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className="font-bold text-gray-900 dark:text-white">Item {item.id}</span>
                          <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                            item.completed === true 
                              ? 'bg-gradient-to-r from-green-500 to-green-600 text-white' 
                              : item.completed === false 
                                ? 'bg-gradient-to-r from-red-500 to-red-600 text-white'
                                : 'bg-gradient-to-r from-gray-400 to-slate-500 text-white'
                          }`}>
                            {item.completed === true ? 'CUMPLE' : item.completed === false ? 'NO CUMPLE' : 'SIN EVALUAR'}
                          </span>
                        </div>
                        <p className="text-gray-900 dark:text-gray-200 mb-3 text-sm leading-relaxed">{item.indicator}</p>
                        {item.observations && (
                          <div className="bg-white/80 dark:bg-gray-700/50 p-3 rounded-xl border border-gray-200/60 dark:border-gray-600/20">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-bold text-gray-900 dark:text-white text-xs uppercase tracking-wide">Observaciones</span>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300 text-xs leading-relaxed">{item.observations}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Evaluación (si existe) */}
          {previewData.hasEvaluationData && (
            <div className="bg-gradient-to-br from-[#5cb800]/10 via-[#6bc500]/5 to-[#8fd400]/10 dark:from-[#5cb800]/20 dark:via-[#6bc500]/10 dark:to-[#8fd400]/20 p-6 rounded-2xl border border-[#5cb800]/40 dark:border-[#5cb800]/30 shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Evaluación
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div>
                  <div className="bg-white/80 dark:bg-[#5cb800]/10 p-4 rounded-xl border border-[#5cb800]/30 dark:border-[#5cb800]/20 h-full">
                    <h4 className="font-bold text-gray-900 dark:text-[#8fd400] mb-2">Observaciones</h4>
                    <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-xl border border-gray-200/60 dark:border-gray-600/20 min-h-[100px]">
                      <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed break-words whitespace-pre-wrap">
                        {previewData.evaluation.observations || 'Sin observaciones'}
                      </p>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="bg-white/80 dark:bg-[#5cb800]/10 p-4 rounded-xl border border-[#5cb800]/30 dark:border-[#5cb800]/20 h-full">
                    <h4 className="font-bold text-gray-900 dark:text-[#8fd400] mb-2">Recomendaciones</h4>
                    <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-xl border border-gray-200/60 dark:border-gray-600/20 min-h-[100px]">
                      <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed break-words whitespace-pre-wrap">
                        {previewData.evaluation.recommendations || 'Sin recomendaciones'}
                      </p>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="bg-white/80 dark:bg-[#5cb800]/10 p-4 rounded-xl border border-[#5cb800]/30 dark:border-[#5cb800]/20 h-full">
                    <h4 className="font-bold text-gray-900 dark:text-[#8fd400] mb-2">Juicio de Valor</h4>
                    <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-xl border border-gray-200/60 dark:border-gray-600/20 min-h-[100px] flex items-center justify-center">
                      <span className={`inline-flex px-4 py-2 rounded-xl text-sm font-bold shadow-lg ${
                        previewData.evaluation.judgment === 'APROBADO' ? 'bg-gradient-to-r from-green-500 to-green-600 text-white' :
                        previewData.evaluation.judgment === 'NO APROBADO' ? 'bg-gradient-to-r from-red-500 to-red-600 text-white' :
                        previewData.evaluation.judgment === 'PENDIENTE' ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white' :
                        'bg-gradient-to-r from-gray-500 to-slate-600 text-white'
                      }`}>
                        {previewData.evaluation.judgment || 'PENDIENTE'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Estadísticas */}
          <div className="bg-gradient-to-br from-[#5cb800]/10 via-[#6bc500]/5 to-[#8fd400]/10 dark:from-[#5cb800]/20 dark:via-[#6bc500]/10 dark:to-[#8fd400]/20 p-6 rounded-2xl border border-[#5cb800]/40 dark:border-[#5cb800]/30 shadow-lg">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Estadísticas de Evaluación
            </h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-[#5cb800]/20 to-[#8fd400]/30 dark:from-[#5cb800]/30 dark:to-[#8fd400]/20 p-4 rounded-xl border border-[#5cb800]/60 dark:border-[#5cb800]/40 shadow-lg text-center">
                <div className="text-2xl font-bold text-[#5cb800] dark:text-[#8fd400]">
                  {previewData.items.filter((item: any) => item.completed === true).length}
                </div>
                <div className="text-sm font-bold text-[#5cb800] dark:text-[#8fd400] uppercase tracking-wide">Cumple</div>
              </div>
              <div className="bg-gradient-to-br from-red-100/50 to-red-200/50 dark:from-red-900/20 dark:to-red-800/20 p-4 rounded-xl border border-red-500/60 dark:border-red-500/40 shadow-lg text-center">
                <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {previewData.items.filter((item: any) => item.completed === false).length}
                </div>
                <div className="text-sm font-bold text-red-600 dark:text-red-400 uppercase tracking-wide">No Cumple</div>
              </div>
              <div className="bg-gradient-to-br from-gray-100 to-slate-200 dark:from-gray-800/40 dark:to-slate-700/30 p-4 rounded-xl border border-gray-300/60 dark:border-gray-600/40 shadow-lg text-center">
                <div className="text-2xl font-bold text-gray-600 dark:text-gray-400">
                  {previewData.items.filter((item: any) => item.completed === null).length}
                </div>
                <div className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">Sin Evaluar</div>
              </div>
              <div className="bg-gradient-to-br from-[#5cb800]/20 to-[#8fd400]/30 dark:from-[#5cb800]/30 dark:to-[#8fd400]/20 p-4 rounded-xl border border-[#5cb800]/60 dark:border-[#5cb800]/40 shadow-lg text-center">
                <div className="text-2xl font-bold text-[#5cb800] dark:text-[#8fd400]">
                  {previewData.items.filter((item: any) => item.observations && item.observations.trim()).length}
                </div>
                <div className="text-sm font-bold text-[#5cb800] dark:text-[#8fd400] uppercase tracking-wide">Con Observaciones</div>
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-6">
            <button
              onClick={onBackToEdit}
              className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-gray-500 via-gray-600 to-gray-700 hover:from-gray-600 hover:via-gray-700 hover:to-gray-800 text-white rounded-xl transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Edit className="w-5 h-5" />
              Volver a Editar
            </button>
            <button
              onClick={onFinalSave}
              className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-[#5cb800] via-[#6bc500] to-[#8fd400] dark:from-shadowBlue dark:via-darkBlue dark:to-shadowBlue hover:from-[#4a9600] hover:via-[#5ba400] hover:to-[#7bc300] text-white rounded-xl transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Save className="w-5 h-5" />
              Guardar Definitivamente
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

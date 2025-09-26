import React from 'react';
import { X, Edit, Save } from "lucide-react";
import { PreviewModalProps } from './types';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 transition-all duration-300 ease-out">
      <div className="bg-gradient-to-br from-white via-white to-gray-50 dark:from-shadowBlue dark:via-shadowBlue dark:to-darkBlue rounded-3xl shadow-2xl w-full max-w-7xl h-[95vh] flex flex-col border border-gray-200/80 dark:border-shadowBlue/60 transform transition-all duration-500 ease-out">
        {/* Header del modal mejorado */}
        <div className="flex items-center justify-between p-8 pb-6 border-b border-gray-200/60 dark:border-shadowBlue/50 bg-gradient-to-r from-transparent to-gray-50/50 dark:to-darkBlue/30 flex-shrink-0">
          <div className="flex items-center space-x-4">
            <div className="h-10 w-2 rounded-full bg-gradient-to-b from-[#5cb800] to-[#8fd400] dark:from-shadowBlue dark:to-darkBlue"></div>
            <div>
              <h2 className="text-3xl font-bold text-darkBlue dark:text-white flex items-center space-x-3 tracking-tight">
                <span className="text-4xl"></span>
                <span>Vista Previa - Lista de Chequeo</span>
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Revise la información antes de guardar definitivamente</p>
            </div>
          </div>
          <button
            onClick={onBackToEdit}
            className="group relative rounded-2xl p-3 transition-all duration-300 bg-gray-100/80 dark:bg-shadowBlue/70 hover:bg-gray-200 dark:hover:bg-darkBlue/80 hover:shadow-lg transform hover:scale-105 active:scale-95 flex-shrink-0"
          >
            <X className="w-8 h-8 text-gray-500 dark:text-gray-300 group-hover:text-gray-700 dark:group-hover:text-white group-hover:rotate-90 transition-all duration-300" />
          </button>
        </div>

        {/* Contenido scrolleable */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          <div className="p-8 space-y-8">
            {/* Información del checklist mejorada */}
            <div className="bg-gradient-to-br from-[#5cb800]/10 via-[#6bc500]/5 to-[#8fd400]/10 dark:from-[#5cb800]/20 dark:via-[#6bc500]/10 dark:to-[#8fd400]/20 p-8 rounded-3xl border border-[#5cb800]/40 dark:border-[#5cb800]/30 shadow-lg hover:shadow-xl transition-all duration-300">
              <h3 className="text-2xl font-bold text-darkBlue dark:text-white mb-6 flex items-center gap-3">
                <span>Información de la Lista</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/70 dark:bg-[#5cb800]/10 p-4 rounded-2xl border border-[#5cb800]/30 dark:border-[#5cb800]/20">
                  <span className="font-bold text-darkBlue dark:text-[#8fd400] text-sm uppercase tracking-wide">ID:</span>
                  <div className="text-xl font-bold text-[#5cb800] dark:text-[#8fd400] mt-1">{previewData.checklist.id}</div>
                </div>
                <div className="bg-white/70 dark:bg-[#5cb800]/10 p-4 rounded-2xl border border-[#5cb800]/30 dark:border-[#5cb800]/20">
                  <span className="font-bold text-darkBlue dark:text-[#8fd400] text-sm uppercase tracking-wide">Trimestre:</span>
                  <div className="text-xl font-bold text-[#5cb800] dark:text-[#8fd400] mt-1">{previewData.checklist.trimester || 'N/A'}</div>
                </div>
                <div className="bg-white/70 dark:bg-[#5cb800]/10 p-4 rounded-2xl border border-[#5cb800]/30 dark:border-[#5cb800]/20">
                  <span className="font-bold text-darkBlue dark:text-[#8fd400] text-sm uppercase tracking-wide">Componente:</span>
                  <div className="text-xl font-bold text-[#5cb800] dark:text-[#8fd400] mt-1">{previewData.checklist.component || 'N/A'}</div>
                </div>
              </div>
            </div>

            {/* Items del checklist mejorados */}
            <div className="bg-gradient-to-br from-white via-gray-50 to-white dark:from-shadowBlue/40 dark:via-darkBlue/30 dark:to-shadowBlue/40 border border-gray-200/60 dark:border-shadowBlue/50 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300">
              <div className="bg-gradient-to-r from-[#5cb800] via-[#6bc500] to-[#8fd400] dark:from-shadowBlue dark:via-darkBlue dark:to-shadowBlue p-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>
                <h3 className="text-2xl font-bold text-white flex items-center gap-3 relative z-10">
                  <span>Items Evaluados ({previewData.items.length})</span>
                </h3>
              </div>
              <div className="p-6">
                <div className="space-y-6">
                  {previewData.items.map((item: any, index: number) => (
                    <div key={item.id} className={`group p-6 rounded-2xl border-2 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 ${
                      item.completed === true 
                        ? 'border-green-500/60 bg-gradient-to-br from-green-100/50 via-green-50/50 to-green-100/50 dark:border-green-500/40 dark:from-green-900/20 dark:via-green-800/10 dark:to-green-900/20' 
                        : item.completed === false 
                          ? 'border-red-500/60 bg-gradient-to-br from-red-100/50 via-red-50/50 to-red-100/50 dark:border-red-500/40 dark:from-red-900/20 dark:via-red-800/10 dark:to-red-900/20'
                          : 'border-gray-300/60 bg-gradient-to-br from-gray-50 via-slate-50 to-gray-100 dark:border-gray-600/40 dark:from-gray-800/40 dark:via-slate-800/30 dark:to-gray-700/40'
                    }`}>
                      <div className="flex items-start gap-6">
                        <div className="flex-shrink-0">
                          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg transform transition-all duration-300 group-hover:scale-110 ${
                            item.completed === true 
                              ? 'bg-gradient-to-br from-green-500 to-green-600 shadow-green-500/30' 
                              : item.completed === false 
                                ? 'bg-gradient-to-br from-red-500 to-red-600 shadow-red-500/30'
                                : 'bg-gradient-to-br from-gray-400 to-slate-500 shadow-gray-500/30'
                          }`}>
                            {item.completed === true ? '✓' : item.completed === false ? '✗' : '?'}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-3 mb-3">
                            <span className="font-bold text-darkBlue dark:text-white text-lg">Item {item.id}</span>
                            <span className={`px-4 py-2 rounded-full text-sm font-bold shadow-md transition-all duration-300 ${
                              item.completed === true 
                                ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-green-500/30' 
                                : item.completed === false 
                                  ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-red-500/30'
                                  : 'bg-gradient-to-r from-gray-400 to-slate-500 text-white shadow-gray-500/30'
                            }`}>
                              {item.completed === true ? 'CUMPLE' : item.completed === false ? 'NO CUMPLE' : 'SIN EVALUAR'}
                            </span>
                          </div>
                          <p className="text-darkBlue dark:text-gray-200 mb-4 text-base leading-relaxed font-medium">{item.indicator}</p>
                          {item.observations && (
                            <div className="bg-white/80 dark:bg-[#5cb800]/5 p-4 rounded-2xl border border-gray-200/60 dark:border-[#5cb800]/20 backdrop-blur-sm">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="font-bold text-darkBlue dark:text-white text-sm uppercase tracking-wide">Observaciones</span>
                              </div>
                              <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{item.observations}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Evaluación mejorada (si existe) */}
            {previewData.hasEvaluationData && (
              <div className="bg-gradient-to-br from-[#5cb800]/10 via-[#6bc500]/5 to-[#8fd400]/10 dark:from-[#5cb800]/20 dark:via-[#6bc500]/10 dark:to-[#8fd400]/20 p-8 rounded-3xl border border-[#5cb800]/40 dark:border-[#5cb800]/30 shadow-lg hover:shadow-xl transition-all duration-300">
                <h3 className="text-2xl font-bold text-darkBlue dark:text-white mb-6 flex items-center gap-3">
                  <span>Evaluación</span>
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-1">
                    <div className="bg-white/80 dark:bg-[#5cb800]/10 p-6 rounded-2xl border border-[#5cb800]/30 dark:border-[#5cb800]/20 h-full">
                      <div className="flex items-center gap-3 mb-4">
                        <h4 className="font-bold text-darkBlue dark:text-[#8fd400] text-lg">Observaciones</h4>
                      </div>
                      <div className="bg-gradient-to-br from-gray-50 to-white dark:from-[#5cb800]/5 dark:to-[#8fd400]/5 p-4 rounded-2xl border border-gray-200/60 dark:border-[#5cb800]/20 min-h-[120px]">
                        <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed break-words whitespace-pre-wrap">
                          {previewData.evaluation.observations || 'Sin observaciones'}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="lg:col-span-1">
                    <div className="bg-white/80 dark:bg-[#5cb800]/10 p-6 rounded-2xl border border-[#5cb800]/30 dark:border-[#5cb800]/20 h-full">
                      <div className="flex items-center gap-3 mb-4">
                        <h4 className="font-bold text-darkBlue dark:text-[#8fd400] text-lg">Recomendaciones</h4>
                      </div>
                      <div className="bg-gradient-to-br from-gray-50 to-white dark:from-[#5cb800]/5 dark:to-[#8fd400]/5 p-4 rounded-2xl border border-gray-200/60 dark:border-[#5cb800]/20 min-h-[120px]">
                        <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed break-words whitespace-pre-wrap">
                          {previewData.evaluation.recommendations || 'Sin recomendaciones'}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="lg:col-span-1">
                    <div className="bg-white/80 dark:bg-[#5cb800]/10 p-6 rounded-2xl border border-[#5cb800]/30 dark:border-[#5cb800]/20 h-full">
                      <div className="flex items-center gap-3 mb-4">
                        <h4 className="font-bold text-darkBlue dark:text-[#8fd400] text-lg">Juicio de Valor</h4>
                      </div>
                      <div className="bg-gradient-to-br from-gray-50 to-white dark:from-[#5cb800]/5 dark:to-[#8fd400]/5 p-4 rounded-2xl border border-gray-200/60 dark:border-[#5cb800]/20 min-h-[120px] flex items-center justify-center">
                        <span className={`inline-flex px-6 py-4 rounded-2xl text-lg font-bold shadow-lg transform transition-all duration-300 hover:scale-105 ${
                          previewData.evaluation.judgment === 'EXCELENTE' ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-green-500/30' :
                          previewData.evaluation.judgment === 'BUENO' ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-green-500/30' :
                          previewData.evaluation.judgment === 'ACEPTABLE' ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-green-500/30' :
                          previewData.evaluation.judgment === 'DEFICIENTE' ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-red-500/30' :
                          previewData.evaluation.judgment === 'RECHAZADO' ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-red-500/30' :
                          'bg-gradient-to-r from-gray-500 to-slate-600 text-white shadow-gray-500/30'
                        }`}>
                          {previewData.evaluation.judgment || 'PENDIENTE'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Estadísticas mejoradas */}
            <div className="bg-gradient-to-br from-[#5cb800]/10 via-[#6bc500]/5 to-[#8fd400]/10 dark:from-[#5cb800]/20 dark:via-[#6bc500]/10 dark:to-[#8fd400]/20 p-8 rounded-3xl border border-[#5cb800]/40 dark:border-[#5cb800]/30 shadow-lg hover:shadow-xl transition-all duration-300">
              <h3 className="text-2xl font-bold text-darkBlue dark:text-white mb-6 flex items-center gap-3">
                <span>Estadísticas de Evaluación</span>
              </h3>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-[#5cb800]/20 to-[#8fd400]/30 dark:from-[#5cb800]/30 dark:to-[#8fd400]/20 p-6 rounded-2xl border border-[#5cb800]/60 dark:border-[#5cb800]/40 shadow-lg hover:shadow-xl transition-all duration-300 group">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#5cb800] to-[#8fd400] rounded-xl flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold">✓</span>
                    </div>
                    <div className="text-3xl font-bold text-[#5cb800] dark:text-[#8fd400] group-hover:scale-110 transition-transform duration-300">
                      {previewData.items.filter((item: any) => item.completed === true).length}
                    </div>
                  </div>
                  <div className="text-sm font-bold text-[#5cb800] dark:text-[#8fd400] uppercase tracking-wide">Cumple</div>
                  <div className="text-xs text-[#5cb800]/80 dark:text-[#8fd400]/80 mt-1">Items aprobados</div>
                </div>
                <div className="bg-gradient-to-br from-red-100/50 to-red-200/50 dark:from-red-900/20 dark:to-red-800/20 p-6 rounded-2xl border border-red-500/60 dark:border-red-500/40 shadow-lg hover:shadow-xl transition-all duration-300 group">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold">✗</span>
                    </div>
                    <div className="text-3xl font-bold text-red-600 dark:text-red-400 group-hover:scale-110 transition-transform duration-300">
                      {previewData.items.filter((item: any) => item.completed === false).length}
                    </div>
                  </div>
                  <div className="text-sm font-bold text-red-600 dark:text-red-400 uppercase tracking-wide">No Cumple</div>
                  <div className="text-xs text-red-600/80 dark:text-red-400/80 mt-1">Items reprobados</div>
                </div>
                <div className="bg-gradient-to-br from-gray-100 to-slate-200 dark:from-gray-800/40 dark:to-slate-700/30 p-6 rounded-2xl border border-gray-300/60 dark:border-gray-600/40 shadow-lg hover:shadow-xl transition-all duration-300 group">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-gray-500 to-slate-600 rounded-xl flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold">?</span>
                    </div>
                    <div className="text-3xl font-bold text-gray-600 dark:text-gray-400 group-hover:scale-110 transition-transform duration-300">
                      {previewData.items.filter((item: any) => item.completed === null).length}
                    </div>
                  </div>
                  <div className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">Sin Evaluar</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Items pendientes</div>
                </div>
                <div className="bg-gradient-to-br from-[#5cb800]/20 to-[#8fd400]/30 dark:from-[#5cb800]/30 dark:to-[#8fd400]/20 p-6 rounded-2xl border border-[#5cb800]/60 dark:border-[#5cb800]/40 shadow-lg hover:shadow-xl transition-all duration-300 group">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#5cb800] to-[#8fd400] rounded-xl flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold"></span>
                    </div>
                    <div className="text-3xl font-bold text-[#5cb800] dark:text-[#8fd400] group-hover:scale-110 transition-transform duration-300">
                      {previewData.items.filter((item: any) => item.observations && item.observations.trim()).length}
                    </div>
                  </div>
                  <div className="text-sm font-bold text-[#5cb800] dark:text-[#8fd400] uppercase tracking-wide">Con Observaciones</div>
                  <div className="text-xs text-[#5cb800]/80 dark:text-[#8fd400]/80 mt-1">Items comentados</div>
                </div>
              </div>
            </div>

            {/* Botones de acción mejorados */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-6 pt-8">
              <button
                onClick={onBackToEdit}
                className="group px-10 py-5 bg-gradient-to-r from-gray-500 via-gray-600 to-gray-700 hover:from-gray-600 hover:via-gray-700 hover:to-gray-800 text-white rounded-3xl transition-all duration-300 flex items-center space-x-4 font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 active:scale-95 border border-gray-400/30"
              >
                <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center group-hover:bg-white/30 transition-all duration-300">
                  <Edit className="w-5 h-5" />
                </div>
                <span>Volver a Editar</span>
              </button>
              <button
                onClick={onFinalSave}
                className="group px-10 py-5 bg-gradient-to-r from-[#5cb800] via-[#6bc500] to-[#8fd400] dark:from-shadowBlue dark:via-darkBlue dark:to-shadowBlue hover:from-[#4a9600] hover:via-[#5ba400] hover:to-[#7bc300] dark:hover:from-darkBlue dark:hover:via-shadowBlue dark:hover:to-darkBlue text-white rounded-3xl transition-all duration-300 flex items-center space-x-4 font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 active:scale-95 border border-green-400/30 dark:border-shadowBlue/50"
              >
                <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center group-hover:bg-white/30 transition-all duration-300">
                  <Save className="w-5 h-5" />
                </div>
                <span>Guardar Definitivamente</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { Save, Edit, X, ArrowLeft } from "lucide-react";
import { EvaluationSectionProps } from './types';

export const EvaluationSection: React.FC<EvaluationSectionProps> = ({
  selectedChecklist,
  selectedEvaluation,
  showEvaluationForm,
  evaluationObservations,
  evaluationRecommendations,
  evaluationJudgment,
  evaluationCriteria,
  isFinalSaved,
  onUpdateClick,
  onCancelUpdate,
  onCompleteEvaluation,
  onCreateEvaluation,
  onFieldChange,
  extractGeneralObservationsFromEvaluation
}) => {
  if (!selectedChecklist) return null;

  return (
    <div className="mt-12 relative">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="bg-gradient-to-r from-[#5cb800] to-[#8fd400] dark:from-shadowBlue dark:to-darkBlue px-6 py-4">
          <h3 className="text-2xl font-bold text-white text-center">
            Evaluación de lista de chequeo
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <div className="min-w-full">
            {selectedEvaluation ? (
              // Vista cuando hay evaluación existente
              showEvaluationForm ? (
                // Mostrar formulario de actualización en formato tabla
                <div>
                  {/* Estado de la evaluación */}
                  <div className="bg-gradient-to-r from-blue-100 to-blue-50 dark:from-blue-800 dark:to-blue-900/50 px-6 py-4 border-b border-gray-200 dark:border-gray-600">
                    <p className="text-blue-800 dark:text-blue-200 text-center font-medium">
                      <strong>Actualizar evaluación:</strong> Modifique los campos que desee cambiar
                    </p>
                  </div>

                  {/* Headers de la tabla */}
                  <div className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                    <div className="grid grid-cols-12 gap-4 px-6 py-5 text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      <div className="col-span-4 text-left">OBSERVACIONES</div>
                      <div className="col-span-4 text-left">RECOMENDACIONES</div>
                      <div className="col-span-2 text-center">JUICIO DE VALOR</div>
                      <div className="col-span-2 text-center">ACCIONES</div>
                    </div>
                  </div>

                  {/* Contenido de la tabla */}
                  <div className="px-6 py-5 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200">
                    <div className="grid grid-cols-12 gap-4 items-start">
                      {/* OBSERVACIONES */}
                      <div className="col-span-4">
                        <textarea
                          value={evaluationObservations}
                          onChange={(e) => onFieldChange('observations', e.target.value)}
                          disabled={isFinalSaved}
                          className={`w-full px-4 py-3 text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none break-words whitespace-pre-wrap ${
                            isFinalSaved ? 'opacity-50 cursor-not-allowed' : 'focus:ring-2 focus:ring-[#5cb800] dark:focus:ring-shadowBlue focus:border-[#5cb800] dark:focus:border-shadowBlue'
                          }`}
                          style={{ overflowWrap: 'anywhere' }}
                          rows={4}
                          placeholder={isFinalSaved ? "Evaluación guardada definitivamente" : "Ingrese sus observaciones generales..."}
                          required
                        />
                      </div>

                      {/* RECOMENDACIONES */}
                      <div className="col-span-4">
                        <textarea
                          value={evaluationRecommendations}
                          onChange={(e) => onFieldChange('recommendations', e.target.value)}
                          disabled={isFinalSaved}
                          className={`w-full px-4 py-3 text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none break-words whitespace-pre-wrap ${
                            isFinalSaved ? 'opacity-50 cursor-not-allowed' : 'focus:ring-2 focus:ring-[#5cb800] dark:focus:ring-shadowBlue focus:border-[#5cb800] dark:focus:border-shadowBlue'
                          }`}
                          style={{ overflowWrap: 'anywhere' }}
                          rows={4}
                          placeholder={isFinalSaved ? "Evaluación guardada definitivamente" : "Ingrese sus recomendaciones..."}
                          required
                        />
                      </div>

                      {/* JUICIO DE VALOR */}
                      <div className="col-span-2 flex items-center justify-center">
                        <select
                          value={evaluationJudgment}
                          onChange={(e) => onFieldChange('judgment', e.target.value)}
                          disabled={isFinalSaved}
                          className={`w-full px-4 py-3 text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-medium ${
                            isFinalSaved ? 'opacity-50 cursor-not-allowed' : 'focus:ring-2 focus:ring-[#5cb800] dark:focus:ring-shadowBlue focus:border-[#5cb800] dark:focus:border-shadowBlue'
                          }`}
                          required
                        >
                          <option value="">Seleccionar...</option>
                          <option value="APROBADO">Aprobado</option>
                          <option value="NO APROBADO">No aprobado</option>
                        </select>
                      </div>

                      {/* ACCIONES */}
                      <div className="col-span-2 flex flex-col items-center justify-center space-y-2">
                        <button
                          onClick={onCancelUpdate}
                          disabled={isFinalSaved}
                          className={`w-full px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 text-sm font-medium ${
                            isFinalSaved ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                        >
                          <X className="w-4 h-4" />
                          <span>Cancelar</span>
                        </button>
                        <button
                          onClick={onCompleteEvaluation}
                          disabled={isFinalSaved || !evaluationObservations?.trim() || !evaluationRecommendations?.trim() || !evaluationJudgment || evaluationJudgment === "PENDIENTE"}
                          className={`w-full px-4 py-2 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 text-sm font-medium ${(isFinalSaved || !evaluationObservations?.trim() || !evaluationRecommendations?.trim() || !evaluationJudgment || evaluationJudgment === "PENDIENTE")
                              ? 'bg-gray-400 cursor-not-allowed text-white'
                              : 'bg-gradient-to-r from-[#5cb800] to-[#8fd400] dark:from-shadowBlue dark:to-darkBlue hover:from-[#4a9600] hover:to-[#7bc300] dark:hover:from-darkBlue dark:hover:to-shadowBlue text-white'
                            }`}
                        >
                          <Save className="w-4 h-4" />
                          <span>{isFinalSaved ? 'Guardado' : 'Guardar'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                // Mostrar vista de evaluación completada en formato tabla
                <div>
                  {/* Estado de la evaluación */}
                  <div className="bg-gradient-to-r from-blue-100 to-blue-50 dark:from-blue-800 dark:to-blue-900/50 px-6 py-4 border-b border-gray-200 dark:border-gray-600">
                    <p className="text-blue-800 dark:text-blue-200 text-center font-medium flex items-center justify-center gap-2">
                      <span className="text-2xl"></span>
                      <strong>Evaluación completada</strong>
                    </p>
                  </div>

                  {/* Headers de la tabla */}
                  <div className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                    <div className="grid grid-cols-12 gap-4 px-6 py-5 text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      <div className="col-span-4 text-left">OBSERVACIONES</div>
                      <div className="col-span-4 text-left">RECOMENDACIONES</div>
                      <div className="col-span-2 text-center">JUICIO DE VALOR</div>
                      <div className="col-span-2 text-center">ACCIONES</div>
                    </div>
                  </div>

                  {/* Contenido de la tabla */}
                  <div className="px-6 py-5 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200">
                    <div className="grid grid-cols-12 gap-4 items-start">
                      {/* OBSERVACIONES */}
                      <div className="col-span-4">
                        <div className="bg-white dark:bg-gray-700 p-4 rounded-lg border border-gray-300 dark:border-gray-600">
                          <p className="text-base text-gray-900 dark:text-white leading-relaxed break-words whitespace-pre-wrap overflow-wrap-anywhere evaluation-text">
                            {selectedEvaluation ? extractGeneralObservationsFromEvaluation(selectedEvaluation) || "Sin observaciones" : "Sin observaciones"}
                          </p>
                        </div>
                      </div>

                      {/* RECOMENDACIONES */}
                      <div className="col-span-4">
                        <div className="bg-white dark:bg-gray-700 p-4 rounded-lg border border-gray-300 dark:border-gray-600">
                          <p className="text-base text-gray-900 dark:text-white leading-relaxed break-words whitespace-pre-wrap overflow-wrap-anywhere evaluation-text">
                            {selectedEvaluation.recommendations || "Sin recomendaciones"}
                          </p>
                        </div>
                      </div>

                      {/* JUICIO DE VALOR */}
                      <div className="col-span-2 flex items-center justify-center">
                        <span className={`inline-flex px-4 py-2 rounded-full text-sm font-bold shadow-lg ${
                          selectedEvaluation.valueJudgment === 'APROBADO' ? 'bg-gradient-to-r from-[#5cb800] to-[#8fd400] text-white' :
                          selectedEvaluation.valueJudgment === 'NO APROBADO' ? 'bg-gradient-to-r from-red-500 to-red-600 text-white' :
                          selectedEvaluation.valueJudgment === 'PENDIENTE' ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white' :
                          'bg-gradient-to-r from-gray-500 to-gray-600 text-white'
                        }`}>
                          {selectedEvaluation.valueJudgment || "PENDIENTE"}
                        </span>
                      </div>

                      {/* ACCIONES */}
                      <div className="col-span-2 flex items-center justify-center">
                        <button
                          onClick={onUpdateClick}
                          disabled={isFinalSaved}
                          className={`px-4 py-2 bg-gradient-to-r from-[#5cb800] to-[#8fd400] dark:from-shadowBlue dark:to-darkBlue hover:from-[#4a9600] hover:to-[#7bc300] dark:hover:from-darkBlue dark:hover:to-shadowBlue text-white rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 text-sm font-medium ${
                            isFinalSaved ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                        >
                          <Edit className="w-4 h-4" />
                          <span>{isFinalSaved ? 'Guardada' : 'Actualizar'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            ) : (
              // Vista cuando no hay evaluación
              <div>
                {/* Headers de la tabla */}
                <div className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                  <div className="grid grid-cols-12 gap-4 px-6 py-5 text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    <div className="col-span-12 text-center">EVALUACIÓN PENDIENTE</div>
                  </div>
                </div>

                {/* Contenido de la tabla */}
                <div className="px-6 py-8 text-center">
                  <div className="space-y-6">
                  
                    <h4 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Esta lista no tiene evaluación
                    </h4>
                    <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
                      Complete los campos para establecer la evaluación final.
                    </p>

                    {/* Botón principal para crear evaluación */}
                    <button
                      onClick={onCreateEvaluation}
                      disabled={isFinalSaved}
                      className={`px-8 py-4 bg-gradient-to-r from-[#5cb800] to-[#8fd400] dark:from-shadowBlue dark:to-darkBlue hover:from-[#4a9600] hover:to-[#7bc300] dark:hover:from-darkBlue dark:hover:to-shadowBlue text-white rounded-lg transition-all duration-300 flex items-center space-x-3 mx-auto font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 ${
                        isFinalSaved ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      <Save className="w-6 h-6" />
                      <span>{isFinalSaved ? 'Evaluación Guardada' : 'Crear Evaluación'}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

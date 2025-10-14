import React from 'react';
import { Save, X } from "lucide-react";
import Modal from "@components/UI/Modal";
import { Card } from "@components/UI/Card";
import { CreateEvaluationModalProps } from './types';

export const CreateEvaluationModal: React.FC<CreateEvaluationModalProps> = ({
  showModal,
  selectedChecklist,
  evaluationObservations,
  evaluationRecommendations,
  evaluationJudgment,
  isFinalSaved,
  isCreating,
  onClose,
  onCreate,
  onFieldChange
}) => {
  return (
    <Modal
      isOpen={showModal}
      onClose={onClose}
      title="Crear Evaluación"
      size="xxl"
    >
      {/* Información del checklist con diseño moderno */}
      <Card
        header={<h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">📋 Lista de Chequeo: {selectedChecklist?.trimester ? `Trimestre ${selectedChecklist.trimester}` : 'Sin trimestre'}</h3>}
        body={<p className="text-gray-700 dark:text-gray-300 text-sm">Complete los siguientes campos para crear la evaluación de esta lista de chequeo.</p>}
        className="mb-6"
      />

      {/* Formulario de evaluación con diseño moderno */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="space-y-4">
          <label className="block text-lg font-semibold text-darkBlue dark:text-white mb-2">
            <span className="flex items-center gap-2">
              📝 Observaciones: <span className="text-red-500">*</span>
            </span>
          </label>
          <textarea
            value={evaluationObservations}
            onChange={(e) => onFieldChange('observations', e.target.value)}
            disabled={isFinalSaved || isCreating}
            className={`w-full px-4 py-4 border-2 border-darkBlue dark:border-gray-600 rounded-2xl focus:ring-4 focus:ring-[#5cb800]/30 dark:focus:ring-shadowBlue/30 focus:border-[#5cb800] dark:focus:border-shadowBlue bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 text-darkBlue dark:text-white shadow-inner transition-all duration-300 resize-vertical break-words overflow-wrap-anywhere ${
              isFinalSaved || isCreating ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            rows={4}
            placeholder="Describa sus observaciones sobre la lista de chequeo..."
            style={{
              wordWrap: 'break-word',
              overflowWrap: 'break-word',
              whiteSpace: 'pre-wrap'
            }}
          />
        </div>

        <div className="space-y-4">
          <label className="block text-lg font-semibold text-darkBlue dark:text-white mb-2">
            <span className="flex items-center gap-2">
              💡 Recomendaciones: <span className="text-red-500">*</span>
            </span>
          </label>
          <textarea
            value={evaluationRecommendations}
            onChange={(e) => onFieldChange('recommendations', e.target.value)}
            disabled={isCreating}
            className="w-full px-4 py-4 border-2 border-darkBlue dark:border-gray-600 rounded-2xl focus:ring-4 focus:ring-[#5cb800]/30 dark:focus:ring-shadowBlue/30 focus:border-[#5cb800] dark:focus:border-shadowBlue bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 text-darkBlue dark:text-white shadow-inner transition-all duration-300 resize-vertical break-words overflow-wrap-anywhere"
            rows={4}
            placeholder="Agregue sus recomendaciones..."
            style={{
              wordWrap: 'break-word',
              overflowWrap: 'break-word',
              whiteSpace: 'pre-wrap'
            }}
          />
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-lg font-semibold text-darkBlue dark:text-white mb-4">
          <span className="flex items-center gap-2">
            ⚖️ Juicio de Valor: <span className="text-red-500">*</span>
          </span>
        </label>
        <select
          value={evaluationJudgment}
          onChange={(e) => onFieldChange('judgment', e.target.value)}
          disabled={isCreating}
          className="w-full px-6 py-4 border-2 border-darkBlue dark:border-gray-600 rounded-2xl focus:ring-4 focus:ring-[#5cb800]/30 dark:focus:ring-shadowBlue/30 focus:border-[#5cb800] dark:focus:border-shadowBlue bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 text-darkBlue dark:text-white font-semibold text-lg shadow-inner transition-all duration-300"
        >
          <option value="">Seleccione un juicio de valor</option>
          <option value="APROBADO">Aprobado</option>
          <option value="NO APROBADO">No Aprobado</option>
        </select>
      </div>

      {/* Indicador de progreso con diseño moderno */}
      <Card
        header={<h4 className="font-semibold text-gray-900 dark:text-gray-100">📊 Progreso de Evaluación</h4>}
        body={
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3 p-3 rounded-xl bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30">
              <div className={`w-4 h-4 rounded-full ${evaluationObservations?.trim() ? 'bg-green-500' : 'bg-gray-300'} transition-colors duration-300`}></div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Observaciones</span>
              {evaluationObservations?.trim() && <span className="text-green-500">✓</span>}
            </div>
            <div className="flex items-center space-x-3 p-3 rounded-xl bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30">
              <div className={`w-4 h-4 rounded-full ${evaluationRecommendations?.trim() ? 'bg-green-500' : 'bg-gray-300'} transition-colors duration-300`}></div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Recomendaciones</span>
              {evaluationRecommendations?.trim() && <span className="text-green-500">✓</span>}
            </div>
            <div className="flex items-center space-x-3 p-3 rounded-xl bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30">
              <div className={`w-4 h-4 rounded-full ${evaluationJudgment && evaluationJudgment !== '' ? 'bg-green-500' : 'bg-gray-300'} transition-colors duration-300`}></div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Juicio de Valor</span>
              {evaluationJudgment && evaluationJudgment !== '' && <span className="text-green-500">✓</span>}
            </div>
          </div>
        }
        className="mb-6"
      />

      {/* Botones de acción con diseño moderno */}
      <div className="flex justify-center space-x-6 mt-8">
        <button
          onClick={onClose}
          disabled={isCreating}
          className={`px-8 py-4 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white rounded-2xl transition-all duration-300 flex items-center space-x-3 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 ${
            isCreating ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <X className="w-5 h-5" />
          <span>Cancelar</span>
        </button>
        <button
          onClick={onCreate}
          disabled={isCreating || !evaluationObservations?.trim() || !evaluationRecommendations?.trim() || !evaluationJudgment}
          className={`px-8 py-4 rounded-2xl transition-all duration-300 flex items-center space-x-3 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 ${(isCreating || !evaluationObservations?.trim() || !evaluationRecommendations?.trim() || !evaluationJudgment)
              ? 'bg-gray-400 cursor-not-allowed text-white'
              : 'bg-gradient-to-r from-[#5cb800] to-[#8fd400] dark:from-shadowBlue dark:to-darkBlue hover:from-[#4a9600] hover:to-[#7bc300] dark:hover:from-darkBlue dark:hover:to-shadowBlue text-white'
            }`}
        >
          {isCreating ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Creando...</span>
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              <span>Crear Evaluación</span>
            </>
          )}
        </button>
      </div>
    </Modal>
  );
};

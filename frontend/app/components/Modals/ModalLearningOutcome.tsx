"use client";

import React from "react";
import { BookOpen, ArrowRight } from "lucide-react";
import Modal from "@components/UI/Modal";

interface LearningOutcome {
  id: string;
  name: string;
  description?: string;
  code?: number;
}

interface ModalLearningOutcomeProps {
  isOpen: boolean;
  onClose: () => void;
  competenceName: string;
  learningOutcomes: LearningOutcome[];
  loading?: boolean;
  onSelectLearningOutcome: (learningOutcomeId: string) => void;
}

const ModalLearningOutcome: React.FC<ModalLearningOutcomeProps> = ({
  isOpen,
  onClose,
  competenceName,
  learningOutcomes,
  loading = false,
  onSelectLearningOutcome,
}) => {

  const handleLearningOutcomeSelect = (learningOutcome: LearningOutcome) => {
    onSelectLearningOutcome(learningOutcome.id);
    onClose();
  };

  const renderLearningOutcomeCard = (learningOutcome: LearningOutcome) => (
    <div
      key={learningOutcome.id}
      onClick={() => handleLearningOutcomeSelect(learningOutcome)}
      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-lg hover:scale-100 -pcursorointer transition-all duration-300 group"
    >
      <div className="flex items-start justify-between mb-3">
        <BookOpen className="h-5 w-5 text-primary dark:text-secondary group-hover:scale-110 transition-transform duration-200 mt-1" />
        {learningOutcome.code && (
          <span className="text-xs bg-primary/10 dark:bg-secondary/10 text-primary dark:text-secondary px-2 py-1 rounded-full">
            Código: {learningOutcome.code}
          </span>
        )}
      </div>
      
      <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 group-hover:text-primary dark:group-hover:text-secondary transition-colors duration-200 mb-2">
        {learningOutcome.name}
      </h4>
      
      {learningOutcome.description && (
        <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
          {learningOutcome.description}
        </p>
      )}
      
      <div className="flex items-center justify-end">
        <span className="text-xs text-primary dark:text-secondary group-hover:translate-x-1 transition-transform duration-200 flex items-center gap-1">
          Ver justificaciones
          <ArrowRight className="h-3 w-3" />
        </span>
      </div>
    </div>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <div className="space-y-6">
        {/* Header */}
        <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Resultados de Aprendizaje
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Competencia: <span className="font-medium">{competenceName}</span>
          </p>
        </div>

        {/* Content */}
        <div className="space-y-4">
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary dark:border-secondary"></div>
              <span className="ml-3 text-gray-600 dark:text-gray-400">
                Cargando resultados de aprendizaje...
              </span>
            </div>
          ) : learningOutcomes.length === 0 ? (
            <div className="text-center py-8">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">
                No se encontraron resultados de aprendizaje para esta competencia.
              </p>
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Selecciona un resultado de aprendizaje para ver las justificaciones asociadas:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                {learningOutcomes.map(renderLearningOutcomeCard)}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
          >
            Cancelar
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ModalLearningOutcome;

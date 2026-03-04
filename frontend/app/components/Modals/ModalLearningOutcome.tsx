"use client";

import React from "react";
import { BookOpen, Check } from "lucide-react";
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
      className="relative bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-750 border border-gray-200 dark:border-gray-700 rounded-xl p-5 hover:shadow-xl hover:shadow-primary/10 dark:hover:shadow-secondary/10 hover:scale-[1.02] cursor-pointer transition-all duration-300 group overflow-hidden"
    >
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-full -translate-y-10 translate-x-10 group-hover:scale-110 transition-transform duration-300"></div>
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="p-2 bg-primary/10 dark:bg-secondary/10 rounded-lg group-hover:bg-primary/20 dark:group-hover:bg-secondary/20 transition-colors duration-300">
            <BookOpen className="h-5 w-5 text-primary dark:text-secondary group-hover:scale-110 transition-transform duration-200" />
          </div>
          {learningOutcome.code && (
            <span className="text-xs bg-gradient-to-r from-primary to-secondary text-white px-3 py-1 rounded-full font-medium shadow-sm">
              #{learningOutcome.code}
            </span>
          )}
        </div>

        <h4 className="text-base font-bold text-gray-900 dark:text-gray-100 group-hover:text-primary dark:group-hover:text-secondary transition-colors duration-200 mb-3 leading-tight">
          {learningOutcome.name}
        </h4>
        
        {learningOutcome.description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3 leading-relaxed">
            {learningOutcome.description}
          </p>
        )}
        
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500 dark:text-gray-500 uppercase tracking-wide font-medium">
            Resultado de Aprendizaje
          </span>
          <div className="flex items-center gap-2 text-primary dark:text-secondary group-hover:translate-x-1 transition-transform duration-200">
            <span className="text-sm font-semibold">Seleccionar</span>
            <div className="p-1 bg-primary/10 dark:bg-secondary/10 rounded-full group-hover:bg-primary/20 dark:group-hover:bg-secondary/20 transition-colors duration-300">
              <Check className="h-4 w-4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" title={"🎯 Seleccionar Resultado de Aprendizaje"}>
      <div className="space-y-6">
        {/* Competence info */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-lg">
              <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Competencia Seleccionada
              </p>
              <p className="text-sm text-blue-700 dark:text-blue-300 font-semibold">
                {competenceName}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4">
          {loading ? (
            <div className="flex flex-col justify-center items-center py-12">
              <div className="relative">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary/20 dark:border-secondary/20"></div>
                <div className="absolute inset-0 animate-spin rounded-full h-12 w-12 border-4 border-transparent border-t-primary dark:border-t-secondary"></div>
              </div>
              <span className="mt-4 text-gray-600 dark:text-gray-400 font-medium">
                Cargando resultados de aprendizaje...
              </span>
              <div className="mt-2 w-32 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-primary to-secondary animate-pulse"></div>
              </div>
            </div>
          ) : learningOutcomes.length === 0 ? (
            <div className="text-center py-12">
              <div className="relative inline-block">
                <BookOpen className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                  <span className="text-xs text-gray-500 dark:text-gray-400">?</span>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                No hay resultados disponibles
              </h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-sm mx-auto">
                No se encontraron resultados de aprendizaje para la competencia <span className="font-medium text-primary dark:text-secondary">{competenceName}</span>.
              </p>
            </div>
          ) : (
            <>
              <div className="bg-gradient-to-r from-primary/5 to-secondary/5 dark:from-primary/10 dark:to-secondary/10 rounded-lg p-4 border border-primary/10 dark:border-secondary/10">
                <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                  📚 Selecciona el resultado de aprendizaje que mejor se relacione con el plan de mejoramiento:
                </p>
              </div>
              
              <div 
                className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-h-96 overflow-y-auto scrollbar-hide"
                style={{
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                }}
              >
                <style jsx global>{`
                  .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                  }
                `}</style>
                {learningOutcomes.map(renderLearningOutcomeCard)}
              </div>
            </>
          )}
        </div>

        {/* Footer removed: no Cancel button as requested */}
      </div>
    </Modal>
  );
};

export default ModalLearningOutcome;

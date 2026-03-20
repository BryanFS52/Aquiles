import React from 'react';
import { FaUsers, FaUserTie, FaCalendarAlt, FaGraduationCap } from "react-icons/fa";
import { StudySheet } from '@graphql/generated';

interface Teacher {
  id?: string | null;
  collaborator?: {
    person?: {
      name?: string | null;
      lastname?: string | null;
    } | null;
  } | null;
}

interface SheetCardProps {
  sheet: StudySheet;
  teachers: Teacher[];
  selectedInstructor: string;
  onSelectInstructor: (instructorId: string) => void;
  onAssignInstructor: () => void;
}

const SheetCard: React.FC<SheetCardProps> = ({
  sheet,
  teachers,
  selectedInstructor,
  onSelectInstructor,
  onAssignInstructor
}) => {
  // Por ahora no hay instructores asignados en el modelo
  const assignedTeacher = null;
  const teacherName = null;

  return (
    <div className="bg-white dark:bg-shadowBlue rounded-xl sm:rounded-2xl shadow-lg border border-lightGray dark:border-grayText overflow-hidden hover:shadow-xl transition-all duration-300">
      {/* Header de la ficha */}
      <div className="bg-gradient-to-r from-[#5cb800] to-[#8fd400] dark:from-secondary dark:to-blue-900 p-4 sm:p-6 text-white">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
            <div className="bg-white/20 p-2 sm:p-3 rounded-lg sm:rounded-xl flex-shrink-0">
              <FaUsers className="text-xl sm:text-2xl" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-lg sm:text-xl font-bold truncate">Ficha {sheet.number}</h3>
              <p className="text-sm sm:text-base text-white/90 truncate">Programa de formación</p>
            </div>
          </div>
          <div className="text-left sm:text-right w-full sm:w-auto">
            <div className="bg-white/20 px-3 sm:px-4 py-2 rounded-lg inline-flex items-center gap-2">
              <span className="text-2xl sm:text-3xl font-bold">{sheet.numberStudents || 0}</span>
              <p className="text-xs sm:text-sm text-white/90">Aprendices</p>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido de la ficha */}
      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        {/* Información básica */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="flex items-start sm:items-center space-x-3">
            <FaCalendarAlt className="text-gray dark:text-secondary flex-shrink-0 mt-1 sm:mt-0" />
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm font-medium text-darkGray dark:text-gray-300">Número de estudiantes</p>
              <p className="font-semibold text-secondary dark:text-white text-sm sm:text-base">
                {sheet.numberStudents || 0}
              </p>
            </div>
          </div>

          <div className="flex items-start sm:items-center space-x-3">
            <FaGraduationCap className="text-gray dark:text-secondary flex-shrink-0 mt-1 sm:mt-0" />
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm font-medium text-darkGray dark:text-gray-300">Programa</p>
              <p className="font-semibold text-secondary dark:text-white truncate text-sm sm:text-base" title={
                // PARA DATOS MOCK (DESARROLLO) - ACTIVO
                (sheet as any).offer?.program?.name ||
                // PARA DATOS REALES - DESCOMENTAR cuando uses API real ⬇️
                // sheet.trainingProject?.program?.name ||
                'N/A'
              }>
                {/* 🔄 PARA DATOS MOCK (DESARROLLO) - ACTIVO */}
                {(sheet as any).offer?.program?.name ||
                 /* ⬇️ PARA DATOS REALES - DESCOMENTAR cuando uses API real ⬇️ */
                 /* sheet.trainingProject?.program?.name || */
                'N/A'}
              </p>
            </div>
          </div>
        </div>

        {/*
        ===== GUÍA RÁPIDA: CAMBIAR DE DATOS MOCK A DATOS REALES =====
        
        📋 ACTUALMENTE ACTIVO: DATOS MOCK
        ✅ Líneas activas: (sheet as any).offer?.program?.name
        💤 Líneas comentadas: sheet.trainingProject?.program?.name
        
        🔄 PARA CAMBIAR A DATOS REALES:
        
        1️⃣ EN ESTE ARCHIVO (SheetCard.tsx):
          - COMENTAR: (sheet as any).offer?.program?.name ||
          - DESCOMENTAR: sheet.trainingProject?.program?.name ||
        
        2️⃣ EN InstructorTechnicalAssignContainer.tsx:
          ELIMINAR/COMENTAR la sección completa:
          - offer: { id: "X", program: { ... } }  ← ESTA ESTRUCTURA NO EXISTE EN API REAL
          
          MANTENER únicamente:
          - trainingProject: { id: "X", title: "..." }  ← ESTA SÍ EXISTE EN API REAL
        
        3️⃣ RESULTADO:
          - ✅ Sin errores TypeScript
          - ✅ Programas aparecerán desde trainingProject.program.name (API real)
          - ✅ Estructura compatible con GraphQL generado automáticamente
        
        💡 TIP: La API real tiene program dentro de trainingProject, NO dentro de offer
        */}

        {/* Instructor actual */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg sm:rounded-xl p-3 sm:p-4">
          <div className="flex items-start sm:items-center space-x-3">
            <FaUserTie className={`text-lg sm:text-xl flex-shrink-0 mt-1 sm:mt-0 ${teacherName ? 'text-primary dark:text-secondary' : 'text-gray-400 dark:text-gray-500'}`} />
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm font-medium text-darkGray dark:text-gray-300">Instructor técnico</p>
              <p className={`font-semibold text-sm sm:text-base truncate ${teacherName ? 'text-secondary dark:text-white' : 'text-gray-400 dark:text-gray-500'}`}>
                {teacherName || "Sin asignar"}
              </p>
            </div>
          </div>
        </div>

        {/* Asignación de instructor */}
        <div className="space-y-3 sm:space-y-4">
          <label className="block text-xs sm:text-sm font-bold text-secondary dark:text-white">
            {teacherName ? 'Reasignar Instructor:' : 'Asignar instructor:'}
          </label>

          <div className="relative">
            <select
              className="w-full p-2.5 sm:p-3 text-sm sm:text-base border-2 border-gray-300 dark:border-gray-600 rounded-lg sm:rounded-xl focus:border-primary dark:focus:border-secondary focus:ring-2 focus:ring-primary/20 dark:focus:ring-secondary/20 transition-all duration-200 bg-white dark:bg-gray-800 text-gray-900 dark:text-white appearance-none cursor-pointer"
              value={selectedInstructor}
              onChange={(e) => onSelectInstructor(e.target.value)}
            >
              <option value="">Seleccionar instructor</option>
              {teachers.map((teacher) => (
                <option key={teacher.id} value={teacher.id!}>
                  {`${teacher.collaborator?.person?.name || ''} ${teacher.collaborator?.person?.lastname || ''}`.trim()}
                </option>
              ))}
            </select>
            <div className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 dark:text-gray-500"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M19 9l-7 7-7-7"></path>
              </svg>
            </div>
          </div>

          <button
            className="w-full bg-gradient-to-r from-primary to-lightGreen dark:from-secondary dark:to-blue-900 text-white py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
            onClick={onAssignInstructor}
            disabled={!selectedInstructor}
          >
            {teacherName ? 'Reasignar' : 'Asignar'} Instructor
          </button>
        </div>
      </div>
    </div>
  );
};

export default SheetCard;
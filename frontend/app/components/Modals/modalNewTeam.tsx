"use client";

import React, { useState, useEffect } from "react";
import Select, { MultiValue, ActionMeta } from 'react-select';
import studentService from "@services/olympo/studentService";
import { AddTeamScrumMutationVariables, Student, TeamsScrumDto } from "@/graphql/generated";

// Interfaces and Types
interface StudentOption {
  value: string;
  label: string;
  id: string;
  fullName: string;
}

interface FormErrors {
  teamName?: string | null;
  projectName?: string | null;
  members?: string | null;
}

type CreateTeamData = AddTeamScrumMutationVariables["input"];

interface ModalNewProjectProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: CreateTeamData) => Promise<boolean>;
  studySheetId: number;
}


const ModalNewProject: React.FC<ModalNewProjectProps> = ({
  isOpen,
  onClose,
  onCreate,
  studySheetId
}) => {
  const [teamData, setTeamData] = useState<Partial<TeamsScrumDto>>({
    teamName: "",
    projectName: "",
    memberIds: []
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [modalTransition, setModalTransition] = useState<boolean>(false);
  const [students, setStudents] = useState<StudentOption[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Configuración de estilos para react-select
  const selectStyles = {
    control: (provided: any, state: any) => ({
      ...provided,
      borderColor: errors.members ? '#ef4444' : state.isFocused ? '#3b82f6' : '#d1d5db',
      borderWidth: '2px',
      boxShadow: state.isFocused ? '0 0 0 1px #3b82f6' : 'none',
      '&:hover': {
        borderColor: state.isFocused ? '#3b82f6' : '#9ca3af'
      },
      minHeight: '44px',
      borderRadius: '6px'
    }),
    multiValue: (provided: any) => ({
      ...provided,
      backgroundColor: '#dbeafe',
      borderRadius: '20px'
    }),
    multiValueLabel: (provided: any) => ({
      ...provided,
      color: '#1e40af',
      fontWeight: '500',
      fontSize: '14px'
    }),
    multiValueRemove: (provided: any) => ({
      ...provided,
      color: '#3b82f6',
      ':hover': {
        backgroundColor: '#bfdbfe',
        color: '#1d4ed8'
      },
      borderRadius: '0 20px 20px 0'
    }),
    placeholder: (provided: any) => ({
      ...provided,
      color: '#9ca3af',
      fontSize: '14px'
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? '#3b82f6'
        : state.isFocused
          ? '#dbeafe'
          : 'white',
      color: state.isSelected ? 'white' : '#374151',
      ':active': {
        backgroundColor: '#3b82f6'
      }
    })
  };

  useEffect(() => {
    if (isOpen) {
      setModalTransition(true);
      fetchStudents();
    } else {
      setModalTransition(false);
      // Reset form when modal closes
      setTimeout(() => {
        resetForm();
      }, 300);
    }
  }, [isOpen]);

  const fetchStudents = async (): Promise<void> => {
    setLoading(true);
    try {
      const res = await studentService.getStudentList();
      const studentOptions: StudentOption[] = (res.data as Student[]).map((s: Student) => ({
        value: s.id!,
        label: `${s.person?.name} ${s.person?.lastname}`,
        id: s.id!,
        fullName: `${s.person?.name} ${s.person?.lastname}`
      }));
      setStudents(studentOptions);
    } catch (err) {
      console.error("Error fetching students:", err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = (): void => {
    setTeamData({
      teamName: "",
      projectName: "",
      memberIds: []
    });
    setErrors({});
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!teamData.teamName?.trim()) {
      newErrors.teamName = "El nombre del Team Scrum es obligatorio";
    } else if (teamData.teamName.trim().length < 3) {
      newErrors.teamName = "El nombre debe tener al menos 3 caracteres";
    }

    if (!teamData.projectName?.trim()) {
      newErrors.projectName = "El nombre del proyecto es obligatorio";
    } else if (teamData.projectName.trim().length < 3) {
      newErrors.projectName = "El nombre debe tener al menos 3 caracteres";
    }

    if (!teamData.memberIds || teamData.memberIds.length === 0) {
      newErrors.members = "Debe seleccionar al menos un miembro";
    } else if (teamData.memberIds.length > 8) {
      newErrors.members = "No puede seleccionar más de 8 miembros";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof TeamsScrumDto, value: string): void => {
    setTeamData(prev => ({
      ...prev,
      [field]: value
    }));

    // Limpiar error específico cuando el usuario empiece a escribir
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const handleMembersChange = (
    selectedOptions: MultiValue<StudentOption>,
    actionMeta: ActionMeta<StudentOption>
  ): void => {
    const memberIds = selectedOptions.map(option => option.id);
    setTeamData(prev => ({
      ...prev,
      memberIds: memberIds
    }));

    // Limpiar error de members
    if (errors.members) {
      setErrors(prev => ({
        ...prev,
        members: null
      }));
    }
  };

  const handleCreateTeam = async (): Promise<void> => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const success = await onCreate({
        teamName: teamData.teamName!.trim(),
        projectName: teamData.projectName!.trim(),
        studySheetId: studySheetId,
        memberIds: teamData.memberIds?.map(id => parseInt(id, 10)),
        description: "",
        objectives: "",
        problem: "",
        projectJustification: "",
      });

      if (success) {
        handleClose();
      }
    } catch (error) {
      console.error("Error creating team:", error);
    } finally {
      setIsSubmitting(false);
    }
  };


  const handleClose = (): void => {
    if (isSubmitting) return; // Prevenir cierre durante envío

    setModalTransition(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  // Prevenir cierre al hacer clic en el contenido del modal
  const handleModalContentClick = (e: React.MouseEvent<HTMLDivElement>): void => {
    e.stopPropagation();
  };

  if (!isOpen) return null;

  const selectedMembers = teamData.memberIds
    ? students.filter(s => teamData.memberIds!.includes(s.id))
    : [];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-black bg-opacity-50 p-4"
      onClick={handleClose}
    >
      <div
        className={`relative w-full max-w-md mx-auto bg-white rounded-xl shadow-2xl transition-all duration-300 transform ${modalTransition ? "scale-100 opacity-100" : "scale-95 opacity-0"
          }`}
        onClick={handleModalContentClick}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">
              Nuevo Team Scrum
            </h2>
            <button
              onClick={handleClose}
              disabled={isSubmitting}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1"
              aria-label="Cerrar modal"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-4 max-h-[70vh] overflow-y-auto">
          <div className="space-y-4">
            {/* Nombre del Team Scrum */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nombre del Team Scrum *
              </label>
              <input
                type="text"
                placeholder="Ej: Team Alpha, Desarrolladores Frontend..."
                value={teamData.teamName || ''}
                onChange={(e) => handleInputChange('teamName', e.target.value)}
                className={`w-full px-3 py-2 border-2 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${errors.teamName
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300'
                  }`}
                disabled={isSubmitting}
              />
              {errors.teamName && (
                <p className="text-red-500 text-xs mt-1">{errors.teamName}</p>
              )}
            </div>

            {/* Nombre del Proyecto */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nombre del Proyecto *
              </label>
              <input
                type="text"
                placeholder="Ej: Sistema de Gestión, App Mobile..."
                value={teamData.projectName || ''}
                onChange={(e) => handleInputChange('projectName', e.target.value)}
                className={`w-full px-3 py-2 border-2 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${errors.projectName
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300'
                  }`}
                disabled={isSubmitting}
              />
              {errors.projectName && (
                <p className="text-red-500 text-xs mt-1">{errors.projectName}</p>
              )}
            </div>

            {/* Miembros del Team */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Miembros del Team *
                <span className="text-gray-500 font-normal text-xs">
                  ({teamData.memberIds?.length || 0}/4)
                </span>
              </label>
              <Select
                isMulti
                options={students}
                value={selectedMembers}
                onChange={handleMembersChange}
                styles={selectStyles}
                placeholder="Buscar y seleccionar miembros..."
                noOptionsMessage={() => loading ? "Cargando..." : "No se encontraron estudiantes"}
                isLoading={loading}
                isDisabled={isSubmitting}
                closeMenuOnSelect={false}
                hideSelectedOptions={false}
                maxMenuHeight={200}
                menuPlacement="auto"
              />
              {errors.members && (
                <p className="text-red-500 text-xs mt-1">{errors.members}</p>
              )}
              <p className="text-gray-500 text-xs mt-1">
                Selecciona entre 1 y 4 miembros para el equipo
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleCreateTeam}
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creando...
              </>
            ) : (
              'Crear Equipo'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalNewProject;

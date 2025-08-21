"use client";

import React, { useState, useEffect } from "react";
import Select, { MultiValue } from 'react-select';
import { AddTeamScrumMutationVariables, ProcessMethodology, TeamsScrumDto, Student, TeamScrumMemberId } from "@/graphql/generated";
import { fetchStudySheetWithStudents } from '@slice/olympo/studySheetSlice';
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { useMemo } from "react";
import Modal from "@components/UI/Modal";
interface StudentOption {
  value: string;
  label: string;
  id: string;
  fullName: string;
  student: Student;
}

interface FormErrors {
  teamName?: string | null;
  projectName?: string | null;
  members?: string | null;
  processMethodologyId?: string | null;
}

type CreateTeamData = AddTeamScrumMutationVariables["input"];

interface ModalNewTeamProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: CreateTeamData) => Promise<boolean>;
  studySheetId: number;
  existingTeams?: TeamsScrumDto[];
  processMethodologies: ProcessMethodology[];
}

const ModalNewTeam: React.FC<ModalNewTeamProps> = ({
  isOpen,
  onClose,
  onCreate,
  studySheetId,
  processMethodologies = []
}) => {
  const [teamData, setTeamData] = useState<Partial<TeamsScrumDto>>({
    teamName: "",
    projectName: "",
    memberIds: [],
    processMethodologyId: "",
    description: "",
    objectives: "",
    problem: "",
    projectJustification: ""
  });
  const dispatch = useDispatch<AppDispatch>();
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Redux selectors
  const rawStudents = useSelector((state: RootState) => state.studySheet.dataForStudents);

  const studentsForThisSheet = useMemo(
    () => (rawStudents?.[String(studySheetId)] ?? []) as any[],
    [rawStudents, studySheetId]
  );

  const studentOptions: StudentOption[] = studentsForThisSheet
    .filter(item => !!item.student?.id)
    .map(item => {
      const student = item.student!;
      const person = student.person;
      return {
        id: student.id,
        value: student.id,
        label: `${person?.name ?? ''} ${person?.lastname ?? ''}`,
        fullName: `${person?.name ?? ''} ${person?.lastname ?? ''}`,
        student: student,
      };
    });

  // Traer estudiantes al montar el modal
  useEffect(() => {
    if (studySheetId) {
      dispatch(fetchStudySheetWithStudents({ id: studySheetId }));
    }
  }, [dispatch, studySheetId]);

  // Estilos para Select
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
    }),
    menuPortal: (provided: any) => ({
      ...provided,
      zIndex: 9999
    })
  };

  const resetForm = (): void => {
    setTeamData({
      teamName: "",
      projectName: "",
      memberIds: [],
      processMethodologyId: "",
      description: "",
      objectives: "",
      problem: "",
      projectJustification: ""
    });
    setErrors({});
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    if (!teamData.teamName?.trim()) newErrors.teamName = "El nombre del Team Scrum es obligatorio";
    else if (teamData.teamName.trim().length < 3) newErrors.teamName = "Debe tener al menos 3 caracteres";

    if (!teamData.projectName?.trim()) newErrors.projectName = "El nombre del proyecto es obligatorio";
    else if (teamData.projectName.trim().length < 3) newErrors.projectName = "Debe tener al menos 3 caracteres";

    if (!teamData.processMethodologyId) newErrors.processMethodologyId = "Debe seleccionar un marco de trabajo";

    if (!teamData.memberIds || teamData.memberIds.length === 0)
      newErrors.members = "Debe seleccionar al menos un miembro";
    else if (teamData.memberIds.length > 4)
      newErrors.members = "No puede seleccionar más de 4 miembros";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof typeof teamData, value: any) => {
    setTeamData(prev => ({
      ...prev,
      [field]: value
    }));
  };


  const handleMembersChange = (
    selectedOptions: MultiValue<StudentOption>,
  ): void => {
    const memberIds: TeamScrumMemberId[] = selectedOptions.map(option => ({
      studentId: parseInt(option.id, 10)
    }));
    if (memberIds.length > 4) return;
    setTeamData(prev => ({ ...prev, memberIds }));
    if (errors.members) {
      setErrors(prev => ({ ...prev, members: null }));
    }
  };

  const handleCreateTeam = async (): Promise<void> => {
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      const success = await onCreate({
        processMethodologyId: teamData.processMethodologyId!,
        teamName: teamData.teamName!,
        projectName: teamData.projectName!,
        studySheetId,
        memberIds: teamData.memberIds!,
        description: teamData.description!,
        objectives: teamData.objectives!,
        problem: teamData.problem!,
        projectJustification: teamData.projectJustification!,
      });
      if (success) {
        resetForm();
        onClose();
      }
    } catch (error) {
      // Error manejado por el slice
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedMembers = teamData.memberIds
    ? studentOptions.filter(s => teamData.memberIds!.some(m => m && m.studentId === parseInt(s.id, 10)))
    : [];
  const currentLoading = false;

  const handleCloseModal = (): void => {
    if (isSubmitting) return;
    resetForm();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCloseModal}
      title="Nuevo Team Scrum"
      size="md"
      className="max-h-[90vh] overflow-hidden"
    >
      <div className="max-h-[60vh] overflow-y-auto">
        <div className="space-y-4">

          {/* Marcos de trabajo */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Marco de trabajo *
            </label>
            <select
              name="processMethodologyId"
              id="processMethodologyId"
              required
              value={teamData.processMethodologyId || ''}
              onChange={(e) => handleInputChange('processMethodologyId', e.target.value)}
              className={`w-full px-3 py-2 border-2 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors disabled:opacity-50 ${errors.processMethodologyId ? 'border-red-500' : 'border-gray-300'}`}
              disabled={isSubmitting}
            >
              <option value="" disabled>Selecciona un marco de trabajo...</option>
              {processMethodologies.map((methodology) => (
                <option key={methodology.id ?? crypto.randomUUID()} value={methodology.id ?? ""}>
                  {methodology.name}
                </option>
              ))}

            </select>
            {errors.processMethodologyId && (
              <p className="text-red-500 text-xs mt-1">{errors.processMethodologyId}</p>
            )}
          </div>
          {/* Nombre del Team Scrum */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Nombre del Team Scrum *
            </label>
            <input
              type="text"
              required
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
              required
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
              options={studentOptions}
              value={selectedMembers}
              onChange={handleMembersChange}
              styles={selectStyles}
              placeholder="Buscar y seleccionar miembros..."
              isOptionDisabled={() => (teamData.memberIds?.length || 0) >= 4}
              noOptionsMessage={() =>
                currentLoading
                  ? "Cargando estudiantes..."
                  : studentOptions.length === 0
                    ? "No hay estudiantes disponibles"
                    : "No se encontraron estudiantes"
              }
              isLoading={currentLoading}
              isDisabled={isSubmitting || currentLoading}
              closeMenuOnSelect={false}
              hideSelectedOptions={false}
              maxMenuHeight={200}
              required
              menuPlacement="auto"
              menuPortalTarget={document.body}
              menuPosition="fixed"
            />

            {errors.members && (
              <p className="text-red-500 text-xs mt-1">{errors.members}</p>
            )}
            <p className="text-gray-500 text-xs mt-1">
              {studentOptions.length === 0 && !currentLoading
                ? "No hay estudiantes disponibles para asignar"
                : "Selecciona entre 1 y 4 miembros para el equipo"}
            </p>

          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="pt-4 border-t border-gray-200 flex justify-end space-x-3">
        <button
          onClick={handleCloseModal}
          disabled={isSubmitting}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50"
        >
          Cancelar
        </button>
        <button
          onClick={handleCreateTeam}
          disabled={isSubmitting || currentLoading}
          className="px-4 py-2 text-sm font-medium rounded-md text-white bg-gradient-to-r from-primary to-lightGreen hover:from-primary/90 hover:to-lightGreen/90 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Creando...
            </>
          ) : (
            'Crear Equipo'
          )}
        </button>
      </div>
    </Modal>
  );
};

export default ModalNewTeam;
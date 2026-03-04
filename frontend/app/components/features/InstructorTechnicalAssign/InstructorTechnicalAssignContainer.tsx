"use client";

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { useRouter } from 'next/navigation';
import { FaUsers } from "react-icons/fa";
import { toast } from 'react-toastify';
import { fetchCoordinationByColaborator } from '@slice/olympo/coordinationSlice';
import { TEMPORAL_COORDINATOR_ID } from '@/temporaryCredential';
import PageTitle from '@/components/UI/pageTitle';
import StatsCards from './StatsCards';
import SheetCard from './SheetCard';

const InstructorTechnicalAssignContainer: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [selectedInstructor, setSelectedInstructor] = useState<Record<string, string>>({});

  // Obtener datos de Redux
  const { data: studySheets, loading: loadingSheets } = useSelector((state: RootState) => state.studySheet);
  const { data: coordinations, loading: loadingCoordinations } = useSelector((state: RootState) => state.coordination);

  // Obtener instructores de las coordinaciones
  const teachers = coordinations
    .flatMap(coord => coord.teachers || [])
    .filter((teacher): teacher is NonNullable<typeof teacher> => teacher !== null && teacher !== undefined);


  const handleAssignInstructor = (sheetId: string, teacherId: string) => {
    if (!teacherId) {
      toast.error("Selecciona un instructor primero");
      return;
    }

    const teacher = teachers.find(t => t.id === teacherId);

    if (!teacher) {
      toast.error("Instructor no encontrado");
      return;
    }

    // Aquí iría la lógica para asignar el instructor a través de Redux/GraphQL
    // Por ahora solo mostramos un toast de éxito
    toast.success(`Instructor ${teacher.collaborator?.person?.name} asignado exitosamente`);

    // Limpiar selección
    setSelectedInstructor(prev => ({
      ...prev,
      [sheetId]: ""
    }));
  };

  // Calcular estadísticas
  const totalSheets = studySheets.length;
  // Por ahora asumimos que no hay instructores asignados en el modelo actual
  const sheetsWithInstructor = 0; // TODO: Implementar lógica real cuando se agregue al modelo
  const sheetsWithoutInstructor = totalSheets - sheetsWithInstructor;

  if (loadingSheets || loadingCoordinations) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mx-auto mb-4"></div>
          <p className="text-lg font-semibold text-gray-700 dark:text-white">Cargando datos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-2 sm:px-4 lg:px-0 py-4 sm:py-6">
      <PageTitle onBack={() => router.back()}>Asignación Técnica de Instructores</PageTitle>

      {/* Stats rápidas */}
      <StatsCards
        totalSheets={totalSheets}
        sheetsWithInstructor={sheetsWithInstructor}
        sheetsWithoutInstructor={sheetsWithoutInstructor}
      />

      {/* Grid de fichas */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
        {studySheets.map((sheet) => (
          <SheetCard
            key={sheet.id}
            sheet={sheet}
            teachers={teachers}
            selectedInstructor={selectedInstructor[sheet.id!] || ""}
            onSelectInstructor={(instructorId) =>
              setSelectedInstructor((prev) => ({
                ...prev,
                [sheet.id!]: instructorId,
              }))
            }
            onAssignInstructor={() => handleAssignInstructor(sheet.id!, selectedInstructor[sheet.id!])}
          />
        ))}
      </div>

      {/* Empty state */}
      {studySheets.length === 0 && (
        <div className="text-center py-8 sm:py-12">
          <div className="bg-white dark:bg-shadowBlue rounded-xl p-6 sm:p-12 border border-gray-200 dark:border-gray-700">
            <FaUsers className="text-4xl sm:text-6xl text-gray-300 dark:text-gray-600 mx-auto mb-3 sm:mb-4" />
            <h3 className="text-lg sm:text-xl font-semibold text-gray-700 dark:text-white mb-2">
              No hay fichas disponibles
            </h3>
            <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
              No se encontraron fichas para asignar instructores.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstructorTechnicalAssignContainer;

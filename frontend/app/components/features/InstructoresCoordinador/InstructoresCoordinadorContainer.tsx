'use client'

import React, { useEffect } from "react"
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import PageTitle from "@components/UI/pageTitle"
import InstructorGrid from "@/components/features/InstructoresCoordinador/InstructorGrid"
import { Instructor } from "@/components/features/InstructoresCoordinador/InstructorCard"
import { fetchCoordinationByColaborator } from '@slice/olympo/coordinationSlice';
import { fetchStudySheetsWithCoordinationId } from '@slice/olympo/studySheetSlice';
import { TEMPORAL_COORDINATOR_ID } from '@/temporaryCredential';

const InstructoresCoordinadorContainer: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    
    // Obtener datos de Redux
    const { data: coordinations, loading: loadingCoordinations } = useSelector((state: RootState) => state.coordination);
    const { data: studySheets, loading: loadingSheets } = useSelector((state: RootState) => state.studySheet);

    useEffect(() => {
        // Cargar coordinaciones con instructores
        dispatch(fetchCoordinationByColaborator({ 
            collaboratorId: TEMPORAL_COORDINATOR_ID,
            page: 0, 
            size: 10,
            state: true 
        }));

        // Cargar fichas para obtener relación con instructores
        dispatch(fetchStudySheetsWithCoordinationId({ 
            coordinationId: TEMPORAL_COORDINATOR_ID,
            page: 0, 
            size: 10
        }));
    }, [dispatch]);

    const loading = loadingCoordinations || loadingSheets;

    // Obtener todos los instructores de las coordinaciones
    const teachers = coordinations
        .flatMap(coord => coord.teachers || [])
        .filter((teacher): teacher is NonNullable<typeof teacher> => teacher !== null && teacher !== undefined);

    // Transformar datos de GraphQL a formato esperado por InstructorCard
    const instructors: Instructor[] = teachers.map(teacher => {
        const person = teacher.collaborator?.person;
        const name = `${person?.name || ''} ${person?.lastname || ''}`.trim() || 'Sin nombre';
        
        // Obtener fichas asignadas al instructor a través de teacherStudySheets
        const teacherSheets = studySheets
            .filter(sheet => 
                sheet.teacherStudySheets?.some(tss => tss?.teacher?.id === teacher.id)
            );

        // Mapear fichas con su información completa
        const fichas = teacherSheets.map(sheet => {
            // Obtener el tipo de instructor en esta ficha (Técnico, Transversal, etc.)
            const teacherStudySheet = sheet.teacherStudySheets?.find(tss => tss?.teacher?.id === teacher.id);
            const sheetType = teacherStudySheet?.teacherStudySheetType?.name;
            const competence = teacherStudySheet?.competence?.name;
            
            return {
                ficha: `${sheet.number || 'N/A'}${sheetType ? ` - ${sheetType}` : ''}${competence ? ` (${competence})` : ''}`
            };
        });

        // Obtener especialidad de los tipos de clase
        const specialty = teacher.classTypes?.[0]?.name || 'Sin especialidad';

        // Obtener centros de las coordinaciones donde está el instructor
        const centersList = coordinations
            .filter(coord => coord.teachers?.some(t => t?.id === teacher.id))
            .map(coord => coord.trainingCenter?.name)
            .filter(Boolean);
        
        const centers = centersList.length > 0 
            ? centersList.join(', ') 
            : 'Sin centro asignado';

        // Obtener modalidad de las fichas (journey name)
        const journeys = teacherSheets
            .map(sheet => sheet.journey?.name)
            .filter((value, index, self) => value && self.indexOf(value) === index); // Únicos
        
        const modalidad = journeys.length > 0 
            ? journeys.join(', ') 
            : 'No especificada';

        return {
            name,
            specialty,
            contractTime: teacher.totalHours ? `${teacher.totalHours} horas` : 'No especificado',
            centers,
            modalidad,
            fichas
        };
    });

    if (loading) {
        return (
            <main className="px-2 sm:px-4 lg:px-0 py-4 sm:py-6">
                <PageTitle>Instructores</PageTitle>
                <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-4 border-primary mx-auto mb-4"></div>
                        <p className="text-sm sm:text-lg font-semibold text-gray-700 dark:text-white">
                            Cargando instructores...
                        </p>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="px-2 sm:px-4 lg:px-0 py-4 sm:py-6">
            <PageTitle>Instructores</PageTitle>
            
            {instructors.length === 0 ? (
                <div className="text-center py-12">
                    <div className="bg-white dark:bg-shadowBlue rounded-xl p-6 sm:p-12 border border-gray-200 dark:border-gray-700">
                        <div className="text-4xl sm:text-6xl text-gray-300 dark:text-gray-600 mb-3 sm:mb-4">👨‍🏫</div>
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-700 dark:text-white mb-2">
                            No hay instructores disponibles
                        </h3>
                        <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
                            No se encontraron instructores en las coordinaciones asignadas.
                        </p>
                    </div>
                </div>
            ) : (
                <InstructorGrid instructors={instructors} />
            )}
        </main>
    )
}

export default InstructoresCoordinadorContainer;
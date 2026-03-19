'use client'

import React, { useEffect } from "react"
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import PageTitle from "@components/UI/pageTitle"
import InstructorGrid from "@/components/features/InstructoresCoordinador/InstructorGrid"
import { Instructor } from "@/components/features/InstructoresCoordinador/InstructorCard"
import { fetchCoordinationByColaborator } from '@slice/olympo/coordinationSlice';
import { TEMPORAL_COORDINATOR_ID } from '@/temporaryCredential';

// DATOS DE PRUEBA - Cambiar USE_MOCK_DATA a false para usar datos reales
const USE_MOCK_DATA = true; // ← Cambiar a false cuando tengas datos reales

//  Puedes cambiar estos datos para probar diferentes scenarios
const MOCK_INSTRUCTORS: Instructor[] = [
    {
        name: "Juan Carlos Pérez",
        specialty: "Desarrollo de Software",
        contractTime: "3 meses",
        centers: "Centro de servicios financieros",
        modalidad: "Presencial",
        fichas: [
            { ficha: "2687590 - Técnico (Programación Web)" },
            { ficha: "2687591 - Transversal (Tics)" }
        ]
    },
    {
        name: "María José García",
        specialty: "Base de Datos",
        contractTime: "6 meses",
        centers: "Centro de servicios financieros",
        modalidad: "Virtual",
        fichas: [
            { ficha: "2687592 - Técnico (Administración BD)" }
        ]
    },
    {
        name: "Carlos Andrés López",
        specialty: "Redes y Telecomunicaciones",
        contractTime: "3 meses",
        centers: "Centro de Servicios Empresariales",
        modalidad: "Mixta",
        fichas: [
            { ficha: "2687593 - Técnico (Configuración Redes)" },
            { ficha: "2687594 - Transversal (Ética)" }
        ]
    },
    {
        name: "Ana Sofía Rodríguez",
        specialty: "Diseño Gráfico",
        contractTime: "5 meses",
        centers: "Centro de Diseño y Manufactura",
        modalidad: "Presencial",
        fichas: [
            { ficha: "2687595 - Técnico (Multimedia)" }
        ]
    },
    {
        name: "Luis Fernando Gómez",
        specialty: "Seguridad Informática",
        contractTime: "4 meses",
        centers: "Centro de Servicios Financieros",
        modalidad: "Virtual",
        fichas: [
            { ficha: "2687596 - Técnico (Ciberseguridad)" },
            { ficha: "2687597 - Transversal (Legislación)" }
        ]
    },
    {
        name: "Sofía Martínez",
        specialty: "Inteligencia Artificial",
        contractTime: "6 meses",
        centers: "Centro de Innovación Tecnológica",
        modalidad: "Mixta",
        fichas: [
            { ficha: "2687598 - Técnico (Machine Learning)" },
            { ficha: "2687599 - Transversal (Ética en IA)" }
        ]
    },
    {
        name: "Andrés Ramírez",
        specialty: "Desarrollo de Software",
        contractTime: "3 meses",
        centers: "Centro de Servicios Financieros",
        modalidad: "Presencial",
        fichas: [
            { ficha: "2687600 - Técnico (Programación Móvil)" }
        ]
    },
    {
        name: "Valentina Torres",
        specialty: "Base de Datos",
        contractTime: "6 meses",
        centers: "Centro de Servicios Financieros",
        modalidad: "Virtual",
        fichas: [
            { ficha: "2687601 - Técnico (Administración BD Avanzada)" }
        ]
    },
    {
        name: "Diego Hernández",
        specialty: "Redes y Telecomunicaciones",
        contractTime: "3 meses",
        centers: "Centro de Servicios Empresariales",
        modalidad: "Mixta",
        fichas: [
            { ficha: "2687602 - Técnico (Seguridad en Redes)" },
            { ficha: "2687603 - Transversal (Ética Profesional)" }
        ]
    },
    {
        name: "Camila Sánchez",
        specialty: "Diseño Gráfico",
        contractTime: "5 meses",
        centers: "Centro de Diseño y Manufactura",
        modalidad: "Presencial",
        fichas: [
            { ficha: "2687604 - Técnico (Diseño UX/UI)" }
        ]
    },
    {
        name: "Santiago Ramírez",
        specialty: "Seguridad Informática",
        contractTime: "4 meses",
        centers: "Centro de Servicios Financieros",
        modalidad: "Virtual",
        fichas: [
            { ficha: "2687605 - Técnico (Hacking Ético)" },
            { ficha: "2687606 - Transversal (Normativas de Seguridad)" }
        ]
    },
    {
        name: "Isabella Gómez",
        specialty: "Inteligencia Artificial",
        contractTime: "6 meses",
        centers: "Centro de Innovación Tecnológica",
        modalidad: "Mixta",
        fichas: [
            { ficha: "2687607 - Técnico (Deep Learning)" },
            { ficha: "2687608 - Transversal (Impacto Social de la IA)" }
        ]
    },
    {
        name: "Matías Fernández",
        specialty: "Desarrollo de Software",
        contractTime: "3 meses",
        centers: "Centro de Servicios Financieros",
        modalidad: "Presencial",
        fichas: [
            { ficha: "2687609 - Técnico (Desarrollo Backend)" }
        ]
    },
    {
        name: "Lucía Martínez",
        specialty: "Base de Datos",
        contractTime: "6 meses",
        centers: "Centro de Servicios Financieros",
        modalidad: "Virtual",
        fichas: [
            { ficha: "2687610 - Técnico (Optimización de BD)" }
        ]
    },
    {
        name: "Javier Rodríguez",
        specialty: "Redes y Telecomunicaciones",
        contractTime: "3 meses",
        centers: "Centro de Servicios Empresariales",
        modalidad: "Mixta",
        fichas: [
            { ficha: "2687611 - Técnico (Redes Inalámbricas)" },
            { ficha: "2687612 - Transversal (Comunicación Efectiva)" }
        ]
    },
    {
        name: "Martina López",
        specialty: "Diseño Gráfico",
        contractTime: "5 meses",
        centers: "Centro de Diseño y Manufactura",
        modalidad: "Presencial",
        fichas: [
            { ficha: "2687613 - Técnico (Animación 3D)" }
        ]
    },
    {
        name: "Sebastián Gómez",
        specialty: "Seguridad Informática",
        contractTime: "4 meses",
        centers: "Centro de Servicios Financieros",
        modalidad: "Virtual",
        fichas: [
            { ficha: "2687614 - Técnico (Forense Digital)" },
            { ficha: "2687615 - Transversal (Gestión de Incidentes)" }
        ]
    },
    {
        name: "Valeria Ramírez",
        specialty: "Inteligencia Artificial",
        contractTime: "6 meses",
        centers: "Centro de Innovación Tecnológica",
        modalidad: "Mixta",
        fichas: [
            { ficha: "2687616 - Técnico (Procesamiento de Lenguaje Natural)" },
            { ficha: "2687617 - Transversal (Ética en IA)" }
        ]
    }
];

// 🔧 Para probar diferentes escenarios, puedes cambiar estos valores:
// const MOCK_INSTRUCTORS: Instructor[] = []; // ← Lista vacía para probar "No hay instructores"
// const SIMULATE_LOADING = true; // ← Para probar la pantalla de carga
const SIMULATE_LOADING = false;

const InstructoresCoordinadorContainer: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();

    // 🚀 CÓDIGO REAL DEL BACKEND - Descomentar cuando quites los datos mock
    /*
    // Obtener datos de Redux
    const { data: coordinations, loading: loadingCoordinations } = useSelector((state: RootState) => state.coordination);
    const { data: studySheets, loading: loadingSheets } = useSelector((state: RootState) => state.studySheet);
    */

    /* 🚀 USEEFFECT REAL DEL BACKEND - Descomentar cuando quites los datos mock
    useEffect(() => {
        dispatch(fetchCoordinationByColaborator({
            collaboratorId: TEMPORAL_COORDINATOR_ID,
            page: 0,
            size: 10,
            state: true
        }));
    }, [dispatch]);
    */

    // Si estamos usando datos mock, usar esos datos
    if (USE_MOCK_DATA) {
        // Log para desarrollo
        console.log('[MODO DESARROLLO] Usando datos mock:', {
            totalInstructores: MOCK_INSTRUCTORS.length,
            simulandoCarga: SIMULATE_LOADING
        });

        // Simular pantalla de carga si está habilitada
        if (SIMULATE_LOADING) {
            return (
                <main className="px-2 sm:px-4 lg:px-0 py-4 sm:py-6">
                    <PageTitle>Instructores</PageTitle>
                    <div className="flex items-center justify-center py-12">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-4 border-primary mx-auto mb-4"></div>
                            <p className="text-sm sm:text-lg font-semibold text-gray-700 dark:text-white">
                                Cargando instructores.
                            </p>
                        </div>
                    </div>
                </main>
            );
        }

        const instructors = MOCK_INSTRUCTORS;
        
        return (
            <main className="px-2 sm:px-4 lg:px-0 py-4 sm:py-6">
                <PageTitle>Instructores</PageTitle>
                
                {instructors.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="bg-white dark:bg-shadowBlue rounded-xl p-6 sm:p-12 border border-gray-200 dark:border-gray-700">
                            <div className="text-4xl sm:text-6xl text-gray-300 dark:text-gray-600 mb-3 sm:mb-4">👨‍🏫</div>
                            <h3 className="text-lg sm:text-xl font-semibold text-gray-700 dark:text-white mb-2">
                                No hay instructores disponibles (DATOS MOCK)
                            </h3>
                            <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
                                Esta es una pantalla de prueba. Agregar datos al array MOCK_INSTRUCTORS para verlos.
                            </p>
                        </div>
                    </div>
                ) : (
                    <InstructorGrid instructors={instructors} />
                )}
            </main>
        );
    }

    /* 🚀 PROCESAMIENTO DE DATOS REALES DEL BACKEND - Descomentar cuando quites los datos mock
    // Código original para datos reales
    console.log('🚀 [MODO PRODUCCIÓN] Usando datos reales de la API');
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
    */

    /* 🚀 RENDERIZADO DE DATOS REALES DEL BACKEND - Descomentar cuando quites los datos mock
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
    */
}

export default InstructoresCoordinadorContainer;

/* 
🧪 GUÍA RÁPIDA DE USO:

📋 ESCENARIOS DE PRUEBA que puedes cambiar fácilmente:
1. Lista normal de instructores (actual): MOCK_INSTRUCTORS con 4 instructores
2. Lista vacía: const MOCK_INSTRUCTORS: Instructor[] = [];
3. Pantalla de carga: const SIMULATE_LOADING = true;
4. Datos reales: const USE_MOCK_DATA = false;

🛠️ PERSONALIZAR DATOS DE PRUEBA:
- Agrega/quita instructores en el array MOCK_INSTRUCTORS
- Cambia nombres, especialidades, fichas, etc.
- Prueba con diferentes números de fichas por instructor
- Modifica los centros y modalidades

� PARA CAMBIAR A DATOS REALES (SÚPER FÁCIL):

✅ PASO 1: Cambiar USE_MOCK_DATA = false (línea 12)

✅ PASO 2: DESCOMENTAR el código real del backend:
- Descomentar líneas donde dice "🚀 CÓDIGO REAL DEL BACKEND"
- Descomentar líneas donde dice "🚀 USEEFFECT REAL DEL BACKEND" 
- Descomentar líneas donde dice "🚀 PROCESAMIENTO DE DATOS REALES"
- Descomentar líneas donde dice "🚀 RENDERIZADO DE DATOS REALES"

✅ PASO 3 (Opcional): ELIMINAR datos mock:
- Líneas 11-57: const USE_MOCK_DATA y todo MOCK_INSTRUCTORS
- Líneas 74-147: todo el if (USE_MOCK_DATA) y su contenido
- Esta sección de comentarios

🎯 ¡Con solo DESCOMENTAR ya tienes tu código original funcionando!
💡 TIP: Puedes duplicar este archivo como backup antes de hacer cambios.
*/
"use client";

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@redux/store";
import { FaLayerGroup, FaUserCheck, FaClock, FaChartLine } from "react-icons/fa";
import { Assignment } from "@components/features/InstructorAssignMultipleSheets/AssignmentCard";
import { StatCard } from "@components/features/InstructorAssignMultipleSheets/StatCard";
import { AssignmentsList } from "@components/features/InstructorAssignMultipleSheets/AssignmentsList";
import { AssignmentModal } from "@/components/Modals/AssignmentModal";
import { TEMPORAL_COLLABORATOR_ID } from "@/temporaryCredential";
import { fetchCoordinationByColaborator } from "@/redux/slices/olympo/coordinationSlice";
import PageTitle from "@/components/UI/pageTitle";
import { useRouter } from "next/navigation";

// ========== DATOS QUEMADOS - INICIO ==========
// COMENTAR esta sección completa cuando uses datos reales

const HARDCODED_ASSIGNMENTS: Assignment[] = [
{
    id: 1,
    instructor: "María José Rodríguez García",
    sheets: ["2758963", "2758965", "2758970"],
    totalSheets: 3,
    status: "Activo",
    program: "ADSO - Análisis y Desarrollo de Software",
    assignedDate: "2024-01-15"
},
{
    id: 2,
    instructor: "Carlos Andrés Martínez López",
    sheets: ["2758964", "2758968"],
    totalSheets: 2,
    status: "Activo",
    program: "REDES - Tecnología en Redes",
    assignedDate: "2024-01-20"
},
{
    id: 3,
    instructor: "Ana Patricia González Hernández",
    sheets: ["2758966", "2758969", "2758971", "2758973"],
    totalSheets: 4,
    status: "Pendiente",
    program: "MULTIMEDIA - Producción Multimedia",
    assignedDate: "2024-02-01"
},
{
    id: 4,
    instructor: "Luis Fernando Jiménez Castro",
    sheets: ["2758967"],
    totalSheets: 1,
    status: "Activo",
    program: "MECOM - Mantenimiento de Equipos",
    assignedDate: "2024-01-25"
},
{
    id: 5,
    instructor: "Sandra Milena Torres Vargas",
    sheets: ["2758972", "2758974"],
    totalSheets: 2,
    status: "Pendiente",
    program: "MARKETING - Marketing Digital",
    assignedDate: "2024-02-10"
},
{
    id: 6,
    instructor: "Diego Alejandro Ramírez Moreno",
    sheets: ["2758975", "2758976", "2758977"],
    totalSheets: 3,
    status: "Activo",
    program: "SST - Seguridad y Salud en el Trabajo",
    assignedDate: "2024-01-30"
},
{
    id: 7,
    instructor: "Liliana Vargas Castillo",
    sheets: ["2758978", "2758979"],
    totalSheets: 2,
    status: "Activo",
    program: "GESTIÓN - Gestión Empresarial",
    assignedDate: "2024-02-05"
},
{
    id: 8,
    instructor: "Roberto Sánchez Pérez",
    sheets: ["2758980"],
    totalSheets: 1,
    status: "Pendiente",
    program: "AUTOMÁTICA - Automática Industrial",
    assignedDate: "2024-02-15"
},
{
    id: 9,
    instructor: "Claudia Patricia Herrera Vega",
    sheets: ["2758981", "2758982", "2758983", "2758984"],
    totalSheets: 4,
    status: "Activo",
    program: "LOGÍSTICA - Gestión Logística",
    assignedDate: "2024-02-20"
},
{
    id: 10,
    instructor: "Javier Orlando Ruiz Gómez",
    sheets: ["2758985", "2758986"],
    totalSheets: 2,
    status: "Pendiente",
    program: "VIDEOJUEGOS - Desarrollo de Videojuegos",
    assignedDate: "2024-03-01"
}
];
// ========== DATOS QUEMADOS - FIN ==========


export const InstructorAssignMultipleSheetsContainer: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const [modalOpen, setModalOpen] = useState(false);
    const router = useRouter();
    
    // ========== DATOS REALES - COMENTADO ==========
    // DESCOMENTAR estas líneas para usar datos reales
    // COMENTAR la sección "DATOS QUEMADOS ACTIVOS" de abajo
    
    // const [assignments, setAssignments] = useState<Assignment[]>([]);
    // const { data: coordinations, loading: loadingCoordinations, error: errorCoordinations } = useSelector((state: RootState) => state.coordination);
    // const teachers = coordinations.flatMap(coord => coord.teachers || []).filter(Boolean);

    // ========== DATOS QUEMADOS ACTIVOS ==========
    // COMENTAR estas líneas cuando uses datos reales
    // DESCOMENTAR la sección "DATOS REALES" de arriba
    
    const [assignments, setAssignments] = useState<Assignment[]>(HARDCODED_ASSIGNMENTS);
    const loadingCoordinations = false;
    const teachers = [];

    // ========== CARGA DE DATOS REALES - COMENTADO ==========
    // DESCOMENTAR este useEffect para usar datos reales
    
    // useEffect(() => {
    //     dispatch(fetchCoordinationByColaborator({collaboratorId: TEMPORAL_COLLABORATOR_ID, page: 0, size: 10, state: true}));
    // }, [dispatch]);

    const handleView = (id: number) => {
        // ========== DATOS REALES - COMENTADO ==========
        // DESCOMENTAR para navegación real
        // router.push(`/dashboard/assignments/${id}`);
        
        // ========== DATOS QUEMADOS ACTIVOS ==========
        // COMENTAR cuando uses datos reales
        console.log('Ver asignación:', id);
    };

    const handleEdit = (id: number) => {
        // ========== DATOS REALES - COMENTADO ==========
        // DESCOMENTAR para edición real
        // const assignment = assignments.find(a => a.id === id);
        // if (assignment) {
        //     setEditingAssignment(assignment);
        //     setModalOpen(true);
        // }
        
        // ========== DATOS QUEMADOS ACTIVOS ==========
        // COMENTAR cuando uses datos reales
        console.log('Editar asignación:', id);
    };

    const handleDelete = (id: number) => {
        // ========== DATOS REALES - COMENTADO ==========
        // DESCOMENTAR para eliminación real con API
        // try {
        //     await dispatch(deleteAssignment(id)).unwrap();
        //     setAssignments(prev => prev.filter(a => a.id !== id));
        //     toast.success('Asignación eliminada exitosamente');
        // } catch (error) {
        //     toast.error('Error al eliminar asignación');
        // }
        
        // ========== DATOS QUEMADOS ACTIVOS ==========
        // COMENTAR cuando uses datos reales
        setAssignments(prev => prev.filter(a => a.id !== id));
        console.log('Asignación eliminada:', id);
    };

    const handleSubmit = () => {
        // ========== DATOS REALES - COMENTADO ==========
        // DESCOMENTAR para creación real con API
        // try {
        //     await dispatch(createAssignment(formData)).unwrap();
        //     // Recargar asignaciones
        //     toast.success('Asignación creada exitosamente');
        // } catch (error) {
        //     toast.error('Error al crear asignación');
        // }
        
        // ========== DATOS QUEMADOS ACTIVOS ==========
        // COMENTAR cuando uses datos reales
        console.log('Crear nueva asignación');
        setModalOpen(false);
    };

    return (
        <div className="p-6 transition-colors" >
            
            {/* Header */}
            <div className="mb-8">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
                    <PageTitle onBack={() => router.back()}>Asignación múltiple</PageTitle>
                    <button
                        className="mt-4 lg:mt-0 bg-gradient-to-r from-[#5cb800] to-[#8fd400] dark:from-secondary dark:to-blue-900 text-white px-6 py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2 hover:scale-105 font-semibold"
                        onClick={() => setModalOpen(true)}
                    >
                        <span>Nueva asignación</span>
                    </button>
                </div>

                {/* Cards de estadísticas */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <StatCard
                        title="Total instructores"
                        value={assignments.length}
                        borderColor="border-primary"
                    />
                    <StatCard
                        title="Fichas asignadas"
                        value={assignments.reduce((acc, curr) => acc + curr.totalSheets, 0)}
                        borderColor="border-lightGreen"
                    />
                    <StatCard
                        title="Activos"
                        value={assignments.filter(a => a.status === 'Activo').length}
                        borderColor="border-green-500"
                    />
                    <StatCard
                        title="Pendientes"
                        value={assignments.filter(a => a.status === 'Pendiente').length}
                        borderColor="border-yellow-500"
                    />
                </div>
            </div>

            {/* Lista de asignaciones */}
            {/* Este componente funciona igual con datos reales o quemados */}
            <AssignmentsList
                assignments={assignments}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            {/* Modal */}
            {/* Este modal funciona igual con datos reales o quemados */}
            <AssignmentModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onSubmit={handleSubmit}
            />
        </div>
    );
};

export default InstructorAssignMultipleSheetsContainer;

/*
========== INSTRUCCIONES PARA ALTERNAR ENTRE DATOS QUEMADOS Y REALES ==========

PARA USAR DATOS NORMALES (reales):

1. CAMBIAR la constante USE_HARDCODED_DATA:
- Cambiar: const USE_HARDCODED_DATA = true;
- Por: const USE_HARDCODED_DATA = false;

2. BORRAR toda la sección "DATOS QUEMADOS" (array HARDCODED_ASSIGNMENTS y 
la constante USE_HARDCODED_DATA)

3. DESCOMENTAR las líneas marcadas "DATOS REALES":
- const [assignments, setAssignments] = useState<Assignment[]>([]);
- const { data: coordinations, loading: loadingCoordinations, error: errorCoordinations } = ...
- const teachers = coordinations.flatMap(...)
- El useEffect para cargar datos con fetchCoordinationByColaborator

4. DESCOMENTAR y completar la lógica real en las funciones:
- En handleView: navegación real con router.push
- En handleEdit: lógica de edición con modal y estado
- En handleDelete: llamada real a API con dispatch y toast
- En handleSubmit: creación real de asignación con dispatch

5. COMENTAR O BORRAR las líneas marcadas "DATOS QUEMADOS ACTIVOS":
- La inicialización de assignments con HARDCODED_ASSIGNMENTS
- Las variables simuladas loadingCoordinations y teachers
- Las simulaciones en las funciones handle*

6. IMPLEMENTAR las acciones de Redux faltantes:
- deleteAssignment
- createAssignment
- updateAssignment (si es necesario)

PARA VOLVER A DATOS QUEMADOS: Simplemente cambia USE_HARDCODED_DATA a true y
revierte los cambios anteriores.

DATOS DE EJEMPLO INCLUIDOS:
- 10 asignaciones de instructores
- Variedad de programas (ADSO, REDES, MULTIMEDIA, etc.)
- Estados: Activo (6) y Pendiente (4)
- Total de 25 fichas asignadas entre todos los instructores
- Fechas realistas de asignación desde enero 2024

FUNCIONES QUE FUNCIONAN CON DATOS QUEMADOS:
✅ Ver estadísticas (cards superiores)
✅ Listar asignaciones
✅ Eliminar asignaciones (solo localmente)
✅ Abrir modal de nueva asignación
✅ Navegación y UI

LIMITACIONES CON DATOS QUEMADOS:
❌ Sin persistencia real de cambios
❌ Sin conexión a base de datos
❌ Sin validaciones de backend
❌ Estado no se mantiene entre navegación
*/
"use client";

import React, { useState } from "react";
import { FaPlus, FaLayerGroup, FaUserCheck, FaClock, FaChartLine } from "react-icons/fa";
import { Assignment } from "@components/features/InstructorAssignMultipleSheets/AssignmentCard";
import { StatCard } from "@components/features/InstructorAssignMultipleSheets/StatCard";
import { AssignmentsList } from "@components/features/InstructorAssignMultipleSheets/AssignmentsList";
import { AssignmentModal } from "@/components/Modals/AssignmentModal";

// Datos mock
const mockData: Assignment[] = [
    { 
        id: 1,
        instructor: "Carlos Ruiz Mendoza", 
        sheets: ["FT-003", "FT-004", "FT-007"],
        totalSheets: 3,
        status: "Activo",
        program: "Desarrollo de Software",
        assignedDate: "15/08/2024"
    },
    { 
        id: 2,
        instructor: "Ana Torres García", 
        sheets: ["FT-005"],
        totalSheets: 1,
        status: "Pendiente",
        program: "Administración de Redes", 
        assignedDate: "20/08/2024"
    },
    { 
        id: 3,
        instructor: "María José López", 
        sheets: ["FT-001", "FT-002", "FT-008", "FT-009"],
        totalSheets: 4,
        status: "Activo",
        program: "Diseño Gráfico",
        assignedDate: "10/08/2024"
    }
];

export const InstructorAssignMultipleSheetsContainer: React.FC = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [assignments, setAssignments] = useState<Assignment[]>(mockData);

    const handleView = (id: number) => {
        console.log('Ver asignación:', id);
    };

    const handleEdit = (id: number) => {
        console.log('Editar asignación:', id);
    };

    const handleDelete = (id: number) => {
        console.log('Eliminar asignación:', id);
    };

    const handleSubmit = () => {
        console.log('Crear nueva asignación');
        setModalOpen(false);
    };

    return (
        <div className="min-h-screen p-6">
            
            {/* Header */}
            <div className="mb-8">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
                    <div>
                        <h1 className="text-4xl font-bold text-secondary mb-2 bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
                            Asignación Múltiple
                        </h1>
                        <p className="text-darkGray text-lg">Gestiona asignaciones masivas de fichas técnicas de manera eficiente</p>
                    </div>
                    <button
                        className="mt-4 lg:mt-0 bg-gradient-to-r from-primary to-lightGreen text-white px-6 py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2 hover:scale-105 font-semibold"
                        onClick={() => setModalOpen(true)}
                    >
                        <FaPlus className="w-4 h-4" />
                        <span>Nueva Asignación</span>
                    </button>
                </div>

                {/* Cards de estadísticas */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <StatCard
                        title="Total Instructores"
                        value={assignments.length}
                        icon={<FaUserCheck className="text-primary text-xl" />}
                        borderColor="border-primary"
                        bgColor="bg-primary/10"
                    />
                    <StatCard
                        title="Fichas Asignadas"
                        value={assignments.reduce((acc, curr) => acc + curr.totalSheets, 0)}
                        icon={<FaLayerGroup className="text-lightGreen text-xl" />}
                        borderColor="border-lightGreen"
                        bgColor="bg-lightGreen/10"
                    />
                    <StatCard
                        title="Activos"
                        value={assignments.filter(a => a.status === 'Activo').length}
                        icon={<FaChartLine className="text-green-600 text-xl" />}
                        borderColor="border-green-500"
                        bgColor="bg-green-100"
                    />
                    <StatCard
                        title="Pendientes"
                        value={assignments.filter(a => a.status === 'Pendiente').length}
                        icon={<FaClock className="text-yellow-600 text-xl" />}
                        borderColor="border-yellow-500"
                        bgColor="bg-yellow-100"
                    />
                </div>
            </div>

            {/* Lista de asignaciones */}
            <AssignmentsList
                assignments={assignments}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            {/* Modal */}
            <AssignmentModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onSubmit={handleSubmit}
            />
        </div>
    );
};

export default InstructorAssignMultipleSheetsContainer;
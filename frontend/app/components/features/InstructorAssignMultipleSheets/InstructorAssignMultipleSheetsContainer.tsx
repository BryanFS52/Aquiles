"use client";

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@redux/store";
import { FaPlus, FaLayerGroup, FaUserCheck, FaClock, FaChartLine } from "react-icons/fa";
import { Assignment } from "@components/features/InstructorAssignMultipleSheets/AssignmentCard";
import { StatCard } from "@components/features/InstructorAssignMultipleSheets/StatCard";
import { AssignmentsList } from "@components/features/InstructorAssignMultipleSheets/AssignmentsList";
import { AssignmentModal } from "@/components/Modals/AssignmentModal";
import { TEMPORAL_COLLABORATOR_ID } from "@/temporaryCredential";
import { fetchCoordinationByColaborator } from "@/redux/slices/olympo/coordinationSlice";
import PageTitle from "@/components/UI/pageTitle";
import { useRouter } from "next/navigation";


export const InstructorAssignMultipleSheetsContainer: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const [modalOpen, setModalOpen] = useState(false);
    const router = useRouter();
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const { data: coordinations, loading: loadingCoordinations, error: errorCoordinations } = useSelector((state: RootState) => state.coordination);
    const teachers = coordinations.flatMap(coord => coord.teachers || []).filter(Boolean);

    useEffect(() => {
        dispatch(fetchCoordinationByColaborator({collaboratorId: TEMPORAL_COLLABORATOR_ID, page: 0, size: 10, state: true}));
    }, [dispatch]);

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
                    <PageTitle onBack={() => router.back()}>Asignación Múltiple</PageTitle>
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
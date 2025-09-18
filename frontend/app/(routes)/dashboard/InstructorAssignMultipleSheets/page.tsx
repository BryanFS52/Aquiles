"use client";

import React, { useState } from "react";
import { FaPlus, FaLayerGroup, FaUserCheck, FaClock, FaEye, FaEdit, FaTrash, FaChartLine } from "react-icons/fa";

// Datos mock expandidos
const mockData = [
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

const InstructorAssignMultipleSheetsPage = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [assignments, setAssignments] = useState(mockData);

    const getStatusColor = (status:any) => {
        switch(status) {
            case 'Activo': return 'bg-green-100 text-green-800 border-green-200';
            case 'Pendiente': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getStatusIcon = (status: any) => {
        switch(status) {
            case 'Activo': return <FaUserCheck className="w-3 h-3" />;
            case 'Pendiente': return <FaClock className="w-3 h-3" />;
            default: return null;
        }
    };

    return (
        <div className="min-h-screen p-6">
            
            {/* Header con estadísticas */}
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
                    <div className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-primary hover:shadow-xl transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-darkGray mb-1">Total Instructores</p>
                                <p className="text-3xl font-bold text-secondary">{assignments.length}</p>
                            </div>
                            <div className="bg-primary/10 p-3 rounded-xl">
                                <FaUserCheck className="text-primary text-xl" />
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-lightGreen hover:shadow-xl transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-darkGray mb-1">Fichas Asignadas</p>
                                <p className="text-3xl font-bold text-secondary">{assignments.reduce((acc, curr) => acc + curr.totalSheets, 0)}</p>
                            </div>
                            <div className="bg-lightGreen/10 p-3 rounded-xl">
                                <FaLayerGroup className="text-lightGreen text-xl" />
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-green-500 hover:shadow-xl transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-darkGray mb-1">Activos</p>
                                <p className="text-3xl font-bold text-secondary">{assignments.filter(a => a.status === 'Activo').length}</p>
                            </div>
                            <div className="bg-green-100 p-3 rounded-xl">
                                <FaChartLine className="text-green-600 text-xl" />
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-yellow-500 hover:shadow-xl transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-darkGray mb-1">Pendientes</p>
                                <p className="text-3xl font-bold text-secondary">{assignments.filter(a => a.status === 'Pendiente').length}</p>
                            </div>
                            <div className="bg-yellow-100 p-3 rounded-xl">
                                <FaClock className="text-yellow-600 text-xl" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Lista de asignaciones */}
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                <div className="bg-gradient-to-r from-secondary to-primary p-6 text-white">
                    <h2 className="text-2xl font-bold flex items-center space-x-3">
                        <FaLayerGroup className="text-xl" />
                        <span>Asignaciones Activas</span>
                    </h2>
                    <p className="text-white/90 mt-1">Administra todas las asignaciones múltiples</p>
                </div>

                <div className="p-6">
                    <div className="space-y-4">
                        {assignments.map((assignment) => (
                            <div key={assignment.id} className="bg-gradient-to-r from-gray-50 to-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300 hover:scale-[1.01]">
                                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                                    
                                    {/* Info principal */}
                                    <div className="flex-1">
                                        <div className="flex items-start space-x-4">
                                            <div className="bg-primary/10 p-3 rounded-xl flex-shrink-0">
                                                <FaUserCheck className="text-primary text-xl" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-xl font-bold text-secondary mb-1">{assignment.instructor}</h3>
                                                <p className="text-darkGray mb-2">{assignment.program}</p>
                                                <div className="flex items-center space-x-4 text-sm text-darkGray">
                                                    <span>Asignado: {assignment.assignedDate}</span>
                                                    <span className="flex items-center space-x-1">
                                                        <FaLayerGroup className="w-3 h-3" />
                                                        <span>{assignment.totalSheets} Fichas</span>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Fichas y estado */}
                                    <div className="mt-4 lg:mt-0 lg:ml-6 flex-shrink-0">
                                        <div className="flex flex-col lg:items-end space-y-3">
                                            
                                            {/* Fichas asignadas */}
                                            <div className="flex flex-wrap gap-2">
                                                {assignment.sheets.map((sheet, idx) => (
                                                    <span key={idx} className="bg-primary/10 text-primary px-3 py-1 rounded-lg text-sm font-medium border border-primary/20">
                                                        {sheet}
                                                    </span>
                                                ))}
                                            </div>

                                            {/* Estado y acciones */}
                                            <div className="flex items-center space-x-3">
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1 border ${getStatusColor(assignment.status)}`}>
                                                    {getStatusIcon(assignment.status)}
                                                    <span>{assignment.status}</span>
                                                </span>
                                                
                                                <div className="flex space-x-2">
                                                    <button className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors">
                                                        <FaEye className="w-4 h-4" />
                                                    </button>
                                                    <button className="p-2 text-lightGreen hover:bg-lightGreen/10 rounded-lg transition-colors">
                                                        <FaEdit className="w-4 h-4" />
                                                    </button>
                                                    <button className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                                        <FaTrash className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Modal */}
            {modalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
                        <div className="bg-gradient-to-r from-primary to-lightGreen p-6 text-white">
                            <h3 className="text-2xl font-bold flex items-center space-x-3">
                                <FaPlus className="text-xl" />
                                <span>Nueva Asignación Múltiple</span>
                            </h3>
                            <p className="text-white/90 mt-1">Asigna múltiples fichas técnicas a un instructor</p>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="text-center py-12 text-darkGray">
                                <FaLayerGroup className="mx-auto text-6xl text-primary/20 mb-4" />
                                <p className="text-lg mb-2">Formulario de asignación múltiple</p>
                                <p className="text-sm">Aquí iría el formulario completo para la asignación</p>
                            </div>
                            <div className="flex justify-end space-x-3">
                                <button
                                    className="px-6 py-3 border border-gray-300 text-darkGray rounded-xl hover:bg-gray-50 transition-colors font-semibold"
                                    onClick={() => setModalOpen(false)}
                                >
                                    Cancelar
                                </button>
                                <button
                                    className="px-6 py-3 bg-gradient-to-r from-primary to-lightGreen text-white rounded-xl hover:shadow-lg transition-all font-semibold"
                                    onClick={() => setModalOpen(false)}
                                >
                                    Asignar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InstructorAssignMultipleSheetsPage;
"use client";

import React from "react";
import { FaLayerGroup, FaUserCheck, FaClock, FaEye, FaEdit, FaTrash } from "react-icons/fa";

export interface Assignment {
    id: number;
    instructor: string;
    sheets: string[];
    totalSheets: number;
    status: string;
    program: string;
    assignedDate: string;
}

interface AssignmentCardProps {
    assignment: Assignment;
    onView: (id: number) => void;
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
}

export const AssignmentCard: React.FC<AssignmentCardProps> = ({ assignment, onView, onEdit, onDelete }) => {
    const getStatusColor = (status: string) => {
        switch(status) {
            case 'Activo': return 'bg-primary text-white border-green-100 dark:border-green-700';
            case 'Pendiente': return 'bg-yellow-500 text-white border-yellow-200 dark:border-yellow-700';
            default: return 'bg-gray-500 text-white border-gray-200 dark:border-gray-700';
        }
    };

    const getStatusIcon = (status: string) => {
        switch(status) {
            case 'Activo': return <FaUserCheck className="w-3 h-3" />;
            case 'Pendiente': return <FaClock className="w-3 h-3" />;
            default: return null;
        }
    };

    return (
        <div className="bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 hover:scale-[1.01]">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                
                {/* Info principal */}
                <div className="flex-1">
                    <div className="flex items-start space-x-4">
                        <div className="bg-primary/10 dark:bg-primary/20 p-3 rounded-xl flex-shrink-0">
                            <FaUserCheck className="text-primary dark:text-primary-light text-xl" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-xl font-bold text-secondary dark:text-white mb-1">{assignment.instructor}</h3>
                            <p className="text-darkGray dark:text-gray-300 mb-2">{assignment.program}</p>
                            <div className="flex items-center space-x-4 text-sm text-darkGray dark:text-gray-400">
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
                                <span key={idx} className="bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-light px-3 py-1 rounded-lg text-sm font-medium border border-primary/20 dark:border-primary/30">
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
                                <button
                                    onClick={() => onView(assignment.id)}
                                    className="p-2 text-primary hover:bg-primary/10 dark:hover:bg-primary/20 rounded-lg transition-colors"
                                >
                                    <FaEye className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => onEdit(assignment.id)}
                                    className="p-2 text-lightGreen hover:bg-lightGreen/10 dark:hover:bg-lightGreen/20 rounded-lg transition-colors"
                                >
                                    <FaEdit className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => onDelete(assignment.id)}
                                    className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/20 rounded-lg transition-colors"
                                >
                                    <FaTrash className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
"use client";

import React from "react";
import { FaLayerGroup } from "react-icons/fa";
import { AssignmentCard, Assignment } from "./AssignmentCard";

interface AssignmentsListProps {
    assignments: Assignment[];
    onView: (id: number) => void;
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
}

export const AssignmentsList: React.FC<AssignmentsListProps> = ({ assignments, onView, onEdit, onDelete }) => {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">
            <div className="bg-gradient-to-r from-[#5cb800] to-[#8fd400] dark:from-secondary dark:to-blue-900 p-6 text-white">
                <h2 className="text-2xl font-bold flex items-center space-x-3">
                    <FaLayerGroup className="text-xl" />
                    <span>Asignaciones activas</span>
                </h2>
                <p className="text-white/90 mt-1">Administra todas las asignaciones múltiples</p>
            </div>

            <div className="p-6">
                <div className="space-y-4">
                    {assignments.map((assignment) => (
                        <AssignmentCard
                            key={assignment.id}
                            assignment={assignment}
                            onView={onView}
                            onEdit={onEdit}
                            onDelete={onDelete}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};
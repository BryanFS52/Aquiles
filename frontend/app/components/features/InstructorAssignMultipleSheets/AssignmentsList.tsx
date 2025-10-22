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
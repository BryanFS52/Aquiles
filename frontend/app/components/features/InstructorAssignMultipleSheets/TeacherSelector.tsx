"use client";

import React from "react";
import { FaUser, FaIdCard, FaCheckCircle } from "react-icons/fa";
import { Teacher } from "@graphql/generated";

interface TeacherSelectorProps {
    teachers: Teacher[];
    selectedTeacherId: number | null;
    onSelect: (teacherId: number | null) => void;
}

export const TeacherSelector: React.FC<TeacherSelectorProps> = ({ 
    teachers, 
    selectedTeacherId, 
    onSelect
}) => {
    return (
        <div className="space-y-2 max-h-96 overflow-y-auto">
            {teachers.map((teacher) => {
                const isSelected = teacher.id === selectedTeacherId?.toString();
                const personName = teacher.collaborator?.person?.name || 'N/A';
                const personLastname = teacher.collaborator?.person?.lastname || '';
                const personDocument = teacher.collaborator?.person?.document || 'N/A';
                const fullName = `${personName} ${personLastname}`.trim();

                return (
                    <button
                        key={teacher.id}
                        onClick={() => {
                            if (teacher.id) {
                                const teacherId = Number(teacher.id);
                                // Si ya está seleccionado, deseleccionar (pasar null)
                                onSelect(isSelected ? null : teacherId);
                            }
                        }}
                        className={`w-full p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                            isSelected
                                ? 'border-primary bg-primary/10 shadow-md'
                                : 'border-gray-200 hover:border-primary/50 hover:bg-gray-50'
                        }`}
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className={`p-2 rounded-lg ${
                                    isSelected ? 'bg-primary text-white' : 'bg-gray-100 text-darkGray'
                                }`}>
                                    <FaUser className="text-lg" />
                                </div>
                                <div>
                                    <p className={`font-semibold ${
                                        isSelected ? 'text-primary' : 'text-secondary'
                                    }`}>
                                        {fullName}
                                    </p>
                                    <p className="text-sm text-darkGray flex items-center space-x-1">
                                        <FaIdCard className="text-xs" />
                                        <span>{personDocument}</span>
                                    </p>
                                </div>
                            </div>
                            {isSelected && (
                                <FaCheckCircle className="text-primary text-xl" />
                            )}
                        </div>
                    </button>
                );
            })}
        </div>
    );
};

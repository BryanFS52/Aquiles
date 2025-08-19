'use client';

import React from 'react';
import { FaTrashAlt, FaUsers, FaCode, FaEye } from 'react-icons/fa';
import { MdInfo, MdGroup } from 'react-icons/md';
import { TeamCardProps } from './types';

export const TeamCard: React.FC<TeamCardProps> = ({
    team,
    onOpenTeamInfo,
    onOpenHistory,
    onOpenConfirmDelete
}) => {
    return (
        <div className="group relative bg-white dark:bg-shadowBlue rounded-2xl overflow-hidden border border-lightGray dark:border-grayText hover:bg-black/5 dark:hover:bg-white/10 transform hover:-translate-y-2 hover:scale-[1.02] transition-all duration-300">
            {/* Gradient Header */}
            <div className="h-24 bg-gradient-to-br from-primary via-lightGreen to-darkGreen dark:from-secondary dark:to-darkBlue relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent"></div>
                <div className="absolute top-4 right-4">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                        <FaCode className="text-white text-lg" />
                    </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white/20 to-transparent"></div>
            </div>

            {/* Content */}
            <div className="p-6 relative -mt-4">
                {/* Team Avatar */}
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-lightGreen dark:from-secondary dark:to-darkBlue rounded-full flex items-center justify-center mb-4 mx-auto">
                    <FaUsers className="text-white text-xl" />
                </div>

                {/* Team Name */}
                <h2 className="text-2xl font-bold text-center text-black dark:text-white mb-2 group-hover:text-black dark:group-hover:text-white transition-colors">
                    {team.teamName}
                </h2>

                {/* Team ID */}
                <div className="bg-gray-50 dark:bg-shadowBlue/50 rounded-lg p-3 mb-4">
                    <div className="flex items-center space-x-2 mb-1">
                        <div className="w-2 h-2 bg-primary dark:bg-darkBlue rounded-full"></div>
                        <span className="text-xs font-medium text-grayText dark:text-white uppercase tracking-wide">
                            Team ID
                        </span>
                    </div>
                    <p className="text-sm font-mono text-black dark:text-white bg-white dark:bg-shadowBlue px-2 py-1 rounded">
                        {team.id}
                    </p>
                </div>

                {/* Members Section */}
                {team.students && team.students.length > 0 && (
                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-2">
                                <MdGroup className="text-black dark:text-darkBlue" />
                                <h3 className="text-sm font-semibold text-black dark:text-white">
                                    Miembros del equipo
                                </h3>
                            </div>
                            <span className="bg-gray-200 text-black dark:bg-darkBlue/20 dark:text-darkBlue text-xs font-semibold px-2 py-1 rounded-full">
                                {team.students.length}
                            </span>
                        </div>
                        <div className="max-h-32 overflow-y-auto space-y-2">
                            {team.students.map((student, index) => (
                                <div
                                    key={index}
                                    className="flex items-center space-x-3 p-2 bg-gray-50 dark:bg-shadowBlue/30 rounded-lg hover:bg-gray-100 dark:hover:bg-darkBlue/50 transition-colors"
                                >
                                    <div className="w-8 h-8 bg-gradient-to-br from-primary/20 to-lightGreen/20 dark:from-secondary/20 dark:to-darkBlue/20 rounded-full flex items-center justify-center">
                                        <span className="text-xs font-semibold text-black dark:text-darkBlue">
                                            {(student?.person?.name ?? `E${index + 1}`).charAt(0)}
                                        </span>
                                    </div>
                                    <span className="text-sm text-black dark:text-white">
                                        {student?.person?.name ?? `Estudiante ${index + 1}`}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button
                        onClick={() => onOpenTeamInfo(team)}
                        className="flex items-center gap-2 text-black dark:text-darkBlue hover:text-black dark:hover:text-white transition-colors duration-300 p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-darkBlue/10"
                        title="Información del equipo"
                    >
                        <MdInfo className="text-xl" />
                        <span className="text-sm font-medium">Info</span>
                    </button>

                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() => onOpenConfirmDelete(team)}
                            className="p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-300 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                            title="Eliminar equipo"
                        >
                            <FaTrashAlt className="text-lg" />
                        </button>

                        <button
                            onClick={() => onOpenHistory(team)}
                            className="flex items-center gap-2 text-black dark:text-white bg-gradient-to-r from-primary to-lightGreen hover:from-primary/90 hover:to-lightGreen/90 dark:from-secondary dark:to-darkBlue dark:hover:from-secondary/90 dark:hover:to-darkBlue/90 px-4 py-2 rounded-lg hover:-translate-y-0.5 text-sm font-medium transition-all duration-300 transform"
                        >
                            <FaEye className="text-sm" />
                            Ver Más
                        </button>
                    </div>
                </div>
            </div>

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-lightGreen/5 dark:from-secondary/10 dark:to-darkBlue/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
        </div>
    );
};

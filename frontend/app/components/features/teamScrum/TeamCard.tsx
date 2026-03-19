'use client';

import React from 'react';
import { FaTrashAlt, FaUsers, FaEye } from 'react-icons/fa';
import { MdInfo, MdGroup } from 'react-icons/md';
import { TeamCardProps } from './types';

export const TeamCard: React.FC<TeamCardProps> = ({
    team,
    onOpenTeamInfo,
    onOpenHistory,
    onOpenConfirmDelete
}) => {
    const teamMembers = team.students ?? [];
    const visibleMembers = teamMembers.slice(0, 3);
    const hiddenMembersCount = Math.max(teamMembers.length - visibleMembers.length, 0);

    const methodologyName =
        typeof team.processMethodology === "object"
            ? (team.processMethodology?.name ?? "Sin metodología")
            : "Sin metodología";

    const projectName = team.projectName ?? "Proyecto sin nombre";

    return (
        <div className="group relative bg-white dark:bg-dark-card rounded-2xl overflow-hidden border border-lightGray dark:border-dark-border dark:shadow-lg transform hover:-translate-y-2 hover:scale-[1.02] transition-all duration-300">
            {/* Header */}
            <div className="h-24 bg-gradient-to-r from-[#5cb800] to-[#8fd400] dark:bg-gradient-to-r dark:from-shadowBlue dark:to-darkBlue relative overflow-hidden">
                <button
                    onClick={() => onOpenConfirmDelete(team)}
                    className="absolute top-3 right-3 p-2 rounded-full bg-white/20 text-white"
                    title="Eliminar equipo"
                >
                    <FaTrashAlt className="text-sm" />
                </button>
            </div>

            {/* Content */}
            <div className="p-6 relative -mt-4">
                {/* Team Avatar */}
                <div className="w-16 h-16 bg-[#5cb800] dark:bg-shadowBlue rounded-full flex items-center justify-center mb-4 mx-auto">
                    <FaUsers className="text-white text-xl" />
                </div>

                {/* Team Name */}
                <h2 className="text-2xl font-bold text-center text-black dark:text-white mb-2 group-hover:text-black dark:group-hover:text-white transition-colors">
                    {team.teamName}
                </h2>

                {/* Team Meta */}
                <div className="mb-4 space-y-2">
                    <div className="flex items-center justify-between bg-white dark:bg-darkBackground/40 rounded-lg p-2 border border-transparent dark:border-dark-border/60">
                        <span className="text-xs font-medium text-grayText dark:text-dark-textSecondary">Metodología</span>
                        <span className="text-xs font-semibold text-black dark:text-white">{methodologyName}</span>
                    </div>
                    <div className="bg-white dark:bg-darkBackground/40 rounded-lg p-2 border border-transparent dark:border-dark-border/60">
                        <p className="text-xs font-medium text-grayText dark:text-dark-textSecondary mb-1">Proyecto</p>
                        <p className="text-sm font-semibold text-black dark:text-white line-clamp-2">{projectName}</p>
                    </div>
                </div>

                {/* Members Section */}
                {teamMembers.length > 0 && (
                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-2">
                                <MdGroup className="text-black dark:text-white" />
                                <h3 className="text-sm font-semibold text-black dark:text-white">
                                    Miembros del equipo
                                </h3>
                            </div>
                            <span className="bg-white text-black dark:bg-darkBlue dark:text-white text-xs font-semibold px-2 py-1 rounded-full">
                                {teamMembers.length}
                            </span>
                        </div>
                        <div className="space-y-2">
                            {visibleMembers.map((student, index) => (
                                <div
                                    key={index}
                                    className="flex items-center space-x-3 p-2 bg-white dark:bg-darkBackground/35 rounded-lg hover:bg-gray-50 dark:hover:bg-darkBackground/55 transition-colors"
                                >
                                    <div className="w-8 h-8 bg-[#5cb800]/20 dark:bg-shadowBlue/40 rounded-full flex items-center justify-center">
                                        <span className="text-xs font-semibold text-black dark:text-white">
                                            {(student?.person?.name ?? `E${index + 1}`).charAt(0)}
                                        </span>
                                    </div>
                                    <span className="text-sm text-black dark:text-white">
                                        {`${student?.person?.name ?? ''} ${student?.person?.lastname ?? ''}`.trim() || `Estudiante ${index + 1}`}
                                    </span>
                                </div>
                            ))}
                            {hiddenMembersCount > 0 && (
                                <div className="text-xs text-grayText dark:text-dark-textSecondary px-1">
                                    +{hiddenMembersCount} miembro(s) más
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-dark-border">
                    <button
                        onClick={() => onOpenTeamInfo(team)}
                        className="flex items-center gap-2 text-[#2f7d0d] dark:text-white hover:text-[#26670a] dark:hover:text-blue-300"
                        title="Información del equipo"
                    >
                        <MdInfo className="text-xl text-[#2f7d0d] dark:text-white" />
                        <span className="text-sm font-medium">Info</span>
                    </button>

                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() => onOpenHistory(team)}
                            className="flex items-center gap-2 text-white bg-[#5cb800] hover:bg-[#5cb800]/90 dark:bg-gradient-to-r dark:from-shadowBlue dark:to-darkBlue dark:hover:from-darkBlue dark:hover:to-shadowBlue dark:border dark:border-dark-border/60 px-4 py-2 rounded-lg hover:-translate-y-0.5 text-sm font-medium transition-all duration-300 transform"
                        >
                            <FaEye className="text-sm" />
                            Ver más
                        </button>
                    </div>
                </div>
            </div>

        </div>
    );
};

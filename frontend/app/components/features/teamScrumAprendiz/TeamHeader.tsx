"use client";

import React from "react";
import { MdGroups } from "react-icons/md";
import { FaProjectDiagram, FaHashtag } from "react-icons/fa";
import { IoCalendar } from "react-icons/io5";
import { Maybe, StudySheet } from "@graphql/generated";

interface TeamHeaderProps {
    teamName: string;
    projectName: string;
    studySheet?: Maybe<StudySheet>;
}

const TeamHeader: React.FC<TeamHeaderProps> = ({ teamName, projectName, studySheet }) => {
    return (
        <div className="bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-shadowBlue dark:via-darkBlue dark:to-shadowBlue/80 rounded-3xl p-6 mb-8 shadow-2xl border border-lightGray/50 dark:border-darkGray/50 backdrop-blur-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-secondary/10 to-transparent rounded-full blur-xl"></div>

            <div className="flex flex-col lg:flex-row items-center gap-8 relative z-10">
                <div className="relative group">
                    <div className="relative w-[140px] h-[140px] rounded-full border-4 border-primary/50 dark:border-secondary/50 bg-gradient-to-br from-lightGray/40 to-primary/10 dark:from-darkBlue/40 dark:to-secondary/10 backdrop-blur-sm transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 overflow-hidden flex items-center justify-center shadow-xl">
                        <MdGroups className="text-7xl text-primary dark:text-secondary transition-all duration-300 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-r from-green-400 to-green-500 rounded-full shadow-lg flex items-center justify-center">
                        <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                    </div>
                </div>

                <div className="flex-1 text-center lg:text-left">
                    <div className="bg-lightGray/50 dark:bg-darkBlue/50 border border-lightGray dark:border-darkGray rounded-xl p-3 text-2xl font-bold text-black dark:text-white placeholder-grayText w-full lg:w-auto cursor-not-allowed select-none">
                        {teamName || "Nombre del Team"}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
                        <div className="flex items-center justify-center gap-3 bg-gradient-to-r from-white to-gray-50 dark:from-darkBlue/70 dark:to-shadowBlue/70 rounded-xl p-4 border border-lightGray/30 dark:border-darkGray/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group">
                            <div className="p-2 bg-primary/10 dark:bg-secondary/10 rounded-lg group-hover:bg-primary/20 dark:group-hover:bg-secondary/20 transition-colors">
                                <FaProjectDiagram className="text-primary dark:text-secondary text-lg" />
                            </div>
                            <div className="text-left">
                                <p className="text-xs text-grayText dark:text-gray-400 font-medium">Proyecto</p>
                                <span className="font-semibold text-black dark:text-white text-sm">
                                    {projectName || 'Sin nombre'}
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center justify-center gap-3 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-darkBlue/50 dark:to-shadowBlue/50 rounded-xl p-4 border border-lightGray/30 dark:border-darkGray/30 shadow-md cursor-not-allowed select-none">
                            <div className="p-2 bg-gray-200/70 dark:bg-gray-600/30 rounded-lg">
                                <FaHashtag className="text-black dark:text-white text-lg" />
                            </div>
                            <div className="text-left">
                                <p className="text-xs text-grayText dark:text-gray-400 font-medium">Ficha</p>
                                <span className="font-semibold text-black dark:text-white text-sm">
                                    {studySheet?.number || 'N/A'}
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center justify-center gap-3 bg-gradient-to-r from-white to-blue-50 dark:from-darkBlue/70 dark:to-blue-900/20 rounded-xl p-4 border border-lightGray/30 dark:border-darkGray/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group">
                            <div className="p-2 bg-blue-100/70 dark:bg-blue-900/30 rounded-lg group-hover:bg-blue-200/70 dark:group-hover:bg-blue-800/40 transition-colors">
                                <IoCalendar className="text-blue-600 dark:text-blue-400 text-lg" />
                            </div>
                            <div className="text-left">
                                <p className="text-xs text-grayText dark:text-gray-400 font-medium">Trimestre</p>
                                <span className="font-semibold text-black dark:text-white text-sm">
                                    {studySheet?.quarter?.[0]?.name?.extension || 'N/A'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeamHeader;
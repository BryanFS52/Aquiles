"use client";

import React from "react";
import { FaUsers } from "react-icons/fa";
import { IoPersonCircleSharp } from "react-icons/io5";
import { Maybe, Student } from "@graphql/generated";

interface TeamMembersProps {
    students?: Maybe<Maybe<Student>[]>;
}

const TeamMembers: React.FC<TeamMembersProps> = ({ students }) => {
    return (
        <div className="bg-gradient-to-br from-white via-gray-50 to-white dark:from-shadowBlue dark:via-darkBlue dark:to-shadowBlue rounded-3xl p-6 shadow-2xl border border-lightGray/30 dark:border-darkGray/30 backdrop-blur-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/5 to-transparent rounded-full blur-xl"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-secondary/5 to-transparent rounded-full blur-lg"></div>

            <div className="flex items-center gap-4 mb-8 relative z-10">
                <div className="p-3 bg-gradient-to-r from-primary/10 to-primary/5 dark:from-secondary/10 dark:to-secondary/5 rounded-xl">
                    <FaUsers className="text-primary dark:text-secondary text-2xl" />
                </div>
                <div>
                    <h3 className="text-2xl font-bold text-black dark:text-white">
                        Miembros del Team
                    </h3>
                    <p className="text-sm text-grayText dark:text-gray-400">
                        Integrantes activos del equipo
                    </p>
                </div>
            </div>

            <div className="space-y-4 relative z-10">
                {students && students.length > 0 ? (
                    students.map((student, idx) => (
                        <div
                            key={idx}
                            className="group bg-gradient-to-r from-white via-gray-50 to-white dark:from-darkBlue/60 dark:via-shadowBlue/60 dark:to-darkBlue/60 rounded-2xl p-5 transition-all duration-500 cursor-pointer shadow-lg hover:shadow-2xl hover:scale-[1.03] hover:-translate-y-1 relative overflow-hidden border border-lightGray/20 dark:border-darkGray/20"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>

                            <div className="flex items-center justify-between relative z-10">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-secondary/20 dark:from-secondary/20 dark:to-primary/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                        <IoPersonCircleSharp className="text-2xl text-primary dark:text-secondary" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-grayText mb-1 group-hover:text-primary dark:group-hover:text-secondary transition-colors">
                                            Aprendiz
                                        </p>
                                        <p className="font-bold text-black dark:text-white text-lg group-hover:text-primary dark:group-hover:text-secondary transition-colors">
                                            {student?.person?.name} {student?.person?.lastname}
                                        </p>
                                        {student?.profiles && student.profiles.length > 0 && (
                                            <div className="flex items-center gap-2 mt-2">
                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-primary/10 to-primary/5 text-primary dark:from-secondary/10 dark:to-secondary/5 dark:text-secondary border border-primary/20 dark:border-secondary/20 transition-all duration-300 group-hover:shadow-md">
                                                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                                                        <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
                                                    </svg>
                                                    {student.profiles.map(profile => profile?.name).filter(Boolean).join(', ')}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                    <span className="text-xs text-green-600 dark:text-green-400 font-medium">Activo</span>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center text-grayText p-8 bg-gray-50 dark:bg-darkBlue/30 rounded-xl border border-dashed border-gray-300 dark:border-gray-600">
                        <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FaUsers className="text-2xl text-gray-400" />
                        </div>
                        <p className="font-medium">No hay miembros del equipo registrados</p>
                        <p className="text-sm text-gray-500 mt-1">Los miembros aparecerán aquí cuando sean asignados</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TeamMembers;
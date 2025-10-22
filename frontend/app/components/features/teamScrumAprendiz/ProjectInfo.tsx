"use client";

import React from "react";
import { FaProjectDiagram } from "react-icons/fa";
import Slider, { Settings } from "react-slick";
import { CustomNextArrow, CustomPrevArrow } from "./CustomArrows";

interface ProjectSection {
    field: string;
    label: string;
    placeholder: string;
    value: string;
}

interface ProjectInfoProps {
    projectName: string;
    projectSections: ProjectSection[];
    isUpdating: boolean;
    hasUnsavedChanges: boolean;
    onInputChange: (field: string, value: string) => void;
    onUpdate: () => void;
}

const ProjectInfo: React.FC<ProjectInfoProps> = ({
    projectName,
    projectSections,
    isUpdating,
    hasUnsavedChanges,
    onInputChange,
    onUpdate
}) => {
    const settings: Settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        adaptiveHeight: true,
        nextArrow: <CustomNextArrow />,
        prevArrow: <CustomPrevArrow />,
    };

    return (
        <div className="bg-gradient-to-br from-white via-blue-50/30 to-white dark:from-shadowBlue dark:via-blue-900/10 dark:to-shadowBlue rounded-3xl p-6 shadow-2xl border border-lightGray/30 dark:border-darkGray/30 backdrop-blur-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-200/20 to-transparent rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-primary/10 to-transparent rounded-full blur-xl"></div>

            <div className="flex items-center gap-4 mb-8 relative z-10">
                <div className="p-3 bg-gradient-to-r from-blue-100/70 to-primary/10 dark:from-blue-900/30 dark:to-secondary/10 rounded-xl shadow-lg">
                    <FaProjectDiagram className="text-blue-600 dark:text-blue-400 text-2xl" />
                </div>
                <div>
                    <h3 className="text-2xl font-bold text-black dark:text-white">
                        Información del Proyecto
                    </h3>
                    <p className="text-sm text-grayText dark:text-gray-400">
                        Detalles y descripción del proyecto del equipo
                    </p>
                </div>
            </div>

            <div className="mb-8 relative z-10">
                <label className="flex items-center gap-2 text-lg font-semibold text-black dark:text-white mb-4">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    Nombre del Proyecto:
                </label>
                <div className="relative">
                    <input
                        type="text"
                        value={projectName}
                        className="w-full border-2 border-lightGray/50 dark:border-darkBlue/50 rounded-xl p-4 bg-gradient-to-r from-white to-gray-50/50 dark:from-darkBlue/80 dark:to-shadowBlue/80 text-black dark:text-white focus:outline-none focus:border-blue-400 dark:focus:border-blue-500 focus:ring-4 focus:ring-blue-100/50 dark:focus:ring-blue-900/30 transition-all duration-300 shadow-inner hover:shadow-lg disabled:opacity-50 placeholder-gray-400 dark:placeholder-gray-500"
                        placeholder="Escribe el nombre de tu proyecto..."
                        onChange={(e) => onInputChange('projectName', e.target.value)}
                        disabled={isUpdating}
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                        <FaProjectDiagram className="text-gray-400 dark:text-gray-500" />
                    </div>
                </div>
            </div>

            <div className="slider-container relative">
                <Slider {...settings}>
                    {projectSections.map((item, idx) => (
                        <div key={idx} className="px-4">
                            <div className="bg-gradient-to-br from-lightGray/30 to-primary/5 dark:from-darkBlue/30 dark:to-secondary/10 rounded-xl p-6 border border-primary/10 dark:border-secondary/10">
                                <label className="block text-lg font-semibold text-black dark:text-secondary mb-3">
                                    {item.label}:
                                </label>
                                <textarea
                                    className="w-full border-2 border-lightGray dark:border-darkBlue rounded-xl p-4 h-32 resize-none bg-white/80 dark:bg-darkBlue/80 text-secondary dark:text-white focus:outline-none focus:border-primary dark:focus:border-secondary transition-colors disabled:opacity-50"
                                    placeholder={item.placeholder}
                                    rows={4}
                                    value={item.value}
                                    onChange={(e) => onInputChange(item.field, e.target.value)}
                                    disabled={isUpdating}
                                />
                            </div>
                        </div>
                    ))}
                </Slider>
            </div>

            <div className="flex justify-center mt-10 relative z-10">
                <button
                    onClick={onUpdate}
                    disabled={isUpdating}
                    className={`group relative bg-gradient-to-r from-lime-600 to-green-600 hover:from-lime-700 hover:to-green-700 text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-lg focus:outline-none focus:ring-4 focus:ring-lime-500/50 active:scale-95 flex items-center justify-center gap-3 min-w-[200px] ${hasUnsavedChanges ? 'animate-pulse' : ''}`}
                >
                    <div className="relative flex items-center gap-3">
                        {hasUnsavedChanges && (
                            <div className="relative">
                                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-400 rounded-full animate-ping"></span>
                                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                            </div>
                        )}

                        <svg
                            className={`w-5 h-5 transition-transform duration-300 ${isUpdating ? 'animate-spin' : 'group-hover:scale-110'}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            {isUpdating ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            ) : hasUnsavedChanges ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            )}
                        </svg>

                        <span className="relative text-lg">
                            {isUpdating ? 'Procesando...' : hasUnsavedChanges ? 'Guardar Cambios' : 'Actualizar Información'}
                        </span>
                    </div>

                    <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
            </div>
        </div>
    );
};

export default ProjectInfo;
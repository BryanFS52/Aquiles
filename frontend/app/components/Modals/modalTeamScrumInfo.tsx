"use client";

import { useState, useEffect } from "react";
import { MdClose, MdInfo, MdDescription, MdFlag, MdReportProblem, MdFormatAlignJustify } from "react-icons/md";
import { FaSave, FaTimes } from "react-icons/fa";
import { TeamScrumItem } from "@type/slices/teamScrum";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchTeamScrumById } from '@slice/teamScrumSlice'

interface ModalTeamInformationProps {
    isOpen: boolean;
    onClose: () => void;
    team: TeamScrumItem | null;
    onSave: (teamId: string, data: TeamInfoData) => Promise<boolean>;
}

interface TeamInfoData {
    projectName: string;
    teamName: string;
    description: string;
    objectives: string;
    problem: string;
    projectJustification: string;
}

export default function ModalTeamInformation({
    isOpen,
    onClose,
    team,
    onSave
}: ModalTeamInformationProps) {
    const [formData, setFormData] = useState<TeamInfoData>({
        projectName: String(team?.projectName || ""),
        teamName: String(team?.teamName) || "",
        description: String(team?.description || ""),
        objectives: String(team?.objectives || ""),
        problem: String(team?.problem || ""),
        projectJustification: String(team?.projectJustification || "")
    });

    const dispatch = useDispatch<AppDispatch>();
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Partial<TeamInfoData>>({});
    const teamScrumData = useSelector((state: RootState) => state.teamScrum.dataForTeamScrumById);

    // Efecto para bloquear/desbloquear el scroll del fondo
    useEffect(() => {
        if (isOpen) {
            // Bloquear scroll cuando se abre el modal
            document.body.style.overflow = 'hidden';
        } else {
            // Restaurar scroll cuando se cierra el modal
            document.body.style.overflow = 'unset';
        }

        // Cleanup: restaurar scroll cuando el componente se desmonta
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    useEffect(() => {
        if (team?.id) {
            dispatch(fetchTeamScrumById({ id: team.id }));
        }
    }, [dispatch, team?.id]);

    // Imprime los datos para depuración
    console.log(teamScrumData)

    // Actualizar formData cuando cambie el team o se carguen nuevos datos
    useEffect(() => {
        const data = teamScrumData || team;

        if (data) {
            setFormData({
                projectName: String(data.projectName || ""),
                teamName: String(data.teamName || ""),
                description: String(data.description || ""),
                objectives: String(data.objectives || ""),
                problem: String(data.problem || ""),
                projectJustification: String(data.projectJustification || "")
            });
        }
    }, [team, teamScrumData]);

    const handleInputChange = (field: keyof TeamInfoData, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

        // Limpiar error del campo cuando el usuario empiece a escribir
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: undefined
            }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Partial<TeamInfoData> = {};

        if (!formData.description.trim()) {
            newErrors.description = "La descripción es requerida";
        }

        if (!formData.objectives.trim()) {
            newErrors.objectives = "Los objetivos son requeridos";
        }

        if (!formData.problem.trim()) {
            newErrors.problem = "La descripción del problema es requerida";
        }

        if (!formData.projectJustification.trim()) {
            newErrors.projectJustification = "La justificación del proyecto es requerida";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!team) return;

        if (!validateForm()) return;

        setLoading(true);

        try {
            const success = await onSave(team.id, formData);
            if (success) {
                onClose();
            }
        } catch (error) {
            console.error("Error saving team information:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setErrors({});
        onClose();
    };

    if (!isOpen || !team) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-shadowBlue rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden border border-lightGray dark:border-darkGreen">
                {/* Header */}
                <div className="bg-gradient-to-r from-primary to-lightGreen p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                                <MdInfo className="text-2xl" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold">Información del Equipo</h2>
                                <p className="text-white/80 text-sm">{team.teamName}</p>
                            </div>
                        </div>
                        <button
                            onClick={handleClose}
                            className="p-2 hover:bg-white/20 rounded-full transition-colors"
                        >
                            <MdClose className="text-2xl" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Description */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-semibold text-darkGray dark:text-lightGray mb-2">
                                <MdDescription className="text-primary dark:text-lightGreen" />
                                Descripción del Proyecto
                            </label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => handleInputChange("description", e.target.value)}
                                className={`w-full px-4 py-3 border rounded-xl bg-white dark:bg-gray-800 text-darkGray dark:text-lightGray placeholder-grayText resize-none focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-lightGreen transition-all ${errors.description
                                    ? "border-red-500 focus:ring-red-500"
                                    : "border-lightGray dark:border-gray-600"
                                    }`}
                                placeholder="Describe detalladamente el proyecto del equipo..."
                                rows={4}
                            />
                            {errors.description && (
                                <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                            )}
                        </div>

                        {/* Objectives */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-semibold text-darkGray dark:text-lightGray mb-2">
                                <MdFlag className="text-primary dark:text-lightGreen" />
                                Objetivos del Proyecto
                            </label>
                            <textarea
                                value={formData.objectives}
                                onChange={(e) => handleInputChange("objectives", e.target.value)}
                                className={`w-full px-4 py-3 border rounded-xl bg-white dark:bg-gray-800 text-darkGray dark:text-lightGray placeholder-grayText resize-none focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-lightGreen transition-all ${errors.objectives
                                    ? "border-red-500 focus:ring-red-500"
                                    : "border-lightGray dark:border-gray-600"
                                    }`}
                                placeholder="Define los objetivos principales que busca alcanzar el equipo..."
                                rows={4}
                            />
                            {errors.objectives && (
                                <p className="text-red-500 text-sm mt-1">{errors.objectives}</p>
                            )}
                        </div>

                        {/* Problem */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-semibold text-darkGray dark:text-lightGray mb-2">
                                <MdReportProblem className="text-primary dark:text-lightGreen" />
                                Problema a Resolver
                            </label>
                            <textarea
                                value={formData.problem}
                                onChange={(e) => handleInputChange("problem", e.target.value)}
                                className={`w-full px-4 py-3 border rounded-xl bg-white dark:bg-gray-800 text-darkGray dark:text-lightGray placeholder-grayText resize-none focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-lightGreen transition-all ${errors.problem
                                    ? "border-red-500 focus:ring-red-500"
                                    : "border-lightGray dark:border-gray-600"
                                    }`}
                                placeholder="Describe el problema específico que el proyecto busca solucionar..."
                                rows={4}
                            />
                            {errors.problem && (
                                <p className="text-red-500 text-sm mt-1">{errors.problem}</p>
                            )}
                        </div>

                        {/* Project Justification */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-semibold text-darkGray dark:text-lightGray mb-2">
                                <MdFormatAlignJustify className="text-primary dark:text-lightGreen" />
                                Justificación del Proyecto
                            </label>
                            <textarea
                                value={formData.projectJustification}
                                onChange={(e) => handleInputChange("projectJustification", e.target.value)}
                                className={`w-full px-4 py-3 border rounded-xl bg-white dark:bg-gray-800 text-darkGray dark:text-lightGray placeholder-grayText resize-none focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-lightGreen transition-all ${errors.projectJustification
                                    ? "border-red-500 focus:ring-red-500"
                                    : "border-lightGray dark:border-gray-600"
                                    }`}
                                placeholder="Explica por qué es importante desarrollar este proyecto..."
                                rows={4}
                            />
                            {errors.projectJustification && (
                                <p className="text-red-500 text-sm mt-1">{errors.projectJustification}</p>
                            )}
                        </div>
                    </form>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 p-6 border-t border-lightGray dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50">
                    <button
                        type="button"
                        onClick={handleClose}
                        className="flex items-center gap-2 px-6 py-3 text-grayText hover:text-darkGray dark:hover:text-lightGray border border-lightGray dark:border-gray-600 rounded-xl hover:bg-white dark:hover:bg-gray-700 transition-all duration-300"
                    >
                        <FaTimes className="text-sm" />
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        onClick={handleSubmit}
                        disabled={loading}
                        className="flex items-center gap-2 px-6 py-3 text-white bg-gradient-to-r from-primary to-lightGreen hover:from-primary/90 hover:to-lightGreen/90 rounded-xl hover:-translate-y-0.5 transition-all duration-300 transform disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                        {loading ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                Guardando...
                            </>
                        ) : (
                            <>
                                <FaSave className="text-sm" />
                                Guardar Información
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
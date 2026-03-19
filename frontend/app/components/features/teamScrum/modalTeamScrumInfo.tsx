"use client";

import { useState, useEffect } from "react";
import { MdInfo, MdDescription, MdFlag, MdReportProblem, MdFormatAlignJustify } from "react-icons/md";
import { TeamsScrum } from "@graphql/generated";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchTeamScrumById } from '@slice/teamScrumSlice';
import Modal from '@components/UI/Modal';
interface ModalTeamInformationProps {
    isOpen: boolean;
    onClose: () => void;
    team: TeamsScrum | null;
    onSave: (teamId: string, data: TeamInfoData) => Promise<boolean>;
}

interface TeamInfoData {
    projectName: string;
    teamName: string;
    description: string;
    objectives: string;
    problem: string;
    projectJustification: string;
    memberIds: { studentId: number; profileId: string }[];
}

const ModalTeamInformation: React.FC<ModalTeamInformationProps> = ({
    isOpen,
    onClose,
    team,
    onSave
}) => {
    const [formData, setFormData] = useState<TeamInfoData>({
        projectName: String(team?.projectName || ""),
        teamName: String(team?.teamName || ""),
        description: String(team?.description || ""),
        objectives: String(team?.objectives || ""),
        problem: String(team?.problem || ""),
        projectJustification: String(team?.projectJustification || ""),
        memberIds:
            team?.students?.map((student: any) => ({
                studentId: student.id,
                profileId: student.profiles?.[0]?.id || "",
            })) || [],
    });


    const dispatch = useDispatch<AppDispatch>();
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Partial<TeamInfoData>>({});
    const teamScrumData = useSelector((state: RootState) => state.teamScrum.dataForTeamScrumById);

    // Efecto para resetear el estado del formulario cuando el equipo cambia
    useEffect(() => {
        if (team) {
            setFormData({
                projectName: String(team.projectName || ""),
                teamName: String(team.teamName || ""),
                description: String(team.description || ""),
                objectives: String(team.objectives || ""),
                problem: String(team.problem || ""),
                projectJustification: String(team.projectJustification || ""),
                memberIds:
                    team.students?.map((student: any) => ({
                        studentId: student.id,
                        profileId: student.profiles?.[0]?.id || "",
                    })) || [],
            });
            dispatch(fetchTeamScrumById({ id: team.id }));
        }
    }, [team, dispatch]);

    // Efecto para actualizar el formulario con datos más frescos si llegan
    useEffect(() => {
        if (teamScrumData && teamScrumData.id === team?.id) {
            setFormData(prev => ({
                ...prev,
                projectName: String(teamScrumData.projectName || ""),
                teamName: String(teamScrumData.teamName || ""),
                description: String(teamScrumData.description || ""),
                objectives: String(teamScrumData.objectives || ""),
                problem: String(teamScrumData.problem || ""),
                projectJustification: String(teamScrumData.projectJustification || ""),
            }));
        }
    }, [teamScrumData, team?.id]);

    const handleInputChange = (field: keyof TeamInfoData, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

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
        if (!team.id) {
            console.error("Falta el ID del equipo");
            return;
        }

        if (!validateForm()) return;

        setLoading(true);

        try {
            const success = await onSave(team.id ?? "", formData);
            if (success) {
                onClose();
            }
        } catch (error) {
            console.error("Error al guardar la información del equipo:", error);
        } finally {
            setLoading(false);
        }
    };


    const handleClose = () => {
        setErrors({});
        onClose();
    };

    if (!team) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            showHeaderAccent={false}
            showCloseButton={false}
            headerClassName="!bg-gradient-to-r !from-[#5cb800] !to-[#8fd400] dark:!from-secondary dark:!to-darkBlue !border-transparent rounded-t-3xl"
            title={
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 dark:bg-white/15 rounded-full flex items-center justify-center border border-white/30">
                        <MdInfo className="text-xl text-white" />
                    </div>
                    <div>
                        <span className="text-lg font-bold text-white">Información del equipo</span>
                        <p className="text-sm text-white/85">{team.teamName}</p>
                    </div>
                </div>
            }
            size="xxxl"
        >
            <div className="max-h-[70vh] overflow-y-auto">
                <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Description */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-semibold text-darkGray dark:text-lightGray mb-2">
                                <MdDescription className="text-gray dark:text-white" />
                                Descripción del proyecto
                            </label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => handleInputChange("description", e.target.value)}
                                className={`w-full px-4 py-3 border rounded-xl bg-white dark:bg-gray-800 text-darkGray dark:text-lightGray placeholder-grayText resize-none focus:outline-none focus:ring-2 focus:ring-lime-600 dark:focus:ring-lime-400 transition-all ${errors.description
                                    ? "border-red-500 focus:ring-red-500"
                                    : "border-lightGray dark:border-gray-600"
                                    }`}
                                placeholder="Describe detalladamente el proyecto del equipo"
                                rows={4}
                            />
                            {errors.description && (
                                <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                            )}
                        </div>

                        {/* Objectives */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-semibold text-darkGray dark:text-lightGray mb-2">
                                <MdFlag className="text-gray dark:text-white" />
                                Objetivos del proyecto
                            </label>
                            <textarea
                                value={formData.objectives}
                                onChange={(e) => handleInputChange("objectives", e.target.value)}
                                className={`w-full px-4 py-3 border rounded-xl bg-white dark:bg-gray-800 text-darkGray dark:text-lightGray placeholder-grayText resize-none focus:outline-none focus:ring-2 focus:ring-lime-600 dark:focus:ring-lime-400 transition-all ${errors.objectives
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
                                <MdReportProblem className="text-gray dark:text-white" />
                                Problema a resolver
                            </label>
                            <textarea
                                value={formData.problem}
                                onChange={(e) => handleInputChange("problem", e.target.value)}
                                className={`w-full px-4 py-3 border rounded-xl bg-white dark:bg-gray-800 text-darkGray dark:text-lightGray placeholder-grayText resize-none focus:outline-none focus:ring-2 focus:ring-lime-600 dark:focus:ring-lime-400 transition-all ${errors.problem
                                    ? "border-red-500 focus:ring-red-500"
                                    : "border-lightGray dark:border-gray-600"
                                    }`}
                                placeholder="Describe el problema específico que el proyecto busca solucionar"
                                rows={4}
                            />
                            {errors.problem && (
                                <p className="text-red-500 text-sm mt-1">{errors.problem}</p>
                            )}
                        </div>

                        {/* Project Justification */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-semibold text-darkGray dark:text-lightGray mb-2">
                                <MdFormatAlignJustify className="text-gray dark:text-white" />
                                Justificación del proyecto
                            </label>
                            <textarea
                                value={formData.projectJustification}
                                onChange={(e) => handleInputChange("projectJustification", e.target.value)}
                                className={`w-full px-4 py-3 border rounded-xl bg-white dark:bg-gray-800 text-darkGray dark:text-lightGray placeholder-grayText resize-none focus:outline-none focus:ring-2 focus:ring-lime-600 dark:focus:ring-lime-400 transition-all ${errors.projectJustification
                                    ? "border-red-500 focus:ring-red-500"
                                    : "border-lightGray dark:border-gray-600"
                                    }`}
                                placeholder="Explica por qué es importante desarrollar este proyecto"
                                rows={4}
                            />
                            {errors.projectJustification && (
                                <p className="text-red-500 text-sm mt-1">{errors.projectJustification}</p>
                            )}
                        </div>

                        {/* Footer con botones */}
                        <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-600">
                            <button
                                type="button"
                                onClick={handleClose}
                                className="flex items-center gap-2 px-6 py-3 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex items-center gap-2 px-6 py-3 text-white bg-gradient-to-r from-[#5cb800] to-[#8fd400] hover:from-lime-700 hover:to-green-700 dark:from-shadowBlue dark:to-darkBlue dark:hover:from-darkBlue dark:hover:to-shadowBlue rounded-xl hover:-translate-y-0.5 transition-all duration-300 transform disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                            >
                                {loading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                        Guardando
                                    </>
                                ) : (
                                    <>
                                        Guardar información
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
        </Modal>
    );
}

export default ModalTeamInformation;
"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useLoader } from '@context/LoaderContext';
import { RootState, AppDispatch } from "@redux/store";
import { fetchTeamScrumByIdWithStudents, updateTeamScrum } from "@slice/teamScrumSlice";
import PageTitle from "@components/UI/pageTitle";
import TeamHeader from "./TeamHeader";
import TeamMembers from "./TeamMembers";
import ProjectInfo from "./ProjectInfo";

const TeamScrumAprendizContainer: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { dataForTeamScrumById, loading, error } = useSelector((state: RootState) => state.teamScrum);
    const { showLoader, hideLoader } = useLoader();

    const [formData, setFormData] = useState({
        teamName: "",
        projectName: "",
        problem: "",
        objectives: "",
        description: "",
        projectJustification: "",
    });

    const [isUpdating, setIsUpdating] = useState(false);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const teamScrumId = "1";

    useEffect(() => {
        if (teamScrumId) {
            dispatch(fetchTeamScrumByIdWithStudents({ id: teamScrumId }));
        }
    }, [dispatch, teamScrumId]);

    useEffect(() => {
        if (loading || isUpdating) {
            showLoader();
        } else {
            hideLoader();
        }
    }, [loading, isUpdating, showLoader, hideLoader]);

    useEffect(() => {
        if (error && !loading) {
            const errorMessage = typeof error === 'string' ? error : error.message || 'Error desconocido';
            toast.error(`Error al cargar el team Scrum: ${errorMessage}`, {
                autoClose: 5000,
                position: "top-right"
            });
        }
    }, [error, loading]);

    useEffect(() => {
        if (dataForTeamScrumById) {
            setFormData({
                teamName: dataForTeamScrumById.teamName || "",
                projectName: dataForTeamScrumById.projectName || "",
                problem: dataForTeamScrumById.problem || "",
                objectives: dataForTeamScrumById.objectives || "",
                description: dataForTeamScrumById.description || "",
                projectJustification: dataForTeamScrumById.projectJustification || "",
            });
            setHasUnsavedChanges(false);
        }
    }, [dataForTeamScrumById]);

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (!hasUnsavedChanges) {
            setHasUnsavedChanges(true);
        }
    };

    const handleUpdateTeamScrum = async () => {
        if (!teamScrumId || !dataForTeamScrumById) {
            toast.error("No se puede actualizar: datos incompletos");
            return;
        }

        if (!formData.teamName.trim()) {
            toast.error("El nombre del equipo es obligatorio");
            return;
        }

        if (!formData.projectName.trim()) {
            toast.error("El nombre del proyecto es obligatorio");
            return;
        }

        try {
            setIsUpdating(true);

            const updatePayload: any = {
                id: dataForTeamScrumById.id,
                teamName: formData.teamName,
                projectName: formData.projectName,
                problem: formData.problem,
                objectives: formData.objectives,
                description: formData.description,
                projectJustification: formData.projectJustification,
            };

            if (dataForTeamScrumById.studySheet?.id) {
                updatePayload.studySheetId = parseInt(dataForTeamScrumById.studySheet.id);
            }

            if (dataForTeamScrumById.students && dataForTeamScrumById.students.length > 0) {
                const memberIds = dataForTeamScrumById.students
                    .filter(student => student?.id)
                    .map(student => ({
                        studentId: parseInt(student!.id!),
                        profileId: student?.profiles?.[0]?.id || null,
                        id: null
                    }));

                if (memberIds.length > 0) {
                    updatePayload.memberIds = memberIds;
                }
            }

            await dispatch(updateTeamScrum({
                id: teamScrumId,
                input: updatePayload
            })).unwrap();

            toast.success("¡Información del team scrum actualizada exitosamente!", {
                autoClose: 4000,
                position: "top-right"
            });

            setHasUnsavedChanges(false);
            await dispatch(fetchTeamScrumByIdWithStudents({ id: teamScrumId })).unwrap();

        } catch (error: any) {
            console.error("Error al actualizar team scrum:", error);

            if (error?.message) {
                toast.error(`Error al actualizar: ${error.message}`);
            } else if (typeof error === 'string') {
                toast.error(`Error al actualizar: ${error}`);
            } else {
                toast.error("Error inesperado al actualizar la información");
            }
        } finally {
            setIsUpdating(false);
        }
    };

    const projectSections = [
        { field: "problem", label: "Problemática", placeholder: "¿Cuál es la problemática de su proyecto?", value: formData.problem },
        { field: "objectives", label: "Objetivo", placeholder: "¿Cuál es el objetivo de su proyecto?", value: formData.objectives },
        { field: "description", label: "Descripción", placeholder: "Describa el Proyecto", value: formData.description },
        { field: "projectJustification", label: "Justificación", placeholder: "Justifique el proyecto", value: formData.projectJustification },
    ];

    if (loading && !dataForTeamScrumById) {
        return null;
    }

    if (error) {
        return (
            <div className="w-full flex flex-col justify-center items-center min-h-screen">
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 max-w-md mx-auto">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-red-100 dark:bg-red-800 rounded-full flex items-center justify-center">
                            <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-red-800 dark:text-red-200">Error al cargar</h3>
                    </div>
                    <p className="text-red-600 dark:text-red-300">
                        {typeof error === 'string' ? error : error.message}
                    </p>
                    <button
                        onClick={() => dispatch(fetchTeamScrumByIdWithStudents({ id: teamScrumId }))}
                        className="mt-4 w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                    >
                        Reintentar
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full px-2 sm:px-4 lg:px-0">
            <PageTitle>Mi team scrum</PageTitle>

            <TeamHeader
                teamName={formData.teamName}
                projectName={formData.projectName}
                studySheet={dataForTeamScrumById?.studySheet}
            />

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
                <TeamMembers students={dataForTeamScrumById?.students} />
                
                <ProjectInfo
                    projectName={formData.projectName}
                    projectSections={projectSections}
                    isUpdating={isUpdating}
                    hasUnsavedChanges={hasUnsavedChanges}
                    onInputChange={handleInputChange}
                    onUpdate={handleUpdateTeamScrum}
                />
            </div>
        </div>
    );
}

export default TeamScrumAprendizContainer;
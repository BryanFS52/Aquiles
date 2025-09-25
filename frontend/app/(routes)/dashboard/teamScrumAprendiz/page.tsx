"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IoPersonCircleSharp, IoCalendar } from "react-icons/io5";
import { MdGroups } from "react-icons/md";
import { FaArrowLeft, FaArrowRight, FaHashtag, FaUsers, FaProjectDiagram } from "react-icons/fa";
import { toast } from "react-toastify";
import { useLoader } from '@context/LoaderContext';
import { RootState, AppDispatch } from "@redux/store";
import { fetchTeamScrumByIdWithStudents, updateTeamScrum } from "@slice/teamScrumSlice";
import Slider, { Settings } from "react-slick";
import PageTitle from "@components/UI/pageTitle";

interface ArrowProps {
    onClick?: () => void;
}

const CustomNextArrow: React.FC<ArrowProps> = ({ onClick }) => (
    <div
        className="absolute top-1/2 right-2 -translate-y-1/2 bg-primary/90 hover:bg-primary-light dark:bg-secondary/90 dark:hover:bg-darkBlue transition-all duration-300 text-white p-2 rounded-full cursor-pointer z-20 shadow-lg hover:scale-110"
        onClick={onClick}
    >
        <FaArrowRight className="text-sm" />
    </div>
);

const CustomPrevArrow: React.FC<ArrowProps> = ({ onClick }) => (
    <div
        className="absolute top-1/2 left-2 -translate-y-1/2 bg-primary/90 hover:bg-primary-light dark:bg-secondary/90 dark:hover:bg-darkBlue transition-all duration-300 text-white p-2 rounded-full cursor-pointer z-20 shadow-lg hover:scale-110"
        onClick={onClick}
    >
        <FaArrowLeft className="text-sm" />
    </div>
);

export default function TeamScrum() {
    const dispatch = useDispatch<AppDispatch>();
    const { dataForTeamScrumById, loading, error } = useSelector((state: RootState) => state.teamScrum);
    const { showLoader, hideLoader } = useLoader();

    // Estado local para el formulario
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

    // Controlar el loader basado en el estado de loading
    useEffect(() => {
        if (loading || isUpdating) {
            showLoader();
        } else {
            hideLoader();
        }
    }, [loading, isUpdating, showLoader, hideLoader]);

    // Manejar errores de carga
    useEffect(() => {
        if (error && !loading) {
            const errorMessage = typeof error === 'string' ? error : error.message || 'Error desconocido';
            toast.error(`Error al cargar el Team Scrum: ${errorMessage}`, {
                autoClose: 5000,
                position: "top-right"
            });
        }
    }, [error, loading]);

    // Actualizar el estado local cuando se cargan los datos
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
            setHasUnsavedChanges(false); // Resetear estado de cambios sin guardar
        }
    }, [dataForTeamScrumById]);

    // Handler para cambios en los inputs
    const handleInputChange = (field: keyof typeof formData, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

        // Marcar que hay cambios sin guardar
        if (!hasUnsavedChanges) {
            setHasUnsavedChanges(true);
        }
    };

    // Handler para actualizar información
    const handleUpdateTeamScrum = async () => {
        if (!teamScrumId || !dataForTeamScrumById) {
            toast.error("No se puede actualizar: datos incompletos");
            return;
        }

        // Validaciones básicas
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

            // Construir el payload de actualización
            const updatePayload: any = {
                id: dataForTeamScrumById.id,
                teamName: formData.teamName,
                projectName: formData.projectName,
                problem: formData.problem,
                objectives: formData.objectives,
                description: formData.description,
                projectJustification: formData.projectJustification,
            };

            // Solo incluir studySheetId si existe
            if (dataForTeamScrumById.studySheet?.id) {
                updatePayload.studySheetId = parseInt(dataForTeamScrumById.studySheet.id);
            }

            // Solo incluir memberIds si hay estudiantes con datos válidos
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

            toast.success("¡Información del Team Scrum actualizada exitosamente!", {
                autoClose: 4000,
                position: "top-right"
            });

            // Resetear estado de cambios sin guardar
            setHasUnsavedChanges(false);

            // Recargar los datos después de la actualización
            await dispatch(fetchTeamScrumByIdWithStudents({ id: teamScrumId })).unwrap();

        } catch (error: any) {
            console.error("Error al actualizar team scrum:", error);

            // Manejar diferentes tipos de errores
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

    const projectSections = [
        {
            field: "problem" as keyof typeof formData,
            label: "Problemática",
            placeholder: "¿Cuál es la problemática de su Proyecto?",
            value: formData.problem
        },
        {
            field: "objectives" as keyof typeof formData,
            label: "Objetivo",
            placeholder: "¿Cuál es el objetivo de su Proyecto?",
            value: formData.objectives
        },
        {
            field: "description" as keyof typeof formData,
            label: "Descripción",
            placeholder: "Describa el Proyecto",
            value: formData.description
        },
        {
            field: "projectJustification" as keyof typeof formData,
            label: "Justificación",
            placeholder: "Justifique el Proyecto",
            value: formData.projectJustification
        },
    ];

    // Mostrar loader mientras se cargan los datos iniciales
    if (loading && !dataForTeamScrumById) {
        return null; // El loader se maneja por el LoaderContext
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
                        onClick={() => {
                            dispatch(fetchTeamScrumByIdWithStudents({ id: teamScrumId }));
                        }}
                        className="mt-4 w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                    >
                        Reintentar
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full">
            <PageTitle>Mi Team Scrum</PageTitle>

            {/* Encabezado del equipo */}
            <div className="bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-shadowBlue dark:via-darkBlue dark:to-shadowBlue/80 rounded-3xl p-6 mb-8 shadow-2xl border border-lightGray/50 dark:border-darkGray/50 backdrop-blur-sm relative overflow-hidden">
                {/* Decorative background elements */}
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
                            {formData.teamName || "Nombre del Team"}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
                            <div className="flex items-center justify-center gap-3 bg-gradient-to-r from-white to-gray-50 dark:from-darkBlue/70 dark:to-shadowBlue/70 rounded-xl p-4 border border-lightGray/30 dark:border-darkGray/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group">
                                <div className="p-2 bg-primary/10 dark:bg-secondary/10 rounded-lg group-hover:bg-primary/20 dark:group-hover:bg-secondary/20 transition-colors">
                                    <FaProjectDiagram className="text-primary dark:text-secondary text-lg" />
                                </div>
                                <div className="text-left">
                                    <p className="text-xs text-grayText dark:text-gray-400 font-medium">Proyecto</p>
                                    <span className="font-semibold text-black dark:text-white text-sm">
                                        {formData.projectName || 'Sin nombre'}
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
                                        {dataForTeamScrumById?.studySheet?.number ? `${dataForTeamScrumById.studySheet.number}` : 'N/A'}
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
                                        {dataForTeamScrumById?.studySheet?.quarter?.[0]?.name?.extension || 'N/A'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Contenido principal */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {/* Sección de aprendices */}
                <div className="bg-gradient-to-br from-white via-gray-50 to-white dark:from-shadowBlue dark:via-darkBlue dark:to-shadowBlue rounded-3xl p-6 shadow-2xl border border-lightGray/30 dark:border-darkGray/30 backdrop-blur-sm relative overflow-hidden">
                    {/* Decorative elements */}
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
                        {dataForTeamScrumById?.students?.map((student, idx) => (
                            <div
                                key={idx}
                                className="group bg-gradient-to-r from-white via-gray-50 to-white dark:from-darkBlue/60 dark:via-shadowBlue/60 dark:to-darkBlue/60 rounded-2xl p-5 transition-all duration-500 cursor-pointer shadow-lg hover:shadow-2xl hover:scale-[1.03] hover:-translate-y-1 relative overflow-hidden border border-lightGray/20 dark:border-darkGray/20"
                            >
                                {/* Gradient overlay on hover */}
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
                        )) || (
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

                {/* Sección del proyecto */}
                <div className="bg-gradient-to-br from-white via-blue-50/30 to-white dark:from-shadowBlue dark:via-blue-900/10 dark:to-shadowBlue rounded-3xl p-6 shadow-2xl border border-lightGray/30 dark:border-darkGray/30 backdrop-blur-sm relative overflow-hidden">
                    {/* Decorative elements */}
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
                                value={formData.projectName}
                                className="w-full border-2 border-lightGray/50 dark:border-darkBlue/50 rounded-xl p-4 bg-gradient-to-r from-white to-gray-50/50 dark:from-darkBlue/80 dark:to-shadowBlue/80 text-black dark:text-white focus:outline-none focus:border-blue-400 dark:focus:border-blue-500 focus:ring-4 focus:ring-blue-100/50 dark:focus:ring-blue-900/30 transition-all duration-300 shadow-inner hover:shadow-lg disabled:opacity-50 placeholder-gray-400 dark:placeholder-gray-500"
                                placeholder="Escribe el nombre de tu proyecto..."
                                onChange={(e) => handleInputChange('projectName', e.target.value)}
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
                                            onChange={(e) => handleInputChange(item.field, e.target.value)}
                                            disabled={isUpdating}
                                        />
                                    </div>
                                </div>
                            ))}
                        </Slider>
                    </div>

                    {/* Botón Actualizar Información */}
                    <div className="flex justify-center mt-10 relative z-10">
                        <button
                            onClick={handleUpdateTeamScrum}
                            disabled={isUpdating || loading}
                            className={`group relative bg-gradient-to-r from-lime-600 to-green-600 hover:from-lime-700 hover:to-green-700 text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-lg focus:outline-none focus:ring-4 focus:ring-lime-500/50 active:scale-95 flex items-center justify-center gap-3 min-w-[200px] ${hasUnsavedChanges ? 'animate-pulse' : ''}`}
                        >
                            {/* Content */}
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

                            {/* Hover overlay effect */}
                            <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
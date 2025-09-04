"use client";

import PageTitle from "@components/UI/pageTitle";
import DataTable from "@components/UI/DataTable";
import type { DataTableColumn } from "@components/UI/DataTable/types";
import type { AppDispatch } from "@redux/store"
import { useDispatch, useSelector } from "react-redux"
import {fetchImprovementPlans} from "@slice/improvementPlanSlice";
import React, { useEffect } from "react";
import { FiUser, FiMapPin, FiCalendar, FiFileText, FiStar, FiBook } from "react-icons/fi";

interface ImprovementPlan {
    id: string;
    city: string;
    date: string;
    reason: string;
    qualification: number;
    state: boolean;
    student: {
        id: string;
        person: {
            id: string;
            name: string;
            lastname: string;
        };
    } | null;
    teacherCompetence: {
        id: string;
        competence: {
            id: string;
            name: string;
        };
    } | null;
    faultType?: {
        id: string;
        name: string;
    };
}

const HistorialPlanesMejoramientoInstructor = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { data: improvementPlans, loading, error } = useSelector((state: any) => state.improvementPlan);

    // Detectar modo oscuro
    const [isDarkMode, setIsDarkMode] = React.useState(false);

    useEffect(() => {
        // Función para detectar el modo oscuro
        const checkDarkMode = () => {
            const isDark = document.documentElement.classList.contains('dark');
            console.log('Dark mode detected:', isDark); // Debug
            setIsDarkMode(isDark);
        };

        // Verificar inmediatamente
        checkDarkMode();

        // Crear un observer para detectar cambios en la clase 'dark'
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    checkDarkMode();
                }
            });
        });

        // Observar cambios en el elemento html
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class']
        });

        // Limpiar el observer
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        dispatch(fetchImprovementPlans({ page: 0, size: 50 }));
    }, [dispatch]);

    // Función para formatear fecha en horizontal
    const formatDate = (dateString: string) => {
        if (!dateString) return 'No especificada';
        return new Date(dateString).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    // Función para obtener color de calificación
    const getQualificationColor = (qualification: number | boolean | null) => {
        if (qualification === false || qualification === null || qualification === undefined) {
            return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30';
        }
        if (qualification === true) {
            return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30';
        }
        const numQualification = Number(qualification);
        if (numQualification >= 3.0) {
            return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30';
        }
        return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30';
    };

    // Configuración de columnas para la tabla
    const columns: DataTableColumn<ImprovementPlan>[] = [
        {
            key: 'student',
            header: 'Estudiante',
            render: (row) => (
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-primary to-lightGreen dark:from-secondary dark:to-darkBlue rounded-full flex items-center justify-center text-white font-bold text-xs">
                        {row.student?.person?.name?.charAt(0)?.toUpperCase() || 'N'}
                    </div>
                    <div>
                        <p className="font-medium text-gray-900 dark:text-white text-sm uppercase">
                            {row.student?.person ? 
                                `${row.student.person.name} ${row.student.person.lastname}`.toUpperCase() : 
                                'ESTUDIANTE NO DISPONIBLE'
                            }
                        </p>
                    </div>
                </div>
            )
        },
        {
            key: 'teacherCompetence',
            header: 'Competencia',
            render: (row) => {
                const competenceName = (row.teacherCompetence?.competence?.name || 'NO ESPECIFICADA').toUpperCase();
                const truncatedName = competenceName.length > 50 
                    ? competenceName.substring(0, 50) + '...' 
                    : competenceName;
                
                return (
                    <div className="flex items-center gap-2 whitespace-nowrap" title={competenceName}>
                        <FiBook className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        <span className="text-sm font-medium text-gray-700 dark:text-white">
                            {truncatedName}
                        </span>
                    </div>
                );
            }
        },
        {
            key: 'date',
            header: 'Fecha',
            render: (row) => (
                <div className="flex items-center gap-2 whitespace-nowrap">
                    <FiCalendar className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    <span className="text-sm text-gray-700 dark:text-white">
                        {formatDate(row.date)}
                    </span>
                </div>
            )
        },
        {
            key: 'city',
            header: 'Ciudad',
            render: (row) => (
                <div className="flex items-center gap-2">
                    <FiMapPin className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    <span className="text-sm text-gray-700 dark:text-white uppercase">
                        {(row.city || 'NO ESPECIFICADA').toUpperCase()}
                    </span>
                </div>
            )
        },
        {
            key: 'qualification',
            header: 'Calificación',
            render: (row) => (
                <div className="flex items-center gap-2">
                    <FiStar className="w-4 h-4 text-yellow-500 dark:text-yellow-400" />
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getQualificationColor(row.qualification)}`}>
                        {(
                            typeof row.qualification === "boolean" && row.qualification === false
                        ) || row.qualification === null || row.qualification === undefined
                            ? 'NO APROBADO'
                            : typeof row.qualification === "boolean" && row.qualification === true
                            ? 'APROBADO'
                            : Number(row.qualification) >= 3.0
                            ? 'APROBADO'
                            : 'NO APROBADO'
                        }
                    </span>
                </div>
            )
        },
        {
            key: 'state',
            header: 'Estado',
            render: (row) => (
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    row.state 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                }`}>
                    <span className={`w-1.5 h-1.5 mr-1.5 rounded-full ${
                        row.state ? 'bg-green-400' : 'bg-red-400'
                    }`}></span>
                    {row.state ? 'ACTIVO' : 'INACTIVO'}
                </span>
            )
        },
        {
            key: 'faultType',
            header: 'Tipo de Falta',
            render: (row) => (
                <div className="flex items-center gap-2">
                    {row.faultType ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400">
                            {row.faultType.name.toUpperCase()}
                        </span>
                    ) : (
                        <span className="text-sm text-gray-500 dark:text-gray-400 italic">
                            Sin tipo de falta
                        </span>
                    )}
                </div>
            )
        },
        {
            key: 'reason',
            header: 'Razón',
            render: (row) => (
                <div className="max-w-xs">
                    <div 
                        className="text-sm text-gray-700 dark:text-white truncate cursor-help uppercase" 
                        title={row.reason?.toUpperCase()}
                    >
                        <FiFileText className="w-4 h-4 inline mr-1 text-gray-500 dark:text-gray-400" />
                        {(row.reason || 'SIN RAZÓN ESPECIFICADA').toUpperCase()}
                    </div>
                </div>
            )
        }
    ];

    // Función de filtro personalizada
    const filterFunction = (row: ImprovementPlan, filter: string) => {
        const searchTerm = filter.toLowerCase();
        return (
            (row.student?.person?.name?.toLowerCase().includes(searchTerm)) ||
            (row.student?.person?.lastname?.toLowerCase().includes(searchTerm)) ||
            (row.teacherCompetence?.competence?.name?.toLowerCase().includes(searchTerm)) ||
            (row.city?.toLowerCase().includes(searchTerm)) ||
            (row.reason?.toLowerCase().includes(searchTerm)) ||
            (row.faultType?.name?.toLowerCase().includes(searchTerm)) ||
            (row.qualification?.toString().includes(searchTerm))
        );
    };

    if (loading) {
        return (
            <div className="mx-auto px-4 py-8">
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary dark:border-lightGreen"></div>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">Cargando planes de mejoramiento...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="mx-auto px-4 py-8">
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl shadow-lg p-6">
                    <div className="flex items-start">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-400 dark:text-red-500" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-red-800 dark:text-red-400">
                                Error al cargar los datos
                            </h3>
                            <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                                {typeof error === 'string' ? error : 'Ha ocurrido un error inesperado al cargar los planes de mejoramiento.'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!loading && (!improvementPlans || improvementPlans.length === 0)) {
        return (
            <div className="mx-auto px-4 py-8">
                <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <PageTitle>Historial De Planes De Mejoramiento</PageTitle>
                        </div>
                    </div>

                    {/* Dashboard Stats - Estado vacío */}
                    <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        <div className="bg-white dark:bg-shadowBlue rounded-2xl shadow-lg p-5 text-center border border-lightGray dark:border-grayText">
                            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-2xl mb-3 mx-auto">
                                <FiFileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <h3 className="text-2xl font-bold text-black dark:text-white mb-1">0</h3>
                            <p className="text-gray-600 dark:text-gray-300 font-medium">Planes Totales</p>
                        </div>
                        <div className="bg-white dark:bg-shadowBlue rounded-2xl shadow-lg p-5 text-center border border-lightGray dark:border-grayText">
                            <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-2xl mb-3 mx-auto">
                                <FiStar className="w-6 h-6 text-lightGreen dark:text-darkGreen" />
                            </div>
                            <h3 className="text-2xl font-bold text-black dark:text-white mb-1">0</h3>
                            <p className="text-gray-600 dark:text-gray-300 font-medium">Aprobados</p>
                        </div>
                        <div className="bg-white dark:bg-shadowBlue rounded-2xl shadow-lg p-5 text-center border border-lightGray dark:border-grayText">
                            <div className="inline-flex items-center justify-center w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-2xl mb-3 mx-auto">
                                <FiFileText className="w-6 h-6 text-red-600 dark:text-red-400" />
                            </div>
                            <h3 className="text-2xl font-bold text-black dark:text-white mb-1">0</h3>
                            <p className="text-gray-600 dark:text-gray-300 font-medium">No Aprobados</p>
                        </div>
                    </div>
                    
                    <div className="text-center py-12">
                        <div className="bg-white dark:bg-shadowBlue rounded-2xl shadow-lg p-8 border border-lightGray dark:border-grayText">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full mb-4 mx-auto">
                                <FiFileText className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                            </div>
                            <h3 className="text-lg font-semibold text-black dark:text-white mb-2">
                                No se encontraron planes de mejoramiento
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                                Aún no hay planes de mejoramiento registrados en el sistema.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto px-4 py-8">
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <PageTitle>Historial De Planes De Mejoramiento</PageTitle>
                    </div>
                </div>

                {/* Dashboard Stats */}
                <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    <div className="bg-white dark:bg-shadowBlue rounded-2xl shadow-lg p-5 text-center border border-lightGray dark:border-grayText">
                        <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-2xl mb-3 mx-auto">
                            <FiFileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-black dark:text-white mb-1">{improvementPlans?.length || 0}</h3>
                        <p className="text-gray-600 dark:text-gray-300 font-medium">Planes Totales</p>
                    </div>
                    <div className="bg-white dark:bg-shadowBlue rounded-2xl shadow-lg p-5 text-center border border-lightGray dark:border-grayText">
                        <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-2xl mb-3 mx-auto">
                            <FiStar className="w-6 h-6 text-lightGreen dark:text-darkGreen" />
                        </div>
                        <h3 className="text-2xl font-bold text-black dark:text-white mb-1">
                            {improvementPlans?.filter((plan: ImprovementPlan) => 
                                (typeof plan.qualification === "boolean" && plan.qualification === true) ||
                                (typeof plan.qualification === "number" && plan.qualification >= 3.0)
                            ).length || 0}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 font-medium">Aprobados</p>
                    </div>
                    <div className="bg-white dark:bg-shadowBlue rounded-2xl shadow-lg p-5 text-center border border-lightGray dark:border-grayText">
                        <div className="inline-flex items-center justify-center w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-2xl mb-3 mx-auto">
                            <FiFileText className="w-6 h-6 text-red-600 dark:text-red-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-black dark:text-white mb-1">
                            {improvementPlans?.filter((plan: ImprovementPlan) => 
                                (typeof plan.qualification === "boolean" && plan.qualification === false) ||
                                plan.qualification === null || 
                                plan.qualification === undefined ||
                                (typeof plan.qualification === "number" && plan.qualification < 3.0)
                            ).length || 0}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 font-medium">No Aprobados</p>
                    </div>
                </div>

                <DataTable<ImprovementPlan>
                    columns={columns}
                    data={improvementPlans || []}
                    pageSize={10}
                    filterPlaceholder="Buscar por estudiante, competencia, ciudad, tipo de falta..."
                    filterFunction={filterFunction}
                    className="shadow-lg"
                    isDarkMode={isDarkMode}
                />
            </div>
        </div>
    );
};

export default HistorialPlanesMejoramientoInstructor;           
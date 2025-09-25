"use client";

import PageTitle from "@components/UI/pageTitle";
import DataTable from "@components/UI/DataTable";
import type { DataTableColumn } from "@components/UI/DataTable/types";
import Paginator from "@components/UI/Paginator/Paginator";
import type { AppDispatch } from "@redux/store"
import { useDispatch, useSelector } from "react-redux"
import {fetchImprovementPlans} from "@slice/improvementPlanSlice";
import React, { useEffect } from "react";
import { FiMapPin, FiCalendar, FiFileText, FiStar, FiBook, FiPlus, FiArrowLeft } from "react-icons/fi";
import { ImprovementPlan } from "@/graphql/generated";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";



const HistorialPlanesMejoramientoInstructor = () => {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const searchParams = useSearchParams();
    const { 
        data: allImprovementPlans, 
        loading, 
        error, 
        totalPages, 
        totalItems, 
        currentPage 
    } = useSelector((state: any) => state.improvementPlan);

    // Obtener datos de la ficha desde los query parameters
    const fichaDataString = searchParams.get('fichaData');
    const fichaData = React.useMemo(() => {
        return fichaDataString ? JSON.parse(decodeURIComponent(fichaDataString)) : null;
    }, [fichaDataString]);
    
    // Memorizar el ID de la ficha para evitar renders innecesarios
    const fichaId = React.useMemo(() => fichaData?.id || null, [fichaData?.id]);
    
    // Filtrar por ficha en frontend si el backend no lo hace correctamente
    const improvementPlans = React.useMemo(() => {
        if (!fichaData || !allImprovementPlans) return [];
        // Filtrar por los ids de estudiantes de la ficha
        return allImprovementPlans.filter((plan: ImprovementPlan) =>
            plan.student?.id && fichaData.studentIds.includes(plan.student.id)
        );
    }, [allImprovementPlans, fichaData]);
    
    // Estado para manejar la página actual (Paginator espera páginas basadas en 1)
    const [page, setPage] = React.useState(1);

    // Detectar modo oscuro
    const [isDarkMode, setIsDarkMode] = React.useState(false);
    
    // Función para manejar cambio de página
    const handlePageChange = React.useCallback((newPage: number) => {
        if (loading || newPage === page) return; // Evitar llamadas duplicadas
        
        setPage(newPage);
        // No necesitamos dispatch aquí porque el useEffect se encargará cuando page cambie
    }, [loading, page]);

    // useEffect para detectar modo oscuro - solo se ejecuta una vez
    useEffect(() => {
        const checkDarkMode = () => {
            const isDark = document.documentElement.classList.contains('dark');
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
    }, []); // Array vacío - solo se ejecuta una vez

    // useEffect para hacer fetch de datos - ahora sí filtra por ficha en el backend
    useEffect(() => {
        if (!fichaId) return;
        dispatch(fetchImprovementPlans({ 
            page: page - 1, // Backend espera páginas basadas en 0
            size: 5,
            idStudySheet: fichaId
        }));
    }, [dispatch, page, fichaId]);

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
            key: 'document',
            header: 'Documento',
            render: (row) => (
                <div className="text-center">
                    <span className="text-sm font-medium text-gray-700 dark:text-white font-mono">
                        {row.student?.person?.document || 'Sin documento'}
                    </span>
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
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${getQualificationColor(row.qualification)}`}>
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
            render: (row) => {
                const getFaultTypeColor = (faultTypeName: string) => {
                    const name = faultTypeName.toLowerCase();
                    if (name.includes('academica') || name.includes('académica')) {
                        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
                    } else if (name.includes('disciplinaria')) {
                        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
                    }
                    // Color por defecto
                    return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
                };

                return (
                    <div className="flex items-center gap-2">
                        {row.faultType ? (
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getFaultTypeColor(row.faultType.name || '')}`}>
                                {(row.faultType?.name ? row.faultType.name.toUpperCase() : 'SIN TIPO DE FALTA')}
                            </span>
                        ) : (
                            <span className="text-sm text-gray-500 dark:text-gray-400 italic">
                                Sin tipo de falta
                            </span>
                        )}
                    </div>
                );
            }
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
        const searchTerm = filter.toLowerCase().trim();
        if (!searchTerm) return true;
        
        // Función auxiliar para normalizar texto (quitar tildes y convertir a minúsculas)
        const normalizeText = (text: string) => {
            return text.toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '');
        };
        
        const normalizedSearch = normalizeText(searchTerm);
        
        return (
            // Búsqueda en datos del estudiante
            (row.student?.person?.name && normalizeText(row.student.person.name).includes(normalizedSearch)) ||
            (row.student?.person?.lastname && normalizeText(row.student.person.lastname).includes(normalizedSearch)) ||
            (row.student?.person?.document && row.student.person.document.includes(searchTerm)) ||
            // Búsqueda en competencia
            (row.teacherCompetence?.competence?.name && normalizeText(row.teacherCompetence.competence.name).includes(normalizedSearch)) ||
            // Búsqueda en ciudad
            (row.city && normalizeText(row.city).includes(normalizedSearch)) ||
            // Búsqueda en razón
            (row.reason && normalizeText(row.reason).includes(normalizedSearch)) ||
            // Búsqueda en tipo de falta
            (row.faultType?.name && normalizeText(row.faultType.name).includes(normalizedSearch)) ||
            // Búsqueda por palabras clave específicas de tipo de falta
            (row.faultType?.name && (
                (normalizeText(row.faultType.name).includes('academica') && normalizedSearch.includes('academica')) ||
                (normalizeText(row.faultType.name).includes('disciplinaria') && normalizedSearch.includes('disciplinaria'))
            )) ||
            // Búsqueda por estado de calificación
            (normalizedSearch.includes('aprobado') && !normalizedSearch.includes('no') && (
                (typeof row.qualification === "boolean" && row.qualification === true) ||
                (typeof row.qualification === "number" && row.qualification >= 3.0)
            )) ||
            ((normalizedSearch.includes('no aprobado') || normalizedSearch.includes('noaprobado')) && (
                (typeof row.qualification === "boolean" && row.qualification === false) ||
                row.qualification === null || 
                row.qualification === undefined ||
                (typeof row.qualification === "number" && row.qualification < 3.0)
            )) ||
            // Búsqueda por calificación numérica
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
                    <div>
                        <PageTitle>
                            {fichaData 
                                ? `Planes de Mejoramiento - Ficha N° ${fichaData.fichaNumber}`
                                : `Historial De Planes De Mejoramiento`
                            }
                        </PageTitle>
                        {fichaData && (
                            <button
                                onClick={() => router.back()}
                                className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-lightGreen transition-colors duration-200 mt-2"
                            >
                                <FiArrowLeft className="w-4 h-4 mr-1" />
                                Volver a Fichas
                            </button>
                        )}
                        {/* Botón debajo del título, con degradado verde */}
                        <div className="mt-4">
                            <Link href={fichaData 
                                ? `./FormularioPlanesDeMejoramiento?fichaData=${encodeURIComponent(JSON.stringify(fichaData))}`
                                : "./FormularioPlanesDeMejoramiento"
                            }>
                                <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-lightGreen to-primary hover:from-primary hover:to-lightGreen focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-lightGreen transition-colors duration-200 shadow-lg">
                                    <FiPlus className="w-4 h-4 mr-2" />
                                    Crear Nuevo Plan de Mejoramiento
                                </button>
                            </Link>
                        </div>
                        {fichaData && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                                Mostrando planes de mejoramiento de {fichaData.totalStudents} estudiantes de la ficha N° {fichaData.fichaNumber}
                            </p>
                        )}
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
                                {fichaData 
                                    ? `No hay planes de mejoramiento registrados para los estudiantes de la ficha N° ${fichaData.fichaNumber}.`
                                    : 'Aún no hay planes de mejoramiento registrados en el sistema.'
                                }
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
                <div>
                    <PageTitle>Historial De Planes De Mejoramiento</PageTitle>
                    <button
                        onClick={() => router.back()}
                        className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-lightGreen transition-colors duration-200 mt-2"
                    >
                        <FiArrowLeft className="w-4 h-4 mr-1" />
                        Volver
                    </button>
                    {/* Botón debajo del título, con degradado verde */}
                    <div className="mt-4">
                        <Link href={fichaData 
                            ? `./FormularioPlanesDeMejoramiento?fichaData=${encodeURIComponent(JSON.stringify(fichaData))}`
                            : "./FormularioPlanesDeMejoramiento"
                        }>
                            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-lightGreen to-primary hover:from-primary hover:to-lightGreen focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-lightGreen transition-colors duration-200 shadow-lg">
                                <FiPlus className="w-4 h-4 mr-2" />
                                Crear Nuevo Plan de Mejoramiento
                            </button>
                        </Link>
                    </div>
                </div>

                {/* Dashboard Stats */}
                <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    <div className="bg-white dark:bg-shadowBlue rounded-2xl shadow-lg p-5 text-center border border-lightGray dark:border-grayText">
                        <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-2xl mb-3 mx-auto">
                            <FiFileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-black dark:text-white mb-1">{improvementPlans?.length || 0}</h3>
                        <p className="text-gray-600 dark:text-gray-300 font-medium">Planes Totales (Ficha)</p>
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
                        <p className="text-gray-600 dark:text-gray-300 font-medium">Aprobados (página actual)</p>
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
                        <p className="text-gray-600 dark:text-gray-300 font-medium">No Aprobados (página actual)</p>
                    </div>
                </div>

                <DataTable<ImprovementPlan>
                    columns={columns}
                    data={improvementPlans || []}
                    filterPlaceholder="Buscar..."
                    filterFunction={filterFunction}
                    className="shadow-lg"
                    isDarkMode={isDarkMode}
                />
                
                {/* Paginación externa para manejar paginación del servidor */}
                {totalPages > 1 && (
                    <div className="mt-6">
                        <Paginator
                            page={page}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                            isDarkMode={isDarkMode}
                        />
                    </div>
                )}
                

            </div>
        </div>
    );
};

export default HistorialPlanesMejoramientoInstructor;           
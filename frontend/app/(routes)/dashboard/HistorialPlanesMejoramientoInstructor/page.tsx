"use client";

import React, { useEffect, Suspense } from "react";
import PageTitle from "@components/UI/pageTitle";
import DataTable from "@components/UI/DataTable";
import type { DataTableColumn } from "@components/UI/DataTable/types";
import type { AppDispatch } from "@redux/store"
import { useDispatch, useSelector } from "react-redux"
import {fetchImprovementPlans} from "@slice/improvementPlanSlice";
import { clientLAN } from "@lib/apollo-client";
import { GET_STUDY_SHEET_BY_ID, GET_LEARNING_OUTCOMES_BY_COMPETENCE, GET_TEACHER_COMPETENCES_BY_STUDY_SHEET } from "@graphql/olympo/studySheetGraph";
import { GET_IMPROVEMENT_PLAN_EVALUATION_BY_PLAN_ID } from "@graphql/improvementPlanEvaluationGraph";
import { FiMapPin, FiCalendar, FiFileText, FiStar, FiEye, FiPlus, FiArrowLeft, FiCheck } from "react-icons/fi";
import { ImprovementPlan as BaseImprovementPlan } from "@graphql/generated";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useUser } from "@context/UserContext";

// Extender el tipo para incluir faultType que puede venir del backend
interface ImprovementPlan extends BaseImprovementPlan {
  faultType?: {
    id: string;
    name: string;
  } | null;
}

const HistorialPlanesMejoramientoInstructorContent = () => {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user } = useUser();
    const { 
        data: allImprovementPlans, 
        loading, 
        error, 
        totalPages, 
        totalItems, 
        currentPage,
        metaStudySheet
    } = useSelector((state: any) => {
        console.log('Redux state improvementPlan:', state.improvementPlan);
        return state.improvementPlan;
    });
    // const { teacherCompetences, loadingCompetences } = useSelector((state: any) => state.improvementPlan);

    // Obtener parámetros de la URL
    const studySheetIdParam = searchParams.get('studySheetId');
    const fichaDataString = searchParams.get('fichaData'); // mantener por compatibilidad
    const fichaNumber = searchParams.get('ficha');
    const studentIds = searchParams.get('studentIds');
    
    const [studySheet, setStudySheet] = React.useState<any>(null);
    
    const fichaData = React.useMemo(() => {
        if (fichaDataString) {
            // Si viene como JSON en fichaData (compatibilidad)
            const data = JSON.parse(decodeURIComponent(fichaDataString));
            console.log('fichaData desde JSON:', data);
            return data;
        } else if (fichaNumber) {
            // Si viene como parámetros separados
            const data = {
                id: null,
                fichaNumber: fichaNumber,
                number: fichaNumber,
                studentIds: studentIds ? studentIds.split(',') : []
            };
            console.log('fichaData desde parámetros:', data);
            return data;
        }
        return null;
    }, [fichaDataString, fichaNumber, studentIds]);
    
    // Fetch studySheet si viene studySheetId
    useEffect(() => {
        const fetchStudySheet = async () => {
            if (studySheetIdParam) {
                try {
                    const { data } = await clientLAN.query({
                        query: GET_STUDY_SHEET_BY_ID,
                        variables: { id: parseInt(studySheetIdParam, 10) },
                    });
                    setStudySheet(data.studySheetById.data);
                    console.log('studySheet fetched:', data.studySheetById.data);
                } catch (error) {
                    console.error('Error fetching studySheet:', error);
                }
            }
        };
        fetchStudySheet();
    }, [studySheetIdParam]);
    
    // Memorizar el ID de la ficha para evitar renders innecesarios
    // Usar tanto id como fichaNumber según lo que esté disponible
    const fichaId = React.useMemo(() => {
        const id = studySheet?.id || fichaData?.id || fichaData?.fichaNumber || fichaData?.number || studySheetIdParam || null;
        // Convertir a número si es un string, ya que el backend puede esperarlo así
        const finalId = id ? (typeof id === 'string' ? parseInt(id, 10) : id) : null;
        console.log('fichaId calculado:', finalId, 'desde studySheet:', studySheet, 'fichaData:', fichaData, 'studySheetIdParam:', studySheetIdParam);
        return finalId;
    }, [studySheet, fichaData, studySheetIdParam]);
    
    // Usar directamente los datos del backend ya filtrados por ficha
    const improvementPlans = React.useMemo(() => {
        console.log('🔍 improvementPlans memo - allImprovementPlans:', allImprovementPlans);
        console.log('🔍 improvementPlans memo - length:', allImprovementPlans?.length);
        return allImprovementPlans || [];
    }, [allImprovementPlans]);
    const fichaNameOrNumber = metaStudySheet?.number ?? studySheet?.number ?? fichaData?.fichaNumber ?? fichaData?.number ?? fichaData?.id ?? '';
    
    // Estado para manejar la página actual (Paginator espera páginas basadas en 1)
    const [page, setPage] = React.useState(1);
    // const [selectedTeacherCompetenceId, setSelectedTeacherCompetenceId] = React.useState<number | null>(null);

    const [isDarkMode, setIsDarkMode] = React.useState(false);
    // Mapa local de learningOutcomeId -> { name, description }
    const [learningOutcomeMap, setLearningOutcomeMap] = React.useState<Record<string, { name?: string; description?: string }>>({});
    // Mapa de evaluaciones: planId -> judgment
    const [evaluationsMap, setEvaluationsMap] = React.useState<Record<string, boolean | null>>({});
    
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
        const observer = new MutationObserver(() => checkDarkMode());
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
        return () => observer.disconnect();
    }, []); // Array vacío - solo se ejecuta una vez

    // useEffect separado para debug de fichaId
    useEffect(() => {
        console.log('🔍 DEBUG fichaId cambió:', fichaId);
    }, [fichaId]);

    // Estado para teacherCompetence IDs
    const [teacherCompetenceIds, setTeacherCompetenceIds] = React.useState<number[] | null>(null);
    const [loadingCompetences, setLoadingCompetences] = React.useState(false);
    
    // Ref para evitar llamadas duplicadas
    const lastFetchRef = React.useRef<string>('');
    const isFirstRender = React.useRef(true);

    // useEffect para obtener teacherCompetence IDs cuando hay fichaId
    useEffect(() => {
        const fetchTeacherCompetences = async () => {
            if (!fichaId) {
                setTeacherCompetenceIds(null);
                return;
            }
            
            // Evitar llamadas duplicadas
            if (loadingCompetences) return;
            
            setLoadingCompetences(true);
            try {
                console.log('🔍 Obteniendo teacherCompetences para fichaId:', fichaId);
                const { data } = await clientLAN.query({
                    query: GET_TEACHER_COMPETENCES_BY_STUDY_SHEET,
                    variables: { id: fichaId },
                    fetchPolicy: 'cache-first' // Usar caché para evitar llamadas repetidas
                });
                
                const teacherStudySheets = data?.studySheetById?.data?.teacherStudySheets || [];
                const ids = teacherStudySheets.map((ts: any) => Number(ts.id)).filter((id: number) => !isNaN(id));
                
                console.log('✅ TeacherCompetence IDs obtenidos:', ids);
                setTeacherCompetenceIds(ids.length > 0 ? ids : null);
            } catch (error) {
                console.error('❌ Error al obtener teacherCompetences:', error);
                setTeacherCompetenceIds(null);
            } finally {
                setLoadingCompetences(false);
            }
        };

        fetchTeacherCompetences();
    }, [fichaId]); // Removido loadingCompetences de las dependencias

    // Ya no necesitamos cargar competencias; filtramos por ficha directamente en backend
    useEffect(() => {
        if (fichaId) {
            setPage(1); // Reiniciar a la primera página al cambiar de ficha
        }
    }, [fichaId]);

    // useEffect para hacer fetch de datos - ahora usa teacherCompetenceIds
    useEffect(() => {
        // NUNCA cargar sin teacherCompetenceIds - siempre debe haber filtro de ficha
        if (!teacherCompetenceIds || teacherCompetenceIds.length === 0) {
            console.log('🚫 No se hace dispatch sin teacherCompetenceIds (sin filtro de ficha)');
            // Marcar que ya no es el primer render
            if (isFirstRender.current) {
                isFirstRender.current = false;
            }
            return;
        }
        
        // Marcar que ya no es el primer render
        isFirstRender.current = false;
        
        // Preparar variables de consulta CON filtro obligatorio
        const queryVariables: any = { 
            page: page - 1, // Backend espera páginas basadas en 0
            size: 5,
            teacherCompetenceIds: teacherCompetenceIds
        };
        
        // Crear una key única para este fetch
        const fetchKey = JSON.stringify({ page: queryVariables.page, ids: queryVariables.teacherCompetenceIds });
        
        // Evitar llamadas duplicadas
        if (lastFetchRef.current === fetchKey) {
            console.log('🚫 Evitando llamada duplicada');
            return;
        }
        
        console.log('✅ Dispatching fetchImprovementPlans con filtro:', queryVariables);
        lastFetchRef.current = fetchKey;
        dispatch(fetchImprovementPlans(queryVariables));
    }, [page, teacherCompetenceIds, dispatch]);

    // Cuando cambian los planes, obtener los nombres/descripciones de los learning outcomes por competencia
    useEffect(() => {
        const fetchOutcomesForCompetences = async () => {
            // Solo ejecutar si hay planes
            const plans: any[] = improvementPlans || [];
            if (plans.length === 0) return;
            
            const competenceIds = Array.from(new Set(plans.map(p => p?.teacherCompetence?.competence?.id).filter(Boolean)));
            if (competenceIds.length === 0) return;

            try {
                const map: Record<string, { name?: string; description?: string }> = {};

                await Promise.all(competenceIds.map(async (cid) => {
                    try {
                        const { data } = await clientLAN.query({
                            query: GET_LEARNING_OUTCOMES_BY_COMPETENCE,
                            variables: { idCompetence: Number(cid), page: 0, size: 100 },
                            fetchPolicy: 'cache-first' // Usar caché para evitar llamadas repetidas
                        });
                        const items = data?.allLearningOutcomes?.data || [];
                        items.forEach((it: any) => {
                            if (it?.id) {
                                map[String(it.id)] = { name: it.name, description: it.description };
                            }
                        });
                    } catch (err) {
                        console.error('Error al obtener learning outcomes para competence', cid, err);
                    }
                }));

                setLearningOutcomeMap(map);
            } catch (err) {
                console.error('Error fetching learning outcomes for competences:', err);
            }
        };

        // Usar un pequeño delay para evitar llamadas en cascada
        const timer = setTimeout(() => {
            fetchOutcomesForCompetences();
        }, 100);
        
        return () => clearTimeout(timer);
    }, [improvementPlans?.length]); // Solo depender de la longitud, no del array completo

    // Cargar evaluaciones para cada plan de mejoramiento
    useEffect(() => {
        const fetchEvaluations = async () => {
            const plans: any[] = improvementPlans || [];
            if (plans.length === 0) {
                setEvaluationsMap({});
                return;
            }

            try {
                const evaluations: Record<string, boolean | null> = {};

                await Promise.all(plans.map(async (plan) => {
                    try {
                        const { data } = await clientLAN.query({
                            query: GET_IMPROVEMENT_PLAN_EVALUATION_BY_PLAN_ID,
                            variables: { improvementPlanId: Number(plan.id) },
                            fetchPolicy: 'cache-first' // Usar caché para evitar llamadas repetidas
                        });
                        
                        const evaluation = data?.improvementPlanEvaluationByImprovementPlanId?.data;
                        evaluations[plan.id] = evaluation?.judgment ?? null;
                    } catch (err: any) {
                        // Si el error es porque no existe evaluación, no es un error real
                        const isNotFoundError = err?.message?.includes('not found') || 
                                              err?.graphQLErrors?.[0]?.message?.includes('not found');
                        if (!isNotFoundError) {
                            console.error('Error al obtener evaluación para plan', plan.id, err);
                        }
                        evaluations[plan.id] = null;
                    }
                }));

                setEvaluationsMap(evaluations);
            } catch (err) {
                console.error('Error fetching evaluations:', err);
            }
        };

        // Usar un pequeño delay para evitar llamadas en cascada
        const timer = setTimeout(() => {
            fetchEvaluations();
        }, 150);
        
        return () => clearTimeout(timer);
    }, [improvementPlans?.length]); // Solo depender de la longitud, no del array completo

    const formatDate = (dateString: string) => {
        if (!dateString) return 'No especificada';
        return new Date(dateString).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
    };
    const getQualificationColor = (qualification: number | boolean | null) => {
        if (qualification === false || qualification === null || qualification === undefined) return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30';
        if (qualification === true) return 'text-green-600 bg-green-100 dark:text-blue-400 dark:bg-blue-900/30';
        return Number(qualification) >= 3.0 ? 'text-green-600 bg-green-100 dark:text-blue-400 dark:bg-blue-900/30' : 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30';
    };

    const columns: DataTableColumn<ImprovementPlan>[] = [
        {
            key: 'student',
            header: 'Estudiante',
            render: (row) => (
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-primary to-lightGreen dark:from-blue-600 dark:to-blue-800 rounded-full flex items-center justify-center text-white font-bold text-xs">
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
            key: 'date',
            header: 'Fecha',
            render: (row) => (
                <div className="flex items-center gap-2 whitespace-nowrap">
                    <FiCalendar className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    <span className="text-sm text-gray-700 dark:text-white">
                        {row.date ? formatDate(row.date) : 'Fecha no disponible'}
                    </span>
                </div>
            )
        },
        {
            key: 'state',
            header: 'Estado',
            render: (row) => (
                <div className="flex items-center justify-center">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold border transition-all duration-200 ${
                        row.state 
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/30'
                            : 'bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/30'
                    }`}>
                        <svg className="w-2 h-2" viewBox="0 0 8 8" fill="currentColor">
                            <circle cx="4" cy="4" r="3" />
                        </svg>
                        {row.state ? 'Activo' : 'Inactivo'}
                    </span>
                </div>
            )
        },
        {
            key: 'faultType',
            header: 'Tipo de Falta',
            render: (row) => {
                const getFaultTypeStyle = (faultTypeName: string) => {
                    const name = faultTypeName.toLowerCase();
                    if (name.includes('academica') || name.includes('académica')) {
                        return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/30';
                    } else if (name.includes('disciplinaria')) {
                        return 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/30';
                    }
                    return 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-500/10 dark:text-gray-400 dark:border-gray-500/30';
                };

                return (
                    <div className="flex items-center justify-center gap-2">
                        {(row as any).faultType ? (
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold border transition-all duration-200 ${getFaultTypeStyle((row as any).faultType.name || '')}`}>
                                <svg className="w-2 h-2" viewBox="0 0 8 8" fill="currentColor">
                                    <circle cx="4" cy="4" r="3" />
                                </svg>
                                {((row as any).faultType?.name || 'Sin tipo de falta')}
                            </span>
                        ) : (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold bg-gray-50 text-gray-500 border border-gray-200 dark:bg-gray-500/10 dark:text-gray-500 dark:border-gray-500/30">
                                Sin tipo de falta
                            </span>
                        )}
                    </div>
                );
            }
        },
        {
            key: 'evaluation',
            header: 'Evaluación',
            render: (row) => {
                const judgment = evaluationsMap[row.id];
                
                if (judgment === null || judgment === undefined) {
                    return (
                        <div className="flex items-center justify-center">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold bg-yellow-50 text-yellow-700 border border-yellow-200 dark:bg-yellow-500/10 dark:text-yellow-400 dark:border-yellow-500/30 transition-all duration-200 whitespace-nowrap">
                                <svg className="w-2 h-2 flex-shrink-0" viewBox="0 0 8 8" fill="currentColor">
                                    <circle cx="4" cy="4" r="3" />
                                </svg>
                                Pendiente
                            </span>
                        </div>
                    );
                }
                
                const isApproved = judgment === true;
                
                return (
                    <div className="flex items-center justify-center">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold border transition-all duration-200 ${
                            isApproved 
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/30'
                                : 'bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/30'
                        }`}>
                            <svg className="w-2.5 h-2.5" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
                                {isApproved ? (
                                    <path d="M2 6L5 9L10 3" strokeLinecap="round" strokeLinejoin="round" />
                                ) : (
                                    <path d="M3 3L9 9M9 3L3 9" strokeLinecap="round" strokeLinejoin="round" />
                                )}
                            </svg>
                            {isApproved ? 'Aprobado' : 'Reprobado'}
                        </span>
                    </div>
                );
            }
        },
        
        {
            key: 'actions',
            header: 'Acciones',
            render: (row) => (
                <div className="flex items-center justify-center gap-2">
                    <button
                        onClick={() => router.push(`./DetallePlanDeMejoramiento?id=${row.id}`)}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-lightGreen to-primary hover:from-primary hover:to-lightGreen focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:bg-gradient-to-r dark:from-blue-600 dark:to-blue-700 dark:hover:from-blue-700 dark:hover:to-blue-800 dark:focus:ring-blue-500 transition-colors duration-200"
                    >
                        <FiEye className="w-4 h-4 mr-2" /> VER
                    </button>

                    <button
                        onClick={() => router.push(`./ActividadPlanesDeMejoramiento?improvementPlanId=${row.id}`)}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-emerald-600 hover:to-green-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-400 dark:bg-gradient-to-r dark:from-blue-500 dark:to-indigo-600 dark:hover:from-indigo-600 dark:hover:to-blue-500 dark:focus:ring-indigo-400 transition-colors duration-200"
                    >
                        <FiPlus className="w-4 h-4 mr-2" /> ACTIVIDAD
                    </button>

                    {evaluationsMap[row.id] === null || evaluationsMap[row.id] === undefined ? (
                        <button
                            onClick={() => router.push(`./EvaluarPlanMejoramiento?planId=${row.id}`)}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-lightGreen to-primary hover:from-primary hover:to-lightGreen focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:bg-gradient-to-r dark:from-blue-600 dark:to-blue-700 dark:hover:from-blue-700 dark:hover:to-blue-800 dark:focus:ring-blue-500 transition-colors duration-200"
                        >
                            <FiCheck className="w-4 h-4 mr-2" /> EVALUAR
                        </button>
                    ) : (
                        <button
                            disabled
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-lg text-gray-400 bg-gray-200 dark:bg-gray-800 dark:text-gray-500 cursor-not-allowed opacity-60"
                            title="Ya evaluado"
                        >
                            <FiCheck className="w-4 h-4 mr-2" /> EVALUADO
                        </button>
                    )}
                </div>
            )
        }
    ];

    // Función de filtro personalizada
        const filterFunction = (row: ImprovementPlan, filter: string): boolean => {
            const searchTerm = filter.toLowerCase().trim();
            if (!searchTerm) return true;
        const normalizeText = (text: string) => text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
            const normalizedSearch = normalizeText(searchTerm);
            
            return (
                // Búsqueda en datos del estudiante
                (row.student?.person?.name ? normalizeText(row.student.person.name).includes(normalizedSearch) : false) ||
                (row.student?.person?.lastname ? normalizeText(row.student.person.lastname).includes(normalizedSearch) : false) ||
                (row.student?.person?.document ? row.student.person.document.includes(searchTerm) : false) ||
                // Búsqueda en ciudad
                (row.city ? normalizeText(row.city).includes(normalizedSearch) : false) ||
                // Búsqueda en tipo de falta
                ((row as any).faultType?.name ? normalizeText((row as any).faultType.name).includes(normalizedSearch) : false) ||
                // Búsqueda por palabras clave específicas de tipo de falta
                ((row as any).faultType?.name ? (
                    (normalizeText((row as any).faultType.name).includes('academica') && normalizedSearch.includes('academica')) ||
                    (normalizeText((row as any).faultType.name).includes('disciplinaria') && normalizedSearch.includes('disciplinaria'))
                ) : false) ||
                // (Removed objectives search - objectives now live in activities)
                false
            );
        }

    if (loading) {
        return (
            <div className="mx-auto px-4 py-8 flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary dark:border-lightGreen"></div>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">Cargando planes de mejoramiento...</p>
                </div>
            </div>
        );
    }
    if (error) {
        return (
            <div className="mx-auto px-4 py-8">
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl shadow-lg p-6">
                    <h3 className="text-sm font-medium text-red-800 dark:text-red-400">Error al cargar los datos</h3>
                    <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                        {typeof error === 'string' ? error : 'Ha ocurrido un error inesperado al cargar los planes de mejoramiento.'}
                    </div>
                </div>
            </div>
        );
    }
    
    console.log('🎯 Evaluando condición de sin datos:');
    console.log('  - loading:', loading);
    console.log('  - improvementPlans:', improvementPlans);
    console.log('  - improvementPlans.length:', improvementPlans?.length);
    console.log('  - Array.isArray(improvementPlans):', Array.isArray(improvementPlans));
    
    if (!loading && Array.isArray(improvementPlans) && improvementPlans.length === 0) {
        return (
            <div className="mx-auto px-4 py-8 space-y-6">
                <PageTitle onBack={() => router.back()}>
                    {fichaNameOrNumber ? `Planes de Mejoramiento - Ficha N° ${fichaNameOrNumber}` : `Historial De Planes De Mejoramiento`}
                </PageTitle>

                {/* Cuando no hay datos: mostrar boton de asignar para crear el primer plan y un mensaje limpio */}
                <div className="text-center py-12">
                    <div className="bg-white dark:bg-shadowBlue rounded-2xl shadow-lg p-8 border border-lightGray dark:border-grayText">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full mb-4 mx-auto">
                            <FiFileText className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                        </div>
                        <h3 className="text-lg font-semibold text-black dark:text-white mb-2">No se encontraron planes de mejoramiento</h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                            {fichaId ? `No hay planes de mejoramiento registrados para los estudiantes de la ficha N° ${fichaNameOrNumber}.` : 'Aún no hay planes de mejoramiento registrados en el sistema.'}
                        </p>

                        {/** Botón de asignar: solo cuando podemos identificar la ficha (redirige al formulario) */}
                        {fichaId && (
                            <div className="mt-4 flex items-center justify-center">
                                <button
                                    onClick={() => router.push(fichaId ? `./FormularioPlanesDeMejoramiento?studySheetId=${fichaId}` : './FormularioPlanesDeMejoramiento')}
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-lightGreen to-primary hover:from-primary hover:to-lightGreen focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:bg-gradient-to-r dark:from-blue-600 dark:to-blue-700 dark:hover:from-blue-700 dark:hover:to-blue-800 dark:focus:ring-blue-500 transition-colors duration-200 shadow-lg"
                                >
                                    <FiPlus className="w-4 h-4 mr-2" /> ASIGNAR
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }
    
    
    return (
        <div className="mx-auto px-4 py-8">
            <div className="space-y-6">
                <div>
                    <PageTitle  onBack={() => router.back()}>
                        {fichaNameOrNumber ? `Historial - Ficha N° ${fichaNameOrNumber}` : 'Historial De Planes De Mejoramiento'}
                    </PageTitle>
                    {/* Toolbar removed: assign actions are now per-row in the table to avoid duplicate 'ASIGNAR' buttons */}
                </div>
                

                <DataTable<ImprovementPlan>
                    columns={columns}
                    data={improvementPlans || []}
                    filterPlaceholder="Buscar..."
                    filterFunction={filterFunction}
                    className="shadow-lg"
                    isDarkMode={isDarkMode}
                    onAddClick={() => router.push(fichaId ? `./FormularioPlanesDeMejoramiento?studySheetId=${fichaId}` : "./FormularioPlanesDeMejoramiento")}
                    addButtonText={"ASIGNAR"}
                    addButtonClassName={"inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-lightGreen to-primary hover:from-primary hover:to-lightGreen focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:bg-gradient-to-r dark:from-blue-600 dark:to-blue-700 dark:hover:from-blue-700 dark:hover:to-blue-800 dark:focus:ring-blue-500 transition-colors duration-200 shadow-lg"}
                    externalPage={page}
                    onExternalPageChange={handlePageChange}
                    externalTotalPages={totalPages}
                />
                
                {/* Paginación: usar la que provee `DataTable` internamente. */}
                

            </div>
        </div>
    );
}

// Componente principal con Suspense para envolver useSearchParams
const HistorialPlanesMejoramientoInstructor = () => {
    return (
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-gray-100 mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400">Cargando...</p>
            </div>
        </div>}>
            <HistorialPlanesMejoramientoInstructorContent />
        </Suspense>
    );
};

export default HistorialPlanesMejoramientoInstructor;
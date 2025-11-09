'use client'

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLoader } from '@context/LoaderContext';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { fetchStudySheetByTeacher } from '@redux/slices/olympo/studySheetSlice';
import { fetchTeacherCompetencesByStudySheet } from '@redux/slices/improvementPlanSlice';
import { AppDispatch } from '@redux/store';
import {StudySheet,StudentStudySheet} from '@graphql/generated';
import { FiBookOpen, FiCalendar, FiTarget, FiClock, FiEye, FiCreditCard, FiPhone, FiArrowRight, FiMail } from 'react-icons/fi';
import { IoPeople } from "react-icons/io5";
import PageTitle from '@components/UI/pageTitle';
import EmptyState from '@components/UI/emptyState';
import {
    StudySheet,
    StudentStudySheet,
} from '@graphql/generated';
import { FiUsers, FiBookOpen, FiCalendar, FiTarget, FiClock, FiEye, FiCreditCard, FiPhone, FiArrowRight, FiMail } from 'react-icons/fi';
import { IoPeople } from "react-icons/io5";

// Estilos CSS para line-clamp y select con scroll
const styles = `
.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

/* Estilos para select con scroll personalizado */
select {
    max-height: 300px;
}

select option {
    padding: 8px 12px;
}

/* Scroll personalizado para navegadores webkit */
select::-webkit-scrollbar {
    width: 8px;
}

select::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
}

select::-webkit-scrollbar-thumb {
    background: #39A900;
    border-radius: 10px;
}

select::-webkit-scrollbar-thumb:hover {
    background: #2d8400;
}

/* Modo oscuro */
@media (prefers-color-scheme: dark) {
    select::-webkit-scrollbar-track {
        background: #374151;
    }
    
    select::-webkit-scrollbar-thumb {
        background: #10B981;
    }
    
    select::-webkit-scrollbar-thumb:hover {
        background: #059669;
    }
}
`;

const PlanMejoramientoInstructor: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const [selectedStudents, setSelectedStudents] = useState<NonNullable<StudentStudySheet>[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentSheet, setCurrentSheet] = useState<NonNullable<StudySheet> | null>(null);

    // Estados para filtros
    const [filters, setFilters] = useState({
        ficha: '',
        jornada: '',
        programa: ''
    });

    const { showLoader, hideLoader } = useLoader();

    // Redux state
    const { data, loading, error } = useSelector((state: any) => state.studySheet);
    const { teacherCompetences, loadingCompetences } = useSelector((state: any) => state.improvementPlan);
    const studySheets: NonNullable<StudySheet>[] = (data || []).filter((sheet: StudySheet): sheet is NonNullable<StudySheet> => sheet !== null);

    // Filtrar las fichas según los filtros aplicados
    const filteredStudySheets = studySheets.filter((sheet) => {
        const matchesFicha = !filters.ficha ||
            sheet.number?.toString().toLowerCase().includes(filters.ficha.toLowerCase());

        const matchesJornada = !filters.jornada ||
            sheet.journey?.name?.toLowerCase().includes(filters.jornada.toLowerCase());

        const matchesPrograma = !filters.programa ||
            sheet.trainingProject?.program?.name?.toLowerCase().includes(filters.programa.toLowerCase());

        return matchesFicha && matchesJornada && matchesPrograma;
    });

    // Obtener opciones únicas para los filtros
    const uniqueJornadas = Array.from(new Set(
        studySheets
            .map(sheet => sheet.journey?.name)
            .filter(Boolean)
    ));

    const uniqueProgramas = Array.from(new Set(
        studySheets
            .map(sheet => sheet.trainingProject?.program?.name)
            .filter(Boolean)
    ));

    const handleFilterChange = (filterType: string, value: string) => {
        setFilters(prev => ({
            ...prev,
            [filterType]: value
        }));
    };

    const clearFilters = () => {
        setFilters({
            ficha: '',
            jornada: '',
            programa: ''
        });
    };

    // Función para capitalizar texto
    const capitalizeText = (text: string | null | undefined): string => {
        if (!text) return '';
        return text.toUpperCase();
    };

    useEffect(() => {
        const loadData = async () => {
            showLoader();
            try {
                await dispatch(fetchStudySheetByTeacher({
                    idTeacher: 1,
                    page: 0,
                    size: 5
                })).unwrap();
            } catch (error) {
                console.error('Error al cargar fichas:', error);
                toast.error('Error al cargar las fichas de estudio', {
                    position: "top-right",
                    autoClose: 4000,
                });
            } finally {
                hideLoader();
            }
        };
        
        loadData();
    }, [dispatch, showLoader, hideLoader]);

    const handleViewStudents = (sheet: NonNullable<StudySheet>) => {
        setCurrentSheet(sheet);
        const validStudents = (sheet.studentStudySheets || []).filter((ss): ss is NonNullable<StudentStudySheet> => ss !== null);
        setSelectedStudents(validStudents);
        setIsModalOpen(true);
    };

    const handleSelectSheet = async (sheet: NonNullable<StudySheet>) => {
        console.log('Ficha seleccionada:', sheet);
        
        showLoader();
        
        try {
            // Primero cargar las competencias de esta ficha
            const teacherId = 1;
            let currentCompetences: any[] = [];
            
            try {
                const competencesResult = await dispatch(fetchTeacherCompetencesByStudySheet({
                    studySheetId: sheet.id?.toString() || '',
                    teacherId: teacherId.toString()
                })).unwrap();
                
                currentCompetences = competencesResult || [];
                console.log('Competencias cargadas para la ficha:', currentCompetences);
            } catch (error) {
                console.error('Error al cargar competencias:', error);
                toast.error('Error al cargar las competencias de la ficha', {
                    position: "top-right",
                    autoClose: 4000,
                });
                currentCompetences = [];
            }
            
            // Obtener los estudiantes de la ficha (misma lógica que el modal)
            const validStudents = (sheet.studentStudySheets || []).filter((ss): ss is NonNullable<StudentStudySheet> => ss !== null);
            const studentIds = validStudents.map(ss => ss.student?.id).filter(Boolean);
            
            console.log('Estudiantes de la ficha:', validStudents);
            console.log('IDs de estudiantes:', studentIds);
            
            // Crear un objeto fichaData completo con toda la información necesaria
            const fichaData = {
                id: sheet.id,
                fichaNumber: sheet.number,
                number: sheet.number,
                studentIds: studentIds,
                teacherCompetences: currentCompetences,
                students: validStudents.map(ss => ss.student),
                studentStudySheets: validStudents
            };
            
            console.log('FichaData completo a enviar:', fichaData);
            
            if (validStudents.length > 0) {
                // Navegación con objeto completo en JSON
                const url = `./HistorialPlanesMejoramientoInstructor?fichaData=${encodeURIComponent(JSON.stringify(fichaData))}`;
                
                console.log('Navegando a:', url);
                
                router.push(url);
            } else {
                toast.warning('Esta ficha no tiene estudiantes asignados', {
                    position: "top-right",
                    autoClose: 4000,
                });
                // Si no hay estudiantes, navegar sin filtro
                router.push(`./HistorialPlanesMejoramientoInstructor`);
            }
        } catch (error) {
            console.error('Error general en handleSelectSheet:', error);
            toast.error('Error al procesar la selección de ficha', {
                position: "top-right",
                autoClose: 4000,
            });
        } finally {
            hideLoader();
        }
    };

    const formatDate = (dateString: string | null | undefined) => {
        if (!dateString) return 'No especificada';
        return new Date(dateString).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    if (error) {
        return (
            <EmptyState
                message={
                    typeof error === "string"
                        ? `Error al cargar las fichas: ${error}`
                        : "Error desconocido al cargar las fichas."
                }
            />
        );
    }

    if ((!studySheets || studySheets.length === 0) && !error) {
        return <EmptyState message="No se encontraron fichas de mejoramiento." />;
    }

    return (
        <div className="mx-auto px-4 py-8">
            {/* Título */}
            <div className="mb-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <PageTitle>Planes De Mejoramiento</PageTitle>
                </div>
            </div>

            {/* Filtros */}
            <div className="mb-8 bg-gradient-to-br from-white via-gray-50 to-white dark:from-shadowBlue dark:via-gray-800 dark:to-shadowBlue rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-visible relative z-50">
                {/* Header con gradiente */}
                <div className="bg-gradient-to-r from-primary/10 via-lightGreen/10 to-primary/10 dark:from-secondary/10 dark:via-darkBlue/10 dark:to-secondary/10 px-6 py-4 border-b border-gray-200 dark:border-gray-700 rounded-t-3xl">
                    <h3 className="text-xl font-bold text-black dark:text-white flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-br from-primary to-lightGreen dark:from-secondary dark:to-darkBlue rounded-xl shadow-md">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.134 17 3 13.866 3 10C3 6.134 6.134 3 10 3C13.866 3 17 6.134 17 10Z" />
                            </svg>
                        </div>
                        <span className="bg-gradient-to-r from-primary to-lightGreen dark:from-secondary dark:to-darkBlue bg-clip-text text-transparent">
                            Filtros de Búsqueda
                        </span>
                    </h3>
                </div>

                {/* Contenido de filtros */}
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5">
                        {/* Filtro por Ficha */}
                        <div className="group">
                            <label className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2.5 flex items-center gap-2">
                                <FiBookOpen className="w-4 h-4 text-primary dark:text-lightGreen" />
                                Número de Ficha
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={filters.ficha}
                                    onChange={(e) => handleFilterChange('ficha', e.target.value)}
                                    placeholder="Ej: 2558190..."
                                    className="w-full px-4 py-3 pl-10 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-sm bg-white dark:bg-gray-700 text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-primary/50 dark:focus:ring-lightGreen/50 focus:border-primary dark:focus:border-lightGreen transition-all duration-300 hover:border-gray-300 dark:hover:border-gray-500 shadow-sm hover:shadow-md relative z-10"
                                />
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20L7 4M17 20L17 4M3 12L21 12" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Filtro por Jornada */}
                        <div className="group">
                            <label className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2.5 flex items-center gap-2">
                                <FiClock className="w-4 h-4 text-primary dark:text-lightGreen" />
                                Jornada
                            </label>
                            <div className="relative">
                                <select
                                    value={filters.jornada}
                                    onChange={(e) => handleFilterChange('jornada', e.target.value)}
                                    className="w-full px-4 py-3 pl-10 pr-10 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-sm bg-white dark:bg-gray-700 text-black dark:text-white focus:ring-2 focus:ring-primary/50 dark:focus:ring-lightGreen/50 focus:border-primary dark:focus:border-lightGreen transition-all duration-300 appearance-none cursor-pointer hover:border-gray-300 dark:hover:border-gray-500 shadow-sm hover:shadow-md relative z-[60]"
                                    style={{ 
                                        backgroundImage: 'none'
                                    }}
                                >
                                    <option value="">Todas las jornadas</option>
                                    {uniqueJornadas.map((jornada) => (
                                        <option key={jornada ?? 'no-especificado'} value={jornada ?? ''}>
                                            {capitalizeText(jornada) || 'Jornada no especificada'}
                                        </option>
                                    ))}
                                </select>
                                <div className="absolute left-3 top-3.5 pointer-events-none z-10">
                                    <FiClock className="w-4 h-4 text-gray-400" />
                                </div>
                                <div className="absolute right-3 top-3.5 pointer-events-none z-10">
                                    <svg className="w-5 h-5 text-primary dark:text-lightGreen group-hover:translate-y-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Filtro por Programa */}
                        <div className="group">
                            <label className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2.5 flex items-center gap-2">
                                <FiTarget className="w-4 h-4 text-primary dark:text-lightGreen" />
                                Programa
                            </label>
                            <div className="relative">
                                <select
                                    value={filters.programa}
                                    onChange={(e) => handleFilterChange('programa', e.target.value)}
                                    className="w-full px-4 py-3 pl-10 pr-10 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-sm bg-white dark:bg-gray-700 text-black dark:text-white focus:ring-2 focus:ring-primary/50 dark:focus:ring-lightGreen/50 focus:border-primary dark:focus:border-lightGreen transition-all duration-300 appearance-none cursor-pointer hover:border-gray-300 dark:hover:border-gray-500 shadow-sm hover:shadow-md relative z-[60]"
                                    style={{ 
                                        backgroundImage: 'none'
                                    }}
                                >
                                    <option value="">Todos los programas</option>
                                    {uniqueProgramas.map((programa) => (
                                        <option key={programa ?? 'no-especificado'} value={programa ?? ''}>
                                            {capitalizeText(programa) || 'Programa no especificado'}
                                        </option>
                                    ))}
                                </select>
                                <div className="absolute left-3 top-3.5 pointer-events-none z-10">
                                    <FiTarget className="w-4 h-4 text-gray-400" />
                                </div>
                                <div className="absolute right-3 top-3.5 pointer-events-none z-10">
                                    <svg className="w-5 h-5 text-primary dark:text-lightGreen group-hover:translate-y-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Botón limpiar filtros */}
                        <div className="flex items-end">
                            <button
                                onClick={clearFilters}
                                className="w-full px-5 py-3 bg-gradient-to-r from-lightGreen to-darkGreen hover:from-lightGreen/90 hover:to-darkGreen/90 dark:bg-gradient-to-r dark:from-secondary dark:to-darkBlue dark:hover:from-secondary/90 dark:hover:to-darkBlue/90 text-white rounded-xl text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5 group relative z-10"
                            >
                                <svg className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                Limpiar
                            </button>
                        </div>
                    </div>

                    {/* Contador de resultados con diseño mejorado */}
                    {(filters.ficha || filters.jornada || filters.programa) && (
                        <div className="mt-5 pt-5 border-t border-gray-200 dark:border-gray-700">
                            <div className="flex items-center justify-center gap-2 text-sm">
                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary/10 to-lightGreen/10 dark:from-secondary/10 dark:to-darkBlue/10 rounded-full border border-primary/20 dark:border-secondary/20">
                                    <svg className="w-4 h-4 text-primary dark:text-lightGreen" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span className="text-gray-700 dark:text-gray-200 font-medium">
                                        Mostrando <span className="font-bold text-primary dark:text-lightGreen">{filteredStudySheets.length}</span> de <span className="font-bold">{studySheets.length}</span> fichas
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Grid de Fichas (más compacto y responsive) */}
            {filteredStudySheets.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 relative z-10">
                    {filteredStudySheets.map((sheet) => (
                        <div
                            key={sheet.id}
                            className="bg-white dark:bg-shadowBlue rounded-2xl shadow-md border border-lightGray dark:border-grayText overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:bg-gray-50 dark:hover:bg-darkBlue relative z-10"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700">
                                <div className="inline-block px-3 py-1.5 bg-gradient-to-r from-primary to-lightGreen dark:from-secondary dark:to-darkBlue rounded-xl text-white text-sm font-bold shadow-sm">
                                    Ficha N° {sheet.number || 'N/A'}
                                </div>
                                <span className={`inline-flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs font-semibold shadow-sm ${sheet.state
                                    ? 'bg-green-100 text-darkGreen border border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800'
                                    : 'bg-red-100 text-red-700 border border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800'
                                    }`}>
                                    <span className={`w-2.5 h-2.5 rounded-full ${sheet.state ? 'bg-green-500 dark:bg-green-400' : 'bg-red-500 dark:bg-red-400'}`}></span>
                                    {sheet.state ? "Activa" : "Inactiva"}
                                </span>
                            </div>

                            {/* Contenido */}
                            <div className="p-4">
                                <div className="flex flex-col gap-3">
                                    {/* Aprendices */}
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                                            <IoPeople className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <div>
                                            <span className="text-gray-600 dark:text-gray-300 text-sm">Aprendices</span>
                                            <p className="text-black dark:text-white font-semibold text-base">
                                                {sheet.studentStudySheets?.length || 0}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Jornada */}
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <FiClock className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <span className="text-xs sm:text-sm text-grayText dark:text-white font-medium">Jornada</span>
                                            <span className="text-sm text-black dark:text-white font-semibold uppercase block truncate" title={sheet.journey?.name ?? "Sin jornada"}>
                                                {sheet.journey?.name ?? "Sin jornada"}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Programa */}
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <FiTarget className="w-4 h-4 text-lightGreen dark:text-darkGreen" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <span className="text-gray-600 dark:text-gray-300 text-sm">Programa</span>
                                            <p className="text-black dark:text-white font-semibold text-xs leading-tight uppercase truncate" title={sheet.trainingProject?.program?.name || 'Programa no especificado'}>
                                                {sheet.trainingProject?.program?.name || 'Programa no especificado'}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Etapa Lectiva (label + inicio/fin) */}
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <FiCalendar className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <span className="text-xs sm:text-sm text-grayText dark:text-white font-medium">Etapa lectiva</span>
                                            <div className="mt-1 grid grid-cols-2 gap-2">
                                                <div>
                                                    <span className="block text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Inicio</span>
                                                    <span className="block text-xs sm:text-sm text-black dark:text-white font-semibold truncate" title={formatDate(sheet.startLective)}>
                                                        {formatDate(sheet.startLective)}
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className="block text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Fin</span>
                                                    <span className="block text-xs sm:text-sm text-black dark:text-white font-semibold truncate" title={formatDate(sheet.endLective)}>
                                                        {formatDate(sheet.endLective)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Botones (más compactos y delgados) */}
                                <div className="mt-3">
                                    <div className="grid grid-cols-2 gap-2">
                                        <button
                                            onClick={() => handleViewStudents(sheet)}
                                            className="flex items-center justify-between w-full px-2 py-1.5 bg-primary hover:bg-primary/90 dark:bg-gradient-to-r dark:from-secondary dark:to-darkBlue dark:hover:from-secondary/90 dark:hover:to-darkBlue/90 text-white rounded-md transition-all duration-200 font-medium group shadow-sm hover:shadow-md text-xs"
                                        >
                                            <div className="flex items-center gap-1.5">
                                                <IoPeople className="w-3.5 h-3.5" />
                                                <span>Ver Aprendices</span>
                                            </div>
                                            <FiArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                                        </button>
                                        <button
                                            onClick={() => handleSelectSheet(sheet)}
                                            className="flex items-center justify-between w-full px-2 py-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-gradient-to-r dark:from-gray-700 dark:to-gray-800 dark:hover:from-gray-600 dark:hover:to-gray-700 text-gray-700 dark:text-gray-200 rounded-md transition-all duration-200 font-medium group text-xs"
                                        >
                                            <div className="flex items-center gap-1.5">
                                                <FiEye className="w-3.5 h-3.5" />
                                                <span>
                                                    Ver Historial
                                                </span>
                                            </div>
                                            <FiArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12">
                    <div className="bg-white dark:bg-shadowBlue rounded-2xl shadow-lg p-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full mb-4 mx-auto">
                            <FiBookOpen className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                        </div>
                        <h3 className="text-lg font-semibold text-black dark:text-white mb-2">
                            No se encontraron fichas
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                            No hay fichas que coincidan con los filtros aplicados.
                        </p>
                        <button
                            onClick={clearFilters}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-lightGreen to-darkGreen hover:from-lightGreen/90 hover:to-darkGreen/90 dark:bg-gradient-to-r dark:from-secondary dark:to-darkBlue dark:hover:from-secondary/90 dark:hover:to-darkBlue/90 text-white rounded-lg text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2L12 10" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14L8 22" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14L12 22" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 14L16 22" />
                                <circle cx="12" cy="12" r="2" stroke="currentColor" strokeWidth={2} fill="currentColor" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 4L14 4" />
                            </svg>
                            Limpiar filtros
                        </button>
                    </div>
                </div>
            )}

            {/* Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={`Aprendices - Ficha #${currentSheet?.number}`}
                size="xxxl"
            >
                <div className="max-h-[75vh] overflow-y-auto">
                    {selectedStudents && selectedStudents.length > 0 ? (
                        <div className="w-full">
                            <div className="text-sm text-grayText dark:text-white mb-4 text-center">
                                Total de aprendices: <span className="font-semibold">{selectedStudents.length}</span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 p-1">
                                {selectedStudents.map((studentSheet, index) => {
                                    const student = studentSheet?.student;
                                    const person = student?.person;
                                    if (!student || !person) return null;

                                    const displayName = person?.name && person?.lastname
                                        ? `${person.name} ${person.lastname}`
                                        : person?.name || 'Nombre no disponible';

                                    const studentState =
                                        studentSheet?.studentStudySheetState?.name || 'Estado no disponible';

                                    return (
                                        <div
                                            key={student.id || index}
                                            className="group bg-white dark:bg-shadowBlue rounded-xl shadow-sm border border-lightGray dark:border-grayText p-3 flex flex-col hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 h-48 min-h-[12rem] max-h-48"
                                        >
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="w-8 h-8 bg-gradient-to-r from-primary to-lightGreen dark:from-secondary dark:to-darkBlue rounded-full flex items-center justify-center text-white font-bold text-xs shadow-md flex-shrink-0">
                                                    {displayName.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    {/* Nombre completo con altura limitada */}
                                                    <h4 className="font-semibold text-black dark:text-white text-xs leading-tight break-words line-clamp-2 max-h-8 overflow-hidden">
                                                        {displayName}
                                                    </h4>
                                                </div>
                                            </div>
                                            <div className="mb-2">
                                                <span
                                                    className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-medium shadow-sm ${studentState === 'En formacion'
                                                        ? 'bg-gradient-to-r from-lightGreen to-darkGreen dark:from-secondary dark:to-darkBlue text-white'
                                                        : 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white'
                                                        }`}
                                                >
                                                    {studentState}
                                                </span>
                                            </div>
                                            <div className="space-y-1 text-[10px] text-grayText dark:text-white flex-1 overflow-hidden">
                                                <div className="flex items-center gap-1.5 p-1 bg-gray-50 dark:bg-shadowBlue/50 rounded-md">
                                                    <FiCreditCard className="w-2.5 h-2.5 text-gray-400 flex-shrink-0" />
                                                    <div className="min-w-0 flex-1">
                                                        <span className="text-[10px] font-medium text-gray-700 dark:text-gray-300">Doc:</span>
                                                        <span className="text-[10px] text-gray-600 dark:text-gray-400 ml-1 truncate">
                                                            {person.document || 'Sin documento'}
                                                        </span>
                                                    </div>
                                                </div>
                                                {person.email && (
                                                    <div className="flex items-start gap-1.5 p-1 bg-gray-50 dark:bg-shadowBlue/50 rounded-md">
                                                        <FiMail className="w-2.5 h-2.5 text-gray-400 flex-shrink-0 mt-0.5" />
                                                        <div className="min-w-0 flex-1">
                                                            <span className="text-[10px] font-medium text-gray-700 dark:text-gray-300">Correo:</span>
                                                            <span className="block text-[10px] text-gray-600 dark:text-gray-400 break-all leading-tight line-clamp-2 max-h-6 overflow-hidden">
                                                                {person.email}
                                                            </span>
                                                        </div>
                                                    </div>
                                                )}
                                                {person.phone && (
                                                    <div className="flex items-center gap-1.5 p-1 bg-gray-50 dark:bg-shadowBlue/50 rounded-md">
                                                        <FiPhone className="w-2.5 h-2.5 text-gray-400 flex-shrink-0" />
                                                        <div className="min-w-0 flex-1">
                                                            <span className="text-[10px] font-medium text-gray-700 dark:text-gray-300">Tel:</span>
                                                            <span className="text-[10px] text-gray-600 dark:text-gray-400 ml-1 truncate">
                                                                {person.phone}
                                                            </span>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ) : (
                        <EmptyState message="No hay aprendices registrados en esta ficha" />
                    )}
                </div>
            </Modal>
        </div>
    );
};

export default PlanMejoramientoInstructor; 
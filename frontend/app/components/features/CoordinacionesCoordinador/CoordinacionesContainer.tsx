'use client'

/**
 * IMPORTANTE: ESTE ARCHIVO CONTIENE DATOS QUEMADOS PARA PRUEBAS DE DISEÑO
 * Los datos quemados están marcados claramente con comentarios para facilitar su eliminación.
 */

import React, { useEffect, useState } from 'react';
import PageTitle from '@components/UI/pageTitle';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@redux/store';
import { fetchCoordinationByColaborator } from '@redux/slices/olympo/coordinationSlice';
import { Coordination } from '@graphql/generated';
import { Card, CardGrid } from '@components/UI/Card';
import DataTable from '@components/UI/DataTable';
import Loader from '@components/UI/Loader';
import EmptyState from '@components/UI/emptyState';
import { Users,Building2, Grid3X3, List, User, UserCheck } from 'lucide-react';
import { useLoader } from '@/context/LoaderContext';
import { TEMPORAL_COLLABORATOR_ID } from '@/temporaryCredential';

// ============ DATOS QUEMADOS - ELIMINAR CUANDO YA NO SE NECESITEN ============
const DUMMY_COORDINATIONS: Coordination[] = [
    {
        id: "1",
        name: "Coordinación Software",
        state: true,
        trainingCenter: {
            name: "Centro de servicios financieros"
        },
        teachers: [
            {
                id: "t1",
                state: true,
                collaborator: {
                    person: {
                        name: "Juan",
                        lastname: "Pérez",
                        document: "12345678"
                    }
                }
            },
            {
                id: "t2",
                state: false,
                collaborator: {
                    person: {
                        name: "Lucia",
                        lastname: "Fernandez",
                        document: "99887766"
                    }
                }
            }
        ]
    },
    {
        id: "2",
        name: "Coordinación de formacion integral",
        state: false,
        trainingCenter: {
            name: "Centro de servicios financieros"
        },
        teachers: [
            {
                id: "t3",
                state: true,
                collaborator: {
                    person: {
                        name: "Maria",
                        lastname: "López",
                        document: "87654321"
                    }
                }
            },
            {
                id: "t4",
                state: true,
                collaborator: {
                    person: {
                        name: "Carlos",
                        lastname: "Ramirez",
                        document: "11223344"
                    }
                }
            }
        ]
    },
    {
    id: "3",
        name: "Coordinación administracion educativa",
        state: true,
        trainingCenter: {
            name: "Centro de servicios financieros"
        },
        teachers: [
            {
                id: "t5",
                state: true,
                collaborator: {
                    person: {
                        name: "Andres",
                        lastname: "Gomez",
                        document: "5468752"
                    }
                }
            },
            {
                id: "t6",
                state: false,
                collaborator: {
                    person: {
                        name: "Sofia",
                        lastname: "Martinez",
                        document: "66778899"
                    }
                }
            },
            {
                id: "t7",
                state: true,
                collaborator: {
                    person: {
                        name: "Diego",
                        lastname: "Sanchez",
                        document: "44556677"
                    }
                }
            },
            {
                id: "t10",
                state: true,
                collaborator: {
                    person: {
                        name: "Ana",
                        lastname: "Garcia",
                        document: "99887766"
                    }
                }
            }
        ]
    },
    {
        id: "4",
        name: "Coordinación de gestion administrativa",
        state: false,
        trainingCenter: {
            name: "Centro de servicios financieros"
        },
        teachers: [
            {
                id: "t8",
                state: true,
                collaborator: {
                    person: {
                        name: "Laura",
                        lastname: "Diaz",
                        document: "33445566"
                    }
                }
            },
            {
                id: "t9",
                state: false,
                collaborator: {
                    person: {
                        name: "Jorge",
                        lastname: "Vargas",
                        document: "22334455"
                    }
                }
            }
        ]
    },
    {
        id: "5",
        name: "Coordinación de gestion administrativa",
        state: false,
        trainingCenter: {
            name: "Centro de servicios financieros"
        },
        teachers: [
            {
                id: "t8",
                state: true,
                collaborator: {
                    person: {
                        name: "Laura",
                        lastname: "Diaz",
                        document: "33445566"
                    }
                }
            },
            {
                id: "t9",
                state: false,
                collaborator: {
                    person: {
                        name: "Jorge",
                        lastname: "Vargas",
                        document: "22334455"
                    }
                }
            }
        ]
    },
    {
        id: "6",
        name: "Coordinación de gestion administrativa",
        state: false,
        trainingCenter: {
            name: "Centro de servicios financieros"
        },
        teachers: [
            {
                id: "t8",
                state: true,
                collaborator: {
                    person: {
                        name: "Laura",
                        lastname: "Diaz",
                        document: "33445566"
                    }
                }
            },
            {
                id: "t9",
                state: false,
                collaborator: {
                    person: {
                        name: "Jorge",
                        lastname: "Vargas",
                        document: "22334455"
                    }
                }
            }
        ]
    },
    {
        id: "7",
        name: "Coordinación de gestion administrativa",
        state: false,
        trainingCenter: {
            name: "Centro de servicios financieros"
        },
        teachers: [
            {
                id: "t8",
                state: true,
                collaborator: {
                    person: {
                        name: "Laura",
                        lastname: "Diaz",
                        document: "33445566"
                    }
                }
            },
            {
                id: "t9",
                state: false,
                collaborator: {
                    person: {
                        name: "Jorge",
                        lastname: "Vargas",
                        document: "22334455"
                    }
                }
            }
        ]
    }
];
// ========================================================================

type ViewMode = 'cards' | 'table';

const CoordinacionesContainer: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { showLoader, hideLoader } = useLoader();
    const [viewMode, setViewMode] = useState<ViewMode>('cards');
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [expandedCards, setExpandedCards] = useState<Set<string | number>>(new Set());

    const { data: coordinaciones, loading, error } = useSelector(
        (state: RootState) => state.coordination
    );

    // ============ USAR SIEMPRE DATOS DUMMY MIENTRAS NO HAY BACKEND ============
    // Cambiar por la línea de abajo cuando tengas el backend funcionando:
    // const coordinacionesData = coordinaciones && coordinaciones.length > 0 ? coordinaciones : DUMMY_COORDINATIONS;
    const coordinacionesData = DUMMY_COORDINATIONS; // Forzar datos dummy siempre
    // ==========================================================================

    // Detectar modo oscuro
    useEffect(() => {
        const checkDarkMode = () => {
            const isDark = document.documentElement.classList.contains('dark');
            setIsDarkMode(isDark);
        };

        checkDarkMode();

        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    checkDarkMode();
                }
            });
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class']
        });

        return () => observer.disconnect();
    }, []);

    // ⚠️ COMENTADO TEMPORALMENTE: Llamada al backend que causa error 404
    // Descomenta esto cuando el backend tenga GraphQL funcionando
    /*
    useEffect(() => {
        const loadCoordinations = async () => {
            showLoader();
            try {
                await dispatch(fetchCoordinationByColaborator({ collaboratorId: TEMPORAL_COLLABORATOR_ID, page: 0, size: 5 })).unwrap();
            } catch (error) {
                console.error('Error loading coordinations:', error);
            } finally {
                hideLoader();
            }
        };
        
        loadCoordinations();
    }, [dispatch]);
    */

    // Función para alternar la expansión de una card
    const toggleExpanded = (coordinationId: string | number) => {
        setExpandedCards(prev => {
            const newSet = new Set(prev);
            if (newSet.has(coordinationId)) {
                newSet.delete(coordinationId);
            } else {
                newSet.add(coordinationId);
            }
            return newSet;
        });
    };

    // Función para renderizar las cards de coordinaciones
    const renderCoordinationCard = (coordination: Coordination) => {
        const isExpanded = expandedCards.has(coordination.id!);
        const teachersToShow = isExpanded ? coordination.teachers : coordination.teachers?.slice(0, 3);
        
        return (
        <Card
            key={coordination.id}
            isDarkMode={isDarkMode}
            header={
                <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                    <h3 className="text-base sm:text-lg font-semibold text-primary dark:text-blue-300 capitalize truncate">
                        {coordination.name}
                    </h3>
                    <div className="flex items-center gap-2 self-start sm:self-auto">
                        {coordination.state ? (
                            <span className="flex items-center gap-1 px-2 py-1 bg-lightGreen dark:bg-lightGreen text-white dark:text-white rounded-full text-xs sm:text-sm">
                                Activa
                            </span>
                        ) : (
                            <span className="flex items-center gap-1 px-2 py-1 bg-red-600 dark:bg-red text-white dark:text-white rounded-full text-xs sm:text-sm">
                                Inactiva
                            </span>
                        )}
                    </div>
                </div>
            }
            body={
                <div className="space-y-3 sm:space-y-4">
                    {/* Centro de Formación */}
                    <div className="flex items-start gap-2 sm:gap-3">
                        <Building2 className="text-secondary dark:text-white mt-1 flex-shrink-0" size={16} />
                        <div className="min-w-0 flex-1">
                            <p className="text-xs sm:text-sm font-medium text-darkGray dark:text-gray-300">Centro de formación</p>
                            <p className="text-sm sm:text-base text-darkBlue dark:text-white font-medium capitalize truncate">
                                {coordination.trainingCenter?.name || 'No asignado'}
                            </p>
                        </div>
                    </div>

                    {/* Instructores */}
                    <div className="flex items-start gap-2 sm:gap-3">
                        <Users className="text-secondary dark:text-white mt-1 flex-shrink-0" size={16} />
                        <div className="w-full min-w-0">
                            <p className="text-xs sm:text-sm font-medium text-darkGray dark:text-gray-300 mb-2">
                                Instructores ({coordination.teachers?.length || 0})
                            </p>
                            <div className={`space-y-2 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent transition-all duration-300 ${isExpanded ? 'max-h-64' : 'max-h-28 sm:max-h-32'}`}>
                                {teachersToShow?.map((teacher, index) =>
                                    teacher ? (
                                        <div
                                            key={teacher.id || index}
                                            className="flex items-center justify-between bg-gray-50 dark:bg-gray-700/80 p-1.5 sm:p-2 rounded-lg border border-gray-100 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                                        >
                                            <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 flex-1">
                                                {teacher.state ? (
                                                    <UserCheck className="text-lightGreen dark:text-white flex-shrink-0" size={14} />
                                                ) : (
                                                    <User className="text-grayText dark:text-white flex-shrink-0" size={14} />
                                                )}
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-xs sm:text-sm font-medium capitalize truncate text-gray-900 dark:text-gray-100">
                                                        {`${teacher.collaborator?.person?.name || ''} ${teacher.collaborator?.person?.lastname || ''}`.trim()}
                                                    </p>
                                                    <p className="text-xs text-gray-600 dark:text-gray-300 truncate">
                                                        Doc: {teacher.collaborator?.person?.document || 'Sin documento'}
                                                    </p>
                                                </div>
                                            </div>
                                            <span className={`w-2 h-2 rounded-full flex-shrink-0 ${teacher.state ? 'bg-lightGreen dark:bg-lime-400' : 'bg-red-500 dark:bg-red-400'}`} />
                                        </div>
                                    ) : null
                                )}
                                {(coordination.teachers?.length || 0) > 2 && (
                                    <button
                                        onClick={() => toggleExpanded(coordination.id!)}
                                        className="w-full text-xs text-primary dark:text-blue-300 hover:text-primary/80 dark:hover:text-blue-400 text-center py-1.5 px-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors font-medium"
                                    >
                                        {isExpanded ? 'Ver menos' : `+${(coordination.teachers?.length || 0) - 2} instructores más`}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            }
            className="hover:shadow-xl transition-all duration-300 w-full"
        />
        );
    };

    // Columnas para la tabla
    const tableColumns = [
        {
            key: 'name' as keyof Coordination,
            header: 'Coordinación',
            className: 'min-w-[200px]',
            render: (coordination: Coordination) => (
                <div className="font-medium text-gray dark:text-white capitalize">
                    <div className="truncate">{coordination.name}</div>
                </div>
            ),
        },
        {
            key: 'trainingCenter' as keyof Coordination,
            header: 'Centro',
            className: 'min-w-[180px] hidden sm:table-cell text-center',
            render: (coordination: Coordination) => (
                <div className="flex justify-center text-gray dark:text-white capitalize">
                    <div className="truncate text-center">{coordination.trainingCenter?.name || 'No asignado'}</div>
                </div>
            ),
        },
        {
            key: 'teachers' as keyof Coordination,
            header: 'Instructores',
            className: 'min-w-[120px] text-center',
            render: (coordination: Coordination) => {
                const activeTeachers = coordination.teachers?.filter(t => t && t.state).length || 0;
                const totalTeachers = coordination.teachers?.length || 0;
                return (
                    <div className="flex items-center justify-center gap-2">
                        <Users className="text-gray dark:text-white flex-shrink-0" size={14} />
                        <span className="text-sm">
                            <span className="font-medium text-gray dark:text-white">{activeTeachers}</span>
                            <span className="text-grayText dark:text-gray-400">/{totalTeachers}</span>
                        </span>
                    </div>
                );
            },
        },
        {
            key: 'state' as keyof Coordination,
            header: 'Estado',
            className: 'min-w-[100px] text-center',
            render: (coordination: Coordination) => (
                <div className="flex justify-center">
                    <span
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${coordination.state
                            ? 'bg-lightGreen dark:bg-lightGreen text-white dark:text-white'
                            : 'bg-red-600 dark:bg-red-600 text-white dark:text-white'
                            }`}
                    >
                        <span>{coordination.state ? 'Activa' : 'Inactiva'}</span>
                    </span>
                </div>
            ),
        },
    ];

    // Función de filtrado para la búsqueda
    const filterFunction = (coordination: Coordination, filter: string) => {
        const searchTerm = filter.toLowerCase();
        return (
            coordination.name?.toLowerCase().includes(searchTerm) ||
            coordination.trainingCenter?.name?.toLowerCase().includes(searchTerm) ||
            coordination.teachers?.some(teacher => {
                if (!teacher) return false;

                const teacherName = `${teacher.collaborator?.person?.name || ''} ${teacher.collaborator?.person?.lastname || ''}`.trim().toLowerCase();
                const document = teacher.collaborator?.person?.document?.toLowerCase() || '';

                return teacherName.includes(searchTerm) || document.includes(searchTerm);
            }) ||
            false
        );
    };

    // COMENTADO TEMPORALMENTE: Manejo de loading y error del backend
    /*
    if (loading) {
        return <Loader />;
    }

    if (error) {
        return (
            <div className="space-y-4 md:space-y-6 px-2 sm:px-4 lg:px-0">
                <PageTitle>Mis Coordinaciones</PageTitle>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-600 text-sm sm:text-base">
                        Error: {typeof error === 'string' ? error : error.message || 'Error desconocido'}
                    </p>
                </div>
            </div>
        );
    }
    */

    // CAMBIO TEMPORAL: Siempre mostrar datos porque no dependen del backend ahora
    // if (!coordinacionesData || coordinacionesData.length === 0) {
    // Comentado porque siempre tenemos datos dummy
    /*
        return (
            <div className="space-y-4 md:space-y-6 px-2 sm:px-4 lg:px-0">
                <PageTitle>Mis Coordinaciones</PageTitle>
                <EmptyState
                    message="No tienes coordinaciones asignadas en este momento."
                    icon="/img/LogoAquilesWhite.png"
                />
            </div>
        );
    }
    */

    return (
        <div className="space-y-4 md:space-y-6 px-2 sm:px-4 lg:px-0">
            <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                <PageTitle>Mis coordinaciones</PageTitle>

                {/* Selector de vista */}
                <div className="flex items-center gap-1 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 p-1 w-full sm:w-auto">
                    <button
                        onClick={() => setViewMode('cards')}
                        className={`flex items-center justify-center gap-2 px-2 sm:px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition-all flex-1 sm:flex-none ${viewMode === 'cards'
                            ? 'bg-gradient-to-r from-primary to-lightGreen dark:from-secondary dark:to-blue-900 text-white shadow-sm'
                            : 'text-darkGray dark:text-gray-300 hover:text-primary dark:hover:text-shadowBlue hover:bg-gray-50 dark:hover:bg-gray-700'
                            }`}
                    >
                        <Grid3X3 size={14} className="sm:w-4 sm:h-4" />
                        <span className="hidden xs:inline">Cards</span>
                    </button>
                    <button
                        onClick={() => setViewMode('table')}
                        className={`flex items-center justify-center gap-2 px-2 sm:px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition-all flex-1 sm:flex-none ${viewMode === 'table'
                            ? 'bg-gradient-to-r from-primary to-lightGreen dark:from-secondary dark:to-blue-900 text-white shadow-sm'
                            : 'text-darkGray dark:text-gray-300 hover:text-primary dark:hover:text-shadowBlue hover:bg-gray-50 dark:hover:bg-gray-700'
                            }`}
                    >
                        <List size={14} className="sm:w-4 sm:h-4" />
                        <span className="hidden xs:inline">Tabla</span>
                    </button>
                </div>
            </div>

            {/* Renderizado condicional basado en el modo de vista */}
            {viewMode === 'cards' ? (
                // CAMBIO TEMPORAL: coordinacionesData era "coordinaciones" - REVERTIR DESPUÉS */
                <CardGrid
                    items={coordinacionesData}
                    renderCard={renderCoordinationCard}
                    pageSize={6}
                    columns={1} // 1 columna en móvil, se ajusta automáticamente en el CardGrid
                    filterPlaceholder="Buscar coordinaciones"
                    filterFunction={filterFunction}
                    isDarkMode={isDarkMode}
                    className="min-h-[400px]"
                />
            ) : (
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        {/* CAMBIO TEMPORAL: coordinacionesData era "coordinaciones" - REVERTIR DESPUÉS */}
                        <DataTable
                            columns={tableColumns}
                            data={coordinacionesData}
                            isDarkMode={isDarkMode}
                            pageSize={10}
                            filterPlaceholder="Buscar coordinaciones"
                            filterFunction={filterFunction}
                            className="min-h-[400px] min-w-[600px]"
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default CoordinacionesContainer;
'use client'

import React, { useEffect, useState } from 'react';
import PageTitle from '@components/UI/pageTitle';
import { useDispatch, useSelector } from 'react-redux';
import { useLoader } from '@context/LoaderContext';
import { AppDispatch, RootState } from '@redux/store';
import { fetchCoordinationByColaborator } from '@redux/slices/olympo/coordinationSlice';
import { Coordination } from '@graphql/generated';
import { Card, CardGrid } from '@components/UI/Card';
import DataTable from '@components/UI/DataTable';
import Loader from '@components/UI/Loader';
import EmptyState from '@components/UI/emptyState';
import { Users,Building2, Check, X, Grid3X3, List, User, UserCheck } from 'lucide-react';

type ViewMode = 'cards' | 'table';

const CoordinacionesCoordinador: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { showLoader, hideLoader } = useLoader();
    const [viewMode, setViewMode] = useState<ViewMode>('cards');
    const [isDarkMode, setIsDarkMode] = useState(false);

    const { data: coordinaciones, loading, error } = useSelector(
        (state: RootState) => state.coordination
    );

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

    useEffect(() => {
        const loadCoordinations = async () => {
            showLoader();
            try {
                await dispatch(fetchCoordinationByColaborator({ collaboratorId: 7, page: 0, size: 5 })).unwrap();
            } catch (error) {
                console.error('Error loading coordinations:', error);
            } finally {
                hideLoader();
            }
        };
        
        loadCoordinations();
    }, [dispatch]);

    // Función para renderizar las cards de coordinaciones
    const renderCoordinationCard = (coordination: Coordination) => (
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
                            <span className="flex items-center gap-1 px-2 py-1 bg-lightGreen/10 dark:bg-blue-900/20 text-lightGreen dark:text-blue-300 rounded-full text-xs sm:text-sm">
                                <Check size={12} className="sm:w-3.5 sm:h-3.5" />
                                Activa
                            </span>
                        ) : (
                            <span className="flex items-center gap-1 px-2 py-1 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-full text-xs sm:text-sm">
                                <X size={12} className="sm:w-3.5 sm:h-3.5" />
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
                            <p className="text-xs sm:text-sm font-medium text-darkGray dark:text-gray-300">Centro de Formación</p>
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
                            <div className="space-y-2 max-h-28 sm:max-h-32 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
                                {coordination.teachers?.slice(0, 3).map((teacher, index) =>
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
                                            <span className={`w-2 h-2 rounded-full flex-shrink-0 ${teacher.state ? 'bg-lightGreen dark:bg-blue-400' : 'bg-grayText dark:bg-gray-500'}`} />
                                        </div>
                                    ) : null
                                )}
                                {(coordination.teachers?.length || 0) > 3 && (
                                    <p className="text-xs text-grayText dark:text-gray-400 text-center py-1">
                                        +{(coordination.teachers?.length || 0) - 3} instructores más
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            }
            className="hover:shadow-xl transition-all duration-300 w-full"
        />
    );

    // Columnas para la tabla
    const tableColumns = [
        {
            key: 'name' as keyof Coordination,
            header: 'Coordinación',
            className: 'min-w-[200px]',
            render: (coordination: Coordination) => (
                <div className="font-medium text-primary dark:text-blue-300 capitalize">
                    <div className="truncate">{coordination.name}</div>
                </div>
            ),
        },
        {
            key: 'trainingCenter' as keyof Coordination,
            header: 'Centro',
            className: 'min-w-[180px] hidden sm:table-cell',
            render: (coordination: Coordination) => (
                <div className="text-darkBlue dark:text-white capitalize">
                    <div className="truncate">{coordination.trainingCenter?.name || 'No asignado'}</div>
                </div>
            ),
        },
        {
            key: 'teachers' as keyof Coordination,
            header: 'Instructores',
            className: 'min-w-[120px]',
            render: (coordination: Coordination) => {
                const activeTeachers = coordination.teachers?.filter(t => t && t.state).length || 0;
                const totalTeachers = coordination.teachers?.length || 0;
                return (
                    <div className="flex items-center gap-2">
                        <Users className="text-secondary dark:text-white flex-shrink-0" size={14} />
                        <span className="text-sm">
                            <span className="font-medium text-lightGreen dark:text-blue-300">{activeTeachers}</span>
                            <span className="text-grayText dark:text-gray-400">/{totalTeachers}</span>
                        </span>
                    </div>
                );
            },
        },
        {
            key: 'state' as keyof Coordination,
            header: 'Estado',
            className: 'min-w-[100px]',
            render: (coordination: Coordination) => (
                <span
                    className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${coordination.state
                        ? 'bg-lightGreen/10 dark:bg-blue-900/20 text-lightGreen dark:text-blue-300'
                        : 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                        }`}
                >
                    {coordination.state ? <Check size={12} /> : <X size={12} />}
                    <span className="hidden sm:inline">{coordination.state ? 'Activa' : 'Inactiva'}</span>
                    <span className="sm:hidden">{coordination.state ? 'OK' : 'X'}</span>
                </span>
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

    if (!coordinaciones || coordinaciones.length === 0) {
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

    return (
        <div className="space-y-4 md:space-y-6 px-2 sm:px-4 lg:px-0">
            <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                <PageTitle>Mis Coordinaciones</PageTitle>

                {/* Selector de vista */}
                <div className="flex items-center gap-1 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 p-1 w-full sm:w-auto">
                    <button
                        onClick={() => setViewMode('cards')}
                        className={`flex items-center justify-center gap-2 px-2 sm:px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition-all flex-1 sm:flex-none ${viewMode === 'cards'
                            ? 'bg-primary dark:bg-shadowBlue text-white shadow-sm'
                            : 'text-darkGray dark:text-gray-300 hover:text-primary dark:hover:text-shadowBlue hover:bg-gray-50 dark:hover:bg-gray-700'
                            }`}
                    >
                        <Grid3X3 size={14} className="sm:w-4 sm:h-4" />
                        <span className="hidden xs:inline">Cards</span>
                    </button>
                    <button
                        onClick={() => setViewMode('table')}
                        className={`flex items-center justify-center gap-2 px-2 sm:px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition-all flex-1 sm:flex-none ${viewMode === 'table'
                            ? 'bg-primary dark:bg-shadowBlue text-white shadow-sm'
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
                <CardGrid
                    items={coordinaciones}
                    renderCard={renderCoordinationCard}
                    pageSize={6}
                    columns={1} // 1 columna en móvil, se ajusta automáticamente en el CardGrid
                    filterPlaceholder="Buscar coordinaciones..."
                    filterFunction={filterFunction}
                    isDarkMode={isDarkMode}
                    className="min-h-[400px]"
                />
            ) : (
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <DataTable
                            columns={tableColumns}
                            data={coordinaciones}
                            isDarkMode={isDarkMode}
                            pageSize={10}
                            filterPlaceholder="Buscar coordinaciones..."
                            filterFunction={filterFunction}
                            className="min-h-[400px] min-w-[600px]"
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default CoordinacionesCoordinador;
'use client'

import React, { useEffect, useState, Suspense } from 'react';
import PageTitle from '@components/UI/pageTitle';
import DataTable from '@components/UI/DataTable';
import type { DataTableColumn } from '@components/UI/DataTable/types';
import { useUser } from '@context/UserContext';
import { clientLAN } from '@lib/apollo-client';
import { GET_IMPROVEMENT_PLANS_BY_STUDENT } from '@graphql/improvementPlanGraph';
import { GET_IMPROVEMENT_PLAN_EVALUATION_BY_PLAN_ID } from '@graphql/improvementPlanEvaluationGraph';
import { FiCalendar, FiEye, FiUpload, FiFile } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { client } from '@lib/apollo-client';
import { UPDATE_IMPROVEMENT_PLAN } from '@graphql/improvementPlanGraph';

interface ImprovementPlan {
    id: string;
    actNumber?: string;
    city?: string;
    date?: string;
    startTime?: string;
    endTime?: string;
    place?: string;
    reason?: string;
    state?: boolean;
    additionalJustification?: string;
    student?: {
        id: string;
        person?: {
            name?: string;
            lastname?: string;
            document?: string;
        };
    };
    teacherCompetence?: {
        id: string;
        competence?: {
            id: string;
            name?: string;
        };
    };
    learningOutcome?: {
        id: string;
    };
    improvementPlanFile?: string; // GraphQL serializa byte[] como Base64 String
    faultType?: {
        id: string;
        name?: string;
    };
}

const PlanesMejoramientoAprendizContent: React.FC = () => {
    const { user } = useUser();
    const router = useRouter();
    const [improvementPlans, setImprovementPlans] = useState<ImprovementPlan[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [evaluationsMap, setEvaluationsMap] = useState<Record<string, boolean | null>>({});
    const [uploadingPlanId, setUploadingPlanId] = useState<string | null>(null);

    // Debug: Mostrar información del usuario
    useEffect(() => {
        console.log('👤 Usuario actual:', {
            id: user?.id,
            name: user?.name,
            role: user?.role,
            email: user?.email
        });
    }, [user]);

    // Detectar modo oscuro
    useEffect(() => {
        const checkDarkMode = () => {
            const isDark = document.documentElement.classList.contains('dark');
            setIsDarkMode(isDark);
        };
        checkDarkMode();
        const observer = new MutationObserver(() => checkDarkMode());
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
        return () => observer.disconnect();
    }, []);

    // Cargar planes del estudiante
    useEffect(() => {
        const fetchStudentPlans = async () => {
            if (!user?.id || user.id === '0' || user.id === 0) {
                console.error('❌ No hay ID de usuario válido:', user);
                setError('No se pudo identificar al estudiante. Por favor, verifica que hayas iniciado sesión correctamente.');
                setLoading(false);
                return;
            }

            console.log('🔍 Cargando planes de mejoramiento para el estudiante:', {
                userId: user.id,
                userRole: user.role,
                page: currentPage - 1,
                size: 10
            });

            try {
                setLoading(true);
                setError(null);
                
                const { data } = await clientLAN.query({
                    query: GET_IMPROVEMENT_PLANS_BY_STUDENT,
                    variables: {
                        page: currentPage - 1,
                        size: 10,
                        studentId: Number(user.id)
                    },
                    fetchPolicy: 'network-only'
                });

                console.log('✅ Respuesta de la API:', data);

                if (data?.allImprovementPlans?.data) {
                    const plans = data.allImprovementPlans.data;
                    // Debug: Ver el valor de improvementPlanFile (ahora es array de bytes)
                    plans.forEach((plan: any) => {
                        console.log(`Plan ${plan.id} - improvementPlanFile:`, {
                            exists: !!plan.improvementPlanFile,
                            type: typeof plan.improvementPlanFile,
                            isArray: Array.isArray(plan.improvementPlanFile),
                            length: plan.improvementPlanFile?.length || 0
                        });
                    });
                    
                    setImprovementPlans(plans);
                    setTotalPages(data.allImprovementPlans.totalPages || 1);
                    console.log(`✅ Se cargaron ${plans.length} planes de mejoramiento`);
                } else {
                    setImprovementPlans([]);
                    console.log('ℹ️ No se encontraron planes de mejoramiento');
                }
            } catch (err: any) {
                console.error('❌ Error al cargar planes de mejoramiento:', err);
                setError(err.message || 'Error al cargar los planes de mejoramiento');
            } finally {
                setLoading(false);
            }
        };

        fetchStudentPlans();
    }, [user, currentPage]);

    // Cargar evaluaciones de los planes
    useEffect(() => {
        const fetchEvaluations = async () => {
            if (!improvementPlans || improvementPlans.length === 0) {
                setEvaluationsMap({});
                return;
            }

            try {
                const evaluations: Record<string, boolean | null> = {};
                
                for (const plan of improvementPlans) {
                    try {
                        const { data } = await clientLAN.query({
                            query: GET_IMPROVEMENT_PLAN_EVALUATION_BY_PLAN_ID,
                            variables: { improvementPlanId: Number(plan.id) },
                            fetchPolicy: 'network-only'
                        });

                        const evaluation = data?.improvementPlanEvaluationByImprovementPlanId?.data;
                        // Verificar el campo judgment para saber si está aprobado
                        if (evaluation) {
                            const isApproved = evaluation.judgment === true;
                            evaluations[plan.id] = isApproved;
                        } else {
                            evaluations[plan.id] = null; // Sin evaluación
                        }
                    } catch (err) {
                        console.log(`Plan ${plan.id} sin evaluación`);
                        evaluations[plan.id] = null;
                    }
                }

                setEvaluationsMap(evaluations);
                console.log('✅ Evaluaciones cargadas:', evaluations);
            } catch (err) {
                console.error('Error al cargar evaluaciones:', err);
            }
        };

        if (improvementPlans.length > 0) {
            fetchEvaluations();
        }
    }, [improvementPlans]);

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'No especificada';
        return new Date(dateString).toLocaleDateString('es-ES', { 
            day: '2-digit', 
            month: '2-digit', 
            year: 'numeric' 
        });
    };

    const handleUploadFile = async (planId: string) => {
        // Crear input file dinámicamente
        const input = document.createElement('input');
        input.type = 'file';
        // Solo aceptar documentos (PDF, Word, Excel, etc.)
        input.accept = '.pdf,.doc,.docx,.xls,.xlsx,.txt';
        
        input.onchange = async (e: any) => {
            const file = e.target.files?.[0];
            if (!file) return;

            // Validar tamaño máximo (5MB)
            const maxSize = 5 * 1024 * 1024; // 5MB
            if (file.size > maxSize) {
                toast.error('El archivo no debe superar 5MB');
                return;
            }

            // Validar tipo de archivo
            const allowedTypes = [
                'application/pdf',
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'application/vnd.ms-excel',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'text/plain'
            ];
            
            if (!allowedTypes.includes(file.type)) {
                toast.error('Solo se permiten archivos PDF, Word, Excel o TXT');
                return;
            }

            try {
                setUploadingPlanId(planId);
                
                // Convertir archivo a Base64
                const reader = new FileReader();
                reader.onload = async () => {
                    try {
                        // El FileReader devuelve: data:mimeType;base64,BASE64STRING
                        // Solo necesitamos la parte Base64
                        const base64String = (reader.result as string).split(',')[1];
                        
                        console.log('Subiendo archivo:', {
                            name: file.name,
                            type: file.type,
                            size: file.size,
                            base64Length: base64String.length
                        });
                        
                        // Actualizar el plan con el archivo en Base64 (String)
                        const { data } = await client.mutate({
                            mutation: UPDATE_IMPROVEMENT_PLAN,
                            variables: {
                                id: Number(planId),
                                input: {
                                    improvementPlanFile: base64String
                                }
                            }
                        });

                        if (data?.updateImprovementPlan?.code === '200') {
                            toast.success('Archivo subido exitosamente');
                            // Recargar los planes para mostrar el archivo actualizado
                            const { data: updatedData } = await clientLAN.query({
                                query: GET_IMPROVEMENT_PLANS_BY_STUDENT,
                                variables: {
                                    page: currentPage - 1,
                                    size: 10,
                                    studentId: Number(user?.id)
                                },
                                fetchPolicy: 'network-only'
                            });
                            
                            if (updatedData?.allImprovementPlans?.data) {
                                setImprovementPlans(updatedData.allImprovementPlans.data);
                            }
                        } else {
                            toast.error(data?.updateImprovementPlan?.message || 'Error al subir el archivo');
                        }
                    } catch (error: any) {
                        console.error('Error al subir archivo:', error);
                        toast.error(error.message || 'Error al subir el archivo');
                    } finally {
                        setUploadingPlanId(null);
                    }
                };
                
                reader.onerror = () => {
                    toast.error('Error al leer el archivo');
                    setUploadingPlanId(null);
                };
                
                reader.readAsDataURL(file);
            } catch (error: any) {
                console.error('Error al procesar archivo:', error);
                toast.error('Error al procesar el archivo');
                setUploadingPlanId(null);
            }
        };
        
        input.click();
    };

    const columns: DataTableColumn<ImprovementPlan>[] = [
        {
            key: 'actNumber',
            header: 'N° Acta',
            render: (row) => (
                <div className="flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-700 dark:text-white">
                        {row.actNumber || 'N/A'}
                    </span>
                </div>
            )
        },
        {
            key: 'competence',
            header: 'Competencia',
            render: (row) => (
                <div className="flex items-center justify-center">
                    <span className="text-sm text-gray-700 dark:text-white">
                        {row.teacherCompetence?.competence?.name || 'Sin competencia'}
                    </span>
                </div>
            )
        },
        {
            key: 'date',
            header: 'Fecha',
            render: (row) => (
                <div className="flex items-center justify-center gap-2 whitespace-nowrap">
                    <FiCalendar className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    <span className="text-sm text-gray-700 dark:text-white">
                        {formatDate(row.date)}
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
                const getFaultTypeStyle = (faultTypeName?: string) => {
                    if (!faultTypeName) return 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-500/10 dark:text-gray-400 dark:border-gray-500/30';
                    const name = faultTypeName.toLowerCase();
                    if (name.includes('academica') || name.includes('académica')) {
                        return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/30';
                    } else if (name.includes('disciplinaria')) {
                        return 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/30';
                    }
                    return 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-500/10 dark:text-gray-400 dark:border-gray-500/30';
                };

                return (
                    <div className="flex items-center justify-center">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold border transition-all duration-200 ${getFaultTypeStyle(row.faultType?.name)}`}>
                            <svg className="w-2 h-2" viewBox="0 0 8 8" fill="currentColor">
                                <circle cx="4" cy="4" r="3" />
                            </svg>
                            {row.faultType?.name || 'Sin tipo de falta'}
                        </span>
                    </div>
                );
            }
        },
        {
            key: 'evaluation',
            header: 'Evaluación',
            render: (row) => {
                const evaluation = evaluationsMap[row.id];
                
                // Si no hay evaluación, mostrar "Pendiente"
                if (evaluation === null || evaluation === undefined) {
                    return (
                        <div className="flex items-center justify-center">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold border transition-all duration-200 bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-500/10 dark:text-yellow-400 dark:border-yellow-500/30">
                                <svg className="w-2 h-2" viewBox="0 0 8 8" fill="currentColor">
                                    <circle cx="4" cy="4" r="3" />
                                </svg>
                                Pendiente
                            </span>
                        </div>
                    );
                }

                return (
                    <div className="flex items-center justify-center">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold border transition-all duration-200 ${
                            evaluation
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/30'
                                : 'bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/30'
                        }`}>
                            <svg className="w-2 h-2" viewBox="0 0 8 8" fill="currentColor">
                                <circle cx="4" cy="4" r="3" />
                            </svg>
                            {evaluation ? 'Aprobado' : 'No Aprobado'}
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
                        title="Ver detalles del plan"
                    >
                        <FiEye className="w-4 h-4 mr-2" /> VER
                    </button>

                    {row.improvementPlanFile && row.improvementPlanFile.length > 0 ? (
                        <button
                            onClick={() => {
                                try {
                                    const base64String = row.improvementPlanFile as string;
                                    
                                    console.log('📥 Descargando archivo, Base64 length:', base64String.length);
                                    
                                    // Limpiar el Base64 si tiene prefijos (data:type;base64,)
                                    let cleanBase64 = base64String;
                                    if (base64String.includes(',')) {
                                        cleanBase64 = base64String.split(',')[1];
                                    }
                                    
                                    // Detectar tipo MIME mirando los magic numbers (primeros bytes del archivo)
                                    const binaryString = atob(cleanBase64.substring(0, Math.min(100, cleanBase64.length)));
                                    const bytes = new Uint8Array(binaryString.length);
                                    for (let i = 0; i < binaryString.length; i++) {
                                        bytes[i] = binaryString.charCodeAt(i);
                                    }
                                    
                                    let mimeType = 'application/octet-stream';
                                    let extension = 'bin';
                                    
                                    // Detectar por "magic numbers" (firmas de archivo)
                                    if (bytes[0] === 0x25 && bytes[1] === 0x50 && bytes[2] === 0x44 && bytes[3] === 0x46) {
                                        // %PDF - PDF file
                                        mimeType = 'application/pdf';
                                        extension = 'pdf';
                                    } else if (bytes[0] === 0x50 && bytes[1] === 0x4B && bytes[2] === 0x03 && bytes[3] === 0x04) {
                                        // PK.. - ZIP-based (DOCX, XLSX, etc)
                                        const str = String.fromCharCode(...Array.from(bytes.slice(0, 100)));
                                        if (str.includes('word/')) {
                                            mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
                                            extension = 'docx';
                                        } else if (str.includes('xl/')) {
                                            mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
                                            extension = 'xlsx';
                                        }
                                    } else if (bytes[0] === 0xD0 && bytes[1] === 0xCF && bytes[2] === 0x11 && bytes[3] === 0xE0) {
                                        // Old Office format (DOC, XLS)
                                        mimeType = 'application/msword';
                                        extension = 'doc';
                                    } else {
                                        // Default to text
                                        mimeType = 'text/plain';
                                        extension = 'txt';
                                    }
                                    
                                    console.log('📄 Tipo detectado:', { mimeType, extension, firstBytes: Array.from(bytes.slice(0, 4)) });
                                    
                                    // Convertir TODO el Base64 a bytes
                                    const fullBinaryString = atob(cleanBase64);
                                    const fullBytes = new Uint8Array(fullBinaryString.length);
                                    for (let i = 0; i < fullBinaryString.length; i++) {
                                        fullBytes[i] = fullBinaryString.charCodeAt(i);
                                    }
                                    
                                    console.log('💾 Archivo completo:', { totalBytes: fullBytes.length, mimeType });
                                    
                                    // Crear blob con el tipo MIME correcto
                                    const blob = new Blob([fullBytes], { type: mimeType });
                                    const url = window.URL.createObjectURL(blob);
                                    const link = document.createElement('a');
                                    link.href = url;
                                    link.download = `plan_mejoramiento_${row.actNumber || row.id}.${extension}`;
                                    document.body.appendChild(link);
                                    link.click();
                                    document.body.removeChild(link);
                                    window.URL.revokeObjectURL(url);
                                    
                                    toast.success('Archivo descargado correctamente');
                                } catch (error) {
                                    console.error('❌ Error al descargar:', error);
                                    toast.error('Error al descargar el archivo');
                                }
                            }}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
                            title="Descargar archivo"
                        >
                            <FiFile className="w-4 h-4 mr-2" /> DESCARGAR
                        </button>
                    ) : (
                        <button
                            onClick={() => handleUploadFile(row.id)}
                            disabled={uploadingPlanId === row.id}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-lightGreen to-primary hover:from-primary hover:to-lightGreen focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:bg-gradient-to-r dark:from-blue-600 dark:to-blue-700 dark:hover:from-blue-700 dark:hover:to-blue-800 dark:focus:ring-blue-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Subir archivo de evidencia (PDF, Word, Excel, TXT)"
                        >
                            {uploadingPlanId === row.id ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    SUBIENDO...
                                </>
                            ) : (
                                <>
                                    <FiUpload className="w-4 h-4 mr-2" /> SUBIR ARCHIVO
                                </>
                            )}
                        </button>
                    )}
                </div>
            )
        }
    ];

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
                <PageTitle>Mis Planes De Mejoramiento</PageTitle>
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl shadow-lg p-6 mt-4">
                    <h3 className="text-sm font-medium text-red-800 dark:text-red-400">Error al cargar los datos</h3>
                    <div className="mt-2 text-sm text-red-700 dark:text-red-300">{error}</div>
                </div>
            </div>
        );
    }

    if (improvementPlans.length === 0) {
        return (
            <div className="mx-auto px-4 py-8">
                <PageTitle>Mis Planes De Mejoramiento</PageTitle>
                <div className="text-center py-12 mt-4">
                    <div className="bg-white dark:bg-shadowBlue rounded-2xl shadow-lg p-8 border border-lightGray dark:border-grayText">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full mb-4 mx-auto">
                            <FiCalendar className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                        </div>
                        <h3 className="text-lg font-semibold text-black dark:text-white mb-2">
                            No tienes planes de mejoramiento asignados
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            Actualmente no hay planes de mejoramiento registrados para tu cuenta.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto px-4 py-8">
            <div className="space-y-6">
                <PageTitle>Mis Planes De Mejoramiento</PageTitle>
                
                <DataTable<ImprovementPlan>
                    columns={columns}
                    data={improvementPlans}
                    filterPlaceholder="Buscar..."
                    className="shadow-lg"
                    isDarkMode={isDarkMode}
                    externalPage={currentPage}
                    onExternalPageChange={setCurrentPage}
                    externalTotalPages={totalPages}
                />
            </div>
        </div>
    );
};

const PlanMejoramientoAprendiz: React.FC = () => {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-gray-100 mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Cargando...</p>
                </div>
            </div>
        }>
            <PlanesMejoramientoAprendizContent />
        </Suspense>
    );
};

export default PlanMejoramientoAprendiz;
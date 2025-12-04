"use client";

import PageTitle from "@components/UI/pageTitle";
import { useRouter, useSearchParams } from "next/navigation";
import { FiArrowLeft, FiUser, FiUsers, FiMapPin, FiCalendar, FiFileText, FiStar, FiBook, FiSave, FiX, FiCheckCircle, FiAlertTriangle } from "react-icons/fi";
import React, { useState, useEffect, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@redux/store";
import { fetchFaultTypes } from "@/redux/slices/improvementPlanFaultTypeSlice";
import { addImprovementPlan, fetchTeacherCompetencesByStudySheet } from "@slice/improvementPlanSlice";
import { clientLAN } from "@lib/apollo-client";
import { GET_All_STUDENTS, GET_STUDENT_LIST } from "@graphql/olympo/studentsGraph";
import { GET_STUDY_SHEET_BY_ID, GET_LEARNING_OUTCOMES_BY_COMPETENCE } from "@graphql/olympo/studySheetGraph";
import { GET_ALL_IMPROVEMENT_PLANS } from "@graphql/improvementPlanGraph";
import { toast } from "react-toastify";
import { useLoader } from "@context/LoaderContext";
import ModalLearningOutcome from "@components/Modals/ModalLearningOutcome";

const FormularioPlanesDeMejoramientoContent =() => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const dispatch = useDispatch<AppDispatch>();
    const { showLoader, hideLoader } = useLoader();

    // Función para generar actNumber único (temporal, se verificará en backend)
    const generateActNumber = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = 'ACT-';
        for (let i = 0; i < 4; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    };

    // Selectors de Redux
    const { data: faultTypes, loading: faultTypesLoading } = useSelector((state: any) => state.faultType);

    // Estado del formulario
    // Estado para selección y listado de estudiantes (normalizados)
    const [selectedStudent, setSelectedStudent] = useState('');
    const [students, setStudents] = useState<any[]>([]); // Cada item tendrá shape: { id: string, person: { name, lastname, document, email } }
    const [studentsLoading, setStudentsLoading] = useState(false);
    const [studentsError, setStudentsError] = useState<string | null>(null);
    const [studySheetId, setStudySheetId] = useState<number | null>(null);
    const [studySheet, setStudySheet] = useState<any>(null);
    const [competencies, setCompetencies] = useState<any[]>([]);
    const [formData, setFormData] = useState({
        // Datos del estudiante
        studentName: '',
        studentLastname: '',
        studentDocument: '',
        studentEmail: '',
        city: 'Bogotá',
        date: new Date().toISOString().split('T')[0],
        startTime: '',
        endTime: '',
        place: '',
        reason: '',
        state: true,
        teacherCompetenceId: '',
        learningOutcomeId: '',
        faultTypeId: '',
        additionalJustification: '',
    });
    
    const [studentHasActivePlan, setStudentHasActivePlan] = useState(false);
    const [checkingActivePlan, setCheckingActivePlan] = useState(false);

    const [showSuccess, setShowSuccess] = useState(false);
    const [isModalLearningOutcomeOpen, setIsModalLearningOutcomeOpen] = useState(false);
    const [selectedCompetenceLearningOutcomes, setSelectedCompetenceLearningOutcomes] = useState<any[]>([]);
    const [selectedCompetenceName, setSelectedCompetenceName] = useState('');
    const [loadingLearningOutcomes, setLoadingLearningOutcomes] = useState(false);

    // Detectar modo oscuro
    const [isDarkMode, setIsDarkMode] = React.useState(false);

    useEffect(() => {
        // Función para detectar el modo oscuro
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
    }, []);

    // Obtener el studySheetId de la URL
    useEffect(() => {
        const id = searchParams.get('studySheetId');
        if (id) {
            setStudySheetId(parseInt(id, 10));
        }
    }, [searchParams]);

    // Fetch la ficha cuando tengamos studySheetId
    useEffect(() => {
        const fetchStudySheet = async () => {
            if (!studySheetId) return;
            try {
                const { data } = await clientLAN.query({
                    query: GET_STUDY_SHEET_BY_ID,
                    variables: { id: studySheetId },
                });
                setStudySheet(data.studySheetById.data);
                console.log('studySheet fetched:', data.studySheetById.data);
            } catch (error) {
                console.error('Error fetching studySheet:', error);
            }
        };
        fetchStudySheet();
    }, [studySheetId]);

    // Cargar estudiantes por studySheetId
    useEffect(() => {
        const loadStudents = async () => {
            if (!studySheetId) return;
            setStudentsLoading(true);
            setStudentsError(null);
            try {
                const { data } = await clientLAN.query({
                    query: GET_All_STUDENTS,
                    variables: { idStudySheet: studySheetId, page: 0, size: 200 },
                    fetchPolicy: 'no-cache'
                });
                const rawStudents = data?.allStudents?.data || [];
                console.log('Estudiantes cargados:', rawStudents);
                
                // Normalizar estudiantes
                const normalizedStudents = rawStudents.map((student: any) => ({
                    id: student.id,
                    person: student.person
                }));
                setStudents(normalizedStudents);
            } catch (error) {
                console.error('Error loading students:', error);
                setStudentsError('Error al cargar estudiantes');
            } finally {
                setStudentsLoading(false);
            }
        };
        loadStudents();
    }, [studySheetId]);

    // Cargar competencias y tipos de falta
    useEffect(() => {
        const loadInitialData = async () => {
            try {
                let loadedCompetences: any[] = [];
                
                if (studySheetId) {
                    console.log('Cargando competencias para studySheetId:', studySheetId);
                    const teacherId = 1; // TODO: reemplazar con user.id si está en contexto
                    try {
                        const res = await dispatch(fetchTeacherCompetencesByStudySheet({
                            studySheetId: String(studySheetId),
                            teacherId: String(teacherId)
                        })).unwrap();
                        loadedCompetences = res || [];
                        console.log('Competencias cargadas:', res);
                    } catch (competenceErr) {
                        console.warn('No se pudieron cargar competencias:', competenceErr);
                    }
                }
                
                setCompetencies(loadedCompetences);

                // Asegurar que se traigan todos los tipos de falta disponibles
                const faultTypesResult = await dispatch(fetchFaultTypes({ page: 0, size: 100})).unwrap();
                console.log('Tipos de falta recibidos:', faultTypesResult);
            } catch (error) {
                console.error('Error al cargar datos iniciales:', error);
                toast.error('Error al cargar datos iniciales', {
                    position: "top-right",
                    autoClose: 4000,
                });
            }
        };
        loadInitialData();
    }, [dispatch, studySheetId]);

    // Obtener datos del estudiante seleccionado
    const getSelectedStudentData = () => students.find(s => String(s.id) === String(selectedStudent));

    // Manejar cambios en el formulario
    const handleInputChange = (field: string, value: any) => {
        // Si el formulario aún no tiene hora de inicio/fin, establecerlas al primer cambio
        if (field !== 'startTime' && field !== 'endTime') {
            setStartAndEndIfEmpty();
        }

        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // Establecer hora de inicio (ahora) y fin (+1h) si aún no están definidas
    const setStartAndEndIfEmpty = () => {
        setFormData(prev => {
            if (prev.startTime && prev.endTime) return prev;
            const now = new Date();
            const pad = (n: number) => String(n).padStart(2, '0');
            const hh = pad(now.getHours());
            const mm = pad(now.getMinutes());
            const start = `${hh}:${mm}`;
            const later = new Date(now.getTime() + 60 * 60 * 1000);
            const end = `${pad(later.getHours())}:${pad(later.getMinutes())}`;
            const today = new Date().toISOString().split('T')[0];
            return {
                ...prev,
                startTime: prev.startTime || start,
                endTime: prev.endTime || end,
                date: prev.date || today,
            };
        });
    };

    // Establecer la fecha actual si está vacía
    const setDateIfEmpty = () => {
        setFormData(prev => {
            if (prev.date) return prev;
            const today = new Date().toISOString().split('T')[0];
            return { ...prev, date: today };
        });
    };

    // Manejar selección de competencia
    const handleCompetenceChange = (competenceId: string) => {
        setFormData(prev => ({
            ...prev,
            teacherCompetenceId: competenceId,
            learningOutcomeId: '' // Reset learning outcome when competence changes
        }));
    };

    // Manejar selección de learning outcome
    const handleLearningOutcomeSelect = (learningOutcomeId: string) => {
        setFormData(prev => ({
            ...prev,
            learningOutcomeId
        }));
        setIsModalLearningOutcomeOpen(false);
    };

    // Manejar selección de estudiante y rellenar campos automáticamente
    const handleStudentChange = async (studentId: string) => {
        setSelectedStudent(studentId);
        if (!studentId) {
            setFormData(prev => ({
                ...prev,
                studentName: '',
                studentLastname: '',
                studentDocument: '',
                studentEmail: '',
                additionalJustification: ''
            }));
            setStudentHasActivePlan(false);
            return;
        }
        
        const student = students.find(s => String(s.id) === String(studentId));
        if (student) {
            setFormData(prev => ({
                ...prev,
                studentName: student.person?.name || '',
                studentLastname: student.person?.lastname || '',
                studentDocument: student.person?.document || '',
                studentEmail: student.person?.email || '',
                additionalJustification: ''
            }));
            
            // Verificar si el estudiante ya tiene un plan activo
            setCheckingActivePlan(true);
            try {
                const { data } = await clientLAN.query({
                    query: GET_ALL_IMPROVEMENT_PLANS,
                    variables: { page: 0, size: 100 },
                    fetchPolicy: 'no-cache'
                });
                
                const allPlans = data?.allImprovementPlans?.data || [];
                const hasActive = allPlans.some((plan: any) => 
                    String(plan.student?.id) === String(studentId) && plan.state === true
                );
                
                setStudentHasActivePlan(hasActive);
                
                if (hasActive) {
                    toast.warning(
                        'Este aprendiz ya tiene un plan de mejoramiento activo. Debe proporcionar una justificación para crear otro.',
                        {
                            position: "top-right",
                            autoClose: 6000,
                        }
                    );
                }
            } catch (error) {
                console.error('Error al verificar planes activos:', error);
                setStudentHasActivePlan(false);
            } finally {
                setCheckingActivePlan(false);
            }
            
            // Registrar hora de inicio y fin al comenzar a diligenciar (si aún no hay)
            setStartAndEndIfEmpty();
            setDateIfEmpty();
        }
    };

    // Manejar envío del formulario
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!selectedStudent) {
            toast.error('Por favor selecciona un estudiante', {
                position: "top-right",
                autoClose: 4000,
            });
            return;
        }

        // Validaciones adicionales
        if (!formData.teacherCompetenceId) {
            toast.error('Por favor selecciona una competencia', {
                position: "top-right",
                autoClose: 4000,
            });
            return;
        }

        if (!formData.faultTypeId) {
            toast.error('Por favor selecciona un tipo de falta', {
                position: "top-right",
                autoClose: 4000,
            });
            return;
        }

        if (!formData.startTime) {
            toast.error('Por favor selecciona la hora de inicio', {
                position: "top-right",
                autoClose: 4000,
            });
            return;
        }

        if (!formData.endTime) {
            toast.error('Por favor selecciona la hora de fin', {
                position: "top-right",
                autoClose: 4000,
            });
            return;
        }

        if (!formData.place.trim()) {
            toast.error('Por favor ingresa el lugar', {
                position: "top-right",
                autoClose: 4000,
            });
            return;
        }

        if (!formData.startTime) {
            toast.error('Por favor ingresa la hora de inicio', {
                position: "top-right",
                autoClose: 4000,
            });
            return;
        }

        if (!formData.endTime) {
            toast.error('Por favor ingresa la hora de fin', {
                position: "top-right",
                autoClose: 4000,
            });
            return;
        }

        if (!formData.place.trim()) {
            toast.error('Por favor ingresa el lugar', {
                position: "top-right",
                autoClose: 4000,
            });
            return;
        }


        if (!formData.learningOutcomeId) {
            toast.error('Por favor selecciona un resultado de aprendizaje', {
                position: "top-right",
                autoClose: 4000,
            });
            return;
        }


        // Verificaciones adicionales antes de enviar
        if (!selectedStudent || selectedStudent === '') {
            toast.error('Error: No se ha seleccionado un estudiante válido', {
                position: "top-right",
                autoClose: 4000,
            });
            return;
        }

        if (!formData.teacherCompetenceId || formData.teacherCompetenceId === '') {
            toast.error('Error: No se ha seleccionado una competencia válida', {
                position: "top-right",
                autoClose: 4000,
            });
            return;
        }

        if (!formData.faultTypeId || formData.faultTypeId === '') {
            toast.error('Error: No se ha seleccionado un tipo de falta válido', {
                position: "top-right",
                autoClose: 4000,
            });
            return;
        }
        
        // Validar justificación adicional si el estudiante ya tiene un plan activo
        if (studentHasActivePlan) {
            if (!formData.additionalJustification || formData.additionalJustification.trim() === '') {
                toast.error('Este aprendiz ya tiene un plan de mejoramiento activo. Debe proporcionar una justificación para crear otro plan.', {
                    position: "top-right",
                    autoClose: 6000,
                });
                return;
            }
            
            if (formData.additionalJustification.trim().length < 20) {
                toast.error('La justificación debe tener al menos 20 caracteres.', {
                    position: "top-right",
                    autoClose: 4000,
                });
                return;
            }
        }

        showLoader();

        try {
            const improvementPlanData = {
                // En GraphQL ID suele mapear a string en TS; el backend lo convierte a Long
                studentId: String(selectedStudent),
                city: formData.city,
                date: formData.date, // formato "YYYY-MM-DD"
                startTime: formData.startTime,
                endTime: formData.endTime,
                place: formData.place,
                reason: formData.reason,
                state: formData.state,
                teacherCompetence: String(formData.teacherCompetenceId),
                learningOutcome: formData.learningOutcomeId ? String(formData.learningOutcomeId) : undefined,
                faultType: { id: String(formData.faultTypeId) },
                additionalJustification: formData.additionalJustification.trim() || undefined
            } as const;

            // Logs corregidos para evitar errores de acceso
            console.log('=== DATOS ANTES DE ENVIAR ===');
            console.log('selectedStudent:', selectedStudent);
            console.log('formData completo:', formData);
            console.log('improvementPlanData final:', improvementPlanData);
            console.log('Tipos de datos:');
            console.log('- studentId (ID):', typeof improvementPlanData.studentId, '=', improvementPlanData.studentId);
            console.log('- teacherCompetence (ID):', typeof improvementPlanData.teacherCompetence, '=', improvementPlanData.teacherCompetence);
            console.log('- faultType.id (ID):', typeof improvementPlanData.faultType.id, '=', improvementPlanData.faultType.id);
            console.log('- Estudiante seleccionado:', getSelectedStudentData());
            console.log('- Competencias disponibles:', competencies);
            console.log('- Tipos de falta disponibles:', faultTypes);
            console.log('===============================');

            const result = await dispatch(addImprovementPlan(improvementPlanData)).unwrap();
            console.log('Resultado del guardado:', result);
            setShowSuccess(true);
            toast.success('Plan de mejoramiento guardado exitosamente', {
                position: "top-right",
                autoClose: 3000,
            });
            setTimeout(() => {
                setShowSuccess(false);
                // Si el backend devolvió el id del plan en result.id, redirigir a la página de actividades
                const planId = (result && (result as any).id) ? (result as any).id : null;
                if (planId) {
                    router.push(`/dashboard/ActividadPlanesDeMejoramiento?planId=${planId}`);
                } else {
                    router.back();
                }
            }, 1500);
        } catch (error) {
            console.error('Error completo:', error);
            console.error('Error al guardar plan de mejoramiento:', {
                error: error,
                message: (error as any)?.message || 'Error desconocido',
                code: (error as any)?.code || 'Sin código',
                graphQLErrors: (error as any)?.graphQLErrors || [],
                networkError: (error as any)?.networkError || null,
                formData: formData
            });
            
            let errorMessage = 'Error desconocido';
            
            // Manejar errores de GraphQL
            if ((error as any)?.graphQLErrors && (error as any).graphQLErrors.length > 0) {
                errorMessage = (error as any).graphQLErrors[0].message;
            }
            // Manejar errores de red
            else if ((error as any)?.networkError) {
                errorMessage = `Error de conexión: ${(error as any).networkError.message}`;
            }
            // Manejar otros errores
            else if ((error as any)?.message) {
                errorMessage = (error as any).message;
            }
            
            // Mostrar error al usuario
            toast.error(`Error al guardar el plan de mejoramiento: ${errorMessage}`, {
                position: "top-right",
                autoClose: 6000,
            });
        } finally {
            hideLoader();
        }
    };

    return (
        <div className="mx-auto px-4 py-8">
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <PageTitle onBack={() => router.back()}>
                        {studySheet
                            ? `Crear Plan de Mejoramiento - Ficha N° ${studySheet.number}`
                            : `Formulario De Planes De Mejoramiento`
                        }
                    </PageTitle>
                </div>

                {/* Contenedor del formulario */}
                <div className="bg-white dark:bg-shadowBlue rounded-2xl shadow-lg border border-lightGray dark:border-grayText overflow-hidden">
                    <form onSubmit={handleSubmit} className="space-y-0">
                        {/* Selector de Estudiante */}
                        <div className="p-6">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-8 h-8 bg-gradient-to-r from-primary to-lightGreen dark:from-secondary dark:to-darkBlue rounded-full flex items-center justify-center">
                                    <FiUser className="w-4 h-4 text-white" />
                                </div>

                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                         Mejoramiento
                                </h3>
                            </div>

                            {studySheet ? (
                                <div className="space-y-4">
                                    {/* Select de estudiantes */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Seleccionar Estudiante
                                            <span className="text-gray-500 font-normal ml-1">({students.length})</span>
                                        </label>
                                        <div className="relative">
                                            <select
                                                value={selectedStudent}
                                                onChange={(e) => handleStudentChange(e.target.value)}
                                                className="w-full px-4 py-3 pr-10 border border-gray-300 dark:border-gray-600 rounded-xl text-sm bg-white dark:bg-gray-700 text-black dark:text-white focus:ring-2 focus:ring-primary dark:focus:ring-lightGreen focus:border-transparent transition-all duration-200 appearance-none cursor-pointer"
                                                required
                                                disabled={studentsLoading || !!studentsError}
                                            >
                                                <option value="">
                                                    {studentsLoading
                                                        ? 'Cargando estudiantes...'
                                                        : studentsError
                                                            ? 'Error al cargar estudiantes'
                                                            : students.length === 0
                                                                ? 'No hay estudiantes en esta ficha'
                                                                : 'Seleccione un estudiante...'}
                                                </option>
                                                {!studentsLoading && !studentsError && students.map((student) => (
                                                    <option key={student.id} value={student.id}>
                                                        {(student.person?.name || '').toUpperCase()} {(student.person?.lastname || '').toUpperCase()}
                                                    </option>
                                                ))}
                                            </select>
                                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                                <FiUsers className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                                            </div>
                                        </div>
                                        {studentsError && (
                                            <p className="mt-2 text-xs text-red-600 dark:text-red-400">{studentsError}</p>
                                        )}
                                    </div>

                                    {/* Campos de solo lectura del estudiante (siempre visibles) */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                        {/* Documento */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                <FiFileText className="w-4 h-4 inline mr-2" />
                                                Documento
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.studentDocument}
                                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl text-sm bg-gray-50 dark:bg-gray-600 text-black dark:text-white cursor-not-allowed transition-all duration-200"
                                                placeholder="Documento del estudiante..."
                                                disabled
                                                readOnly
                                            />
                                        </div>

                                        {/* Email */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                <FiUser className="w-4 h-4 inline mr-2" />
                                                Email
                                            </label>
                                            <input
                                                type="email"
                                                value={formData.studentEmail}
                                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl text-sm bg-gray-50 dark:bg-gray-600 text-black dark:text-white cursor-not-allowed transition-all duración-200"
                                                placeholder="Email del estudiante..."
                                                disabled
                                                readOnly
                                            />
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full mb-4 mx-auto">
                                        <FiUsers className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                                    </div>
                                    <p>No hay ficha seleccionada. Accede desde el historial de una ficha específica.</p>
                                </div>
                            )}
                        </div>

                        {/* Detalles del Plan de Mejoramiento */}
                            <div className="p-6 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Competencia */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            <FiBook className="w-4 h-4 inline mr-2" />
                                            Competencia <span className="text-red-600">*</span>
                                        </label>
                                        <select
                                            value={formData.teacherCompetenceId}
                                            onChange={(e) => handleCompetenceChange(e.target.value)}
                                            className="w-full h-12 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl text-sm bg-white dark:bg-gray-700 text-black dark:text-white focus:ring-2 focus:ring-primary dark:focus:ring-lightGreen focus:border-transparent transition-all duration-200"
                                            required
                                            disabled={!competencies || competencies.length === 0}
                                        >
                                            <option value="">
                                                {!competencies || competencies.length === 0 
                                                    ? 'No hay competencias disponibles para esta ficha'
                                                    : 'Seleccionar competencia...'
                                                }
                                            </option>
                                            {competencies?.map((comp: any) => (
                                                <option key={comp.id} value={comp.id}>
                                                    {comp.competence?.name?.toUpperCase() || comp.name?.toUpperCase() || 'Competencia sin nombre'}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Tipo de Falta */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            <FiAlertTriangle className="w-4 h-4 inline mr-2" />
                                            Tipo de Falta <span className="text-red-600">*</span>
                                        </label>
                                        <select
                                            value={formData.faultTypeId}
                                            onChange={(e) => handleInputChange('faultTypeId', e.target.value)}
                                            className="w-full h-12 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl text-sm bg-white dark:bg-gray-700 text-black dark:text-white focus:ring-2 focus:ring-primary dark:focus:ring-lightGreen focus:border-transparent transition-all duration-200"
                                            required
                                            disabled={faultTypesLoading}
                                        >
                                            <option value="">
                                                {faultTypesLoading ? 'Cargando tipos de fallas...' : 'Seleccionar tipo de falta...'}
                                            </option>
                                            {faultTypes?.map((type: any) => (
                                                <option key={type.id} value={type.id}>
                                                    {type.name.toUpperCase()}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Resultado de Aprendizaje */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            <FiBook className="w-4 h-4 inline mr-2" />
                                            Resultado de Aprendizaje <span className="text-red-600">*</span>
                                        </label>
                                        <div className="flex flex-col sm:flex-row gap-2">
                                            <input
                                                type="text"
                                                value={selectedCompetenceLearningOutcomes.find(lo => String(lo.id) === String(formData.learningOutcomeId))?.name || ''}
                                                className="flex-1 h-12 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl text-sm bg-gray-50 dark:bg-gray-600 text-black dark:text-white cursor-not-allowed"
                                                placeholder="Seleccione una competencia primero..."
                                                disabled
                                                readOnly
                                            />
                                            <button
                                                type="button"
                                                onClick={async () => {
                                                    if (!formData.teacherCompetenceId) return;
                                                    setLoadingLearningOutcomes(true);
                                                    try {
                                                        const selectedComp = competencies.find((comp: any) => String(comp.id) === String(formData.teacherCompetenceId));
                                                        setSelectedCompetenceName(selectedComp?.competence?.name || 'Competencia');
                                                        
                                                        const { data } = await clientLAN.query({
                                                            query: GET_LEARNING_OUTCOMES_BY_COMPETENCE,
                                                            variables: { idCompetence: selectedComp?.competence?.id, page: 0, size: 10 }
                                                        });
                                                        
                                                        const learningOutcomes = data?.allLearningOutcomes?.data || [];
                                                        setSelectedCompetenceLearningOutcomes(learningOutcomes);
                                                        setIsModalLearningOutcomeOpen(true);
                                                    } catch (error) {
                                                        console.error('Error fetching learning outcomes:', error);
                                                        toast.error('Error al cargar resultados de aprendizaje');
                                                    } finally {
                                                        setLoadingLearningOutcomes(false);
                                                    }
                                                }}
                                                disabled={!formData.teacherCompetenceId || loadingLearningOutcomes}
                                                className="w-full sm:w-auto h-12 px-4 py-3 bg-primary hover:bg-lightGreen text-white rounded-xl font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {loadingLearningOutcomes ? 'Cargando...' : <FiBook className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Fecha */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            <FiCalendar className="w-4 h-4 inline mr-2" />
                                            Fecha
                                        </label>
                                            <input
                                                type="date"
                                                value={formData.date}
                                                className="w-full h-12 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl text-sm bg-gray-50 dark:bg-gray-600 text-black dark:text-white cursor-not-allowed"
                                                readOnly
                                                disabled
                                                aria-readonly
                                            />
                                    </div>

                                    {/* Ciudad */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            <FiMapPin className="w-4 h-4 inline mr-2" />
                                            Ciudad
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.city}
                                            readOnly
                                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl text-sm bg-gray-100 dark:bg-gray-600 text-black dark:text-white focus:ring-2 focus:ring-primary dark:focus:ring-lightGreen focus:border-transparent transition-all duration-200"
                                            placeholder="Bogotá"
                                        />
                                    </div>

                                    {/* Hora de Inicio */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            <FiCalendar className="w-4 h-4 inline mr-2" />
                                            Hora de Inicio
                                        </label>
                                        <input
                                            type="time"
                                            value={formData.startTime}
                                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl text-sm bg-gray-50 dark:bg-gray-600 text-black dark:text-white cursor-not-allowed"
                                            readOnly
                                            disabled
                                            aria-readonly
                                        />
                                    </div>

                                    {/* Hora de Fin */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            <FiCalendar className="w-4 h-4 inline mr-2" />
                                            Hora de Fin
                                        </label>
                                        <input
                                            type="time"
                                            value={formData.endTime}
                                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl text-sm bg-gray-50 dark:bg-gray-600 text-black dark:text-white cursor-not-allowed"
                                            readOnly
                                            disabled
                                            aria-readonly
                                        />
                                    </div>

                                    {/* Lugar */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            <FiMapPin className="w-4 h-4 inline mr-2" />
                                            Lugar <span className="text-red-600">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.place}
                                            onChange={(e) => handleInputChange('place', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl text-sm bg-white dark:bg-gray-700 text-black dark:text-white focus:ring-2 focus:ring-primary dark:focus:ring-lightGreen focus:border-transparent transition-all duration-200"
                                            placeholder="Ingrese el lugar..."
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Razón */}
                                <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            <FiFileText className="w-4 h-4 inline mr-2" />
                                            Razón del Plan de Mejoramiento <span className="text-red-600">*</span>
                                        </label>
                                    <textarea
                                        value={formData.reason}
                                        onChange={(e) => handleInputChange('reason', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl text-sm bg-white dark:bg-gray-700 text-black dark:text-white focus:ring-2 focus:ring-primary dark:focus:ring-lightGreen focus:border-transparent transition-all duration-200"
                                        rows={4}
                                        placeholder="Ingrese la razón del plan de mejoramiento..."
                                        required
                                    />
                                </div>
                                
                                {/* Justificación Adicional - Solo si el estudiante ya tiene un plan activo */}
                                {studentHasActivePlan && (
                                    <div className="border-2 border-yellow-400 dark:border-yellow-500 rounded-xl p-4 bg-yellow-50 dark:bg-yellow-900/20">
                                        <div className="flex items-start gap-3 mb-3">
                                            <FiAlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                                            <div className="flex-1">
                                                <h4 className="text-sm font-semibold text-yellow-800 dark:text-yellow-300 mb-1">
                                                    Plan de Mejoramiento Activo Detectado
                                                </h4>
                                                <p className="text-xs text-yellow-700 dark:text-yellow-400 mb-3">
                                                    Este aprendiz ya tiene un plan de mejoramiento activo. Para crear un nuevo plan, debe proporcionar una justificación detallada.
                                                </p>
                                            </div>
                                        </div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            <FiFileText className="w-4 h-4 inline mr-2" />
                                            Justificación para Nuevo Plan <span className="text-red-600">*</span>
                                        </label>
                                        <textarea
                                            value={formData.additionalJustification}
                                            onChange={(e) => handleInputChange('additionalJustification', e.target.value)}
                                            className="w-full px-4 py-3 border-2 border-yellow-400 dark:border-yellow-500 rounded-xl text-sm bg-white dark:bg-gray-700 text-black dark:text-white focus:ring-2 focus:ring-yellow-500 dark:focus:ring-yellow-400 focus:border-transparent transition-all duration-200"
                                            rows={4}
                                            placeholder="Explique por qué es necesario crear un nuevo plan de mejoramiento cuando ya existe uno activo (mínimo 20 caracteres)..."
                                            required
                                        />
                                        <p className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                                            {formData.additionalJustification.length} / 20 caracteres mínimos
                                        </p>
                                    </div>
                                )}

                                {/* Objetivos y conclusiones movidos a Actividades: campos eliminados del formulario de Plan */}
                            </div>

                        {/* Botones */}
                        <div className="flex flex-col sm:flex-row justify-end gap-3 p-6 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-600">
                            <button
                                type="button"
                                onClick={() => router.back()}
                                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200 font-medium"
                            >
                                <FiX className="w-4 h-4 mr-2" />
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={!selectedStudent}
                                className={`w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-lightGreen to-primary hover:from-primary hover:to-lightGreen text-white rounded-xl font-medium shadow-lg transition-all duration-200 ${!selectedStudent
                                    ? 'opacity-50 cursor-not-allowed'
                                    : 'hover:shadow-xl transform hover:-translate-y-0.5'
                                    }`}
                            >
                                <FiSave className="w-4 h-4 mr-2" />
                                Guardar
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Modal para seleccionar Learning Outcome */}
            <ModalLearningOutcome
                isOpen={isModalLearningOutcomeOpen}
                onClose={() => setIsModalLearningOutcomeOpen(false)}
                competenceName={selectedCompetenceName}
                learningOutcomes={selectedCompetenceLearningOutcomes}
                loading={loadingLearningOutcomes}
                onSelectLearningOutcome={handleLearningOutcomeSelect}
            />
        </div>
    );
}

const FormularioPlanesDeMejoramientoPage = () => {
    return (
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-gray-100 mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400">Cargando formulario...</p>
            </div>
        </div>}>
            <FormularioPlanesDeMejoramientoContent />
        </Suspense>
    );
};

export default FormularioPlanesDeMejoramientoPage;
"use client";

import PageTitle from "@components/UI/pageTitle";
import { useRouter, useSearchParams } from "next/navigation";
import { FiArrowLeft, FiUser, FiUsers, FiMapPin, FiCalendar, FiFileText, FiStar, FiBook, FiSave, FiX, FiCheckCircle, FiAlertTriangle } from "react-icons/fi";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@redux/store";
import { fetchFaultTypes } from "@slice/faultTypeSlice";
import { addImprovementPlan } from "@slice/improvementPlanSlice";
import { toast } from "react-toastify";
import { useLoader } from "@context/LoaderContext";

export default function FormularioPlanesDeMejoramientoPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const dispatch = useDispatch<AppDispatch>();
    const { showLoader, hideLoader } = useLoader();

    // Selectors de Redux
    const { data: faultTypes, loading: faultTypesLoading } = useSelector((state: any) => state.faultType);

    // Estado del formulario
    const [selectedStudent, setSelectedStudent] = useState('');
        const [students, setStudents] = useState<any[]>([]);
    const [fichaData, setFichaData] = useState<any>(null);
    const [competencies, setCompetencies] = useState<any[]>([]);
    const [formData, setFormData] = useState({
        // Datos del estudiante
        studentName: '',
        studentLastname: '',
        studentDocument: '',
        studentEmail: '',
        // Datos del plan de mejoramiento
        reason: '',
        city: '',
        date: new Date().toISOString().split('T')[0],
        teacherCompetenceId: '',
        faultTypeId: '',
        qualification: false,
        state: true
    });

    const [isLoading, setIsLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

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

    // Parsear los datos de la ficha una sola vez
    useEffect(() => {
        const fichaDataString = searchParams.get('fichaData');
        if (fichaDataString) {
            try {
                const parsedFichaData = JSON.parse(decodeURIComponent(fichaDataString));
                setFichaData(parsedFichaData);
                console.log('fichaData en formulario:', parsedFichaData);
            } catch (error) {
                console.error('Error parsing fichaData:', error);
            }
        }
    }, [searchParams]);

    // Usar los datos reales de los estudiantes de la ficha
    useEffect(() => {
        if (fichaData && fichaData.students) {
            // Usar los datos completos de los estudiantes que ya vienen de la ficha
            setStudents(fichaData.students);
        }
    }, [fichaData]);

    // Cargar competencias de la ficha y tipos de falta
    useEffect(() => {
        const loadInitialData = async () => {
            try {
                // Usar las competencias reales de la ficha seleccionada
                if (fichaData && fichaData.teacherCompetences) {
                    console.log('Cargando competencias de la ficha:', fichaData.teacherCompetences);
                    setCompetencies(fichaData.teacherCompetences);
                } else {
                    // Si no hay competencias de la ficha, usar array vacío
                    setCompetencies([]);
                }

                await dispatch(fetchFaultTypes({ page: 0, size: 10})).unwrap();
            } catch (error) {
                console.error('Error al cargar tipos de falta:', error);
                toast.error('Error al cargar los tipos de falta', {
                    position: "top-right",
                    autoClose: 4000,
                });
            }
        };

        loadInitialData();
    }, [dispatch, fichaData]);

    // Obtener datos del estudiante seleccionado
    const getSelectedStudentData = () => {
        return students.find(s => s.id === selectedStudent);
    };

    // Manejar cambios en el formulario
    const handleInputChange = (field: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // Manejar selección de estudiante y rellenar campos automáticamente
    const handleStudentChange = (studentId: string) => {
        setSelectedStudent(studentId);

        if (studentId) {
            const student = students.find(s => s.id === studentId);
            if (student) {
                setFormData(prev => ({
                    ...prev,
                    studentName: student.person?.name || '',
                    studentLastname: student.person?.lastname || '',
                    studentDocument: student.person?.document || '',
                    studentEmail: student.person?.email || ''
                }));
            }
        } else {
            // Limpiar campos del estudiante si no hay selección
            setFormData(prev => ({
                ...prev,
                studentName: '',
                studentLastname: '',
                studentDocument: '',
                studentEmail: ''
            }));
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

        if (!formData.city.trim()) {
            toast.error('Por favor ingresa la ciudad', {
                position: "top-right",
                autoClose: 4000,
            });
            return;
        }

        if (!formData.reason.trim()) {
            toast.error('Por favor describe la razón del plan de mejoramiento', {
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

        setIsLoading(true);

        try {
          const improvementPlanData = {
  studentId: selectedStudent,
  city: formData.city,
  date: formData.date, // asegúrate de que vaya en formato "YYYY-MM-DD"
  reason: formData.reason,
  state: formData.state,
  qualification: false, // Siempre false ya que no se puede calificar al crear
  teacherCompetence: formData.teacherCompetenceId,
  faultTypeId: formData.faultTypeId // Enviado como string, como requiere ImprovementPlanDto
};


            console.log('=== DATOS ANTES DE ENVIAR ===');
            console.log('selectedStudent:', selectedStudent);
            console.log('formData completo:', formData);
            console.log('improvementPlanData final:', improvementPlanData);
            console.log('Tipos de datos:');
            console.log('- studentId:', typeof improvementPlanData.studentId, '=', improvementPlanData.studentId);
            console.log('- teacherCompetence:', typeof improvementPlanData.teacherCompetence, '=', improvementPlanData.teacherCompetence);
            console.log('- faultTypeId:', typeof improvementPlanData.faultTypeId, '=', improvementPlanData.faultTypeId);
            console.log('- qualification:', typeof improvementPlanData.qualification, '=', improvementPlanData.qualification);
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
                router.back();
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
            setIsLoading(false);
        }
    };

    return (
        <div className="mx-auto px-4 py-8">
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <PageTitle>
                        {fichaData
                            ? `Crear Plan de Mejoramiento - Ficha N° ${fichaData.fichaNumber}`
                            : `Formulario De Planes De Mejoramiento`
                        }
                    </PageTitle>
                    {fichaData && (
                        <button
                            onClick={() => router.back()}
                            className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-lightGreen transition-colors duration-200 mt-2"
                        >
                            <FiArrowLeft className="w-4 h-4 mr-1" />
                            Volver al Historial
                        </button>
                    )}
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
                                    Detalles del Plan de Mejoramiento
                                </h3>
                            </div>

                            {fichaData && students.length > 0 ? (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Seleccionar Estudiante
                                            <span className="text-gray-500 font-normal ml-1">({students.length} disponibles)</span>
                                        </label>
                                        <div className="relative">
                                            <select
                                                value={selectedStudent}
                                                onChange={(e) => handleStudentChange(e.target.value)}
                                                className="w-full px-4 py-3 pr-10 border border-gray-300 dark:border-gray-600 rounded-xl text-sm bg-white dark:bg-gray-700 text-black dark:text-white focus:ring-2 focus:ring-primary dark:focus:ring-lightGreen focus:border-transparent transition-all duration-200 appearance-none cursor-pointer"
                                                required
                                            >
                                                <option value="">Seleccione un estudiante...</option>
                                                {students.map((student) => (
                                                    <option key={student.id} value={student.id}>
                                                        {(student.person?.name || '').toUpperCase()} {(student.person?.lastname || '').toUpperCase()}
                                                    </option>
                                                ))}
                                            </select>
                                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                                <FiUsers className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Campos de solo lectura del estudiante */}
                                    {selectedStudent && (
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
                                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl text-sm bg-gray-50 dark:bg-gray-600 text-black dark:text-white cursor-not-allowed transition-all duration-200"
                                                    placeholder="Email del estudiante..."
                                                    disabled
                                                    readOnly
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full mb-4 mx-auto">
                                        <FiUsers className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                                    </div>
                                    <p>
                                        {fichaData
                                            ? "Cargando estudiantes de la ficha..."
                                            : "No hay ficha seleccionada. Accede desde el historial de una ficha específica."
                                        }
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Detalles del Plan de Mejoramiento */}
                        {selectedStudent && (
                            <div className="p-6 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Competencia */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            <FiBook className="w-4 h-4 inline mr-2" />
                                            Competencia
                                        </label>
                                        <select
                                            value={formData.teacherCompetenceId}
                                            onChange={(e) => handleInputChange('teacherCompetenceId', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl text-sm bg-white dark:bg-gray-700 text-black dark:text-white focus:ring-2 focus:ring-primary dark:focus:ring-lightGreen focus:border-transparent transition-all duration-200"
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
                                            Tipo de Falta
                                        </label>
                                        <select
                                            value={formData.faultTypeId}
                                            onChange={(e) => handleInputChange('faultTypeId', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl text-sm bg-white dark:bg-gray-700 text-black dark:text-white focus:ring-2 focus:ring-primary dark:focus:ring-lightGreen focus:border-transparent transition-all duration-200"
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

                                    {/* Fecha */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            <FiCalendar className="w-4 h-4 inline mr-2" />
                                            Fecha
                                        </label>
                                        <input
                                            type="date"
                                            value={formData.date}
                                            onChange={(e) => handleInputChange('date', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl text-sm bg-white dark:bg-gray-700 text-black dark:text-white focus:ring-2 focus:ring-primary dark:focus:ring-lightGreen focus:border-transparent transition-all duration-200"
                                            required
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
                                            onChange={(e) => handleInputChange('city', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl text-sm bg-white dark:bg-gray-700 text-black dark:text-white focus:ring-2 focus:ring-primary dark:focus:ring-lightGreen focus:border-transparent transition-all duration-200"
                                            placeholder="Ingrese la ciudad..."
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Razón */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        <FiFileText className="w-4 h-4 inline mr-2" />
                                        Razón del Plan de Mejoramiento
                                    </label>
                                    <textarea
                                        value={formData.reason}
                                        onChange={(e) => handleInputChange('reason', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl text-sm bg-white dark:bg-gray-700 text-black dark:text-white focus:ring-2 focus:ring-primary dark:focus:ring-lightGreen focus:border-transparent transition-all duration-200"
                                        rows={4}
                                        placeholder="Describe detalladamente la razón del plan de mejoramiento..."
                                        required
                                    />
                                </div>
                            </div>
                        )}

                        {/* Botones */}
                        <div className="flex justify-end gap-3 p-6 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-600">
                            <button
                                type="button"
                                onClick={() => router.back()}
                                className="inline-flex items-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200 font-medium"
                            >
                                <FiX className="w-4 h-4 mr-2" />
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={!selectedStudent || isLoading}
                                className={`inline-flex items-center px-6 py-3 bg-gradient-to-r from-lightGreen to-primary hover:from-primary hover:to-lightGreen text-white rounded-xl font-medium shadow-lg transition-all duration-200 ${(!selectedStudent || isLoading)
                                    ? 'opacity-50 cursor-not-allowed'
                                    : 'hover:shadow-xl transform hover:-translate-y-0.5'
                                    }`}
                            >
                                {isLoading ? (
                                    <>
                                        <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Guardando...
                                    </>
                                ) : (
                                    <>
                                        <FiSave className="w-4 h-4 mr-2" />
                                        Guardar Plan de Mejoramiento
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
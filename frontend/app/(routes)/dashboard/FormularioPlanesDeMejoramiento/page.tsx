"use client";

import PageTitle from "@components/UI/pageTitle";
import { useRouter, useSearchParams } from "next/navigation";
import { FiArrowLeft, FiUser, FiUsers } from "react-icons/fi";
import React, { useState, useEffect } from "react";

export default function FormularioPlanesDeMejoramientoPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    
    // Estado del formulario
    const [selectedStudent, setSelectedStudent] = useState('');
    const [students, setStudents] = useState<any[]>([]);
    const [fichaData, setFichaData] = useState<any>(null);
    
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

    return (
        <div className="mx-auto px-4 py-8">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <PageTitle>
                            {fichaData 
                                ? `Formulario Plan de Mejoramiento - Ficha N° ${fichaData.fichaNumber}`
                                : `Formulario De Planes De Mejoramiento`
                            }
                        </PageTitle>
                        {fichaData && (
                            <div className="flex items-center gap-3 mt-4">
                                <button
                                    onClick={() => router.back()}
                                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200 shadow-sm"
                                >
                                    <FiArrowLeft className="w-4 h-4 mr-2" />
                                    Volver al Historial
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Contenedor del formulario */}
                <div className="bg-white dark:bg-shadowBlue rounded-2xl shadow-lg p-6 border border-lightGray dark:border-grayText">
                    <form className="space-y-6">
                        {/* Selector de Estudiante */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                <FiUser className="w-4 h-4 inline mr-2" />
                                Seleccionar Estudiante {fichaData && students.length > 0 && (
                                    <span className="text-gray-500 font-normal">({students.length} disponibles)</span>
                                )}
                            </label>
                            {fichaData && students.length > 0 ? (
                                <div className="relative">
                                    <select
                                        value={selectedStudent}
                                        onChange={(e) => setSelectedStudent(e.target.value)}
                                        className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-black dark:text-white focus:ring-2 focus:ring-primary dark:focus:ring-lightGreen focus:border-transparent transition-all duration-200 appearance-none cursor-pointer"
                                        required
                                    >
                                        <option value="">Seleccione un estudiante...</option>
                                        {students.map((student) => (
                                            <option key={student.id} value={student.id}>
                                                {(student.person?.name || '').toUpperCase()} {(student.person?.lastname || '').toUpperCase()} - Doc: {student.person?.document || 'SIN DOCUMENTO'}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                        <FiUsers className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                                    {fichaData 
                                        ? "Cargando estudiantes de la ficha..." 
                                        : "No hay ficha seleccionada. Accede desde el historial de una ficha específica."
                                    }
                                </div>
                            )}
                        </div>

                        {/* Información del estudiante seleccionado */}
                        {selectedStudent && (
                            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                                <h4 className="text-sm font-medium text-blue-800 dark:text-blue-400 mb-2">
                                    Estudiante seleccionado:
                                </h4>
                                {(() => {
                                    const student = students.find(s => s.id === selectedStudent);
                                    return student ? (
                                        <div className="text-sm text-blue-700 dark:text-blue-300">
                                            <p><strong>Nombre:</strong> {(student.person?.name || '').toUpperCase()} {(student.person?.lastname || '').toUpperCase()}</p>
                                            <p><strong>Documento:</strong> {student.person?.document || 'SIN DOCUMENTO'}</p>
                                            {student.person?.email && <p><strong>Email:</strong> {(student.person.email || '').toUpperCase()}</p>}
                                            {student.person?.phone && <p><strong>Teléfono:</strong> {student.person.phone}</p>}
                                            <p><strong>Estado:</strong> {(student.studentStudySheetState?.name || 'SIN ESTADO').toUpperCase()}</p>
                                            <p><strong>Ficha:</strong> N° {fichaData?.fichaNumber}</p>
                                        </div>
                                    ) : null;
                                })()}
                            </div>
                        )}

                        {/* Resto del formulario (placeholder por ahora) */}
                        <div className="border-t border-gray-200 dark:border-gray-600 pt-6">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                                Detalles del Plan de Mejoramiento
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Aquí agregaremos más campos después */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Razón
                                    </label>
                                    <textarea
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-black dark:text-white focus:ring-2 focus:ring-primary dark:focus:ring-lightGreen focus:border-transparent transition-all duration-200"
                                        rows={3}
                                        placeholder="Describe la razón del plan de mejoramiento..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Ciudad
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-black dark:text-white focus:ring-2 focus:ring-primary dark:focus:ring-lightGreen focus:border-transparent transition-all duration-200"
                                        placeholder="Ciudad..."
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Botones */}
                        <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-600">
                            <button
                                type="button"
                                onClick={() => router.back()}
                                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={!selectedStudent}
                                className="px-4 py-2 bg-primary hover:bg-primary/90 dark:bg-lightGreen dark:hover:bg-lightGreen/90 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                            >
                                Formulario
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
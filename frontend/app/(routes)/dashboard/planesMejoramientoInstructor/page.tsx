'use client'

import React, { useEffect, useState } from 'react';
import { useLoader } from '@context/LoaderContext';
import { useDispatch, useSelector } from 'react-redux';
import PageTitle from '@components/UI/pageTitle';
import Modal from '@components/UI/Modal';
import { Card } from '@components/UI/Card';
import { fetchStudySheetByTeacher } from '@redux/slices/olympo/studySheetSlice';
import { AppDispatch } from '@redux/store';
import Loader from '@components/UI/Loader';
import EmptyState from '@components/UI/emptyState';
import {
    StudySheet,
    StudentStudySheet,
} from '@graphql/generated';
import { FiUsers, FiBookOpen, FiCalendar, FiTarget, FiClock, FiEye, FiCreditCard, FiPhone, FiDroplet, FiArrowRight } from 'react-icons/fi';
import { BsCardText, BsLightbulb, BsCalendar3 } from 'react-icons/bs';

const PlanMejoramientoInstructor: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const [selectedStudents, setSelectedStudents] = useState<NonNullable<StudentStudySheet>[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentSheet, setCurrentSheet] = useState<NonNullable<StudySheet> | null>(null);
    const { showLoader, hideLoader } = useLoader();

    // Redux state
    const { data, loading, error } = useSelector((state: any) => state.studySheet);
    const studySheets: NonNullable<StudySheet>[] = (data || []).filter((sheet: StudySheet): sheet is NonNullable<StudySheet> => sheet !== null);

    useEffect(() => {
        dispatch(fetchStudySheetByTeacher({
            idTeacher: 1,
            page: 0,
            size: 10
        }));
    }, [dispatch]);

    useEffect(() => {
        if (loading) {
            showLoader();
        } else {
            hideLoader();
        }
    }, [loading, showLoader, hideLoader]);

    const handleViewStudents = (sheet: NonNullable<StudySheet>) => {
        setCurrentSheet(sheet);
        const validStudents = (sheet.studentStudySheets || []).filter((ss): ss is NonNullable<StudentStudySheet> => ss !== null);
        setSelectedStudents(validStudents);
        setIsModalOpen(true);
    };

    const handleSelectSheet = (sheet: NonNullable<StudySheet>) => {
        console.log('Ficha seleccionada:', sheet);
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

    if (!loading && (!studySheets || studySheets.length === 0)) {
        return <EmptyState message="No se encontraron fichas de mejoramiento." />;
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="container mx-auto px-4 py-8">
                {/* Título de la página */}
                <div className="mb-12">
                    <PageTitle>Planes De Mejoramiento</PageTitle>
                </div>

                {/* Dashboard Stats - Individual Cards */}
                <div className="mb-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-white dark:bg-shadowBlue rounded-2xl shadow-lg p-6 text-center">
                        <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-2xl mb-4 mx-auto">
                            <FiBookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-black dark:text-white mb-2">{studySheets.length}</h3>
                        <p className="text-gray-600 dark:text-gray-300 font-medium">Fichas Totales</p>
                    </div>
                    <div className="bg-white dark:bg-shadowBlue rounded-2xl shadow-lg p-6 text-center">
                        <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-2xl mb-4 mx-auto">
                            <FiTarget className="w-6 h-6 text-lightGreen dark:text-darkGreen" />
                        </div>
                        <h3 className="text-2xl font-bold text-black dark:text-white mb-2">
                            {studySheets.filter(sheet => sheet?.state).length}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 font-medium">Fichas Activas</p>
                    </div>
                    <div className="bg-white dark:bg-shadowBlue rounded-2xl shadow-lg p-6 text-center">
                        <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-2xl mb-4 mx-auto">
                            <FiUsers className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-black dark:text-white mb-2">
                            {studySheets.reduce((total, sheet) => total + (sheet?.studentStudySheets?.length || 0), 0)}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 font-medium">Total Aprendices</p>
                    </div>
                </div>

                {/* Grid de Fichas */}
                <div className="flex flex-col space-y-6">
                    {studySheets.map((sheet, index) => (
                        <div
                            key={sheet.id}
                            className="bg-white dark:bg-shadowBlue rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-lightGray dark:border-grayText overflow-hidden group max-w-full"
                        >
                            {/* Header de la ficha */}
                            <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 px-6 py-4 border-b border-lightGray dark:border-grayText flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-lightGreen rounded-xl text-white font-bold text-3xl shadow-lg flex-shrink-0">
                                        Ficha #{sheet.number || 'N/A'}
                                    </div>
                                    <div className="inline-block px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-black dark:text-white text-lg font-semibold shadow-md">
                                        Programa: {sheet.trainingProject?.program?.name ?? "Programa no especificado"}
                                    </div>
                                </div>
                                <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold shadow-md ${sheet.state
                                    ? 'bg-lightGreen text-white'
                                    : 'bg-red-500 text-white'
                                    }`}>
                                    <div className={`w-2 h-2 rounded-full ${sheet.state ? 'bg-green-200' : 'bg-red-200'
                                        } animate-pulse`}></div>
                                    {sheet.state ? "Activa" : "Inactiva"}
                                </span>
                            </div>

                            {/* Contenido de la ficha */}
                            <div className="p-6">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {/* Información académica */}
                                    <div className="space-y-6">
                                        <h4 className="text-lg font-semibold text-black dark:text-white flex items-center gap-2">
                                            <BsCardText className="text-primary" />
                                            Información Académica
                                        </h4>
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center py-3 border-b border-lightGray dark:border-grayText">
                                                <span className="text-grayText dark:text-white font-medium">Jornada:</span>
                                                <span className="text-black dark:text-white font-semibold bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-lg">
                                                    {sheet.journey?.name ?? "Sin jornada"}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center py-3">
                                                <span className="text-grayText dark:text-white font-medium">Trimestre:</span>
                                                <span className="text-black dark:text-white font-semibold bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-lg">
                                                    {(() => {
                                                        if (!sheet.quarter || sheet.quarter.length === 0) {
                                                            return "Sin trimestre";
                                                        }
                                                        const lastQuarter = [...sheet.quarter]
                                                            .filter(q => q?.name?.number !== undefined)
                                                            .sort((a, b) => (b?.name?.number ?? 0) - (a?.name?.number ?? 0))[0];
                                                        return `${lastQuarter?.name?.extension} ${lastQuarter?.name?.number}`;
                                                    })()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Período lectivo */}
                                    <div className="space-y-6">
                                        <h4 className="text-lg font-semibold text-black dark:text-white flex items-center gap-2">
                                            <BsCalendar3 className="text-blue-500" />
                                            Período Lectivo
                                        </h4>
                                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/30 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                                        <span className="text-gray-700 dark:text-gray-300 font-medium">Fecha de Inicio</span>
                                                    </div>
                                                    <span className="text-green-700 dark:text-green-400 font-bold bg-green-100 dark:bg-green-900/50 px-3 py-1 rounded-lg">
                                                        {formatDate(sheet.startLective)}
                                                    </span>
                                                </div>
                                                <div className="h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent"></div>
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                                        <span className="text-gray-700 dark:text-gray-300 font-medium">Fecha de Finalización</span>
                                                    </div>
                                                    <span className="text-red-700 dark:text-red-400 font-bold bg-red-100 dark:bg-red-900/50 px-3 py-1 rounded-lg">
                                                        {formatDate(sheet.endLective)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Botones de acción */}
                                <div className="mt-6 pt-4 border-t border-lightGray dark:border-grayText">
                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <button
                                            onClick={() => handleViewStudents(sheet)}
                                            className="flex-1 flex items-center justify-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                                        >
                                            <FiUsers className="w-5 h-5" />
                                            <span>Ver Estudiantes</span>
                                            <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                                                <span className="text-xs font-bold">{sheet.studentStudySheets?.length || 0}</span>
                                            </div>
                                        </button>
                                        <button
                                            onClick={() => handleSelectSheet(sheet)}
                                            className="flex-1 flex items-center justify-center gap-3 px-6 py-3 bg-gradient-to-r from-primary to-lightGreen hover:from-primary/80 hover:to-lightGreen/80 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                                        >
                                            <FiEye className="w-5 h-5" />
                                            <span>Ver Ficha Completa</span>
                                            <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Modal para lista de aprendices */}
                <Modal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    title={`Aprendices - Ficha #${currentSheet?.number}`}
                    size="xxxl"
                >
                    <div className="max-h-[70vh] overflow-y-auto">
                        {selectedStudents && selectedStudents.length > 0 ? (
                            <div className="w-full">
                                <div className="text-sm text-grayText dark:text-white mb-4 text-center">
                                    Total de aprendices: <span className="font-semibold">{selectedStudents.length}</span>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-2">
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
                                                className="group bg-white dark:bg-shadowBlue rounded-2xl shadow-sm border border-lightGray dark:border-grayText p-4 flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-fit"
                                            >
                                                <div className="flex items-center gap-3 mb-3">
                                                    <div className="w-12 h-12 bg-gradient-to-r from-primary to-lightGreen rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md flex-shrink-0">
                                                        {displayName.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="font-semibold text-black dark:text-white text-sm leading-snug truncate">
                                                            {displayName}
                                                        </h4>
                                                        <p className="text-xs text-grayText dark:text-white truncate">
                                                            {person.email || 'Sin email'}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="mb-3">
                                                    <span
                                                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium shadow-sm ${studentState === 'En formacion'
                                                            ? 'bg-gradient-to-r from-lightGreen to-darkGreen text-white'
                                                            : 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white'
                                                            }`}
                                                    >
                                                        {studentState}
                                                    </span>
                                                </div>
                                                <div className="space-y-2 text-xs text-grayText dark:text-white">
                                                    <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                                        <FiCreditCard className="w-3 h-3 text-gray-400 flex-shrink-0" />
                                                        <span className="truncate"><strong>Doc:</strong> {person.document || 'Sin documento'}</span>
                                                    </div>
                                                    {person.phone && (
                                                        <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                                            <FiPhone className="w-3 h-3 text-gray-400 flex-shrink-0" />
                                                            <span className="truncate"><strong>Tel:</strong> {person.phone}</span>
                                                        </div>
                                                    )}
                                                    {person.blood_type && (
                                                        <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                                            <FiDroplet className="w-3 h-3 text-gray-400 flex-shrink-0" />
                                                            <span className="truncate"><strong>Sangre:</strong> {person.blood_type}</span>
                                                        </div>
                                                    )}
                                                    {person.date_birth && (
                                                        <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                                            <FiCalendar className="w-3 h-3 text-gray-400 flex-shrink-0" />
                                                            <span className="truncate"><strong>Nac.:</strong> {formatDate(person.date_birth)}</span>
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
        </div>
    );
};

export default PlanMejoramientoInstructor;
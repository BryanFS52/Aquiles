'use client'

import React, { useEffect, useState } from 'react';
import { useLoader } from '@context/LoaderContext';
import { useDispatch, useSelector } from 'react-redux';
import PageTitle from '@components/UI/pageTitle';
import Modal from '@components/UI/Modal';
import { fetchStudySheetByTeacher } from '@redux/slices/olympo/studySheetSlice';
import { AppDispatch } from '@redux/store';
import Loader from '@components/UI/Loader';
import EmptyState from '@components/UI/emptyState';
import {
    StudySheet,
    StudentStudySheet,
} from '@graphql/generated';
import { FiUsers, FiBookOpen, FiCalendar, FiTarget, FiClock, FiEye, FiCreditCard, FiPhone, FiArrowRight, FiMail } from 'react-icons/fi';
import { IoPeople } from "react-icons/io5";

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
        <div className="mx-auto px-4 py-8">
            {/* Título */}
            <div className="mb-8">
                <PageTitle>Planes De Mejoramiento</PageTitle>
            </div>

            {/* Dashboard Stats */}
            <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                <div className="bg-white dark:bg-shadowBlue rounded-2xl shadow-lg p-5 text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-2xl mb-3 mx-auto">
                        <FiBookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-black dark:text-white mb-1">{studySheets.length}</h3>
                    <p className="text-gray-600 dark:text-gray-300 font-medium">Fichas Totales</p>
                </div>
                <div className="bg-white dark:bg-shadowBlue rounded-2xl shadow-lg p-5 text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-2xl mb-3 mx-auto">
                        <FiTarget className="w-6 h-6 text-lightGreen dark:text-darkGreen" />
                    </div>
                    <h3 className="text-2xl font-bold text-black dark:text-white mb-1">
                        {studySheets.filter(sheet => sheet?.state).length}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 font-medium">Fichas Activas</p>
                </div>
                <div className="bg-white dark:bg-shadowBlue rounded-2xl shadow-lg p-5 text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-2xl mb-3 mx-auto">
                        <FiUsers className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-black dark:text-white mb-1">
                        {studySheets.reduce((total, sheet) => total + (sheet?.studentStudySheets?.length || 0), 0)}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 font-medium">Total Aprendices</p>
                </div>
            </div>

            {/* Grid de Fichas (más compacto y responsive) */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {studySheets.map((sheet) => (
                    <div
                        key={sheet.id}
                        className="bg-white dark:bg-shadowBlue rounded-2xl shadow-md border border-lightGray dark:border-grayText overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700">
                            <div className="inline-block px-3 py-1.5 bg-gradient-to-r from-primary to-lightGreen rounded-xl text-white text-sm font-bold shadow-sm">
                                Ficha N° {sheet.number || 'N/A'}
                            </div>
                            <span className={`inline-flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs font-semibold shadow-sm ${sheet.state
                                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                }`}>
                                <span className={`w-2.5 h-2.5 rounded-full ${sheet.state ? 'bg-green-500' : 'bg-red-500'}`}></span>
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
                                    <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                                        <FiClock className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs sm:text-sm text-grayText dark:text-white font-medium">Jornada</span>
                                        <span className="text-sm text-black dark:text-white font-semibold uppercase">
                                            {sheet.journey?.name ?? "Sin jornada"}
                                        </span>
                                    </div>
                                </div>

                                {/* Programa */}
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                                        <FiTarget className="w-4 h-4 text-lightGreen dark:text-darkGreen" />
                                    </div>
                                    <div>
                                        <span className="text-gray-600 dark:text-gray-300 text-sm">Programa</span>
                                        <p className="text-black dark:text-white font-semibold text-sm leading-snug uppercase">
                                            {sheet.trainingProject?.program?.name || 'Programa no especificado'}
                                        </p>
                                    </div>
                                </div>

                                {/* Etapa Lectiva (label + inicio/fin) */}
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                                        <FiCalendar className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                                    </div>
                                    <div className="flex-1">
                                        <span className="text-xs sm:text-sm text-grayText dark:text-white font-medium">Etapa lectiva</span>
                                        <div className="mt-1 grid grid-cols-2 gap-3">
                                            <div>
                                                <span className="block text-[11px] sm:text-xs text-gray-500">Inicio</span>
                                                <span className="block text-base text-black dark:text-white font-semibold">{formatDate(sheet.startLective)}</span>
                                            </div>
                                            <div>
                                                <span className="block text-[11px] sm:text-xs text-gray-500">Fin</span>
                                                <span className="block text-base text-black dark:text-white font-semibold">{formatDate(sheet.endLective)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Botones (más compactos, sin línea) */}
                            <div className="mt-4">
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={() => handleViewStudents(sheet)}
                                        className="flex items-center justify-between w-full px-3 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-all duration-200 font-medium group shadow-sm hover:shadow-md text-sm"
                                    >
                                        <div className="flex items-center gap-2">
                                            <IoPeople className="w-4 h-4" />
                                            <span>Ver Aprendices</span>
                                        </div>
                                        <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                    <button
                                        onClick={() => handleSelectSheet(sheet)}
                                        className="flex items-center justify-between w-full px-3 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg transition-all duration-200 font-medium group text-sm"
                                    >
                                        <div className="flex items-center gap-2">
                                            <FiEye className="w-4 h-4" />
                                            <span>Ver Ficha</span>
                                        </div>
                                        <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
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
                                                    {/* Nombre completo visible */}
                                                    <h4 className="font-semibold text-black dark:text-white text-sm leading-snug break-words">
                                                        {displayName}
                                                    </h4>
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
                                                    <span className="truncate"><strong>Documento:</strong> {person.document || 'Sin documento'}</span>
                                                </div>
                                                {person.email && (
                                                    <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                                        <FiMail className="w-3 h-3 text-gray-400 flex-shrink-0" />
                                                        <span className="break-words"><strong>Correo:</strong> {person.email}</span>
                                                    </div>
                                                )}
                                                {person.phone && (
                                                    <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                                        <FiPhone className="w-3 h-3 text-gray-400 flex-shrink-0" />
                                                        <span className="truncate"><strong>Teléfono:</strong> {person.phone}</span>
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

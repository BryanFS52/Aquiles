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
import { FiUsers, FiBookOpen, FiCalendar, FiTarget, FiClock, FiEye, FiCreditCard, FiPhone, FiDroplet, FiGift } from 'react-icons/fi';
import { BsCardText } from 'react-icons/bs';

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

    const getStateColor = (state: boolean | null | undefined) => {
        return state
            ? 'bg-gradient-to-r from-lightGreen to-darkGreen text-white'
            : 'bg-gradient-to-r from-red-500 to-red-600 text-white';
    };

    const getStateBadge = (state: boolean | null | undefined) => {
        return state ? 'Activa' : 'Inactiva';
    };

    const formatDate = (dateString: string | null | undefined) => {
        if (!dateString) return 'No especificada';
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) {
        return null;
    }

    // Early return para estado vacío
    if (!loading && (!studySheets || studySheets.length === 0)) {
        return <EmptyState message="No se encontraron fichas de mejoramiento." />;
    }

    return (
        <div className="container mx-auto p-6">
            <PageTitle>Planes De Mejoramiento</PageTitle>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card
                    className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm rounded-2xl transition hover:shadow-md"
                    body={
                        <div className="p-4 flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Fichas</p>
                                <p className="text-3xl font-bold text-gray-900 dark:text-white">{studySheets.length}</p>
                            </div>
                            <div className="p-3 rounded-full bg-gray-100 dark:bg-gray-800">
                                <FiBookOpen className="w-8 h-8 text-gray-600 dark:text-gray-300" />
                            </div>
                        </div>
                    }
                />


                <Card
                    className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800"
                    body={
                        <div className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-lightGreen dark:text-darkGreen">Fichas Activas</p>
                                    <p className="text-3xl font-bold text-lightGreen dark:text-darkGreen">
                                        {studySheets.filter(sheet => sheet?.state).length}
                                    </p>
                                </div>
                                <div className="p-3 rounded-full bg-lightGreen/10 dark:bg-darkGreen/20">
                                    <FiTarget className="w-8 h-8 text-lightGreen dark:text-darkGreen" />
                                </div>
                            </div>
                        </div>
                    }
                />

                <Card
                    className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800"
                    body={
                        <div className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-primary dark:text-primary">Total Aprendices</p>
                                    <p className="text-3xl font-bold text-primary dark:text-primary">
                                        {studySheets.reduce((total, sheet) => total + (sheet?.studentStudySheets?.length || 0), 0)}
                                    </p>
                                </div>
                                <div className="p-3 rounded-full bg-primary/10 dark:bg-primary/20">
                                    <FiUsers className="w-8 h-8 text-primary dark:text-primary" />
                                </div>
                            </div>
                        </div>
                    }
                />
            </div>


            {/* Modal para lista de aprendices, mejorado y responsivo */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={`Aprendices - Ficha #${currentSheet?.number}`}
                size="xxxl"
            >
                {selectedStudents && selectedStudents.length > 0 ? (
                    <div className="w-full">
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-4 text-center">
                            Total de aprendices: <span className="font-semibold">{selectedStudents.length}</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
                                        className="group bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-5 flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                                    >
                                        {/* Header */}
                                        <div className="flex items-center gap-4">
                                            <div className="w-14 h-14 bg-gradient-to-r from-primary to-lightGreen rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
                                                {displayName.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-semibold text-gray-900 dark:text-white text-base leading-snug line-clamp-1">
                                                    {displayName}
                                                </h4>
                                                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                                    {person.email || 'Sin email'}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Estado */}
                                        <div className="mt-3">
                                            <span
                                                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium shadow-sm ${studentState === 'En formacion'
                                                    ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
                                                    : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300'
                                                    }`}
                                            >
                                                {studentState}
                                            </span>
                                        </div>

                                        {/* Datos */}
                                        <div className="mt-5 border-t border-gray-200 dark:border-gray-700 pt-4 grid grid-cols-1 gap-2 text-sm text-gray-700 dark:text-gray-300">
                                            <div className="flex items-center gap-2">
                                                <FiCreditCard className="w-4 h-4 text-gray-400" />
                                                <span className="truncate">
                                                    <strong>Doc:</strong> {person.document || 'Sin documento'}
                                                </span>
                                            </div>
                                            {person.phone && (
                                                <div className="flex items-center gap-2">
                                                    <FiPhone className="w-4 h-4 text-gray-400" />
                                                    <span className="truncate">
                                                        <strong>Tel:</strong> {person.phone}
                                                    </span>
                                                </div>
                                            )}
                                            {person.blood_type && (
                                                <div className="flex items-center gap-2">
                                                    <FiDroplet className="w-4 h-4 text-gray-400" />
                                                    <span>
                                                        <strong>Sangre:</strong> {person.blood_type}
                                                    </span>
                                                </div>
                                            )}
                                            {person.date_birth && (
                                                <div className="flex items-center gap-2">
                                                    <FiGift className="w-4 h-4 text-gray-400" />
                                                    <span>
                                                        <strong>Nac.:</strong> {formatDate(person.date_birth)}
                                                    </span>
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
            </Modal>

        </div>
    );
};

export default PlanMejoramientoInstructor;

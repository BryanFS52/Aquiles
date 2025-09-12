import React, { useEffect, useState } from 'react';
import { GoSearch } from "react-icons/go";
import { BsQrCode } from "react-icons/bs";
import { FaClipboardList } from "react-icons/fa";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { FaCheck, FaTimes, FaClock, FaExclamationTriangle } from "react-icons/fa";
import { motion } from "framer-motion";
import { StudySheet } from '@graphql/generated';
import ModalQR from "@components/Modals/ModalQR";


interface TableAttendanceProps {
    studySheetData?: StudySheet;
    onNavigate: (competenceId: string) => void;
}

const TableAttendance: React.FC<TableAttendanceProps> = ({ studySheetData, onNavigate }) => {
    const [modalQROpen, setModalQROpen] = useState<boolean>(false);
    const [alertVisible, setAlertVisible] = useState<boolean>(false);
    const [currentTrimester, setCurrentTrimester] = useState<number>(1);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [filteredStudents, setFilteredStudents] = useState<any>(studySheetData?.studentStudySheets || []);
    const [selectedCompetence, setSelectedCompetence] = useState<string>("");

    // Obtener competencias desde la API
    const competences = studySheetData?.teacherStudySheets?.map((teacherSheet: any) => ({
        id: teacherSheet.id,
        name: teacherSheet.competence?.name || 'Sin nombre'
    })) || [];

    useEffect(() => {
        setFilteredStudents(studySheetData?.studentStudySheets || []);
    }, [studySheetData]);

    // Función para obtener el icono y estilo según el estado de asistencia
    const getAttendanceIcon = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'presente':
                return <FaCheck className="text-green-500" title="Presente" />;
            case 'ausente':
                return <FaTimes className="text-red-500" title="Ausente" />;
            case 'retardo':
                return <FaClock className="text-yellow-500" title="Retardo" />;
            case 'justificado':
                return <FaExclamationTriangle className="text-blue-500" title="Justificado" />;
            default:
                return null;
        }
    };

    // Función para obtener asistencia por fecha específica
    const getAttendanceByDate = (attendances: any[], targetDate: string) => {
        if (!attendances) return null;
        return attendances.find((attendance: any) => 
            attendance.attendanceDate === targetDate
        );
    };

    // Función para generar las fechas de la semana actual basada en el trimestre
    const generateWeekDates = (weekOffset: number = 0) => {
        const today = new Date();
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay() + 1 + (weekOffset * 7)); // Lunes de la semana
        
        const dates = [];
        for (let i = 0; i < 7; i++) {
            const date = new Date(startOfWeek);
            date.setDate(startOfWeek.getDate() + i);
            dates.push(date.toISOString().split('T')[0]); // Formato YYYY-MM-DD
        }
        return dates;
    };

    const handleAttendanceClick = (): void => setAlertVisible(true);

    const handleYesClick = (): void => {
        setModalQROpen(true);
        setAlertVisible(false);
    };

    const handleNoClick = (): void => setAlertVisible(false);

    const handlePreviousTrimester = (): void => {
        if (currentTrimester > 1) setCurrentTrimester(currentTrimester - 1);
    };

    const handleNextTrimester = (): void => {
        if (currentTrimester < 7) setCurrentTrimester(currentTrimester + 1);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setSearchTerm(e.target.value);
        const filtered = (studySheetData?.studentStudySheets as any[])?.filter((studentStudySheet: any) => {
            if (!studentStudySheet || !studentStudySheet.student || !studentStudySheet.student.person) return false;
            const person = studentStudySheet.student.person;
            return (
                person.name?.toLowerCase().includes(e.target.value.toLowerCase()) ||
                person.lastname?.toLowerCase().includes(e.target.value.toLowerCase()) ||
                person.document?.toLowerCase().includes(e.target.value.toLowerCase())
            );
        }) || [];
        setFilteredStudents(filtered);
    };

    return (
        <div className="w-full max-w-full rounded-2xl shadow bg-white border border-lightGray p-3 sm:p-4 lg:p-6 mb-6">
            <div className="flex flex-col gap-4 lg:gap-6">
                {/* Header Controls */}
                <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
                    {/* Search Bar */}
                    <form className="w-full xl:w-auto order-1 xl:order-1">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <GoSearch className="text-grayText text-sm sm:text-base" />
                            </div>
                            <input
                                type="search"
                                value={searchTerm}
                                onChange={handleSearchChange}
                                className="h-9 sm:h-10 w-full xl:w-64 pl-8 sm:pl-10 pr-4 text-xs sm:text-sm rounded-xl border border-lightGray focus:outline-none focus:ring-2 focus:ring-lightGreen focus:border-lightGreen shadow-sm"
                                placeholder="Buscar por nombre, apellido o documento"
                            />
                        </div>
                    </form>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 order-2 xl:order-2">
                        <button
                            onClick={handleAttendanceClick}
                            className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl shadow bg-gradient-to-r from-lime-400 to-lime-600 dark:text-white hover:bg-lightGree transition borderhover:border-lightGreen whitespace-nowrap"
                        >
                            <span className="hidden xs:inline">Toma de</span> Asistencia <BsQrCode className="w-3 h-3 sm:w-4 sm:h-4" />
                        </button>



                        <button
                            onClick={() => onNavigate(selectedCompetence)}
                            disabled={!selectedCompetence}
                            className={`flex items-center justify-center gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl shadow whitespace-nowrap transition ${selectedCompetence
                                ? 'bg-gradient-to-r from-lime-400 to-lime-600 text-black hover:bg-lightGreen cursor-pointer'
                                : 'bg-lightGray text-grayText cursor-not-allowed opacity-60'
                                }`}
                            title={!selectedCompetence ? 'Debe seleccionar una competencia primero' : ''}
                        >
                            <span className="hidden xs:inline">Asistencia</span> Manual <FaClipboardList className="w-3 h-3 sm:w-4 sm:h-4" />
                        </button>

                        {/* Selector de Competencia */}
                        <select
                            value={selectedCompetence}
                            onChange={(e) => setSelectedCompetence(e.target.value)}
                            className="h-9 sm:h-10 px-3 pr-8 text-xs sm:text-sm rounded-xl border border-lightGray focus:outline-none focus:ring-2 focus:ring-lightGreen focus:border-lightGreen shadow-sm bg-white min-w-[200px] sm:min-w-[250px]"
                        >
                            <option value="">Seleccione competencia...</option>
                            {competences.map((competence) => (
                                <option key={competence.id} value={competence.id}>
                                    {competence.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Trimester Controls */}
                    <div className="flex items-center justify-center gap-2 sm:gap-3 order-3 xl:order-3">
                        <button
                            onClick={handlePreviousTrimester}
                            className="bg-gradient-to-r from-lime-400 to-lime-600 text-black rounded-xl p-1.5 sm:p-2 hover:text-white transition flex-shrink-0"
                        >
                            <IoIosArrowBack className="text-base sm:text-xl" />
                        </button>
                        <span className="text-black/80 font-semibold text-sm sm:text-base whitespace-nowrap">
                            Trimestre {currentTrimester}
                        </span>
                        <button
                            onClick={handleNextTrimester}
                            className="bg-gradient-to-r from-lime-400 to-lime-600 text-black rounded-xl p-1.5 sm:p-2 hover:text-white transition flex-shrink-0"
                        >
                            <IoIosArrowForward className="text-base sm:text-xl" />
                        </button>
                    </div>
                </div>

                {/* Alert Modal */}
                {alertVisible && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="bg-white border border-lightGray rounded-xl shadow p-3 sm:p-4 flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4"
                    >
                        <span className="text-sm sm:text-base font-semibold text-center sm:text-left">
                            Se va a generar el QR, ¿desea continuar?
                        </span>
                        <div className="flex gap-2 flex-shrink-0">
                            <motion.button
                                onClick={handleNoClick}
                                whileHover={{ scale: 1.05 }}
                                className="bg-red-600 border border-red-700 rounded-xl px-3 sm:px-4 py-1 text-white font-medium text-sm"
                            >
                                No
                            </motion.button>
                            <motion.button
                                onClick={handleYesClick}
                                whileHover={{ scale: 1.05 }}
                                className="bg-lightGreen border border-darkGreen rounded-xl px-3 sm:px-4 py-1 text-white font-medium text-sm"
                            >
                                Sí
                            </motion.button>
                        </div>
                    </motion.div>
                )}

                <ModalQR isOpen={modalQROpen} onClose={() => setModalQROpen(false)} />

                {/* Table Container */}
                <div className="overflow-x-auto rounded-xl shadow-sm border border-lightGray">
                    <div className="min-w-[800px] sm:min-w-[1000px] lg:min-w-full">
                        <table className="w-full table-fixed">
                            <thead className="bg-gradient-to-r from-lime-400 to-lime-600 text-black">
                                <tr>
                                    <th className="w-32 sm:w-40 px-1 sm:px-2 py-2 sm:py-3 text-xs font-medium uppercase tracking-wider border border-white text-left">
                                        <div className="truncate">Número Documento</div>
                                    </th>
                                    <th className="w-40 sm:w-48 px-1 sm:px-2 py-2 sm:py-3 text-xs font-medium uppercase tracking-wider border border-white text-center">
                                        <div className="truncate">Nombres y Apellidos</div>
                                    </th>
                                    {[...Array(4)].map((_, weekIndex) => (
                                        <th key={weekIndex} colSpan={7} className="px-1 sm:px-2 py-2 sm:py-3 text-xs font-medium uppercase tracking-wider border border-white text-center">
                                            <div className="hidden sm:block">Semana {weekIndex + 1}</div>
                                            <div className="sm:hidden">S{weekIndex + 1}</div>
                                        </th>
                                    ))}
                                </tr>
                                <tr className="bg-lightGray">
                                    <th className="px-1 sm:px-2 py-2 sm:py-3 border border-lightGray"></th>
                                    <th className="px-1 sm:px-2 py-2 sm:py-3 border border-lightGray"></th>
                                    {[...Array(28)].map((_, dayIndex) => (
                                        <th
                                            key={dayIndex}
                                            className="w-6 sm:w-8 px-0.5 sm:px-1 py-2 sm:py-3 border border-lightGray text-xs sm:text-sm text-darkGray text-center"
                                        >
                                            {["L", "M", "M", "J", "V", "S", "D"][dayIndex % 7]}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-lightGray">
                                {filteredStudents?.map((studentStudySheet: any) => (
                                    <tr key={studentStudySheet.id} className="hover:bg-gray-50">
                                        <td className="px-1 sm:px-2 py-1.5 sm:py-2 border border-lightGray text-xs sm:text-sm">
                                            <div className="truncate" title={studentStudySheet.student?.person?.document || 'N/A'}>
                                                {studentStudySheet.student?.person?.document || 'N/A'}
                                            </div>
                                        </td>
                                        <td className="px-1 sm:px-2 py-1.5 sm:py-2 border border-lightGray text-xs sm:text-sm">
                                            <div className="truncate" title={`${studentStudySheet.student?.person?.name || ''} ${studentStudySheet.student?.person?.lastname || ''}`}>
                                                {studentStudySheet.student?.person?.name || 'N/A'} {studentStudySheet.student?.person?.lastname || ''}
                                            </div>
                                        </td>
                                        {[...Array(4)].map((_, weekIndex) => {
                                            const weekDates = generateWeekDates(weekIndex);
                                            return (
                                                <React.Fragment key={weekIndex}>
                                                    {weekDates.map((date, dayIndex) => {
                                                        const isWeekend = dayIndex === 5 || dayIndex === 6;
                                                        const attendance = getAttendanceByDate(
                                                            studentStudySheet.student?.attendances || [], 
                                                            date
                                                        );
                                                        const attendanceIcon = attendance 
                                                            ? getAttendanceIcon(attendance.attendanceState?.status)
                                                            : null;

                                                        return (
                                                            <td
                                                                key={`${weekIndex}-${dayIndex}-${date}`}
                                                                className={`px-0.5 sm:px-1 py-1.5 sm:py-2 border border-lightGray text-center text-xs sm:text-sm ${
                                                                    isWeekend ? 'bg-gray-100' : 'bg-white'
                                                                }`}
                                                            >
                                                                <div className="flex justify-center items-center h-4 w-full">
                                                                    {attendanceIcon}
                                                                </div>
                                                            </td>
                                                        );
                                                    })}
                                                </React.Fragment>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Leyenda de iconos */}
                <div className="bg-white border border-lightGray rounded-xl shadow-sm p-4">
                    <h3 className="text-sm font-semibold text-darkGray mb-3">Leyenda de Asistencia:</h3>
                    <div className="flex flex-wrap gap-4 justify-center sm:justify-start">
                        <div className="flex items-center gap-2">
                            <FaCheck className="text-green-500" />
                            <span className="text-xs sm:text-sm text-darkGray">Presente</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <FaTimes className="text-red-500" />
                            <span className="text-xs sm:text-sm text-darkGray">Ausente</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <FaClock className="text-yellow-500" />
                            <span className="text-xs sm:text-sm text-darkGray">Retardo</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <FaExclamationTriangle className="text-blue-500" />
                            <span className="text-xs sm:text-sm text-darkGray">Justificado</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TableAttendance;
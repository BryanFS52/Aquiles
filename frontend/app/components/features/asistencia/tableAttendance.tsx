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
    const getAttendanceByDate = (attendances: any[], targetDate: string, isFirstCall = false) => {
        
        // Si la fecha está vacía, no hay datos
        if (!targetDate || targetDate === '') return null;
        
        // Solo mostrar log detallado en la primera llamada de cada estudiante
        if (isFirstCall && attendances && attendances.length > 0) {
            console.log('Fechas de asistencia disponibles para el estudiante:', attendances.map(a => ({
                date: a.attendanceDate,
                status: a.attendanceState?.status,
                fullObject: a
            })));
            console.log('Buscando fechas como:', targetDate);
        }
        
        if (!attendances) return null;
        const result = attendances.find((attendance: any) =>
            attendance.attendanceDate === targetDate
        );
        return result;
    };

    // Función para obtener el día de la semana de una fecha (0=Lunes, 1=Martes, ..., 6=Domingo)
    const getDayOfWeekIndex = (dateStr: string) => {
        // Crear la fecha usando los componentes individuales para evitar problemas de zona horaria
        const [year, month, day] = dateStr.split('-').map(Number);
        const date = new Date(year, month - 1, day); // month - 1 porque los meses en JS van de 0-11
        
        const jsDay = date.getDay(); // JavaScript: 0=Domingo, 1=Lunes, ..., 6=Sábado
        
        // Convertir a nuestro formato: 0=Lunes, 1=Martes, ..., 6=Domingo
        const ourDay = jsDay === 0 ? 6 : jsDay - 1;
        
        // Verificar algunos casos específicos según tu calendario
        const dayNames = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
        console.log(`Fecha ${dateStr} cae en: ${dayNames[ourDay]} (índice ${ourDay}) - JS day: ${jsDay}`);
        
        return ourDay;
    };

    // Función para obtener todas las fechas únicas de asistencia de todos los estudiantes
    const getAllAttendanceDates = () => {
        const allDates = new Set<string>();
        
        filteredStudents?.forEach((studentStudySheet: any) => {
            const attendances = studentStudySheet.student?.attendances || [];
            attendances.forEach((attendance: any) => {
                if (attendance.attendanceDate) {
                    allDates.add(attendance.attendanceDate);
                }
            });
        });
        
        // Convertir a array y ordenar cronológicamente
        const sortedDates = Array.from(allDates).sort();
        return sortedDates;
    };

    // Función para crear estructura de semanas basada en los días reales de la semana
    const createWeeksFromData = () => {
        const uniqueDates = getAllAttendanceDates();
        
        if (uniqueDates.length === 0) {
            // Si no hay datos, crear 4 semanas vacías
            return [[], [], [], []];
        }
        
        // Agrupar fechas por semanas basándose en el día real de la semana
        const weeksMap = new Map<string, string[]>();
        
        uniqueDates.forEach(dateStr => {
            const date = new Date(dateStr);
            
            // Calcular el lunes de la semana para esta fecha
            const dayIndex = getDayOfWeekIndex(dateStr);
            
            // Encontrar el lunes de esta semana
            const mondayDate = new Date(date);
            mondayDate.setDate(date.getDate() - dayIndex);
            
            const weekKey = mondayDate.toISOString().split('T')[0];
            
            if (!weeksMap.has(weekKey)) {
                weeksMap.set(weekKey, new Array(7).fill(''));
            }
            
            const week = weeksMap.get(weekKey)!;
            // Poner la fecha en el índice correcto según el día de la semana
            week[dayIndex] = dateStr;
        });
        
        // Convertir el mapa a array y ordenar por semana
        const sortedWeeks = Array.from(weeksMap.entries())
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([_, week]) => week);
        
        // Asegurar que tenemos exactamente 4 semanas
        while (sortedWeeks.length < 4) {
            sortedWeeks.push(new Array(7).fill(''));
        }
        
        console.log('Semanas creadas a partir de datos (indexados correctamente por día):', sortedWeeks);
        return sortedWeeks.slice(0, 4);
    };

    // Obtener las fechas dinámicamente
    const weeklyDates = createWeeksFromData();

    // Función para generar las fechas de la semana actual basada en el trimestre
    const generateWeekDates = (weekOffset: number = 0) => {
        const dates = weeklyDates[weekOffset] || new Array(7).fill('');
        console.log(`Fechas generadas para la semana ${weekOffset + 1}:`, dates);
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
        <div className="w-full max-w-full rounded-2xl shadow bg-white dark:bg-gray-800 border border-lightGray dark:border-gray-600 p-3 sm:p-4 lg:p-6 mb-6">
            <div className="flex flex-col gap-4 lg:gap-6">
                {/* Header Controls */}
                <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
                    {/* Search Bar */}
                    <form className="w-full xl:w-auto order-1 xl:order-1">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <GoSearch className="text-grayText dark:text-gray-400 text-sm sm:text-base" />
                            </div>
                            <input
                                type="search"
                                value={searchTerm}
                                onChange={handleSearchChange}
                                className="h-9 sm:h-10 w-full xl:w-64 pl-8 sm:pl-10 pr-4 text-xs sm:text-sm rounded-xl border border-lightGray dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-lightGreen dark:focus:ring-shadowBlue focus:border-lightGreen dark:focus:border-shadowBlue shadow-sm"
                                placeholder="Buscar por nombre, apellido o documento"
                            />
                        </div>
                    </form>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 order-2 xl:order-2">
                        <button
                            onClick={handleAttendanceClick}
                            className="flex items-center gap-3flex justify-center gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl shadow text-white bg-gradient-to-r from-primary to-lightGreen hover:from-primary/90 hover:to-lightGreen/90 dark:from-secondary dark:to-darkBlue dark:hover:from-secondary/90 dark:hover:to-darkBlue/90  dark:text-white"
                        >
                            <span className="hidden xs:inline">Toma de</span>asistencia<BsQrCode className="w-3 h-3 sm:w-4 sm:h-4" />
                        </button>

                        <button
                            onClick={() => onNavigate(selectedCompetence)}
                            disabled={!selectedCompetence}
                            className={`flex items-center justify-center gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl shadow whitespace-nowrap transition ${selectedCompetence
                                ? 'bg-gradient-to-r text-white from-primary to-lightGreen hover:from-primary/90 hover:to-lightGreen/90 dark:from-secondary dark:to-darkBlue dark:hover:from-secondary/90 dark:hover:to-darkBlue/90  dark:text-white'
                                : 'bg-lightGray dark:bg-gray-600 text-grayText dark:text-gray-400 cursor-not-allowed opacity-60'
                                }`}
                            title={!selectedCompetence ? 'Debe seleccionar una competencia primero' : ''}
                        >
                            <span className="hidden xs:inline">Asistencia</span>manual <FaClipboardList className="w-3 h-3 sm:w-4 sm:h-4" />
                        </button>

                        {/* Selector de Competencia */}
                        <select
                            value={selectedCompetence}
                            onChange={(e) => setSelectedCompetence(e.target.value)}
                            className="h-9 sm:h-10 px-3 pr-8 text-xs sm:text-sm rounded-xl border border-lightGray dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-lightGreen dark:focus:ring-shadowBlue focus:border-lightGreen dark:focus:border-shadowBlue shadow-sm bg-white dark:bg-gray-700 text-black dark:text-white min-w-[200px] sm:min-w-[250px]"
                        >
                            <option value="">Seleccione competencia</option>
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
                            className="bg-gradient-to-r from-primary to-lightGreen hover:from-primary/90 hover:to-lightGreen/90 dark:from-secondary dark:to-darkBlue dark:hover:from-secondary/90 dark:hover:to-darkBlue/90  dark:text-white rounded-xl p-1.5 sm:p-2 hover:text-white dark:hover:text-gray-200 transition flex-shrink-0"
                        >
                            <IoIosArrowBack className="text-base sm:text-xl" />
                        </button>
                        <span className="text-black/80 dark:text-white/90 font-semibold text-sm sm:text-base whitespace-nowrap">
                            Trimestre {currentTrimester}
                        </span>
                        <button
                            onClick={handleNextTrimester}
                            className="bg-gradient-to-r text-gray from-primary to-lightGreen hover:from-primary/90 hover:to-lightGreen/90 dark:from-secondary dark:to-darkBlue dark:hover:from-secondary/90 dark:hover:to-darkBlue/90  dark:text-white rounded-xl p-1.5 sm:p-2 hover:text-white dark:hover:text-gray-200 transition flex-shrink-0"
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
                        className="bg-white dark:bg-gray-800 border border-lightGray dark:border-gray-600 rounded-xl shadow p-3 sm:p-4 flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4"
                    >
                        <span className="text-sm sm:text-base font-semibold text-center sm:text-left text-black dark:text-white">
                            Se va a generar el QR, ¿desea continuar?
                        </span>
                        <div className="flex gap-2 flex-shrink-0">
                            <motion.button
                                onClick={handleNoClick}
                                whileHover={{ scale: 1.05 }}
                                className="bg-red-600 dark:bg-red-700 border border-red-700 dark:border-red-800 rounded-xl px-3 sm:px-4 py-1 text-white font-medium text-sm"
                            >
                                No
                            </motion.button>
                            <motion.button
                                onClick={handleYesClick}
                                whileHover={{ scale: 1.05 }}
                                className="bg-lightGreen dark:bg-lightGreen/90 border border-lightGreen dark:border-lightGreen rounded-xl px-3 sm:px-4 py-1 text-white font-medium text-sm"
                            >
                                Sí
                            </motion.button>
                        </div>
                    </motion.div>
                )}

                <ModalQR isOpen={modalQROpen} onClose={() => setModalQROpen(false)} />

                {/* Table Container */}
                <div className="overflow-x-auto rounded-xl shadow-sm border border-lightGray dark:border-gray-600">
                    <div className="min-w-[800px] sm:min-w-[1000px] lg:min-w-full">
                        <table className="w-full table-fixed">
                            <thead className="bg-gradient-to-r from-lime-400 to-lime-600 dark:from-shadowBlue dark:to-darkBlue text-black dark:text-white">
                                <tr>
                                    <th className="w-32 sm:w-40 px-1 sm:px-2 py-2 sm:py-3 text-xs font-medium uppercase tracking-wider border border-white dark:border-gray-600 text-left">
                                        <div className="truncate">Número documento</div>
                                    </th>
                                    <th className="w-40 sm:w-48 px-1 sm:px-2 py-2 sm:py-3 text-xs font-medium uppercase tracking-wider border border-white dark:border-gray-600 text-center">
                                        <div className="truncate">Nombres y Apellidos</div>
                                    </th>
                                    {[...Array(4)].map((_, weekIndex) => (
                                        <th key={weekIndex} colSpan={7} className="px-1 sm:px-2 py-2 sm:py-3 text-xs font-medium uppercase tracking-wider border border-white dark:border-gray-600 text-center">
                                            <div className="hidden sm:block">Semana {weekIndex + 1}</div>
                                            <div className="sm:hidden">S{weekIndex + 1}</div>
                                        </th>
                                    ))}
                                </tr>
                                <tr className="bg-lightGray dark:bg-gray-700">
                                    <th className="px-1 sm:px-2 py-2 sm:py-3 border border-lightGray dark:border-gray-600"></th>
                                    <th className="px-1 sm:px-2 py-2 sm:py-3 border border-lightGray dark:border-gray-600"></th>
                                    {[...Array(28)].map((_, dayIndex) => (
                                        <th
                                            key={dayIndex}
                                            className="w-6 sm:w-8 px-0.5 sm:px-1 py-2 sm:py-3 border border-lightGray dark:border-gray-600 text-xs sm:text-sm text-darkGray dark:text-gray-300 text-center"
                                        >
                                            {["L", "M", "M", "J", "V", "S", "D"][dayIndex % 7]}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-lightGray dark:divide-gray-600">
                                {filteredStudents?.map((studentStudySheet: any) => (
                                    <tr key={studentStudySheet.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                        <td className="px-1 sm:px-2 py-1.5 sm:py-2 border border-lightGray dark:border-gray-600 text-xs sm:text-sm text-black dark:text-white">
                                            <div className="truncate" title={studentStudySheet.student?.person?.document || 'N/A'}>
                                                {studentStudySheet.student?.person?.document || 'N/A'}
                                            </div>
                                        </td>
                                        <td className="px-1 sm:px-2 py-1.5 sm:py-2 border border-lightGray dark:border-gray-600 text-xs sm:text-sm text-black dark:text-white">
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
                                                        const studentAttendances = studentStudySheet.student?.attendances || [];
                                                        
                                                        // Solo mostrar log una vez por estudiante (primer día)
                                                        if (dayIndex === 0 && weekIndex === 0) {
                                                            console.log('Asistencias de estudiante para:', studentStudySheet.student?.person?.name, ':', studentAttendances);
                                                        }
                                                        
                                                        const attendance = getAttendanceByDate(
                                                            studentAttendances,
                                                            date,
                                                            dayIndex === 0 && weekIndex === 0 // isFirstCall
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
                <div className="bg-whitedark:bg-gradient-to-br dark:from-shadowBlue dark:to-darkBlue border border-lightGray dark:border-gray-700 rounded-xl shadow-sm p-4">
                    <h3 className="text-sm font-semibold text-gray dark:text-white mb-3">Leyenda de asistencia:</h3>
                    <div className="flex flex-wrap gap-4 justify-center sm:justify-start">
                        <div className="flex items-center gap-2">
                            <FaCheck className="text-green-500" />
                            <span className="text-xs sm:text-sm text-gray dark:text-white">Presente</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <FaTimes className="text-red-500" />
                            <span className="text-xs sm:text-sm text-gray dark:text-white">Ausente</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <FaClock className="text-yellow-500" />
                            <span className="text-xs sm:text-sm text-gray dark:text-white">Retardo</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <FaExclamationTriangle className="text-blue-500" />
                            <span className="text-xs sm:text-sm text-gray dark:text-white">Justificado</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TableAttendance;
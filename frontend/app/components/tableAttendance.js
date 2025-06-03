import React, { useEffect, useState } from 'react';
import { GoSearch } from "react-icons/go";
import { BsQrCode } from "react-icons/bs";
import { FaClipboardList } from "react-icons/fa";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { motion } from "framer-motion";
import ModalQR from "@components/Modals/modalQR";
import ModalManualAssistance from "@components/Modals/modalManualAssistance";

const TableAttendance = ({ studySheetData }) => {
    const [modalQROpen, setModalQROpen] = useState(false);
    const [alertVisible, setAlertVisible] = useState(false);
    const [manualAssistanceModalOpen, setManualAssistanceModalOpen] = useState(false);
    const [currentTrimester, setCurrentTrimester] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredStudents, setFilteredStudents] = useState(studySheetData?.students || []);

    // Actualizar la lista de estudiantes filtrados cuando cambia la hoja de estudio
    useEffect(() => {
        setFilteredStudents(studySheetData?.students || []);
    }, [studySheetData]);

    // Mostrar alert antes de abrir QR
    const handleAttendanceClick = () => setAlertVisible(true);
    const handleYesClick = () => {
        setModalQROpen(true);
        setAlertVisible(false);
    };
    const handleNoClick = () => setAlertVisible(false);

    // Cambiar trimestre
    const handlePreviousTrimester = () => {
        if (currentTrimester > 1) setCurrentTrimester(currentTrimester - 1);
    };
    const handleNextTrimester = () => {
        if (currentTrimester < 7) setCurrentTrimester(currentTrimester + 1);
    };

    // Manejar cambio en input búsqueda
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        const filtered = filteredStudents?.filter(student =>
            student.person.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
            student.person.lastname.toLowerCase().includes(e.target.value.toLowerCase()) ||
            student.person.document.toLowerCase().includes(e.target.value.toLowerCase())
        ) || [];
        setFilteredStudents(filtered);
    };

    return (
        <div className="w-[98%] h-auto rounded-lg overflow-hidden shadow-lg bg-white border-2 border-lightGray relative mb-4 p-4 mr-2 mt-7 md:mr-6 sm:mx-4">
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0">
                <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-4 w-full">
                    <form className="w-full md:w-auto">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <GoSearch className="text-grayText" />
                            </div>
                            <input
                                type="search"
                                value={searchTerm}
                                onChange={handleSearchChange}
                                className="h-10 block w-full md:w-52 pl-10 pr-4 text-sm rounded-lg border-2 border-lightGray focus:outline-none focus:border-lightGray"
                                placeholder="Buscar"
                            />
                        </div>
                    </form>
                    <div className="relative flex items-center space-x-4 w-full md:w-auto">
                        <button
                            onClick={handleAttendanceClick}
                            className="flex items-center h-10 w-full md:w-auto pl-3 pr-4 text-sm rounded-lg border-2 border-darkBlue hover:border-lightGreen bg-darkBlue text-white hover:bg-lightGreen transition-colors duration-300 focus:outline-none">
                            Toma de Asistencia
                            <BsQrCode className="w-4 h-4 ml-2" />
                        </button>
                        <button
                            onClick={() => setManualAssistanceModalOpen(true)}
                            className="flex items-center h-10 w-full md:w-auto pl-3 pr-4 text-sm rounded-lg border-2 border-darkBlue hover:border-lightGreen bg-darkBlue text-white hover:bg-lightGreen transition-colors duration-300 focus:outline-none"
                        >
                            Asistencia Manual
                            <FaClipboardList className="w-4 h-4 ml-2" />
                        </button>
                    </div>

                    {alertVisible && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute z-10 left-0 top-10 mt-4 bg-white border-2 border-lightGray shadow-lg h-20 rounded-lg flex items-center justify-center p-4 w-[90%] md:w-[300px]"
                        >
                            <div className="flex flex-col items-center">
                                <span className="font-inter text-center text-base font-semibold">
                                    Se va a generar el QR, ¿desea continuar?
                                </span>
                            </div>
                            <div className="flex space-x-2">
                                <motion.button
                                    onClick={handleNoClick}
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    whileHover={{ scale: 1.1 }}
                                    transition={{ duration: 0.2 }}
                                    className="bg-red-600 border-2 border-red-700 rounded-2xl w-16 h-8 text-white font-medium text-xl"
                                >
                                    No
                                </motion.button>
                                <motion.button
                                    onClick={handleYesClick}
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    whileHover={{ scale: 1.1 }}
                                    transition={{ duration: 0.2 }}
                                    className="bg-lightGreen border-2 border-darkGreen rounded-2xl w-16 h-8 text-white font-medium text-xl"
                                >
                                    Sí
                                </motion.button>
                            </div>
                        </motion.div>
                    )}
                    <ModalQR
                        isOpen={modalQROpen}
                        onClose={() => setModalQROpen(false)}
                    />
                </div>
                <div className="flex flex-col md:flex-row justify-between items-end absolute right-4 sm:items-center sm:mx-4 sm:mt-4">
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={handlePreviousTrimester}
                            className="bg-lightGray px-4 py-2 rounded-lg mt-2"
                        >
                            <IoIosArrowBack className="text-lg"
                            />
                        </button>
                        <span className="text-lg font-semibold sm:text-base">
                            Trimestre {currentTrimester}
                        </span>
                        <button
                            onClick={handleNextTrimester}
                            className="bg-lightGray px-4 py-2 rounded-lg mt-2"
                        >
                            <IoIosArrowForward className="text-lg" />
                        </button>
                    </div>
                </div>
            </div>
            {manualAssistanceModalOpen && (
                <ModalManualAssistance
                    mode="event"
                    isOpen={manualAssistanceModalOpen}
                    onClose={() => setManualAssistanceModalOpen(false)}
                    students={studySheetData?.students || []}
                    onSave={(attendanceData) => {
                        console.log('Attendance data to save:', attendanceData);
                        setManualAssistanceModalOpen(false);
                    }}
                />
            )}

            <div className="overflow-x-auto mt-4 bg-lightGray mb-5">
                <table className="min-w-full table-fixed border border-lightGray">
                    <thead className="bg-lightGray">
                        <tr>
                            <th className="px-2 py-3 text-left text-xs font-medium text-black uppercase tracking-wider border-2 border-lightGray">Número de Documento</th>
                            <th className="px-2 py-3 text-xs text-center text-darkGray uppercase tracking-wider border-2 border-lightGray">Nombres y Apellidos</th>
                            {[...Array(4)].map((_, weekIndex) => (
                                <th
                                    key={weekIndex}
                                    colSpan={7}
                                    className="px-2 py-3 text-center text-xs font-semibold font-inter text-black uppercase tracking-wider border-2 border-lightGray">
                                    Semana {weekIndex + 1}
                                </th>
                            ))}
                        </tr>
                        <tr>
                            <th className="px-2 py-3 text-left text-xs text-darkGray uppercase tracking-wider border-2 border-lightGray font-inter font-semibold"></th>
                            <th className="px-2 py-3 text-xs text-center text-darkGray uppercase tracking-wider border-2 border-lightGray font-inter font-semibold"></th>
                            {[...Array(28)].map((_, dayIndex) => {
                                return (
                                    <th
                                        key={dayIndex}
                                        className={`px-2 py-3 border-2 border-lightGray bg-lightGray text-sm font-inter font-semibold text-darkGray ${[5, 6].includes(dayIndex % 7) ? 'text-darkGray' : ''}`}
                                    >
                                        {["L", "M", "M", "J", "V", "S", "D"][dayIndex % 7]}
                                    </th>
                                );
                            })}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-lightGray">
                        {filteredStudents?.map((student) => (
                            <tr key={student.id}>
                                <td className="px-2 py-2 border-2 border-lightGray text-sm">
                                    {student.person.document}
                                </td>
                                <td className="px-2 py-2 border-2 border-lightGray text-sm">
                                    {student.person.name} {student.person.lastname}
                                </td>
                                {[...Array(4)].map((_, weekIndex) => (
                                    <React.Fragment key={weekIndex}>
                                        {[...Array(7)].map((_, dayIndex) => {
                                            const isWeekend = dayIndex === 5 || dayIndex === 6;
                                            //const cellValue = apprentice.weeks && apprentice.weeks[weekIndex] ? apprentice.weeks[weekIndex][dayIndex] : '';
                                            const cellValue = ''; // No hay datos de asistencia por semana

                                            return (
                                                <td
                                                    key={dayIndex}
                                                    className={`px-2 py-2 border-2 border-lightGray text-center ${isWeekend ? 'bg-lightGray' : ''}`}
                                                >
                                                    <span className={`${cellValue === '✓' ? 'text-lightGreen font-bold' :
                                                        (cellValue === 'R' ? 'text-yellow-500 font-bold' :
                                                            (cellValue === 'X' ? 'text-red-500 font-bold' :
                                                                (cellValue === 'J' ? 'text-blue-500 font-bold' :
                                                                    'text-black')))
                                                        }`}>
                                                        {cellValue}
                                                    </span>
                                                </td>
                                            );
                                        })}
                                    </React.Fragment>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TableAttendance;
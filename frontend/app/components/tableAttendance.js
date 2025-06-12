import React, { useEffect, useState } from 'react';
import { GoSearch } from "react-icons/go";
import { BsQrCode } from "react-icons/bs";
import { FaClipboardList } from "react-icons/fa";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { motion } from "framer-motion";
import { useRouter } from 'next/navigation';
import ModalQR from "@components/Modals/modalQR";


const TableAttendance = ({ studySheetData }) => {
    const router = useRouter();
    const [modalQROpen, setModalQROpen] = useState(false);
    const [alertVisible, setAlertVisible] = useState(false);
    const [currentTrimester, setCurrentTrimester] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredStudents, setFilteredStudents] = useState(studySheetData?.students || []);


    console.log(studySheetData)
    useEffect(() => {
        setFilteredStudents(studySheetData?.students || []);
    }, [studySheetData]);

    const handleAttendanceClick = () => setAlertVisible(true);
    const handleYesClick = () => {
        setModalQROpen(true);
        setAlertVisible(false);
    };
    const handleNoClick = () => setAlertVisible(false);

    const handlePreviousTrimester = () => {
        if (currentTrimester > 1) setCurrentTrimester(currentTrimester - 1);
    };
    const handleNextTrimester = () => {
        if (currentTrimester < 7) setCurrentTrimester(currentTrimester + 1);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        const filtered = studySheetData?.students?.filter(student =>
            student.person.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
            student.person.lastname.toLowerCase().includes(e.target.value.toLowerCase()) ||
            student.person.document.toLowerCase().includes(e.target.value.toLowerCase())
        ) || [];
        setFilteredStudents(filtered);
    };

    return (
        <div className="w-[98%] rounded-2xl shadow bg-white border border-lightGray p-6 mb-6">
            <div className="flex flex-col md:flex-row items-start justify-between gap-6">
                <form className="w-full md:w-auto">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <GoSearch className="text-grayText" />
                        </div>
                        <input
                            type="search"
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className="h-10 w-full md:w-64 pl-10 pr-4 text-sm rounded-xl border border-lightGray focus:outline-none focus:ring-2 focus:ring-lightGreen focus:border-lightGreen shadow-sm"
                            placeholder="Buscar por nombre, apellido o documento"
                        />
                    </div>
                </form>

                <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                    <button
                        onClick={handleAttendanceClick}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl shadow bg-darkBlue text-white hover:bg-lightGreen hover:text-darkBlue transition border border-darkBlue hover:border-lightGreen"
                    >
                        Toma de Asistencia <BsQrCode className="w-4 h-4" />
                    </button>

                    <button
                        onClick={() => router.push('/dashboard/asistenciaManual')}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl shadow bg-darkBlue text-white hover:bg-lightGreen hover:text-darkBlue transition border border-darkBlue hover:border-lightGreen"
                    >
                        Asistencia Manual <FaClipboardList className="w-4 h-4" />
                    </button>

                </div>

                <div className="flex items-center gap-3 mt-2 md:mt-0">
                    <button
                        onClick={handlePreviousTrimester}
                        className="bg-darkBlue text-white rounded-xl p-2 hover:bg-lightGreen hover:text-darkBlue transition"
                    >
                        <IoIosArrowBack className="text-xl" />
                    </button>
                    <span className="text-darkBlue font-semibold text-base">
                        Trimestre {currentTrimester}
                    </span>
                    <button
                        onClick={handleNextTrimester}
                        className="bg-darkBlue text-white rounded-xl p-2 hover:bg-lightGreen hover:text-darkBlue transition"
                    >
                        <IoIosArrowForward className="text-xl" />
                    </button>
                </div>
            </div>

            {alertVisible && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mt-6 bg-white border border-lightGray rounded-xl shadow p-4 flex flex-col md:flex-row justify-between items-center gap-4"
                >
                    <span className="text-base font-semibold text-darkBlue text-center">
                        Se va a generar el QR, ¿desea continuar?
                    </span>
                    <div className="flex gap-2">
                        <motion.button
                            onClick={handleNoClick}
                            whileHover={{ scale: 1.05 }}
                            className="bg-red-600 border border-red-700 rounded-xl px-4 py-1 text-white font-medium"
                        >
                            No
                        </motion.button>
                        <motion.button
                            onClick={handleYesClick}
                            whileHover={{ scale: 1.05 }}
                            className="bg-lightGreen border border-darkGreen rounded-xl px-4 py-1 text-white font-medium"
                        >
                            Sí
                        </motion.button>
                    </div>
                </motion.div>
            )}

            <ModalQR isOpen={modalQROpen} onClose={() => setModalQROpen(false)} />

            <div className="overflow-x-auto mt-6 rounded-xl shadow-sm border border-lightGray">
                <table className="min-w-full table-fixed">
                    <thead className="bg-darkBlue text-white">
                        <tr>
                            <th className="px-2 py-3 text-xs font-medium uppercase tracking-wider border border-white text-left">Número de Documento</th>
                            <th className="px-2 py-3 text-xs font-medium uppercase tracking-wider border border-white text-center">Nombres y Apellidos</th>
                            {[...Array(4)].map((_, weekIndex) => (
                                <th key={weekIndex} colSpan={7} className="px-2 py-3 text-xs font-medium uppercase tracking-wider border border-white text-center">
                                    Semana {weekIndex + 1}
                                </th>
                            ))}
                        </tr>
                        <tr className="bg-lightGray">
                            <th className="px-2 py-3 border border-lightGray"></th>
                            <th className="px-2 py-3 border border-lightGray"></th>
                            {[...Array(28)].map((_, dayIndex) => (
                                <th
                                    key={dayIndex}
                                    className="px-2 py-3 border border-lightGray text-sm text-darkGray text-center"
                                >
                                    {["L", "M", "M", "J", "V", "S", "D"][dayIndex % 7]}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-lightGray">
                        {filteredStudents?.map((student) => (
                            <tr key={student.id}>
                                <td className="px-2 py-2 border border-lightGray text-sm">
                                    {student.person.document}
                                </td>
                                <td className="px-2 py-2 border border-lightGray text-sm">
                                    {student.person.name} {student.person.lastname}
                                </td>
                                {[...Array(4)].map((_, weekIndex) => (
                                    <React.Fragment key={weekIndex}>
                                        {[...Array(7)].map((_, dayIndex) => {
                                            const isWeekend = dayIndex === 5 || dayIndex === 6;
                                            const cellValue = '';

                                            return (
                                                <td
                                                    key={dayIndex}
                                                    className={`px-2 py-2 border border-lightGray text-center ${isWeekend ? 'bg-lightGray' : 'bg-white'}`}
                                                >
                                                    <span className={`${cellValue === '✓' ? 'text-lightGreen font-bold' :
                                                        cellValue === 'R' ? 'text-yellow-500 font-bold' :
                                                            cellValue === 'X' ? 'text-red-500 font-bold' :
                                                                cellValue === 'J' ? 'text-blue-500 font-bold' : 'text-darkGray'}`}>
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
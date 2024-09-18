import React, { useEffect, useState } from 'react';
import { getAllApprentices } from "../services/apprenticeService";
import { GoSearch } from "react-icons/go";
import { BsQrCode } from "react-icons/bs";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import ModalQR from "../components/Modals/modalQR";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import FormularioQr from "../components/formularioQr"; // Asegúrate de importar el formulario

const TablaApprentices = () => {
    const [apprentices, setApprentices] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalQROpen, setModalQROpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [calendarOpen, setCalendarOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [currentPage, setCurrentPage] = useState(1);
    const [apprenticesPerPage] = useState(7);
    
    useEffect(() => {
        const fetchApprentices = async () => {
            try {
                const apprenticesData = await getAllApprentices();
                const updatedApprentices = apprenticesData.map(apprentice => ({
                    ...apprentice,
                    weeks: Array(4).fill(null).map(() => 
                        Array(7).fill(null).map((_, dayIndex) => 
                            (dayIndex === 5 || dayIndex === 6) ? '' : 'A'
                        )
                    ),
                }));
                setApprentices(updatedApprentices);
            } catch (error) {
                console.error('Error al obtener la lista de aprendices:', error);
            }
        };

        fetchApprentices();
    }, []);

    const updateAttendance = (documentNumber) => {
        const updatedApprentices = apprentices.map(apprentice => {
            if (apprentice.documentNumber === documentNumber) {
                const currentDay = new Date().getDay(); // 0 (Domingo) a 6 (Sábado)
                const currentWeek = 0; // Cambia esto según la semana actual si es necesario

                // Cambiar la asistencia de 'A' a '✓'
                apprentice.weeks[currentWeek][currentDay] = '✓';
            }
            return apprentice;
        });

        setApprentices(updatedApprentices);
    };

    const handleOpenQRModal = () => {
        setModalQROpen(true);
    };

    const handleCloseQRModal = () => {
        setModalQROpen(false);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredApprentices = apprentices.filter((apprentice) =>
        apprentice.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastApprentice = currentPage * apprenticesPerPage;
    const indexOfFirstApprentice = indexOfLastApprentice - apprenticesPerPage;
    const currentApprentices = filteredApprentices.slice(indexOfFirstApprentice, indexOfLastApprentice);

    const totalPages = Math.ceil(filteredApprentices.length / apprenticesPerPage);

    const handlePageChange = (page) => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <div className="w-[98%] h-auto rounded-lg overflow-hidden shadow-lg bg-white border-2 border-gray-300 relative mb-4 p-4 mr-6 mt-7">
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0">
                <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-4">
                    <form className="w-full md:w-auto">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <GoSearch className="text-gray-400" />
                            </div>
                            <input type="search" value={searchTerm} onChange={handleSearchChange} className="h-10 block w-full md:w-52 pl-10 pr-4 text-sm rounded-lg border-2 border-slate-300 focus:outline-none focus:border-slate-300" placeholder="Buscar" />
                        </div>
                    </form>

                    <div className="relative w-full md:w-auto">
                        <button onClick={handleOpenQRModal} className="flex items-center h-10 w-full md:w-auto pl-3 pr-4 text-sm rounded-lg border-2 border-slate-300 bg-custom-blue text-white hover:bg-[#01b001] transition-colors duration-300 focus:outline-none">
                            Toma de Asistencia
                            <BsQrCode className="w-4 h-4 ml-2" />
                        </button>
                        <ModalQR isOpen={modalQROpen} onClose={handleCloseQRModal} />
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto mt-4 bg-gray-100 mb-5">
                <table className="min-w-full table-fixed border border-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-2 py-3 text-left text-xs font-medium text-black uppercase tracking-wider border-2 border-gray-300">Número de Documento</th>
                            <th className="px-2 py-3 text-xs text-center text-gray-700 uppercase tracking-wider border-2 border-gray-300">Nombre y Apellido</th>
                            {[...Array(4)].map((_, weekIndex) => (
                                <th
                                    key={weekIndex}
                                    colSpan={7}
                                    className="px-2 py-3 text-center text-xs font-semibold font-inter text-black uppercase tracking-wider border-2 border-gray-300">
                                    Semana {weekIndex + 1}
                                </th>
                            ))}
                        </tr>
                        <tr>
                            <th className="px-2 py-3 text-left text-xs text-gray-700 uppercase tracking-wider border-2 border-gray-300 font-inter font-semibold"></th>
                            <th className="px-2 py-3 text-xs text-center text-gray-700 uppercase tracking-wider border-2 border-gray-300 font-inter font-semibold"></th>
                            {[...Array(28)].map((_, dayIndex) => {
                                const dayOfWeek = dayIndex % 7;
                                return (
                                    <th
                                        key={dayIndex}
                                        className={`px-2 py-3 border-2 border-gray-300 bg-gray-100 text-sm font-inter font-semibold text-gray-700 ${
                                            dayIndex === 5 || dayIndex === 6 ? 'text-gray-700' : ''
                                        }`}
                                    >
                                        {["L", "M", "M", "J", "V", "S", "D"][dayIndex % 7]}
                                    </th>
                                );
                            })}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-300">
                        {currentApprentices.map((apprentice, index) => (
                            <tr key={apprentice.documentNumber}>
                                <td className="px-2 py-2 border-2 border-gray-300 text-sm">
                                    {apprentice.documentNumber}
                                </td>
                                <td className="px-2 py-2 border-2 border-gray-300 text-sm">
                                    {apprentice.name} {apprentice.lastName}
                                </td>
                                {[...Array(4)].map((_, weekIndex) => (
                                    <React.Fragment key={weekIndex}>
                                        {[...Array(7)].map((_, dayIndex) => {
                                            const isWeekend = dayIndex === 5 || dayIndex === 6;
                                            const cellValue = apprentice.weeks[weekIndex][dayIndex];
                                            return (
                                                <td 
                                                    key={dayIndex} 
                                                    className={`px-2 py-2 border-2 border-gray-300 text-center ${isWeekend ? 'bg-gray-200' : ''}`}
                                                >
                                                    <span className={`${
                                                        cellValue === '✓' ? 'text-green-500 font-bold' :
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

            <div className="flex justify-center items-center space-x-4">
                <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="px-4 py-2 font-medium text-gray-500 text-2xl cursor-pointer">
                    <IoIosArrowBack />
                </button>
                {[...Array(totalPages)].map((_, pageIndex) => (
                    <button key={pageIndex + 1} onClick={() => handlePageChange(pageIndex + 1)} className={`px-4 py-2 text-sm font-medium rounded-lg ${currentPage === pageIndex + 1 ? 'bg-custom-blue text-white hover:bg-[#01b001] transition-colors duration-300' : 'bg-custom-blue text-white hover:bg-[#01b001] transition-colors duration-300'}`}>
                        {pageIndex + 1}
                    </button>
                ))}
                <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="px-4 py-2 font-medium text-gray-500 text-2xl cursor-pointer">
                    <IoIosArrowForward />
                </button>
            </div>

            <FormularioQr updateAttendance={updateAttendance} />
        </div>
    );
};

export default TablaApprentices;

import React, { useEffect, useState } from 'react';
import { getAllApprentices } from "../services/apprenticeService";
import { GoSearch } from "react-icons/go";
import { BsQrCode } from "react-icons/bs";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import ModalQR from "../components/Modals/modalQR";
import 'react-calendar/dist/Calendar.css';
import FormularioQr from "../components/formularioQr"; 

const TablaApprentices = () => {
    const [apprentices, setApprentices] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalQROpen, setModalQROpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [calendarOpen, setCalendarOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [currentPage, setCurrentPage] = useState(1);
    const [apprenticesPerPage] = useState(7);
    const [alertVisible, setAlertVisible] = useState(false); 

    useEffect(() => {
        const fetchApprentices = async () => {
            try {
                const apprenticesData = await getAllApprentices(); 
                setApprentices(apprenticesData);
            } catch (error) {
                console.error('Error al obtener la lista de aprendices:', error);
            }
        };

        fetchApprentices();
    }, []);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleAttendanceClick = () => {
        setAlertVisible(true); // Muestra la alerta
    };

    const handleYesClick = () => {
        setModalQROpen(true); // Abre el modal QR si se selecciona "Sí"
        setAlertVisible(false); 
    };

    const handleNoClick = () => {
        setAlertVisible(false); // Cerrar la alerta si se selecciona "No"
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
                        <button onClick={handleAttendanceClick} className="flex items-center h-10 w-full md:w-auto pl-3 pr-4 text-sm rounded-lg border-2 border-slate-300 bg-custom-blue text-white hover:bg-[#01b001] transition-colors duration-300 focus:outline-none">
                            Toma de Asistencia
                            <BsQrCode className="w-4 h-4 ml-2" />
                        </button>
                        {alertVisible && (
                            <div className="absolute z-10 left-0 top-10 mt-4 bg-white border-2 border-gray-400 shadow-lg h-20 rounded-lg flex items-center justify-between p-4 w-[300px]">
                                <div className="flex flex-col">
                                    <span className="font-inter text-center text-base font-semibold">Se va a generar el QR, ¿desea continuar?</span>
                                </div>
                                <div className="flex space-x-2">
                                    <button onClick={handleNoClick} className="bg-red-600 border-2 border-red-700 rounded-2xl w-16 h-8 text-white font-medium text-xl">No</button>
                                    <button onClick={handleYesClick} className="bg-green-600 border-2 border-green-700 rounded-2xl w-16 h-8 text-white font-medium text-xl">Sí </button>
                                </div>
                            </div>
                        )}
                        <ModalQR isOpen={modalQROpen} onClose={() => setModalQROpen(false)} apprentices={currentApprentices} />
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
                        {currentApprentices.map((apprentice) => (
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
                                            const cellValue = apprentice.weeks && apprentice.weeks[weekIndex] ? apprentice.weeks[weekIndex][dayIndex] : '';

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
            <div className="flex justify-between items-center mt-4">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`bg-gray-200 px-4 py-2 rounded-lg ${currentPage === 1 ? 'cursor-not-allowed opacity-50' : ''}`}>
                    <IoIosArrowBack className="text-lg" />
                </button>
                <span className="text-sm">Página {currentPage} de {totalPages}</span>
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`bg-gray-200 px-4 py-2 rounded-lg ${currentPage === totalPages ? 'cursor-not-allowed opacity-50' : ''}`}>
                    <IoIosArrowForward className="text-lg" />
                </button>
            </div>
        </div>
    );
};

export default TablaApprentices;

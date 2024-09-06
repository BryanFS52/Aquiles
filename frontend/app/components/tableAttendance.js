import React, { useEffect, useState } from 'react';
import { getAllApprentices } from "../services/apprenticeService";
import { GoSearch } from "react-icons/go";
import { BsQrCode } from "react-icons/bs";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import ModalQR from "../components/Modals/modalQR";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const TablaApprentices = () => {
  const [apprentices, setApprentices] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalQROpen, setModalQROpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedWeek, setSelectedWeek] = useState(1);

  useEffect(() => {
    const fetchApprentices = async () => {
      try {
        const apprenticesData = await getAllApprentices();
        const updatedApprentices = apprenticesData.map(apprentice => ({
          ...apprentice,
          weeks: Array(4).fill(null).map(() => 
            Array(7).fill(null).map((_, dayIndex) => 
              (dayIndex === 5 || dayIndex === 6) ? '' : 'A'  // Cambia 'A' por vacío para sábados y domingos
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

  const toggleAttendance = (index, day, weekIndex) => {
    const updatedApprentices = [...apprentices];
    const currentStatus = updatedApprentices[index].weeks[weekIndex][day];
    updatedApprentices[index].weeks[weekIndex][day] =
      currentStatus === '✓' ? 'R' :
      (currentStatus === 'R' ? 'J' :
      (currentStatus === 'J' ? 'X' : '✓'));
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

  const handleDateChange = (date) => {
    setSelectedDate(date);
    const weekNumber = Math.floor(date.getDate() / 7) + 1;
    setSelectedWeek(weekNumber);
  };

  const filteredApprentices = apprentices.filter((apprentice) =>
    apprentice.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCalendarToggle = () => {
    setCalendarOpen(!calendarOpen);
  };

  return (
    <div className="w-[98%] h-auto rounded-lg overflow-hidden shadow-lg bg-white border-2 border-gray-300 relative mb-4 p-4 mr-6 mt-10">
      <div className="flex bg-white w-full h-14 items-center">
        <form className="w-auto h-7">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <GoSearch className="text-gray-400" />
            </div>
            <input type="search" value={searchTerm} onChange={handleSearchChange} className="h-7 block w-52 pl-10 pr-4 text-sm rounded-lg dark:bg-white border-2 border-slate-300 dark:placeholder-gray-400 dark:text-black focus:outline-none focus:border-slate-300" placeholder="Buscar"/>
          </div>
        </form>

        <div className="relative ml-6">
          <button onClick={handleCalendarToggle} className="h-7 w-52 pl-2 pr-4 text-sm rounded-lg dark:bg-white border-2 border-slate-300 dark:placeholder-gray-400 dark:text-black focus:outline-none focus:border-slate-300 flex items-center">
            <GoSearch className="text-gray-400" />
            <span className="mr-2 text-gray-400">Filtrar por fecha</span>
          </button>
          {calendarOpen && (
            <div className="absolute z-50 mt-2 p-2 border border-gray-300 bg-white rounded-lg shadow-lg">
              <Calendar onChange={handleDateChange} value={selectedDate} className="bg-gray-100"/>
            </div>
          )}
        </div>
        
        <div className="mr-7 ml-auto flex space-x-4">
          <button type="button" className="text-white font-inter font-normal h-11 w-54 rounded-lg text-sm px-3 bg-custom-blue hover:bg-[#01b001] transition-colors duration-300 dark:focus:ring-custom-blue flex items-center mb-2 lg:mb-0" onClick={handleOpenQRModal}>
            Generar QR
            <BsQrCode className="w-4 h-4 ml-3" />
          </button>
          <ModalQR isOpen={modalQROpen} onClose={handleCloseQRModal} />
        </div>
      </div>

      <div className="overflow-x-auto mt-4 bg-gray-100 mb-5">
        <table className="min-w-full table-fixed border border-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-2 py-3 text-left text-xs font-medium text-black uppercase tracking-wider border-2 border-gray-300"></th>
              <th className="px-2 py-3 text-left text-xs font-medium text-black uppercase tracking-wider border-2 border-gray-300"></th>
              {[...Array(4)].map((_, weekIndex) => (
                <th
                  key={weekIndex}
                  colSpan={7}
                  className="px-2 py-3 text-center text-xs font-semibold font-inter text-black uppercase tracking-wider border-2 border-gray-300"
                >
                  Semana {weekIndex + 1}
                </th>
              ))}
            </tr>
            <tr>
              <th className="px-2 py-3 text-left text-xs text-gray-700 uppercase tracking-wider border-2 border-gray-300 font-inter font-semibold">
                Número de Documento
              </th>
              <th className="px-2 py-3 text-xs text-center text-gray-700 uppercase tracking-wider border-2 border-gray-300 font-inter font-semibold">
                Nombre y Apellido
              </th>
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
            {filteredApprentices.map((apprentice, index) => (
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
                        onClick={() => toggleAttendance(index, dayIndex, weekIndex)}
                        className={`px-2 py-2 text-center cursor-pointer border-2 border-gray-300
                          ${isWeekend ? 'bg-gray-200 text-white' : ''} 
                          ${cellValue === 'R' ? 'bg-yellow-300 text-yellow-800 font-bold'
                            : cellValue === 'J' ? 'bg-blue-300 text-blue-800 font-bold'
                            : cellValue === 'X' ? 'bg-red-300 text-red-800 font-bold'
                            : cellValue === '✓' ? 'bg-green-300 text-green-800 font-bold'
                            : 'text-black'}
                        `}
                      >
                        {isWeekend ? '' : cellValue}
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

      <div className="flex items-center space-x-4 pt-3 mb-1">
        <button className="p-2 rounded-lg text-gray-500">
          <IoIosArrowBack className="text-gray-700 w-6 h-6" />
        </button>
        <ul className="flex space-x-2">
          {[1, 2, 3, 4, 5].map(page => (
            <li key={page}>
              <a href="#" className="flex items-center px-3 h-7 text-white bg-custom-blue hover:bg-green-600 hover:text-white rounded-md">
                {page}
              </a>
            </li>
          ))}
        </ul>
        <button className="p-2 rounded-lg text-gray-500">
          <IoIosArrowForward className="text-gray-700 w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default TablaApprentices;

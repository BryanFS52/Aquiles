"use client";

import React, { useState } from 'react';
import { GoSearch } from "react-icons/go";
import { BsQrCode } from "react-icons/bs";
import { FaEye } from "react-icons/fa";
import ModalInfoficha from "../components/Modals/modalInfoficha";
import ModalQR from "../components/Modals/modalQR";
import Calendar from 'react-calendar'; // Importar Calendar
import 'react-calendar/dist/Calendar.css'; // Importar CSS

export const TableAttendance = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalQROpen, setModalQROpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false); // Estado para manejar el calendario emergente
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [attendees, setAttendees] = useState([
    { id: "10078459687", name: "Michael Felipe Laiton Chaparro", weeks: Array(4).fill(null).map(() => Array(7).fill('A')) },
    { id: "10078459688", name: "Juan Pérez Gonzalez", weeks: Array(4).fill(null).map(() => Array(7).fill('A')) },
    { id: "10078459689", name: "Jhon Mario Lozano Zapata", weeks: Array(4).fill(null).map(() => Array(7).fill('A')) },
    
    // Más asistentes aquí
  ]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedWeek, setSelectedWeek] = useState(1);

  const toggleAttendance = (index, day, weekIndex) => {
    const updatedAttendees = [...attendees];
    const currentStatus = updatedAttendees[index].weeks[weekIndex][day];
    updatedAttendees[index].weeks[weekIndex][day] =
      currentStatus === 'A' ? 'R' :
      (currentStatus === 'R' ? 'J' :
      (currentStatus === 'J' ? 'X' : 'A'));
    setAttendees(updatedAttendees);
  };

  /*  const handleOpenModal = () => {
    setModalOpen(true);
  }; */

  /* const handleCloseModal = () => {
    setModalOpen(false);
  }; */

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

  const filteredAttendees = attendees.filter((attendee) =>
    attendee.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCalendarToggle = () => {
    setCalendarOpen(!calendarOpen);
  };

  return (
    <div className="w-11/12 h-auto rounded-lg overflow-hidden shadow-lg bg-white border-2 border-gray-300 relative mb-4 p-4 ml-10 mt-10">
      <div className="flex bg-white w-full h-14 items-center">
        <form className="w-auto h-7">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <GoSearch className="text-gray-400" />
            </div>
            <input
              type="search"
              value={searchTerm}
              onChange={handleSearchChange}
              className="h-7 block w-52 pl-10 pr-4 text-sm rounded-lg dark:bg-white border-2 border-slate-300 dark:placeholder-gray-400 dark:text-black focus:outline-none focus:border-slate-300"
              placeholder="Buscar aprendiz:"
            />
          </div>
        </form>

        <div className="relative ml-6">
          <button
            onClick={handleCalendarToggle}
            className="h-7 w-52 pl-2 pr-4 text-sm rounded-lg dark:bg-white border-2 border-slate-300 dark:placeholder-gray-400 dark:text-black focus:outline-none focus:border-slate-300 flex items-center"
          >
            <GoSearch className="text-gray-400" />
            <span className="mr-2 text-gray-400">Filtrar por semana:</span>
          </button>
          {calendarOpen && (
            <div className="absolute z-50 mt-2 p-2 border border-gray-300 bg-white rounded-lg shadow-lg">
              <Calendar
                onChange={handleDateChange}
                value={selectedDate}
                className="bg-gray-100"
              />
            </div>
          )}
        </div>
        
        <div className="mr-7 ml-auto flex space-x-4">
          <button
            type="button"
            className="text-white font-inter font-normal h-11 w-54 rounded-lg text-sm px-3 bg-custom-blue hover:bg-[#01b001] transition-colors duration-300 dark:focus:ring-custom-blue flex items-center mb-2 lg:mb-0"
            onClick={handleOpenQRModal}
          >
            Toma de Asistencia
            <BsQrCode className="w-4 h-4 ml-3" />
          </button>
          <ModalQR isOpen={modalQROpen} onClose={handleCloseQRModal} />
        </div>
      </div>

      {/* Tabla de lista de asistencia */}
      <div className="container mx-auto">
        <div className="overflow-x-auto mt-4 bg-gray-100 mb-5">
          <table className="min-w-full divide-y divide-gray-200 border border-gray-200 table-auto">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-10 py-3 text-left text-xs font-medium text-black uppercase tracking-wider border-2 border-gray-300"></th>
                <th className="px-28 py-3 text-left text-xs font-medium text-black uppercase tracking-wider border-2 border-gray-300"></th>
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
                <th className="px-10 py-3 text-left text-xs text-gray-700 uppercase tracking-wider border-2 border-gray-300 font-inter font-semibold">
                  Número de Documento
                </th>
                <th className="px-6 py-3 text-xs text-center text-gray-700 uppercase tracking-wider border-2 border-gray-300 font-inter font-semibold">
                  Nombre y Apellido
                </th>
                {[...Array(28)].map((_, dayIndex) => (
                  <th
                    key={dayIndex}
                    className="px-4 py-3 border-2 border-gray-300 bg-gray-100 text-sm font-inter font-semibold text-gray-700"
                  >
                    {["L", "M", "M", "J", "V", "S", "D"][dayIndex % 7]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-300">
              {filteredAttendees.map((attendee, index) => (
                <tr key={attendee.id}>
                  <td className="px-4 py-3 border-2 border-gray-300 text-sm">
                    {attendee.id}
                  </td>
                  <td className="px-2 border-2 border-gray-300 text-sm">
                    {attendee.name}
                  </td>
                  {attendee.weeks.map((week, weekIndex) =>
                    week.map((status, dayIndex) => (
                      <td
                        key={`${weekIndex}-${dayIndex}`}
                        className={`px-4 py-3 border-2 border-gray-300 text-sm ${
                          status === 'R'
                            ? 'bg-yellow-300 text-yellow-800'
                            : status === 'J'
                            ? 'bg-blue-300 text-blue-800'
                            : status === 'X'
                            ? 'bg-red-300 text-red-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                        onClick={() => toggleAttendance(index, dayIndex, weekIndex)}
                      >
                        <span
                          className={
                            status === 'R'
                              ? "font-bold"
                              : status === 'J'
                              ? "font-bold"
                              : status === 'X'
                              ? "font-bold"
                              : "font-bold"
                          }
                        >
                          {status === 'R' ? "R" : status === 'J' ? "J" : status === 'X' ? "X" : "✓"}
                        </span>
                      </td>
                    ))
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

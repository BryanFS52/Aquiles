"use client";

import Link from "next/link";
import React, { useState } from "react";
import { GoSearch } from "react-icons/go";
import { MdOutlineQrCodeScanner } from "react-icons/md";
import { VscEye } from "react-icons/vsc";
import ModalInfoficha from "../components/Modals/modalInfoficha";
import ModalQR from "../components/Modals/modalQR";

export const Table = () => {
  const [modalOpen, setModalOpen] = useState(false); // Modal for ficha info
  const [modalQROpen, setModalQROpen] = useState(false); // Modal for QR
  const [attendees, setAttendees] = useState([]); // Attendance data

  const toggleAttendance = (index, day, weekIndex) => {
    const updatedAttendees = [...attendees];
    updatedAttendees[index].weeks[weekIndex][day] = !updatedAttendees[index].weeks[weekIndex][day];
    setAttendees(updatedAttendees);
  };

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleOpenQRModal = () => {
    setModalQROpen(true);
  };

  const handleCloseQRModal = () => {
    setModalQROpen(false);
  };

  return (
    <div className="w-11/12 h-auto rounded-lg overflow-hidden shadow-lg bg-white border-2 border-gray-300 relative mb-4 p-4 ml-10 mt-10">
      <div className="flex flex-wrap bg-white w-full h-14">
        <form className="w-72 h-10 mb-2 lg:mb-0">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <GoSearch className="text-gray-400" />
            </div>
            <input
              type="search"
              className="h-7 block w-52 pl-10 pr-4 text-sm rounded-lg dark:bg-white border-2 border-slate-300 dark:placeholder-gray-400 dark:text-black focus:outline-none focus:border-slate-300"
              placeholder="Buscar aprendiz."
            />
          </div>
        </form>

        <form className="w-72 h-10 ml-4 mb-2 lg:mb-0">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <GoSearch className="text-gray-400" />
            </div>
            <input
              type="date"
              className="h-7 block w-52 pl-10 pr-4 text-sm rounded-lg dark:bg-white border-2 border-slate-300 dark:placeholder-gray-400 dark:text-black focus:outline-none focus:border-slate-300"
              placeholder="Buscar por fechas"
            />
          </div>
        </form>

        <div className="ml-auto flex space-x-2">
          <button
            type="button"
            className="text-white font-serif h-11 w-36 rounded-lg text-sm px-5 bg-custom-blue dark:hover:bg-custom-blue dark:focus:ring-custom-blue flex items-center mb-2 lg:mb-0"
            onClick={handleOpenQRModal}
          >
            Generar QR
            <MdOutlineQrCodeScanner className="ml-2" />
          </button>
          <ModalQR isOpen={modalQROpen} onClose={handleCloseQRModal} />

          <button
            type="button"
            className="text-white font-serif h-11 w-56 rounded-lg text-xs px-5 bg-custom-blue dark:hover:bg-custom-blue dark:focus:ring-custom-blue flex items-center mb-2 lg:mb-0"
            onClick={handleOpenModal}
          >
            Ver información de la ficha
            <VscEye className="w-5 h-5 ml-2" />
          </button>
          <ModalInfoficha isOpen={modalOpen} onClose={handleCloseModal} />

          <button
            type="button"
            className="text-white font-serif h-11 w-44 rounded-lg text-sm px-5 bg-custom-blue dark:hover:bg-custom-blue dark:focus:ring-custom-blue flex items-center mb-2 lg:mb-0"
          >
            Finalizar Asistencia
          </button>
        </div>
      </div>

      <div className="container mx-auto">
        <div className="overflow-x-auto mt-4 bg-red-500 mb-5">
          <table className="min-w-full divide-y divide-gray-200 border border-gray-200 table-auto">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-10 py-3 text-left text-xs font-medium text-black uppercase tracking-wider border-2 border-gray-300"></th>
                <th className="px-28 py-3 text-left text-xs font-medium text-black uppercase tracking-wider border-2 border-gray-300"></th>
                {[...Array(4)].map((_, weekIndex) => (
                  <th
                    key={weekIndex}
                    colSpan={7}
                    className="px-2 py-3 text-center text-xs font-semibold text-black uppercase tracking-wider border-2 border-gray-300 font-serif"
                  >
                    Semana {weekIndex + 1}
                  </th>
                ))}
              </tr>
              <tr>
                <th className="px-10 py-3 text-left text-xs font-medium text-black uppercase tracking-wider border-2 border-gray-300">
                  Número de Documento
                </th>
                <th className="px-6 py-3 text-xs text-center font-medium text-black uppercase tracking-wider border-2 border-gray-300">
                  Nombre y Apellido
                </th>
                {[...Array(28)].map((_, index) => (
                  <th
                    key={index}
                    className="px-4 py-3 border-2 border-gray-300 bg-gray-100 text-sm font-semibold text-gray-700"
                  >
                    {['L', 'M', 'M', 'J', 'V', 'S', 'D'][index % 7]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-300">
              <tr>
                <td className="px-4 py-3 border-2 border-gray-300 text-sm">10078459687</td>
                <td className="px-2 border-2 border-gray-300 text-sm">
                  Michael Felipe Laiton Chaparro
                </td>
                {[...Array(28)].map((_, index) => (
                  <td
                    key={index}
                    className={`px-4 py-3 border-2 border-gray-300 text-sm ${
                      index === 6 || index === 7 || index === 13 || index === 14 ? 'bg-gray-200' : ''
                    }`}
                  >
                    {index % 2 === 0 ? (
                      <span className="text-green-500 font-bold">✓</span>
                    ) : (
                      <span className="text-red-500 font-bold">X</span>
                    )}
                  </td>
                ))}
              </tr>
              {/* Repeat the above <tr> for more rows */}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

"use client"

import Link from "next/link";
import React, { useState,  } from 'react';
import { GoSearch } from "react-icons/go";
import { BsQrCode } from "react-icons/bs";
import { FaEye } from "react-icons/fa";
import { VscEye } from "react-icons/vsc";
import { IoMdExit } from "react-icons/io";
import ModalInfoficha from "../components/Modals/modalInfoficha";
import ModalQR from "../components/Modals/modalQR";


export const TableAttendance = () => {

const [modalOpen, setModalOpen] = useState(false); // de linea 16 a linea 21 se crea la funcion para la logica del modal de ver info de ficha
const [modalQROpen, setModalQROpen] = useState(false); // de linea 23 a linea 30 se crea la funcion para la logica del modal de QR
const [attendees, setAttendees] = useState([]);  //Se crea la funcion para la tabla de asistencia 

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

    return(

    <div className=" w-11/12 h-auto  rounded-lg overflow-hidden shadow-lg bg-white border-2 border-gray-300 relative mb-4 p-4 ml-10 mt-10"> 
        <div className="flex bg-white w-full h-14">
            <form className="w-72 h-10">   
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <GoSearch className="text-gray-400" />
                    </div>
                    <input type="search" className="h-7 block w-52 pl-10 pr-4 text-sm rounded-lg dark:bg-white border-2 border-slate-300 dark:placeholder-gray-400 dark:text-black focus:outline-none focus:border-slate-300" placeholder="Buscar aprendiz:" />
                </div>
            </form>

            <form className="w-72 h-10 ml-4">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <GoSearch className="text-gray-400" />
                    </div>
                    <input type="date" className="h-7 block w-52 pl-10 pr-4 text-sm rounded-lg dark:bg-white border-2 border-slate-300 dark:placeholder-gray-400 dark:text-black focus:outline-none focus:border-slate-300" placeholder="Buscar por fechas" />
                </div>
            </form>
    <div className="ml-28 mr-7">
      <button type="button" className="text-white font-inter font-normal h-11 w-54 rounded-lg text-sm px-3 bg-custom-blue hover:bg-[#01b001] transition-colors duration-300 dark:focus:ring-custom-blue flex items-center mb-2 lg:mb-0"
          onClick={handleOpenQRModal}
          >
          Generar QR
            <BsQrCode className="w-4 h-4 ml-3" />
      </button>
           <ModalQR isOpen={modalQROpen} onClose={handleCloseQRModal}/>
    </div>
    
    <div className="mr-7">
      <button
        type="button"
        className="text-white font-inter font-normal h-11 w-54 rounded-lg text-sm px-3 bg-custom-blue hover:bg-[#01b001] transition-colors duration-300 dark:focus:ring-custom-blue flex items-center mb-2 lg:mb-0"
        onClick={handleOpenModal}
      >
         Ver información de la ficha
        <FaEye className="w-5 h-5 ml-2" />
      </button>
        <ModalInfoficha isOpen={modalOpen} onClose={handleCloseModal} />
    </div>
    
         <Link href="/aprendicelist" className='text-white font-inter font-normal h-11 w-44 rounded-lg text-sm px-1 bg-custom-blue hover:bg-[#01b001] transition-colors duration-300 dark:focus:ring-custom-blue flex items-center'>
             Continuar Asistencia
          <IoMdExit className="w-5 h-5 ml-2" />
        </Link>
        
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
                <th key={weekIndex} colSpan={7} className="px-2 py-3 text-center text-xs font-semibold font-inter text-black uppercase tracking-wider border-2 border-gray-300">Semana {weekIndex + 1}</th>
              ))}
            </tr>
            <tr>
                <th className="px-10 py-3 text-left text-xs text-gray-700 uppercase tracking-wider border-2 border-gray-300 font-inter font-semibold">Número de Documento</th>
                <th className="px-6 py-3 text-xs text-center text-gray-700 uppercase tracking-wider border-2 border-gray-300 font-inter font-semibold">Nombre y Apellido</th>
                <th className="px-4 py-3 border-2 border-gray-300 bg-gray-100 text-sm font-inter font-semibold text-gray-700">L</th>
                <th className="px-4 py-3 border-2 border-gray-300 bg-gray-100 text-sm font-inter font-semibold text-gray-700">M</th>
                <th className="px-4 py-3 border-2 border-gray-300 bg-gray-100 text-sm font-inter font-semibold text-gray-700">M</th>
                <th className="px-4 py-3 border-2 border-gray-300 bg-gray-100 text-sm font-inter font-semibold text-gray-700">J</th>
                <th className="px-4 py-3 border-2 border-gray-300 bg-gray-100 text-sm font-inter font-semibold text-gray-700">V</th>
                <th className="px-4 py-3 border-2 border-gray-300 bg-gray-100 text-sm font-inter font-semibold text-gray-700">S</th>
                <th className="px-4 py-3 border-2 border-gray-300 bg-gray-100 text-sm font-inter font-semibold text-gray-700">D</th>
                <th className="px-4 py-3 border-2 border-gray-300 bg-gray-100 text-sm font-inter font-semibold text-gray-700">L</th>
                <th className="px-4 py-3 border-2 border-gray-300 bg-gray-100 text-sm font-inter font-semibold text-gray-700">M</th>
                <th className="px-4 py-3 border-2 border-gray-300 bg-gray-100 text-sm font-inter font-semibold text-gray-700">M</th>
                <th className="px-4 py-3 border-2 border-gray-300 bg-gray-100 text-sm font-inter font-semibold text-gray-700">J</th>
                <th className="px-4 py-3 border-2 border-gray-300 bg-gray-100 text-sm font-inter font-semibold text-gray-700">V</th>
                <th className="px-4 py-3 border-2 border-gray-300 bg-gray-100 text-sm font-inter font-semibold text-gray-700">S</th>
                <th className="px-4 py-3 border-2 border-gray-300 bg-gray-100 text-sm font-inter font-semibold text-gray-700">D</th>
                <th className="px-4 py-3 border-2 border-gray-300 bg-gray-100 text-sm font-inter font-semibold text-gray-700">L</th>
                <th className="px-4 py-3 border-2 border-gray-300 bg-gray-100 text-sm font-inter font-semibold text-gray-700">M</th>
                <th className="px-4 py-3 border-2 border-gray-300 bg-gray-100 text-sm font-inter font-semibold text-gray-700">M</th>
                <th className="px-4 py-3 border-2 border-gray-300 bg-gray-100 text-sm font-inter font-semibold text-gray-700">J</th>
                <th className="px-4 py-3 border-2 border-gray-300 bg-gray-100 text-sm font-inter font-semibold text-gray-700">V</th>
                <th className="px-4 py-3 border-2 border-gray-300 bg-gray-100 text-sm font-inter font-semibold text-gray-700">S</th>
                <th className="px-4 py-3 border-2 border-gray-300 bg-gray-100 text-sm font-inter font-semibold text-gray-700">D</th>
                <th className="px-4 py-3 border-2 border-gray-300 bg-gray-100 text-sm font-inter font-semibold text-gray-700">L</th>
                <th className="px-4 py-3 border-2 border-gray-300 bg-gray-100 text-sm font-inter font-semibold text-gray-700">M</th>
                <th className="px-4 py-3 border-2 border-gray-300 bg-gray-100 text-sm font-inter font-semibold text-gray-700">M</th>
                <th className="px-4 py-3 border-2 border-gray-300 bg-gray-100 text-sm font-inter font-semibold text-gray-700">J</th>
                <th className="px-4 py-3 border-2 border-gray-300 bg-gray-100 text-sm font-inter font-semibold text-gray-700">V</th>
                <th className="px-4 py-3 border-2 border-gray-300 bg-gray-100 text-sm font-inter font-semibold text-gray-700">S</th>
                <th className="px-4 py-3 border-2 border-gray-300 bg-gray-100 text-sm font-inter font-semibold text-gray-700">D</th>
                
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-300">
          <tr>
                <td className="px-4 py-3 border-2 border-gray-300 text-sm">10078459687</td>
                <td className="px-2 border-2 border-gray-300 text-sm">Michael Felipe Laiton Chaparro</td>
                <td className="px-4 py-3 border-2 border-gray-300 text-sm"><span className="text-green-500 font-bold">✓</span></td>
                <td className="px-4 py-3 border-2 border-gray-300 text-sm"><span className="text-red-500 font-bold">X</span></td>
                <td className="px-4 py-3 border-2 border-gray-300 text-sm"><span className="text-green-500 font-bold">✓</span></td>
                <td className="px-4 py-3 border-2 border-gray-300 text-sm"><span className="text-green-500 font-bold">✓</span></td>
                <td className="px-4 py-3 border-2 border-gray-300 text-sm"><span className="text-red-500 font-bold">X</span></td>
                <td className="px-4 py-3 border-2 border-gray-300 text-sm bg-gray-200"></td>
                <td className="px-4 py-3 border-2 border-gray-300 text-sm bg-gray-200"></td>
                <td className="px-4 py-3 border-2 border-gray-300 text-sm"><span className="text-green-500 font-bold">✓</span></td>
                <td className="px-4 py-3 border-2 border-gray-300 text-sm"><span className="text-red-500 font-bold">X</span></td>
                <td className="px-4 py-3 border-2 border-gray-300 text-sm"><span className="text-green-500 font-bold">✓</span></td>
                <td className="px-4 py-3 border-2 border-gray-300 text-sm"><span className="text-yellow-500 font-bold">R</span></td>
                <td className="px-4 py-3 border-2 border-gray-300 text-sm"><span className="text-blue-500 font-bold">J</span></td>
                <td className="px-4 py-3 border-2 border-gray-300 text-sm bg-gray-200"></td>
                <td className="px-4 py-3 border-2 border-gray-300 text-sm bg-gray-200"></td>
                <td className="px-4 py-3 border-2 border-gray-300 text-sm"><span className="text-green-500 font-bold">✓</span></td>
                <td className="px-4 py-3 border-2 border-gray-300 text-sm"><span className="text-red-500 font-bold">X</span></td>
                <td className="px-4 py-3 border-2 border-gray-300 text-sm"><span className="text-green-500 font-bold">✓</span></td>
                <td className="px-4 py-3 border-2 border-gray-300 text-sm"><span className="text-yellow-500 font-bold">R</span></td>
                <td className="px-4 py-3 border-2 border-gray-300 text-sm"><span className="text-blue-500 font-bold">J</span></td>
                <td className="px-4 py-3 border-2 border-gray-300 text-sm bg-gray-200"></td>
                <td className="px-4 py-3 border-2 border-gray-300 text-sm bg-gray-200"></td>
                <td className="px-4 py-3 border-2 border-gray-300 text-sm"><span className="text-green-500 font-bold">✓</span></td>
                <td className="px-4 py-3 border-2 border-gray-300 text-sm"><span className="text-red-500 font-bold">X</span></td>
                <td className="px-4 py-3 border-2 border-gray-300 text-sm"><span className="text-green-500 font-bold">✓</span></td>
                <td className="px-4 py-3 border-2 border-gray-300 text-sm"><span className="text-yellow-500 font-bold">R</span></td>
                <td className="px-4 py-3 border-2 border-gray-300 text-sm"><span className="text-blue-500 font-bold">J</span></td>
                <td className="px-4 py-3 border-2 border-gray-300 text-sm bg-gray-200"></td>
                <td className="px-4 py-3 border-2 border-gray-300 text-sm bg-gray-200"></td>
            </tr>
            <tr>
                <td className="px-4 py-3 border-2 border-gray-300 text-sm">10078459687</td>
                <td className="px-2 border-2 border-gray-300 text-sm">Michael Felipe Laiton Chaparro</td>
                <td className="px-4 py-3 border-2 border-gray-300 text-sm"><span className="text-green-500 font-bold">✓</span></td>
                <td className="px-4 py-3 border-2 border-gray-300 text-sm"><span className="text-red-500 font-bold">X</span></td>
                <td className="px-4 py-3 border-2 border-gray-300 text-sm"><span className="text-green-500 font-bold">✓</span></td>
                <td className="px-4 py-3 border-2 border-gray-300 text-sm"><span className="text-green-500 font-bold">✓</span></td>
                <td className="px-4 py-3 border-2 border-gray-300 text-sm"><span className="text-red-500 font-bold">X</span></td>
                <td className="px-4 py-3 border-2 border-gray-300 text-sm bg-gray-200"></td>
                <td className="px-4 py-3 border-2 border-gray-300 text-sm bg-gray-200"></td>
                <td className="px-4 py-3 border-2 border-gray-300 text-sm"><span className="text-green-500 font-bold">✓</span></td>
                <td className="px-4 py-3 border-2 border-gray-300 text-sm"><span className="text-red-500 font-bold">X</span></td>
                <td className="px-4 py-3 border-2 border-gray-300 text-sm"><span className="text-green-500 font-bold">✓</span></td>
                <td className="px-4 py-3 border-2 border-gray-300 text-sm"><span className="text-yellow-500 font-bold">R</span></td>
                <td className="px-4 py-3 border-2 border-gray-300 text-sm"><span className="text-blue-500 font-bold">J</span></td>
                <td className="px-4 py-3 border-2 border-gray-300 text-sm bg-gray-200"></td>
                <td className="px-4 py-3 border-2 border-gray-300 text-sm bg-gray-200"></td>
                <td className="px-4 py-3 border-2 border-gray-300 text-sm"><span className="text-green-500 font-bold">✓</span></td>
                <td className="px-4 py-3 border-2 border-gray-300 text-sm"><span className="text-red-500 font-bold">X</span></td>
                <td className="px-4 py-3 border-2 border-gray-300 text-sm"><span className="text-green-500 font-bold">✓</span></td>
                <td className="px-4 py-3 border-2 border-gray-300 text-sm"><span className="text-yellow-500 font-bold">R</span></td>
                <td className="px-4 py-3 border-2 border-gray-300 text-sm"><span className="text-blue-500 font-bold">J</span></td>
                <td className="px-4 py-3 border-2 border-gray-300 text-sm bg-gray-200"></td>
                <td className="px-4 py-3 border-2 border-gray-300 text-sm bg-gray-200"></td>
                <td className="px-4 py-3 border-2 border-gray-300 text-sm"><span className="text-green-500 font-bold">✓</span></td>
                <td className="px-4 py-3 border-2 border-gray-300 text-sm"><span className="text-red-500 font-bold">X</span></td>
                <td className="px-4 py-3 border-2 border-gray-300 text-sm"><span className="text-green-500 font-bold">✓</span></td>
                <td className="px-4 py-3 border-2 border-gray-300 text-sm"><span className="text-yellow-500 font-bold">R</span></td>
                <td className="px-4 py-3 border-2 border-gray-300 text-sm"><span className="text-blue-500 font-bold">J</span></td>
                <td className="px-4 py-3 border-2 border-gray-300 text-sm bg-gray-200"></td>
                <td className="px-4 py-3 border-2 border-gray-300 text-sm bg-gray-200"></td>
                
            </tr>
          </tbody>
        </table>
        </div>
    </div>
    </div>
  );
};
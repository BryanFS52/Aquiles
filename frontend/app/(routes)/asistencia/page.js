"use client"

import Link from "next/link";
import React, { useState } from "react";
import { HiLockClosed } from "react-icons/hi";
import { PiStudentFill } from "react-icons/pi";
import { FaCheck } from "react-icons/fa";
import { TbLetterR, TbLetterX, TbLetterJ } from "react-icons/tb";
import { TableAttendance } from "../../components/tableAttendance";
import ModalAsistencia from "../../components/Modals/modalAsistencia";
import { Header } from "../../components/header";
import { Sidebar } from "../../components/sidebar";

export default function Attendance () {
  const [modalOpen, setModalOpen] = useState(false);

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };


  
  return (

    <div className="min-h-screen grid grid-cols-1 xl:grid-cols-6">
              <Sidebar/>
            <div className="xl:col-span-5">
                <Header />
    
    <div>
      <div className="h-[90vh] overflow-y-scroll p-6 md:p-12 w-full bg-neutral-100 space-y-5">
        <h1 className="text-[#0e324d] text-2xl sm:text-3xl lg:text-4xl pb-3 border-b-2 border-gray-400 w-full sm:w-3/4 lg:w-1/2 mb-6 lg:mb-12 font-inter font-semibold">Lista de Asistencia</h1>

        <div className="flex flex-wrap justify-center md:justify-start gap-4 ml-32">
          <div className="flex flex-col w-full md:w-96 h-52 rounded-lg overflow-hidden shadow-lg bg-white border-2 border-gray-300 p-4 space-y-3">
            <div className="flex">
              <span className="font-inter font-semibold text-[#0e324d] text-sm sm:text-base">Institución:</span>
              <div className="font-inter font-normal text-black sm:text-base ml-auto relative w-2/3">
                <input type="text" name="nameProject" placeholder="Centro al que pertenece" className=" w-full bg-neutral-300 rounded-lg border-gray-400 border-2 pl-3 pr-10" />
                <HiLockClosed className="absolute top-0 right-2 h-full flex items-center" />
              </div>
            </div>

            <div className="flex">
              <span className="font-inter font-semibold text-[#0e324d] text-sm sm:text-base">Instructor:</span>
              <div className="font-inter font-normal text-black text-sm sm:text-base ml-auto w-2/3">
                <input type="text" name="nameProject" placeholder="Nombre del instructor" className="w-full rounded-lg bg-white border--300 border-2 pl-3" />
              </div>
            </div>

            <div className="flex">
              <span className="font-inter font-semibold text-[#0e324d] text-sm sm:text-base">Fecha:</span>
              <div className="font-inter font-normal text-black text-sm sm:text-base ml-auto w-2/3">
                <input type="date" name="nameProject" placeholder="Fecha" className="w-full text-gray-400 bg-white rounded-lg border-2 border-gray-300 pl-3" />
              </div>
            </div>

            <div className="flex">
              <span className="font-inter font-semibold text-[#0e324d] text-sm sm:text-base">Componente:</span>
              <div className="font-inter font-normal text-black text-sm sm:text-base ml-auto w-2/3">
                <input type="text" name="nameProject" placeholder="Asignar componente" className="w-full bg-white rounded-lg border-2 border-gray-300 pl-3" />
              </div>
            </div>
            
            <button
              type="button"
              className="mr-1 ml-auto text-white rounded-lg text-sm bg-custom-blue hover:bg-custom-blue w-32 h-10 mt-4"
              onClick={handleOpenModal}>
              Guardar
            </button>

          </div>

          <div className="flex flex-col w-full md:w-96 h-52 rounded-lg overflow-hidden shadow-lg bg-white border-2 border-gray-300 p-4 space-y-3">
            <PiStudentFill className="w-9 h-9 text-stone-600 mx-auto" />
            <div className="text-center">
              <span className="text-[#0e324d] text-5xl font-inter font-semibold">25</span>
              <span className="font-inter font-medium text-lg block">Aprendices Actuales</span>
              <span className="font-inter font-medium text-green-500 block">97%</span>
            </div>
          </div>

          <div className="flex flex-col w-full md:w-96 h-52 rounded-lg overflow-hidden shadow-lg bg-white border-2 border-gray-300 p-4 space-y-3">
  <span className="text-[#40b003] font-inter font-semibold text-xl sm:text-2xl text-center">Información de asistencia</span>
  
          {/* Sección de Asistencia e Inasistencias */}
          <div className="flex justify-between">
            {/* Asistencia */}
            <div className="flex items-center space-x-4">
              <span className="font-inter font-normal text-[#000000] sm:text-lg text-lg">Asistencia</span>
              <div className="flex items-center">
                <input className="rounded-md border-gray-300 border-2 w-7 h-6" />
                <FaCheck className="ml-[-23px] text-green-500 w-5 h-5 pointer-events-none" style={{ strokeWidth: 4 }} />
              </div>
            </div>

            {/* Inasistencias */}
            <div className="flex items-center space-x-4">
              <span className="font-inter font-normal text-[#000000] sm:text-lg text-lg">Inasistencias</span>
              <div className="flex items-center">
                <input className="rounded-md border-gray-300 border-2 w-7 h-6" />
                <TbLetterX className="ml-[-23px] text-red-500 w-5 h-5 pointer-events-none" style={{ strokeWidth: 4 }} />
              </div>
            </div>
          </div>

          {/* Sección de Retardo y Justificación */}
          <div className="flex justify-between">
            {/* Retardo */}
            <div className="flex items-center space-x-4">
              <span className="font-inter font-normal text-[#000000] sm:text-lg text-lg">Retardo</span>
              <div className="flex items-center">
                <input className="rounded-md border-gray-300 border-2 w-7 h-6" />
                <TbLetterR className="ml-[-23px] text-yellow-500 w-5 h-5 pointer-events-none" style={{ strokeWidth: 4 }} />
              </div>
            </div>

            {/* Justificación */}
            <div className="flex items-center space-x-6">
              <span className="font-inter font-normal text-[#000000] sm:text-lg text-lg">Justificación</span>
              <div className="flex items-center">
                <input className="rounded-md border-gray-300 border-2 w-7 h-6" />
                <TbLetterJ className="ml-[-24px] text-blue-500 w-5 h-5 pointer-events-none" style={{ strokeWidth: 4 }} />
              </div>
            </div>
          </div>



           
            <ModalAsistencia isOpen={modalOpen} onClose={handleCloseModal} />
          </div>
        </div>
        <div>
          <TableAttendance/>
        </div>
       
      </div>
    </div>
    </div>
    </div>
  );
};
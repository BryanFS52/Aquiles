"use client";

import Link from "next/link";
import React, { useState } from "react";
import { HiLockClosed } from "react-icons/hi";
import { PiStudentFill } from "react-icons/pi";
import { FaCheck, FaEye } from "react-icons/fa";
import { TbLetterR, TbLetterX, TbLetterJ } from "react-icons/tb";
import TableAttendance from "../../components/tableAttendance";
import ModalInfoficha from "../../components/Modals/modalInfoficha";
import { Header } from "../../components/header";
import { Sidebar } from "../../components/sidebar";


export default function Attendance () {
  const [modalOpen, setModalOpen] = useState(false);
  const [nombreInstructor, setNombreInstructor] = useState('');

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

    const handleNombreChange = (e) => {
        const value = e.target.value;
        const regex = /^[a-zA-Z\s]*$/;
        if (regex.test(value)) {
            setNombreInstructor(value);
        }
    };
  
  return (
    <div className="min-h-screen grid grid-cols-1 xl:grid-cols-6">
      <Sidebar />
      <div className="xl:col-span-5">
        <Header />

        <div>
          <div className="h-[90vh] overflow-y-scroll p-4 md:p-8 lg:p-12 w-full bg-neutral-100 space-y-5">
            <h1 className="text-[#0e324d] text-2xl sm:text-3xl lg:text-4xl pb-3 border-b-2 border-gray-400 w-full sm:w-3/4 lg:w-1/2 mb-6 lg:mb-12 font-inter font-semibold">
              Lista de Asistencia
            </h1>
            <div className="flex flex-wrap justify-center gap-4">
            <div className="flex flex-col h-36 w-[30%] rounded-lg overflow-hidden shadow-lg bg-white border-2 border-gray-300 p-4">
            <div className="flex flex-row items-center space-x-4">
              <div className="flex flex-col items-center ml-5 mr-4">
                <PiStudentFill className="w-12 h-12 text-stone-600" />
                <span className="font-inter font-medium text-green-500 mt-1">97%</span>
              </div>

              <div className="flex flex-row items-start space-x-2"> 
                <span className="text-[#0e324d] text-5xl font-inter font-medium">25</span>
                <span className="font-inter font-medium text-base mt-3">Aprendices Actuales</span>
              </div>
            </div>

            <div className="w-full">
              <button type="button" className="text-white font-inter h-9 w-56 ml-24 rounded-lg text-sm px-3 bg-custom-blue hover:bg-[#01b001] transition-colors duration-300 flex items-center justify-center" onClick={handleOpenModal} >
                Ver información de la ficha
                <FaEye className="w-5 h-5 ml-2" />
              </button>
            </div>

            <ModalInfoficha isOpen={modalOpen} onClose={handleCloseModal} />
          </div>
              <div className="flex flex-col w-56 h-44 rounded-lg overflow-hidden shadow-lg bg-white border-2 border-gray-300 p-4 space-y-3">
                <span className="text-[#40b003] font-inter font-semibold text-xl sm:text-xl text-center">Uso de Asistencia</span>

                <div className="flex flex-col space-y-1"> 
                <div className="flex items-center space-x-4">
                  <span className="font-inter text-base w-28">Asistencia</span>
                  <div className="flex items-center">
                    <input className="rounded-md border-gray-300 border-2 w-7 h-6" readOnly />
                    <FaCheck className="ml-[-23px] text-green-500 w-4 h-4 pointer-events-none" strokeWidth={4} />
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <span className="font-inter text-base w-28">Retardo</span>
                  <div className="flex items-center">
                    <input className="rounded-md border-gray-300 border-2 w-7 h-6" readOnly />
                    <TbLetterR className="ml-[-23px] text-yellow-500 w-4 h-4 pointer-events-none" strokeWidth={4} />
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <span className="font-inter text-base w-28">Inasistencias</span>
                  <div className="flex items-center">
                    <input className="rounded-md border-gray-300 border-2 w-7 h-6" readOnly /> 
                    <TbLetterX className="ml-[-23px] text-red-500 w-4 h-4 pointer-events-none" strokeWidth={4} />
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <span className="font-inter text-base w-28">Justificación</span>
                  <div className="flex items-center">
                    <input className="rounded-md border-gray-300 border-2 w-7 h-6" readOnly />
                    <TbLetterJ className="ml-[-24px] text-blue-500 w-4 h-4 pointer-events-none" strokeWidth={4} />
                  </div>
                </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <TableAttendance />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client"

import Link from "next/link";
import React, { useState } from 'react';
import { GiPadlock } from "react-icons/gi";
import { PiStudentFill } from "react-icons/pi";
import { IoMdCheckmark } from "react-icons/io";
import { TbLetterR, TbLetterX, TbLetterJ } from "react-icons/tb";
import { Table } from "../components/table";
import ModalAsistencia from "../components/Modals/modalAsistencia";

export const Attendance = () => {
  const [modalOpen, setModalOpen] = useState(false);

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <div>
      <div className="h-[90vh] overflow-y-scroll p-6 md:p-12 w-full bg-neutral-100 space-y-5">
        <h1 className="font-serif text-4xl pb-3 border-b-2 border-black w-full md:w-80">Lista de Asistencia</h1>

        <div className="flex flex-wrap justify-center md:justify-start gap-4 ml-32">
          <div className="flex flex-col w-full md:w-96 h-52 rounded-lg overflow-hidden shadow-lg bg-white border-2 border-gray-300 p-4 space-y-3">
            <div className="flex">
              <span className="font-serif text-lg">Institución:</span>
              <div className="ml-auto relative w-2/3">
                <input type="text" name="nameProject" placeholder="Centro al que pertenece" className="w-full bg-neutral-300 rounded-lg border-gray-400 border-2 pl-3 pr-10" />
                <GiPadlock className="absolute top-0 right-2 h-full flex items-center" />
              </div>
            </div>

            <div className="flex">
              <span className="font-serif text-lg">Instructor:</span>
              <div className="ml-auto w-2/3">
                <input type="text" name="nameProject" placeholder="Nombre del Instructor" className="w-full rounded-lg bg-white border-gray-300 border-2 pl-3" />
              </div>
            </div>

            <div className="flex">
              <span className="font-serif text-lg">Fecha:</span>
              <div className="ml-auto w-2/3">
                <input type="date" name="nameProject" placeholder="Fecha" className="w-full bg-white rounded-lg border-2 border-gray-300 pl-3" />
              </div>
            </div>

            <div className="flex">
              <span className="font-serif text-lg">Componente:</span>
              <div className="ml-auto w-2/3">
                <input type="text" name="nameProject" placeholder="Componente" className="w-full bg-white rounded-lg border-2 border-gray-300 pl-3" />
              </div>
            </div>
          </div>

          <div className="flex flex-col w-full md:w-96 h-52 rounded-lg overflow-hidden shadow-lg bg-white border-2 border-gray-300 p-4 space-y-3">
            <PiStudentFill className="w-9 h-9 text-stone-600 mx-auto" />
            <div className="text-center">
              <span className="text-5xl font-semibold font-kiwi-marumaru">25</span>
              <span className="font-serif text-lg block">Aprendices Actuales</span>
              <span className="text-green-500 block">97%</span>
            </div>
          </div>

          <div className="flex flex-col w-full md:w-96 h-52 rounded-lg overflow-hidden shadow-lg bg-white border-2 border-gray-300 p-4 space-y-3">
            <span className="font-serif font-semibold text-center">Información de asistencia</span>
            <div className="flex justify-between">
              <div className="flex items-center">
                <span className="font-serif text-lg">Asistencia</span>
                <div className="relative ml-4">
                  <input className="rounded-md border-gray-200 border-2 pl-8 w-5 h-5" />
                  <IoMdCheckmark className="absolute top-1/2 transform -translate-y-1/2 left-2 text-green-500 w-4 h-4" />
                </div>
              </div>

              <div className="flex items-center">
                <span className="font-serif text-lg">Inasistencias</span>
                <div className="relative ml-4">
                  <input className="rounded-md border-gray-200 border-2 pl-8 w-5 h-5" />
                  <TbLetterX className="absolute top-1/2 transform -translate-y-1/2 left-2 text-red-500 w-4 h-4" />
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <div className="flex items-center">
                <span className="font-serif text-lg">Retardo</span>
                <div className="relative ml-4">
                  <input className="rounded-md border-gray-200 border-2 pl-8 w-5 h-5" />
                  <TbLetterR className="absolute top-1/2 transform -translate-y-1/2 left-2 text-yellow-500 w-4 h-4" />
                </div>
              </div>

              <div className="flex items-center">
                <span className="font-serif text-lg">Justificación</span>
                <div className="relative ml-4">
                  <input className="rounded-md border-gray-200 border-2 pl-8 w-5 h-5" />
                  <TbLetterJ className="absolute top-1/2 transform -translate-y-1/2 left-2 text-blue-500 w-4 h-4" />
                </div>
              </div>
            </div>

            <button
              type="button"
              className="text-white rounded-lg text-sm bg-custom-blue hover:bg-custom-blue w-full h-10 mt-3"
              onClick={handleOpenModal}
            >
              Ver información de la asistencia
            </button>
            <ModalAsistencia isOpen={modalOpen} onClose={handleCloseModal} />
          </div>
        </div>

        <div>
          <Table />
        </div>
      </div>
    </div>
  );
};
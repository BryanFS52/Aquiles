"use client"

import Link from "next/link";
import React, { useState,  } from 'react';
import { GiPadlock } from "react-icons/gi";
import { PiStudentFill } from "react-icons/pi";
import { IoMdCheckmark } from "react-icons/io";
import { TbLetterR } from "react-icons/tb";
import { TbLetterX } from "react-icons/tb";
import { TbLetterJ } from "react-icons/tb"; 
import { Table } from "../components/table";
import ModalAsistencia from "../components/Modals/modalAsistencia";

export const Attendance = () => {

  const [modalOpen, setModalOpen] = useState(false); // de linea 16 a linea 25 se crea la funcion para la logica de los modales

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);

  };
    return(
        
        <div>
            <div className="h-[90vh] overflow-y-scroll p-12 inline-block w-full relative bg-neutral-100 space-y-5">
              <h1 className="font-serif text-4xl pb-3 border-b-2 border-black w-80">Lista de Asistencia</h1>
                <div className="flex px-9 space-x-24">
                  <div className=" flex w-96 h-52 rounded-lg overflow-hidden shadow-lg bg-white border-2 border-gray-300 relative mb-4 p-4 ">
                  <div className="z-50 justify-end space-y-3">

                  <div className= "flex">
                    <span className="font-serif text-lg">Institución:</span>
                    <div className="ml-8 relative">
                    <input type="text" name="nameProject" placeholder="Centro al que pertenece" className="bg-neutral-300 rounded-lg border-gray-400 border-2"/>
                    <GiPadlock className="absolute top-0 left-48 h-full flex "/>
                    </div>
                  </div>

                  <div className="flex">
                    <span className="font-serif text-lg">Instructor:</span>
                    <div className="ml-auto">
                    <input type="text" name="nameProject" placeholder="Nombre del Instructor" className="rounded-lg bg-white border-gray-300 border-2 "/>
                    </div>
                  </div>

                  <div className=" flex">
                    <span className="font-serif text-lg">Fecha:</span>
                    <div className="ml-16">
                    <input type="date" name="nameProject" placeholder="Fecha" className="bg-white rounded-lg border-2 border-gray-300"/>
                    </div>
                  </div>

                  <div className=" flex">
                    <span className="font-serif text-lg">Componente:</span>
                    <div className="ml-auto relative">
                    <input type="text" name="nameProject" placeholder="" className="bg-white rounded-lg border-2 border-gray-300"/>
                    </div>
                  </div>
                </div>
              </div>

              {/* Segunda card */}

              <div className=" flex w-96 h-52 rounded-lg overflow-hidden shadow-lg bg-white border-2 border-gray-300 relative mb-4 p-4 ">
                  <div className="z-50 justify-end space-y-3">
                  <PiStudentFill className="w-9 h-9 text-stone-600 ml-6"/><br/>

                  <div>
                    <span className="text-5xl font-semibold font-kiwi-marumaru ml-6">25</span><br/><br/>
                    <span className="font-serif text-lg font-normal ">Aprendices Actuales</span>
                    <div className="ml-80 -mt-6">
                    <span className="text-green-500 font-normal">97%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tercera card */}

              <div className="flex w-96 h-52 rounded-lg overflow-hidden shadow-lg bg-white border-2 border-gray-300 relative mb-4 p-4 ">
                  <div className="z-50 justify-end space-y-3">
                  <span className="font-serif font-semibold text-balg ml-16">Información de asistencia</span>
                  <div className="flex">
                    <div className="flex items-center mr-8">
                      <span className="font-serif text-lg">Asistencia</span>
                      <div className="relative ml-4">
                        <input className="rounded-md border-gray-200 border-2 pl-8 w-5 h-5"/>
                        <IoMdCheckmark className="absolute top-1/2 transform -translate-y-1/2 left-2 text-green-500 w-4 h-4" />
                      </div>
                    </div>

                    <div className="flex items-center">
                      <span className="font-serif text-lg">Inasistencias</span>
                      <div className="relative ml-4">
                        <input className="rounded-md border-gray-200 border-2 pl-8 w-5 h-5"/>
                        <TbLetterX className="absolute top-1/2 transform -translate-y-1/2 left-2 text-red-500 w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  <div className="flex">
                    <div className="flex items-center mr-8">
                      <span className="font-serif text-lg">Retardo</span>
                      <div className="relative ml-4">
                        <input className="rounded-md border-gray-200 border-2 pl-8 w-5 h-5"/>
                        <TbLetterR className="absolute top-1/2 transform -translate-y-1/2 left-2 text-yellow-500 w-4 h-4" />
                      </div>
                    </div>

                    <div className="flex items-center">
                      <span className="font-serif text-lg ml-4">Justificación</span>
                      <div className="relative ml-5">
                        <input className="rounded-md border-gray-200 border-2 pl-8 w-5 h-5"/>
                        <TbLetterJ className="absolute top-1/2 transform -translate-y-1/2 left-2 text-blue-500 w-4 h-4" />
                      </div>
                    </div>
                    </div>

                    <button type="button" className=" text-white rounded-lg text-sm dark:bg-custom-blue dark:hover:bg-custom-blue w-64 h-10 mr-10 ml-10" 
                     onClick={handleOpenModal}
                     >
                      Ver información de la asistencia
                    </button>
                        <ModalAsistencia isOpen={modalOpen} onClose={handleCloseModal}/> {/*se llama la funcion logica para abrir y Cerrar el modal */}

                  </div>
                </div>
              </div>
                <div>
                        <Table/>
                </div>
            </div>
        </div>
    )
    };
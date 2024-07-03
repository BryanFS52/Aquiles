"use client"

import Link from "next/link";
import React, { useState,  } from 'react';
import { GiPadlock } from "react-icons/gi";
import { PiStudentFill } from "react-icons/pi";
import { IoMdCheckmark } from "react-icons/io";
import { TbLetterR } from "react-icons/tb";
import { TbLetterX } from "react-icons/tb";
import { TbLetterJ } from "react-icons/tb"; 
import { Table } from "../components/table"

export const Attendance = () => {
    return(
        
        <div>
            <div className="h-[90vh] overflow-y-scroll p-12 inline-block w-full relative bg-neutral-100 space-y-5">
              <h1 className="font-serif text-4xl pb-3 border-b-2 border-black w-80">Lista de Asistencia</h1>
                <div className="flex px-9 space-x-24">
                  <div className=" flex w-96 h-52 rounded-lg overflow-hidden shadow-lg bg-white border-2 border-gray-300 relative mb-4 p-4 ">
                  <div className="z-50 justify-end space-y-3">

                  <div className= "flex">
                    <span className="font-serif text-lg">Institución</span>
                    <div className="ml-8 relative">
                    <input type="text" name="nameProject" placeholder="Centro al que pertenece" className="bg-neutral-300 rounded-lg border-gray-400 border-2"/>
                    <GiPadlock className="absolute top-0 left-48 h-full flex "/>
                    </div>
                  </div>

                  <div className="flex">
                    <span className="font-serif text-lg">Responsable</span>
                    <div className="ml-auto">
                    <input type="text" name="nameProject" placeholder="Responsable" className="rounded-lg bg-white border-gray-300 border-2 "/>
                    </div>
                  </div>

                  <div className=" flex">
                    <span className="font-serif text-lg">Fecha</span>
                    <div className="ml-16">
                    <input type="date" name="nameProject" placeholder="Fecha" className="bg-white rounded-lg border-2 border-gray-300"/>
                    </div>
                  </div>

                  <div className=" flex">
                    <span className="font-serif text-lg">Materia</span>
                    <div className="ml-auto relative">
                    <input type="text" name="nameProject" placeholder="Materia" className="bg-white rounded-lg border-2 border-gray-300"/>
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
                  <span className="font-serif text-xl ml-32">Leyenda</span>

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
                      <span className="font-serif text-lg">Justificación</span>
                      <div className="relative ml-4">
                        <input className="rounded-md border-gray-200 border-2 pl-8 w-5 h-5"/>
                        <TbLetterJ className="absolute top-1/2 transform -translate-y-1/2 left-2 text-blue-500 w-4 h-4" />
                      </div>
                    </div>
                    </div>
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
"use client";

import Link from "next/link";
import React, { useState } from "react";
import { BsPersonCircle } from "react-icons/bs";
import TableAttendance from "../../components/tableAttendance";
import { Header } from "../../components/header";
import { Sidebar } from "../../components/sidebar";
import { FaCheck, FaEye } from "react-icons/fa";
import { TbLetterR, TbLetterX, TbLetterJ } from "react-icons/tb";

export default function Attendance () {
  
  return (
    <div className="min-h-screen grid grid-cols-1 xl:grid-cols-6">
      <Sidebar />
      <div className="xl:col-span-5">
        <Header />

        <div className="h-[90vh] p-4 md:p-8 lg:p-12 w-full bg-neutral-100 space-y-5">
        <h1 className="text-[#0e324d] text-2xl sm:text-3xl lg:text-4xl pb-3 border-b-2 border-gray-400 w-full sm:w-3/4 lg:w-1/2 mb-4 font-inter font-semibold">
          Lista de Asistencia
        </h1>
        
        <div className="flex space-x-4">
          <div className="flex h-16 w-[30%] rounded-lg shadow-lg bg-white border-2 border-gray-300 p-4 mb-2 ml-10">
            <div className="flex items-center">
              <span className="font-inter font-medium text-xl text-green-500">Desarollo de Aplicaciones Web II</span>
            </div>
          </div>

          <div className="flex flex-col h-16 w-3/5 rounded-lg shadow-lg bg-white border-2 border-gray-300 p-4 mb-2">
          <div className="flex justify-center space-x-4">
            <div className="flex h-12 w-60 rounded-lg shadow-lg border-2 bg-neutral-200 border-green-500 mt-[-10px]">
              <div className="flex items-center">
                <BsPersonCircle className="w-7 h-7 text-gray-500 ml-2" /></div>
              <h1 className="text-custom-blue font-semibold text-lg font-inter ml-3 pt-2">25</h1>
              <span className="font-inter text-sm ml-5 pt-3">Aprendices Activos</span>
            </div>

            <div className="flex h-12 w-60 rounded-lg shadow-lg border-2 bg-neutral-200 border-green-500 mt-[-10px]">
              <div className="flex items-center">
                <BsPersonCircle className="w-7 h-7 text-gray-500 ml-1" /></div>
              <h1 className="text-custom-blue font-semibold text-lg font-inter ml-3 pt-2">4</h1>
              <span className="font-inter text-sm ml-5 pt-3">Aprendices en Deserción</span>
            </div>

            <div className="flex h-12 w-60 rounded-lg shadow-lg border-2 bg-neutral-200 border-green-500 mt-[-10px]">
              <div className="flex items-center">
                <BsPersonCircle className="w-7 h-7 text-gray-500 ml-2" /></div>
              <h1 className="text-custom-blue font-semibold text-lg font-inter ml-3 pt-2">3</h1>
              <span className="font-inter text-sm ml-5 pt-3">Aprendices Retirados</span>
            </div>
          </div>
        </div>
        </div>

      <div className="mt-6">
        <TableAttendance />
      </div>
            <div className="flex justify-end mb-2 mr-6">
            <div className="flex space-x-6">
              <div className="flex h-14 w-40 rounded-lg shadow-lg bg-white border-2 border-gray-300 text-custom-blue font-inter font-semibold text-2xl justify-center p-3"> 255873</div>
              <div className="flex h-14 flex-grow min-w-[400px] rounded-lg shadow-lg bg-white border-2 border-gray-300 text-custom-blue font-inter font-semibold text-xl justify-between p-4 space-x-6">
                <div className="flex items-center space-x-4">
                  <span className="font-inter text-base font-normal text-black">Asistencia</span>
                  <div className="relative flex items-center">
                    <input className="rounded-md border-gray-300 border-2 w-6 h-6 pr-6" readOnly />
                    <FaCheck className="absolute right-2 text-green-500 w-4 h-4" strokeWidth={4} />
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="font-inter text-base font-normal text-black">Retardo</span>
                  <div className="relative flex items-center">
                    <input className="rounded-md border-gray-300 border-2 w-6 h-6 pr-6" readOnly />
                    <TbLetterR className="absolute right-2 text-yellow-500 w-4 h-4" strokeWidth={4} />
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="font-inter text-base font-normal text-black">Inasistencia</span>
                  <div className="relative flex items-center">
                    <input className="rounded-md border-gray-300 border-2 w-6 h-6 pr-6" readOnly />
                    <TbLetterX className="absolute right-2 text-red-500 w-4 h-4" strokeWidth={4} />
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="font-inter text-base font-normal text-black">Justificación</span>
                  <div className="relative flex items-center">
                    <input className="rounded-md border-gray-300 border-2 w-6 h-6 pr-6" readOnly />
                    <TbLetterJ className="absolute right-2 text-blue-500 w-4 h-4" strokeWidth={4} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          </div>
      </div>
    </div>
  );
}
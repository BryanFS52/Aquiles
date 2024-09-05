"use client";

import Link from "next/link";
import React, { useState } from "react";
import { BsPersonCircle } from "react-icons/bs";
import TableAttendance from "../../components/tableAttendance";
import { Header } from "../../components/header";
import { Sidebar } from "../../components/sidebar";

export default function Attendance () {
  
  return (
    <div className="min-h-screen grid grid-cols-1 xl:grid-cols-6">
      <Sidebar />
      <div className="xl:col-span-5">
        <Header />

        <div className="h-[90vh] overflow-y-scroll p-4 md:p-8 lg:p-12 w-full bg-neutral-100 space-y-5">
        <h1 className="text-[#0e324d] text-2xl sm:text-3xl lg:text-4xl pb-3 border-b-2 border-gray-400 w-full sm:w-3/4 lg:w-1/2 mb-4 font-inter font-semibold">
          Lista de Asistencia
        </h1>
        <div className="flex space-x-4">
        <div className="flex h-16 w-[30%] rounded-lg shadow-lg bg-white border-2 border-gray-300 p-4 mb-2">
          <div className="flex items-center">
            <span className="font-inter font-medium text-xl text-green-500">Desarollo de Aplicaciones Web II</span>
          </div>
        </div>

        <div className="flex flex-col h-16 w-2/3 rounded-lg shadow-lg bg-white border-2 border-gray-300 p-4 mb-2">
        <div className="flex space-x-4 relative top-[-10px]"> 
          <div className="flex h-12 w-60 rounded-lg shadow-lg border-2 bg-neutral-200 border-green-500">
          <div className="flex items-center">
            <BsPersonCircle className="w-7 h-7 text-gray-500 ml-2"/>
            </div>
            <h1 className="text-custom-blue font-semibold text-lg font-inter ml-3 pt-2">25</h1>
            <span className="font-inter text-sm ml-5 pt-3">Aprendices Activos</span>
          </div>

          <div className="flex h-12 w-60 rounded-lg shadow-lg border-2 bg-neutral-200 border-green-500">
          <div className="flex items-center">
            <BsPersonCircle className="w-7 h-7 text-gray-500 ml-1"/>
            </div>
            <h1 className="text-custom-blue font-semibold text-lg font-inter ml-3 pt-2">4</h1>
            <span className="font-inter text-sm ml-5 pt-3">Aprendices en Deserción</span>
          </div>

          <div className="flex h-12 w-60 rounded-lg shadow-lg border-2 bg-neutral-200 border-green-500">
          <div className="flex items-center">
            <BsPersonCircle className="w-7 h-7 text-gray-500 ml-2"/>
            </div>
            <h1 className="text-custom-blue font-semibold text-lg font-inter ml-3 pt-2">3</h1>
            <span className="font-inter text-sm ml-5 pt-3">Aprendices Retirados</span>
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
  );
}

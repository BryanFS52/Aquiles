"use client";

import React from "react";
import { Header } from "../../components/header"; 
import { Sidebarcoordinador } from "../../components/SidebarCoordinador";
import { GoSearch } from "react-icons/go";
import { GrAttachment } from "react-icons/gr";
import Image from "next/image";
import persona from "../../../public/img/persona.jpg";
import { IoIosArrowForward } from "react-icons/io";
import { IoIosArrowBack } from "react-icons/io";

export default function Options() {
  return (
    <div className="min-h-screen grid grid-cols-1 xl:grid-cols-6 bg-gray-100">
      <Sidebarcoordinador />
      <div className="xl:col-span-5">
        <Header />

        <div className="container mx-auto p-6 space-y-8">
          <h1 className="text-4xl font-bold text-[#00324d] hover:text-[#01b001] transition-colors duration-300">
            Justificaciones de Aprendices
          </h1>

          <div className="relative mb-6 max-w-md">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <GoSearch className="text-gray-400" />
            </div>
            <input
              type="search"
              className="block w-full pl-10 pr-4 py-2 text-sm rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#01b001] transition-all duration-300"
              placeholder="Buscar aprendiz."
            />
          </div>

          {/* Tabla */}
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left text-gray-700 bg-white rounded-lg">
              <thead className="text-xs uppercase bg-gray-50 text-gray-600">
                <tr>
                  <th className="px-4 py-3">Pograma</th>
                  <th className="px-4 py-3">Ficha</th>
                  <th className="px-4 py-3">Foto</th>
                  <th className="px-4 py-3">Documento</th>
                  <th className="px-4 py-3">Aprendiz</th>
                  <th className="px-4 py-3">Fecha de Justificación</th>
                  <th className="px-4 py-3">Archivo Adjunto</th>
                  <th className="px-4 py-3">Estado</th>
                  
                </tr>
              </thead>
              <tbody>
                <tr className="border-b hover:bg-gray-50 transition-colors duration-200">
                <td className="px-4 py-3">Analisis y Desarollo de Software</td>
                <td className="px-4 py-3">25785784</td>
                  <td className="px-4 py-3">
                    <Image src={persona} alt="Persona" className="w-10 h-9 rounded-full" />
                  </td>
                  <td className="px-4 py-3">1015896552</td>
                  <td className="px-4 py-3">Juliana Valeria Lilian Tibocha Gutierrez</td>
                  <td className="px-4 py-3">12/02/2024</td>
                  <td className="px-4 py-3">
                    <GrAttachment className="w-5 h-5 text-[#01b001] hover:text-[#00324d] transition-colors duration-300" />
                  </td>
                  <td className="px-4 py-3">Activo</td>
                </tr>
                {/* Repetir las filas según sea necesario */}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col items-center pt-4 lg:pt-6 space-x-4">
            <div className="flex space-x-3 lg:space-x-4">
              <button
                type="button"
                className="flex items-center text-[#00324d] font-medium text-md lg:text-lg hover:text-[#01b001] transition-colors duration-300"
              >
                <IoIosArrowBack className="w-4 h-4 lg:w-5 lg:h-5" />
                Anterior
              </button>
              <button
                type="button"
                className="flex items-center text-[#00324d] font-medium text-md lg:text-lg hover:text-[#01b001] transition-colors duration-300"
              >
                Siguiente
                <IoIosArrowForward className="w-4 h-4 lg:w-5 lg:h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client"

import React from "react";
import { Header } from "../../components/header"; //importaciones del header y del sidebar para hacer el llamado
import { Sidebar } from "../../components/sidebar";
import { GoSearch } from "react-icons/go";
import { GrAttachment } from "react-icons/gr";
import Image from "next/image";
import persona from "../../../public/img/persona.jpg";
import { IoIosArrowForward } from "react-icons/io";
import { IoIosArrowBack } from "react-icons/io";

export default function Options() {
  return (
    <div className="min-h-screen grid grid-cols-1 xl:grid-cols-6">
      <Sidebar />
      <div className="xl:col-span-5">
        <Header />

        <div className="h-[90vh] overflow-y-scroll p-4 md:p-6 lg:p-8 xl:p-10 mx-auto max-w-screen-lg">
          <h1 className="text-2xl md:text-3xl lg:text-4xl pb-3 border-b-2 border-gray-400 mb-8 lg:mb-10 font-serif">
            Justificaciones Ficha 2630197
          </h1>
          
          <div className="relative mb-6 max-w-md">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <GoSearch className="text-gray-400" />
            </div>
            <input
              type="search"
              className="block w-full pl-10 pr-4 text-sm rounded-lg border-2 border-slate-300 focus:outline-none focus:border-slate-300"
              placeholder="Buscar aprendiz."
            />
          </div>

          {/* Tabla */}
          <div className="relative overflow-x-auto">
            <table className="w-full text-sm text-left text-black">
              <thead className="text-xs uppercase bg-gray-50 dark:bg-custom-blue dark:text-white border-2 border-gray-500">
                <tr>
                  <th className="px-3 py-2">Foto</th>
                  <th className="px-3 py-2">Documento</th>
                  <th className="px-3 py-2">Aprendiz</th>
                  <th className="px-3 py-2">Fecha de Justificación</th>
                  <th className="px-3 py-2">Archivo Adjunto</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-white border-2 border-gray-400">
                  <td className="px-3 py-2">
                    <Image src={persona} alt="" className="w-10 h-9" />
                  </td>
                  <td className="px-3 py-2">10158962</td>
                  <td className="px-3 py-2">Juliana Valeria Lilian Tibocha Gutierrez</td>
                  <td className="px-3 py-2">12/02/2024</td>
                  <td className="px-3 py-2">
                    <GrAttachment className="w-5 h-5" />
                  </td>
                </tr>
                {/* Repetir las filas según sea necesario */}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col items-center pt-4 lg:pt-6">
            <div className="flex space-x-3 lg:space-x-4">
              <button
                type="button"
                className="text-custom-blue font-medium flex items-center font-serif text-md lg:text-lg"
              >
                <IoIosArrowBack className="text-custom-blue w-4 h-4 lg:w-5 lg:h-5" />
                Anterior
              </button>
              <button
                type="button"
                className="text-custom-blue font-medium flex items-center font-serif text-md lg:text-lg"
              >
                Siguiente
                <IoIosArrowForward className="text-custom-blue w-4 h-4 lg:w-5 lg:h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
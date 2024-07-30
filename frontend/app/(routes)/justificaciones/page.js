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

        <div className="h-[90vh] overflow-y-scroll p-12 inline-block w-full">
          <h1 className="text-4xl pb-3 border-b-2 border-gray-400 w-1/2 mb-12 font-serif"> Justificaciones Ficha 2630197</h1>
          <div className="relative ml-32">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <GoSearch className="text-gray-400" />
            </div>
                <input type="search" className="h-7 block w-52 pl-10 pr-4 text-sm rounded-lg dark:bg-white border-2 border-slate-300 dark:placeholder-gray-400 dark:text-black focus:outline-none focus:border-slate-300" placeholder="Buscar aprendiz." />
            </div><br/>

            {/* Tabla */}

            <div className="relative overflow-x-auto w-5/6 mx-auto">
            <table className="w-full text-sm text-left rtl:text-right text-white">
            <thead className="text-xs text-white uppercase bg-gray-50 dark:bg-custom-blue dark:text-white border-2 border-gray-500">
            <tr>
                <th className="px-6 py-3">Foto</th>
                <th className="px-6 py-3">Documento</th>
                <th className="px-6 py-3">Aprendiz</th>
                <th className="px-6 py-3">Fecha de Justificación</th>
                <th className="px-6 py-3">Archivo Adjunto</th>
            </tr>
            </thead>
            <tbody>
            <tr className="bg-white border-2 border-gray-400">
                <td className="px-6 py-4 text-black">
                    <Image src={persona} alt="" className="w-11 h-10" />
                </td>
                <td className="px-6 py-4 text-black">10158962</td>
                <td className="px-6 py-4 text-black">Juliana Valeria Lilian Tibocha Gutierrez</td>
                <td className="px-6 py-4 text-black">12/02/2024</td>
                <td className="px-6 py-4 text-black">
                    <GrAttachment className="w-6 h-6" />
                </td>
            </tr>
            <tr className="bg-white border-2 border-gray-400">
                <td className="px-6 py-4 text-black">
                    <Image src={persona} alt="" className="w-11 h-10" />
                </td>
                <td className="px-6 py-4 text-black">10158962</td>
                <td className="px-6 py-4 text-black">Juliana Valeria Lilian Tibocha Gutierrez</td>
                <td className="px-6 py-4 text-black">12/02/2024</td>
                <td className="px-6 py-4 text-black">
                    <GrAttachment className="w-6 h-6" />
                </td>
            </tr>
            </tbody>
            </table>
            </div>
            <div className="flex pt-96 justify-center">
                <button type="button" className="text-custom-blue font-medium flex items-center font-serif text-lg">
                <IoIosArrowBack  className="text-custom-blue ml-2 w-5 h-4" />
                    Anterior
                </button>

                <button type="button" className="text-custom-blue font-medium flex items-center ml-32 font-serif text-lg">
                    Siguiente
                    <IoIosArrowForward className="text-custom-blue ml-2 w-5 h-4" />
                </button>
            </div>
        </div>
      </div>
    </div>
  );
}

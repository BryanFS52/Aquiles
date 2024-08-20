"use client"

import React from "react";
import { Header } from "../../components/header"; //importaciones del header y del sidebar para hacer el llamado
import { Sidebaraprendiz } from "../../components/sidebaraprendiz";
import { IoIosArrowDown } from "react-icons/io";

export default function Justificacionaaprendiz() {
    return (
      <div className="min-h-screen grid grid-cols-1 xl:grid-cols-6">
        <Sidebaraprendiz />
        <div className="xl:col-span-5">
          <Header />

          <div className="h-[90vh] overflow-y-scroll p-12 inline-block w-full">
          <h1 className="text-[#0e324d] text-2xl sm:text-3xl lg:text-4xl pb-3 border-b-2 border-gray-400 w-full sm:w-3/4 lg:w-1/2 mb-6 lg:mb-12 font-inter font-semibold">Cargar Justificación</h1>


          <div className="flex items-center justify-center bg-gray-100 py-12 w-3/4 ml-40">

      <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl w-full">
        <h2 className="text-[#0e324d] font-inter font-semibold text-xl sm:text-3xl text-center mb-10">Justifica Aqui tu Inasistencia</h2>
        <form className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col">
              <label className="font-inter font-semibold text-[#0e324d] text-sm sm:text-base">Tipo de novedad</label>
              <div className="relative">
                <input type="search" className="h-10 block w-80 pl-3 pr-10 text-base text-left font-serif rounded-lg bg-zinc-200 border-2 border-zinc-300 focus:outline-none focus:border-slate-300" placeholder="Novedad"/>
                <div className="absolute inset-y-0 right-0 flex items-center pr-24 pointer-events-none">
                  <IoIosArrowDown className="text-black" />
                </div>
              </div>
            </div>

            <div className="flex flex-col">
              <label className="font-inter font-semibold text-[#0e324d] text-sm sm:text-base">Nombre del aprendiz</label>
              <input type="search" className="h-10 block w-96 pl-3 pr-10 text-sm text-left font-inter rounded-lg bg-zinc-200 border-2 border-zinc-300 focus:outline-none focus:border-slate-300" placeholder="Escriba su nombre"/>
            </div>

            <div className="flex flex-col">
              <label className="font-inter font-semibold text-[#0e324d] text-sm sm:text-base">Número de documento</label>
              <input type="search" className="h-10 block w-80 pl-3 pr-10 text-sm text-left font-inter rounded-lg bg-zinc-200 border-2 border-zinc-300 focus:outline-none focus:border-slate-300" placeholder="Identificación"/>
            </div>

            <div className="flex flex-col">
              <label className="font-inter font-semibold text-[#0e324d] text-sm sm:text-base">Nombre del programa</label>
              <input type="search" className="h-10 block w-96 pl-3 pr-10 text-sm text-left font-inter rounded-lg bg-zinc-200 border-2 border-zinc-300 focus:outline-none focus:border-slate-300" placeholder="Seleccione el programa"/>
            </div>

            <div className="flex flex-col">
              <label className="font-inter font-semibold text-[#0e324d] text-sm sm:text-base">Número de ficha</label>
              <input type="search" className="h-10 block w-80 pl-3 pr-10 text-sm text-left font-inter rounded-lg bg-zinc-200 border-2 border-zinc-300 focus:outline-none focus:border-slate-300" placeholder="Digite el numero de ficha"/>
            </div>

            <div className="flex flex-col">
              <label className="font-inter font-semibold text-[#0e324d] text-sm sm:text-base">Agregar Justificación</label>
              <button className="h-10 w-96 bg-gray-200 text-gray-700 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-slate-300">
              Selecciona un archivo
              </button>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <label className="font-inter font-semibold text-[#0e324d] text-sm sm:text-base">Firma del aprendiz</label>
            <button className="h-10 w-56 bg-gray-200 text-gray-700 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-slate-300">
            Selecciona un archivo
            </button>
          </div>

          <div className="flex justify-between mt-8">
            <button className="h-10 w-32 bg-gray-300 text-gray-700 rounded-lg border-2 border-neutral-400 focus:outline-none focus:border-slate-300">
              Cancelar
            </button>
            <button className="h-10 w-32 bg-custom-blue text-white rounded-lg border-2 border-custom-blue focus:outline-none focus:border-slate-300">
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
          </div>

          </div>
          </div>
    );
}
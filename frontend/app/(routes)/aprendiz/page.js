import React from "react";
import { Header } from "../../components/header";
import { Sidebaraprendiz } from "../../components/SidebarAprendiz";
import { GiTakeMyMoney } from "react-icons/gi";
import { LiaLanguageSolid } from "react-icons/lia";
import { FaComputer } from "react-icons/fa6";
import { FaPeopleCarry } from "react-icons/fa";

export default function Aprendiz() {
  return (
    <div className="min-h-screen grid grid-cols-1 xl:grid-cols-6">
      <Sidebaraprendiz />
      <div className="xl:col-span-5">
        <Header />

        <div className="h-[90vh] overflow-y-scroll p-4 xl:p-12 w-full">
        <h1 className="text-[#0e324d] text-2xl sm:text-3xl lg:text-4xl pb-3 border-b-2 border-gray-400 w-full sm:w-3/4 lg:w-1/2 mb-6 lg:mb-12 font-inter font-semibold">Mis Cursos</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-5 xl:ml-40">
            {/* Card 1 */}
            <div className="flex w-full xl:w-96 h-52 rounded-lg overflow-hidden shadow-lg bg-zinc-200 relative p-4">
              <div className="z-50 space-y-2">
                <span className="font-inter text-lg">Nombre del Curso:</span>
                <p className="font-inter text-black-700 text-sm">Gestión Empresarial</p>
                <span className="font-inter text-lg">Modalidad:</span>
                <p className="font-inter text-black-700 text-sm">Presencial</p>
              </div>
              <GiTakeMyMoney className="z-50 text-5xl text-white ml-auto w-20 xl:w-40" />
              <div className="absolute top-0 right-0 w-0 h-0 border-t-[100px] xl:border-t-[130px] border-t-cyan-900 border-l-[150px] xl:border-l-[240px] border-l-transparent -z-1"></div>
            </div>

            {/* Card 2 */}
            <div className="flex w-full xl:w-96 h-52 rounded-lg overflow-hidden shadow-lg bg-zinc-200 relative p-4">
              <div className="z-50 space-y-2">
                <span className="font-inter text-lg">Nombre del Curso:</span>
                <p className="text-black-700 text-sm">Inglés</p>
                <span className="font-inter text-lg">Modalidad:</span>
                <p className="text-black-700 text-sm">Virtual</p>
              </div>
              <LiaLanguageSolid className="z-50 text-5xl text-white ml-auto w-20 xl:w-40" />
              <div className="absolute top-0 right-0 w-0 h-0 border-t-[100px] xl:border-t-[130px] border-t-cyan-900 border-l-[150px] xl:border-l-[240px] border-l-transparent -z-1"></div>
            </div>

            {/* Card 3 */}
            <div className="flex w-full xl:w-96 h-52 rounded-lg overflow-hidden shadow-lg bg-zinc-200 relative p-4">
              <div className="z-50 space-y-2">
                <span className="font-serif text-lg">Nombre del Curso:</span>
                <p className="text-black-700 text-sm">Programación</p>
                <span className="font-serif text-lg">Modalidad:</span>
                <p className="text-black-700 text-sm">Virtual</p>
              </div>
              <FaComputer className="z-50 text-5xl text-white ml-auto w-20 xl:w-40" />
              <div className="absolute top-0 right-0 w-0 h-0 border-t-[100px] xl:border-t-[130px] border-t-cyan-900 border-l-[150px] xl:border-l-[240px] border-l-transparent -z-1"></div>
            </div>

            {/* Card 4 */}
            <div className="flex w-full xl:w-96 h-52 rounded-lg overflow-hidden shadow-lg bg-zinc-200 relative p-4">
              <div className="z-50 space-y-2">
                <span className="font-serif text-lg">Nombre del Curso:</span>
                <p className="text-black-700 text-sm">Recursos Humanos</p>
                <span className="font-serif text-lg">Modalidad:</span>
                <p className="text-black-700 text-sm">Presencial</p>
              </div>
              <FaPeopleCarry className="z-50 text-5xl text-white ml-auto w-20 xl:w-40" />
              <div className="absolute top-0 right-0 w-0 h-0 border-t-[100px] xl:border-t-[130px] border-t-cyan-900 border-l-[150px] xl:border-l-[240px] border-l-transparent -z-1"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

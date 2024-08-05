import React from "react";
import { Header } from "../../components/header"; 
import { Sidebaraprendiz } from "../../components/sidebaraprendiz";//importaciones del header y del sidebar para hacer el llamado
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

        <div className="h-[90vh] overflow-y-scroll p-12 inline-block w-full">
          <h1 className="text-4xl pb-3 border-b-2 border-gray-400 w-1/2 mb-12 font-serif"> Mis Cursos</h1>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 ml-40 py-5">
          <div className=" flex w-96 h-52 rounded-lg overflow-hidden shadow-lg bg-zinc-200 relative mb-4 p-4 ">
              <div className=" z-50 justify-end p-4  space-y-4">
                <div className="space-y-2">
                  <span className="font-serif text-lg font-medium ">Nombre del Curso:</span>
                  <p className="text-black-700 text-sm">Gestión Empresarial</p>
                </div>
                <div className="font-serif text-xl space-y-2">
                  <span className="font-serif text-lg font-medium">Modalidad:</span>
                  <p className="text-black-700 text-sm">Presencial</p>
                </div>
              </div>
              <GiTakeMyMoney className="z-50 text-5xl text-white ml-auto w-40" />
              <div className="absolute top-0 right-0 w-0 h-0 border-t-[130px] border-t-cyan-900 border-l-[240px] border-l-transparent -z-1"></div>
            </div>

            <div className=" flex w-96 h-52 rounded-lg overflow-hidden shadow-lg bg-zinc-200 relative mb-4 p-4 ">
              <div className=" z-50 justify-end p-4  space-y-4">
                <div className="space-y-2">
                  <span className="font-serif text-lg font-medium ">Nombre del Curso:</span>
                  <p className="text-black-700 text-sm">Inglés</p>
                </div>
                <div className="font-serif text-xl space-y-2">
                  <span className="font-serif text-lg font-medium">Modalidad:</span>
                  <p className="text-black-700 text-sm">Virtual</p>
                </div>
              </div>
              <LiaLanguageSolid  className="z-50 text-5xl text-white ml-auto w-40" />
              <div className="absolute top-0 right-0 w-0 h-0 border-t-[130px] border-t-cyan-900 border-l-[240px] border-l-transparent -z-1"></div>
            </div>

            <div className="flex w-96 h-52 rounded-lg overflow-hidden shadow-lg bg-zinc-200 relative mb-4 p-4">
              <div className=" z-50 justify-end p-4  space-y-4">
                <div className="space-y-2">
                  <span className="font-serif text-lg font-medium ">Nombre del Curso:</span>
                  <p className="text-black-700 text-sm">Programación</p>
                </div>
                <div className="font-serif text-xl space-y-2">
                  <span className="font-serif text-lg font-medium">Modalidad:</span>
                  <p className="text-black-700 text-sm">Virtual</p>
                </div>
              </div>
              <FaComputer className="z-50 text-5xl text-white ml-auto w-40" />
              <div className="absolute top-0 right-0 w-0 h-0 border-t-[130px] border-t-cyan-900 border-l-[240px] border-l-transparent -z-1"></div>
            </div>

            <div className=" flex w-96 h-52 rounded-lg overflow-hidden shadow-lg bg-zinc-200 relative mb-4 p-4 ">
              <div className=" z-50 justify-end p-4  space-y-4">
                <div className="space-y-2">
                  <span className="font-serif text-lg font-medium ">Nombre del Curso:</span>
                  <p className="text-black-700 text-sm">Recursos Humanos</p>
                </div>
                <div className="font-serif text-xl space-y-2">
                  <span className="font-serif text-lg font-medium">Modalidad:</span>
                  <p className="text-black-700 text-sm">Presencial</p>
                </div>
              </div>
              <FaPeopleCarry  className="z-50 text-5xl text-white ml-auto w-40" />
              <div className="absolute top-0 right-0 w-0 h-0 border-t-[130px] border-t-cyan-900 border-l-[240px] border-l-transparent -z-1"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

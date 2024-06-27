import React from "react";
import { Header } from "@/app/components/header"; //importaciones del header y del sidebar para hacer el llamado
import { Sidebar } from "@/app/components/sidebar";
import { FaArrowRightLong } from "react-icons/fa6";
import { BsPersonCheck } from "react-icons/bs";
import { PiStudentFill } from "react-icons/pi";
import { HiUserGroup } from "react-icons/hi2";

export default function Options() {
  return (
    <div className="min-h-screen grid grid-cols-1 xl:grid-cols-6">
      <Sidebar />
      <div className="xl:col-span-5">
        <Header />
        <div className="h-[90vh] overflow-y-scroll p-12 inline-block w-full">
          <h1 className="text-4xl pb-3 border-b-2 border-gray-400 w-1/2 mb-12">Estos son los programas actuales </h1>
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 ml-32 py-7">
            <div className="h-60 rounded-lg overflow-hidden shadow-lg bg-zinc-200 relative">
              <div className="px-6 py-4 flex z-50 justify-end translate-y-14 relative">
                <BsPersonCheck className="z-50 absolute top-[-40px] right-3 text-white box-border h-10 w-10" />
                <FaArrowRightLong className="z-50 absolute top-[-40px] right-14 text-white box-border h-10 w-10" />
                <span className="absolute top-0 left-0 px-10 py-3 text-black font-serif text-xl font-semibold ">Asistencia</span>
              </div>
              <div className="absolute top-0 right-0 w-0 h-0 border-t-[130px] border-t-cyan-900 border-l-[240px] border-l-transparent z-0"></div>
              <div className="font-serif text-sm mb-4 inline-block align-baseline relative py-24">
                <span className="font-serif text-sx ml-12 ms-10">Revisa aquí las asistencias de tus equipos.</span>
              </div>
            </div>

            <div className="h-60 rounded-lg overflow-hidden shadow-lg bg-zinc-200 relative ml-2 left-52">
              <div className="px-6 py-4 flex z-50 justify-end translate-y-14 relative">
                <PiStudentFill className="z-50 absolute top-[-40px] right-3 text-white box-border h-10 w-10" />
                <FaArrowRightLong className="z-50 absolute top-[-40px] right-14 text-white box-border h-10 w-10" />
                <span className="absolute top-0 left-0 px-10 py-3 text-black font-serif text-xl font-semibold ">Aprendices</span>
              </div>
              <div className="absolute top-0 right-0 w-0 h-0 border-t-[130px] border-t-cyan-900 border-l-[240px] border-l-transparent z-0"></div>
              <div className="font-serif text-sm mb-4 inline-block align-baseline relative py-24">
                <span className="font-serif text-sx mb-2 z-10 ml-12 ms-10">Gestiona aquí la asistencia de tus aprendices.</span>
              </div>
            </div>
            </div><br/>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 ml-32 py-14 left-52">
            <div className="h-60 rounded-lg overflow-hidden shadow-lg bg-zinc-200 relative ">
              <div className="px-6 py-4 flex z-50 justify-end translate-y-14 relative">
                <HiUserGroup className="z-50 absolute top-[-40px] right-3 text-white box-border h-10 w-10" />
                <FaArrowRightLong className="z-50 absolute top-[-40px] right-14 text-white box-border h-10 w-10" />
                <span className="absolute top-0 left-0 px-10 py-3 text-black font-serif text-xl font-semibold ">Teams</span>
              </div>
              <div className="absolute top-0 right-0 w-0 h-0 border-t-[130px] border-t-cyan-900 border-l-[240px] border-l-transparent z-0"></div>
              <div className="font-serif text-sm mb-4 inline-block align-baseline relative py-24">
                <span className="font-serif text-sx mb-2 z-10 ml-12 ms-10">Gestiona aquí tus equipos de desarrollo.</span>
              </div>
            </div>
            </div>
        </div>
      </div>
    </div>
  );
}

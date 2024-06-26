import React from "react";
import { Header } from "@/app/components/header"; //importaciones de los componentes header y sidebar para no tener que volver a crearlos
import { Sidebar } from "@/app/components/sidebar";
import { FaArrowRightLong } from "react-icons/fa6";
import { BsPersonCheck } from "react-icons/bs";

export default function Options (){
    return(
        <div className="min-h-screen grid grid-cols-1 xl:grid-cols-6">
            <Sidebar />
            <div className="xl:col-span-5">
                <Header />

                <div className="h-[90vh] overflow-y-scroll p-12 inline-block w-full relative">
            <h1 className="text-4xl pb-3 border-b-2 border-gray-400 w-1/2">Estos son los programas actuales</h1>
            <br/><br/>

            <div className="grid grid-cols-3 gap-4 mt-8 px-16">
                <div className="w-full h-60 rounded-lg overflow-hidden shadow-lg bg-zinc-200 relative mb-4">
                  <div className="absolute top-0 right-0 w-0 h-0 border-t-[130px] border-t-cyan-900 border-l-[240px] border-l-transparent -z-1"></div>
                  <div className="px-6 py-4">
                    <div className="flex mb-4 align-baseline relative">
                    <span className="font-serif text-xl mb-2 z-10 font-semibold">Asistencia</span>
                    </div>
                    <div className="flex justify-end">
                        <FaArrowRightLong className="z-50" />
                        <BsPersonCheck className="z-50"/>
                        </div>
                    <br /><br/>
                    <div className="font-serif text-sm mb-4 inline-block align-baseline relative">
                        <span className="font-serif text-sx mb-2 z-10 ">Revisa aquí las asistencias de tus equipos.</span>
                    </div>
                    <br />

                  </div>
                </div>
            </div>
        
          </div>
                </div>
                </div>
    );
}
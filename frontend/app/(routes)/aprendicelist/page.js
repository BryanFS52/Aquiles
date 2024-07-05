import React from "react";
import { Header } from "@/app/components/header"; //importaciones de los componentes header y sidebar para no tener que volver a crearlos
import { Sidebar } from "@/app/components/sidebar";
import { PiStudentFill } from "react-icons/pi";

export default function Aprendiceslist () {
    return(

        <div className="min-h-screen grid grid-cols-1 xl:grid-cols-6">
        <Sidebar />
        <div className="xl:col-span-5">
          <Header />

          <div>
        <div className="h-[90vh] overflow-y-scroll p-12 inline-block w-full relative bg-neutral-100 space-y-5 ">
          <h1 className="font-serif text-4xl pb-3 border-b-2 border-black w-80">Lista de Asistencia</h1>
            <div className="flex px-9 space-x-24">

            <div className=" flex w-96 h-48 rounded-lg overflow-hidden shadow-lg bg-white border-2 border-gray-300 relative mb-4 p-4 ">
                  <div className="z-50 justify-end space-y-3">
                  <PiStudentFill className="w-9 h-9 text-stone-600 ml-6"/><br/>

                  <div>
                    <span className="text-5xl font-semibold font-kiwi-marumaru ml-6">25</span><br/><br/>
                    <span className="font-serif text-lg font-normal ">Aprendices de la ficha</span>
                  </div>
                </div>
              </div>

              <div className=" flex w-96 h-48 rounded-lg overflow-hidden shadow-lg bg-white border-2 border-gray-300 relative mb-4 p-4 ">
                  <div className="z-50 justify-end space-y-3">
                  <PiStudentFill className="w-9 h-9 text-stone-600 ml-6"/><br/>

                  <div>
                    <span className="text-5xl font-semibold font-kiwi-marumaru ml-6">20</span><br/><br/>
                    <span className="font-serif text-lg font-normal ">Aprendices en clase</span>
                  </div>
                </div>
              </div>

              <div className=" flex w-96 h-48 rounded-lg overflow-hidden shadow-lg bg-white border-2 border-gray-300 relative mb-4 p-4 ">
                  <div className="z-50 justify-end space-y-3">
                  <PiStudentFill className="w-9 h-9 text-stone-600 ml-6"/><br/>

                  <div>
                    <span className="text-5xl font-semibold font-kiwi-marumaru ml-6">5</span><br/><br/>
                    <span className="font-serif text-lg font-normal ">Aprendices que fallaron</span>
                  </div>
                </div>
              </div>
                </div>
                <div className="flex w-2/3 h-96 rounded-lg overflow-hidden shadow-lg bg-white border-2 border-gray-300 relative ml-44 p-4 ">
                    <div className="z-50 justify-end space-y-3">
                    </div>
                </div>
                </div>
                </div>
          </div>
          </div>
    
    );
}
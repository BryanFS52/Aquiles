import React from "react";
import { Header } from "@/app/components/header"; // importaciones del header y del sidebar para hacer el llamado
import { Sidebar } from "@/app/components/sidebar";
import { TbArrowBigRight } from "react-icons/tb";

export default function Options() {
  return (
    <div className="min-h-screen grid grid-cols-1 xl:grid-cols-6">
      <Sidebar />
      <div className="xl:col-span-5">
        <Header />

        <div className="h-[90vh] overflow-y-scroll p-4 sm:p-6 lg:p-12 inline-block w-full">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl pb-3 border-b-2 border-gray-400 w-full sm:w-3/4 lg:w-1/2 mb-6 lg:mb-12 font-serif">
            Fichas Asignadas{" "}
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 ml-0 sm:ml-4 lg:ml-8 py-4 sm:py-6 lg:py-7">
            {Array(6)
              .fill(0)
              .map((_, index) => (
                <div
                  key={index}
                  className="flex w-full sm:w-80 lg:w-96 h-52 rounded-lg overflow-hidden shadow-lg bg-zinc-200 relative mb-4 p-4"
                >
                  <div className="z-50 justify-end p-4 space-y-4">
                    <div className="space-y-2">
                      <span className="font-serif text-xl sm:text-2xl">Fichas</span>
                      <p className="text-black-700 text-sm sm:text-base">2689789</p>
                    </div>
                    <div className="font-serif text-lg sm:text-xl space-y-2">
                      <span className="text-xl sm:text-2xl">Programa</span>
                      <p className="text-black-700 text-sm sm:text-base">ADSO</p>
                    </div>
                  </div>
                  <TbArrowBigRight className="z-50 text-4xl sm:text-5xl text-white ml-auto" />

                  <div className="absolute top-0 right-0 w-0 h-0 border-t-[100px] sm:border-t-[130px] border-t-cyan-900 border-l-[180px] sm:border-l-[240px] border-l-transparent -z-1"></div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

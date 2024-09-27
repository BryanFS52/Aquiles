"use client"

import React from "react";
import { Header } from "../../components/header"; //importaciones del header y del sidebar para hacer el llamado
import { Sidebaraprendiz } from "../../components/sidebaraprendiz";
import Image from 'next/image';
import aquiles from "../../../public/img/aquiles.jpg";
//import { HiOutlineIdentification } from "react-icons/hi";//

export default function TeamScrum() {
  return (
    <div className="min-h-screen grid grid-cols-1 xl:grid-cols-6">
      <Sidebaraprendiz />
      <div className="xl:col-span-5">
        <Header />
        <div className="h-[90vh] overflow-y-scroll p-12 inline-block w-full">
          <h1 className="text-[#0e324d] text-2xl sm:text-3xl lg:text-4xl pb-3 border-b-2 border-gray-400 w-full sm:w-3/4 lg:w-1/2 mb-6 lg:mb-12 font-inter font-semibold">Mi Team Scrums</h1>
          <div className="flex items-center w-full">
          <div className="w-[37%] h-44 bg-white p-6 rounded-lg shadow-md border-2 border-gray-200 flex items-center">
            <div className="flex items-center">
              <div className="w-36 h-36 relative overflow-hidden mr-4">
                <Image src={aquiles} alt="Team Logo" className="rounded-full object-cover w-full h-full" />
              </div>
              <div className="ml-4">
                <h1 className="text-2xl font-inter font-semibold text-center text-green-500">Aquiles Team</h1>
              </div>
            </div>
          </div>

          <div className="pb-20 w-[60%] ml-5">
          <div className="flex-1 h-24 bg-white p-6 rounded-lg shadow-md border-2 border-gray-200 flex items-center ml-2">
            <h1 className="text-green-500 font-inter text-xl font-medium mr-4">Número del Team:</h1>
            <h1 className="text-green-500 font-inter text-xl font-medium ml-32">Ficha:</h1>
            <h1 className="text-green-500 font-inter text-xl font-medium ml-32">Trimestre:</h1>
          </div>
          </div>
        </div>
          <div className="pt-3">
            <h1 className="font-inter text-2xl font-semibold text-custom-blue">Aprendices del Team Scrum:</h1>
          </div>

          <div className="flex justify-star pt-2">
            <div className="w-[18%] h-44 mx-2 bg-white p-6 rounded-lg shadow-md border-2 border-gray-200 flex flex-col items-center">
              <h1 className="text-xl font-inter font-semibold text-center text-green-500">Aprendiz</h1>
              <span className="text-sm font-inter">Angie Carolina Gutiérrez Ramírez</span>
              <div className="pt-3">
              <button className="bg-custom-blue border-2 border-custom-blue rounded-lg text-white w-44 h-11">Ver Más Información</button>
              </div>
            </div>

            <div className="w-[18%] h-44 mx-2 bg-white p-6 rounded-lg shadow-md border-2 border-gray-200 flex flex-col items-center">
              <h1 className="text-xl font-inter font-semibold text-center text-green-500">Aprendiz</h1>
              <span className="text-sm font-inter">Juan Carlos López García</span>
              <div className="pt-3">
              <button className="bg-custom-blue border-2 border-custom-blue rounded-lg text-white w-44 h-11">Ver Más Información</button>
              </div>
            </div>
          </div>

          <div className="flex justify-star pt-4">
            <div className="w-[18%] h-44 mx-2 bg-white p-6 rounded-lg shadow-md border-2 border-gray-200 flex flex-col items-center">
              <h1 className="text-xl font-inter font-semibold text-center text-green-500">Aprendiz</h1>
              <span className="text-sm font-inter">Santiago Gómez Rodríguezz</span>
              <div className="pt-3">
              <button className="bg-custom-blue border-2 border-custom-blue rounded-lg text-white w-44 h-11">Ver Más Información</button>
              </div>
            </div>

            <div className="w-[18%] h-44 mx-2 bg-white p-6 rounded-lg shadow-md border-2 border-gray-200 flex flex-col items-center">
              <h1 className="text-xl font-inter font-semibold text-center text-green-500">Aprendiz</h1>
              <span className="text-sm font-inter">María Teresa González Yepes</span>
              <div className="pt-3">
              <button className="bg-custom-blue border-2 border-custom-blue rounded-lg text-white w-44 h-11">Ver Más Información</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
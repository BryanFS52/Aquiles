"use client";

import React, {useState} from "react";
import { Header } from "../../components/header"; //importaciones del header y del sidebar para hacer el llamado
import { downloadReportPDF } from "../../services/PDFService";
import { IoIosArrowDown } from "react-icons/io";
import { Sidebaraprendiz } from "../../components/SidebarAprendiz";
import ChecklistAprendices from "../../components/ChecklistAprendices";
import { BiX, BiCheck } from "react-icons/bi";

export default function ListaChequeo() {
    
    return (
        <div className="min-h-screen grid grid-cols-1 xl:grid-cols-6">
            <Sidebaraprendiz />
            <div className="xl:col-span-5">
                <Header />
                <div className="text-custom-blue font-bold text-2xl ml-10 py-6 border-b-2 border-gray-400 w-full sm:w-3/5 lg:w-2/5 mb-5 lg:mb-8">
                Lista de Chequeo Cierre de Trimestre 3-2024
                </div>
                <div className="flex space-x-3 mt-10 mb-1">
                    <div className="w-52 h-52 rounded-lg overflow-hidden shadow-lg bg-white border-2 border-gray-200 relative p-4 ml-52">
                        <h1 className="font-inter text-xl text-green-500 font-semibold pb-2">Centro de formación:</h1>
                        <span className="font-inter text-base text-custom-blue font-medium">Centro de Servicios Financieros</span>
                    </div>
                    <div className="flex flex-col">
                        <div className="w-44 h-15 rounded-lg overflow-hidden shadow-lg bg-white border-2 border-gray-200 relative p-4 mb-3">
                            <h1 className="font-inter text-xl text-green-500 font-semibold pb-2">Ficha:</h1>
                            <span className="font-inter text-base text-custom-blue font-medium">2839834</span>
                        </div>
                        <div className="w-44 h-15 rounded-lg overflow-hidden shadow-lg bg-white border-2 border-gray-200 relative p-4 mb-3">
                            <h1 className="font-inter text-xl text-green-500 font-semibold pb-2">Trimestre:</h1>
                            <span className="font-inter text-base text-custom-blue font-medium">Quinto</span>
                        </div>
                    </div>
                    <div className="flex flex-col space y-4">
                        <div className="w-44 h-15 rounded-lg overflow-hidden shadow-lg bg-white border-2 border-gray-200 relative p-4 mb-3">
                            <h1 className="font-inter text-xl text-green-500 font-semibold pb-2">Team Scrum:</h1>
                            <span className="font-inter text-base text-custom-blue font-medium">Número 3</span>
                        </div>
                        <div className="w-44 h-15 rounded-lg overflow-hidden shadow-lg bg-white border-2 border-gray-200 relative p-4 mb-3">
                            <h1 className="font-inter text-xl text-green-500 font-semibold pb-2">Jornada:</h1>
                            <span className="font-inter text-base text-custom-blue font-medium">Diurna</span>
                        </div>
                    </div>
                    <div className="flex flex-col space y-4">
                        <div className="w-60 h-15 rounded-lg overflow-hidden shadow-lg bg-white border-2 border-gray-200 relative p-4 mb-3">
                            <h1 className="font-inter text-xl text-green-500 font-semibold pb-2">Fecha:</h1>
                            <span className="font-inter text-base text-custom-blue font-medium">05/02/2024 - 05/02/2024</span>
                        </div>
                        <div className="w-60 h-15 rounded-lg overflow-hidden shadow-lg bg-white border-2 border-gray-200 relative px-4 pt-4">
                            <h1 className="font-inter text-xl text-green-500 font-semibold pb-1">Indicador:</h1>
                            




                        </div>
                    </div>
                    <div className="flex justify-end">
                        <div className="w-52 h-28 bg-white border-2 border-gray-200 p-4 rounded-lg shadow-md">
                            <h2 className="text-gray-700 text-sm font-bold mb-2 text-center">Exportar lista de chequeo como:</h2>
                            <div className="flex space-x-2 mb-4">
                                <button type="button"  className="w-full bg-custom-blue font-bold py-2 px-4 rounded text-white focus:outline-none focus:shadow-outline">
                                    PDF
                                </button>
                                <button className="w-full bg-custom-blue font-bold py-2 px-4 rounded text-white focus:outline-none focus:shadow-outline">
                                    Excel
                                </button>
                            </div>
                            <div className="w-44 h-20 bg-white border border-gray-200 p-4 rounded-lg shadow-md mr-10">
                                <h2 className="text-gray-700 text-sm font-bold mb-2">Indicaciones de uso:</h2>
                                <div className="flex space-x-7 items-center">
                                    <div className="flex items-center space-x-1">
                                        <span className="ml-2">Si</span>
                                         <BiCheck className="text-green-500 text-3xl" />
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <span className="ml-2">No</span>
                                        <BiX className="text-red-600 text-3xl" />
                                    </div>
                                 </div>
                            </div>
                        </div>
                    </div>
                </div>
                
            <div className="container w-2/3 ml-52"></div>
                <ChecklistAprendices/>
                <div className="flex items-start pt-14 space-x-60">
                    <div className="ml-72">
                        <span className="text-custom-blue font-semibold text-xl font-inter">Instructor que Entrega</span>
                        <div className="pb-3 border-b-2 border-black w-72 mt-10"></div>
                    </div>

                    <div>
                        <span className="text-custom-blue font-semibold text-xl font-inter">Instructor que Recibe</span>
                        <div className="pb-3 border-b-2 border-black w-72 mt-10"></div>
                    </div>
                    <div className="ml-4 pt-14">
                    </div>
                </div>
               </div>
            </div>
      );
    };

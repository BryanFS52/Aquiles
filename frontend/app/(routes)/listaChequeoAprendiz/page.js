"use client";

import React, {useState} from "react";
import { Header } from "../../components/header"; //importaciones del header y del sidebar para hacer el llamado
import { downloadReportPDF } from "../../services/PDFService";
import { IoIosArrowDown } from "react-icons/io";
import { Sidebaraprendiz } from "../../components/SidebarAprendiz";
import ChecklistAprendices from "../../components/ChecklistAprendices";

export default function ListaChequeo() {
    
    return (
        <div className="min-h-screen grid grid-cols-1 xl:grid-cols-6">
            <Sidebaraprendiz />
            <div className="xl:col-span-5">
                <Header />
                <div className="text-custom-blue font-bold text-lg ml-10 py-6 border-b-2 border-gray-400 w-full sm:w-3/5 lg:w-2/5 mb-5 lg:mb-8">
                Lista de Chequeo Cierre de Trimestre 3-2024 (05/02/2024-  05/05/2024)
                </div>
                <div className="flex space-x-96 mt-10">
                <div className="w-96 h-32 rounded-lg overflow-hidden shadow-lg bg-gray-100 border-2 border-gray-300 relative p-4 ml-40">
                    <h1 className="font-inter text-base text-black font-semibold pb-6">Ficha: 12545664</h1>
                    <span className="font-inter text-base text-black font-medium">Instructor: Maicol Michell Laiton Chaparro</span>
                </div>

                <div className="w-96 h-32 rounded-lg overflow-hidden shadow-lg bg-gray-100 border-2 border-gray-300 relative p-4">
                    <h1 className="font-inter text-base text-black font-semibold pb-6">Sede: CSF</h1>
                    <span className="font-inter text-base text-black font-medium">Jornada: Diurna</span>
                </div>
                </div>
                <div className="flex bg-white w-full h-14"></div>

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

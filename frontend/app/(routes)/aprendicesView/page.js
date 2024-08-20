"use client"

import React from 'react';
import { Header } from "../../components/header"; 
import { Sidebar } from "../../components/sidebar";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

export function Aprendicesview() {
    const renderEstado = (estado) => {
        let bgColor = "";
      
        if (estado === "Activo") {
          bgColor = "bg-green-100 text-green-600";
        } else if (estado === "Inactivo") {
          bgColor = "bg-red-100 text-red-600";
        } else if (estado === "Pendiente") {
          bgColor = "bg-yellow-100 text-yellow-600";
        }
      
        return (
            <td className={"w-48 h-12 text-center py-3 border-2 border-gray-300 text-sm"}>
                <span className={`text-black rectangular-effect ${bgColor}`}>{estado}</span>
            </td>
          
        );
    };
      
    return (
        <div className="min-h-screen grid grid-cols-1 xl:grid-cols-6">
            <Sidebar />
            <div className="xl:col-span-5">
                <Header />
    
                <div className="w-72 pt-4">
                    <h2 className="text-[#0e324d] text-2xl sm:text-3xl lg:text-4xl pb-3 border-b-2 border-gray-400 w-full sm:w-3/4 lg:w-1/2 mb-6 lg:mb-12 font-inter font-semibold">Aprendices</h2>
                </div>
    
                <div className="flex justify-center pt-4">
                    <div className="bg-white shadow-md rounded-lg p-6 border-2 border-gray-200 w-full max-w-6xl overflow-x-auto max-h-[35rem]">
                        <table className="min-w-full divide-y divide-gray-200 border border-gray-200 table-auto">
                            <thead className="bg-custom-blue text-white">
                                <tr>
                                    <th className="p-3 text-xs font-medium text-center uppercase tracking-wider">ID</th>
                                    <th className="p-3 text-xs font-medium text-center uppercase tracking-wider">TD</th>
                                    <th className="p-3 text-xs font-medium text-center uppercase tracking-wider">Número de identificación</th>
                                    <th className="p-3 text-xs font-medium text-center uppercase tracking-wider">Nombres</th>
                                    <th className="p-3 text-xs font-medium text-center uppercase tracking-wider">Apellido</th>
                                    <th className="p-3 text-xs font-medium text-center uppercase tracking-wider">Team Scrum</th>
                                    <th className="p-3 text-xs font-medium text-center uppercase tracking-wider">Novedad</th>
                                    <th className="p-3 text-xs font-medium text-center uppercase tracking-wider">Estado</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-300">
                                <tr>
                                    <td className="py-3 text-center border-2 border-gray-300 text-sm">1</td>
                                    <td className="py-3 text-center border-2 border-gray-300 text-sm">cc</td>
                                    <td className="py-3 text-center border-2 border-gray-300 text-sm"><span className="text-black">236587</span></td>
                                    <td className="py-3 text-center border-2 border-gray-300 text-sm"><span className="text-black">Angel</span></td>
                                    <td className="py-3 text-center border-2 border-gray-300 text-sm"><span className="text-black">Orozco</span></td>
                                    <td className="py-3 text-center border-2 border-gray-300 text-sm"><span className="text-black">3</span></td>
                                    <td className="py-3 text-center border-2 border-gray-300 text-sm"><span className="text-black">Falta</span></td>
                                    {renderEstado("Activo")}
                                </tr>
                                <tr>
                                    <td className="py-3 px-10 text-center border-2 border-gray-300 text-sm">2</td>
                                    <td className="py-3 px-10 text-center border-2 border-gray-300 text-sm">cc</td>
                                    <td className="py-3 px-10 text-center border-2 border-gray-300 text-sm"><span className="text-black">234467</span></td>
                                    <td className="py-3 px-10 text-center border-2 border-gray-300 text-sm"><span className="text-black">Miguel</span></td>
                                    <td className="py-3 px-10 text-center border-2 border-gray-300 text-sm"><span className="text-black">Clavijo</span></td>
                                    <td className="py-3 px-10 text-center border-2 border-gray-300 text-sm"><span className="text-black">1</span></td>
                                    <td className="py-3 px-10 text-center border-2 border-gray-300 text-sm"><span className="text-black">Falta</span></td>
                                    {renderEstado("Inactivo")}
                                </tr>
                                <tr>
                                    <td className="py-3 px-10 text-center border-2 border-gray-300 text-sm">3</td>
                                    <td className="py-3 px-10 text-center border-2 border-gray-300 text-sm">cc</td>
                                    <td className="py-3 px-10 text-center border-2 border-gray-300 text-sm"><span className="text-black">224567</span></td>
                                    <td className="py-3 px-10 text-center border-2 border-gray-300 text-sm"><span className="text-black">Fernando</span></td>
                                    <td className="py-3 px-10 text-center border-2 border-gray-300 text-sm"><span className="text-black">Yepes</span></td>
                                    <td className="py-3 px-10 text-center border-2 border-gray-300 text-sm"><span className="text-black">2</span></td>
                                    <td className="py-3 px-10 text-center border-2 border-gray-300 text-sm"><span className="text-black">Falta</span></td>
                                    {renderEstado("Pendiente")}
                                </tr>
                                
                            </tbody>
                        </table>
    
                        <div className="flex justify-end  space-x-2 mt-4">
                            <button className="text-black px-2 py-1 rounded">
                                <IoIosArrowBack className="w-6 h-6" />
                            </button>
                            
                                {[1, 2, 3, 4, 5].map((num) => (
                            <button
                                key={num}
                                type="number"
                                className="bg-custom-blue text-white px-2 py-1 rounded w-8 h-8 flex items-center justify-center text-sm">
                                {num}
                            </button>
                            ))}
                            <button className="text-black px-2 py-1 rounded">
                                <IoIosArrowForward className="w-6 h-6" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
    
}

export default Aprendicesview;
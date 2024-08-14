"use client";

import React from "react";
import { Header } from "../../components/header"; //importaciones del header y del sidebar para hacer el llamado
import { downloadReportPDF } from "../../services/PDFService";
import { Sidebar } from "@/components/sidebar";
import { IoIosArrowDown } from "react-icons/io";

export default function ListaChequeo() {

    const handleDownloadPDF = async () => {
        try {
            const blob = await downloadReportPDF();
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'reporte.pdf'); // El nombre del archivo descargado
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } catch (err) {
            console.error('Error al descargar el reporte PDF', err);
        }
    };

    const toggleAttendance = (index, day, weekIndex) => {  
        const updatedAttendees = [...attendees];
        updatedAttendees[index].weeks[weekIndex][day] = !updatedAttendees[index].weeks[weekIndex][day];
        setAttendees(updatedAttendees);
    };
    
    return (
        <div className="min-h-screen grid grid-cols-1 xl:grid-cols-6">
            <Sidebar />
            <div className="xl:col-span-5">
                <Header />
                <div className="text-custom-blue font-bold text-2xl ml-10 py-6 border-b-2 border-gray-400 w-full sm:w-3/5 lg:w-2/5 mb-5 lg:mb-8">Lista de Chequeo Cierre de Trimestre 3-2024</div>
                <div className="w-2/3 h-60 rounded-lg overflow-hidden shadow-lg bg-white border-2 border-gray-300 relative mb-4 p-4 ml-52 mt-10">
                    <div className="flex flex-col space-x-8">
                        <div className="flex space-x-8">
                            <div className="flex flex-col items-start space-y-4">
                                <div>
                                    <span className="text-custom-blue text-base font-semibold font-inter">Ficha:</span>
                                    <div className="relative inline-block ml-8">
                                        <input type="text" className="border-2 border-gray-300 rounded-lg ml-5"/>
                                    </div>
                                </div>
                                <div>
                                    <span className="text-custom-blue text-base font-semibold font-inter">Sede:</span>
                                    <div className="relative inline-block ml-8">
                                        <input type="text" className="border-2 border-gray-300 rounded-lg ml-6"/>
                                        <IoIosArrowDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer" />
                                    </div>
                                </div>
                                <div>
                                    <span className="text-custom-blue text-base font-semibold font-inter">Jornada:</span>
                                    <div className="relative inline-block ml-8">
                                        <input type="text" className="border-2 border-gray-300 rounded-lg"/>
                                        <IoIosArrowDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer" />
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col items-start space-y-4">
                                <div className="flex space-x-8"> 
                                    <div>
                                        <span className="text-custom-blue text-base font-semibold font-inter">Trimestre:</span>
                                        <div className="relative inline-block ml-3">
                                            <input type="text" className="border-2 border-gray-300 rounded-lg ml-5"/>
                                            <IoIosArrowDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer" />
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <span className="text-custom-blue text-base font-semibold font-inter">Team:</span>
                                    <div className="relative inline-block ml-10">
                                        <input type="text" className="border-2 border-gray-300 rounded-lg ml-6"/>
                                        <IoIosArrowDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer" />
                                    </div>
                                </div>
                                <div>
                                    <span className="text-custom-blue text-base font-semibold font-inter">Pilar :</span>
                                    <div className="relative inline-block ml-16">
                                        <input type="text" className="border-2 border-gray-300 rounded-lg"/>
                                        <IoIosArrowDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer" />
                                    </div>
                                </div>

                                <button className="bg-custom-blue text-white text-center font-bold py-2 px-4 rounded-lg mt-4 block ml-3 w-28 h-10">
                                    Buscar
                                </button>
                            </div>
                            


                            <div className="flex justify-end">
                                <div className="w-52 h-28 bg-white border border-gray-200 p-4 rounded-lg shadow-md">
                                    <h2 className="text-gray-700 text-sm font-bold mb-2 text-center">Exportar lista de chequeo como:</h2>
                                    <div className="flex space-x-2 mb-4">
                                        <button type="button" onClick={handleDownloadPDF} className="w-full bg-custom-blue font-bold py-2 px-4 rounded text-white focus:outline-none focus:shadow-outline">
                                            PDF
                                        </button>
                                        <button className="w-full bg-custom-blue font-bold py-2 px-4 rounded text-white focus:outline-none focus:shadow-outline">
                                            Excel
                                        </button>
                                    </div>
                                    <div className="w-44 h-20 bg-white border border-gray-200 p-4 rounded-lg shadow-md mr-10">
                                        <h2 className="text-gray-700 text-sm font-bold mb-2">Indicaciones de uso:</h2>
                                        <div className="flex space-x-7">
                                            <span className="ml-3">Si ✔️</span>
                                            <span className="">No ❌</span>
                                        </div>
                                    </div>  
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            <div className=" w-2/3 h-auto rounded-lg overflow-hidden shadow-lg bg-white border-2 border-gray-300 relative mb-4 p-4 ml-52 mt-10"> 
                <div className="flex bg-white w-full h-14">
            </div>


        
            {/* Tabla de lista de asistencia */}
            <div className="container mx-auto">
            <div className="overflow-x-auto mt-4 bg-gray-100 mb-5">
        
                <table className="min-w-full divide-y divide-gray-200 border border-gray-200 table-auto">
                <thead className="bg-sky-950">
                  
                    <tr>
                        
                        <th className="px-4 py-3 border-2 border-gray-300 bg-sky-950 text-sm font-semibold text-white">Item</th>
                        <th className="px-4 py-3 border-2 border-gray-300 bg-sky-950 text-sm font-semibold text-white">Indicadores y/o Variables</th>
                        <th className="px-4 py-3 border-2 border-gray-300 bg-sky-950 text-sm font-semibold text-white">Si</th>
                        <th className="px-4 py-3 border-2 border-gray-300 bg-sky-950 text-sm font-semibold text-white">No</th>
                        <th className="px-4 py-3 border-2 border-gray-300 bg-sky-950 text-sm font-semibold text-white">Observaciones</th>

                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-300">
                <tr>
                        <td className="px-4 py-3 border-2 border-gray-300 text-sm">1</td>
                        <td className="px-2 border-2 border-gray-300 text-sm">El software evidencia autenticación y manejo dinámico de roles.</td>
                        <td className="px-4 py-3 border-2 border-gray-300 text-sm"><span className="text font-normal"></span></td>
                        <td className="px-4 py-3 border-2 border-gray-300 text-sm"><span className="text-green-500 font-bold"></span></td>
                        <td className="px-4 py-3 border-2 border-gray-300 text-sm"><span className="text-red-500 font-bold"></span></td>
                    
                    </tr>

                    <tr>
                        <td className="px-4 py-3 border-2 border-gray-300 text-sm">1</td>
                        <td className="px-2 border-2 border-gray-300 text-sm">El software evidencia autenticación y manejo dinámico de roles.</td>
                        <td className="px-4 py-3 border-2 border-gray-300 text-sm"><span className="text font-normal"></span></td>
                        <td className="px-4 py-3 border-2 border-gray-300 text-sm"><span className="text-green-500 font-bold"></span></td>
                        <td className="px-4 py-3 border-2 border-gray-300 text-sm"><span className="text-red-500 font-bold"></span></td>
                    
                    </tr>

                    <tr>
                        <td className="px-4 py-3 border-2 border-gray-300 text-sm">1</td>
                        <td className="px-2 border-2 border-gray-300 text-sm">El software evidencia autenticación y manejo dinámico de roles.</td>
                        <td className="px-4 py-3 border-2 border-gray-300 text-sm"><span className="text font-normal"></span></td>
                        <td className="px-4 py-3 border-2 border-gray-300 text-sm"><span className="text-green-500 font-bold"></span></td>
                        <td className="px-4 py-3 border-2 border-gray-300 text-sm"><span className="text-red-500 font-bold"></span></td>
                                            
                    </tr>
                </tbody>
                </table>
                </div>
            </div>
        </div>
    </div>
</div>
      );
    };
    
    
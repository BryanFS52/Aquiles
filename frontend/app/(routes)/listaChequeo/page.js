"use client"

import React from "react";
import { Header } from "../../components/header"; //importaciones del header y del sidebar para hacer el llamado
import { Sidebaraprendiz } from "../../components/sidebar";
import {downloadReportPDF} from "../../services/PDFService";
import { GoSearch } from "react-icons/go";
import { Sidebar } from "@/components/sidebar";
import { IoIosArrowDown } from "react-icons/io";

export default function ListaChequeo() {
        
    const downloadReportPDF = async () => {
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
            setError('Error al descargar el reporte PDF');
        }
    };

    const toggleAttendance = (index, day, weekIndex) => {  
        const updatedAttendees = [...attendees];
        updatedAttendees[index].weeks[weekIndex][day] = !updatedAttendees[index].weeks[weekIndex][day];
        setAttendees(updatedAttendees);
      };
    
    return(

            <div className="min-h-screen grid grid-cols-1 xl:grid-cols-6">
            <Sidebar />
            <div className="xl:col-span-5">
            <Header />

            <div className="text-custom-blue font-bold text-2xl ml-10 py-6 border-b-2 border-gray-400 w-full sm:w-3/5 lg:w-2/5 mb-5 lg:mb-8">Lista de Chequeo Cierre de Trimestre 3-2024</div>
            <div className="w-3/4 h-44 rounded-lg overflow-hidden shadow-lg bg-white border-2 border-gray-300 relative mb-4 p-4 ml-40 mt-10">
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
                </div>
            </div>

        
            <button className="mt-4 self-end border-2 border-custom-blue bg-custom-blue font-inter text-base text-white font-medium rounded-lg w-28 h-8">
                Buscar
            </button>
            </div>

           
            </div>

            

            


            


            <div className=" w-11/12 h-auto  rounded-lg overflow-hidden shadow-lg bg-white border-2 border-gray-300 relative mb-4 p-4 ml-10 mt-10"> 
                <div className="flex bg-white w-full h-14">

                    <form className="w-72 h-10 ml-4">
                        <div className="relative">
                            <div>
                            <button type="button" onClick={downloadReportPDF} className="h-10 w-56 bg-blue-500 text-white rounded-lg focus:outline-none focus:bg-blue-600">
                            Descargar PDF
                            </button>
                         </div>
                    </div>
                </form>
                
            </div>
        
            {/* Tabla de lista de asistencia */}
            <div className="container mx-auto">
            <div className="overflow-x-auto mt-4 bg-gray-100 mb-5">
        
                <table className="min-w-full divide-y divide-gray-200 border border-gray-200 table-auto">
                <thead className="bg-sky-950">
                  
                    <tr>
                        
                        <th className="px-4 py-3 border-2 border-gray-300 bg-sky-950 text-sm font-semibold text-white">Trimestre</th>
                        <th className="px-4 py-3 border-2 border-gray-300 bg-sky-950 text-sm font-semibold text-white">Team</th>
                        <th className="px-4 py-3 border-2 border-gray-300 bg-sky-950 text-sm font-semibold text-white">Item</th>
                        <th className="px-4 py-3 border-2 border-gray-300 bg-sky-950 text-sm font-semibold text-white">Si</th>
                        <th className="px-4 py-3 border-2 border-gray-300 bg-sky-950 text-sm font-semibold text-white">No</th>
                        <th className="px-4 py-3 border-2 border-gray-300 bg-sky-950 text-sm font-semibold text-white">Observaciones</th>

                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-300">
                <tr>
                        <td className="px-4 py-3 border-2 border-gray-300 text-sm">3° Trimestre</td>
                        <td className="px-2 border-2 border-gray-300 text-sm">1</td>
                        <td className="px-4 py-3 border-2 border-gray-300 text-sm"><span className="text font-normal">Formato de sustentación de Proyectos (según modelo entregado por la Coordinación)</span></td>
                        <td className="px-4 py-3 border-2 border-gray-300 text-sm"><span className="text-green-500 font-bold">✓</span></td>
                        <td className="px-4 py-3 border-2 border-gray-300 text-sm"><span className="text-red-500 font-bold">X</span></td>
                        <td className="px-4 py-3 border-2 border-gray-300 text-sm"><span className="text font-normal">Mejorar en la intefaz de usuario</span></td>
                    
                    </tr>

                    <tr>
                        <td className="px-4 py-3 border-2 border-gray-300 text-sm">3° Trimestre</td>
                        <td className="px-2 border-2 border-gray-300 text-sm">1</td>
                        <td className="px-4 py-3 border-2 border-gray-300 text-sm"><span className="text font-normal">Formato de sustentación de Proyectos (según modelo entregado por la Coordinación)</span></td>
                        <td className="px-4 py-3 border-2 border-gray-300 text-sm"><span className="text-green-500 font-bold">✓</span></td>
                        <td className="px-4 py-3 border-2 border-gray-300 text-sm"><span className="text-red-500 font-bold">X</span></td>
                        <td className="px-4 py-3 border-2 border-gray-300 text-sm"><span className="text font-normal"></span></td>
                    
                    </tr>

                    <tr>
                        <td className="px-4 py-3 border-2 border-gray-300 text-sm">3° Trimestre</td>
                        <td className="px-2 border-2 border-gray-300 text-sm">1</td>
                        <td className="px-4 py-3 border-2 border-gray-300 text-sm"><span className="text font-normal">Formato de sustentación de Proyectos (según modelo entregado por la Coordinación)</span></td>
                        <td className="px-4 py-3 border-2 border-gray-300 text-sm"><span className="text-green-500 font-bold">✓</span></td>
                        <td className="px-4 py-3 border-2 border-gray-300 text-sm"><span className="text-red-500 font-bold">X</span></td>
                        <td className="px-4 py-3 border-2 border-gray-300 text-sm"><span className="text font-normal"></span></td>
                                            
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
    
    
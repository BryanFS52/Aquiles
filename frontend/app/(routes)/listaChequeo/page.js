"use client"

import React from "react";
import { Header } from "../../components/header"; //importaciones del header y del sidebar para hacer el llamado
import { Sidebaraprendiz } from "../../components/sidebaraprendiz";
import {downloadReportPDF} from "../../services/PDFService";
import { GoSearch } from "react-icons/go";

export default function ListaChequeo() {
        
    const downloadrReportPDF = async () => {
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
            <Sidebaraprendiz />
            <div className="xl:col-span-5">
            <Header />


            <div className=" w-11/12 h-auto  rounded-lg overflow-hidden shadow-lg bg-white border-2 border-gray-300 relative mb-4 p-4 ml-10 mt-10"> 
                <div className="flex bg-white w-full h-14">

                    <form className="w-72 h-10 ml-4">
                        <div className="relative">
                            <div>
                            <button type="button" onClick={downloadrReportPDF} className="h-10 w-56 bg-blue-500 text-white rounded-lg focus:outline-none focus:bg-blue-600">
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
    
    
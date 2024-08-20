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
            link.setAttribute('download', 'reporte.pdf'); 
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
                                <div className="pt-1">
                                <button className="bg-custom-blue text-white text-center font-bold py-2 px-4 rounded-lg mt-4 block ml-3 w-28 h-10">
                                    Buscar
                                </button>
                                </div>
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

                <div className="flex bg-white w-full h-14">
            </div>

            <div className="container w-2/3 ml-52">
                <table className="min-w-full divide-y divide-gray-200 border border-gray-200 table-auto">
                <thead className="bg-sky-950">
                  
                    <tr>
                        
                        <th className="px-4 py-3 w-20 border-2 border-gray-300 bg-sky-950 text-sm font-semibold text-white">Item</th>
                        <th className="px-4 w-96 border-2 border-gray-300 bg-sky-950 text-sm font-semibold text-white text-center">Indicadores y/o Variables</th>
                        <th className="px-4 w-20 border-2 border-gray-300 bg-sky-950 text-sm font-semibold text-white">Si</th>
                        <th className="px-4 w-20 border-2 border-gray-300 bg-sky-950 text-sm font-semibold text-white">No</th>
                        <th className="px-4 border-2 border-gray-300 bg-sky-950 text-sm font-semibold text-white">Observaciones</th>

                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-300">
                        <tr>
                        <td className="px-4 py-3 border-2 border-gray-300 text-sm text-center">1</td>
                        <td className="px-2 border-2 border-gray-300 text-sm text-center">El software evidencia autenticación y manejo dinámico de roles.</td>
                        <td className="px-4 py-3 border-2 border-gray-300 text-sm">
                        <ul className="list-none">
                            <li className="flex items-center">
                            <input type="checkbox" id="item1" className="mr-2 ml-4 transform scale-150 custom-checkbox" />
                            </li>
                        </ul>
                        </td>
                        <td className="px-4 py-3 border-2 border-gray-300 text-sm">
                        <ul className="list-none">
                            <li className="flex items-center">
                            <input type="checkbox" id="item2" className="mr-2 ml-4 transform scale-150 custom-checkboxred" />
                            </li>
                        </ul>
                        </td>
                        <td className="px-4 py-3 border-2 border-gray-300 text-sm"><span className="text-red-500 font-bold"></span></td>
                    </tr>

                    <tr>
                        <td className="px-4 py-3 border-2 border-gray-300 text-sm text-center">1</td>
                        <td className="px-2 border-2 border-gray-300 text-sm text-center">El software evidencia autenticación y manejo dinámico de roles.</td>
                        <td className="px-4 py-3 border-2 border-gray-300 text-sm">
                        <ul className="list-none">
                            <li className="flex items-center">
                            <input type="checkbox" id="item1" className="mr-2 ml-4 transform scale-150 custom-checkbox" />
                            </li>
                        </ul>
                        </td>
                        <td className="px-4 py-3 border-2 border-gray-300 text-sm">
                        <ul className="list-none">
                            <li className="flex items-center">
                            <input type="checkbox" id="item2" className="mr-2 ml-4 transform scale-150 custom-checkboxred" />
                            </li>
                        </ul>
                        </td>
                        <td className="px-4 py-3 border-2 border-gray-300 text-sm"><span className="text-red-500 font-bold"></span></td>
                    
                    </tr>

                    <tr>
                        <td className="px-4 py-3 border-2 border-gray-300 text-sm text-center">1</td>
                        <td className="px-2 border-2 border-gray-300 text-sm text-center">El software evidencia autenticación y manejo dinámico de roles.</td>
                        <td className="px-4 py-3 border-2 border-gray-300 text-sm">
                        <ul className="list-none">
                            <li className="flex items-center">
                            <input type="checkbox" id="item1" className="mr-2 ml-4 transform scale-150 custom-checkbox" />
                            </li>
                        </ul>
                        </td>
                        <td className="px-4 py-3 border-2 border-gray-300 text-sm">
                        <ul className="list-none">
                            <li className="flex items-center">
                            <input type="checkbox" id="item2" className="mr-2 ml-4 transform scale-150 custom-checkboxred" />
                            </li>
                        </ul>
                        </td>
                        <td className="px-4 py-3 border-2 border-gray-300 text-sm"><span className="text-red-500 font-bold"></span></td>
                                            
                    </tr>
                </tbody>
                </table>
            </div>

            <div className="flex items-start pt-10 space-x-20">
            <div className="ml-52">
                <span className="text-custom-blue font-semibold text-xl font-inter">Instructor Técnico Anterior</span>
                <button type="text" className="flex mt-2 border-2 border-gray-400 bg-zinc-300 shadow-xl rounded-lg text-black text-center font-inter w-52 h-8 cursor-pointer">Firma Instructor</button>
                <div className="pb-3 border-b-2 border-black w-72 mt-2"></div>
            </div>

            <div>
                <span className="text-custom-blue font-semibold text-xl font-inter">Instructor Técnico Nuevo</span>
                <button type="text" className="flex mt-2 border-2 border-gray-400 bg-zinc-300 shadow-xl rounded-lg text-black text-center font-inter w-52 h-8 cursor-pointer">Firma Instructor</button>
                <div className="pb-3 border-b-2 border-black w-72 mt-2"></div>
            </div>

            <div className="ml-4 pt-14">
                <button type="text" className="border-custom-blue border-2 bg-custom-blue text-center font-inter text-white text-xl w-32 h-9 shadow-xl rounded-lg">Guardar</button>
            </div>
            </div>
    </div>
</div>
      );
    };
    
    

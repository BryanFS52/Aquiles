"use client";

import React, {useState} from "react";
import { Header } from "../../components/header"; //importaciones del header y del sidebar para hacer el llamado
import { downloadReportPDF } from "../../services/PDFService";
import { IoIosArrowDown } from "react-icons/io";
import { Sidebaraprendiz } from "../../components/sidebaraprendiz";

export default function ListaChequeo() {

     // Opciones para los select 
     const [sedes, setSedes] = useState (["Centro de Servicios Financieros", "Salitre Sena"]);
     const [jornada, setJornada] = useState (["Mañana", "Tarde", "Noche", "Madrugada", "Fin de Semana"]);
     const [trimestre, setTrimestre] = useState (["Trimestre 1", "Trimestre 2", "Trimestre 3", "Trimestre 4", "Trimestre 5", "Trimestre 6", "Trimestre 7"]);
     const [team, setTeam] = useState (["Team 1", "Team 2", "Team 3"]);
     const [pilar, setPilar] = useState (["Componente Técnico", "Componente Humanístico", "Componente Comunicación", "Componente Emprendimiento", "Componente Inglés"]);
 

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
            <Sidebaraprendiz />
            <div className="xl:col-span-5">
                <Header />
                <div className="text-custom-blue font-bold text-2xl ml-10 py-6 border-b-2 border-gray-400 w-full sm:w-3/5 lg:w-2/5 mb-5 lg:mb-8">
                    Lista de Chequeo Cierre de Trimestre 3-2024
                </div>
                <div className="w-2/3 h-60 rounded-lg overflow-hidden shadow-lg bg-white border-2 border-gray-300 relative mb-4 p-4 ml-52 mt-10">
                    <div className="flex flex-col space-x-8">
                        <div className="flex space-x-8">
                            <div className="flex flex-col items-start space-y-4">
                                <div>
                                    <span className="text-custom-blue text-base font-semibold font-inter">Ficha:</span>
                                    <div className="relative inline-block ml-8">
                                        <input type="text" className="border-2 border-gray-300 rounded-lg ml-5 w-52"/>
                                    </div>
                                </div>

                                <div>
                                    <span className="text-custom-blue text-base font-semibold font-inter">Sede:</span>
                                    <div className="relative inline-block ml-8">
                                        <select className="border-2 border-gray-300 rounded-lg ml-5 w-52">
                                            {sedes.map((sede, index) => (
                                                <option key={index} value={sede}>{sede}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <span className="text-custom-blue text-base font-semibold font-inter">Jornada:</span>
                                    <div className="relative inline-block ml-8">
                                        <select className="border-2 border-gray-300 rounded-lg w-52">
                                            {jornada.map((jornada, index) => (
                                                <option key={index} value={jornada}>{jornada}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                            </div>
                            <div className="flex flex-col items-start space-y-4">
                                <div className="flex space-x-8"> 
                                    <div>
                                        <span className="text-custom-blue text-base font-semibold font-inter">Trimestre:</span>
                                        <div className="relative inline-block ml-3">
                                            <select className="border-2 border-gray-300 rounded-lg ml-5 w-52">
                                                {trimestre.map((trimestre, index) => (
                                                    <option key={index} value={trimestre}>{trimestre}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <span className="text-custom-blue text-base font-semibold font-inter">Team:</span>
                                    <div className="relative inline-block ml-10">
                                        <select className="border-2 border-gray-300 rounded-lg ml-5 w-52">
                                            {team.map((team, index) => (
                                                <option key={index} value={team}>{team}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <span className="text-custom-blue text-base font-semibold font-inter">Pilar:</span>
                                    <div className="relative inline-block ml-16">
                                        <select className="border-2 border-gray-300 rounded-lg w-52">
                                            {pilar.map((pilar, index) => (
                                                <option key={index} value={pilar}>{pilar}</option>
                                            ))}
                                        </select>
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
                                            <span className="ml-3">Si ✅</span>
                                            <span className="ml-3">No ❌</span>
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
    </div>
</div>
      );
    };
    
    

"use client"

import React, { useCallback, useState, useRef } from "react";
import { Header } from "../../components/header";
import { Sidebar } from "../../components/sidebar";
import { BiX, BiCheck } from "react-icons/bi";
import CheckListTable from "../../components/CheckListTable";
import {downloadReportPDF} from "../../services/PDFService";
import { useMemo } from 'react';

export default function ListaChequeo() {
    const sedeOptions = useMemo(() => ["Centro de Servicios Financieros", "Salitre Sena"], []);
    const jornadaOptions = useMemo(() => ["Mañana", "Tarde", "Noche", "Madrugada", "Fin de Semana"], []);
    const trimestreOptions = useMemo(() => ["Trimestre 1", "Trimestre 2", "Trimestre 3", "Trimestre 4", "Trimestre 5", "Trimestre 6", "Trimestre 7"], []);
    const teamOptions = useMemo(() => ["Team 1", "Team 2", "Team 3"], []);
    const pilarOptions = useMemo(() => ["Componente Técnico", "Componente Humanístico", "Componente Comunicación", "Componente Emprendimiento", "Componente Inglés"], []);
    
    const [ficha, setFicha] = useState("");
    const [sedeSeleccionada, setSedeSeleccionada] = useState("");
    const [jornadaSeleccionada, setJornadaSeleccionada] = useState("");
    const [trimestreSeleccionado, setTrimestreSeleccionado] = useState("");
    const [teamSeleccionado, setTeamSeleccionado] = useState("");
    const [pilarSeleccionado, setPilarSeleccionado] = useState("");

    const [guardarPresionado, setGuardarPresionado] = useState(false);

    const fileInputRefPrev = useRef(null);
    const fileInputRefNew = useRef(null);

    const handleDownloadPDF = useCallback(async () => {
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
    }, []);

    const handleUploadPrev = useCallback(() => fileInputRefPrev.current.click(), []);
    const handleUploadNew = useCallback(() => fileInputRefNew.current.click(), []);


    
    return (
        <div className="min-h-screen grid grid-cols-1 xl:grid-cols-6">
            <Sidebar />
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
                                        <input className={`border-2 ${guardarPresionado && !ficha ? "border-red-500" : "border-gray-300"} rounded-lg ml-4 w-52`} disabled/>
                                    </div>
                                </div>
                                <div>
                                    <span className="text-custom-blue text-base font-semibold font-inter">Sede:</span>
                                    <div className="relative inline-block ml-8">
                                        <input className={`border-2 ${guardarPresionado && !sedeSeleccionada ? "border-red-500" : "border-gray-300"} rounded-lg ml-5 w-52`} disabled/>
                                    </div>
                                </div>
                                <div>
                                    <span className="text-custom-blue text-base font-semibold font-inter">Jornada:</span>
                                    <div className="relative inline-block ml-7">
                                        <input className={`border-2 ${guardarPresionado && !jornadaSeleccionada ? "border-red-500" : "border-gray-300"} rounded-lg w-52`} disabled/>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col items-start space-y-4">
                                <div className="flex space-x-8">
                                    <div>
                                        <span className="text-custom-blue text-base font-semibold font-inter">Trimestre:</span>
                                        <div className="relative inline-block ml-3">
                                            <input className={`border-2 ${guardarPresionado && !trimestreSeleccionado ? "border-red-500" : "border-gray-300"} rounded-lg ml-5 w-52`} disabled/>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <span className="text-custom-blue text-base font-semibold font-inter">Team:</span>
                                    <div className="relative inline-block ml-10">
                                        <input className={`border-2 ${guardarPresionado && !teamSeleccionado ? "border-red-500" : "border-gray-300"} rounded-lg ml-6 w-52`} disabled/>
                                    </div>
                                </div>
                                <div>
                                    <span className="text-custom-blue text-base font-semibold font-inter">Indicador:</span>
                                    <div className="relative inline-block ml-8">
                                        <input className={`border-2 ${guardarPresionado && !pilarSeleccionado ? "border-red-500" : "border-gray-300"} rounded-lg ml-1 w-52`} disabled/>
                                    </div>
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
                    </div>
                </div>
                <CheckListTable />
                <div className="flex items-start pt-10 space-x-20">
                    <div className="ml-52">
                        <span className="text-custom-blue font-semibold text-xl font-inter">Instructor Técnico Anterior</span>
                        <button type="button" onClick={handleUploadPrev} className="flex mt-2 border-2 border-gray-400 bg-zinc-300 shadow-xl rounded-lg text-black text-center font-inter w-52 h-8 cursor-pointer">
                            Firma Instructor
                        </button>
                        <input type="file" ref={fileInputRefPrev} className="hidden" onChange={(e) => console.log(e.target.files[0])} />
                        <div className="pb-3 border-b-2 border-black w-72 mt-2"></div>
                    </div>
                    <div>
                        <span className="text-custom-blue font-semibold text-xl font-inter">Instructor Técnico Nuevo</span>
                        <button type="button" onClick={handleUploadNew} className="flex mt-2 border-2 border-gray-400 bg-zinc-300 shadow-xl rounded-lg text-black text-center font-inter w-52 h-8 cursor-pointer">
                            Firma Instructor
                        </button>
                        <input type="file" ref={fileInputRefNew} className="hidden" onChange={(e) => console.log(e.target.files[0])} />
                        <div className="pb-3 border-b-2 border-black w-72 mt-2"></div>
                    </div>
                    <div className="ml-4 pt-14">
                        <button type="button" className="border-custom-blue border-2 bg-custom-blue text-center font-inter text-white text-xl w-32 h-9 shadow-xl rounded-lg">
                            Guardar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
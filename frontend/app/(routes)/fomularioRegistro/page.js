"use client"

import React, { useState } from "react";
import { Sidebar } from "../../components/sidebar";
import { Header } from "../../components/header";
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function FormularioRegistro () {
    const [nombreAprendiz, setNombreAprendiz] = useState('');
    const [apellidosAprendiz, setApellidosAprendiz] = useState('');
    const [documento, setDocumento] = useState('');

    const router = useRouter();

    const handleNombreChange = (e) => {
        const value = e.target.value;
        const regex = /^[a-zA-Z\s]*$/;
        if (regex.test(value)) {
            setNombreAprendiz(value);
        }
    };

    const handleApellidosChange = (e) => {
        const value = e.target.value;
        const regex = /^[a-zA-Z\s]*$/;
        if (regex.test(value)) {
            setApellidosAprendiz(value);
        }
    };

    const handleDocumentoChange = (e) => {
        const value = e.target.value;
        const regex = /^[0-9]*$/; 
        if (regex.test(value)) {
            setDocumento(value);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (nombreAprendiz && apellidosAprendiz && documento) {
            router.push('/asistencia');
        } else {
            toast.error("Por favor, completa todos los campos.");
        }
    };

    return (
        <div className="min-h-screen grid grid-cols-1 xl:grid-cols-6">
            <Sidebar/>

            <div className="xl:col-span-5">
                <Header/>

                <div className="h-[90vh] overflow-y-scroll p-6 md:p-12 w-full bg-neutral-100 space-y-5">
                    <div className="flex flex-wrap justify-center md:justify-start gap-4 ml-16">
                        <div className="flex flex-col w-full md:w-2/5 h-80 rounded-lg overflow-hidden shadow-lg bg-white border-2 border-gray-300 p-4 space-y-3 text-custom-blue text-xl font-medium">
                            Agregar Aprendiz
                            <div className="flex pt-7">
                                <span className="font-inter font-semibold text-[#0e324d] text-sm sm:text-sm">Nombre del Aprendiz:</span>
                                <div className="font-inter font-normal text-black sm:text-base ml-auto relative w-2/3">
                                    <input type="text" name="nameProject" placeholder="Nombre del Aprendiz" className="w-72 rounded-lg border-gray-300 border-2 pl-3 ml-6 pr-10" value={nombreAprendiz} onChange={handleNombreChange}/>
                                </div>
                            </div>

                            <div className="flex pt-5">
                                <span className="font-inter font-semibold text-[#0e324d] text-sm sm:text-sm">Apellidos del Aprendiz:</span>
                                <div className="font-inter font-normal text-black sm:text-base ml-auto relative w-2/3">
                                    <input type="text" name="nameProject" placeholder="Apellidos del Aprendiz" className="w-72 rounded-lg border-gray-300 border-2 pl-3 ml-6 pr-10" value={apellidosAprendiz} onChange={handleApellidosChange} />
                                </div>
                            </div>

                            <div className="flex pt-5">
                                <span className="font-inter font-semibold text-[#0e324d] text-sm sm:text-sm">Documento:</span>
                                <div className="font-inter font-normal text-black sm:text-base ml-auto relative w-2/3">
                                    <input type="text" name="nameProject" placeholder="Documento" className="w-72 rounded-lg border-gray-300 border-2 pl-3 ml-6 pr-10" value={documento} onChange={handleDocumentoChange} />
                                </div>
                            </div>

                            <div className="flex pt-5">
                                <button
                                    onClick={handleSubmit}
                                    className="bg-custom-blue border-2 border-custom-blue rounded-xl text-white font-medium font-inter text-base w-44 h-8 ml-72 flex items-center justify-center cursor-pointer">
                                    Agregar Aprendiz
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <ToastContainer />
        </div>
    );
}

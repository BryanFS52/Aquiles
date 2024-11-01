"use client";

import { HeaderAprendiz } from "../../components/HeaderAprendiz";
import { Sidebaraprendiz } from "../../components/SidebarAprendiz";
import Image from 'next/image';
import aquiles from "../../../public/img/aquiles.jpg"; // imagen de aquiles
import { IoPersonCircleSharp } from "react-icons/io5";
import { IoDocumentTextSharp } from "react-icons/io5";
import { FaIdCard } from 'react-icons/fa';

import React from 'react';
import { useRouter } from 'next/navigation';
import { HeaderCoordinador } from "../../components/HeaderCoordinador";
import { Sidebarcoordinador } from '../../components/SidebarCoordinador';

// Definición del componente Card
const Card = ({ children, className }) => {
    return (
        <div className={`bg-white shadow-xl rounded-lg p-8 w-full md:w-auto lg:w-auto ${className}`}>
            {children}
        </div>
    );
};

// Definición del componente CardHeader
const CardHeader = ({ children }) => {
    return (
        <div className="mb-4 border-b pb-2">
            {children}
        </div>
    );
};

// Definición del componente CardTitle
const CardTitle = ({ children }) => {
    return (
        <h2 className="text-xl font-semibold">
            {children}
        </h2>
    );
};

// Definición del componente CardContent
const CardContent = ({ children }) => {
    return (
        <div className="text-gray-700">
            {children}
        </div>
    );
};

// Definición del componente Button
const Button = ({ children, onClick, className }) => {
    return (
        <button
            onClick={onClick}
            className={`px-4 py-2 bg-[#00324d] text-white rounded hover:bg-[#40b003] transition-all duration-300 ${className}`}
        >
            {children}
        </button>
    );
};

const InstructoresCoordinador = () => {
    const router = useRouter();

    // Funciones para redirigir a las rutas correspondientes
    const handleInstructorAsignacion = () => {
        router.push('/InstructorTechnicalAssign'); // Ruta para la asignación de instructor técnico
    };

    const handleMultipleAsignacion = () => {
        router.push('/InstructorAssignMultipleSheets'); // Ruta para la asignación a múltiples fichas
    };

    return (
        <div className="min-h-screen grid grid-cols-1 xl:grid-cols-6">
            <Sidebarcoordinador />
            <div className="xl:col-span-5">
                <HeaderCoordinador />
                <div className="container mx-auto p-6 space-y-8">
                    <h1 className="text-4xl font-bold text-[#00324d] hover:text-[#01b001] transition-colors duration-300">
                        Instructores
                    </h1>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
                        
                        <div className="flex flex-col items-center bg-white p-4 rounded-lg shadow-lg border border-gray-200">
                            <div className="relative mb-4">
                                <Image src={aquiles} alt="Instructor" width={120} height={120} className="rounded-full" />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
                                <div className="space-y-2 text-lg">
                                    <div className="space-x-2">
                                        <span className="flex text-[#0e324d] font-inter font-semibold"><IoPersonCircleSharp className="inline-block text-[#40b003] text-2xl" /> &nbsp;Tiempo de contrato:</span>
                                        <p className="text-gray-800 font-inter font-normal">Lucía Maria Pérez Gonzales</p>
                                    </div>
                                    <div className="space-x-2">
                                        <span className="flex text-[#0e324d] font-inter font-semibold"><IoPersonCircleSharp className="inline-block text-[#40b003] text-2xl" /> &nbsp;Centros y sedes:</span>
                                        <p className="text-gray-800 font-inter font-normal">Lucía Maria Pérez Gonzales</p>
                                    </div>
                                    <div className="space-x-2">
                                        <span className="flex text-[#0e324d] font-inter font-semibold"><IoPersonCircleSharp className="inline-block text-[#40b003] text-2xl" /> &nbsp;Fichas asignadas:</span>
                                        <p className="text-gray-800 font-inter font-normal">3</p>
                                    </div>
                                </div>
                                <div className="space-y-2 text-lg">
                                    <div className="space-x-2">
                                        <span className="flex text-[#0e324d] font-inter font-semibold"><IoPersonCircleSharp className="inline-block text-[#40b003] text-2xl" /> &nbsp;Tiempo de contrato:</span>
                                        <p className="text-gray-800 font-inter font-normal">Lucía Maria Pérez Gonzales</p>
                                    </div>
                                    <div className="space-x-2">
                                        <span className="flex text-[#0e324d] font-inter font-semibold"><IoPersonCircleSharp className="inline-block text-[#40b003] text-2xl" /> &nbsp;Centros y sedes:</span>
                                        <p className="text-gray-800 font-inter font-normal">Lucía Maria Pérez Gonzales</p>
                                    </div>
                                    <div className="space-x-2">
                                        <span className="flex text-[#0e324d] font-inter font-semibold"><IoPersonCircleSharp className="inline-block text-[#40b003] text-2xl" /> &nbsp;Fichas asignadas:</span>
                                        <p className="text-gray-800 font-inter font-normal">3</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        
                        <div className="flex flex-col items-center bg-white p-4 rounded-lg shadow-lg border border-gray-200">
                            <div className="relative mb-4">
                                <Image src={aquiles} alt="Instructor" width={120} height={120} className="rounded-full" />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
                                <div className="space-y-2 text-lg">
                                    <div className="space-x-2">
                                        <span className="flex text-[#0e324d] font-inter font-semibold"><IoPersonCircleSharp className="inline-block text-[#40b003] text-2xl" /> &nbsp;Tiempo de contrato:</span>
                                        <p className="text-gray-800 font-inter font-normal">Lucía Maria Pérez Gonzales</p>
                                    </div>
                                    <div className="space-x-2">
                                        <span className="flex text-[#0e324d] font-inter font-semibold"><IoPersonCircleSharp className="inline-block text-[#40b003] text-2xl" /> &nbsp;Centros y sedes:</span>
                                        <p className="text-gray-800 font-inter font-normal">Lucía Maria Pérez Gonzales</p>
                                    </div>
                                    <div className="space-x-2">
                                        <span className="flex text-[#0e324d] font-inter font-semibold"><IoPersonCircleSharp className="inline-block text-[#40b003] text-2xl" /> &nbsp;Fichas asignadas:</span>
                                        <p className="text-gray-800 font-inter font-normal">3</p>
                                    </div>
                                </div>
                                <div className="space-y-2 text-lg">
                                    <div className="space-x-2">
                                        <span className="flex text-[#0e324d] font-inter font-semibold"><IoPersonCircleSharp className="inline-block text-[#40b003] text-2xl" /> &nbsp;Tiempo de contrato:</span>
                                        <p className="text-gray-800 font-inter font-normal">Lucía Maria Pérez Gonzales</p>
                                    </div>
                                    <div className="space-x-2">
                                        <span className="flex text-[#0e324d] font-inter font-semibold"><IoPersonCircleSharp className="inline-block text-[#40b003] text-2xl" /> &nbsp;Centros y sedes:</span>
                                        <p className="text-gray-800 font-inter font-normal">Lucía Maria Pérez Gonzales</p>
                                    </div>
                                    <div className="space-x-2">
                                        <span className="flex text-[#0e324d] font-inter font-semibold"><IoPersonCircleSharp className="inline-block text-[#40b003] text-2xl" /> &nbsp;Fichas asignadas:</span>
                                        <p className="text-gray-800 font-inter font-normal">3</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex flex-col items-center bg-white p-4 rounded-lg shadow-lg border border-gray-200">
                            <div className="relative mb-4">
                                <Image src={aquiles} alt="Instructor" width={120} height={120} className="rounded-full" />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
                                <div className="space-y-2 text-lg">
                                    <div className="space-x-2">
                                        <span className="flex text-[#0e324d] font-inter font-semibold"><IoPersonCircleSharp className="inline-block text-[#40b003] text-2xl" /> &nbsp;Tiempo de contrato:</span>
                                        <p className="text-gray-800 font-inter font-normal">Lucía Maria Pérez Gonzales</p>
                                    </div>
                                    <div className="space-x-2">
                                        <span className="flex text-[#0e324d] font-inter font-semibold"><IoPersonCircleSharp className="inline-block text-[#40b003] text-2xl" /> &nbsp;Centros y sedes:</span>
                                        <p className="text-gray-800 font-inter font-normal">Lucía Maria Pérez Gonzales</p>
                                    </div>
                                    <div className="space-x-2">
                                        <span className="flex text-[#0e324d] font-inter font-semibold"><IoPersonCircleSharp className="inline-block text-[#40b003] text-2xl" /> &nbsp;Fichas asignadas:</span>
                                        <p className="text-gray-800 font-inter font-normal">3</p>
                                    </div>
                                </div>
                                <div className="space-y-2 text-lg">
                                    <div className="space-x-2">
                                        <span className="flex text-[#0e324d] font-inter font-semibold"><IoPersonCircleSharp className="inline-block text-[#40b003] text-2xl" /> &nbsp;Tiempo de contrato:</span>
                                        <p className="text-gray-800 font-inter font-normal">Lucía Maria Pérez Gonzales</p>
                                    </div>
                                    <div className="space-x-2">
                                        <span className="flex text-[#0e324d] font-inter font-semibold"><IoPersonCircleSharp className="inline-block text-[#40b003] text-2xl" /> &nbsp;Centros y sedes:</span>
                                        <p className="text-gray-800 font-inter font-normal">Lucía Maria Pérez Gonzales</p>
                                    </div>
                                    <div className="space-x-2">
                                        <span className="flex text-[#0e324d] font-inter font-semibold"><IoPersonCircleSharp className="inline-block text-[#40b003] text-2xl" /> &nbsp;Fichas asignadas:</span>
                                        <p className="text-gray-800 font-inter font-normal">3</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InstructoresCoordinador;

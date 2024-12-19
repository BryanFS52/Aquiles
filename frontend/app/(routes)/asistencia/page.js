"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { BsPersonCircle } from "react-icons/bs";
import TableAttendance from "../../components/tableAttendance";
import { Header } from "../../components/header";
import { Sidebar } from "../../components/Sidebar";
import { FaCheck, FaEye } from "react-icons/fa";
import { TbLetterR, TbLetterX, TbLetterJ } from "react-icons/tb";
import { getAllApprentices } from "../../services/apprenticeService"; // Importa el servicio

export default function Attendance() {
    const [students, setStudents] = useState([]); // Estado para almacenar los aprendices

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const studentsData = await getAllApprentices(); // Obtén la lista de aprendices del servicio
                setStudents(studentsData);
            } catch (error) {
                console.error('Error al obtener la lista de aprendices:', error);
            }
        };

        fetchStudents();
    }, []);

    const handleStatusChange = (studentsData) => {
      setStudents(studentsData); // Actualiza la lista de estudiantes con la información actualizada
  };

    const activeStudents = students.filter(student => student.status === 'active').length;
    const withdrawnStudents = students.filter(student => student.status === 'withdrawn').length;

    return (
        <div className="min-h-screen grid grid-cols-1 xl:grid-cols-6">        
            <Sidebar />
            <div className="xl:col-span-5">
                <Header />

                <div className="h-[91vh] p-4 md:p-8 lg:p-12 w-full bg-neutral-100 space-y-5">
                    <h1 className="text-[#0e324d] text-2xl sm:text-3xl lg:text-4xl pb-3 border-b-2 border-gray-400 w-full sm:w-3/4 lg:w-1/2 mb-4 font-inter font-semibold">
                        Lista de Asistencia
                    </h1>
                    
                    <div className="flex flex-col space-y-4 md:flex-row md:space-x-10 md:space-y-0 justify-center">
                        <div className="flex h-auto md:h-16 w-full md:w-[30%] rounded-lg shadow-lg bg-white border-2 border-gray-300 p-4">
                            <div className="flex items-center justify-center md:justify-start">
                                <span className="font-inter font-medium text-xl text-green-500"> Desarrollo de Aplicaciones Web II</span>
                            </div>
                        </div>

                        <div className="flex h-auto md:h-16 w-full md:w-[38%] rounded-lg shadow-lg bg-white border-2 border-gray-300 p-4">
                            <div className="flex flex-col items-center justify-center space-y-2 w-full md:flex-row md:justify-start md:space-y-0 md:space-x-14">
                                <div className="flex h-auto md:h-10 w-full md:w-60 rounded-lg shadow-lg border-2 bg-neutral-200 border-green-500 p-2">
                                    <div className="flex items-center justify-center md:justify-start w-full">
                                        <BsPersonCircle className="w-7 h-7 text-gray-500" />
                                        <h1 className="text-custom-blue font-semibold text-lg font-inter ml-3">{activeStudents}</h1>
                                        <span className="font-inter text-sm ml-5">Aprendices Activos</span>
                                    </div>
                                </div>

                                <div className="flex h-auto md:h-10 w-full md:w-60 rounded-lg shadow-lg border-2 bg-neutral-200 border-green-500 p-2">
                                    <div className="flex items-center justify-center md:justify-start w-full">
                                        <BsPersonCircle className="w-7 h-7 text-gray-500" />
                                        <h1 className="text-custom-blue font-semibold text-lg font-inter ml-3">{withdrawnStudents}</h1>
                                        <span className="font-inter text-sm ml-5">Aprendices Retirados</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6">
                        <TableAttendance onStatusChange={handleStatusChange} /> {/* Pasa la función aquí */}
                    </div>

                    <div className="flex flex-col md:flex-row md:space-x-6 space-y-4 md:space-y-0 justify-center items-center w-full md:w-[60%]">
                        <div className="flex h-14 w-full md:w-40 rounded-lg shadow-lg bg-white border-2 border-gray-300 text-custom-blue font-inter font-semibold text-2xl justify-center p-3">
                            255873
                        </div>
                        <div className="flex flex-col md:flex-row md:space-x-6 w-full max-w-4xl rounded-lg shadow-lg bg-white border-2 border-gray-300 p-4 space-y-4 md:space-y-0">
                            <div className="flex items-center space-x-4 flex-1">
                                <span className="font-inter text-base font-normal text-black">Asistencia</span>
                                <div className="relative flex items-center">
                                    <input className="rounded-md border-gray-300 border-2 w-6 h-6" readOnly />
                                    <FaCheck className="absolute left-1 text-green-500 w-4 h-4" strokeWidth={4} />
                                </div>
                            </div>
                            <div className="flex items-center space-x-4 flex-1">
                                <span className="font-inter text-base font-normal text-black">Retardo</span>
                                <div className="relative flex items-center">
                                    <input className="rounded-md border-gray-300 border-2 w-6 h-6" readOnly />
                                    <TbLetterR className="absolute left-1 text-yellow-500 w-4 h-4" strokeWidth={4} />
                                </div>
                            </div>
                            <div className="flex items-center space-x-4 flex-1">
                                <span className="font-inter text-base font-normal text-black">Inasistencia</span>
                                <div className="relative flex items-center">
                                    <input className="rounded-md border-gray-300 border-2 w-6 h-6" readOnly />
                                    <TbLetterX className="absolute left-1 text-red-500 w-4 h-4" strokeWidth={4} />
                                </div>
                            </div>
                            <div className="flex items-center space-x-4 flex-1">
                                <span className="font-inter text-base font-normal text-black">Justificación</span>
                                <div className="relative flex items-center">
                                    <input className="rounded-md border-gray-300 border-2 w-6 h-6" readOnly />
                                    <TbLetterJ className="absolute left-1 text-blue-500 w-4 h-4" strokeWidth={4} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

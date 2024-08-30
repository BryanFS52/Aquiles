"use client";

import React, { useState } from "react";
import { Header } from "../../components/header";
import { Sidebar } from "../../components/sidebar";
import { PiStudentFill } from "react-icons/pi";
import { ImMail4 } from "react-icons/im";
import ModalCorreo from "../../components/Modals/modalCorreo";
import { sendEmailAbsence } from "../../services/emailService";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function AprendicesList() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);

    const toggleModal = (student) => {
        setSelectedStudent(student);
        setIsModalOpen(!isModalOpen);
    };

    const handleSendEmail = async () => {
        if (!selectedStudent) return;
    
        const { email, studentName, date } = selectedStudent;
    
        try {
            await sendEmailAbsence(email, studentName, date);
            toast.success("Correo enviado con éxito");
        } catch (error) {
            console.error("Error al enviar el correo:", error);
            toast.error("Hubo un error al enviar el correo");
        } finally {
            setIsModalOpen(false);
        }
    };
    
    return (
        <div className="min-h-screen grid grid-cols-1 xl:grid-cols-6">
            <Sidebar />
            <div className="xl:col-span-5">
                <Header />
                <div className="h-[90vh] overflow-y-scroll p-12 inline-block w-full relative bg-neutral-100 space-y-5 ">
                    <h1 className="text-[#0e324d] text-2xl sm:text-3xl lg:text-4xl pb-3 border-b-2 border-gray-400 w-full sm:w-3/4 lg:w-1/2 mb-6 lg:mb-12 font-inter font-semibold">Lista de Asistencia</h1>
                    <div className="flex px-9 space-x-24">
                        <div className="flex w-96 h-48 rounded-lg overflow-hidden shadow-lg bg-white border-2 border-gray-300 relative mb-4 p-4 ">
                            <div className="z-50 justify-end space-y-3">
                                <PiStudentFill className="w-9 h-9 text-stone-600 ml-6" /><br />
                                <div>
                                    <span className="text-[#0e324d] font-inter font-semibold text-5xl ml-6">25</span><br /><br />
                                    <span className="font-inter font-medium text-lg ">Aprendices de la ficha</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex w-96 h-48 rounded-lg overflow-hidden shadow-lg bg-white border-2 border-gray-300 relative mb-4 p-4 ">
                            <div className="z-50 justify-end space-y-3">
                                <PiStudentFill className="w-9 h-9 text-stone-600 ml-6" /><br />
                                <div>
                                    <span className="text-5xl font-inter font-normal ml-6">20</span><br /><br />
                                    <span className="font-inter font-normal text-lg ">Aprendices en clase</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex w-96 h-48 rounded-lg overflow-hidden shadow-lg bg-white border-2 border-gray-300 relative mb-4 p-4 ">
                            <div className="z-50 justify-end space-y-3">
                                <PiStudentFill className="w-9 h-9 text-stone-600 ml-6" /><br />
                                <div>
                                    <span className="text-5xl font-inter font-normal ml-6">5</span><br /><br />
                                    <span className="font-inter font-normal text-lg ">Aprendices que fallaron</span>
                                </div>
                            </div>
                        </div>

                        <ModalCorreo isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSendEmail={handleSendEmail} />
                    </div>

                    <div className="flex w-1/2 h-auto rounded-lg overflow-hidden shadow-lg bg-white border-2 border-gray-300 relative ml-80 p-4 ">
                        <div className="z-50 justify-end space-y-3">
                        </div>

                        {/* Tabla con los datos quemados */}
                        <div className="overflow-x-auto w-full">
                            <table className="ml-16 bg-white w-96 md:w-5/6">
                                <thead>
                                    <tr>
                                        <th className="px-4 py-2 border-2 border-gray-200 bg-gray-100 text-sm font-semibold text-gray-700">Número de Documento</th>
                                        <th className="px-4 py-2 border-2 border-gray-200 bg-gray-100 text-sm font-semibold text-gray-700">Nombres y Apellidos</th>
                                        <th className="px-4 py-2 border-2 border-gray-200 bg-gray-100 text-sm font-semibold text-gray-700">L</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="px-4 py-2 border-2 border-gray-200 text-sm text-gray-700">10078459687</td>
                                        <td className="px-4 py-2 border-2 border-gray-200 text-sm text-gray-700">Michael Felipe Laiton Chaparro</td>
                                        <td className="px-4 py-2 border-2 border-gray-200 text-sm text-green-600 font-semibold">✓</td>
                                        <td className="cursor-pointer" onClick={() => toggleModal({ email: 'keishlanayedcamargorojas@gmail.com',name: 'Michael Felipe Laiton Chaparro', date: '2024-08-16' })}>
                                           
                                        </td>
                                    </tr>

                                    <tr>
                                        <td className="px-4 py-2 border-2 border-gray-200 text-sm text-gray-700">10078459687</td>
                                        <td className="px-4 py-2 border-2 border-gray-200 text-sm text-gray-700">Michael Felipe Laiton Chaparro</td>
                                        <td className="px-4 py-2 border-2 border-gray-200 text-sm text-red-600 font-semibold">X</td>
                                        <td className="cursor-pointer" onClick={() => toggleModal({ email: 'keishlanayedcamargorojas@gmail.com',name: 'Michael Felipe Laiton Chaparro', date: '2024-08-16' })}>
                                            <ImMail4 className="w-6 h-6 ml-2" />
                                        </td>
                                    </tr>
                                    {/* Agrega más filas según sea necesario */}
                                </tbody>
                            </table>
                            <div className="flex justify-end mr-12">
                                <button type="button" className="text-white font-inter font-normal h-11 w-44 rounded-lg text-sm px-5 my-6 ml-80 bg-custom-blue dark:hover:bg-custom-blue dark:focus:ring-custom-blue flex items-center">
                                    Guardar Asistencia
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <ToastContainer />
            </div>
        </div>
    );
}
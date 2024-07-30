"use client"

import React, { useState } from "react";
import { Header } from "@/app/components/header";
import { Sidebar } from "@/app/components/sidebar";
import { PiStudentFill } from "react-icons/pi";
import { ImMail4 } from "react-icons/im";
import ModalCorreo from "@/app/components/Modals/modalCorreo";
import axios from 'axios';

export default function AprendicesList() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);

    const toggleModal = (student) => {
        setSelectedStudent(student);
        setIsModalOpen(!isModalOpen);
    };

    const handleSendEmail = async () => {
        try {
            const response = await axios.post('/api/send-email', {
                studentName: selectedStudent.name,
                date: selectedStudent.date
            });
            if (response.status === 200) {
                alert("Correo enviado con éxito");
            } else {
                alert("Hubo un error al enviar el correo");
            }
        } catch (error) {
            console.error("Error al enviar el correo:", error);
            alert("Hubo un error al enviar el correo");
        }
        setIsModalOpen(false);
    };


    return(

        <div className="min-h-screen grid grid-cols-1 xl:grid-cols-6">
        <Sidebar />
        <div className="xl:col-span-5">
          <Header />
        <div className="h-[90vh] overflow-y-scroll p-12 inline-block w-full relative bg-neutral-100 space-y-5 ">
          <h1 className="font-serif text-4xl pb-3 border-b-2 border-black w-80">Lista de Asistencia</h1>
            <div className="flex px-9 space-x-24">

            <div className=" flex w-96 h-48 rounded-lg overflow-hidden shadow-lg bg-white border-2 border-gray-300 relative mb-4 p-4 ">
                  <div className="z-50 justify-end space-y-3">
                  <PiStudentFill className="w-9 h-9 text-stone-600 ml-6"/><br/>

                  <div>
                    <span className="text-5xl font-semibold font-kiwi-marumaru ml-6">25</span><br/><br/>
                    <span className="font-serif text-lg font-normal ">Aprendices de la ficha</span>
                  </div>
                </div>
              </div>

              <div className=" flex w-96 h-48 rounded-lg overflow-hidden shadow-lg bg-white border-2 border-gray-300 relative mb-4 p-4 ">
                  <div className="z-50 justify-end space-y-3">
                  <PiStudentFill className="w-9 h-9 text-stone-600 ml-6"/><br/>

                  <div>
                    <span className="text-5xl font-semibold font-kiwi-marumaru ml-6">20</span><br/><br/>
                    <span className="font-serif text-lg font-normal ">Aprendices en clase</span>
                  </div>
                </div>
              </div>

              <div className=" flex w-96 h-48 rounded-lg overflow-hidden shadow-lg bg-white border-2 border-gray-300 relative mb-4 p-4 ">
                  <div className="z-50 justify-end space-y-3">
                  <PiStudentFill className="w-9 h-9 text-stone-600 ml-6"/><br/>

                  <div>
                    <span className="text-5xl font-semibold font-kiwi-marumaru ml-6">5</span><br/><br/>
                    <span className="font-serif text-lg font-normal ">Aprendices que fallaron</span>
                  </div>
                </div>
              </div>
              <ModalCorreo isOpen={isModalOpen} onClose={toggleModal} />
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
                                    
                                </tr>
                                <tr>
                                    <td className="px-4 py-2 border-2 border-gray-200 text-sm text-gray-700">10078459687</td>
                                    <td className="px-4 py-2 border-2 border-gray-200 text-sm text-gray-700">Michael Felipe Laiton Chaparro</td>
                                    <td className="px-4 py-2 border-2 border-gray-200 text-sm text-green-600 font-semibold">✓</td>
                                </tr>

                                <tr>
                                <td className="px-4 py-2 border-2 border-gray-200 text-sm text-gray-700"> 10078459687 </td>
                                <td className="px-4 py-2 border-2 border-gray-200 text-sm text-gray-700"> Michael Felipe Laiton Chaparro </td>
                                <td className="px-4 py-2 border-2 border-gray-200 text-sm text-red-600 font-semibold"> X </td>
                                <td className="cursor-pointer" onClick={toggleModal}>
                                  <ImMail4 className="w-6 h-6 ml-2" />
                                </td>
                              </tr>

                                <tr>
                                    <td className="px-4 py-2 border-2 border-gray-200 text-sm text-gray-700">10078459687</td>
                                    <td className="px-4 py-2 border-2 border-gray-200 text-sm text-gray-700">Michael Felipe Laiton Chaparro</td>
                                    <td className="px-4 py-2 border-2 border-gray-200 text-sm text-green-600 font-semibold">✓</td>
                                </tr>
                                </tbody>
                        </table>
                        <div className="flex justify-end mr-12">
                        <button type="button" className="text-white font-serif h-11 w-44 rounded-lg text-sm px-5 my-6 ml-80 bg-custom-blue dark:hover:bg-custom-blue dark:focus:ring-custom-blue flex items-center"
                            >
                            Guardar Asistencia
                        </button>
                        </div>
                    </div>
                </div>
        </div>
        </div>
        </div>
    
    );
}
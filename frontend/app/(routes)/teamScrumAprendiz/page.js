"use client";

import React from "react";
import { Header } from "../../components/header"; 
import { Sidebaraprendiz } from "../../components/SidebarAprendiz";
import Image from 'next/image';
import aquiles from "../../../public/img/aquiles.jpg"; // imagen de aquiles
import { IoPersonCircleSharp } from "react-icons/io5";
import { IoCameraSharp } from 'react-icons/io5';
import Slider from 'react-slick'; // Importa el componente Slider

export default function TeamScrum() {
    const settings = {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        adaptiveHeight: true,
    };

    return (
        <div className="min-h-screen grid grid-cols-1 xl:grid-cols-6">
            <Sidebaraprendiz />
            <div className="xl:col-span-5">
                <Header />
                <div className="h-[91vh] p-4 md:p-8 lg:p-12 w-full bg-neutral-100 space-y-5">
                    {/* Título principal */}
                    <h1 className="text-[#0e324d] text-2xl sm:text-3xl lg:text-4xl pb-3 border-b-2 border-gray-400 w-full sm:w-3/4 lg:w-1/2 mb-4 font-inter font-semibold">
                        Team Scrum
                    </h1>

                    {/* Grid principal: Información del equipo */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {/* Tarjeta del equipo */}
                        <div className="flex flex-col items-center bg-white p-6 rounded-lg shadow-lg space-y-4 border border-gray-200">
                            {/* Foto del equipo */}
                            <div className="relative">
                                <Image src={aquiles} alt="Aquiles Team" width={120} height={120} className="rounded-full" />
                                <button className="absolute bottom-0 right-0 bg-[#0e324d] text-white rounded-full p-2 hover:bg-[#40b003] transition-colors duration-300">
                                    <IoCameraSharp className="text-lg" />
                                </button> 
                            </div>
                            {/* Nombre y edición del equipo */}
                            <div className="w-full flex flex-col items-center space-y-2">
                                <label className="text-[#40b003] text-lg font-bold">Nombre del equipo:</label>
                                <input 
                                    type="text" 
                                    value="Aquiles Team" 
                                    className="border border-gray-300 rounded-lg p-2 w-full text-center focus:outline-none focus:ring-2 focus:ring-[#0e324d]" 
                                />
                            </div>
                        </div>

                        {/* Información del equipo */}
                        <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
                            <h2 className="text-xl font-bold text-[#0e324d] mb-4">Detalles del Equipo</h2>
                            <div className="space-y-4">
                                <div className="flex items-center">
                                    <span className="text-[#0e324d] font-semibold mr-2">Número del Team:</span>
                                    <p className="text-gray-700">Team 6</p>
                                </div>
                                <div className="flex items-center">
                                    <span className="text-[#0e324d] font-semibold mr-2">Ficha:</span>
                                    <p className="text-gray-700">2723687</p>
                                </div>
                                <div className="flex items-center">
                                    <span className="text-[#0e324d] font-semibold mr-2">Trimestre:</span>
                                    <p className="text-gray-700">Trimestre 5</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sección principal de aprendices y proyecto */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
                        {/* Sección de aprendices */}
                        <div>
                            <h3 className="text-[#0e324d] text-2xl font-semibold mb-4 text-center">Aprendices del Team Scrum:</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-2 gap-4">
                                {/* Tarjetas de aprendices individuales */}
                                <div className="bg-white p-4 rounded-lg shadow-md border hover:bg-[#0e324d] hover:border-green-700 transition-colors duration-300 group">
                                    <p className="text-green-600 text-lg font-bold mb-4 text-left group-hover:text-white">Aprendiz</p>
                                    <p className="text-gray-700 text-md font-semibold text-center mb-4 group-hover:text-white">Angie Carolina Gutiérrez Ramírez</p>
                                    <button className="mt-auto bg-[#0e324d] text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 w-full border-1 border-[#40b003] group-hover:bg-[#40b003] group-hover:text-white transition-colors duration-700">
                                        <span>Ver Más Información</span>
                                        <IoPersonCircleSharp className="text-xl" />
                                    </button>
                                </div>
                                <div className="bg-white p-4 rounded-lg shadow-md border hover:bg-[#0e324d] hover:border-green-700 transition-colors duration-300 group">
                                    <p className="text-green-600 text-lg font-bold mb-4 text-left group-hover:text-white">Aprendiz</p>
                                    <p className="text-gray-700 text-md font-semibold text-center mb-4 group-hover:text-white">Juan Carlos López García</p>
                                    <button className="mt-auto bg-[#0e324d] text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 w-full border-1 border-[#40b003] group-hover:bg-[#40b003] group-hover:text-white transition-colors duration-700">
                                        <span>Ver Más Información</span>
                                        <IoPersonCircleSharp className="text-xl" />
                                    </button>
                                </div>
                                <div className="bg-white p-4 rounded-lg shadow-md border hover:bg-[#0e324d] hover:border-green-700 transition-colors duration-300 group">
                                    <p className="text-green-600 text-lg font-bold mb-4 text-left group-hover:text-white">Aprendiz</p>
                                    <p className="text-gray-700 text-md font-semibold text-center mb-4 group-hover:text-white">Santiago Gómez Rodríguez</p>
                                    <button className="mt-auto bg-[#0e324d] text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 w-full border-1 border-[#40b003] group-hover:bg-[#40b003] group-hover:text-white transition-colors duration-700">
                                        <span>Ver Más Información</span>
                                        <IoPersonCircleSharp className="text-xl" />
                                    </button>
                                </div>
                                <div className="bg-white p-4 rounded-lg shadow-md border hover:bg-[#0e324d] hover:border-green-700 transition-colors duration-300 group">
                                    <p className="text-green-600 text-lg font-bold mb-4 text-left group-hover:text-white">Aprendiz</p>
                                    <p className="text-gray-700 text-md font-semibold text-center mb-4 group-hover:text-white">María González Yepes</p>
                                    <button className="mt-auto bg-[#0e324d] text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 w-full border-1 border-[#40b003] group-hover:bg-[#40b003] group-hover:text-white transition-colors duration-700">
                                        <span>Ver Más Información</span>
                                        <IoPersonCircleSharp className="text-xl" />
                                    </button>
                                </div>
                            </div>
                        </div>

                                                  {/* Sección de información del proyecto */}
                                                  <div>
                              <h3 className="text-[#0e324d] text-2xl font-semibold mb-5 text-center">Información del Proyecto:</h3>
                              <Slider {...settings}>
                                  <div className="bg-white p-12 rounded-lg shadow-md">
                                      <label className="block text-gray-700">Problematica:</label>
                                      <textarea
                                          className="w-full border border-green-500 rounded-lg p-2 mt-1 h-32 resize-none"
                                          placeholder="Cual es la Problematica de su Proyecto"
                                          style={{ overflow: "hidden" }} // Para evitar el desplazamiento
                                          rows={4} // Establecer el número de filas por defecto
                                      ></textarea>
                                  </div>
                                  <div className="bg-white p-12 rounded-lg shadow-md">
                                      <label className="block text-gray-700">Objetivo:</label>
                                      <textarea
                                          className="w-full border border-green-500 rounded-lg p-2 mt-1 h-32 resize-none"
                                          placeholder="Cual es el objetivo de su Proyecto"
                                          style={{ overflow: "hidden" }} // Para evitar el desplazamiento
                                          rows={4} // Establecer el número de filas por defecto
                                      ></textarea>
                                  </div>
                                  <div className="bg-white p-12 rounded-lg shadow-md">
                                      <label className="block text-gray-700">Descripción:</label>
                                      <textarea
                                          className="w-full border border-green-500 rounded-lg p-2 mt-1 h-32 resize-none"
                                          placeholder="Describa el Proyecto"
                                          style={{ overflow: "hidden" }} // Para evitar el desplazamiento
                                          rows={4} // Establecer el número de filas por defecto
                                      ></textarea>
                                  </div>
                                  <div className="bg-white p-12 rounded-lg shadow-md">
                                      <label className="block text-gray-700">Justificación:</label>
                                      <textarea
                                          className="w-full border border-green-500 rounded-lg p-2 mt-1 h-32 resize-none"
                                          placeholder="Describa el Proyecto"
                                          style={{ overflow: "hidden" }} // Para evitar el desplazamiento
                                          rows={4} // Establecer el número de filas por defecto
                                      ></textarea>
                                  </div>
                              </Slider>
                          </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

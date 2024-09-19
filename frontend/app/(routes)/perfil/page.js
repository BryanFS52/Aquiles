import React from "react";
import { Header } from "../../components/header";
import { Sidebar } from "../../components/sidebar";

export default function Perfil() {
    return (
        <div className="min-h-screen grid grid-cols-1 xl:grid-cols-6">
            <Sidebar />
            <div className="xl:col-span-5">
                <Header />

                <div className="h-[700px] overflow-y-scroll p-4 sm:p-6 md:p-8 lg:p-12 mt-6 sm:mt-8 md:mt-10 lg:mt-12">
                    <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl pb-3 border-b-2 border-red-100 w-full sm:w-3/4 md:w-1/2">
                        Perfil del Aprendiz
                    </h1>

                    <div className="inline-block w-full sm:w-4/6 md:w-3/4 lg:w-4/6 relative border border-gray-400 rounded-lg p-4 sm:p-6 md:p-8 mx-4 sm:mx-8 md:mx-12 lg:mx-36">
                        <div className="flex flex-col sm:flex-row items-start">
                            <div className="mb-4 sm:mb-0 sm:mr-8">
                                <img
                                    src="https://img.freepik.com/foto-gratis/joven-bella-mujer-pie-sobre-pared-blanca_114579-90514.jpg"
                                    className="w-40 h-40 sm:w-60 sm:h-60 object-cover rounded-full"
                                />
                            </div>

                            <div className="w-full sm:w-2/3 md:w-2/5">
                                <h5 className="mb-2 text-sm font-bold tracking-tight dark:text-black">
                                    Datos Personales
                                </h5>

                                <div className="pb-4">
                                    <label className="text-sm text-black-700 block">Nombres:</label>
                                    <input
                                        type="text"
                                        placeholder="Nombre del Aprendiz"
                                        className="rounded-full border-solid border-2 text-custom-blue w-full sm:w-96 py-1 px-3 bg-gray-100"
                                    />
                                </div>

                                <div className="pb-4">
                                    <label className="text-sm text-black-700 block">Apellidos:</label>
                                    <input
                                        type="text"
                                        placeholder="Apellidos del Aprendiz"
                                        className="rounded-full border-solid border-2 text-custom-blue w-full sm:w-96 py-1 px-3 bg-gray-100"
                                    />
                                </div>

                                <div className="pb-4">
                                    <label className="text-sm text-black-700 block">Correo:</label>
                                    <input
                                        type="text"
                                        placeholder="Correo del Aprendiz"
                                        className="rounded-full border-solid border-2 text-custom-blue w-full sm:w-96 py-1 px-3 bg-gray-100"
                                    />
                                </div>

                                <h5 className="mb-2 text-sm font-bold tracking-tight dark:text-black">
                                    Proyecto Formativo
                                </h5>

                                <div className="pb-4">
                                    <label className="text-sm text-black-700 block">Pertenece a:</label>
                                    <input
                                        type="text"
                                        placeholder="Nombre del Centro"
                                        className="rounded-full border-solid border-2 text-custom-blue w-full sm:w-96 py-1 px-3 bg-gray-100"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="mt-4">
                            <button className="hover:bg-gray-500 rounded-lg transition-colors bg-custom-blue px-4 py-2 border text-white">
                                Actualizar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

import React from "react";
import { Header } from "@/app/components/header"; //importaciones de los componentes header y sidebar para no tener que volver a crearlos
import { Sidebar } from "@/app/components/sidebar";

export default function Perfil() {
    return (
        <div className="min-h-screen grid grid-cols-1 xl:grid-cols-6">
            <Sidebar />
            <div className="xl:col-span-5">
                <Header />

                <div className="h-[700px] overflow-y-scroll p-12">
                    <h1 className="font-serif text-4xl pb-3 border-b-2 border-red-100 w-1/2">Perfil del Aprendiz</h1><br/><br/><br/>

                    <div className="inline-block w-4/6 relative border border-gray-400 rounded-lg p-8 mx-36">
                        <div className="flex items-start">
                            <div className="mr-8 mt-4">
                                <img src="https://img.freepik.com/foto-gratis/joven-bella-mujer-pie-sobre-pared-blanca_114579-90514.jpg" className="w-60 h-60 object-cover rounded-full mb-4" />
                            </div>

                            {/* Contenedor del formulario */}
                            <div className="w-2/5 ml-36">
                                <h5 className="mb-2 text-sm font-bold tracking-tight dark:text-black">Datos Personales</h5>

                                <div className='pb-4'>
                                    <label className="text-sm text-black-700 block">Nombres:</label>
                                    <input type="text" placeholder="Nombre del Aprendiz" className="rounded-full border-solid border-2 text-custom-blue w-96 py-1 px-3 bg-gray-100" />
                                </div>

                                <div className='pb-4'>
                                    <label className="text-sm text-black-700 block">Apellidos:</label>
                                    <input type="text" placeholder="Apellidos del Aprendiz" className="rounded-full border-solid border-2 text-custom-blue w-96 py-1 px-3 bg-gray-100" />
                                </div>

                                <div className='pb-4'>
                                    <label className="text-sm text-black-700 block">Correo:</label>
                                    <input type="text" placeholder="Correo del Aprendiz" className="rounded-full border-solid border-2 text-custom-blue w-96 py-1 px-3 bg-gray-100" />
                                </div>

                                <h5 className="mb-2 text-sm font-bold tracking-tight dark:text-black">Proyecto Formativo</h5>

                                <div className='pb-4'>
                                    <label className="text-sm text-black-700 block">Pertenece a:</label>
                                    <input type="text" placeholder="Nombre del Centro" className="rounded-full border-solid border-2 text-custom-blue w-96 py-1 px-3 bg-gray-100" />
                                </div>
                            </div>
                        </div>
                        <div className="mt-4">
                            <button className="hover:bg-gray-500 rounded-lg transition-colors bg-custom-blue px-4 py-1 border text-white">
                                Actualizar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

"use client";

import Image from 'next/image';
import { IoPersonCircleSharp } from "react-icons/io5";
import { IoCameraSharp, IoCalendar } from 'react-icons/io5';
import Slider from 'react-slick';
import { FaArrowLeft, FaArrowRight, FaHashtag } from 'react-icons/fa';


const CustomNextArrow = ({ onClick }) => {
    return (
        <div
            className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-[#0e324d] hover:bg-[#40b003] transition-colors duration-300    text-white p-2 rounded-full cursor-pointer z-10"
            onClick={onClick}
        >
            <FaArrowRight className="text-xl" />
        </div>
    );
};

const CustomPrevArrow = ({ onClick }) => {
    return (
        <div
            className="absolute top-1/2 left-1 transform -translate-y-1/2 bg-[#0e324d] hover:bg-[#40b003] transition-colors duration-300 text-white p-2 rounded-full cursor-pointer z-10"
            onClick={onClick}
        >
            <FaArrowLeft className="text-xl" />
        </div>
    );
};

export default function TeamScrum() {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        adaptiveHeight: true,
        nextArrow: <CustomNextArrow />,
        prevArrow: <CustomPrevArrow />,
    };

    return (
        <>
            <h1 className="text-3xl md:text-4xl font-bold text-darkBlue dark:text-lightGreen hover:text-darkGreen dark:hover:text-white transition-colors duration-300 mb-6">
                Mi Team Scrum
            </h1>

            {/* Grid principal: Información del equipo */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Tarjeta del equipo */}
                <div className="flex flex-col items-center bg-white/90 dark:bg-darkBlue/80 p-6 rounded-xl shadow-lg space-y-4 border border-darkGreen/10 dark:border-shadowBlue/40">
                    {/* Foto del equipo */}
                    <div className="relative">
                        <Image src="/img/LogoAquiles.png" alt="Logo" width={100} height={100} className="rounded-full bg-lightGreen/20 dark:bg-shadowBlue/30 border-2 border-darkGreen/20 dark:border-lightGreen/30" />
                        <button className="absolute bottom-0 right-0 bg-darkBlue dark:bg-lightGreen text-white dark:text-darkBlue rounded-full p-2 hover:bg-darkGreen dark:hover:bg-shadowBlue hover:text-white transition-colors duration-300 border-2 border-white/80 dark:border-darkBlue/40">
                            <IoCameraSharp className="text-lg" />
                        </button>
                    </div>
                    {/* Nombre y edición del equipo */}
                    <div className="w-full flex flex-col items-center space-y-2">
                        <label className="text-darkGreen dark:text-lightGreen text-lg font-bold">Nombre del equipo:</label>
                        <input
                            onChange={() => { }}
                            type="text"
                            value="Aquiles Team"
                            className="border border-darkGreen/30 dark:border-lightGreen/30 rounded-lg p-2 w-full text-center focus:outline-none focus:ring-2 focus:ring-darkGreen/60 dark:focus:ring-lightGreen/60 bg-white/80 dark:bg-darkBlue/60 text-darkBlue dark:text-white font-semibold"
                        />
                    </div>
                </div>

                {/* Información del equipo */}
                <div className="bg-gradient-to-br from-white/90 to-lightGreen/10 dark:from-darkBlue/80 dark:to-shadowBlue/40 p-6 rounded-xl shadow-xl border border-darkGreen/10 dark:border-shadowBlue/40">
                    <h2 className="text-2xl font-extrabold text-darkBlue dark:text-lightGreen mb-6 tracking-tight">Detalles del Equipo</h2>
                    <div className="space-y-4 text-lg">
                        <div className="flex items-center space-x-3">
                            <FaHashtag className="inline-block text-darkGreen dark:text-lightGreen text-2xl" />
                            <span className="flex text-darkBlue dark:text-white font-semibold">
                                Número del Team:
                            </span>
                            <p className="text-gray-800 dark:text-gray-200 font-normal">Team 6</p>
                        </div>
                        <div className="flex items-center space-x-3">
                            <IoPersonCircleSharp className="inline-block text-darkGreen dark:text-lightGreen text-2xl" />
                            <span className="flex text-darkBlue dark:text-white font-semibold">
                                Ficha:
                            </span>
                            <p className="text-gray-800 dark:text-gray-200 font-normal">2723687</p>
                        </div>
                        <div className="flex items-center space-x-3">
                            <IoCalendar className="inline-block text-darkGreen dark:text-lightGreen text-2xl " />
                            <span className="flex text-darkBlue dark:text-white font-semibold ">
                                Trimestre:
                            </span>
                            <p className="text-gray-800 dark:text-gray-200 font-normal">Trimestre 5</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sección principal de aprendices y proyecto */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                {/* Sección de aprendices */}
                <div>
                    <h3 className="text-darkBlue dark:text-lightGreen text-2xl font-semibold mb-4 text-center">Aprendices del Team Scrum:</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Tarjetas de aprendices individuales */}
                        {["Angie Carolina Gutiérrez Ramírez", "Juan Carlos López García", "Santiago Gómez Rodríguez", "María González Yepes"].map((nombre, idx) => (
                            <div key={idx} className="bg-white/90 dark:bg-darkBlue/80 p-4 rounded-lg shadow-md border border-darkGreen/10 dark:border-shadowBlue/40 hover:bg-darkGreen/90 dark:hover:bg-shadowBlue/80 hover:border-lightGreen dark:hover:border-lightGreen transition-colors duration-300 group flex flex-col h-full">
                                <p className="text-darkGreen dark:text-lightGreen text-lg font-bold mb-4 text-left group-hover:text-white">Aprendiz</p>
                                <p className="text-darkBlue dark:text-white text-md font-semibold text-center mb-4 group-hover:text-white">{nombre}</p>
                                <button className="mt-auto bg-darkBlue dark:bg-lightGreen text-white dark:text-darkBlue px-4 py-2 rounded-lg flex items-center justify-center space-x-2 w-full border border-darkGreen/30 dark:border-lightGreen/30 group-hover:bg-lightGreen group-hover:text-darkBlue dark:group-hover:bg-darkGreen dark:group-hover:text-white transition-colors duration-700">
                                    <span>Ver Más Información</span>
                                    <IoPersonCircleSharp className="text-xl" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Sección de información del proyecto */}
                <div>
                    <h3 className="text-darkBlue dark:text-lightGreen text-2xl font-semibold mb-5 text-center">Información del Proyecto:</h3>
                    <Slider {...settings}>
                        <div className="bg-white/90 dark:bg-darkBlue/80 p-8 rounded-lg shadow-md border border-darkGreen/10 dark:border-shadowBlue/40">
                            <label className="block text-darkBlue dark:text-lightGreen">Problematica:</label>
                            <textarea
                                className="w-full border border-darkGreen/30 dark:border-lightGreen/30 rounded-lg p-2 mt-1 h-32 resize-none bg-white/80 dark:bg-darkBlue/60 text-darkBlue dark:text-white font-semibold"
                                placeholder="¿Cuál es la problemática de su Proyecto?"
                                style={{ overflow: "hidden" }}
                                rows={4}
                            ></textarea>
                        </div>
                        <div className="bg-white/90 dark:bg-darkBlue/80 p-8 rounded-lg shadow-md border border-darkGreen/10 dark:border-shadowBlue/40">
                            <label className="block text-darkBlue dark:text-lightGreen">Objetivo:</label>
                            <textarea
                                className="w-full border border-darkGreen/30 dark:border-lightGreen/30 rounded-lg p-2 mt-1 h-32 resize-none bg-white/80 dark:bg-darkBlue/60 text-darkBlue dark:text-white font-semibold"
                                placeholder="¿Cuál es el objetivo de su Proyecto?"
                                style={{ overflow: "hidden" }}
                                rows={4}
                            ></textarea>
                        </div>
                        <div className="bg-white/90 dark:bg-darkBlue/80 p-8 rounded-lg shadow-md border border-darkGreen/10 dark:border-shadowBlue/40">
                            <label className="block text-darkBlue dark:text-lightGreen">Descripción:</label>
                            <textarea
                                className="w-full border border-darkGreen/30 dark:border-lightGreen/30 rounded-lg p-2 mt-1 h-32 resize-none bg-white/80 dark:bg-darkBlue/60 text-darkBlue dark:text-white font-semibold"
                                placeholder="Describa el Proyecto"
                                style={{ overflow: "hidden" }}
                                rows={4}
                            ></textarea>
                        </div>
                        <div className="bg-white/90 dark:bg-darkBlue/80 p-8 rounded-lg shadow-md border border-darkGreen/10 dark:border-shadowBlue/40">
                            <label className="block text-darkBlue dark:text-lightGreen">Justificación:</label>
                            <textarea
                                className="w-full border border-darkGreen/30 dark:border-lightGreen/30 rounded-lg p-2 mt-1 h-32 resize-none bg-white/80 dark:bg-darkBlue/60 text-darkBlue dark:text-white font-semibold"
                                placeholder="Justifique el Proyecto"
                                style={{ overflow: "hidden" }}
                                rows={4}
                            ></textarea>
                        </div>
                    </Slider>
                </div>
            </div>
        </>
    );
}
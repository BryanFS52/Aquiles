"use client";

import Image from "next/image";
import { IoPersonCircleSharp, IoCameraSharp, IoCalendar } from "react-icons/io5";
import { FaArrowLeft, FaArrowRight, FaHashtag, FaUsers, FaProjectDiagram } from "react-icons/fa";
import Slider, { Settings } from "react-slick";
import PageTitle from "@components/UI/pageTitle";

interface ArrowProps {
    onClick?: () => void;
}

const CustomNextArrow: React.FC<ArrowProps> = ({ onClick }) => (
    <div
        className="absolute top-1/2 right-2 -translate-y-1/2 bg-primary/90 hover:bg-primary-light dark:bg-secondary/90 dark:hover:bg-darkBlue transition-all duration-300 text-white p-2 rounded-full cursor-pointer z-20 shadow-lg hover:scale-110"
        onClick={onClick}
    >
        <FaArrowRight className="text-sm" />
    </div>
);

const CustomPrevArrow: React.FC<ArrowProps> = ({ onClick }) => (
    <div
        className="absolute top-1/2 left-2 -translate-y-1/2 bg-primary/90 hover:bg-primary-light dark:bg-secondary/90 dark:hover:bg-darkBlue transition-all duration-300 text-white p-2 rounded-full cursor-pointer z-20 shadow-lg hover:scale-110"
        onClick={onClick}
    >
        <FaArrowLeft className="text-sm" />
    </div>
);

export default function TeamScrum() {
    const settings: Settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        adaptiveHeight: true,
        nextArrow: <CustomNextArrow />,
        prevArrow: <CustomPrevArrow />,
    };

    const teamMembers = [
        "Angie Carolina Gutiérrez Ramírez",
        "Juan Carlos López García",
        "Santiago Gómez Rodríguez",
        "María González Yepes",
    ];

    const projectSections = [
        { label: "Problemática", placeholder: "¿Cuál es la problemática de su Proyecto?" },
        { label: "Objetivo", placeholder: "¿Cuál es el objetivo de su Proyecto?" },
        { label: "Descripción", placeholder: "Describa el Proyecto" },
        { label: "Justificación", placeholder: "Justifique el Proyecto" },
    ];

    return (
        <div className="w-full">
            <PageTitle>Mi Team Scrum</PageTitle>

            {/* Encabezado del equipo */}
            <div className="bg-white dark:bg-shadowBlue rounded-2xl p-4 mx-4 mb-8 shadow-xl border border-lightGray dark:border-darkGray">
                <div className="flex flex-col lg:flex-row items-center gap-8">
                    <div className="relative group">
                        <div className="relative w-[120px] h-[120px] rounded-full border-4 border-lightGray dark:border-darkGray bg-lightGray/30 dark:bg-darkBlue/30 backdrop-blur-sm transition-transform group-hover:scale-105 overflow-hidden">
                            {/* Logo para modo claro (negro) */}
                            <div className="dark:hidden">
                                <Image
                                    src="/img/LogoAquilesWhite.png"
                                    alt="Logo Aquiles Team"
                                    fill
                                    style={{ objectFit: "contain", filter: "invert(1)" }}
                                    sizes="120px"
                                />
                            </div>
                            {/* Logo para modo oscuro (blanco) */}
                            <div className="hidden dark:block">
                                <Image
                                    src="/img/LogoAquilesWhite.png"
                                    alt="Logo Aquiles Team"
                                    fill
                                    style={{ objectFit: "contain" }}
                                    sizes="120px"
                                />
                            </div>
                        </div>
                        <button className="absolute -bottom-2 -right-2 bg-secondary hover:bg-darkBlue dark:bg-primary dark:hover:bg-primary-light text-white rounded-full p-3 transition-all duration-300 shadow-lg hover:scale-110">
                            <IoCameraSharp className="text-lg" />
                        </button>
                    </div>

                    <div className="flex-1 text-center lg:text-left">
                        <input
                            type="text"
                            value="Aquiles Team"
                            className="bg-lightGray/50 dark:bg-darkBlue/50 border border-lightGray dark:border-darkGray rounded-xl p-3 text-2xl font-bold text-black dark:text-white placeholder-grayText w-full lg:w-auto focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-secondary transition-colors"
                            onChange={() => { }}
                        />
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                            <div className="flex items-center justify-center gap-2 bg-lightGray/50 dark:bg-darkBlue/50 rounded-lg p-3 border border-lightGray dark:border-darkGray">
                                <FaHashtag className="text-primary dark:text-secondary" />
                                <span className="font-medium text-black dark:text-white">Team 6</span>
                            </div>
                            <div className="flex items-center justify-center gap-2 bg-lightGray/50 dark:bg-darkBlue/50 rounded-lg p-3 border border-lightGray dark:border-darkGray">
                                <IoPersonCircleSharp className="text-primary dark:text-secondary" />
                                <span className="font-medium text-black dark:text-white">2723687</span>
                            </div>
                            <div className="flex items-center justify-center gap-2 bg-lightGray/50 dark:bg-darkBlue/50 rounded-lg p-3 border border-lightGray dark:border-darkGray">
                                <IoCalendar className="text-primary dark:text-secondary" />
                                <span className="font-medium text-black dark:text-white">Trimestre 5</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Contenido principal */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 px-4">
                {/* Sección de aprendices */}
                <div className="bg-white dark:bg-shadowBlue rounded-2xl p-6 shadow-xl">
                    <div className="flex items-center gap-3 mb-6">
                        <FaUsers className="text-primary dark:text-secondary text-2xl" />
                        <h3 className="text-2xl font-bold text-black dark:text-secondary">
                            Aprendices del Team
                        </h3>
                    </div>

                    <div className="space-y-4">
                        {teamMembers.map((nombre, idx) => (
                            <div
                                key={idx}
                                className="group bg-lightGray/50 dark:bg-darkBlue/50 rounded-xl p-4 hover:bg-primary/85 hover:text-white dark:hover:bg-secondary/85 transition-all duration-300 cursor-pointer shadow-md hover:shadow-lg hover:scale-[1.02]"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-grayText group-hover:text-white/80 mb-1">
                                            Aprendiz
                                        </p>
                                        <p className="font-semibold text-black dark:text-white group-hover:text-white">
                                            {nombre}
                                        </p>
                                    </div>
                                    <IoPersonCircleSharp className="text-2xl text-primary dark:text-secondary group-hover:text-white" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Sección del proyecto */}
                <div className="bg-white dark:bg-shadowBlue rounded-2xl p-6 shadow-xl">
                    <div className="flex items-center gap-3 mb-6">
                        <FaProjectDiagram className="text-primary dark:text-secondary text-2xl" />
                        <h3 className="text-2xl font-bold text-black dark:text-secondary">
                            Información del Proyecto
                        </h3>
                    </div>

                    <div className="slider-container relative">
                        <Slider {...settings}>
                            {projectSections.map((item, idx) => (
                                <div key={idx} className="px-4"
                                >
                                    <div className="bg-gradient-to-br from-lightGray/30 to-primary/5 dark:from-darkBlue/30 dark:to-secondary/10 rounded-xl p-6 border border-primary/10 dark:border-secondary/10">
                                        <label className="block text-lg font-semibold text-black dark:text-secondary mb-3">
                                            {item.label}:
                                        </label>
                                        <textarea
                                            className="w-full border-2 border-lightGray dark:border-darkBlue rounded-xl p-4 h-32 resize-none bg-white/80 dark:bg-darkBlue/80 text-secondary dark:text-white focus:outline-none focus:border-primary dark:focus:border-secondary transition-colors"
                                            placeholder={item.placeholder}
                                            rows={4}
                                        />
                                    </div>
                                </div>
                            ))}
                        </Slider>
                    </div>
                </div>
            </div>
        </div>
    );
}